import hashlib
import secrets
from typing import Tuple
from datetime import datetime, timedelta
from app.config.settings import settings
from app.utils.jwt import create_access_token


def generate_refresh_token() -> str:
    return secrets.token_urlsafe(64)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_tokens(subject: str) -> Tuple[str, str, int]:
    """Return (access_token, refresh_token, refresh_expires_seconds)"""
    access = create_access_token({"sub": subject})
    refresh = generate_refresh_token()
    refresh_expires = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60 * 24  # placeholder, typically longer
    return access, refresh, refresh_expires
