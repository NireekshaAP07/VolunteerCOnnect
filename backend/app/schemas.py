from pydantic import BaseModel
from typing import Optional, List
import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: str
    role: str
    location: Optional[str] = None

class UserCreate(UserBase):
    id: str  # Firebase UID

class UserResponse(UserBase):
    id: str
    points: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class LeaderboardResponse(BaseModel):
    volunteers: List[UserResponse]

# --- Registration Schemas ---
class RegistrationBase(BaseModel):
    event_id: int

class RegistrationCreate(RegistrationBase):
    pass

class RegistrationResponse(RegistrationBase):
    id: int
    user_id: str
    registered_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Attendance Schemas ---
class AttendanceBase(BaseModel):
    event_id: int

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    user_id: str
    check_in: Optional[datetime.datetime] = None
    check_out: Optional[datetime.datetime] = None
    verified_by_ngo: bool

    class Config:
        from_attributes = True

class EventDetailsForCertificate(BaseModel):
    title: str
    description: str
    date_time: datetime.datetime
    ngo_name: str
    custom_appreciation: Optional[str] = None

    class Config:
        from_attributes = True

class AttendanceWithEventResponse(AttendanceResponse):
    event_details: Optional[EventDetailsForCertificate] = None

    class Config:
        from_attributes = True

# --- Auth Schemas ---
class VerifyTokenRequest(BaseModel):
    token: str
    role: str
    name: str
    email: str

class VerifyTokenResponse(BaseModel):
    status: str
    user: UserResponse

class PublicProfileResponse(BaseModel):
    name: str
    points: int
    role: str
    impact_history: List[AttendanceWithEventResponse]

# --- AI Schemas ---
class AIRequest(BaseModel):
    text: str
    
class AIResponse(BaseModel):
    improved_text: str
    category: Optional[str] = None
