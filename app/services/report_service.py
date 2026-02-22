from typing import Any, Dict
import io
import csv
from fastapi.responses import StreamingResponse


async def generate_csv(db, user_id: str, include_insights: bool = True):
    # Minimal CSV generator - streaming response
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["timestamp", "metric", "value"])
    cursor = db.health.find({"user_id": user_id}).sort([("timestamp", 1)])
    async for doc in cursor:
        writer.writerow([doc.get("timestamp"), doc.get("type"), doc.get("value")])
    if include_insights:
        writer.writerow([])
        writer.writerow(["insight", "score"])  # placeholder
    buffer.seek(0)
    return StreamingResponse(iter([buffer.getvalue().encode()]), media_type="text/csv")
