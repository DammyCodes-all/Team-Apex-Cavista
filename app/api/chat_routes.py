from fastapi import APIRouter, Depends, HTTPException, status
from app.models.chat import ChatRequest, ChatResponse
from app.services.chat_service import chat_with_user
from app.deps import get_current_user
from app.db.client import get_database

router = APIRouter(prefix="/ai/chat", tags=["ai"])


@router.post("", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest, current_user=Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    # call service
    reply = await chat_with_user(user_id, [m.model_dump() for m in payload.messages])
    return reply
