from fastapi import APIRouter, Depends, HTTPException
from app.models.auth import SignUpRequest, LoginRequest, TokenResponse
from app.services.auth_service import signup_user, authenticate_user
from app.deps import get_current_user
from app.db.client import get_database

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
async def signup(payload: SignUpRequest, db=Depends(get_database)):
    try:
        tokens = await signup_user(db, payload.email, payload.password, payload.name)
        return TokenResponse(access_token=tokens["access_token"], refresh_token=tokens["refresh_token"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db=Depends(get_database)):
    creds = await authenticate_user(db, payload.email, payload.password)
    if not creds:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(access_token=creds["access_token"], refresh_token=creds["refresh_token"])


@router.get("/me")
async def me(current_user=Depends(get_current_user)):
    # return limited public user info
    return {"user_id": current_user.get("user_id"), "email": current_user.get("email"), "name": current_user.get("name")}
