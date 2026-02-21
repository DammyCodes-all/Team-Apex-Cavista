from fastapi import APIRouter
from app.controllers import auth as auth_controller
from app.controllers import profile as profile_controller
from app.controllers import health_data as health_controller
from app.controllers import ai_insights as ai_controller
from app.controllers import ai_status as ai_status_controller
from app.controllers import reports as reports_controller
from app.controllers import alerts as alerts_controller

router = APIRouter()
router.include_router(auth_controller.router)
router.include_router(profile_controller.router)
router.include_router(health_controller.router)
router.include_router(ai_controller.router)
router.include_router(ai_status_controller.router)
router.include_router(reports_controller.router)
router.include_router(alerts_controller.router)
