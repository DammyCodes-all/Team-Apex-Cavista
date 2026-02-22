from typing import Dict, Set
from fastapi import WebSocket


class WebSocketManager:
    def __init__(self):
        self.connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.connections.setdefault(user_id, set()).add(websocket)

    def disconnect(self, user_id: str, websocket: WebSocket):
        conns = self.connections.get(user_id)
        if conns and websocket in conns:
            conns.remove(websocket)

    async def send_dashboard_update(self, user_id: str, payload: dict):
        conns = list(self.connections.get(user_id, []))
        for ws in conns:
            try:
                await ws.send_json(payload)
            except Exception:
                self.disconnect(user_id, ws)


# singleton instance used by services/routes
manager = WebSocketManager()