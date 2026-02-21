from datetime import datetime, timedelta
from typing import Dict, Any, List

async def get_dashboard_data(db, user_id: str) -> Dict[str, Any]:
    """Aggregate latest data for dashboard polling.

    Returns a dict with keys described in architecture spec:
    - userName
    - steps
    - sleep
    - screenTime
    - activityBars
    - goals
    - insight
    """
    # fetch user info
    user = await db.users.find_one({"user_id": user_id})

    # latest daily metrics
    latest_metrics = await db.daily_metrics.find_one(
        {"user_id": user_id}, sort=[("date", -1)]
    )
    # last 7 days metrics for trend/sparkline
    end = datetime.utcnow()
    start = end - timedelta(days=6)
    cursor = db.daily_metrics.find({"user_id": user_id, "date": {"$gte": start}}).sort("date", 1)
    recent_metrics = await cursor.to_list(length=None)

    # latest insight
    latest_insight = await db.ai_insights.find_one(
        {"user_id": user_id}, sort=[("date", -1)]
    )

    profile = await db.health_profiles.find_one({"user_id": user_id})

    # build response
    data: Dict[str, Any] = {}
    data["userName"] = user.get("name") if user else None

    if latest_metrics:
        data["steps"] = latest_metrics.get("steps")
        # convert sleep minutes to hours string
        sleep_min = latest_metrics.get("sleep_duration_minutes", 0)
        data["sleep"] = f"{sleep_min//60}h {sleep_min%60}m"
        data["screenTime"] = latest_metrics.get("screen_time_minutes")
        # activity bars could be a list of values for plotting
        data["activityBars"] = [m.get("active_minutes", 0) for m in recent_metrics]
    else:
        data["steps"] = None
        data["sleep"] = None
        data["screenTime"] = None
        data["activityBars"] = []

    # goals from profile
    if profile:
        data["goals"] = profile.get("goals") or {}
        data["risk_score"] = profile.get("risk_score", 0)
    else:
        data["goals"] = {}
        data["risk_score"] = 0

    # insight summary
    if latest_insight:
        data["insight"] = {
            "summary": latest_insight.get("summary_message"),
            "actions": latest_insight.get("recommended_actions", []),
            "risk_score": latest_insight.get("risk_score"),
        }
    else:
        data["insight"] = None

    return data
