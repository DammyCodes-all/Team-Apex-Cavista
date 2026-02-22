import pytest

from app.services import chat_service


@ pytest.mark.asyncio
async def test_chat_service_connection_error(monkeypatch):
    """A RequestError from a local LLM call should be converted to RuntimeError."""
    # force the service to use the local URL path
    from app.config import settings
    settings.LOCAL_LLM_URL = "http://localhost/fake"

    async def fake_post(*args, **kwargs):
        raise chat_service.RequestError("timeout")

    # monkeypatch AsyncClient to use our fake
    class DummyClient:
        def __init__(self, *args, **kwargs):
            pass
        async def __aenter__(self):
            return self
        async def __aexit__(self, exc_type, exc, tb):
            pass
        async def post(self, *args, **kwargs):
            return await fake_post()

    monkeypatch.setattr(chat_service.httpx, "AsyncClient", lambda timeout: DummyClient())

    with pytest.raises(RuntimeError) as excinfo:
        await chat_service.chat_with_user("id", [])
    assert "connection error" in str(excinfo.value)


@ pytest.mark.asyncio
async def test_chat_service_http_status(monkeypatch):
    """HTTPStatusError with 401 from the local endpoint should map to auth failure."""
    from app.config import settings
    settings.LOCAL_LLM_URL = "http://localhost/fake"

    # create response-like object
    class DummyResponse:
        status_code = 401
    err = chat_service.HTTPStatusError("unauth", request=None, response=DummyResponse())

    async def fake_post(*args, **kwargs):
        raise err

    class DummyClient:
        def __init__(self, *args, **kwargs):
            pass
        async def __aenter__(self):
            return self
        async def __aexit__(self, exc_type, exc, tb):
            pass
        async def post(self, *args, **kwargs):
            return await fake_post()

    monkeypatch.setattr(chat_service.httpx, "AsyncClient", lambda timeout: DummyClient())

    with pytest.raises(RuntimeError) as excinfo:
        await chat_service.chat_with_user("id", [])
    assert "authentication failure" in str(excinfo.value)


def test_chat_service_no_provider():
    """When neither local nor Gemini are configured, a RuntimeError is raised."""
    from app.config import settings
    settings.LOCAL_LLM_URL = ""
    settings.GEMINI_API_KEY = ""
    settings.GEMINI_MODEL = ""
    with pytest.raises(RuntimeError) as excinfo:
        # sync call by running inside event loop
        import asyncio
        asyncio.get_event_loop().run_until_complete(chat_service.chat_with_user("id", []))
    assert "no LLM provider" in str(excinfo.value)
