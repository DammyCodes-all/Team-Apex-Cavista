from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AlertModel(BaseModel):
    id: Optional[str]
    user_id: str
    metric: str
    severity: str
    message: str
    created_at: Optional[datetime]
    read: bool = False
