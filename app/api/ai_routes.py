from fastapi import APIRouter, Depends, HTTPException, status
from datetime import date
from app.deps import get_current_user
from app.db.client import get_database
from app.services.ai_service import get_latest_insights
from app.services.health_profile_service import get_health_profile, get_baseline_status

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/insights")
async def ai_insights(
    days: int = 7,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    profile = await get_health_profile(db, user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Health profile not found. Complete signup first.")
    if profile.get("baseline_status") != "active":
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail=f"AI engine still collecting baseline data. {14 - profile.get('baseline_days_collected', 0)} days remaining."
        )

    insights = await get_latest_insights(db, user_id, days)
    return insights or []


@router.get("/status")
async def ai_status(current_user=Depends(get_current_user), db=Depends(get_database)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    status_info = await get_baseline_status(db, user_id)
    if status_info.get("baseline_status") == "not_initialized":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Health profile not initialized. Please complete signup.")
    return status_info
