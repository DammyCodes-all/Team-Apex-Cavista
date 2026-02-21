from fastapi import APIRouter
from app.controllers import auth as auth_controller

router = APIRouter()
router.include_router(auth_controller.router)
