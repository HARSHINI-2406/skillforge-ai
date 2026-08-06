from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/assessment", tags=["Assessment"])


class AssessmentRequest(BaseModel):
    target_role: str
    current_skills: List[str]
    experience_level: str


@router.post("/generate")
def generate_assessment(data: AssessmentRequest):

    role = data.target_role.lower()

    questions = []

    if "data analyst" in role:
        questions = [
            {
                "question": "What is an INNER JOIN in SQL?",
                "skill": "SQL"
            },
            {
                "question": "How do you handle missing values in a dataset?",
                "skill": "Python"
            },
            {
                "question": "What is a KPI?",
                "skill": "Analytics"
            }
        ]

    else:
        questions = [
            {
                "question": "Describe a project you built.",
                "skill": "Projects"
            }
        ]

    return {
        "target_role": data.target_role,
        "questions": questions
    }



class AnswerItem(BaseModel):
    skill: str
    answer: str


class EvaluationRequest(BaseModel):
    answers: List[AnswerItem]


@router.post("/evaluate")
def evaluate_assessment(data: EvaluationRequest):

    if not data.answers:
        return {
            "message": "No answers provided"
        }

    total_score = 0
    skill_scores = {}

    for item in data.answers:

        answer_length = len(item.answer)

        if answer_length > 80:
            score = 90

        elif answer_length > 40:
            score = 75

        elif answer_length > 15:
            score = 60

        else:
            score = 40


        skill_scores[item.skill] = score
        total_score += score


    overall_score = total_score // len(data.answers)


    if overall_score >= 85:
        level = "Advanced"

    elif overall_score >= 70:
        level = "Intermediate"

    else:
        level = "Beginner"


    return {
        "skill_scores": skill_scores,
        "overall_score": overall_score,
        "readiness_level": level,
        "strengths": [
            skill 
            for skill, score in skill_scores.items()
            if score >= 75
        ],
        "improvement_areas": [
            skill 
            for skill, score in skill_scores.items()
            if score < 75
        ],
        "recommendation": "Continue roadmap learning and complete recommended projects."
    }