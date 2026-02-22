"""
AI Status Controller for Prevention AI Baseline Phase.

GET /ai/status endpoint returns the baseline learning status.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from app.services.health_profile_service import get_baseline_status
from app.models.error import ErrorResponse
from app.db.client import get_database
from app.deps import get_current_user

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/status",
            responses={
                401: {"model": ErrorResponse},
                404: {"model": ErrorResponse},
                500: {"model": ErrorResponse},
            })
async def ai_baseline_status(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Get the current Prevention AI baseline learning status for the user.
    
    During the baseline phase (< 14 days of data), no AI insights are generated.
    This endpoint shows progress towards baseline activation.
    
    Returns:
        - baseline_status: "collecting" | "active"
        - baseline_days_collected: Number of days of data collected
        - baseline_start_date: When baseline collection began
        - message: User-friendly status message
    
    Example response during collecting phase:
        {
            "baseline_status": "collecting",
            "baseline_days_collected": 7,
            "baseline_start_date": "2026-02-14T10:30:00",
            "message": "We are learning your behavioral baseline. Insights will activate after 7 more days of data."
        }
    
    Example response after baseline complete:
        {
            "baseline_status": "active",
            "baseline_days_collected": 14,
            "baseline_start_date": "2026-02-07T10:30:00",
            "message": "Baseline learning complete. AI insights are now active."
        }
    
    Common error payloads:
    ```json
    { "error_type": "not_initialized", "detail": "Health profile not initialized. Please complete signup." }
    ```
    """
    user_id = current_user.get("user_id") or str(current_user.get("_id"))
    
    status_info = await get_baseline_status(db, user_id)
    
    if status_info.get("baseline_status") == "not_initialized":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error_type": "not_initialized", "detail": "Health profile not initialized. Please complete signup."}
        )
    
    return status_info
