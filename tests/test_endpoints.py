import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
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
