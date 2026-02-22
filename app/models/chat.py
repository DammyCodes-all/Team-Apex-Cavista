from pydantic import BaseModel
from typing import List, Dict


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    role: str
    content: str
    # optional metadata
    any: Dict = {}