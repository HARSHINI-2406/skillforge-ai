from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.models import User, UserSkill

router = APIRouter(prefix="/api/skills", tags=["skills"])

@router.get("/gap")
def get_skill_gap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_onboarded:
        raise HTTPException(status_code=400, detail="Onboarding has not been completed yet.")
        
    all_skills = db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()
    
    current_skills = [s for s in all_skills if s.is_current and s.proficiency > 0]
    missing_skills = [s for s in all_skills if not s.is_current or s.proficiency == 0]
    
    # Calculate match percentage
    total_required = len(all_skills)
    have_skills = len(current_skills)
    
    match_pct = int((have_skills / total_required) * 100) if total_required > 0 else 0
    
    # Predefined role explanations based on the target role
    role_explanations = {
        "Data Analyst": "You are strong in tools like Excel and basic SQL syntax, but you need to acquire skills in advanced analytics, statistical modeling, and dashboard tools like Power BI to be placement-ready.",
        "Software Engineer": "Your basic coding knowledge is good, but you have gaps in advanced data structures (Graphs, Trees) and object-oriented system design principles.",
        "Business Analyst": "You show excellent communication capabilities but need to strengthen your data modeling skills in SQL and dashboard representations in Power BI/Tableau.",
        "Product Manager": "You have a solid technical baseline but need to develop skills in product design, market research, wireframing, and product analytics metrics.",
        "UI/UX Designer": "Your visual design sense is good, but you need to practice building interactive prototypes, conducting user research, and wireframing UX flows.",
        "AI/ML Engineer": "You understand fundamental Python coding, but need to build proficiency in mathematical statistics, linear algebra, and training deep learning models."
    }
    
    explanation = role_explanations.get(
        current_user.career_goal,
        "You have some fundamental skills, but to reach your career goal, you need to follow your personalized study roadmap to address missing skills."
    )
    
    return {
        "target_role": current_user.career_goal,
        "match_percentage": match_pct,
        "current_skills": [{"name": s.skill_name, "proficiency": s.proficiency} for s in current_skills],
        "missing_skills": [{"name": s.skill_name, "proficiency": s.proficiency} for s in missing_skills],
        "ai_explanation": explanation
    }

@router.post("/update-proficiency")
def update_proficiency(
    skill_name: str,
    proficiency: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if proficiency < 0 or proficiency > 5:
        raise HTTPException(status_code=400, detail="Proficiency must be between 0 and 5.")
        
    skill = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_name.ilike(skill_name)
    ).first()
    
    if not skill:
        skill = UserSkill(
            user_id=current_user.id,
            skill_name=skill_name,
            proficiency=proficiency,
            is_current=True if proficiency > 0 else False
        )
        db.add(skill)
    else:
        skill.proficiency = proficiency
        skill.is_current = True if proficiency > 0 else False
        
    db.commit()
    return {"message": f"Proficiency for {skill_name} updated to {proficiency}"}
