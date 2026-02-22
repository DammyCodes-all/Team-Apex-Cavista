from pydantic import BaseModel
from typing import Optional


class ProfileResponse(BaseModel):
    id: str
    email: str
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    tracking_sleep: bool = True
    tracking_steps: bool = True
    tracking_screen_time: bool = True
    tracking_voice_stress: bool = False
    goals_selected: Optional[list] = []
    goals_custom: Optional[str] = None


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    tracking_sleep: Optional[bool] = None
    tracking_steps: Optional[bool] = None
    tracking_screen_time: Optional[bool] = None
    tracking_voice_stress: Optional[bool] = None
    goals_selected: Optional[list] = None
    goals_custom: Optional[str] = None
    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "string",
                "age": 0,
                "gender": "string",
                "height_cm": 0,
                "weight_kg": 0,
                "tracking_sleep": True,
                "tracking_steps": True,
                "tracking_screen_time": True,
                "tracking_voice_stress": True,
                "goals_selected": ["active", "focus", "health"],
                "goals_custom": "Give me recommendations"
            }
        }
    }
