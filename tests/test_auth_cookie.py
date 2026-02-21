import pytest
from httpx import AsyncClient
from app.main import app

import app.controllers.auth as auth_controller


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

    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/auth/login", json={"email": "x@x.com", "password": "pass"})
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("status") == "otp_required"
        assert data.get("otp") == "123456"
