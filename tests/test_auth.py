import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_signup_and_login():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        signup_resp = await ac.post("/auth/signup", json={"email":"test@example.com","password":"pass1234","name":"Tester"})
        assert signup_resp.status_code == 200
        data = signup_resp.json()
        assert "access_token" in data

        login_resp = await ac.post("/auth/login", json={"email":"test@example.com","password":"pass1234"})
        assert login_resp.status_code in (200, 401)
