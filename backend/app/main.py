from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database
from .routers import events
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

app.include_router(events.router)

@app.get("/")
async def root():
    return {"message": "Welcome to VOlunteerConect API"}

# Basic Health Check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
