from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import (
    auth,
    skills,
    roadmap,
    resume,
    analytics,
    chat,
    community,
    assessment,
)

# =========================================================
# Create database tables
# =========================================================

Base.metadata.create_all(bind=engine)

# =========================================================
# FastAPI application
# =========================================================

app = FastAPI(
    title="SkillForge AI API",
    description="Backend API for SkillForge AI learning and career roadmaps",
    version="1.0.0",
)

# =========================================================
# CORS CONFIGURATION
# =========================================================

origins = [
    "https://skillforge-ai-frontend.onrender.com",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# Register API routers
# =========================================================

app.include_router(auth.router)
app.include_router(skills.router)
app.include_router(roadmap.router)
app.include_router(resume.router)
app.include_router(analytics.router)
app.include_router(chat.router)
app.include_router(community.router)
app.include_router(assessment.router)

# =========================================================
# Root endpoint
# =========================================================

@app.get("/")
def read_root():
    return {
        "status": "running",
        "project": "SkillForge AI",
        "message": "Backend is working successfully",
    }

# =========================================================
# Health check endpoint
# =========================================================

@app.get("/health")
def health_check():
    return {
        "ok": True,
        "service": "skillforge-backend",
    }

# =========================================================
# Ping endpoint
# =========================================================

@app.get("/ping")
def ping():
    return {
        "response": "pong"
    }

# =========================================================
# API information endpoint
# =========================================================

@app.get("/info")
def info():
    return {
        "name": "SkillForge AI API",
        "version": "1.0.0",
        "frontend": "https://skillforge-ai-frontend.onrender.com",
        "docs": "/docs",
    }

# =========================================================
# Debug endpoint for CORS testing
# =========================================================

@app.get("/cors-test")
def cors_test():
    return {
        "cors": "enabled",
        "allowed_origins": origins,
    }

# =========================================================
# Startup event
# =========================================================

@app.on_event("startup")
async def startup_event():
    print("====================================")
    print("SkillForge AI Backend Starting...")
    print("CORS Enabled for:")
    for origin in origins:
        print(f" - {origin}")
    print("====================================")

# =========================================================
# Shutdown event
# =========================================================

@app.on_event("shutdown")
async def shutdown_event():
    print("====================================")
    print("SkillForge AI Backend Shutting Down")
    print("====================================")

# =========================================================
# Example protected route placeholder
# =========================================================

@app.get("/api/example")
def example_route():
    return {
        "success": True,
        "message": "Example API route is working",
    }

# =========================================================
# Version endpoint
# =========================================================

@app.get("/version")
def version():
    return {
        "version": "1.0.0",
        "environment": "production",
    }