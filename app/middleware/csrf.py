from starlette.requests import Request
from starlette.responses import Response
from typing import Callable


async def csrf_protect(request: Request, call_next: Callable):
    # Only enforce on state-changing methods
    if request.method in ("POST", "PUT", "DELETE", "PATCH"):
        path = request.url.path
        # allow certain auth endpoints without CSRF (login/signup/verify-device)
        if path.startswith("/auth/login") or path.startswith("/auth/signup") or path.startswith("/auth/verify-device"):
            return await call_next(request)
        csrf_cookie = request.cookies.get("csrf_token")
        csrf_header = request.headers.get("x-csrf-token")
        if not csrf_cookie or not csrf_header or csrf_cookie != csrf_header:
            return Response(status_code=403, content="CSRF verification failed")
    return await call_next(request)
