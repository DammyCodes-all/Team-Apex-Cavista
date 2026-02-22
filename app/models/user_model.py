from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserInDB(BaseModel):
    user_id: str
    email: EmailStr
    name: str
    hashed_password: str
    created_at: datetime


class UserPublic(BaseModel):
    user_id: str
    email: EmailStr
    name: str
