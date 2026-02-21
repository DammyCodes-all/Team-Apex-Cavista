"""
Health Data Controller for Prevention AI Daily Metrics Ingestion.

POST /health-data endpoint accepts daily passive health metrics.
This is part of the baseline collection phase for Prevention AI.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import date
from app.models.metrics_model import MetricsCreate, MetricsResponse
from app.services.daily_metrics_service import store_daily_metrics, get_daily_metrics
from app.services.health_profile_service import increment_baseline_days, get_health_profile
from app.services.ai_service import (
    activate_baseline_if_ready,
    compute_daily_deviations,
    calculate_risk_score,
    generate_insights
)
from app.db.client import get_database
from app.deps import get_current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/health-data", tags=["health-data"])


@router.post("", response_model=MetricsResponse)
async def store_daily_health_data(
    payload: MetricsCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Store daily passive health metrics for the authenticated user.
    
    This endpoint is part of the Prevention AI baseline collection and active phases:
    - PHASE 1 (Collecting): Stores metrics and increments baseline_days_collected
    - PHASE 2 (Active): Also runs deviation detection, risk scoring, and insight generation
    
    Args:
        payload: Daily metrics (steps, sleep, sedentary, location, active_minutes)
        current_user: Authenticated user dict with _id
        db: MongoDB database
    
    Returns:
        Stored metrics document (includes deviation_flags if baseline is active)
    
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
    
    Example response (collecting phase):
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
    
    Example response (active phase with insights):
        {
            "user_id": "507f1f77bcf86cd799439011",
            "date": "2026-02-21",
            "steps": 8234,
            "sleep_duration_minutes": 420,
            "sedentary_minutes": 480,
            "location_diversity_score": 45.3,
            "active_minutes": 25,
            "deviation_flags": {
                "steps": false,
                "sleep": false,
                "sedentary": false,
                "location": false,
                "active_minutes": false
            },
            "risk_score": 15.5,
            "created_at": "2026-02-21T10:30:00",
            "updated_at": "2026-02-21T10:30:00"
        }
    """
    user_id = current_user.get("user_id") or str(current_user.get("_id"))
    
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
    
    # Increment baseline days if still collecting
    if profile.get("baseline_status") == "collecting":
        await increment_baseline_days(db, user_id)
        
        # Check if baseline should be activated (14+ days collected)
        activated = await activate_baseline_if_ready(db, user_id)
        if activated:
            logger.info(f"Baseline activated for user {user_id}")
    
    # If baseline is now active, run AI detection pipeline
    baseline_status = profile.get("baseline_status")
    if baseline_status == "active":
        try:
            # STEP 5: Detect deviations for all signals
            deviation_flags = await compute_daily_deviations(db, user_id, metrics["_id"])
            
            # STEP 6: Calculate risk score
            risk_score = await calculate_risk_score(db, user_id, deviation_flags, metrics)
            
            # STEP 7: Generate insights
            insight = await generate_insights(db, user_id, deviation_flags, risk_score)
            
            # Update metrics response with AI results
            metrics["deviation_flags"] = deviation_flags
            metrics["risk_score"] = risk_score
            
            logger.info(f"AI engine processed metrics for user {user_id}. Risk score: {risk_score}")
        except Exception as e:
            logger.error(f"Error running AI pipeline for user {user_id}: {str(e)}", exc_info=True)
            # Don't fail the request if AI processing fails
            # The metrics are still stored successfully
    
    return metrics


@router.get("/{date_str}", response_model=MetricsResponse)
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
    user_id = current_user.get("user_id") or str(current_user.get("_id"))
    
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
