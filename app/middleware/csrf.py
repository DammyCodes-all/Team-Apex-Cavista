from starlette.requests import Request
from starlette.responses import Response
from typing import Callable


async def csrf_protect(request: Request, call_next: Callable):
    # CSRF protection disabled for mobile app compatibility
    # Mobile clients use token-based authentication (Authorization: Bearer <token>)
    return await call_next(request)
