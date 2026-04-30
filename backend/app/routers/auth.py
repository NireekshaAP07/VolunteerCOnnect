from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, database, schemas

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/verify", response_model=schemas.VerifyTokenResponse)
def verify_token(req: schemas.VerifyTokenRequest, db: Session = Depends(database.get_db)):
    # In a full implementation, we'd verify the Firebase JWT token here using firebase-admin.
    # For this MVP and without explicit keys provided, we treat the 'token' field as the UID 
    # to sync the user to our local SQLite DB.
    uid = req.token 
    
    user = db.query(models.User).filter(models.User.id == uid).first()
    
    if not user:
        user = models.User(
            id=uid,
            name=req.name,
            email=req.email,
            role=req.role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return {"status": "success", "user": user}

@router.get("/user/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/leaderboard", response_model=schemas.LeaderboardResponse)
def get_leaderboard(db: Session = Depends(database.get_db)):
    volunteers = db.query(models.User).filter(models.User.role == "volunteer").order_by(models.User.points.desc()).limit(10).all()
    return {"volunteers": volunteers}

@router.get("/public-profile/{user_id}", response_model=schemas.PublicProfileResponse)
def get_public_profile(user_id: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get completed attendance
    attendance = db.query(models.Attendance).filter(
        models.Attendance.user_id == user_id,
        models.Attendance.check_out != None
    ).all()
    
    impact_history = []
    for att in attendance:
        # Get NGO name
        ngo_name = "Unknown NGO"
        if att.event and att.event.ngo:
            ngo_name = att.event.ngo.name
            
        event_details = schemas.EventDetailsForCertificate(
            title=att.event.title,
            description=att.event.description,
            date_time=att.event.date_time,
            ngo_name=ngo_name,
            custom_appreciation=att.event.custom_appreciation
        )
        
        impact_history.append(schemas.AttendanceWithEventResponse(
            id=att.id,
            user_id=att.user_id,
            event_id=att.event_id,
            check_in=att.check_in,
            check_out=att.check_out,
            verified_by_ngo=att.verified_by_ngo,
            event_details=event_details
        ))
        
    return {
        "name": user.name,
        "points": user.points,
        "role": user.role,
        "impact_history": impact_history
    }
