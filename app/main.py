from fastapi import FastAPI
import logging
from app.core.config import settings
from app.routers import router
from app.core.database import connect_to_mongo, close_mongo
from app.middleware.csrf import csrf_protect


def create_app() -> FastAPI:
    app = FastAPI(title="Prevention AI API")
    logging.basicConfig(level=logging.INFO)
    app.include_router(router)
    async def _startup() -> None:
        await connect_to_mongo(app)

    async def _shutdown() -> None:
        await close_mongo(app)

    app.add_event_handler("startup", _startup)
    app.add_event_handler("shutdown", _shutdown)
    # register csrf middleware
    app.middleware("http")(csrf_protect)
    return app


app = create_app()
