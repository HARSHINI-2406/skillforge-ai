from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Roadmap, RoadmapTask, UserSkill, TaskProgress, Analytics
from app.schemas import RoadmapResponse, RoadmapGenerateRequest
from app.ai import generate_roadmap_with_ai

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])

@router.get("/active", response_model=RoadmapResponse)
def get_active_roadmap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    roadmap = db.query(Roadmap).filter(
        Roadmap.user_id == current_user.id,
        Roadmap.is_active == True
    ).first()
    
    if not roadmap:
        raise HTTPException(status_code=404, detail="No active roadmap found. Generate one first!")
    return roadmap

@router.post("/generate", response_model=RoadmapResponse)
def generate_roadmap(req: RoadmapGenerateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Deactivate previous active roadmaps
    db.query(Roadmap).filter(
        Roadmap.user_id == current_user.id
    ).update({"is_active": False})
    
    # Fetch current skills
    current_skills = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.is_current == True
    ).all()
    skill_names = [s.skill_name for s in current_skills]
    
    # Generate roadmap via AI (or high-fidelity mock fallback)
    roadmap_data = generate_roadmap_with_ai(req.target_role, req.duration_days, skill_names)
    
    # Create new Roadmap in database
    new_roadmap = Roadmap(
        user_id=current_user.id,
        target_role=req.target_role,
        duration_days=req.duration_days,
        is_active=True,
        ai_summary=roadmap_data.get("ai_summary", "")
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    
    # Save tasks
    for week_data in roadmap_data.get("weeks", []):
        week_num = week_data.get("week")
        for day_data in week_data.get("days", []):
            task = RoadmapTask(
                roadmap_id=new_roadmap.id,
                week_number=week_num,
                day_number=day_data.get("day"),
                title=day_data.get("title"),
                description=day_data.get("desc"),
                task_type=day_data.get("type", "Learn"),
                practice_problems=day_data.get("problems"),
                mini_project={"name": day_data.get("project")} if day_data.get("project") else None,
                difficulty=day_data.get("diff", "Beginner"),
                time_estimate_mins=day_data.get("time", 60),
                is_completed=False,
                xp_value=75 if day_data.get("project") else 50
            )
            db.add(task)
            
    db.commit()
    db.refresh(new_roadmap)
    return new_roadmap

@router.post("/complete-task/{task_id}")
def complete_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(RoadmapTask).join(Roadmap).filter(
        RoadmapTask.id == task_id,
        Roadmap.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if task.is_completed:
        return {"message": "Task already completed", "xp_gained": 0}
        
    task.is_completed = True
    task.completed_at = datetime.utcnow()
    
    # Update XP & Streak
    progress = db.query(TaskProgress).filter(TaskProgress.user_id == current_user.id).first()
    if not progress:
        progress = TaskProgress(user_id=current_user.id, streak_count=1, total_xp=task.xp_value, badges=[])
        db.add(progress)
    else:
        progress.total_xp += task.xp_value
        
        # Streak calculations
        today = datetime.utcnow().date()
        if progress.last_activity_date:
            last_date = progress.last_activity_date.date()
            delta = (today - last_date).days
            if delta == 1:
                progress.streak_count += 1
            elif delta > 1:
                progress.streak_count = 1
        else:
            progress.streak_count = 1
            
        progress.last_activity_date = datetime.utcnow()
        
        # Badges award logic
        badges_list = progress.badges if progress.badges else []
        if progress.total_xp >= 100 and "First Milestone" not in badges_list:
            badges_list.append("First Milestone")
        if progress.streak_count >= 3 and "Consistency King" not in badges_list:
            badges_list.append("Consistency King")
        if len(badges_list) != len(progress.badges or []):
            progress.badges = badges_list
            
    # Update Placement Readiness score in Analytics
    # Formula: baseline + (completed tasks / total tasks) * 50
    roadmap = db.query(Roadmap).filter(Roadmap.id == task.roadmap_id).first()
    total_tasks = db.query(RoadmapTask).filter(RoadmapTask.roadmap_id == roadmap.id).count()
    completed_tasks = db.query(RoadmapTask).filter(
        RoadmapTask.roadmap_id == roadmap.id,
        RoadmapTask.is_completed == True
    ).count()
    
    pct_complete = (completed_tasks / total_tasks) if total_tasks > 0 else 0
    new_readiness = min(40.0 + (pct_complete * 50.0), 98.0)
    
    # Add new analytics row or update today's row
    today_analytics = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).order_by(Analytics.date.desc()).first()
    
    # Let's say: if today's entry is within same calendar day, update it. Else add one.
    if today_analytics and today_analytics.date.date() == today:
        today_analytics.readiness_score = new_readiness
        today_analytics.study_hours += (task.time_estimate_mins / 60.0)
        today_analytics.skill_growth_score = min(30.0 + (pct_complete * 60.0), 95.0)
    else:
        new_entry = Analytics(
            user_id=current_user.id,
            date=datetime.utcnow(),
            study_hours=task.time_estimate_mins / 60.0,
            skill_growth_score=30.0 + (pct_complete * 60.0),
            readiness_score=new_readiness,
            mock_test_score=50.0
        )
        db.add(new_entry)
        
    db.commit()
    return {
        "message": "Task marked as completed",
        "xp_gained": task.xp_value,
        "new_streak": progress.streak_count,
        "new_total_xp": progress.total_xp,
        "new_readiness_score": new_readiness
    }
