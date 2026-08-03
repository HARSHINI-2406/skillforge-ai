import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import PyPDF2
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Resume
from app.schemas import ResumeResponse
from app.ai import analyze_resume_with_ai

router = APIRouter(prefix="/api/resume", tags=["resume"])

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF document: {e}")

@router.post("/analyze", response_model=ResumeResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported.")
        
    contents = await file.read()
    
    if file.filename.lower().endswith('.pdf'):
        resume_text = extract_text_from_pdf(contents)
    else:
        # Plain text
        resume_text = contents.decode("utf-8", errors="ignore")
        
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="The uploaded file contains no text.")
        
    # Analyze using AI
    analysis_result = analyze_resume_with_ai(resume_text, file.filename)
    
    # Save to db
    db_resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        ats_score=analysis_result.get("ats_score", 0),
        missing_keywords=analysis_result.get("missing_keywords", []),
        weak_sections=analysis_result.get("weak_sections", []),
        project_suggestions=analysis_result.get("project_suggestions", []),
        improved_bullets=analysis_result.get("improved_bullets", [])
    )
    
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    return db_resume

@router.get("/history", response_model=list[ResumeResponse])
def get_resume_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.analyzed_at.desc()).all()
    return resumes
