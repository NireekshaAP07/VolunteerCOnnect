from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, database, schemas

router = APIRouter(prefix="/registrations", tags=["registrations"])

@router.post("/", response_model=schemas.RegistrationResponse)
def register_for_event(req: schemas.RegistrationCreate, user_id: str, db: Session = Depends(database.get_db)):
    # Verify user and event
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    event = db.query(models.Event).filter(models.Event.id == req.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Check if already registered
    existing = db.query(models.Registration).filter(
        models.Registration.user_id == user_id, 
        models.Registration.event_id == req.event_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this event")
        
    registration = models.Registration(
        user_id=user_id,
        event_id=req.event_id
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)
    return registration

@router.get("/me", response_model=List[schemas.RegistrationResponse])
def get_my_registrations(user_id: str, db: Session = Depends(database.get_db)):
    registrations = db.query(models.Registration).filter(models.Registration.user_id == user_id).all()
    return registrations

@router.get("/event/{event_id}", response_model=List[schemas.RegistrationResponse])
def get_event_registrations(event_id: int, db: Session = Depends(database.get_db)):
    registrations = db.query(models.Registration).filter(models.Registration.event_id == event_id).all()
    return registrations
