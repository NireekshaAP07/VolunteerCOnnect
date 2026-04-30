from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime
from .. import models, database, schemas

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.post("/checkin", response_model=schemas.AttendanceResponse)
def check_in(req: schemas.AttendanceCreate, user_id: str, db: Session = Depends(database.get_db)):
    attendance = db.query(models.Attendance).filter(
        models.Attendance.user_id == user_id,
        models.Attendance.event_id == req.event_id
    ).first()
    
    if not attendance:
        attendance = models.Attendance(
            user_id=user_id,
            event_id=req.event_id,
            check_in=datetime.datetime.utcnow()
        )
        db.add(attendance)
    else:
        if attendance.check_in:
            raise HTTPException(status_code=400, detail="Already checked in")
        attendance.check_in = datetime.datetime.utcnow()
        
    db.commit()
    db.refresh(attendance)
    return attendance

@router.post("/checkout", response_model=schemas.AttendanceResponse)
def check_out(req: schemas.AttendanceCreate, user_id: str, db: Session = Depends(database.get_db)):
    attendance = db.query(models.Attendance).filter(
        models.Attendance.user_id == user_id,
        models.Attendance.event_id == req.event_id
    ).first()
    
    if not attendance or not attendance.check_in:
        raise HTTPException(status_code=400, detail="Must check in first")
        
    if attendance.check_out:
        raise HTTPException(status_code=400, detail="Already checked out")
        
    attendance.check_out = datetime.datetime.utcnow()
    
    # Calculate points (Base 10 points per hour for MVP)
    duration_hours = (attendance.check_out - attendance.check_in).total_seconds() / 3600
    points_earned = int(duration_hours * 10)
    
    # Add points to user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.points = (user.points or 0) + max(10, points_earned) # minimum 10 points for participating
        
    attendance.verified_by_ngo = True # Auto verify for MVP
    
    db.commit()
    db.refresh(attendance)
    return attendance

@router.get("/event/{event_id}", response_model=List[schemas.AttendanceResponse])
def get_event_attendance(event_id: int, db: Session = Depends(database.get_db)):
    attendance = db.query(models.Attendance).filter(models.Attendance.event_id == event_id).all()
    return attendance

@router.get("/user/{user_id}", response_model=List[schemas.AttendanceWithEventResponse])
def get_user_attendance(user_id: str, db: Session = Depends(database.get_db)):
    attendances = db.query(models.Attendance).filter(models.Attendance.user_id == user_id).all()
    
    result = []
    for att in attendances:
        if att.event:
            ngo_name = "Unknown NGO"
            if att.event.ngo:
                ngo_name = att.event.ngo.name
                
            event_details = schemas.EventDetailsForCertificate(
                title=att.event.title,
                description=att.event.description,
                date_time=att.event.date_time,
                ngo_name=ngo_name,
                custom_appreciation=att.event.custom_appreciation
            )
            
            att_resp = schemas.AttendanceWithEventResponse(
                id=att.id,
                event_id=att.event_id,
                user_id=att.user_id,
                check_in=att.check_in,
                check_out=att.check_out,
                verified_by_ngo=att.verified_by_ngo,
                event_details=event_details
            )
            result.append(att_resp)
            
    return result
