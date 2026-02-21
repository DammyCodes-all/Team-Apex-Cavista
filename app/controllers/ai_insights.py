"""
AI Insights Controller for Prevention AI

GET /ai/insights endpoint retrieves latest AI insights with deviations and recommendations.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import date
from app.deps import get_current_user
from app.db.client import get_database
from app.services.ai_service import get_latest_insights
from app.services.health_profile_service import get_health_profile
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/insights")
async def ai_insights(
    days: int = 7,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Retrieve latest AI insights for the authenticated user.
    
    This endpoint returns insights generated from deviation detection and risk scoring.
    Each insight contains:
    - risk_score: 0-100 scale
    - risk_level: "Low", "Moderate", or "Elevated"
    - summary_message: AI-generated summary
    - recommended_actions: Array of actionable recommendations
    - deviation_flags: Which signals deviated from baseline
    
    Args:
        days: Number of days of history to retrieve (default 7)
        current_user: Authenticated user dict
        db: MongoDB database
    
    Returns:
        List of insight documents (most recent first)
    
    Example response:
        [
            {
                "_id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "date": "2026-02-21",
                "risk_score": 45.2,
                "risk_level": "Moderate",
                "summary_message": "Moderate risk detected based on recent activity patterns. 2 recommendations provided.",
                "recommended_actions": [
                    {
                        "id": "sleep_priority",
                        "text": "Prioritize consistent sleep timing this week.",
                        "priority": "high"
                    },
                    {
                        "id": "increase_steps",
                        "text": "Add 2,000 steps to your daily routine.",
                        "priority": "medium"
                    }
                ],
                "deviation_flags": {
                    "steps": true,
                    "sleep": true,
                    "sedentary": false,
                    "location": false,
                    "active_minutes": false
                },
                "created_at": "2026-02-21T10:35:00",
                "updated_at": "2026-02-21T10:35:00"
            }
        ]
    """
    user_id = str(current_user.get("_id"))
    
    # Verify user has health profile
    profile = await get_health_profile(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health profile not found. Complete signup first."
        )
    
    # Check if baseline is active
    if profile.get("baseline_status") != "active":
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail=f"AI engine still collecting baseline data. {14 - profile.get('baseline_days_collected', 0)} days remaining."
        )
    
    # Retrieve insights
    insights = await get_latest_insights(db, user_id, days)
    
    # Return empty list if no insights yet
    return insights if insights else []

