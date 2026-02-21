from fastapi import APIRouter, Depends
from app.deps import get_current_user
from app.db.client import get_database
from app.services.report_service import generate_csv

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/download")
async def download_reports(format: str = "csv", include_insights: bool = True, current_user=Depends(get_current_user), db=Depends(get_database)):
    if format not in ("csv", "pdf"):
        return {"error": "unsupported format"}
    if format == "csv":
        user_id = current_user.get("user_id") or str(current_user.get("_id"))
        return await generate_csv(db, user_id, include_insights=include_insights)
    # TODO: implement PDF export
    return {"message": "PDF export not implemented"}
