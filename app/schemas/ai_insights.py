from pydantic import BaseModel
from typing import List, Dict, Any


class Driver(BaseModel):
    metric: str
    z: float
    pct_change: float


class RecommendedAction(BaseModel):
    id: str
    text: str
    priority: str


class AIInsight(BaseModel):
    score: float
    drivers: List[Driver]
    recommended_actions: List[RecommendedAction]
    explanation: str
    raw: Dict[str, Any] = {}
