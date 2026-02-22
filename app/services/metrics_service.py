from datetime import datetime
import logging
from typing import Dict, Any
from app.models.metrics_model import MetricsCreate
from app.services.daily_metrics_service import store_daily_metrics, get_daily_metrics
from app.services.health_profile_service import get_health_profile, increment_baseline_days
from app.services.ai_service import (
    activate_baseline_if_ready,
    compute_daily_deviations,
    calculate_risk_score,
    generate_insights,
)
import logging

logger = logging.getLogger(__name__)


async def ingest_metrics(db, user_id: str, payload: MetricsCreate) -> Dict[str, Any]:
    """Store incoming metrics and run AI pipeline if baseline is active."""
    profile = await get_health_profile(db, user_id)
    if not profile:
        return {}

    metrics = await store_daily_metrics(
        db,
        user_id,
        payload.date,
        payload.steps,
        payload.sleep_duration_minutes,
        payload.sedentary_minutes,
        payload.location_diversity_score,
        payload.active_minutes,
        payload.screen_time_minutes if hasattr(payload, 'screen_time_minutes') else None,
    )

    # increment baseline counter if collecting
    activated = False
    if profile.get("baseline_status") == "collecting":
        new_profile = await increment_baseline_days(db, user_id)
        # check if activation happened on this insert
        if new_profile and new_profile.get("baseline_status") == "active":
            activated = True
            logger.info(f"Baseline activated for user {user_id} on metric insert")

    # if baseline already active or just activated, run AI pipeline
    if profile.get("baseline_status") == "active" or activated:
        try:
            deviation_flags = await compute_daily_deviations(db, user_id, metrics["_id"])
            risk_score = await calculate_risk_score(db, user_id, deviation_flags, metrics)
            await generate_insights(db, user_id, deviation_flags, risk_score)
            metrics["deviation_flags"] = deviation_flags
            metrics["risk_score"] = risk_score
            logger.info(f"AI engine processed metrics for user {user_id}. Risk score: {risk_score}")
        except Exception as e:
            logger.error(f"Error processing AI pipeline for user {user_id}: {e}", exc_info=True)
    return metrics


async def get_metrics_for_date(db, user_id: str, date_obj) -> Dict[str, Any]:
    return await get_daily_metrics(db, user_id, date_obj)
