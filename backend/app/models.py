from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Firebase UID
    name = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String) # 'ngo' or 'volunteer'
    points = Column(Integer, default=0)
    location = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    events = relationship("Event", back_populates="ngo")
    registrations = relationship("Registration", back_populates="user")
    attendance = relationship("Attendance", back_populates="user")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    category = Column(String) # education, health, relief, etc.
    location_name = Column(String)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    date_time = Column(DateTime)
    volunteers_required = Column(Integer)
    skills_required = Column(String, nullable=True)
    perks = Column(String, nullable=True)
    food_provided = Column(Boolean, default=False)
    contact_details = Column(String)
    custom_appreciation = Column(String, nullable=True)
    ngo_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    ngo = relationship("User", back_populates="events")
    registrations = relationship("Registration", back_populates="event")
    attendance = relationship("Attendance", back_populates="event")

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    event_id = Column(Integer, ForeignKey("events.id"))
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    event_id = Column(Integer, ForeignKey("events.id"))
    check_in = Column(DateTime, nullable=True)
    check_out = Column(DateTime, nullable=True)
    verified_by_ngo = Column(Boolean, default=False)

    user = relationship("User", back_populates="attendance")
    event = relationship("Event", back_populates="attendance")
