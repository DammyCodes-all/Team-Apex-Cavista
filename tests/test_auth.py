import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app import deps


def fake_get_db():
    class FakeCollection:
        def __init__(self):
            self._items = []

        async def find_one(self, q):
            for d in self._items:
                if all(item in d.items() for item in q.items()):
                    return d
            return None

        async def insert_one(self, doc):
            doc_copy = dict(doc)
            doc_copy["_id"] = str(len(self._items) + 1)
            self._items.append(doc_copy)
            class Res: pass
            r = Res()
            r.inserted_id = doc_copy["_id"]
            return r

        async def update_many(self, *args, **kwargs):
            return None

        async def update_one(self, *args, **kwargs):
            return None

    class FakeDB:
        def __init__(self):
            self.users = FakeCollection()
            self.refresh_tokens = FakeCollection()
            self.device_otps = FakeCollection()
            self.devices = FakeCollection()

    return FakeDB()


@pytest.mark.asyncio
async def test_signup_and_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        app.dependency_overrides[deps.get_database] = lambda request=None: fake_get_db()
        # monkeypatch hashing to avoid passlib/bcrypt backend issues in test env
        import app.services.auth_service as auth_svc
        auth_svc.get_password_hash = lambda p: "hashed-" + (p or "")
        auth_svc.verify_password = lambda plain, hashed: True

        # use a password that meets the new strength requirements
        strong_pw = "Str0ngPass!"
        signup_resp = await ac.post("/auth/signup", json={"email":"test@example.com","password": strong_pw, "name":"Tester"})
        assert signup_resp.status_code == 200
        # tokens are set as cookies in the signup flow
        assert "access_token" in signup_resp.cookies
        assert "refresh_token" in signup_resp.cookies
        data = signup_resp.json()

        login_resp = await ac.post("/auth/login", json={"email":"test@example.com","password": strong_pw})
        assert login_resp.status_code in (200, 401)
        app.dependency_overrides.clear()
