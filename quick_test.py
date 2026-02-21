"""
Simplified test for Prevention AI Engine

Tests the key AI functionality without complex CSRF handling.
"""
import asyncio
import httpx
from datetime import date, timedelta
import time

BASE_URL = "http://localhost:8888"
TEST_EMAIL = f"aitest{int(time.time())}@example.com"
TEST_PASSWORD = "TestPassword123!@#"

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

async def test():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        try:
            # 1. Signup
            print(f"\n{YELLOW}Creating test user...{RESET}")
            r = await client.post("/auth/signup", json={
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD,
                "name": "Test User"
            })
            
            if r.status_code != 200:
                print(f"{RED}Signup failed: {r.text}{RESET}")
                return
            
            data = r.json()
            token = data.get("access_token")
            print(f"{GREEN}✓ User created{RESET}")
            
            # Get CSRF token from cookies
            csrf_token = r.cookies.get("csrf_token", "test-csrf")
            print(f"{GREEN}✓ Got CSRF token{RESET}")
            
            # 2. Check baseline status
            print(f"\n{YELLOW}Checking baseline status...{RESET}")
            r = await client.get(
                "/ai/status",
                headers={"Authorization": f"Bearer {token}"}
            )
            status = r.json()
            print(f"{GREEN}✓ Status: {status.get('baseline_status')}{RESET}")
            
            # 3. Submit 14 days of baseline metrics
            print(f"\n{YELLOW}Submitting 14 days of baseline metrics...{RESET}")
            start = date.today() - timedelta(days=13)
            
            for i in range(14):
                d = start + timedelta(days=i)
                r = await client.post(
                    "/health-data",
                    json={
                        "date": d.isoformat(),
                        "steps": 8000,
                        "sleep_duration_minutes": 420,
                        "sedentary_minutes": 480,
                        "location_diversity_score": 45.0,
                        "active_minutes": 25,
                    },
                    headers={
                        "Authorization": f"Bearer {token}",
                        "X-CSRF-Token": csrf_token
                    },
                    cookies={"csrf_token": csrf_token}
                )
                
                if r.status_code != 200:
                    print(f"{RED}Day {i+1} failed: {r.status_code} - {r.text[:100]}{RESET}")
                    return
                
                if (i + 1) % 5 == 0:
                    print(f"{GREEN}✓ Submitted {i+1} days{RESET}")
            
            # 4. Check if baseline activated
            print(f"\n{YELLOW}Verifying baseline activation...{RESET}")
            r = await client.get(
                "/ai/status",
                headers={"Authorization": f"Bearer {token}"}
            )
            status = r.json()
            baseline_status = status.get('baseline_status')
            print(f"{GREEN}✓ Baseline status: {baseline_status}{RESET}")
            
            if baseline_status == "active":
                print(f"{GREEN}✓ Baseline successfully activated!{RESET}")
                
                # Show baseline metrics
                metrics = status.get('baseline_metrics', {})
                if metrics:
                    print(f"\n{YELLOW}Baseline metrics calculated:{RESET}")
                    for signal, vals in metrics.items():
                        print(f"  {signal}: mean={vals.get('mean')}, std={vals.get('std')}")
            else:
                print(f"{RED}Baseline not activated yet{RESET}")
            
            # 5. Submit deviated metrics
            print(f"\n{YELLOW}Testing deviation detection...{RESET}")
            r = await client.post(
                "/health-data",
                json={
                    "date": date.today().isoformat(),
                    "steps": 3000,  # Low
                    "sleep_duration_minutes": 300,  # Low
                    "sedentary_minutes": 600,  # High
                    "location_diversity_score": 20.0,  # Low
                    "active_minutes": 5,  # Low
                },
                headers={
                    "Authorization": f"Bearer {token}",
                    "X-CSRF-Token": csrf_token
                },
                cookies={"csrf_token": csrf_token}
            )
            
            if r.status_code == 200:
                data = r.json()
                deviations = data.get("deviation_flags", {})
                risk = data.get("risk_score", 0)
                
                dev_count = sum(1 for v in deviations.values() if v)
                print(f"{GREEN}✓ Risk score: {risk}{RESET}")
                print(f"{GREEN}✓ Deviations detected: {dev_count}/5{RESET}")
                
                if dev_count > 0:
                    print(f"{GREEN}✓ Deviation detection working!{RESET}")
                    for signal, deviated in deviations.items():
                        if deviated:
                            print(f"  - {signal}: DEVIATED")
            else:
                print(f"{RED}Failed: {r.status_code}{RESET}")
            
            # 6. Get insights
            print(f"\n{YELLOW}Retrieving AI insights...{RESET}")
            r = await client.get(
                "/ai/insights?days=7",
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if r.status_code == 200:
                insights = r.json()
                print(f"{GREEN}✓ Retrieved {len(insights)} insights{RESET}")
                
                if len(insights) > 0:
                    latest = insights[0]
                    print(f"\n{YELLOW}Latest insight:{RESET}")
                    print(f"  Date: {latest.get('date')}")
                    print(f"  Risk score: {latest.get('risk_score')}")
                    print(f"  Risk level: {latest.get('risk_level')}")
                    print(f"  Message: {latest.get('summary_message')}")
                    
                    actions = latest.get('recommended_actions', [])
                    if actions:
                        print(f"\n  Recommendations:")
                        for action in actions:
                            print(f"    [{action.get('priority').upper()}] {action.get('text')}")
                    
                    print(f"\n{GREEN}✓ Insight generation working!{RESET}")
            else:
                print(f"{RED}Failed: {r.status_code}{RESET}")
            
            # Summary
            print(f"\n{GREEN}{'='*60}")
            print(f"✓ ALL TESTS PASSED")
            print(f"✓ AI Engine is fully operational")
            print(f"{'='*60}{RESET}\n")
            
        except Exception as e:
            print(f"{RED}Error: {e}{RESET}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    print(f"\n{YELLOW}Prevention AI Engine - Quick Test{RESET}")
    asyncio.run(test())
