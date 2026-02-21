from fastapi import FastAPI
import logging
from app.config.settings import settings
from app.routers import router
from app.db.client import connect_to_mongo, close_mongo


def create_app() -> FastAPI:
    app = FastAPI(title="Prevention AI API")
    logging.basicConfig(level=logging.INFO)
    app.include_router(router)
    app.add_event_handler("startup", lambda: connect_to_mongo(app))
    app.add_event_handler("shutdown", lambda: close_mongo(app))
    return app


app = create_app()
