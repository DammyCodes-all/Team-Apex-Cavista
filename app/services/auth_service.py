from typing import Optional, Dict, Any
import secrets
import uuid
from datetime import datetime, timedelta
from bson import ObjectId
from app.utils.security import verify_password, get_password_hash
from app.utils.jwt import create_access_token
from app.utils.tokens import generate_refresh_token, hash_token
from app.config import settings as cfg
from app.services.health_profile_service import create_health_profile
from app.services import simulation_service


async def signup_user(db, email: str, password: str, name: str) -> Dict[str, Any]:
    existing = await db.users.find_one({"email": email})
    if existing:
        raise ValueError("Email already registered")
    hashed = get_password_hash(password)
    user = {"email": email, "password": hashed, "name": name, "created_at": datetime.utcnow()}
    # generate unique uuid for new user_id (used across collections)
    user_id = str(uuid.uuid4())
    user["user_id"] = user_id
    result = await db.users.insert_one(user)
    # still store Mongo _id but link documents with the uuid
    
    # Auto-create health profile for baseline learning (demo mode enabled)
    await create_health_profile(db, user_id)
    # kick off background simulation for demo users
    try:
        import asyncio
        asyncio.create_task(simulation_service.start_simulation(db, user_id))
    except Exception:
        pass
    
    access = create_access_token({"sub": user_id})
    refresh = generate_refresh_token()
    hashed_refresh = hash_token(refresh)
    # store hashed refresh token with device=None for now
    await db.refresh_tokens.insert_one({"user_id": user_id, "token_hash": hashed_refresh, "created_at": datetime.utcnow(), "revoked": False, "device_id": None})
    return {"access_token": access, "refresh_token": refresh}


async def authenticate_user(db, email: str, password: str) -> Optional[Dict[str, Any]]:
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        return None
    # prefer uuid if present
    user_id = user.get("user_id") or str(user.get("_id"))
    access = create_access_token({"sub": user_id})
    refresh = generate_refresh_token()
    await db.refresh_tokens.insert_one({"user_id": user_id, "token_hash": hash_token(refresh), "created_at": datetime.utcnow(), "revoked": False, "device_id": None})
    return {"access_token": access, "refresh_token": refresh, "user_id": user_id}


async def store_refresh_token(db, user_id: str, refresh: str, device_id: Optional[str] = None, expires_days: int = 30):
    token_hash = hash_token(refresh)
    expires = datetime.utcnow() + timedelta(days=expires_days)
    await db.refresh_tokens.insert_one({"user_id": user_id, "token_hash": token_hash, "device_id": device_id, "expires_at": expires, "revoked": False, "created_at": datetime.utcnow()})


async def rotate_refresh_token(db, old_refresh: str, user_id: str, device_id: str) -> str:
    old_hash = hash_token(old_refresh)
    # revoke old
    await db.refresh_tokens.update_many({"token_hash": old_hash}, {"$set": {"revoked": True}})
    # create new
    new_refresh = generate_refresh_token()
    await store_refresh_token(db, user_id, new_refresh, device_id)
    return new_refresh


async def revoke_refresh_token(db, refresh: str):
    await db.refresh_tokens.update_many({"token_hash": hash_token(refresh)}, {"$set": {"revoked": True}})


async def generate_device_otp(db, user_id: str, device_id: str, ttl_minutes: int = 15) -> str:
    """Generate a numeric OTP, store its hash with expiry, and return the raw OTP (for testing).

    In production this should be emailed to the user and the raw OTP should not be returned.
    """
    otp = f"{secrets.randbelow(1000000):06d}"
    otp_hash = hash_token(otp)
    expires = datetime.utcnow() + timedelta(minutes=ttl_minutes)
    await db.device_otps.insert_one({"user_id": user_id, "device_id": device_id, "otp_hash": otp_hash, "expires_at": expires, "used": False})
    return otp


async def mark_device_trusted(db, user_id: str, device_id: str, otp: str) -> bool:
    otp_hash = hash_token(otp)
    doc = await db.device_otps.find_one({"user_id": user_id, "device_id": device_id, "otp_hash": otp_hash, "used": False, "expires_at": {"$gte": datetime.utcnow()}})
    if not doc:
        return False
    # mark used
    await db.device_otps.update_one({"_id": doc["_id"]}, {"$set": {"used": True}})
    # mark device trusted
    await db.devices.update_one({"user_id": user_id, "fingerprint": device_id}, {"$set": {"trusted": True, "trusted_at": datetime.utcnow()}}, upsert=True)
    # issue a refresh token for device
    refresh = generate_refresh_token()
    await store_refresh_token(db, user_id, refresh, device_id=device_id)
    return refresh

