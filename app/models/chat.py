from pydantic import BaseModel
from typing import List, Dict


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str

    model_config = {
        "json_schema_extra": {
            "example": {"role": "user", "content": "How can I improve my sleep?"}
        }
    }


class ChatRequest(BaseModel):
    messages: List[ChatMessage]

    model_config = {
        "json_schema_extra": {
            "example": {"messages": [{"role": "user", "content": "How can I improve my sleep?"}]}
        }
    }


class ChatResponse(BaseModel):
    role: str
    content: str
    # optional metadata
    any: Dict = {}