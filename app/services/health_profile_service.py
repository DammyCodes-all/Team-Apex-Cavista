"""
Health Profile Service for Prevention AI Baseline Setup.

Manages health profile creation, initialization, and updates.
Tracks the baseline collection phase.
"""
from datetime import datetime
from typing import Optional, Dict, Any
from app.models.health_profile import EnabledSignals, Goals, BaselineMetrics


async def create_health_profile(
    db,
    user_id: str,
    enabled_signals: Optional[EnabledSignals] = None,
    goals: Optional[Goals] = None
) -> Dict[str, Any]:
    """
    Create a new health profile for a user after signup.
    
    The profile initializes in "collecting" status and begins
    tracking baseline metrics.
    
    Args:
        db: Motor AsyncIOMotorDatabase instance
        user_id: User ID from auth
        enabled_signals: Health signals to monitor
        goals: User health goals
    
    Returns:
        The created health_profile document
    """
    now = datetime.utcnow()
    
    profile = {
        "user_id": user_id,
        "baseline_status": "collecting",
        "baseline_start_date": now,
        "baseline_days_collected": 0,
        "enabled_signals": (enabled_signals or EnabledSignals()).model_dump(),
        "goals": (goals or Goals()).model_dump(),
        "baseline_metrics": BaselineMetrics().model_dump(),
        "risk_score": 0.0,
        "created_at": now,
        "updated_at": now,
    }
    
    result = await db.health_profiles.insert_one(profile)
    profile["_id"] = result.inserted_id
    return profile


async def get_health_profile(db, user_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a user's health profile."""
    return await db.health_profiles.find_one({"user_id": user_id})


async def update_health_profile(
    db,
    user_id: str,
    update_data: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """
    Update a user's health profile.
    
    Args:
        db: Motor AsyncIOMotorDatabase
        user_id: User ID
        update_data: Fields to update (will set updated_at timestamp)
    
    Returns:
        Updated profile document
    """
    update_data["updated_at"] = datetime.utcnow()
    result = await db.health_profiles.find_one_and_update(
        {"user_id": user_id},
        {"$set": update_data},
        return_document=True
    )
    return result


async def increment_baseline_days(db, user_id: str) -> Optional[Dict[str, Any]]:
    """
    Increment the baseline_days_collected counter.
    
    Called after daily metrics are successfully stored.
    If baseline_days_collected reaches 14, transition to "active".
    """
    profile = await get_health_profile(db, user_id)
    if not profile:
        return None
    
    new_count = profile.get("baseline_days_collected", 0) + 1
    new_status = "active" if new_count >= 14 else "collecting"
    
    update = {
        "baseline_days_collected": new_count,
        "baseline_status": new_status,
        "updated_at": datetime.utcnow(),
    }
    
    return await update_health_profile(db, user_id, update)


async def get_baseline_status(db, user_id: str) -> Dict[str, Any]:
    """
    Get baseline learning status for the user.
    
    Returns baseline_status, baseline_days_collected, and user message.
    """
    profile = await get_health_profile(db, user_id)
    if not profile:
        return {
            "baseline_status": "not_initialized",
            "baseline_days_collected": 0,
            "message": "Health profile not yet created.",
        }
    
    days = profile.get("baseline_days_collected", 0)
    status = profile.get("baseline_status", "collecting")
    
    if status == "collecting":
        days_remaining = max(0, 14 - days)
        message = f"We are learning your behavioral baseline. Insights will activate after {days_remaining} more days of data."
    else:
        message = "Baseline learning complete. AI insights are now active."
    
    return {
        "baseline_status": status,
        "baseline_days_collected": days,
        "baseline_start_date": profile.get("baseline_start_date"),
        "message": message,
    }
