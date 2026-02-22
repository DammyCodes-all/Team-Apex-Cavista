from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional, Dict, Any


class MetricsCreate(BaseModel):
    date: date
    steps: int = Field(ge=0)
    sleep_duration_minutes: int = Field(ge=0)
    sedentary_minutes: int = Field(ge=0)
    location_diversity_score: float = Field(ge=0, le=100)
    active_minutes: int = Field(ge=0)
    screen_time_minutes: Optional[int] = Field(default=None, ge=0)

    model_config = {
        "json_schema_extra": {
            "example": {
                "date": "2026-02-21",
                "steps": 5000,
                "sleep_duration_minutes": 420,
                "sedentary_minutes": 600,
                "location_diversity_score": 75.5,
                "active_minutes": 45,
                "screen_time_minutes": 180
            }
        }
    }


class MetricsResponse(BaseModel):
    user_id: str
    date: date
    steps: int
    sleep_duration_minutes: int
    sedentary_minutes: int
    location_diversity_score: float
    active_minutes: int
    screen_time_minutes: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    deviation_flags: Optional[Dict[str, bool]] = None
    risk_score: Optional[float] = None

    class Config:
        from_attributes = True
