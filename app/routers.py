from fastapi import APIRouter

# new structured api modules
from app.api import auth_routes, metrics_routes, dashboard_routes

# legacy controllers (kept for backward compatibility)
from app.controllers import auth as auth_controller
from app.controllers import profile as profile_controller
from app.controllers import health_data as health_controller
from app.controllers import ai_insights as ai_controller
from app.controllers import ai_status as ai_status_controller
from app.controllers import reports as reports_controller
from app.controllers import alerts as alerts_controller

router = APIRouter()
# include new API routers
router.include_router(auth_routes.router)
router.include_router(metrics_routes.router)
router.include_router(dashboard_routes.router)

# legacy endpoints (optional) - removed to prevent duplicates; functionality should be
# migrated into the new /api modules when needed.
