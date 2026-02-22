import asyncio
import random
import logging
from datetime import datetime, timedelta, date
from typing import Dict

from app.services.metrics_service import ingest_metrics
from app.services.dashboard_service import get_dashboard_data
from app.utils.websocket_manager import manager
from app.models.metrics_model import MetricsCreate

# store state per user to simulate relative changes
_sim_state: Dict[str, Dict] = {}


async def start_simulation(db, user_id: str):
    """Begin a background simulation task for `user_id`.  This loops forever
    until the event loop stops or the profile is removed.  The caller must
    supply the Motor database instance (`db`) since this runs off the normal
    request path.
    """

    logging.info(f"simulation task started for {user_id}")
    # initial state
    state = _sim_state.setdefault(user_id, {
        "last_date": date.today(),
        "sim_date": date.today() - timedelta(days=14),  # start 14 days in past
        "steps": random.randint(1000, 5000),
        "sedentary": 8 * 60,
        "active": 0,
        "screen": random.randint(60, 180),
    })

    while True:
        try:
            now = datetime.utcnow()
            # roll over to next day at midnight UTC
            if now.date() != state["last_date"]:
                state["last_date"] = now.date()
                # simulate sleep once per day
                state["sleep"] = random.randint(360, 480)  # 6-8 hours
                state["screen"] = 0

            # step increment: 3-12 per tick with chance of burst
            incr = random.randint(3, 12)
            if random.random() < 0.1:
                incr += random.randint(20, 100)
            state["steps"] += incr

            # sedentary increases if no steps
            if incr < 5:
                state["sedentary"] += 5
            else:
                state["sedentary"] = max(0, state["sedentary"] - incr//2)

            # active minutes accumulate with bursts
            state["active"] += incr // 10

            # screen time increases gradually, faster in "evening" UTC
            if 18 <= now.hour <= 23:
                state["screen"] += random.randint(1, 5)
            else:
                state["screen"] += random.randint(0, 2)

            # build metrics payload
            # choose a date for the metric; advance simulation date until real today
            sim_date = state.get("sim_date", now.date())
            payload = MetricsCreate(
                date=sim_date,
                steps=state["steps"],
                sleep_duration_minutes=state.get("sleep", 0),
                sedentary_minutes=state["sedentary"],
                location_diversity_score=random.uniform(20, 80),
                active_minutes=state["active"],
                screen_time_minutes=state["screen"],
            )
            # increment sim_date by one day, but not beyond today
            if sim_date < now.date():
                state["sim_date"] = sim_date + timedelta(days=1)

            # ingest via service
            await ingest_metrics(db, user_id, payload)

            # send dashboard update via websocket
            dash = await get_dashboard_data(db, user_id)
            await manager.send_dashboard_update(user_id, dash)

            await asyncio.sleep(5)
        except Exception as exc:
            logging.error(f"simulation error for {user_id}: {exc}")
            await asyncio.sleep(5)
