"""
Prevention AI Service — Complete AI Engine

Handles:
1. Baseline activation (calculate mean/std after 14 days)
2. Deviation detection (z-score + percent change)
3. Risk scoring (weighted signal evaluation)
4. Insight generation (rule-based recommendations)
"""
from typing import Any, Dict, List, Optional
import logging
from datetime import datetime, timedelta, date
from bson import ObjectId
import statistics
import logging

logger = logging.getLogger(__name__)

# Weights for risk score calculation
SIGNAL_WEIGHTS = {
    "sleep_duration_minutes": 0.35,
    "steps": 0.25,
    "sedentary_minutes": 0.20,
    "location_diversity_score": 0.10,
    "active_minutes": 0.10,
}

# Thresholds for deviation detection
Z_SCORE_THRESHOLD = 1.5
PERCENT_CHANGE_THRESHOLD = 25.0  # 25%
CONSECUTIVE_DAYS_FOR_TREND = 3


# ==================================================
# STEP 4: Baseline Activation Logic
# ==================================================

async def activate_baseline_if_ready(db, user_id: str) -> bool:
    """
    Check if user has 14+ days of data collected.
    If yes, calculate baseline metrics and activate AI engine.
    
    Returns True if baseline was activated, False otherwise.
    """
    profile = await db.health_profiles.find_one({"user_id": user_id})
    if not profile:
        return False
    
    # Only process if still collecting
    if profile.get("baseline_status") != "collecting":
        return False
    
    days_collected = profile.get("baseline_days_collected", 0)
    if days_collected < 14:
        return False
    
    # Fetch last 14-21 days of metrics (use datetimes for MongoDB queries)
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=20)
    
    cursor = db.daily_metrics.find({
        "user_id": user_id,
        "date": {"$gte": start_date, "$lte": end_date}
    }).sort("date", 1)
    
    metrics_docs = await cursor.to_list(length=None)
    if len(metrics_docs) < 14:
        # Not enough data yet
        return False
    
    # Extract enabled signals from profile
    enabled_signals = profile.get("enabled_signals", {})
    
    # Calculate baseline metrics (mean and std)
    baseline_metrics = {}
    
    signal_mapping = {
        "steps": "steps",
        "sleep": "sleep_duration_minutes",
        "sedentary": "sedentary_minutes",
        "location": "location_diversity_score",
        "active_minutes": "active_minutes",
    }
    
    for signal_key, field_name in signal_mapping.items():
        if not enabled_signals.get(signal_key, True):
            # Signal disabled, skip
            continue
        
        values = []
        for doc in metrics_docs:
            val = doc.get(field_name)
            if val is not None and isinstance(val, (int, float)):
                values.append(float(val))
        
        if len(values) > 0:
            mean = statistics.mean(values)
            std = statistics.pstdev(values) if len(values) > 1 else 0.0
            baseline_metrics[signal_key] = {
                "mean": round(mean, 2),
                "std": round(std, 2),
            }
        else:
            baseline_metrics[signal_key] = {"mean": 0.0, "std": 0.0}
    
    # Update profile: set baseline metrics and activate
    await db.health_profiles.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "baseline_metrics": baseline_metrics,
                "baseline_status": "active",
                "updated_at": datetime.utcnow(),
            }
        }
    )
    
    logger.info(f"Baseline activated for user {user_id}. Metrics: {baseline_metrics}")
    return True


# ==================================================
# STEP 5: Deviation Detection Engine
# ==================================================

async def detect_deviations(
    db,
    user_id: str,
    current_value: float,
    signal_key: str,
    recent_values: Optional[List[float]] = None
) -> Dict[str, Any]:
    """
    Detect if a signal deviates from baseline using z-score and percent change.
    
    Args:
        db: MongoDB database
        user_id: User ID
        current_value: Latest value for the signal
        signal_key: Signal name (e.g., "steps", "sleep")
        recent_values: Last N values for trend analysis (optional)
    
    Returns:
        Deviation info: {
            "is_deviated": bool,
            "z_score": float,
            "pct_change": float,
            "reason": str
        }
    """
    profile = await db.health_profiles.find_one({"user_id": user_id})
    if not profile:
        return {"is_deviated": False, "z_score": 0.0, "pct_change": 0.0, "reason": "no_profile"}
    
    if profile.get("baseline_status") != "active":
        return {"is_deviated": False, "z_score": 0.0, "pct_change": 0.0, "reason": "baseline_not_active"}
    
    baseline_metrics = profile.get("baseline_metrics", {})
    signal_baseline = baseline_metrics.get(signal_key)
    
    if not signal_baseline:
        return {"is_deviated": False, "z_score": 0.0, "pct_change": 0.0, "reason": "no_baseline"}
    
    mean = signal_baseline.get("mean", 0.0)
    std = signal_baseline.get("std", 0.0)
    
    # Calculate z-score
    z_score = 0.0
    if std > 0:
        z_score = (current_value - mean) / std
    
    # Calculate percent change
    pct_change = 0.0
    if mean > 0:
        pct_change = ((current_value - mean) / mean) * 100.0
    
    # Check deviation thresholds
    is_deviated = False
    reason = "normal"
    
    if abs(z_score) > Z_SCORE_THRESHOLD:
        is_deviated = True
        reason = f"z_score_{abs(z_score):.2f}"
    
    if abs(pct_change) > PERCENT_CHANGE_THRESHOLD:
        is_deviated = True
        reason = f"pct_change_{abs(pct_change):.1f}%"
    
    # Trend analysis: check consecutive days (if provided)
    if recent_values and len(recent_values) >= CONSECUTIVE_DAYS_FOR_TREND:
        # Check if last 3 days all deviate in same direction
        recent_z_scores = []
        for val in recent_values[-CONSECUTIVE_DAYS_FOR_TREND:]:
            if std > 0:
                z = (val - mean) / std
            else:
                z = 0.0
            recent_z_scores.append(z)
        
        # All 3 days deviated in same direction
        if all(z > Z_SCORE_THRESHOLD for z in recent_z_scores) or \
           all(z < -Z_SCORE_THRESHOLD for z in recent_z_scores):
            is_deviated = True
            reason = "trend_deviation_3_days"
    
    return {
        "is_deviated": is_deviated,
        "z_score": round(z_score, 3),
        "pct_change": round(pct_change, 1),
        "reason": reason,
    }


async def compute_daily_deviations(
    db,
    user_id: str,
    daily_doc_id: ObjectId
) -> Dict[str, bool]:
    """
    Compute deviation flags for all signals in a daily metrics document.
    Store result in daily_metrics.deviation_flags.
    
    Returns:
        Dictionary of {signal_key: is_deviated}
    """
    daily_doc = await db.daily_metrics.find_one({"_id": daily_doc_id})
    if not daily_doc:
        return {}
    
    profile = await db.health_profiles.find_one({"user_id": user_id})
    if not profile or profile.get("baseline_status") != "active":
        return {}
    
    enabled_signals = profile.get("enabled_signals", {})
    
    deviation_flags = {}
    
    signal_mapping = {
        "steps": "steps",
        "sleep": "sleep_duration_minutes",
        "sedentary": "sedentary_minutes",
        "location": "location_diversity_score",
        "active_minutes": "active_minutes",
    }
    
    for signal_key, field_name in signal_mapping.items():
        if not enabled_signals.get(signal_key, True):
            continue
        
        current_value = daily_doc.get(field_name, 0)
        if current_value is None:
            current_value = 0
        
        # Optionally fetch recent values for trend analysis
        recent_values = None
        if field_name:
            cursor = db.daily_metrics.find({
                "user_id": user_id,
                "date": {"$lt": daily_doc.get("date")}
            }).sort("date", -1).limit(CONSECUTIVE_DAYS_FOR_TREND)
            recent_docs = await cursor.to_list(length=None)
            recent_values = [doc.get(field_name, 0) for doc in recent_docs]
        
        deviation_info = await detect_deviations(db, user_id, current_value, signal_key, recent_values)
        deviation_flags[signal_key] = deviation_info["is_deviated"]
    
    # Store deviation flags in daily metrics
    await db.daily_metrics.update_one(
        {"_id": daily_doc_id},
        {
            "$set": {
                "deviation_flags": deviation_flags,
                "updated_at": datetime.utcnow(),
            }
        }
    )
    
    return deviation_flags


# ==================================================
# STEP 6: Risk Score Calculation
# ==================================================

async def calculate_risk_score(
    db,
    user_id: str,
    deviation_flags: Dict[str, bool],
    daily_doc: Dict[str, Any]
) -> float:
    """
    Calculate risk score using weighted signal deviation.
    
    Weights:
    - sleep: 0.35
    - steps: 0.25
    - sedentary: 0.20
    - location: 0.10
    - active_minutes: 0.10
    
    Returns:
        Risk score (0-100)
    """
    profile = await db.health_profiles.find_one({"user_id": user_id})
    if not profile or profile.get("baseline_status") != "active":
        return 0.0
    
    baseline_metrics = profile.get("baseline_metrics", {})
    
    total_weighted_score = 0.0
    
    signal_mapping = {
        "steps": "steps",
        "sleep": "sleep_duration_minutes",
        "sedentary": "sedentary_minutes",
        "location": "location_diversity_score",
        "active_minutes": "active_minutes",
    }
    
    for signal_key, field_name in signal_mapping.items():
        if not deviation_flags.get(signal_key, False):
            # No deviation, no contribution to risk
            continue
        
        weight = SIGNAL_WEIGHTS.get(field_name, 0.0)
        
        current_value = daily_doc.get(field_name, 0)
        if current_value is None:
            current_value = 0
        
        signal_baseline = baseline_metrics.get(signal_key)
        if not signal_baseline:
            continue
        
        mean = signal_baseline.get("mean", 0.0)
        std = signal_baseline.get("std", 0.0)
        
        # Compute z-score
        z_score = 0.0
        if std > 0:
            z_score = (current_value - mean) / std
        
        # Cap z-score at 3 for impact
        intensity = min(3.0, abs(z_score))
        
        # Add weighted contribution
        total_weighted_score += weight * intensity
    
    # Normalize to 0-100 scale
    risk_score = min(100.0, total_weighted_score * 30)
    
    return round(risk_score, 1)


# ==================================================
# STEP 7: Insight Generator
# ==================================================

async def generate_insights(
    db,
    user_id: str,
    deviation_flags: Dict[str, bool],
    risk_score: float,
) -> Dict[str, Any]:
    """
    Generate AI insights based on deviations and risk score.
    
    Creates document in ai_insights collection with:
    - risk_score
    - summary_message
    - recommended_actions
    - created_at
    """
    profile = await db.health_profiles.find_one({"user_id": user_id})
    if not profile:
        logging.warning(f"generate_insights: no profile for {user_id}")
        return {}
    logging.info(f"generate_insights: called for {user_id} with risk_score={risk_score} and flags={deviation_flags}")
    
    # Determine risk level
    if risk_score < 30:
        risk_level = "Low"
    elif risk_score < 60:
        risk_level = "Moderate"
    else:
        risk_level = "Elevated"
    
    # Build recommendation list
    recommended_actions = []
    
    has_sleep_deviation = deviation_flags.get("sleep", False)
    has_steps_deviation = deviation_flags.get("steps", False)
    has_sedentary_deviation = deviation_flags.get("sedentary", False)
    has_location_deviation = deviation_flags.get("location", False)
    has_activity_deviation = deviation_flags.get("active_minutes", False)
    
    # Rule-based recommendations
    if has_sleep_deviation:
        recommended_actions.append({
            "id": "sleep_priority",
            "text": "Prioritize consistent sleep timing this week. Aim for your usual bedtime.",
            "priority": "high"
        })
    
    if has_steps_deviation and has_sedentary_deviation:
        recommended_actions.append({
            "id": "movement_breaks",
            "text": "Movement levels have declined. Consider 10-minute activity breaks every hour.",
            "priority": "high"
        })
    elif has_steps_deviation:
        recommended_actions.append({
            "id": "increase_steps",
            "text": "Add 2,000 steps to your daily routine with short walks.",
            "priority": "medium"
        })
    
    if has_sedentary_deviation:
        recommended_actions.append({
            "id": "reduce_sedentary",
            "text": "Reduce consecutive sitting time. Stand and stretch every 30 minutes.",
            "priority": "medium"
        })
    
    if has_location_deviation:
        recommended_actions.append({
            "id": "location_variety",
            "text": "Increase location variety. Visit different environments during the day.",
            "priority": "low"
        })
    
    if has_activity_deviation:
        recommended_actions.append({
            "id": "exercise_routine",
            "text": "Return to your regular exercise routine. Start with lighter activity.",
            "priority": "medium"
        })
    
    # Multiple deviations warning
    deviation_count = sum(1 for v in deviation_flags.values() if v)
    if deviation_count >= 3:
        summary_message = f"Your behavioral patterns show {deviation_count} significant deviations. Please review recommendations and consider adjustments."
    elif deviation_count > 0:
        summary_message = f"{risk_level} risk detected based on recent activity patterns. {len(recommended_actions)} recommendations provided."
    else:
        summary_message = "Your behavioral patterns are stable. Continue with your current routine."
        recommended_actions.append({
            "id": "maintain",
            "text": "Maintain your current healthy routine.",
            "priority": "low"
        })
    
    # Create insight document
    insight_doc = {
        "user_id": user_id,
        # store full datetime for insight date
        "date": datetime.utcnow(),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "summary_message": summary_message,
        "recommended_actions": recommended_actions,
        "deviation_flags": deviation_flags,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    # Store in ai_insights collection
    result = await db.ai_insights.insert_one(insight_doc)
    insight_doc["_id"] = result.inserted_id
    logging.info(f"generate_insights: inserted insight {insight_doc["_id"]} for {user_id}")
    # Update health_profile risk_score
    await db.health_profiles.update_one(
        {"user_id": user_id},
        {"$set": {"risk_score": risk_score, "updated_at": datetime.utcnow()}}
    )
    
    return insight_doc


async def get_latest_insights(db, user_id: str, days: int = 7) -> List[Dict[str, Any]]:
    """Retrieve latest AI insights for a user.

    We originally filtered by the past N days, but during rapid simulation the
    date field can be identical to `start_date` causing nothing to be returned.
    To avoid empty results we now return all insights for the user, sorted by
    date.
    """
    logging.info(f"get_latest_insights: querying for user {user_id}")
    cursor = db.ai_insights.find({"user_id": user_id}).sort("date", -1)
    return await cursor.to_list(length=None)
