try:
    # pydantic v2 moved BaseSettings to the pydantic-settings package
    from pydantic_settings import BaseSettings
except Exception:
    from pydantic import BaseSettings


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
    OPENAI_API_KEY: str = ""

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

    class Config:
        env_file = ".env"


settings = Settings()
