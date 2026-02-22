"""
Direct AI pipeline test (no HTTP). Inserts baseline data into a test MongoDB
and runs the AI engine functions directly:
- activate_baseline_if_ready
- compute_daily_deviations
- calculate_risk_score
- generate_insights

Requires a running MongoDB at the URI in app.config.settings or mongodb://localhost:27017
"""
import asyncio
from datetime import date, datetime, timedelta
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings
import traceback

from app.services import ai_service

TEST_DB_NAME = "prevention_ai_test"

async def run():
    # Use configured MongoDB URI (reads from .env via Settings)
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[TEST_DB_NAME]

    user_id = str(ObjectId())
    print(f"Using test user_id={user_id}")

    try:
        # 1) Create health_profile in collecting state with 14 days collected
        profile = {
            "user_id": user_id,
            "baseline_status": "collecting",
            "baseline_days_collected": 14,
            "enabled_signals": {
                "steps": True,
                "sleep": True,
                "sedentary": True,
                "location": True,
                "active_minutes": True,
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        await db.health_profiles.insert_one(profile)
        print("Inserted health_profile (collecting, 14 days)")

        # 2) Insert 14 days of baseline daily_metrics
        start = date.today() - timedelta(days=13)
        baseline = {
            "steps": 8000,
            "sleep_duration_minutes": 420,
            "sedentary_minutes": 480,
            "location_diversity_score": 45.0,
            "active_minutes": 25,
        }

        docs = []
        for i in range(14):
            d = start + timedelta(days=i)
            # small noise
            doc = {
                "user_id": user_id,
                # store as datetime for MongoDB encoding
                "date": datetime(d.year, d.month, d.day),
                "steps": baseline["steps"] + (i % 5) * 10,
                "sleep_duration_minutes": baseline["sleep_duration_minutes"] + (i % 3) * 2,
                "sedentary_minutes": baseline["sedentary_minutes"] + (i % 4) * 3,
                "location_diversity_score": baseline["location_diversity_score"] + (i % 2) * 0.5,
                "active_minutes": baseline["active_minutes"] + (i % 3),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            }
            docs.append(doc)
        result = await db.daily_metrics.insert_many(docs)
        print(f"Inserted {len(result.inserted_ids)} baseline daily_metrics")

        # 3) Activate baseline
        activated = await ai_service.activate_baseline_if_ready(db, user_id)
        print(f"activate_baseline_if_ready returned: {activated}")

        prof = await db.health_profiles.find_one({"user_id": user_id})
        print("Profile after activation:", {"baseline_status": prof.get("baseline_status"), "baseline_metrics": prof.get("baseline_metrics")})

        # 4) Insert a deviating daily metrics document for today
        deviated = {
            "user_id": user_id,
            # store as datetime for MongoDB encoding
            "date": datetime(date.today().year, date.today().month, date.today().day),
            "steps": 3000,
            "sleep_duration_minutes": 300,
            "sedentary_minutes": 600,
            "location_diversity_score": 20.0,
            "active_minutes": 5,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        res = await db.daily_metrics.insert_one(deviated)
        daily_id = res.inserted_id
        print(f"Inserted deviated daily_metrics _id={daily_id}")

        # 5) Compute deviations
        deviation_flags = await ai_service.compute_daily_deviations(db, user_id, daily_id)
        print("Deviation flags:", deviation_flags)

        # 6) Fetch the daily doc and compute risk
        daily_doc = await db.daily_metrics.find_one({"_id": daily_id})
        risk = await ai_service.calculate_risk_score(db, user_id, deviation_flags, daily_doc)
        print(f"Calculated risk score: {risk}")

        # 7) Generate insight
        insight = await ai_service.generate_insights(db, user_id, deviation_flags, risk)
        print("Generated insight id:", insight.get("_id"))
        print("Insight summary:", insight.get("summary_message"))
        print("Recommended actions:")
        for a in insight.get("recommended_actions", []):
            print(" -", a.get("priority"), a.get("text"))

        # 8) Verify ai_insights entry exists
        insights = await db.ai_insights.find({"user_id": user_id}).to_list(length=10)
        print(f"ai_insights stored: {len(insights)}")

    except Exception as e:
        print("Error during test:")
        traceback.print_exc()
    finally:
        # Cleanup: drop test database
        await client.drop_database(TEST_DB_NAME)
        print(f"Dropped test database {TEST_DB_NAME}")
        client.close()

if __name__ == '__main__':
    asyncio.run(run())
