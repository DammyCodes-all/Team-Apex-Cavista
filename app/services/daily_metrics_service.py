"""
Daily Metrics Service for Prevention AI Data Ingestion.

Handles storage and management of daily passive health metrics.
This is the data source for baseline learning.
"""
from datetime import datetime, date
from typing import Optional, Dict, Any, List


async def store_daily_metrics(
    db,
    user_id: str,
    date_: date,
    steps: int,
    sleep_duration_minutes: int,
    sedentary_minutes: int,
    location_diversity_score: float,
    active_minutes: int,
    screen_time_minutes: int | None = None,
) -> Dict[str, Any]:
    """
    Store daily metrics for a user.
    
    If a record for this user+date already exists, upsert (update) it.
    
    Args:
        db: Motor AsyncIOMotorDatabase
        user_id: User ID
        date_: Date of metrics (YYYY-MM-DD)
        steps: Daily step count
        sleep_duration_minutes: Sleep duration in minutes
        sedentary_minutes: Sedentary time in minutes
        location_diversity_score: Location diversity (0-100)
        active_minutes: Active/exercise minutes
    
    Returns:
        Stored metrics document
    """
    now = datetime.utcnow()
    
    # Convert date_ (datetime.date) to a timezone-naive datetime at midnight for MongoDB
    date_dt = datetime(date_.year, date_.month, date_.day)

    metrics = {
        "user_id": user_id,
        "date": date_dt,
        "steps": steps,
        "sleep_duration_minutes": sleep_duration_minutes,
        "sedentary_minutes": sedentary_minutes,
        "location_diversity_score": location_diversity_score,
        "active_minutes": active_minutes,
        "screen_time_minutes": screen_time_minutes,
        "created_at": now,
        "updated_at": now,
    }
    
    # Upsert: if record exists for this user+date, update it; else create
    result = await db.daily_metrics.find_one_and_update(
        {"user_id": user_id, "date": date_dt},
        {"$set": metrics},
        upsert=True,
        return_document=True
    )
    
    return result


async def get_daily_metrics(
    db,
    user_id: str,
    date_: date
) -> Optional[Dict[str, Any]]:
    """Retrieve a user's metrics for a specific date."""
    date_dt = datetime(date_.year, date_.month, date_.day)
    return await db.daily_metrics.find_one({"user_id": user_id, "date": date_dt})


async def get_user_metrics_range(
    db,
    user_id: str,
    start_date: date,
    end_date: date
) -> List[Dict[str, Any]]:
    """
    Retrieve a user's metrics for a date range.
    
    Args:
        db: Motor AsyncIOMotorDatabase
        user_id: User ID
        start_date: Start date (inclusive)
        end_date: End date (inclusive)
    
    Returns:
        List of metrics documents, sorted by date ascending
    """
    # Convert date objects to datetimes for MongoDB queries
    start_dt = datetime(start_date.year, start_date.month, start_date.day)
    end_dt = datetime(end_date.year, end_date.month, end_date.day)

    cursor = db.daily_metrics.find({
        "user_id": user_id,
        "date": {"$gte": start_dt, "$lte": end_dt}
    }).sort("date", 1)
    
    return await cursor.to_list(length=None)


async def get_user_recent_metrics(
    db,
    user_id: str,
    days: int = 14
) -> List[Dict[str, Any]]:
    """
    Get the last N days of metrics for a user.
    
    Useful for baseline calculation.
    """
    from datetime import timedelta
    end = date.today()
    start = end - timedelta(days=days - 1)
    
    return await get_user_metrics_range(db, user_id, start, end)
