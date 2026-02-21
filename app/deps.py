from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt import verify_token
from app.db.client import get_database

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), request: Request = None):
    token = credentials.credentials
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    db = get_database(request)
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
