from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services import gemini

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    response_text = await gemini.ask_assistant(request.message)
    return ChatResponse(response=response_text)
