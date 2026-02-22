# pydantic v2 separates settings into the pydantic-settings package
# we depend directly on it so the import never fails.
from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "prevention_ai"
    JWT_SECRET: str = "super-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # SMTP / delivery
    SENDER_EMAIL: str = ""
    SMTP_URL: str = "smtp://localhost:1025"
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    # AI / LLM Keys
    # Gemini is the preferred provider; set `GEMINI_API_KEY` and `GEMINI_MODEL`
    # (see below).  A local inference endpoint may also be configured via
    # `LOCAL_LLM_URL`.

    # NOTE: OpenRouter-related settings have been removed.  They may still
    # appear in older .env files but are ignored.

    # optional local inference endpoint; if set, chat_service will POST to this
    # URL instead of calling OpenRouter. Useful when running a self-hosted model
    # (text-generation-webui, llama.cpp server, etc.). Example:
    # LOCAL_LLM_URL: str = "http://localhost:8001/v1/chat/completions"
    LOCAL_LLM_URL: str = ""
    GEMINI_API_KEY: str = ""  # Google Gemini API key, optional
    # model identifier for Gemini; **must be set** when using Gemini.
    # leave empty to disable Gemini and fall back to OpenRouter/local model.
    GEMINI_MODEL: str = ""  # e.g. "gemini-1.5" or "gemini-1.5-pro"
    # Deprecated variables (ignored): OPENROUTER_API_KEY, OPENROUTER_MODEL, LLM_PROVIDER

    # Runtime flags
    ENV: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "info"

    # AI / behavioral risk monitoring
    AI_MODEL_PATH: str = ""
    AI_MODEL_NAME: str = ""
    AI_MODEL_TYPE: str = "baseline"
    AI_REFRESH_INTERVAL_HOURS: int = 24
    ENABLE_AI_INSIGHTS: bool = True
    DEVIATION_THRESHOLD: float = 2.0
    MAX_HISTORY_DAYS: int = 90
    USE_SYNTHETIC_DATA: bool = False
    SIMULATION_MODE: bool = False

    # ignore extra environment variables such as deprecated OpenRouter keys
    # and load values from .env
    model_config = ConfigDict(extra="ignore", env_file=".env")


settings = Settings()
