from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from app.models.error import ErrorResponse
from app.services.dashboard_service import get_dashboard_data
from app.deps import get_current_user
from app.db.client import get_database
from fastapi import WebSocket, WebSocketDisconnect
from app.utils.websocket_manager import manager
from app.utils.jwt import verify_token
from fastapi import HTTPException

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("",
            responses={
                401: {"model": ErrorResponse},
                500: {"model": ErrorResponse},
            })
async def dashboard(current_user=Depends(get_current_user), db=Depends(get_database)):
    """Retrieve the current dashboard snapshot for the user.

    Errors:
    - 401 Unauthorized: missing/invalid credentials
    - any other status codes propagated from service

    Example error response:
    ```json
    { "error_type": "authentication", "detail": "Invalid user" }
    ```
    """
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail={"error_type": "authentication", "detail": "Invalid user"})
    data = await get_dashboard_data(db, user_id)
    return data


# ---- convenience endpoints for frontend report/risk models ----------------

def _build_report(dashboard: Dict[str, Any]) -> Dict[str, Any]:
    # map minimal fields into report structure
    return {
        "meta": {
            "brand": "Prevention AI",
            "unit": "HEALTH INTELLIGENCE UNIT",
            "generatedDate": dashboard.get("date") or "",
            "status": dashboard.get("risk_score", 0) < 50 and "LOW RISK" or "NORMAL",
        },
        "executiveSummary": "",  # frontend may compute/replace
        "metrics": [
            {"id": "steps", "label": "STEPS", "value": dashboard.get("steps", 0), "unit": "", "trend": None},
            {"id": "sleep", "label": "SLEEP", "value": dashboard.get("sleep"), "unit": "", "trend": None},
        ],
        "dailyActivity": {
            "title": "Daily Activity vs. Rest",
            "period": "Last 7 Days",
            "data": [],
            "valueUnit": "min",
        },
        "insights": dashboard.get("insight") and [
            {"number": 1, "title": dashboard["insight"].get("summary", ""), "description": ""}
        ] or [],
        "actions": {"downloadLabel": "Get Full PDF", "modal": {}}
    }


def _build_risk(dashboard: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "wellnessRiskScore": {
            "label": "WELLNESS RISK SCORE",
            "score": dashboard.get("risk_score", 0),
            "maxScore": 100,
            "trend": None,
            "trendDirection": "",
        },
        "signalDeviations": {"cards": []},
        "aiInsights": {"items": []},
        "riskForecast": {"days": [], "series": []},
        "microActions": {"items": []},
    }


@router.get("/report")
async def dashboard_report(current_user=Depends(get_current_user), db=Depends(get_database)):
    """Return a report‑style object derived from dashboard data."""
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail={"error_type": "authentication", "detail": "Invalid user"})
    d = await get_dashboard_data(db, user_id)
    return _build_report(d)


@router.get("/risk")
async def dashboard_risk(current_user=Depends(get_current_user), db=Depends(get_database)):
    """Return a risk‑model object built from the dashboard."""
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail={"error_type": "authentication", "detail": "Invalid user"})
    d = await get_dashboard_data(db, user_id)
    return _build_risk(d)


@router.websocket("/ws")
async def dashboard_ws(websocket: WebSocket):
    # authenticate via query param token
    token = websocket.query_params.get("token")
    if not token:
        # 1008 = policy violation; missing token treated as authentication error
        await websocket.close(code=1008)
        return
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
    except Exception:
        await websocket.close(code=1008)
        return

    await manager.connect(user_id, websocket)
    try:
        while True:
            # keep connection alive; ignore incoming data
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)

