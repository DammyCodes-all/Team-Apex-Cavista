from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from jose import ExpiredSignatureError
from app.utils.jwt import verify_token, create_access_token
from app.services.auth_service import rotate_refresh_token
from app.utils.tokens import hash_token
from app.db.client import get_database
from app.config.settings import settings
import secrets


def _cookie_args():
    secure = settings.ENV != "development"
    # SameSite=None required for cross-site requests; must also set Secure
    return {"httponly": True, "secure": secure, "samesite": "none", "path": "/"}


class RefreshTokenMiddleware(BaseHTTPMiddleware):
    """Middleware that automatically refreshes an expired access token if a valid
    refresh token is present in cookies.  

    - If the access token is valid, we store its payload in ``request.state.user_payload``
      for downstream deps to use.
    - If the access token has expired, attempt to verify the refresh token, rotate
      it, and issue a new access token _before_ proceeding with the request.
    - New tokens are added to the response cookies after the endpoint runs.
    """

    async def dispatch(self, request: Request, call_next):
        new_access = None
        new_refresh = None

        token = request.cookies.get("access_token")
        if token:
            try:
                payload = verify_token(token)
                request.state.user_payload = payload
            except ExpiredSignatureError:
                # try to exchange refresh token for new tokens
                refresh = request.cookies.get("refresh_token")
                device_id = request.cookies.get("device_id")
                if refresh:
                    db = get_database(request)
                    token_hash = hash_token(refresh)
                    token_doc = await db.refresh_tokens.find_one({"token_hash": token_hash, "revoked": False})
                    if token_doc:
                        user_id = token_doc.get("user_id")
                        dev = await db.devices.find_one({"fingerprint": device_id, "user_id": user_id})
                        if dev and dev.get("trusted", False):
                            # rotate and issue new tokens
                            new_refresh = await rotate_refresh_token(db, refresh, user_id, device_id)
                            new_access = create_access_token({"sub": user_id})
                            # set payload for request
                            request.state.user_payload = verify_token(new_access)
        # proceed with request
        response = await call_next(request)

        # if we generated fresh tokens, attach them to response cookies
        if new_access:
            cookie_args = _cookie_args()
            response.set_cookie("access_token", new_access, max_age=15 * 60, **cookie_args)
        if new_refresh:
            cookie_args = _cookie_args()
            response.set_cookie("refresh_token", new_refresh, max_age=30 * 24 * 3600, **cookie_args)
        return response
