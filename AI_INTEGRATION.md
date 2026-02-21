# AI Integration & Behavioral Risk Monitoring — Prevention AI

This document describes the AI integration plan, data flow, endpoints, privacy considerations, and testing guidance for the Prevention AI backend.

1. Overview
-----------

The AI module performs baseline modeling of a user's passive metrics and detects deviations that may indicate behavioral risk. It produces structured insights and recommended micro-actions (nudges) to help prevent adverse outcomes.

Key responsibilities:
- Build/maintain per-user baseline models (first 2–3 weeks of data)
- Compute rolling statistics (means, stddev, z-scores) and percent deviations
- Create alerts when deviations exceed `DEVIATION_THRESHOLD`
- Produce structured JSON insights consumed by clients and included in exports

2. Proposed Module Placement
----------------------------

- `services/ai_service.py` — async service that exposes:
  - `compute_baseline(user_id, metrics, history)`
  - `detect_deviation(user_id, recent_metrics)`
  - `generate_insights(user_id, range)`
  - `simulate_insights(user_id, params)` — for testing

- `schemas/ai_insights.py` — Pydantic shapes describing AI outputs (score, drivers, recommended actions)

3. Data Inputs & Aggregation
----------------------------

- Input metrics (aggregated only):
  - steps: total / per-day
  - movement patterns: activity counts and durations
  - sleep: total sleep time, sleep efficiency estimates
  - screen_time: daily totals, night-window usage
  - location variability: radius of gyration, entropy of places
  - voice stress: aggregated score (if opted-in and preprocessed on-device)

- Store only aggregated features in MongoDB (no raw GPS traces, no raw audio)
- Keep retention limits enforced using `MAX_HISTORY_DAYS`

4. Baseline Modeling
--------------------

- Baseline uses first 14–21 days for a rolling user-specific mean and stddev per metric.
- For sparse data, use exponentially weighted moving averages or fall back to population priors.
- Models are lightweight and can run in-process (Python/Numpy) or call out to a model server via `AI_MODEL_PATH`.

5. Deviation Detection
----------------------

- Compute z = (x - mu) / sigma for each metric.
- If `DEVIATION_THRESHOLD` is a float >1 it is treated as z-score threshold; if <1 it may be interpreted as percent change (configurable).
- Use rolling windows (e.g., 7-day average vs baseline mean) to reduce false positives.

6. Outputs (AI Insight schema)
-------------------------------

- `score`: overall risk score (0-1)
- `drivers`: list of metric drivers with z-scores and percent deviation
- `recommended_actions`: array of short actionable micro-actions (id, text, priority)
- `explanation`: human-readable rationale

Example insight (JSON):

{
  "score": 0.72,
  "drivers": [
    {"metric":"sleep_duration","z":-2.3,"pct_change":-28},
    {"metric":"steps","z":-1.8,"pct_change":-22}
  ],
  "recommended_actions": [
    {"id":"walk_more_10min","text":"Add two 10-minute walks today","priority":"medium"}
  ],
  "explanation":"Recent sleep and step reductions exceed personal baseline; suggest increased activity and sleep hygiene."
}

7. Endpoints & Data Flow
------------------------

- `POST /health-data` — store aggregated metrics (already present). Ensure server validates and stores features, not raw signals.
- `GET /ai/insights` — calls `ai_service.generate_insights` and returns JSON per `schemas/ai_insights`.
- `GET /alerts` — returns alerts produced by `ai_service.detect_deviation` and persisted by `alert_service`.
- `GET /reports/download?format=csv|pdf` — include AI insights in exported report.

8. Privacy & Ethics
-------------------

- Sensitive data (voice, location) must be explicitly opted-in by the user; store only aggregated features.
- On-device preprocessing is strongly recommended for raw signals.
- Provide an opt-out endpoint or toggle in profile for AI insights and any sensitive-signal processing.

9. Configuration (env vars — summary)
------------------------------------

- `ENABLE_AI_INSIGHTS` — master switch
- `AI_MODEL_PATH` / `AI_MODEL_NAME` — model resource
- `AI_MODEL_TYPE` — `baseline` / `risk` / `prediction`
- `AI_REFRESH_INTERVAL_HOURS` — retrain/refresh cadence
- `DEVIATION_THRESHOLD` — numeric threshold
- `MAX_HISTORY_DAYS` — retention window
- `USE_SYNTHETIC_DATA` / `SIMULATION_MODE` — testing flags

10. Testing & Validation
------------------------

- Unit test placeholders should cover:
  - baseline building from synthetic time series
  - deviation detection given controlled inputs
  - end-to-end insights generation

11. Deployment Notes
--------------------

- For heavy workloads or production ML, run AI functions in a separate worker process or model server, and call it asynchronously.
- Ensure AI refresh jobs are scheduled (e.g., Celery, APScheduler) respecting `AI_REFRESH_INTERVAL_HOURS`.
