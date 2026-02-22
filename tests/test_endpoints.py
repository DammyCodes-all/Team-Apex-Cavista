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
async def test_ai_insights_serialization(monkeypatch):
    """Ensure ObjectIds returned by the service are converted to strings."""
    async def _cu():
        return {"user_id": "fake-user-id", "email": "test@example.com"}
    app.dependency_overrides[deps.get_current_user] = _cu
    app.dependency_overrides[deps.get_database] = lambda request=None: fake_get_db()

    # healthy profile
    from app.services import health_profile_service
    async def fake_profile(db, uid):
        return {"user_id": uid, "baseline_status": "active", "baseline_days_collected": 14}
    monkeypatch.setattr(health_profile_service, "get_health_profile", fake_profile)

    # give insight with ObjectIds
    from bson import ObjectId
    async def fake_insights(db, uid, days):
        return [{"_id": ObjectId(), "user_id": ObjectId(), "date": "2026-02-22"}]
    from app.services import ai_service
    monkeypatch.setattr(ai_service, "get_latest_insights", fake_insights)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get("/ai/insights")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data[0]["_id"], str)
        assert isinstance(data[0]["user_id"], str)

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_ai_insights_date_filter(monkeypatch):
    """The `days` query parameter limits returned insights."""
    async def _cu():
        return {"user_id": "fake-user-id", "email": "test@example.com"}
    app.dependency_overrides[deps.get_current_user] = _cu
    app.dependency_overrides[deps.get_database] = lambda request=None: fake_get_db()

    from app.services import health_profile_service
    async def fake_profile(db, uid):
        return {"user_id": uid, "baseline_status": "active", "baseline_days_collected": 14}
    monkeypatch.setattr(health_profile_service, "get_health_profile", fake_profile)

    from datetime import datetime, timedelta
    now = datetime.utcnow()
    from bson import ObjectId
    async def fake_insights(db, uid, days):
        recent = {"_id": ObjectId(), "user_id": uid, "date": now.isoformat()}
        old = {"_id": ObjectId(), "user_id": uid, "date": (now - timedelta(days=10)).isoformat()}
        return [recent, old]
    from app.services import ai_service
    monkeypatch.setattr(ai_service, "get_latest_insights", fake_insights)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get("/ai/insights?days=3")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) == 1

    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_ai_insights_service_error(monkeypatch):
    """When the insights service throws, the route returns a 500 error."""
    async def _cu():
        return {"user_id": "fake-user-id", "email": "test@example.com"}
    app.dependency_overrides[deps.get_current_user] = _cu
    app.dependency_overrides[deps.get_database] = lambda request=None: fake_get_db()

    # override health_profile to simulate active baseline
    from app.services import health_profile_service
    async def fake_profile(db, uid):
        return {"user_id": uid, "baseline_status": "active", "baseline_days_collected": 14}
    monkeypatch.setattr(health_profile_service, "get_health_profile", fake_profile)

    # make insight service raise
    from app.services import ai_service
    async def bad_insights(db, uid, days):
        raise Exception("database down")
    monkeypatch.setattr(ai_service, "get_latest_insights", bad_insights)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get("/ai/insights")
        assert resp.status_code == 500
        data = resp.json()
        assert data.get("error_type") == "service_error"
        assert "database down" in data.get("detail", "")

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
            class R:
                inserted_id = "id"
            return R()
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


@pytest.mark.asyncio
async def test_chat_fallback_when_no_gemini_model(monkeypatch):
    """If GEMINI_MODEL is empty and no local URL is set we should get 503."""
    async def _cu():
        return {"user_id": "fake-user-id", "email": "test@example.com"}
    app.dependency_overrides[deps.get_current_user] = _cu
    app.dependency_overrides[deps.get_database] = lambda request=None: fake_get_db()

    from app.config import settings
    settings.GEMINI_API_KEY = "dummy"
    settings.GEMINI_MODEL = ""  # intentionally blank
    settings.LOCAL_LLM_URL = ""  # also blank

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post("/ai/chat", json={"messages": [{"role": "user", "content": "Hello"}]})
        assert resp.status_code == 503
        data = resp.json()
        assert data.get("error_type") == "service_unavailable"
        assert "no LLM provider" in data.get("detail", "")

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_reports_download_csv(monkeypatch):
    """CSV export endpoint returns a proper text/csv response."""
    async def _cu():
        return {"user_id": "fake-user-id", "email": "test@example.com"}
    app.dependency_overrides[deps.get_current_user] = _cu

    class DummyCursor:
        def __init__(self, items):
            self._items = items
        async def to_list(self, length):
            return self._items
        def sort(self, *args, **kwargs):
            return self
        async def __aiter__(self):
            for i in self._items:
                yield i

    class DummyDB:
        def __init__(self):
            self.health = self
        def find(self, q):
            return DummyCursor([{"timestamp": "2026-02-22T00:00:00", "type": "steps", "value": 1000}])
    app.dependency_overrides[deps.get_database] = lambda request=None: DummyDB()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get("/reports/download?format=csv")
        assert resp.status_code == 200
        assert "text/csv" in resp.headers.get("content-type", "")
        data = await resp.aread()
        assert b"timestamp,metric,value" in data

    app.dependency_overrides.clear()
