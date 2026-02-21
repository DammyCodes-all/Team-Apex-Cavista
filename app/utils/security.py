from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hash a password safely for storage.

    We pre-hash using SHA-256 to allow arbitrary-length passwords while
    avoiding bcrypt's 72-byte input limitation. The SHA-256 hex digest
    is then passed to bcrypt via passlib.
    """
    pre = _prehash_password(password)
    return pwd_context.hash(pre)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a stored bcrypt hash.

    The same SHA-256 pre-hash is applied before verification so passwords
    of any length validate correctly.
    """
    pre = _prehash_password(plain_password)
    return pwd_context.verify(pre, hashed_password)


def _prehash_password(password: str) -> str:
    """Return a stable representation of the password suitable for bcrypt.

    Uses SHA-256 and returns the hex digest (64 chars), which is safely
    below bcrypt's 72-byte input limit.
    """
    if password is None:
        password = ""
    digest = hashlib.sha256(password.encode("utf-8", errors="ignore")).hexdigest()
    return digest
