from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.database import get_db
from app.models import User, UserSkill, TaskProgress, Analytics
from app.schemas import UserCreate, UserResponse, Token, OnboardingRequest
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_pw = get_password_hash(user_in.password)
    
    new_user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=hashed_pw,
        college=user_in.college,
        department=user_in.department,
        year=user_in.year,
        career_goal=user_in.career_goal,
        is_onboarded=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Initialize basic progress tracking
    progress = TaskProgress(user_id=new_user.id, streak_count=0, total_xp=0, badges=[])
    db.add(progress)
    
    # Add dummy analytics for chart rendering
    dates_offsets = [-4, -3, -2, -1, 0]
    import datetime as dt
    for offset in dates_offsets:
        date = datetime.utcnow() + dt.timedelta(days=offset)
        # Starting with baseline readiness score that will improve
        analytics_entry = Analytics(
            user_id=new_user.id,
            date=date,
            study_hours=1.5 + offset * 0.5 if offset >= -3 else 0.0,
            skill_growth_score=30.0 + offset * 5.0,
            readiness_score=40.0 + offset * 4.0,
            mock_test_score=45.0 + offset * 3.0
        )
        db.add(analytics_entry)
        
    db.commit()
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/onboard", response_model=UserResponse)
def onboard(onboard_in: OnboardingRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Update user fields
    current_user.career_goal = onboard_in.career_goal
    current_user.weekly_hours = onboard_in.weekly_study_hours
    current_user.is_onboarded = True
    
    # Clear existing skills and insert new ones
    db.query(UserSkill).filter(UserSkill.user_id == current_user.id).delete()
    
    for s in onboard_in.skills:
        skill_entry = UserSkill(
            user_id=current_user.id,
            skill_name=s.name,
            proficiency=s.proficiency,
            is_current=True
        )
        db.add(skill_entry)
        
    # Also add standard required skills for this career goal that are NOT yet set as current
    # Let's say: if target is Data Analyst, required skills are SQL, Excel, Python, Power BI, Statistics.
    # If user didn't list them or rated them 0, we can add them as target skills (is_current=False)
    role_skills = {
        "Data Analyst": ["SQL", "Excel", "Python", "Power BI", "Statistics", "Tableau", "Pandas"],
        "Software Engineer": ["Java", "DSA", "SQL", "React", "System Design", "Git", "OOP"],
        "Business Analyst": ["Excel", "SQL", "Power BI", "Communication", "Aptitude", "Tableau"],
        "Product Manager": ["Communication", "Product Strategy", "Analytics", "Wireframing", "Aptitude"],
        "UI/UX Designer": ["Figma", "Wireframing", "Prototyping", "User Research", "CSS"],
        "AI/ML Engineer": ["Python", "Machine Learning", "Deep Learning", "SQL", "Math", "Statistics"]
    }
    
    goal_skills = role_skills.get(onboard_in.career_goal, ["Communication", "Aptitude", "SQL"])
    user_skill_names = {s.name.lower() for s in onboard_in.skills}
    
    for req_skill in goal_skills:
        if req_skill.lower() not in user_skill_names:
            target_skill = UserSkill(
                user_id=current_user.id,
                skill_name=req_skill,
                proficiency=0,
                is_current=False # Target skill
            )
            db.add(target_skill)
            
    db.commit()
    db.refresh(current_user)
    return current_user
