from fastapi import APIRouter, Depends
from app.deps import get_current_user
from app.db.client import get_database
from app.services.ai_service import generate_insights

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/insights")
async def ai_insights(days: int = 14, current_user=Depends(get_current_user), db=Depends(get_database)):
    insights = await generate_insights(db, str(current_user.get("_id")), days)
    return insights
