from typing import Any, Dict, List
from datetime import datetime, timedelta


async def store_health_entry(db, user_id: str, entry: Dict[str, Any]) -> str:
    doc = {"user_id": user_id, **entry}
    if "timestamp" not in doc or doc["timestamp"] is None:
        doc["timestamp"] = datetime.utcnow()
    result = await db.health.insert_one(doc)
    return str(result.inserted_id)


async def query_trends(db, user_id: str, metric: str, days: int = 7) -> Dict[str, Any]:
    end = datetime.utcnow()
    start = end - timedelta(days=days)
    cursor = db.health.find({"user_id": user_id, "type": metric, "timestamp": {"$gte": start, "$lte": end}})
    items = await cursor.to_list(length=1000)
    # minimal aggregation example
    values = [it.get("value") for it in items]
    return {"metric": metric, "start": start, "end": end, "count": len(values)}
