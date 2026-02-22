import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from datetime import date
import asyncio

# override dependencies for testing
from app import deps


async def fake_current_user():
    return {"_id": "fake-user-id", "email": "test@example.com"}


def fake_get_db(request=None):
    class FakeCursor:
        def __init__(self, items):
            self._items = items

        async def to_list(self, length):
            return self._items

    class FakeDB:
        def __init__(self):
            self.health = self
        def find(self, q):
            # return a cursor-like object with to_list
            return FakeCursor([])

    return FakeDB()


@pytest.mark.asyncio
async def test_ai_insights_endpoint(monkeypatch):
    app.dependency_overrides[deps.get_current_user] = lambda: asyncio.get_event_loop().create_future()
    # simpler override: return coroutine that returns the fake user
    async def _cu():
        return {"_id": "fake-user-id", "email": "test@example.com"}

    app.dependency_overrides[deps.get_current_user] = _cu
    app.dependency_overrides[deps.get_database] = lambda request=None: fake_get_db()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get("/ai/insights")
        assert resp.status_code == 200
        data = resp.json()
        assert "score" in data

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_metrics_and_dashboard_endpoints(monkeypatch):
    # provide fake user_id and dummy data
    async def _cu():
        return {"user_id": "fake-user-id", "email": "test@example.com"}
    app.dependency_overrides[deps.get_current_user] = _cu
    # fake db with minimal collections
    class DummyCursor:
        def __init__(self, items):
            self._items = items
        async def to_list(self, length):
            return self._items
    class DummyDB:
        def __init__(self):
            self.daily_metrics = self
            self.ai_insights = self
            self.health_profiles = self
            self.users = self
        def find_one(self, q, sort=None):
            # return simple dummy documents
            return {"user_id": "fake-user-id", "name": "Test"}
        def find(self, q):
            return DummyCursor([])
        async def insert_one(self, doc):
            class R: inserted_id = "id"; return R()
        async def update_one(self, *args, **kwargs):
            return None
    app.dependency_overrides[deps.get_database] = lambda request=None: DummyDB()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # metrics post should succeed with dummy DB
        resp = await ac.post("/metrics", json={
            "date": date.today().isoformat(),
            "steps": 1000,
            "sleep_duration_minutes": 480,
            "sedentary_minutes": 300,
            "location_diversity_score": 50.0,
            "active_minutes": 20
        })
        assert resp.status_code in (200, 500)
        # dashboard get should return some structure
        resp2 = await ac.get("/dashboard")
        assert resp2.status_code == 200
        data = resp2.json()
        assert "userName" in data

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_chat_endpoint_with_gemini_error(monkeypatch):
    """When a Gemini model is configured but fails, the route returns 500."""
    # set up fake user and db
    async def _cu():
        return {"user_id": "fake-user-id", "email": "test@example.com"}
    app.dependency_overrides[deps.get_current_user] = _cu
    app.dependency_overrides[deps.get_database] = lambda request=None: fake_get_db()

    from app.config import settings
    settings.GEMINI_API_KEY = "dummy"
    settings.GEMINI_MODEL = "invalid-model"

    from app.services import gemini_service
    # simulate underlying client error
    monkeypatch.setattr(gemini_service, "ask_gemini", lambda msg: (_ for _ in ()).throw(Exception("404 model not found")))

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post("/ai/chat", json={"messages": [{"role": "user", "content": "Hello"}]})
        assert resp.status_code == 500
        data = resp.json()
        assert data.get("error_type") == "service_error"

    app.dependency_overrides.clear()
