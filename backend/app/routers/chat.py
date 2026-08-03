from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database import get_db
from app.auth import get_current_user
from app.models import User, UserSkill
from app.schemas import ChatRequest, ChatResponse
from app.ai import chat_with_mentor

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/message", response_model=ChatResponse)
def chat_message(
    req: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch current user details to contextualize the AI response
    user_skills = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.proficiency > 0
    ).all()
    skills_list = [s.skill_name for s in user_skills]
    
    user_profile = {
        "name": current_user.full_name,
        "career_goal": current_user.career_goal or "Software Engineer",
        "skills": skills_list,
        "weekly_hours": current_user.weekly_hours
    }
    
    # We will pass an empty history for now, or the frontend can send history if needed.
    # In this case, we just handle a single question with basic background context.
    response_text = chat_with_mentor([], req.message, user_profile)
    
    return {"response": response_text}
