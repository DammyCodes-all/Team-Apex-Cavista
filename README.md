# Prevention AI — FastAPI backend (scaffold)

Quickstart

1. Create and activate virtualenv

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and update values

3. Run dev server

```bash
uvicorn app.main:app --reload
```

4. Run tests

```bash
pytest
```

AI Module
---------

This project includes an AI-ready behavioral risk monitoring module that is disabled by default via environment variables. The AI integration provides:

- Baseline modeling: learn a user's normal behavior over the first 2–3 weeks of passive metrics.
- Deviation detection: rolling z-score or percent deviation triggers alerts and recommended micro-actions.
- Structured AI insights returned from `GET /ai/insights` and included in exports from `GET /reports/download`.

Enable or configure AI using the `.env` keys:

- `ENABLE_AI_INSIGHTS` (true/false)
- `AI_MODEL_PATH` / `AI_MODEL_NAME` — path to model or identifier
- `OPENROUTER_MODEL` — chat model identifier used by OpenRouter (e.g. `openrouter-gpt4o-mini` or `deepseek/deepseek-chat-v3-0324:free`).
- `LOCAL_LLM_URL` *(optional)* — if set, the service will POST chat requests to a
  local inference server (e.g. text-generation-webui, llama.cpp HTTP API) instead
  of OpenRouter. Example: `http://localhost:8001/v1/chat/completions`.
- `GEMINI_MODEL` *(optional)* — when using Google Gemini (set `GEMINI_API_KEY`), you
  can override the default model name (e.g. `gemini-1.0` or `gemini-1.5`) to match
  your account's available models.
- `AI_MODEL_TYPE` — `baseline`, `risk`, or `prediction`
- `AI_REFRESH_INTERVAL_HOURS` — how often to refresh/retrain
- `DEVIATION_THRESHOLD` — z-score or percent threshold used for alerting
- `MAX_HISTORY_DAYS` — max days of historical data to consider
- `USE_SYNTHETIC_DATA` / `SIMULATION_MODE` — for testing and debug runs

### Dashboard

A lightweight dashboard API aggregates recent metrics, profile goals,
and the latest AI insight.  Use `GET /dashboard` for a one-off snapshot,
or open a websocket to `/dashboard/ws?token=<access>` to receive live pushes.
The payload always contains `steps` plus additional fields:
`sleep` (hours/minutes string), `screenTime` (minutes), `activityBars` (array
of recent active minutes), `goals` (object of chosen goals), `risk_score` (0‑100
value), and `insight` (object with `summary`, `actions`, `risk_score`).
If you later want to show not only steps but sleep hours, goal status, AI
insight summary, etc., simply read more fields from the same payload—they’re
all included by `get_dashboard_data`.

Websocket example:

```js
const ws = new WebSocket(`wss://your.api/dashboard/ws?token=${token}`);
ws.onmessage = e => {
  const data = JSON.parse(e.data);
  renderSteps(data.steps);
  // render other fields as desired
};
```

The server sends a new snapshot whenever metrics or insights change; clients
should always update the view on each message.

Privacy Notes
-------------

- Sensitive signals (voice, raw location) must be opted-in: only aggregated features are stored.
- The backend assumes on-device preprocessing for raw audio and location traces; only non-identifying aggregates are transmitted.

