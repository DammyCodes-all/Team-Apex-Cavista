from fastapi import APIRouter, Depends, HTTPException
from app.deps import get_current_user
from app.db.client import get_database
from app.services.health_service import store_health_entry, query_trends
from app.models.health import HealthEntryRequest, HealthTrendResponse

router = APIRouter(prefix="/health-data", tags=["health-data"])


@router.post("")
async def post_health(entry: HealthEntryRequest, current_user=Depends(get_current_user), db=Depends(get_database)):
    doc = entry.model_dump()
    inserted_id = await store_health_entry(db, str(current_user.get("_id")), doc)
    return {"id": inserted_id}


@router.get("/trends", response_model=HealthTrendResponse)
async def get_trends(metric: str, days: int = 7, current_user=Depends(get_current_user), db=Depends(get_database)):
    res = await query_trends(db, str(current_user.get("_id")), metric, days)
    return res
