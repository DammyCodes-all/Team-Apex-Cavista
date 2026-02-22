from fastapi import APIRouter, Depends, HTTPException, status
from app.models.chat import ChatRequest, ChatResponse
from app.models.error import ErrorResponse
from app.services.chat_service import chat_with_user
from app.deps import get_current_user
from app.db.client import get_database

router = APIRouter(prefix="/ai/chat", tags=["ai"])


@router.post("", response_model=ChatResponse,
             responses={
                 401: {"model": ErrorResponse},
                 503: {"model": ErrorResponse},
                 500: {"model": ErrorResponse},
             })
async def chat_endpoint(payload: ChatRequest, current_user=Depends(get_current_user)):
    """Send a list of messages to the AI assistant and get a single reply.

    Request body example:
    ```json
    {
      "messages": [
        {"role": "user", "content": "How can I improve my sleep?"}
      ]
    }
    ```

    Successful responses include an `any.provider` field indicating
    which LLM backend was used ("openai" or "openrouter").

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

    # call service
    try:
        reply = await chat_with_user(user_id, [m.model_dump() for m in payload.messages])
        # provider metadata added by service
        if reply.get("provider"):
            # move into `any` so it matches response model
            reply.setdefault("any", {})["provider"] = reply.pop("provider")
        return reply
    except RuntimeError as exc:
        # explicit LLM unavailability -> return 503
        raise HTTPException(
            status_code=503,
            detail={"error_type": "service_unavailable", "detail": "LLM provider unreachable"}
        )
    except Exception as exc:
        # bubble other service errors as structured payload
        raise HTTPException(status_code=500, detail={"error_type": "service_error", "detail": f"Chat service error: {exc}"})
