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
        return await generate_csv(db, str(current_user.get("_id")), include_insights=include_insights)
    # TODO: implement PDF export
    return {"message": "PDF export not implemented"}
