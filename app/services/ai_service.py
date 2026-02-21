from typing import Any, Dict
from app.schemas.ai_insights import AIInsight, Driver, RecommendedAction
from datetime import datetime


async def generate_insights(db, user_id: str, days: int = 14) -> Dict[str, Any]:
    # TODO: implement baseline modeling and deviation detection
    # Placeholder: return a simple insight structure
    insight = AIInsight(
        score=0.1,
        drivers=[Driver(metric="steps", z=-0.5, pct_change=-10.0)],
        recommended_actions=[RecommendedAction(id="walk_more", text="Add a 10-minute walk.", priority="low")],
        explanation="Placeholder insight: no significant deviations detected.",
        raw={"generated_at": datetime.utcnow().isoformat()},
    )
    return insight.model_dump()
