"""
Lightweight wrapper that sends user messages to the configured LLM backend.

The service currently supports two options:

* a self‑hosted/local HTTP endpoint (`LOCAL_LLM_URL`), or
* Google Gemini (requires `GEMINI_API_KEY` and `GEMINI_MODEL`).

If neither is configured the function will raise a `RuntimeError`.
"""
from typing import List, Dict
from app.config.settings import settings
import logging
from datetime import datetime, timedelta

# simple per-user rate limiter (reset daily) – for production use a shared
# store such as Redis or persist in the user document in MongoDB.
_usage_counts: Dict[str, Dict] = {}

RATE_LIMIT_PER_DAY = 3


def _check_rate_limit(user_id: str) -> bool:
    """Return True if user is still within quota, False if exceeded."""
    now = datetime.utcnow()
    entry = _usage_counts.get(user_id)
    if not entry or entry["reset_at"] <= now:
        # start new window
        _usage_counts[user_id] = {"count": 0, "reset_at": now + timedelta(days=1)}
        entry = _usage_counts[user_id]
    return entry["count"] < RATE_LIMIT_PER_DAY


def _increment_usage(user_id: str):
    entry = _usage_counts.get(user_id)
    if not entry:
        _check_rate_limit(user_id)  # initializes
        entry = _usage_counts[user_id]
    entry["count"] += 1

import httpx
from httpx import HTTPStatusError, RequestError
from app.services.gemini_service import ask_gemini


def build_system_prompt() -> str:
    return (
        "You are a friendly preventive-health assistant. "
        "Provide supportive, non-medical guidance focused on sleep, exercise, "
        "stress, and wellbeing. Do not provide medical diagnoses or act as a "
        "doctor. Be concise and understandable."
    )
    
print("LOCAL_LLM_URL:", repr(settings.LOCAL_LLM_URL))
print("GEMINI_API_KEY:", repr(settings.GEMINI_API_KEY))
print("GEMINI_MODEL:", repr(settings.GEMINI_MODEL))

async def _truncate_content(text: str, max_chars: int = 500) -> str:
    """Shorten assistant content to avoid overly long replies."""
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rsplit(" ", 1)[0] + "…"


async def chat_with_user(user_id: str, messages: List[Dict]) -> Dict:
    """Route chat messages to the appropriate LLM backend.

    Returns a dict with `role`, `content`, and `provider` keys matching the
    format used by the endpoint.  Raises `RuntimeError` on failure.
    """
    # prepend system prompt
    system_message = {"role": "system", "content": build_system_prompt()}
    payload = [system_message] + messages

    # local inference has highest priority
    if getattr(settings, "LOCAL_LLM_URL", ""):
        url = settings.LOCAL_LLM_URL
        headers = {"Content-Type": "application/json"}
        data = {"messages": payload, "temperature": 0.7, "max_tokens": 500}
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                r = await client.post(url, json=data, headers=headers)
                r.raise_for_status()
                result = r.json()
            choice = result.get("choices", [])[0].get("message", {})
            return {"role": choice.get("role"), "content": choice.get("content"), "provider": "local"}
        except Exception as exc:
            logging.error(f"local LLM error: {exc}")
            raise

    # fall back to Gemini if configured
    if settings.GEMINI_API_KEY and settings.GEMINI_MODEL:
        # Gemini expects plain text; we only send the last user message
        user_text = messages[-1].get("content", "") if messages else ""
        try:
            ai_text = ask_gemini(user_text)
            return {"role": "assistant", "content": ai_text, "provider": "gemini"}
        except Exception:
            # propagate so the caller can turn it into an HTTP error
            raise

    # nothing to call
    raise RuntimeError("no LLM provider configured")
