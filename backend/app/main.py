from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database
from .routers import events, auth, registrations, attendance, ai, chat
from .database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="VOlunteerConect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(registrations.router, prefix="/api")
app.include_router(attendance.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to VOlunteerConect API"}

# Basic Health Check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
