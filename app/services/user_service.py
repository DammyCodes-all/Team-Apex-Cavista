from typing import Any, Dict

async def get_profile(db, user_id: str) -> Dict[str, Any]:
    user = await db.users.find_one({"_id": user_id})
    if not user:
        return {}
    user["id"] = str(user.get("_id"))
    return user


async def update_profile(db, user_id: str, patch: Dict[str, Any]) -> Dict[str, Any]:
    await db.users.update_one({"_id": user_id}, {"$set": patch})
    return await get_profile(db, user_id)
