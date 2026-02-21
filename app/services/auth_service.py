from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.utils.security import verify_password, get_password_hash
from app.utils.jwt import create_access_token


async def signup_user(db, email: str, password: str, name: str) -> Dict[str, Any]:
    existing = await db.users.find_one({"email": email})
    if existing:
        raise ValueError("Email already registered")
    hashed = get_password_hash(password)
    user = {"email": email, "password": hashed, "name": name, "created_at": datetime.utcnow().isoformat()}
    result = await db.users.insert_one(user)
    user_id = result.inserted_id
    token = create_access_token({"sub": str(user_id)})
    return {"access_token": token, "token_type": "bearer"}


async def authenticate_user(db, email: str, password: str) -> Optional[Dict[str, Any]]:
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        return None
    token = create_access_token({"sub": str(user[("_id")])})
    return {"access_token": token, "token_type": "bearer"}
