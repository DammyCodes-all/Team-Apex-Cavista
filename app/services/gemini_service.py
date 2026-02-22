import logging

from app.config.settings import settings

# new `google` package syntax (genai v1+) or older generativeai package
try:
    from google import genai
except ImportError:
    import google.generativeai as genai

# we will create a Client in ask_gemini; no global configuration required


def ask_gemini(user_message: str) -> str:
    """Ask the configured Gemini model to generate a reply.

    Uses the newer google-genai client API (`genai.Client`) rather than the
    older `GenerativeModel` helper.  This matches the sample you provided:

        from google import genai
        client = genai.Client()
        response = client.models.generate_content(...)

    Errors from the underlying client are logged and re-raised so callers can
    convert them into HTTP errors.
    """
    model_name = getattr(settings, "GEMINI_MODEL", "").strip()
    if not model_name:
        msg = "Gemini model not configured"
        logging.error(msg)
        raise RuntimeError(msg)
    if not settings.GEMINI_API_KEY:
        msg = "Gemini API key not configured"
        logging.error(msg)
        raise RuntimeError(msg)

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        resp = client.models.generate_content(
            model=model_name,
            contents=user_message,
        )
        return resp.text
    except Exception as exc:
        logging.error(f"Gemini request failed (model={model_name}): {exc}")
        raise
