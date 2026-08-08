from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import os
import json
import logging
import google.generativeai as genai

router = APIRouter(prefix="/assessment", tags=["Assessment"])

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================
# GEMINI CONFIGURATION
# ============================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini AI initialized for assessments.")
else:
    logger.warning(
        "GEMINI_API_KEY not found. Assessment will use fallback evaluation."
    )


# ============================================================
# REQUEST MODELS
# ============================================================

class AssessmentRequest(BaseModel):
    target_role: str
    current_skills: List[str]
    experience_level: str


class AnswerItem(BaseModel):
    question: str
    skill: str
    answer: str


class EvaluationRequest(BaseModel):
    target_role: str
    answers: List[AnswerItem]


# ============================================================
# ROLE-BASED QUESTION BANK
# ============================================================

ROLE_QUESTIONS = {

    "data analyst": [
        {
            "question": "What is the difference between INNER JOIN and LEFT JOIN in SQL?",
            "skill": "SQL",
            "difficulty": "Beginner"
        },
        {
            "question": "What are SQL window functions and when would you use them?",
            "skill": "SQL",
            "difficulty": "Advanced"
        },
        {
            "question": "How would you handle missing values in a dataset using Python?",
            "skill": "Python",
            "difficulty": "Intermediate"
        },
        {
            "question": "What is the difference between mean, median, and mode?",
            "skill": "Statistics",
            "difficulty": "Beginner"
        },
        {
            "question": "What is a KPI and why is it important in business analytics?",
            "skill": "Analytics",
            "difficulty": "Beginner"
        },
        {
            "question": "Explain how you would design a Power BI dashboard for an e-commerce company.",
            "skill": "Power BI",
            "difficulty": "Intermediate"
        },
        {
            "question": "How would you identify and handle outliers in a dataset?",
            "skill": "Statistics",
            "difficulty": "Intermediate"
        },
        {
            "question": "A company's sales dropped by 20% this month. How would you investigate the reason?",
            "skill": "Business Analytics",
            "difficulty": "Advanced"
        }
    ],

    "software engineer": [
        {
            "question": "What is the difference between an array and a linked list?",
            "skill": "Data Structures",
            "difficulty": "Beginner"
        },
        {
            "question": "Explain time complexity and give the complexity of binary search.",
            "skill": "DSA",
            "difficulty": "Intermediate"
        },
        {
            "question": "What are the four main principles of Object-Oriented Programming?",
            "skill": "OOP",
            "difficulty": "Beginner"
        },
        {
            "question": "Explain the difference between a stack and a queue.",
            "skill": "Data Structures",
            "difficulty": "Beginner"
        },
        {
            "question": "What is the difference between BFS and DFS?",
            "skill": "Algorithms",
            "difficulty": "Intermediate"
        },
        {
            "question": "What is a REST API and how does it work?",
            "skill": "Backend Development",
            "difficulty": "Intermediate"
        },
        {
            "question": "Explain the SOLID principles and why they are useful.",
            "skill": "System Design",
            "difficulty": "Advanced"
        },
        {
            "question": "How would you design a scalable application that supports one million users?",
            "skill": "System Design",
            "difficulty": "Advanced"
        }
    ]
}


# ============================================================
# DEFAULT QUESTIONS
# ============================================================

DEFAULT_QUESTIONS = [
    {
        "question": "Describe an important technical project you have built.",
        "skill": "Projects",
        "difficulty": "Beginner"
    },
    {
        "question": "What programming languages or technologies are you most comfortable with?",
        "skill": "Technical Skills",
        "difficulty": "Beginner"
    },
    {
        "question": "Describe a difficult technical problem you solved.",
        "skill": "Problem Solving",
        "difficulty": "Intermediate"
    },
    {
        "question": "How do you approach learning a new technology?",
        "skill": "Learning Ability",
        "difficulty": "Intermediate"
    },
    {
        "question": "How would you design a solution for a real-world technical problem?",
        "skill": "Problem Solving",
        "difficulty": "Advanced"
    }
]


# ============================================================
# GENERATE ASSESSMENT
# ============================================================

@router.post("/generate")
def generate_assessment(data: AssessmentRequest):

    role = data.target_role.lower().strip()

    # Find matching role
    selected_questions = DEFAULT_QUESTIONS

    for role_name, questions in ROLE_QUESTIONS.items():
        if role_name in role:
            selected_questions = questions
            break

    # Adjust difficulty based on experience
    experience = data.experience_level.lower()

    if "beginner" in experience or "fresher" in experience:
        selected_questions = [
            q for q in selected_questions
            if q["difficulty"] in ["Beginner", "Intermediate"]
        ]

    elif "advanced" in experience:
        selected_questions = [
            q for q in selected_questions
            if q["difficulty"] in ["Intermediate", "Advanced"]
        ]

    # Limit assessment size
    selected_questions = selected_questions[:8]

    return {
        "success": True,
        "target_role": data.target_role,
        "experience_level": data.experience_level,
        "current_skills": data.current_skills,
        "total_questions": len(selected_questions),
        "questions": selected_questions
    }


# ============================================================
# AI EVALUATION
# ============================================================

def evaluate_with_gemini(
    target_role: str,
    answers: List[AnswerItem]
) -> Dict[str, Any]:

    if not GEMINI_API_KEY:
        return None

    try:

        model = genai.GenerativeModel("gemini-1.5-flash")

        answer_text = ""

        for index, item in enumerate(answers, start=1):
            answer_text += f"""
Question {index}:
{item.question}

Skill:
{item.skill}

Student Answer:
{item.answer}

-------------------------
"""

        prompt = f"""
You are an expert AI-powered skill assessment evaluator for SkillForge AI.

Target career role:
{target_role}

Evaluate the student's answers based on:

1. Technical correctness
2. Conceptual understanding
3. Relevance
4. Depth of explanation
5. Practical understanding

IMPORTANT:
Do NOT evaluate answers based simply on length.

A short but technically correct answer can receive a high score.
A long but incorrect answer must receive a low score.

Give every skill a score from 0 to 100.

Return ONLY valid JSON.

Required format:

{{
    "overall_score": 0,
    "readiness_level": "Beginner",
    "skill_scores": {{
        "SQL": 0,
        "Python": 0
    }},
    "strengths": [
        "skill or strength"
    ],
    "improvement_areas": [
        "skill requiring improvement"
    ],
    "skill_gaps": [
        {{
            "skill": "SQL",
            "current_score": 45,
            "target_score": 75,
            "gap": 30,
            "priority": "High"
        }}
    ],
    "recommendations": [
        "specific learning recommendation"
    ]
}}

Readiness levels:

0-49 = Beginner
50-74 = Intermediate
75-89 = Job Ready
90-100 = Advanced

Skill gap calculation:

target_score = 75
gap = target_score - current_score

If current_score >= 75:
gap = 0

Priority:

High = score below 50
Medium = score between 50 and 74
Low = score 75 or above

Student answers:

{answer_text}
"""

        response = model.generate_content(prompt)

        text = response.text.strip()

        if text.startswith("```json"):
            text = text[7:]

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        return json.loads(text)

    except Exception as e:

        logger.error(
            f"Gemini assessment evaluation failed: {e}"
        )

        return None


# ============================================================
# FALLBACK EVALUATION
# ============================================================

def fallback_evaluation(
    answers: List[AnswerItem]
) -> Dict[str, Any]:

    if not answers:
        return {
            "overall_score": 0,
            "readiness_level": "Beginner",
            "skill_scores": {},
            "strengths": [],
            "improvement_areas": [],
            "skill_gaps": [],
            "recommendations": []
        }

    skill_scores = {}

    for item in answers:

        answer = item.answer.strip()

        # Basic fallback scoring.
        # This is only used when Gemini is unavailable.

        if len(answer) >= 120:
            score = 80

        elif len(answer) >= 80:
            score = 70

        elif len(answer) >= 40:
            score = 60

        elif len(answer) >= 15:
            score = 50

        else:
            score = 35

        skill_scores[item.skill] = score

    overall_score = sum(
        skill_scores.values()
    ) // len(skill_scores)

    if overall_score >= 90:
        level = "Advanced"

    elif overall_score >= 75:
        level = "Job Ready"

    elif overall_score >= 50:
        level = "Intermediate"

    else:
        level = "Beginner"

    strengths = [
        skill
        for skill, score in skill_scores.items()
        if score >= 75
    ]

    improvement_areas = [
        skill
        for skill, score in skill_scores.items()
        if score < 75
    ]

    skill_gaps = []

    for skill, score in skill_scores.items():

        gap = max(0, 75 - score)

        if score < 50:
            priority = "High"

        elif score < 75:
            priority = "Medium"

        else:
            priority = "Low"

        skill_gaps.append({
            "skill": skill,
            "current_score": score,
            "target_score": 75,
            "gap": gap,
            "priority": priority
        })

    return {
        "overall_score": overall_score,
        "readiness_level": level,
        "skill_scores": skill_scores,
        "strengths": strengths,
        "improvement_areas": improvement_areas,
        "skill_gaps": skill_gaps,
        "recommendations": [
            f"Improve {skill} through targeted practice."
            for skill in improvement_areas
        ]
    }


# ============================================================
# EVALUATE ASSESSMENT
# ============================================================

@router.post("/evaluate")
def evaluate_assessment(
    data: EvaluationRequest
):

    if not data.answers:

        return {
            "success": False,
            "message": "No answers provided."
        }

    # Try AI evaluation first
    ai_result = evaluate_with_gemini(
        data.target_role,
        data.answers
    )

    # Use AI result when available
    if ai_result:

        return {
            "success": True,
            "evaluation_method": "AI",
            "target_role": data.target_role,
            **ai_result
        }

    # Otherwise use fallback
    fallback_result = fallback_evaluation(
        data.answers
    )

    return {
        "success": True,
        "evaluation_method": "Fallback",
        "target_role": data.target_role,
        **fallback_result
    }