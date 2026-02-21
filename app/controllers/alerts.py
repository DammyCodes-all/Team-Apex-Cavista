from fastapi import APIRouter, Depends
from app.deps import get_current_user
from app.db.client import get_database
from app.services.alert_service import list_alerts, mark_alert_read

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("")
async def get_alerts(current_user=Depends(get_current_user), db=Depends(get_database)):
    return await list_alerts(db, str(current_user.get("_id")))


@router.post("/{alert_id}/read")
async def read_alert(alert_id: str, read: bool = True, current_user=Depends(get_current_user), db=Depends(get_database)):
    await mark_alert_read(db, alert_id, read)
    return {"status": "ok"}
