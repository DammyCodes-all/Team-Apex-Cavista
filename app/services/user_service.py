from typing import Any, Dict
from bson import ObjectId

async def get_profile(db, user_id: str) -> Dict[str, Any]:
    import logging
    logging.info(f"user_service.get_profile called for {user_id}")
    # use the UUID user_id field; support legacy queries by _id
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        try:
            user = await db.users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            user = None
    if not user:
        return {}
    return {
        "id": user.get("user_id") or str(user.get("_id")),
        "email": user.get("email", ""),
        "name": user.get("name", ""),
        "age": user.get("age"),
        "gender": user.get("gender"),
        "height_cm": user.get("height_cm"),
        "weight_kg": user.get("weight_kg"),
        "tracking_sleep": user.get("tracking_sleep", True),
        "tracking_steps": user.get("tracking_steps", True),
        "tracking_screen_time": user.get("tracking_screen_time", True),
        "tracking_voice_stress": user.get("tracking_voice_stress", False),
        "goals_selected": user.get("goals_selected", []),
        "goals_custom": user.get("goals_custom")
    }


async def update_profile(db, user_id: str, patch: Dict[str, Any]) -> Dict[str, Any]:
    import logging
    logging.info(f"user_service.update_profile called for {user_id} patch={patch}")
    # update using uuid field if available
    query = {"user_id": user_id}
    try:
        result = await db.users.update_one(query, {"$set": patch})
        logging.info(f"update_one result matched={result.matched_count} modified={result.modified_count}")
    except Exception as e:
        logging.error(f"error updating by user_id: {e}")
        # fallback to _id updates
        try:
            query = {"_id": ObjectId(user_id)}
            result = await db.users.update_one(query, {"$set": patch})
            logging.info(f"fallback update result matched={result.matched_count} modified={result.modified_count}")
        except Exception as e2:
            logging.error(f"fallback update failed: {e2}")
    updated = await get_profile(db, user_id)
    logging.info(f"user_service.update_profile returning {updated}")
    return updated
