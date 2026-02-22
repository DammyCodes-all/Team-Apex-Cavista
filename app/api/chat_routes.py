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

    Possible error responses include:
    - 401 Unauthorized: invalid or missing token
    - 500 Internal Server Error: problem contacting LLM or service failure

    When the LLM provider cannot be reached a *successful* response is returned with
    a generic assistant message such as:
    "Sorry, I cannot reach the AI service right now. Please try again later." which
    should be treated as a transient service-unavailable signal by clients.

    Example error payloads:
    ```json
    { "error_type": "authentication", "detail": "Invalid user" }
    { "error_type": "service_error", "detail": "Chat service error: network unreachable" }
    ```
    """
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"error_type": "authentication", "detail": "Invalid user"})

    # call service
    try:
        reply = await chat_with_user(user_id, [m.model_dump() for m in payload.messages])
        return reply
    except Exception as exc:
        # bubble service errors as structured payload
        raise HTTPException(status_code=500, detail={"error_type": "service_error", "detail": f"Chat service error: {exc}"})
