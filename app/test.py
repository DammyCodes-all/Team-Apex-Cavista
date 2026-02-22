# app/test.py
import asyncio
import logging
from google import genai
from app.config.settings import settings

logging.basicConfig(level=logging.INFO)

def list_models():
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    print("Available models:")
    models = client.models.list()
    chat_models = []
    for m in models:
        name = m.name
        # pick models likely to support text chat
        if "flash" in name or "pro" in name:
            chat_models.append(name)
        print("-", name)
    return chat_models

async def test_chat(model_name="models/gemini-2.5-flash"):
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    try:
        # simple test message
        message = "Hello! Can you give a short wellness tip?"
        response = client.models.generate_content(
            model=model_name,
            contents=message
        )
        print("\n=== AI RESPONSE ===")
        print(response.text)
    except Exception as e:
        logging.exception("Gemini request failed")

if __name__ == "__main__":
    chat_models = list_models()
    print("\nSuggested chat models:", chat_models[:5])  # show top 5 suggestions

    # pick the first suggested model for testing
    model_to_use = chat_models[0] if chat_models else "models/gemini-2.5-flash"

    asyncio.run(test_chat(model_to_use))