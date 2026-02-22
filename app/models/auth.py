import re
import json
from pydantic import BaseModel, EmailStr, field_validator
from pydantic_core import PydanticCustomError


# -----------------------------
# Signup / Registration Schema
# -----------------------------
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not isinstance(v, str):
            raise PydanticCustomError("password_type", "Password must be a string")

        length = len(v)
        if length < 8 or length > 128:
            details = {"min_length": 8, "max_length": 128, "actual_length": length}
            raise PydanticCustomError("password_length", json.dumps(details))

        checks = [
            (r"[A-Z]", "at least one uppercase letter"),
            (r"[a-z]", "at least one lowercase letter"),
            (r"[0-9]", "at least one digit"),
            (r"[^A-Za-z0-9]", "at least one special character"),
        ]

        failed = [msg for pattern, msg in checks if not re.search(pattern, v)]
        if failed:
            details = {"errors": failed}
            # Raise a custom pydantic error with structured JSON details in the message
            raise PydanticCustomError("password_strength", json.dumps(details))

        return v


# -----------------------------
# Login Schema
# -----------------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# -----------------------------
# Token Response Schema
# -----------------------------
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# -----------------------------
# Trusted Device Verification
# -----------------------------
class VerifyDeviceRequest(BaseModel):
    device_id: str
    otp: str


# -----------------------------
# Optional: Change Password Schema
# -----------------------------
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        # Reuse the same password rules
        length = len(v)
        if length < 8 or length > 128:
            raise ValueError("Password must be between 8 and 128 characters")

        checks = [
            (r"[A-Z]", "at least one uppercase letter"),
            (r"[a-z]", "at least one lowercase letter"),
            (r"[0-9]", "at least one digit"),
            (r"[^A-Za-z0-9]", "at least one special character"),
        ]
        failed = [msg for pattern, msg in checks if not re.search(pattern, v)]
        if failed:
            raise ValueError("Password must contain: " + ", ".join(failed))
        return v