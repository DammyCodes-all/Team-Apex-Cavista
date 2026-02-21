from typing import Any, Dict

async def get_profile(db, user_id: str) -> Dict[str, Any]:
    user = await db.users.find_one({"_id": user_id})
    if not user:
        return {}
    return {
        "id": str(user.get("_id")),
        "email": user.get("email", ""),
        "name": user.get("name", ""),
        "age": user.get("age"),
        "gender": user.get("gender"),
        "height_cm": user.get("height_cm"),
        "weight_kg": user.get("weight_kg"),
        "tracking_sleep": user.get("tracking_sleep", True),
        "tracking_steps": user.get("tracking_steps", True),
        "tracking_screen_time": user.get("tracking_screen_time", True),
        "tracking_voice_stress": user.get("tracking_voice_stress", False)
    }


async def update_profile(db, user_id: str, patch: Dict[str, Any]) -> Dict[str, Any]:
    await db.users.update_one({"_id": user_id}, {"$set": patch})
    return await get_profile(db, user_id)
