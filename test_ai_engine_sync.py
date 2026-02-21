"""
Synchronous ASGI test runner using FastAPI TestClient.

Runs the main end-to-end HTTP checks against the app in-process.
"""
from fastapi.testclient import TestClient
from datetime import date, timedelta
import time

from app.main import app

TEST_EMAIL = f"aitest{int(time.time())}@example.com"
TEST_PASSWORD = "TestPassword123!@#"
TEST_NAME = "AI Test User"


def run_test():
    with TestClient(app) as client:
        # STEP 1: signup
        resp = client.post("/auth/signup", json={"email": TEST_EMAIL, "password": TEST_PASSWORD, "name": TEST_NAME})
        if resp.status_code != 200:
            print("Signup failed:", resp.text)
            return
        data = resp.json()
        access = data.get("access_token")
        csrf_token = resp.cookies.get("csrf_token", "")
        headers = {"Authorization": f"Bearer {access}"}
        if csrf_token:
            headers["X-CSRF-Token"] = csrf_token

        # STEP 2: ensure baseline collecting
        resp = client.get("/ai/status", headers=headers)
        if resp.status_code != 200:
            print("Status fetch failed", resp.text)
            return
        status = resp.json()
        print("Initial baseline_status:", status.get("baseline_status"))

        # STEP 3: submit 14 baseline days
        start_date = date.today() - timedelta(days=13)
        baseline_values = {
            "steps": 8000,
            "sleep_duration_minutes": 420,
            "sedentary_minutes": 480,
            "location_diversity_score": 45.0,
            "active_minutes": 25,
        }

        for i in range(14):
            d = start_date + timedelta(days=i)
            resp = client.post("/health-data", json={"date": d.isoformat(), **baseline_values}, headers=headers)
            if resp.status_code != 200:
                print(f"Day {i+1} submit failed:", resp.text)
                return

        print("Submitted 14 baseline days")

        # STEP 4: check baseline activated
        resp = client.get("/ai/status", headers=headers)
        if resp.status_code != 200:
            print("Status fetch failed after baseline", resp.text)
            return
        status = resp.json()
        print("Post-baseline status:", status.get("baseline_status"))

        # STEP 5: submit normal day
        resp = client.post("/health-data", json={"date": date.today().isoformat(), "steps": 8100, "sleep_duration_minutes": 425, "sedentary_minutes": 475, "location_diversity_score": 44.5, "active_minutes": 24}, headers=headers)
        print("Normal submit status", resp.status_code)
        print("Response:", resp.json())

        # STEP 6: submit deviated day
        resp = client.post("/health-data", json={"date": (date.today()+timedelta(days=1)).isoformat(), "steps": 3000, "sleep_duration_minutes": 300, "sedentary_minutes": 600, "location_diversity_score": 20.0, "active_minutes": 5}, headers=headers)
        print("Deviated submit status", resp.status_code)
        print("Response:", resp.json())

        # STEP 7: fetch insights
        resp = client.get("/ai/insights?days=7", headers=headers)
        print("Insights fetch status", resp.status_code)
        if resp.status_code == 200:
            print("Insights:", resp.json())


if __name__ == "__main__":
    run_test()
