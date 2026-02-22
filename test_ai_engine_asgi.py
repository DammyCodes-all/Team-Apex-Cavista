"""
ASGI HTTP end-to-end test runner for Prevention AI Engine.

Runs the same scenarios as `test_ai_engine.py` but uses an in-process ASGI client
so we don't need to start a separate uvicorn server. Useful for CI and local verification.
"""
import asyncio
import time
from datetime import date, timedelta
import httpx

from app.main import app as fastapi_app

from test_ai_engine import test_ai_engine as original_test_func


async def run_asgi_test():
    # Create an httpx AsyncClient bound to the ASGI app
    client = httpx.AsyncClient(app=fastapi_app, base_url="http://testserver", timeout=30.0)
    # Monkeypatch the client used in original test by replacing creation inside the test
    # The original test creates its own client; to avoid duplicating code, we'll import
    # and run the test logic but temporarily inject our ASGI client.

    # Simpler approach: replicate the high-level test flow but using same endpoints.
    # For clarity and maintainability, just call the original test function but ensure
    # that httpx uses our ASGI app by setting environment variable override is not trivial.

    # Instead, re-run the original test logic by executing the module-level function
    # but replace httpx.AsyncClient to return our ASGI client.
    import test_ai_engine as tia

    original_client_ctor = httpx.AsyncClient

    try:
        # Patch constructor to return our ASGI client
        def client_factory(*args, **kwargs):
            return client

        httpx.AsyncClient = client_factory

        # Run the original test
        await tia.test_ai_engine()

    finally:
        httpx.AsyncClient = original_client_ctor
        await client.aclose()


if __name__ == "__main__":
    try:
        asyncio.run(run_asgi_test())
    except KeyboardInterrupt:
        print("Test interrupted")
