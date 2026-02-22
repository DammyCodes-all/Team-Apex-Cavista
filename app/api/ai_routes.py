from fastapi import APIRouter, Depends, HTTPException, status
import logging
from datetime import date
from app.deps import get_current_user
from app.db.client import get_database
from app.services.ai_service import get_latest_insights
from app.models.error import ErrorResponse
from app.services.health_profile_service import get_health_profile, get_baseline_status

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/insights",
            responses={
                401: {"model": ErrorResponse},
                404: {"model": ErrorResponse},
                202: {"model": ErrorResponse},
                500: {"model": ErrorResponse},
            })
async def ai_insights(
    days: int = 7,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Retrieve latest AI insights for the authenticated user.

    Query parameters:
    - days (int, default 7): lookback window in days for insights

    Errors:
    - 401 Unauthorized: invalid credentials
    - 404 Not Found: health profile not initialized
    - 202 Accepted: baseline still collecting (response detail will include days remaining)
    - 500 Internal Server Error: unexpected failure

    Example error payloads:
    ```json
    { "error_type": "not_found", "detail": "Health profile not found. Complete signup first." }
    { "error_type": "baseline_incomplete", "detail": "AI engine still collecting baseline data. 5 days remaining." }
    ```
    """
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"error_type": "authentication", "detail": "Invalid user"})

    profile = await get_health_profile(db, user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error_type": "not_found", "detail": "Health profile not found. Complete signup first."})
    if profile.get("baseline_status") != "active":
        raise HTTPException(
            status_code=status.HTTP_202_ACCEPTED,
            detail={
                "error_type": "baseline_incomplete",
                "detail": f"AI engine still collecting baseline data. {14 - profile.get('baseline_days_collected', 0)} days remaining."
            }
        )

    logging.info(f"ai_insights called for user {user_id}, days={days}")
    try:
        insights = await get_latest_insights(db, user_id, days)
        logging.info(f"ai_insights returned {len(insights)} entries")
        return insights or []
    except Exception as exc:
        # unexpected failure, convert to structured HTTP 500
        logging.exception("ai_insights failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error_type": "service_error", "detail": str(exc)}
        )


@router.get("/status",
            responses={
                401: {"model": ErrorResponse},
                404: {"model": ErrorResponse},
                500: {"model": ErrorResponse},
            })
async def ai_status(current_user=Depends(get_current_user), db=Depends(get_database)):
    """Return current baseline learning status for the user.

    Errors:
    - 401 Unauthorized: invalid credentials
    - 404 Not Found: health profile not initialized

    Example error payload:
    ```json
    { "error_type": "not_initialized", "detail": "Health profile not initialized. Please complete signup." }
    ```
    """
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"error_type": "authentication", "detail": "Invalid user"})

    status_info = await get_baseline_status(db, user_id)
    if status_info.get("baseline_status") == "not_initialized":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"error_type": "not_initialized", "detail": "Health profile not initialized. Please complete signup."})
    return status_info
