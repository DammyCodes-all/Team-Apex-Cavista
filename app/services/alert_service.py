from typing import Any, Dict, List
from datetime import datetime


async def create_alert(db, user_id: str, metric: str, severity: str, message: str) -> Dict[str, Any]:
    doc = {"user_id": user_id, "metric": metric, "severity": severity, "message": message, "created_at": datetime.utcnow(), "read": False}
    res = await db.alerts.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    return doc


async def list_alerts(db, user_id: str) -> List[Dict[str, Any]]:
    cursor = db.alerts.find({"user_id": user_id}).sort([("created_at", -1)])
    return await cursor.to_list(length=100)


async def mark_alert_read(db, alert_id: str, read: bool = True):
    await db.alerts.update_one({"_id": alert_id}, {"$set": {"read": read}})
