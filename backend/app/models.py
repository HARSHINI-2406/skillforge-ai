from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    college = Column(String, nullable=True)
    department = Column(String, nullable=True)
    year = Column(String, nullable=True)
    career_goal = Column(String, nullable=True)
    weekly_hours = Column(Integer, default=5)
    is_onboarded = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("TaskProgress", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    analytics = relationship("Analytics", back_populates="user", cascade="all, delete-orphan")
    community_posts = relationship("CommunityPost", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")

class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String, nullable=False)
    proficiency = Column(Integer, default=0) # 0 to 5
    is_current = Column(Boolean, default=True) # True: already has, False: target to learn

    user = relationship("User", back_populates="skills")

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_role = Column(String, nullable=False)
    duration_days = Column(Integer, default=90) # 30, 60, 90
    generated_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    ai_summary = Column(Text, nullable=True) # Summary explanation of gap

    user = relationship("User", back_populates="roadmaps")
    tasks = relationship("RoadmapTask", back_populates="roadmap", cascade="all, delete-orphan")

class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False)
    week_number = Column(Integer, nullable=False)
    day_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    task_type = Column(String, default="Learn") # Learn, Practice, Revise, Build, Apply
    practice_problems = Column(JSON, nullable=True) # List of practice problems
    mini_project = Column(JSON, nullable=True) # Project details
    difficulty = Column(String, default="Beginner") # Beginner, Intermediate, Advanced
    time_estimate_mins = Column(Integer, default=60)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    xp_value = Column(Integer, default=50)

    roadmap = relationship("Roadmap", back_populates="tasks")

class TaskProgress(Base):
    __tablename__ = "task_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    last_activity_date = Column(DateTime, nullable=True)
    streak_count = Column(Integer, default=0)
    total_xp = Column(Integer, default=0)
    badges = Column(JSON, default=list) # e.g. ["First Milestone", "Streak Master"]

    user = relationship("User", back_populates="progress")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    ats_score = Column(Integer, default=0)
    missing_keywords = Column(JSON, default=list)
    weak_sections = Column(JSON, default=list)
    project_suggestions = Column(JSON, default=list)
    improved_bullets = Column(JSON, default=list)
    analyzed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    study_hours = Column(Float, default=0.0)
    skill_growth_score = Column(Float, default=0.0)
    readiness_score = Column(Float, default=0.0)
    mock_test_score = Column(Float, default=0.0)

    user = relationship("User", back_populates="analytics")

class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    author_name = Column(String, nullable=False)
    author_role = Column(String, nullable=True)
    likes_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="community_posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    author_name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="comments")
    post = relationship("CommunityPost", back_populates="comments")
