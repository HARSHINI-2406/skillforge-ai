from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.auth import get_current_user
from app.models import User, CommunityPost, Comment
from app.schemas import CommunityPostResponse, CommunityPostCreate, CommentResponse, CommentCreate

router = APIRouter(prefix="/api/community", tags=["community"])

@router.get("/posts", response_model=list[CommunityPostResponse])
def get_posts(db: Session = Depends(get_db)):
    # Retrieve all posts with comments sorted by date
    posts = db.query(CommunityPost).order_by(CommunityPost.created_at.desc()).all()
    return posts

@router.post("/posts", response_model=CommunityPostResponse)
def create_post(
    post_in: CommunityPostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_post = CommunityPost(
        user_id=current_user.id,
        content=post_in.content,
        author_name=current_user.full_name,
        author_role=current_user.career_goal or "Student",
        likes_count=0
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.post("/posts/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.likes_count += 1
    db.commit()
    return {"message": "Post liked", "likes_count": post.likes_count}

@router.post("/posts/{post_id}/comments", response_model=CommentResponse)
def add_comment(
    post_id: int,
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    new_comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        author_name=current_user.full_name,
        content=comment_in.content
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment
