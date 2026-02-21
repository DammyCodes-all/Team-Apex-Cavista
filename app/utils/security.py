from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    pw = _normalize_password_for_bcrypt(password)
    return pwd_context.hash(pw)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    pw = _normalize_password_for_bcrypt(plain_password)
    return pwd_context.verify(pw, hashed_password)


def _normalize_password_for_bcrypt(password: str) -> str:
    """Normalize password so it is safe for bcrypt (max 72 bytes).

    If the UTF-8 encoded password exceeds 72 bytes, truncate the byte string
    to 72 bytes and decode using 'utf-8' with 'ignore' to avoid partial
    multi-byte sequences. This ensures consistent hashing and verification.
    """
    if password is None:
        return ""
    pw_bytes = password.encode("utf-8")
    if len(pw_bytes) <= 72:
        return password
    truncated = pw_bytes[:72]
    return truncated.decode("utf-8", errors="ignore")
