import os
import logging
from dotenv import load_dotenv

from app.config.settings import settings

load_dotenv()

# google-generativeai package
import google.generativeai as genai

# configure with key from settings/env
genai.configure(api_key=settings.GEMINI_API_KEY)

# note: the specific Gemini model may change based on settings.  We
# instantiate inside the function rather than once at import time so tests
# or runtime config changes can take effect.


def ask_gemini(user_message: str) -> str:
    """Ask the configured Gemini model to generate a reply.

    The underlying google-generativeai client can raise exceptions if the
    model name is invalid or the API key is wrong; we log and re-raise a
    `RuntimeError` so callers can treat it as a service failure.
    """
    # look up model name each call so tests can tweak settings
    model_name = getattr(settings, "GEMINI_MODEL", "gemini-1.0")
    try:
        # simple text-generation call; you can adapt for chat format
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(user_message)
        return response.text
    except Exception as exc:
        logging.error(f"Gemini request failed (model={model_name}): {exc}")
        # propagate original exception so caller can examine the message
        raise
