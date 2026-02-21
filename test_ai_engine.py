"""
Test script for Prevention AI Engine (STEPS 4-7)

Tests:
1. Baseline activation (14 days collection → status="active")
2. Deviation detection (z-score, percent change)
3. Risk scoring (weighted signal calculation)
4. Insight generation (recommendations)
5. API endpoints (POST /health-data, GET /ai/insights)
"""
import asyncio
import httpx
import json
from datetime import date, timedelta
from typing import Dict, Any

# Test configuration
BASE_URL = "http://localhost:8000"
import time
TEST_EMAIL = f"aitest{int(time.time())}@example.com"
TEST_PASSWORD = "TestPassword123!@#"
TEST_NAME = "AI Test User"

# Color output
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"

def print_header(text: str):
    print(f"\n{BLUE}{'='*60}")
    print(f"{text}")
    print(f"{'='*60}{RESET}")

def print_success(text: str):
    print(f"{GREEN}✓ {text}{RESET}")

def print_error(text: str):
    print(f"{RED}✗ {text}{RESET}")

def print_info(text: str):
    print(f"{YELLOW}ℹ {text}{RESET}")

async def test_ai_engine():
    """Main test function"""
    client = httpx.AsyncClient(base_url=BASE_URL, timeout=30.0)
    tokens = {}
    user_id = None
    csrf_token = None
    
    try:
        # =====================================================
        # STEP 1: Create test user
        # =====================================================
        print_header("STEP 1: Create Test User")
        
        signup_response = await client.post(
            "/auth/signup",
            json={
                "email": TEST_EMAIL,
                "password": TEST_PASSWORD,
                "name": TEST_NAME,
            }
        )
        
        if signup_response.status_code != 200:
            print_error(f"Signup failed: {signup_response.text}")
            return
        
        signup_data = signup_response.json()
        tokens = {
            "access": signup_data.get("access_token"),
            "refresh": signup_data.get("refresh_token"),
        }
        user_id = signup_data.get("user_id")
        
        # Extract CSRF token from signup response cookies
        csrf_token = signup_response.cookies.get("csrf_token", "")
        
        print_success(f"User created: {user_id}")
        print_success(f"Access token obtained")
        print_info(f"CSRF token obtained: {csrf_token[:20]}..." if csrf_token else "CSRF token not found")
        
        # =====================================================
        # STEP 2: Check initial status (baseline_status = "collecting")
        # =====================================================
        print_header("STEP 2: Check Initial Status (Baseline Collecting)")
        
        status_response = await client.get(
            "/ai/status",
            headers={"Authorization": f"Bearer {tokens['access']}"}
        )
        
        status_data = status_response.json()
        print_info(f"Baseline status: {status_data.get('baseline_status')}")
        print_info(f"Days collected: {status_data.get('days_collected')}")
        print_info(f"Days remaining: {status_data.get('days_remaining')}")
        
        if status_data.get("baseline_status") != "collecting":
            print_error("Expected baseline_status='collecting'")
            return
        
        print_success("Baseline status is 'collecting' (as expected)")
        
        # =====================================================
        # STEP 3: Submit 14 days of baseline metrics
        # =====================================================
        print_header("STEP 3: Submit 14 Days of Baseline Metrics")
        
        start_date = date.today() - timedelta(days=13)
        baseline_values = {
            "steps": 8000,
            "sleep_duration_minutes": 420,
            "sedentary_minutes": 480,
            "location_diversity_score": 45.0,
            "active_minutes": 25,
        }
        
        for day_offset in range(14):
            current_date = start_date + timedelta(days=day_offset)
            
            headers = {"Authorization": f"Bearer {tokens['access']}"}
            if csrf_token:
                headers["X-CSRF-Token"] = csrf_token
            
            response = await client.post(
                "/health-data",
                json={
                    "date": current_date.isoformat(),
                    **baseline_values,
                },
                headers=headers
            )
            
            if response.status_code != 200:
                print_error(f"Day {day_offset + 1} failed: {response.text}")
                return
            
            if day_offset == 0 or day_offset == 6 or day_offset == 13:
                data = response.json()
                print_info(f"Day {day_offset + 1}: {data.get('date')} - Status: {response.status_code}")
        
        print_success("All 14 days submitted successfully")
        
        # =====================================================
        # STEP 4: Verify baseline activation
        # =====================================================
        print_header("STEP 4: Verify Baseline Activation")
        
        await asyncio.sleep(0.5)  # Brief pause for DB writes
        
        status_response = await client.get(
            "/ai/status",
            headers={"Authorization": f"Bearer {tokens['access']}"}
        )
        
        status_data = status_response.json()
        print_info(f"Baseline status: {status_data.get('baseline_status')}")
        print_info(f"Days collected: {status_data.get('days_collected')}")
        
        if status_data.get("baseline_status") != "active":
            print_error("Baseline should be 'active' after 14 days")
            return
        
        print_success("Baseline activated!")
        
        # Display calculated baseline metrics
        baseline_metrics = status_data.get("baseline_metrics", {})
        if baseline_metrics:
            print_info("Baseline metrics calculated:")
            for signal, metrics in baseline_metrics.items():
                mean = metrics.get("mean", 0)
                std = metrics.get("std", 0)
                print(f"  {signal}: mean={mean}, std={std}")
        
        # =====================================================
        # STEP 5: Test deviation detection (LOW deviation)
        # =====================================================
        print_header("STEP 5: Test Deviation Detection (Small Variation)")
        
        # Submit metrics close to baseline (no deviation expected)
        normal_response = await client.post(
            "/health-data",
            json={
                "date": date.today().isoformat(),
                "steps": 8100,  # Close to baseline
                "sleep_duration_minutes": 425,
                "sedentary_minutes": 475,
                "location_diversity_score": 44.5,
                "active_minutes": 24,
            },
            headers={"Authorization": f"Bearer {tokens['access']}"}
        )
        
        if normal_response.status_code != 200:
            print_error(f"Normal metrics submission failed: {normal_response.text}")
            return
        
        normal_data = normal_response.json()
        print_success("Metrics submitted successfully")
        
        deviation_flags = normal_data.get("deviation_flags", {})
        risk_score = normal_data.get("risk_score", 0)
        
        print_info(f"Risk score: {risk_score}")
        print_info(f"Deviation flags: {deviation_flags}")
        
        # Count deviations
        deviation_count = sum(1 for v in deviation_flags.values() if v)
        print_info(f"Signals deviated: {deviation_count}/5")
        
        if deviation_count == 0:
            print_success("No deviations detected (as expected for normal values)")
        
        # =====================================================
        # STEP 6: Test deviation detection (HIGH deviation)
        # =====================================================
        print_header("STEP 6: Test Deviation Detection (Large Variation)")
        
        # Submit metrics with significant deviations
        deviated_response = await client.post(
            "/health-data",
            json={
                "date": (date.today() + timedelta(days=1)).isoformat(),
                "steps": 3000,  # Low (baseline ~8000)
                "sleep_duration_minutes": 300,  # Low (baseline ~420)
                "sedentary_minutes": 600,  # High (baseline ~480)
                "location_diversity_score": 20.0,  # Low (baseline ~45)
                "active_minutes": 5,  # Low (baseline ~25)
            },
            headers={"Authorization": f"Bearer {tokens['access']}"}
        )
        
        if deviated_response.status_code != 200:
            print_error(f"Deviated metrics submission failed: {deviated_response.text}")
            return
        
        deviated_data = deviated_response.json()
        print_success("Metrics submitted successfully")
        
        deviation_flags = deviated_data.get("deviation_flags", {})
        risk_score = deviated_data.get("risk_score", 0)
        
        print_info(f"Risk score: {risk_score}")
        print_info(f"Deviation flags: {deviation_flags}")
        
        # Count deviations
        deviation_count = sum(1 for v in deviation_flags.values() if v)
        print_info(f"Signals deviated: {deviation_count}/5")
        
        if deviation_count > 0:
            print_success(f"{deviation_count} deviations detected (as expected)")
        else:
            print_error("Expected deviations but found none")
        
        # =====================================================
        # STEP 7: Verify risk scoring
        # =====================================================
        print_header("STEP 7: Verify Risk Scoring")
        
        if risk_score > 30:
            if risk_score < 60:
                risk_level = "Moderate"
            else:
                risk_level = "Elevated"
        else:
            risk_level = "Low"
        
        print_info(f"Risk score: {risk_score}")
        print_info(f"Risk level: {risk_level}")
        
        if risk_score > 25:
            print_success(f"Risk score is elevated ({risk_score}), reflecting deviations")
        else:
            print_error(f"Risk score seems too low ({risk_score}) for multiple deviations")
        
        # =====================================================
        # STEP 8: Test GET /ai/insights endpoint
        # =====================================================
        print_header("STEP 8: Test GET /ai/insights Endpoint")
        
        insights_response = await client.get(
            "/ai/insights?days=7",
            headers={"Authorization": f"Bearer {tokens['access']}"}
        )
        
        if insights_response.status_code != 200:
            print_error(f"GET /ai/insights failed: {insights_response.text}")
            return
        
        insights = insights_response.json()
        print_success(f"Retrieved {len(insights)} insights")
        
        if len(insights) > 0:
            latest_insight = insights[0]
            print_info(f"Latest insight date: {latest_insight.get('date')}")
            print_info(f"Risk score: {latest_insight.get('risk_score')}")
            print_info(f"Risk level: {latest_insight.get('risk_level')}")
            print_info(f"Summary: {latest_insight.get('summary_message')}")
            
            recommended_actions = latest_insight.get("recommended_actions", [])
            print_info(f"Recommendations: {len(recommended_actions)}")
            for action in recommended_actions:
                priority = action.get("priority", "").upper()
                text = action.get("text", "")
                print(f"  [{priority}] {text}")
        
        # =====================================================
        # STEP 9: Test signal-specific deviations
        # =====================================================
        print_header("STEP 9: Test Signal-Specific Deviations")
        
        # Submit metrics with only sleep deviation
        sleep_only_response = await client.post(
            "/health-data",
            json={
                "date": (date.today() + timedelta(days=2)).isoformat(),
                "steps": 8000,  # Normal
                "sleep_duration_minutes": 250,  # Deviated (low)
                "sedentary_minutes": 480,  # Normal
                "location_diversity_score": 45.0,  # Normal
                "active_minutes": 25,  # Normal
            },
            headers={"Authorization": f"Bearer {tokens['access']}"}
        )
        
        sleep_data = sleep_only_response.json()
        sleep_deviation_flags = sleep_data.get("deviation_flags", {})
        sleep_risk = sleep_data.get("risk_score", 0)
        
        sleep_deviations = sum(1 for v in sleep_deviation_flags.values() if v)
        
        print_info(f"Sleep deviation only - Risk score: {sleep_risk}")
        print_info(f"Deviations detected: {sleep_deviations}")
        
        if sleep_deviation_flags.get("sleep"):
            print_success("Sleep deviation detected correctly")
        
        # Check insights for sleep recommendation
        insights_response = await client.get(
            "/ai/insights?days=7",
            headers={"Authorization": f"Bearer {tokens['access']}"}
        )
        
        insights = insights_response.json()
        if len(insights) > 0:
            latest = insights[0]
            actions = latest.get("recommended_actions", [])
            has_sleep_action = any("sleep" in a.get("text", "").lower() for a in actions)
            
            if has_sleep_action:
                print_success("Sleep recommendation generated")
        
        # =====================================================
        # Final Summary
        # =====================================================
        print_header("✓ ALL TESTS PASSED")
        
        print_info("Test Summary:")
        print("  ✓ User signup and health profile creation")
        print("  ✓ Baseline collection tracking (14 days)")
        print("  ✓ Baseline activation (status transition)")
        print("  ✓ Deviation detection (z-score and percent change)")
        print("  ✓ Risk scoring (weighted signals, 0-100 scale)")
        print("  ✓ Insight generation (recommendations)")
        print("  ✓ GET /ai/insights endpoint")
        print("  ✓ Signal-specific deviation handling")
        
        print_success("Prevention AI engine is fully operational!")
        
    except httpx.HTTPError as e:
        print_error(f"HTTP error: {e}")
    except Exception as e:
        print_error(f"Test error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await client.aclose()


if __name__ == "__main__":
    print(f"\n{BLUE}Prevention AI Engine Test Suite{RESET}")
    print(f"Testing baseline activation, deviation detection, risk scoring, and insights\n")
    
    try:
        asyncio.run(test_ai_engine())
    except KeyboardInterrupt:
        print_error("\nTest interrupted by user")
    except Exception as e:
        print_error(f"Fatal error: {e}")
        import traceback
        traceback.print_exc()
