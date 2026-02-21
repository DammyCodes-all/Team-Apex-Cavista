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
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user")

    result = await ingest_metrics(db, user_id, payload)
    if not result:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to store metrics")
    return result


@router.get("/{metrics_date}", response_model=MetricsResponse)
async def get_metrics(metrics_date: str, current_user=Depends(get_current_user), db=Depends(get_database)):
    user_id = current_user.get("user_id")
    try:
        date_obj = date.fromisoformat(metrics_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format; use YYYY-MM-DD")
    data = await get_metrics_for_date(db, user_id, date_obj)
    if not data:
        raise HTTPException(status_code=404, detail="Metrics not found")
    return data
