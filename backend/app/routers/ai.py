from fastapi import APIRouter
from .. import schemas, services

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/enhance", response_model=schemas.AIResponse)
async def enhance_description(req: schemas.AIRequest):
    improved_text = await services.gemini.improve_description("Draft Event", req.text)
    return {"improved_text": improved_text, "category": None}

@router.post("/categorize", response_model=schemas.AIResponse)
async def categorize_event(req: schemas.AIRequest):
    category = await services.gemini.categorize_event(req.text)
    return {"improved_text": req.text, "category": category}
