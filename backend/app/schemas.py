from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime

# --- AUTH SCHEMAS ---
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    college: Optional[str] = None
    department: Optional[str] = None
    year: Optional[str] = None
    career_goal: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    college: Optional[str]
    department: Optional[str]
    year: Optional[str]
    career_goal: Optional[str]
    weekly_hours: int
    is_onboarded: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- ONBOARDING & SKILLS ---
class UserSkillProficiency(BaseModel):
    name: str
    proficiency: int # 0 to 5

class OnboardingRequest(BaseModel):
    career_goal: str
    skills: List[UserSkillProficiency]
    weekly_study_hours: int

class UserSkillResponse(BaseModel):
    id: int
    skill_name: str
    proficiency: int
    is_current: bool

    class Config:
        from_attributes = True

# --- ROADMAP ---
class RoadmapTaskResponse(BaseModel):
    id: int
    week_number: int
    day_number: int
    title: str
    description: str
    task_type: str
    practice_problems: Optional[Any] = None
    mini_project: Optional[Any] = None
    difficulty: str
    time_estimate_mins: int
    is_completed: bool
    completed_at: Optional[datetime] = None
    xp_value: int

    class Config:
        from_attributes = True

class RoadmapResponse(BaseModel):
    id: int
    target_role: str
    duration_days: int
    generated_at: datetime
    is_active: bool
    ai_summary: Optional[str] = None
    tasks: List[RoadmapTaskResponse]

    class Config:
        from_attributes = True

class RoadmapGenerateRequest(BaseModel):
    target_role: str
    duration_days: int = 90

# --- TASK CHECKLIST & PROGRESS ---
class TaskProgressResponse(BaseModel):
    streak_count: int
    total_xp: int
    badges: List[str]

    class Config:
        from_attributes = True

# --- RESUME ANALYZER ---
class ResumeResponse(BaseModel):
    id: int
    filename: str
    ats_score: int
    missing_keywords: List[str]
    weak_sections: List[str]
    project_suggestions: List[str]
    improved_bullets: List[str]
    analyzed_at: datetime

    class Config:
        from_attributes = True

# --- ANALYTICS ---
class AnalyticsResponse(BaseModel):
    id: int
    date: datetime
    study_hours: float
    skill_growth_score: float
    readiness_score: float
    mock_test_score: float

    class Config:
        from_attributes = True

# --- COMMUNITY ---
class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: int
    post_id: int
    author_name: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class CommunityPostCreate(BaseModel):
    content: str

class CommunityPostResponse(BaseModel):
    id: int
    content: str
    author_name: str
    author_role: Optional[str] = None
    likes_count: int
    created_at: datetime
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True

# --- CHATBOT ---
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
