from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI, Request
from typing import AsyncGenerator
from app.config.settings import settings


async def connect_to_mongo(app: FastAPI) -> None:
    app.state.mongo_client = AsyncIOMotorClient(settings.MONGODB_URI)
    app.state.db = app.state.mongo_client[settings.DATABASE_NAME]


async def close_mongo(app: FastAPI) -> None:
    client: AsyncIOMotorClient = app.state.mongo_client
    client.close()


def get_database(request: Request):
    return request.app.state.db
