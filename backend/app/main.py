from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, skills, roadmap, resume, analytics, chat, community

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillForge AI API",
    description="Backend API for SkillForge AI learning and career roadmaps",
    version="1.0.0"
)

# Enable CORS for frontend integrations
from fastapi.middleware.cors import CORSMiddleware


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(skills.router)
app.include_router(roadmap.router)
app.include_router(resume.router)
app.include_router(analytics.router)
app.include_router(chat.router)
app.include_router(community.router)

@app.get("/")
def read_root():
    return {"status": "running", "project": "SkillForge AI"}
