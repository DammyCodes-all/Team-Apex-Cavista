from pydantic import BaseModel
from typing import Optional


class ProfileResponse(BaseModel):
    id: str
    email: str
    name: str
    age: Optional[int]
    gender: Optional[str]
    height_cm: Optional[float]
    weight_kg: Optional[float]
    tracking_sleep: bool = True
    tracking_steps: bool = True
    tracking_screen_time: bool = True
    tracking_voice_stress: bool = False


class UpdateProfileRequest(BaseModel):
    name: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    height_cm: Optional[float]
    weight_kg: Optional[float]
    tracking_sleep: Optional[bool]
    tracking_steps: Optional[bool]
    tracking_screen_time: Optional[bool]
    tracking_voice_stress: Optional[bool]
