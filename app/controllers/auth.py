from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
import logging
from app.models.auth import SignUpRequest, LoginRequest
from app.services.auth_service import signup_user, authenticate_user, store_refresh_token, rotate_refresh_token, revoke_refresh_token, generate_device_otp, mark_device_trusted
from app.db.client import get_database
from app.utils.tokens import hash_token
from app.config.settings import settings
from app.utils.jwt import create_access_token, verify_token
from datetime import timedelta
import hashlib
import secrets

router = APIRouter(prefix="/auth", tags=["auth"])


def _cookie_args() -> dict:
    secure = settings.ENV != "development"
    return {"httponly": True, "secure": secure, "samesite": "strict", "path": "/"}


@router.post("/signup")
async def signup(payload: SignUpRequest, response: Response, db=Depends(get_database), request: Request = None):
    try:
        result = await signup_user(db, payload.email, payload.password, payload.name)
        # decode user id from access token
        payload_decoded = verify_token(result["access_token"])
        user_id = payload_decoded.get("sub")
        # store refresh token associated with device if device_id present
        device_id = request.cookies.get("device_id") if request else None
        await store_refresh_token(db, user_id, result["refresh_token"], device_id=device_id)
        # set cookies (refresh available immediately for signup)
        cookie_args = _cookie_args()
        csrf = secrets.token_urlsafe(16)
        response.set_cookie("csrf_token", csrf, httponly=False, secure=cookie_args["secure"], samesite="strict", path="/")
        response.set_cookie("access_token", result["access_token"], max_age=15 * 60, **cookie_args)
        response.set_cookie("refresh_token", result["refresh_token"], max_age=30 * 24 * 3600, **cookie_args)
        return {"status": "ok"}
    except ValueError as e:
        msg = str(e)
        if "72 bytes" in msg or "truncate" in msg:
            # avoid leaking bcrypt internal limits to clients
            raise HTTPException(status_code=400, detail="Invalid password")
        raise HTTPException(status_code=400, detail=msg)


@router.post("/login")
async def login(payload: LoginRequest, response: Response, request: Request, db=Depends(get_database)):
    # authenticate_user returns None for invalid credentials; keep errors logged server-side
    auth = None
    try:
        auth = await authenticate_user(db, payload.email, payload.password)
    except Exception as e:
        logging.exception("Error during authentication")
        # avoid leaking internal errors to client
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Authentication failed")

    if auth is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    # device fingerprint
    ua = request.headers.get("user-agent", "")
    ip = request.client.host if request.client else ""
    fingerprint = hashlib.sha256(f"{ua}|{ip}".encode()).hexdigest()
    # decode user id
    payload_decoded = verify_token(auth["access_token"])
    user_id = payload_decoded.get("sub")
    # check device
    dev = await db.devices.find_one({"user_id": user_id, "fingerprint": fingerprint})
    cookie_args = _cookie_args()
    csrf = secrets.token_urlsafe(16)
    response.set_cookie("csrf_token", csrf, httponly=False, secure=cookie_args["secure"], samesite="strict", path="/")
    response.set_cookie("access_token", auth["access_token"], max_age=15 * 60, **cookie_args)
    # if device exists and trusted -> issue refresh
    if dev and dev.get("trusted", False):
        await store_refresh_token(db, user_id, auth["refresh_token"], device_id=fingerprint)
        response.set_cookie("refresh_token", auth["refresh_token"], max_age=30 * 24 * 3600, **cookie_args)
        response.set_cookie("device_id", fingerprint, max_age=30 * 24 * 3600, httponly=False, secure=cookie_args["secure"], samesite="strict", path="/")
        return {"status": "ok"}
    # new device -> create device record and require OTP
    await db.devices.insert_one({"user_id": user_id, "fingerprint": fingerprint, "trusted": False, "created_at": datetime.utcnow()})
    otp = await generate_device_otp(db, user_id, fingerprint)
    # NOTE: in production send OTP to user's email; here we return for testing only
    response.set_cookie("device_id", fingerprint, max_age=30 * 24 * 3600, httponly=False, secure=cookie_args["secure"], samesite="strict", path="/")
    return {"status": "otp_required", "otp": otp}


@router.post("/refresh")
async def refresh(response: Response, request: Request, db=Depends(get_database)):
    # read refresh token from cookie
    refresh = request.cookies.get("refresh_token")
    device_id = request.cookies.get("device_id")
    if not refresh:
        raise HTTPException(status_code=401, detail="Missing refresh token")
    # find token
    token_hash = hash_token(refresh)
    token_doc = await db.refresh_tokens.find_one({"token_hash": token_hash, "revoked": False})
    if not token_doc:
        raise HTTPException(status_code=401, detail="Invalid or revoked refresh token")
    user_id = token_doc.get("user_id")
    # check device trusted
    dev = await db.devices.find_one({"fingerprint": device_id, "user_id": user_id})
    if not dev or not dev.get("trusted", False):
        raise HTTPException(status_code=403, detail="Untrusted device")
    # rotate
    new_refresh = await rotate_refresh_token(db, refresh, user_id, device_id)
    access = create_access_token({"sub": user_id})
    cookie_args = _cookie_args()
    response.set_cookie("access_token", access, max_age=15 * 60, **cookie_args)
    response.set_cookie("refresh_token", new_refresh, max_age=30 * 24 * 3600, **cookie_args)
    return {"status": "ok"}


@router.post("/logout")
async def logout(response: Response, request: Request, db=Depends(get_database)):
    refresh = request.cookies.get("refresh_token")
    if refresh:
        await revoke_refresh_token(db, refresh)
    # delete cookies
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    response.delete_cookie("device_id", path="/")
    return {"status": "logged_out"}


@router.post("/verify-device")
async def verify_device(payload: dict, response: Response, request: Request, db=Depends(get_database)):
    # payload should contain device_id and otp
    device_id = payload.get("device_id")
    otp = payload.get("otp")
    if not device_id or not otp:
        raise HTTPException(status_code=400, detail="device_id and otp required")
    # get user id from access token cookie (short lived)
    access = request.cookies.get("access_token")
    if not access:
        raise HTTPException(status_code=401, detail="Missing access token")
    try:
        payload_decoded = verify_token(access)
        user_id = payload_decoded.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid access token")
    new_refresh = await mark_device_trusted(db, user_id, device_id, otp)
    if not new_refresh:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    cookie_args = _cookie_args()
    response.set_cookie("refresh_token", new_refresh, max_age=30 * 24 * 3600, **cookie_args)
    return {"status": "trusted"}
