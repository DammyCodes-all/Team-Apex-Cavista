from fastapi import APIRouter, Depends, HTTPException, status
from app.models.metrics_model import MetricsCreate, MetricsResponse
from app.services.metrics_service import ingest_metrics, get_metrics_for_date
from app.deps import get_current_user
from app.db.client import get_database
from datetime import date

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.post("", response_model=MetricsResponse)
async def post_metrics(
    payload: MetricsCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    """Ingest a single day's metrics for the authenticated user.

    Request payload example is defined in `MetricsCreate` model; an example JSON:
    ```json
    {
      "date": "2026-02-21",
      "steps": 5000,
      "sleep_duration_minutes": 420,
      "sedentary_minutes": 600,
      "location_diversity_score": 75.5,
      "active_minutes": 45,
      "screen_time_minutes": 180
    }
    ```

    Possible errors:
    - 401 Unauthorized: invalid credentials
    - 400 Bad Request: payload validation error (handled automatically)
    - 500 Internal Server Error: database write failure

    Example error response:
    ```json
    { "error_type": "database_error", "detail": "Failed to store metrics" }
    ```
    """
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail={"error_type": "authentication", "detail": "Invalid user"})

    result = await ingest_metrics(db, user_id, payload)
    if not result:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"error_type": "database_error", "detail": "Failed to store metrics"})
    return result


@router.get("/{metrics_date}", response_model=MetricsResponse)
async def get_metrics(metrics_date: str, current_user=Depends(get_current_user), db=Depends(get_database)):
    """Retrieve stored metrics for a specific date.

    - Path parameter `metrics_date` must be ISO format (YYYY-MM-DD).

    Errors:
    - 400 Bad Request: invalid date format
    - 401 Unauthorized: missing credentials
    - 404 Not Found: no metrics stored for that day

    Example error payloads:
    ```json
    { "error_type": "invalid_format", "detail": "Invalid date format; use YYYY-MM-DD" }
    { "error_type": "not_found", "detail": "Metrics not found" }
    ```
    """
    user_id = current_user.get("user_id")
    try:
        date_obj = date.fromisoformat(metrics_date)
    except ValueError:
        raise HTTPException(status_code=400, detail={"error_type": "invalid_format", "detail": "Invalid date format; use YYYY-MM-DD"})
    data = await get_metrics_for_date(db, user_id, date_obj)
    if not data:
        raise HTTPException(status_code=404, detail={"error_type": "not_found", "detail": "Metrics not found"})
    return data
