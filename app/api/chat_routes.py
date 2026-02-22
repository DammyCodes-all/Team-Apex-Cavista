from fastapi import APIRouter, Depends, HTTPException, status
from app.models.chat import ChatRequest, ChatResponse
from app.models.error import ErrorResponse
from app.services.chat_service import chat_with_user
from app.services.gemini_service import ask_gemini
from app.services.chat_history_service import save_chat_message, get_chat_history
from app.config.settings import settings
from app.deps import get_current_user
from app.db.client import get_database

router = APIRouter(prefix="/ai/chat", tags=["ai"])


@router.get("/history")
async def chat_history(current_user=Depends(get_current_user), db=Depends(get_database)):
    """Retrieve recent chat messages for the user (latest first)."""
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"error_type":"authentication","detail":"Invalid user"})
    history = await get_chat_history(db, user_id)
    return history


@router.post("", response_model=ChatResponse,
             responses={
                 401: {"model": ErrorResponse},
                 503: {"model": ErrorResponse},
                 500: {"model": ErrorResponse},
             })
async def chat_endpoint(
    payload: ChatRequest,
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):
    """Send a list of messages to the AI assistant and get a single reply.

    Request body example:
    ```json
    {
      "messages": [
        {"role": "user", "content": "How can I improve my sleep?"}
      ]
    }
    ```

    Successful responses include an `any.provider` field indicating which
    LLM backend was used ("gemini" or "local").

    Possible error responses include:
    - 401 Unauthorized: invalid or missing token
    - 503 Service Unavailable: the configured LLM provider could not be reached
    - 500 Internal Server Error: other problem contacting model or service failure

    Earlier versions returned a fallback message on 200 when the model was
    unreachable; the new behaviour returns 503 with a structured error instead.

    Example error payloads:
    ```json
    { "error_type": "authentication", "detail": "Invalid user" }
    { "error_type": "service_unavailable", "detail": "LLM provider unreachable" }
    { "error_type": "service_error", "detail": "Chat service error: ..." }
    ```
    """
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"error_type": "authentication", "detail": "Invalid user"})

    # choose backend
    try:
        user_text = payload.messages[-1].content if payload.messages else ""
        # save user message
        await save_chat_message(db, user_id, "user", user_text)

        # Gemini is only invoked when both a key and a model name are
        # configured; otherwise continue to local endpoint if available.
        if settings.GEMINI_API_KEY and settings.GEMINI_MODEL:
            try:
                ai_reply = ask_gemini(user_text)
                reply = {"role": "assistant", "content": ai_reply, "any": {"provider": "gemini"}}
            except Exception as exc:
                # bubble up so the outer except will convert to 500
                raise
        else:
            reply = await chat_with_user(user_id, [m.model_dump() for m in payload.messages])
            if reply.get("provider"):
                reply.setdefault("any", {})["provider"] = reply.pop("provider")
        # store assistant message
        await save_chat_message(db, user_id, "assistant", reply.get("content", ""))
        return reply
    except RuntimeError as exc:
        # propagate the message so callers know why the LLM call failed
        msg = str(exc) or "LLM provider unreachable"
        raise HTTPException(
            status_code=503,
            detail={"error_type": "service_unavailable", "detail": msg}
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail={"error_type": "service_error", "detail": f"Chat service error: {exc}"})
