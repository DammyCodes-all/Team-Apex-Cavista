import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

import app.controllers.auth as auth_controller
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
async def test_login_new_device_requires_otp(monkeypatch):
    # mock authenticate_user to return tokens
    async def fake_auth(email, password):
        return {"access_token": "fake.access.token", "refresh_token": "fake.refresh.token"}

    monkeypatch.setattr(auth_controller, "authenticate_user", fake_auth)
    # mock verify_token to return user id
    async def fake_verify(token):
        return {"sub": "user123"}

    import app.utils.jwt as jwt_utils
    monkeypatch.setattr(jwt_utils, "verify_token", lambda t: {"sub": "user123"})
    # mock generate_device_otp
    import app.services.auth_service as auth_svc
    monkeypatch.setattr(auth_svc, "generate_device_otp", lambda db, uid, did: "123456")

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        app.dependency_overrides[deps.get_database] = lambda request=None: fake_get_db()
        # monkeypatch password hashing/verification to avoid bcrypt issues
        import app.services.auth_service as auth_svc
        auth_svc.get_password_hash = lambda p: "hashed-" + (p or "")
        auth_svc.verify_password = lambda plain, hashed: True
        resp = await ac.post("/auth/login", json={"email": "x@x.com", "password": "pass"})
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("status") == "otp_required"
        assert data.get("otp") == "123456"
        app.dependency_overrides.clear()
