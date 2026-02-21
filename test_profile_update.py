import asyncio
import httpx
import json

BASE_URL = "http://localhost:8888"

async def test_profile_update():
    async with httpx.AsyncClient() as client:
        # 1. Signup
        signup_payload = {
            "email": "testprofile@example.com",
            "password": "TestPassword123!",
            "name": "Test User"
        }
        print("\n1. Signing up...")
        signup_res = await client.post(f"{BASE_URL}/auth/signup", json=signup_payload)
        print(f"   Status: {signup_res.status_code}")
        print(f"   Cookies: {signup_res.cookies}")
        
        if signup_res.status_code != 200:
            print(f"   Error: {signup_res.text}")
            return
        
        # Extract access token from cookies
        access_token = signup_res.cookies.get("access_token")
        print(f"   Access token: {access_token[:20]}..." if access_token else "   No access token!")
        
        # 2. Update profile with the provided payload
        profile_payload = {
            "age": 19,
            "gender": "male",
            "goals_custom": "",
            "goals_selected": ["active", "focus", "health"],
            "height_cm": 193,
            "name": "Test",
            "tracking_screen_time": True,
            "tracking_sleep": True,
            "tracking_steps": True,
            "tracking_voice_stress": False,
            "weight_kg": 36
        }
        print("\n2. Updating profile...")
        print(f"   Payload: {json.dumps(profile_payload, indent=2)}")
        
        headers = {}
        if access_token:
            headers["Authorization"] = f"Bearer {access_token}"
        
        update_res = await client.put(
            f"{BASE_URL}/profile",
            json=profile_payload,
            headers=headers,
            cookies={"access_token": access_token} if access_token else {}
        )
        print(f"   Status: {update_res.status_code}")
        print(f"   Response: {json.dumps(update_res.json(), indent=2)}")
        
        if update_res.status_code != 200:
            print(f"   ERROR: {update_res.text}")
        else:
            print("   ✓ Profile updated successfully!")

if __name__ == "__main__":
    asyncio.run(test_profile_update())
