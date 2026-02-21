from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Argon2 (argon2-cffi) PasswordHasher with reasonable defaults. These
# parameters can be tuned in production based on your server resources.
pwd_hasher = PasswordHasher()


def get_password_hash(password: str) -> str:
    """Hash a password using Argon2.

    Argon2 supports arbitrary-length passwords; no pre-hashing is required.
    Returns the Argon2 hash string suitable for storage.
    """
    if password is None:
        password = ""
    return pwd_hasher.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a stored Argon2 hash.

    Returns True when the password matches, False otherwise.
    """
    try:
        pwd_hasher.verify(hashed_password, plain_password)
        return True
    except VerifyMismatchError:
        return False
    except Exception:
        # For any unexpected verification errors, fail closed (do not
        # authenticate) but avoid leaking internals.
        return False

