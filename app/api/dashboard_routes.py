from fastapi import APIRouter, Depends, HTTPException
from app.services.dashboard_service import get_dashboard_data
from app.deps import get_current_user
from app.db.client import get_database

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
async def dashboard(current_user=Depends(get_current_user), db=Depends(get_database)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user")
    data = await get_dashboard_data(db, user_id)
    return data
