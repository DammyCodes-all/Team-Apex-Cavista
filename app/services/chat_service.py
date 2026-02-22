"""
Simple chat service using an LLM.  By default this example uses OpenAI
GPT-4.1; you can swap in any other provider by modifying the `invoke_model`
function.
"""
from typing import List, Dict
from app.config.settings import settings

# import whichever client you prefer; OpenAI is used here as an example
import openai

# initialize the client once
openai.api_key = settings.OPENAI_API_KEY


def build_system_prompt() -> str:
    return (
        "You are a friendly preventive-health assistant. "
        "Provide supportive, non-medical guidance focused on sleep, exercise, "
        "stress, and wellbeing. Do not provide medical diagnoses or act as a "
        "doctor. Be concise and understandable."
    )


async def chat_with_user(user_id: str, messages: List[Dict]) -> Dict:
    """Send a chat request to the configured model.

    `messages` should be a list of dicts with `role` and `content` keys
    (same format as the OpenAI chat API). The function automatically prepends
    a system prompt and may optionally fetch context such as the latest
    AI insight for the user.
    """
    # optionally load context from DB
    # from app.db.client import get_database
    # db = get_database(None)
    # last_insight = await db.ai_insights.find_one({"user_id": user_id}, sort=[("date", -1)])
    # if last_insight:
    #     messages.insert(0, {"role": "system", "content": f"Latest risk score: {last_insight['risk_score']}"})

    # prepend system prompt
    system_message = {"role": "system", "content": build_system_prompt()}
    payload = [system_message] + messages

    resp = await openai.ChatCompletion.acreate(
        model="gpt-4.1",
        messages=payload,
        temperature=0.7,
        max_tokens=500,
    )
    choice = resp.choices[0].message
    return {"role": choice["role"], "content": choice["content"]}
