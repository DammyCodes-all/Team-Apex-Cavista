from fastapi import APIRouter, Depends, HTTPException, status
from app.models.auth import SignUpRequest, LoginRequest
from app.services.auth_service import signup_user, authenticate_user
from app.db.client import get_database

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
async def signup(payload: SignUpRequest, db=Depends(get_database)):
    try:
        return await signup_user(db, payload.email, payload.password, payload.name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(payload: LoginRequest, db=Depends(get_database)):
    auth = await authenticate_user(db, payload.email, payload.password)
    if auth is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return auth
