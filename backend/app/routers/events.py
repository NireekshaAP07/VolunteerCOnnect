from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, database, services
from pydantic import BaseModel
import datetime

router = APIRouter(prefix="/events", tags=["events"])

class EventBase(BaseModel):
    title: str
    description: str
    location_name: str
    latitude: float = None
    longitude: float = None
    date_time: datetime.datetime
    volunteers_required: int
    skills_required: str = None
    perks: str = None
    food_provided: bool = False
    contact_details: str
    custom_appreciation: str = None
    ngo_id: str

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    category: str
    created_at: datetime.datetime

    class Config:
        orm_mode = True

@router.post("/", response_model=EventResponse)
async def create_event(event: EventCreate, db: Session = Depends(database.get_db)):
    # Use Gemini to improve description and categorize
    improved_desc = await services.gemini.improve_description(event.title, event.description)
    category = await services.gemini.categorize_event(improved_desc)
    
    db_event = models.Event(
        **event.dict(),
        description=improved_desc,
        category=category
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/", response_model=List[EventResponse])
def get_events(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    events = db.query(models.Event).offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(database.get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: int, event: EventCreate, db: Session = Depends(database.get_db)):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if db_event.title != event.title or db_event.description != event.description:
        try:
            improved_desc = await services.gemini.improve_description(event.title, event.description)
            category = await services.gemini.categorize_event(improved_desc)
            db_event.description = improved_desc
            db_event.category = category
        except Exception:
            db_event.description = event.description
    else:
        db_event.description = event.description

    db_event.title = event.title
    db_event.location_name = event.location_name
    db_event.latitude = event.latitude
    db_event.longitude = event.longitude
    db_event.date_time = event.date_time
    db_event.volunteers_required = event.volunteers_required
    db_event.skills_required = event.skills_required
    db_event.perks = event.perks
    db_event.food_provided = event.food_provided
    db_event.contact_details = event.contact_details
    db_event.custom_appreciation = event.custom_appreciation
    
    db.commit()
    db.refresh(db_event)
    return db_event
