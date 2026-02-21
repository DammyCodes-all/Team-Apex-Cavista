"""
Health Data Controller for Prevention AI Daily Metrics Ingestion.

POST /health-data endpoint accepts daily passive health metrics.
This is part of the baseline collection phase for Prevention AI.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import date
from app.models.daily_metrics import DailyMetricsCreate, DailyMetricsResponse
from app.services.daily_metrics_service import store_daily_metrics, get_daily_metrics
from app.services.health_profile_service import increment_baseline_days, get_health_profile
from app.db.client import get_database
from app.deps import get_current_user

router = APIRouter(prefix="/health-data", tags=["health-data"])


@router.post("", response_model=DailyMetricsResponse)
async def store_daily_health_data(
    payload: DailyMetricsCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Store daily passive health metrics for the authenticated user.
    
    This endpoint is part of the Prevention AI baseline collection phase.
    Metrics are stored and baseline_days_collected is incremented.
    
    Args:
        payload: Daily metrics (steps, sleep, sedentary, location, active_minutes)
        current_user: Authenticated user dict with _id
        db: MongoDB database
    
    Returns:
        Stored metrics document
    
    Example request:
        POST /health-data
        {
            "date": "2026-02-21",
            "steps": 8234,
            "sleep_duration_minutes": 420,
            "sedentary_minutes": 480,
            "location_diversity_score": 45.3,
            "active_minutes": 25
        }
    
    Example response:
        {
            "user_id": "507f1f77bcf86cd799439011",
            "date": "2026-02-21",
            "steps": 8234,
            "sleep_duration_minutes": 420,
            "sedentary_minutes": 480,
            "location_diversity_score": 45.3,
            "active_minutes": 25,
            "created_at": "2026-02-21T10:30:00",
            "updated_at": "2026-02-21T10:30:00"
        }
    """
    user_id = str(current_user.get("_id"))
    
    # Verify health profile exists
    profile = await get_health_profile(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Health profile not found. Please complete signup first."
        )
    
    # Store the metrics
    metrics = await store_daily_metrics(
        db,
        user_id,
        payload.date,
        payload.steps,
        payload.sleep_duration_minutes,
        payload.sedentary_minutes,
        payload.location_diversity_score,
        payload.active_minutes,
    )
    
    # Increment baseline days if still collecting (handles status transition at 14 days)
    if profile.get("baseline_status") == "collecting":
        await increment_baseline_days(db, user_id)
    
    return metrics


@router.get("/{date_str}", response_model=DailyMetricsResponse)
async def get_daily_health_data(
    date_str: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Retrieve daily metrics for a specific date (YYYY-MM-DD format).
    
    Example:
        GET /health-data/2026-02-21
    """
    user_id = str(current_user.get("_id"))
    
    try:
        date_obj = date.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD."
        )
    
    metrics = await get_daily_metrics(db, user_id, date_obj)
    if not metrics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No metrics found for {date_str}."
        )
    
    return metrics
