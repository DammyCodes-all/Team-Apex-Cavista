from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt import verify_token
from app.db.client import get_database
from bson import ObjectId

security = HTTPBearer(auto_error=False)


async def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Prefer cookie-based access token
    token = request.cookies.get("access_token")
    if not token and credentials:
        token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Missing credentials")
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    db = get_database(request)
    # try to resolve ObjectId if possible
    user = None
    # first, try to look up by new UUID field
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        # fall back to legacy _id or email for compatibility
        try:
            oid = ObjectId(user_id)
            user = await db.users.find_one({"_id": oid})
        except Exception:
            user = await db.users.find_one({"email": user_id})
    if user:
        # ensure user_id property is present on returned object
        user["user_id"] = user_id
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
