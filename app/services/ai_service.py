from typing import Any, Dict, List, Tuple
from app.schemas.ai_insights import AIInsight, Driver, RecommendedAction
from datetime import datetime, timedelta
import statistics


def compute_baseline_from_series(values: List[float]) -> Tuple[float, float]:
    """Compute mean and stddev (population) from a list of numeric values.

    Returns (mean, stddev). If insufficient data, stddev=0.0.
    """
    if not values:
        return 0.0, 0.0
    mean = statistics.mean(values)
    std = statistics.pstdev(values) if len(values) > 0 else 0.0
    return mean, std


def compute_z_score(value: float, mean: float, std: float) -> float:
    if std == 0:
        return 0.0
    return (value - mean) / std


def detect_deviation_from_series(baseline_series: List[float], recent_series: List[float]) -> Dict[str, Any]:
    mean, std = compute_baseline_from_series(baseline_series)
    recent_mean = statistics.mean(recent_series) if recent_series else 0.0
    pct_change = 0.0
    if mean != 0:
        pct_change = (recent_mean - mean) / mean * 100.0
    z = compute_z_score(recent_mean, mean, std)
    return {"mean": mean, "std": std, "recent_mean": recent_mean, "pct_change": pct_change, "z": z}


async def generate_insights(db, user_id: str, days: int = 14) -> Dict[str, Any]:
    """Generate AI insights for the given user using stored aggregated metrics.

    This function queries `db.health` for aggregated features and computes a simple
    baseline (first N days) vs recent window comparisons to detect deviations.
    The implementation is intentionally lightweight and synchronous for clarity.
    """
    end = datetime.utcnow()
    start = end - timedelta(days=days)

    # Query aggregated health features (expect doc fields: type, value -> numeric or dict)
    cursor = db.health.find({"user_id": user_id, "timestamp": {"$gte": start, "$lte": end}})
    items = await cursor.to_list(length=1000)

    # Organize series per metric
    series_map: Dict[str, List[float]] = {}
    for it in items:
        t = it.get("type")
        v = it.get("value")
        if isinstance(v, (int, float)):
            series_map.setdefault(t, []).append(float(v))
        elif isinstance(v, dict):
            # pick a numeric key if present (e.g., 'total')
            if "total" in v and isinstance(v["total"], (int, float)):
                series_map.setdefault(t, []).append(float(v["total"]))

    drivers: List[Driver] = []
    score = 0.0
    for metric, values in series_map.items():
        # baseline: first half, recent: last half
        if len(values) < 2:
            continue
        split = max(1, int(len(values) * 0.5))
        baseline = values[:split]
        recent = values[split:]
        res = detect_deviation_from_series(baseline, recent)
        drivers.append(Driver(metric=metric, z=round(res["z"], 3), pct_change=round(res["pct_change"], 2)))
        score += abs(res["z"])

    overall_score = min(1.0, score / (len(drivers) or 1))

    # Simple rule-based recommendations
    recommended: List[RecommendedAction] = []
    for d in drivers:
        if d.metric == "steps" and d.z < -1.5:
            recommended.append(RecommendedAction(id="walk_more", text="Add two 10-minute walks today.", priority="high"))
        if d.metric == "sleep" and d.z < -1.5:
            recommended.append(RecommendedAction(id="sleep_earlier", text="Prioritize earlier bedtime for next 3 nights.", priority="high"))

    if not recommended:
        recommended.append(RecommendedAction(id="maintain", text="Maintain current routine.", priority="low"))

    insight = AIInsight(
        score=round(overall_score, 3),
        drivers=drivers,
        recommended_actions=recommended,
        explanation="Auto-generated insights based on recent deviations from baseline.",
        raw={"generated_at": datetime.utcnow().isoformat(), "metrics_evaluated": list(series_map.keys())},
    )
    return insight.model_dump()
