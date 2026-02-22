from fastapi import APIRouter, Depends, HTTPException
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

