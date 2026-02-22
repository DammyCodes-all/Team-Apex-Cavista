from typing import Dict, List
from datetime import datetime

async def save_chat_message(db, user_id: str, role: str, content: str):
    doc = {
        "user_id": user_id,
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow(),
    }
    await db.chat_history.insert_one(doc)
    return doc

async def get_chat_history(db, user_id: str, limit: int = 100) -> List[Dict]:
    cursor = db.chat_history.find({"user_id": user_id}).sort("timestamp", 1).limit(limit)
    return await cursor.to_list(length=None)
