from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Analytics, TaskProgress, RoadmapTask, Roadmap
from app.schemas import AnalyticsResponse

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/summary")
def get_analytics_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    analytics_records = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).order_by(Analytics.date.asc()).all()
    
    progress = db.query(TaskProgress).filter(TaskProgress.user_id == current_user.id).first()
    
    # Get active roadmap completion
    roadmap = db.query(Roadmap).filter(
        Roadmap.user_id == current_user.id,
        Roadmap.is_active == True
    ).first()
    
    completion_rate = 0.0
    completed_tasks = 0
    total_tasks = 0
    
    if roadmap:
        total_tasks = db.query(RoadmapTask).filter(RoadmapTask.roadmap_id == roadmap.id).count()
        completed_tasks = db.query(RoadmapTask).filter(
            RoadmapTask.roadmap_id == roadmap.id,
            RoadmapTask.is_completed == True
        ).count()
        if total_tasks > 0:
            completion_rate = round((completed_tasks / total_tasks) * 100, 1)
            
    # Calculate some summary stats
    latest_record = db.query(Analytics).filter(
        Analytics.user_id == current_user.id
    ).order_by(Analytics.date.desc()).first()
    
    current_readiness = latest_record.readiness_score if latest_record else 40.0
    current_skill_growth = latest_record.skill_growth_score if latest_record else 30.0
    mock_test = latest_record.mock_test_score if latest_record else 50.0
    
    total_study_hours = sum([record.study_hours for record in analytics_records])
    
    # Format trend history data for Recharts
    trend_history = []
    for record in analytics_records:
        trend_history.append({
            "date": record.date.strftime("%b %d"),
            "study_hours": round(record.study_hours, 1),
            "skill_growth": round(record.skill_growth_score, 1),
            "readiness_score": round(record.readiness_score, 1),
            "mock_test": round(record.mock_test_score, 1)
        })
        
    return {
        "streak": progress.streak_count if progress else 0,
        "total_xp": progress.total_xp if progress else 0,
        "badges": progress.badges if progress else [],
        "completion_rate": completion_rate,
        "completed_tasks": completed_tasks,
        "total_tasks": total_tasks,
        "current_readiness_score": round(current_readiness, 1),
        "current_skill_growth": round(current_skill_growth, 1),
        "latest_mock_test_score": round(mock_test, 1),
        "total_study_hours": round(total_study_hours, 1),
        "trend_history": trend_history
    }
