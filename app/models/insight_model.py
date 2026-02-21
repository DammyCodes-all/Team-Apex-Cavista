from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any, Optional


class InsightDocument(BaseModel):
    user_id: str
    date: datetime
    risk_score: float
    summary_message: str
    recommended_actions: List[Dict[str, Any]]
    deviation_flags: Dict[str, bool]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
