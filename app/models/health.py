from pydantic import BaseModel
from typing import Any, Dict, Optional
from datetime import datetime


class HealthEntryRequest(BaseModel):
    type: str  # steps|sleep|screen_time|voice_stress|location
    timestamp: Optional[datetime]
    value: Dict[str, Any]


class HealthTrendResponse(BaseModel):
    metric: str
    start: datetime
    end: datetime
    aggregates: Dict[str, Any]
