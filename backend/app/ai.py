import os
import json
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini API initialized successfully.")
else:
    logger.warning("GEMINI_API_KEY not found. Fallback offline AI mock layer will be used.")

# Predefined high-quality content for mock roadmaps and resume analyzer
ROLE_METADATA = {
    "data analyst": {
        "skills": ["SQL", "Excel", "Python", "Power BI", "Statistics", "Tableau", "Pandas"],
        "summary": "You are strong in basic spreadsheet calculations, but you need to bridge gaps in advanced SQL queries (CTEs, Window Functions), data visualization tools like Power BI, and foundational statistical testing for data modeling.",
        "weeks": [
            {
                "week": 1,
                "title": "SQL Mastery & Data Extraction",
                "days": [
                    {"day": 1, "title": "SQL Basics & SELECT queries", "desc": "Learn SELECT, WHERE, ORDER BY, and LIMIT in SQL. Understand relational database models.", "type": "Learn", "time": 60, "diff": "Beginner"},
                    {"day": 2, "title": "SQL Joins & Aggregations", "desc": "Master INNER, LEFT, RIGHT, and FULL JOINs. Study GROUP BY and HAVING clauses.", "type": "Learn", "time": 90, "diff": "Beginner"},
                    {"day": 3, "title": "Practice SQL Aggregate Queries", "desc": "Solve 5 SQL query exercises on Hackerrank or LeetCode.", "type": "Practice", "time": 60, "diff": "Intermediate", "problems": ["Aggregate Functions", "Weather Observation Station"]},
                    {"day": 4, "title": "Subqueries & Common Table Expressions", "desc": "Learn nested subqueries and how CTEs improve readability.", "type": "Learn", "time": 75, "diff": "Intermediate"},
                    {"day": 5, "title": "SQL Window Functions", "desc": "Study ROW_NUMBER, RANK, DENSE_RANK, and SUM() OVER partition functions.", "type": "Learn", "time": 90, "diff": "Advanced"},
                    {"day": 6, "title": "Database Schema Design", "desc": "Understand normalization (1NF, 2NF, 3NF) and primary/foreign key relationships.", "type": "Revise", "time": 60, "diff": "Intermediate"},
                    {"day": 7, "title": "Weekend Assessment: SQL Challenge", "desc": "Write queries to analyze a mock transactional dataset and summarize insights.", "type": "Build", "time": 120, "diff": "Intermediate", "project": "E-Commerce Database Queries"}
                ]
            },
            {
                "week": 2,
                "title": "Business Intelligence & Power BI",
                "days": [
                    {"day": 8, "title": "Power BI Interface & Data Import", "desc": "Install Power BI Desktop, import CSVs and SQL tables, and look at the Power Query editor.", "type": "Learn", "time": 60, "diff": "Beginner"},
                    {"day": 9, "title": "Data Modeling in Power BI", "desc": "Create relationships (1-to-many) and manage schema schemas in Power BI model view.", "type": "Learn", "time": 75, "diff": "Intermediate"},
                    {"day": 10, "title": "DAX Formulas & Calculations", "desc": "Learn basic DAX formulas: CALCULATE, SUM, AVERAGE, and DIVIDE. Create calculated columns and measures.", "type": "Learn", "time": 90, "diff": "Intermediate"},
                    {"day": 11, "title": "Building Visual Dashboards", "desc": "Learn how to use bar charts, line graphs, cards, KPI tiles, and slicers to tell a story.", "type": "Build", "time": 100, "diff": "Intermediate"},
                    {"day": 12, "title": "Advanced DAX & Filters", "desc": "Master Time Intelligence functions in DAX (SAMEPERIODLASTYEAR, YTD) and interactions between charts.", "type": "Practice", "time": 80, "diff": "Advanced"},
                    {"day": 13, "title": "Publishing & Sharing Dashboard", "desc": "Publish to Power BI Service, export to PDF, and review dynamic tooltips and filtering settings.", "type": "Revise", "time": 60, "diff": "Beginner"},
                    {"day": 14, "title": "Project: HR Analytics Dashboard", "desc": "Create a fully functional dashboard tracking employee turnover, average salaries, and performance reviews.", "type": "Build", "time": 150, "diff": "Advanced", "project": "HR Dashboard"}
                ]
            },
            {
                "week": 3,
                "title": "Statistics & Exploratory Data Analysis",
                "days": [
                    {"day": 15, "title": "Descriptive Statistics", "desc": "Learn Mean, Median, Mode, Variance, Standard Deviation, and Percentiles.", "type": "Learn", "time": 60, "diff": "Beginner"},
                    {"day": 16, "title": "Probability Distributions", "desc": "Study Normal, Binomial, and Poisson distributions. Understand the Central Limit Theorem.", "type": "Learn", "time": 75, "diff": "Intermediate"},
                    {"day": 17, "title": "Hypothesis Testing Basics", "desc": "Understand Null/Alternative Hypotheses, P-values, Type I/II errors, and Significance Levels.", "type": "Learn", "time": 90, "diff": "Advanced"},
                    {"day": 18, "title": "Z-tests & T-tests in Practice", "desc": "Conduct hypothesis tests on mock metrics comparing conversion rates between landing pages.", "type": "Practice", "time": 80, "diff": "Advanced", "problems": ["A/B Testing significance", "Two-sample t-test"]},
                    {"day": 19, "title": "Correlation vs Causation", "desc": "Study Pearson correlation coefficient, scatter plots, and simple linear regression formulas.", "type": "Learn", "time": 60, "diff": "Intermediate"},
                    {"day": 20, "title": "Data Ethics & Bias", "desc": "Review metrics bias, outliers handling, and ethical implications of data reporting.", "type": "Revise", "time": 45, "diff": "Beginner"},
                    {"day": 21, "title": "Project: A/B Testing Analysis Report", "desc": "Write a python notebook or spreadsheets file analyzing a marketing campaign with statistical testing.", "type": "Build", "time": 180, "diff": "Advanced", "project": "A/B Test Report"}
                ]
            },
            {
                "week": 4,
                "title": "Python for Data Analysis (Pandas & Numpy)",
                "days": [
                    {"day": 22, "title": "Python Data Structures", "desc": "Quick recap of lists, dicts, tuples, and functions in Python.", "type": "Learn", "time": 60, "diff": "Beginner"},
                    {"day": 23, "title": "Numpy Arrays & Vectorization", "desc": "Learn Numpy array operations, indexing, and mathematical functions.", "type": "Learn", "time": 60, "diff": "Intermediate"},
                    {"day": 24, "title": "Pandas DataFrames basics", "desc": "Import CSVs, select columns, filter rows, and handle missing values using Pandas.", "type": "Learn", "time": 90, "diff": "Intermediate"},
                    {"day": 25, "title": "Groupby and Merging DataFrames", "desc": "Merge multiple datasets and perform group operations in Pandas.", "type": "Practice", "time": 80, "diff": "Intermediate", "problems": ["Pandas Merge Practice", "Aggregate Sales by Category"]},
                    {"day": 26, "title": "Data Visualization with Seaborn", "desc": "Create histograms, boxplots, correlation heatmaps, and pairplots with Matplotlib and Seaborn.", "type": "Learn", "time": 90, "diff": "Intermediate"},
                    {"day": 27, "title": "Data Cleaning Pipeline", "desc": "Build a repeatable python script that cleans dirty text and datetime columns.", "type": "Revise", "time": 75, "diff": "Intermediate"},
                    {"day": 28, "title": "Project: Exploratory Analysis of Housing Prices", "desc": "Analyze a housing market dataset to find core correlations and present findings via charts.", "type": "Build", "time": 180, "diff": "Advanced", "project": "Housing Market EDA"}
                ]
            }
        ]
    },
    "software engineer": {
        "skills": ["Java", "DSA", "SQL", "React", "System Design", "Git", "OOP"],
        "summary": "You have solid frontend skills, but lack deep practice in Data Structures & Algorithms (graphs, trees, dynamic programming) and OOP system design (SOLID principles, design patterns).",
        "weeks": [
            {
                "week": 1,
                "title": "Data Structures Foundations & OOP",
                "days": [
                    {"day": 1, "title": "Arrays & Strings Complex Operations", "desc": "Learn sliding window and two-pointer techniques on arrays.", "type": "Learn", "time": 60, "diff": "Intermediate"},
                    {"day": 2, "title": "OOP Principles & SOLID", "desc": "Study Inheritance, Encapsulation, Polymorphism, and the 5 SOLID design rules.", "type": "Learn", "time": 90, "diff": "Intermediate"},
                    {"day": 3, "title": "Practice DSA Questions", "desc": "Solve 3 sliding window questions on LeetCode.", "type": "Practice", "time": 90, "diff": "Intermediate", "problems": ["Max Consecutive Ones III", "Minimum Size Subarray Sum"]},
                    {"day": 4, "title": "Linked Lists Manipulation", "desc": "Understand singly, doubly, and circular linked lists. Learn reversal.", "type": "Learn", "time": 75, "diff": "Intermediate"},
                    {"day": 5, "title": "Stacks & Queues implementation", "desc": "Learn Stack, Queue, Deque, and circular queues. Solve parentheses problems.", "type": "Learn", "time": 80, "diff": "Beginner"},
                    {"day": 6, "title": "Git Branching & Workflows", "desc": "Master git rebase, merge conflict resolution, and PR workflows.", "type": "Revise", "time": 45, "diff": "Beginner"},
                    {"day": 7, "title": "Project: Cache System Design", "desc": "Build an LRU Cache implementation using a doubly linked list and a hashmap.", "type": "Build", "time": 150, "diff": "Advanced", "project": "LRU Cache"}
                ]
            },
            {
                "week": 2,
                "title": "Trees, Graphs & Recursion",
                "days": [
                    {"day": 8, "title": "Recursion & Backtracking", "desc": "Master recursion call stack. Implement N-Queens or Permutations problems.", "type": "Learn", "time": 90, "diff": "Advanced"},
                    {"day": 9, "title": "Binary Trees and BST", "desc": "Learn Preorder, Inorder, and Postorder traversals. Master search & insertion in BST.", "type": "Learn", "time": 75, "diff": "Intermediate"},
                    {"day": 10, "title": "Graph Traversals (BFS & DFS)", "desc": "Learn graph representations (adjacency matrix/list). Implement BFS and DFS.", "type": "Learn", "time": 90, "diff": "Advanced"},
                    {"day": 11, "title": "Solve Graph Problems", "desc": "Practice BFS/DFS on Leetcode.", "type": "Practice", "time": 90, "diff": "Advanced", "problems": ["Number of Islands", "Clone Graph"]},
                    {"day": 12, "title": "Shortest Path Algorithms", "desc": "Study Dijkstra's and Bellman-Ford algorithms.", "type": "Learn", "time": 90, "diff": "Advanced"},
                    {"day": 13, "title": "Tree Revision & Balancing", "desc": "Study AVL and Red-Black tree principles (balancing rotations).", "type": "Revise", "time": 60, "diff": "Advanced"},
                    {"day": 14, "title": "Project: Network Graph Shortest Path Visualizer", "desc": "Implement a CLI graph pathfinder finding the fastest route between multiple network nodes.", "type": "Build", "time": 180, "diff": "Advanced", "project": "Network Pathfinder"}
                ]
            }
        ]
    }
}

def generate_roadmap_with_ai(target_role: str, duration_days: int, current_skills: List[str]) -> Dict[str, Any]:
    role_lower = target_role.lower().strip()
    
    # Check if Gemini key is available and configure
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
            You are an expert AI Career Roadmap Architect.
            Generate a personalized {duration_days}-day learning roadmap for a student targeting the role of '{target_role}'.
            Their current skills are: {', '.join(current_skills)}.
            
            Produce a JSON output ONLY, matching this schema exactly:
            {{
                "ai_summary": "A 2-3 sentence overview explaining their current gaps and general study plan.",
                "weeks": [
                    {{
                        "week": 1,
                        "title": "Week 1 Title",
                        "days": [
                            {{
                                "day": 1,
                                "title": "Day 1 Title",
                                "desc": "What to learn on day 1",
                                "type": "Learn", 
                                "time": 60, 
                                "diff": "Beginner",
                                "problems": ["problem 1", "problem 2"], // optional list of practice questions
                                "project": "name of mini project" // optional for the weekend (e.g. Day 7 or Day 14)
                            }}
                            // ... 7 days per week
                        ]
                    }}
                    // Generate weekly plans matching the target duration (e.g., 4 weeks for 30 days, 8-9 for 60, 12-13 for 90 days)
                ]
            }}
            Ensure your response is valid JSON. Do not add markdown code blocks around it. Return raw JSON.
            """
            response = model.generate_content(prompt)
            # Remove possible markdown fences
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
            roadmap_data = json.loads(text)
            return roadmap_data
        except Exception as e:
            logger.error(f"Gemini API roadmap generation failed: {e}. Falling back to mock generator.")
    
    # Fallback Offline Generator
    matched_role = "data analyst"
    for role in ROLE_METADATA:
        if role in role_lower:
            matched_role = role
            break
            
    meta = ROLE_METADATA[matched_role]
    weeks_to_generate = 4 if duration_days <= 30 else (8 if duration_days <= 60 else 12)
    
    # Duplicate or stretch mock weeks to fit the requested duration
    weeks_list = []
    base_weeks = meta["weeks"]
    for w in range(weeks_to_generate):
        base_week = base_weeks[w % len(base_weeks)]
        # Adjust day offsets
        new_days = []
        for d in base_week["days"]:
            day_offset = (w * 7) + (d["day"] - ((d["day"] - 1) // 7 * 7))
            day_copy = d.copy()
            day_copy["day"] = day_offset
            new_days.append(day_copy)
        
        weeks_list.append({
            "week": w + 1,
            "title": f"Phase {w+1}: " + base_week["title"],
            "days": new_days
        })
        
    return {
        "ai_summary": meta["summary"],
        "weeks": weeks_list
    }

def analyze_resume_with_ai(resume_text: str, filename: str) -> Dict[str, Any]:
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
            You are an ATS (Applicant Tracking System) parser and senior recruiter.
            Analyze the following text extracted from a student's resume (Filename: {filename}):
            
            ---
            {resume_text}
            ---
            
            Produce a JSON output ONLY, matching this schema:
            {{
                "ats_score": 78, // overall score out of 100
                "missing_keywords": ["keyword1", "keyword2", "keyword3"],
                "weak_sections": ["Projects section lacks quantitative metrics", "Summary is too generic"],
                "project_suggestions": ["Re-implement the main project using TypeScript", "Quantify database optimizations by showing a 30% reduction in query times"],
                "improved_bullets": [
                    {{
                        "original": "Worked on SQL database queries",
                        "improved": "Optimized SQL query performance by indexing foreign keys, reducing average dashboard loading latency by 40%"
                    }}
                ]
            }}
            Return raw JSON only, no markdown markdown.
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
            logger.error(f"Gemini API resume analysis failed: {e}. Falling back to mock analysis.")
            
    # Mock fallback response
    return {
        "ats_score": 68,
        "missing_keywords": ["Window Functions", "Pandas", "Scikit-Learn", "Docker", "Unit Testing", "CI/CD"],
        "weak_sections": [
            "Experience descriptions lack active verbs and metric-driven results",
            "Technical skills section is missing modern dashboarding tools (Power BI/Tableau)",
            "Project descriptions do not state how performance or database queries were optimized"
        ],
        "project_suggestions": [
            "Build an E-Commerce backend API and deploy it with Docker to demonstrate DevOps familiarity.",
            "Incorporate quantitative metrics: e.g., 'analyzed 50,000 sales records to identify product trends, boosting mock campaign ROI by 12%'"
        ],
        "improved_bullets": [
            {
                "original": "Responsible for pulling data and creating spreadsheets.",
                "improved": "Automated weekly sales report extraction using Python and SQL scripts, reducing database assembly time by 15 hours per week."
            },
            {
                "original": "Created dashboards to view customer sales details.",
                "improved": "Designed interactive Power BI dashboard featuring key KPI indicators for 10k+ active users, improving business decision speeds by 25%."
            }
        ]
    }

def chat_with_mentor(message_history: List[Dict[str, str]], new_message: str, user_profile: Dict[str, Any]) -> str:
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            # Format user context
            profile_context = f"""
            Student Profile:
            Name: {user_profile.get('name', 'Student')}
            Target Role: {user_profile.get('career_goal', 'Software Engineer')}
            Skills: {', '.join(user_profile.get('skills', []))}
            Weekly study capability: {user_profile.get('weekly_hours', 5)} hours
            """
            
            # Format chat history
            history_str = ""
            for msg in message_history[-6:]: # Keep last 6 messages for context
                history_str += f"{msg['role'].capitalize()}: {msg['content']}\n"
                
            prompt = f"""
            You are "SkillForge AI Mentor", a friendly, highly intelligent career advisor and learning coach.
            Your job is to guide students on roadmaps, skill gaps, resume building, and preparing for job opportunities.
            
            {profile_context}
            
            Chat History:
            {history_str}
            Student's New Question: {new_message}
            
            Provide a encouraging, direct, and actionable response. Use markdown styling. Be concise (max 3 short paragraphs).
            """
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini API chat failed: {e}. Falling back to mock chat response.")
            
    # Mock fallback chatbot response
    msg_lower = new_message.lower()
    role = user_profile.get('career_goal', 'Software Engineer')
    
    if "resume" in msg_lower:
        return f"To improve your resume for a **{role}** role, try to focus on adding measurable results (e.g., 'reduced render latency by 35%'). Also, ensure you include missing keywords like **SQL Window Functions** or **Docker** depending on what the ATS parser flagged. Would you like me to rewrite one of your project bullet points?"
    elif "ready" in msg_lower or "internship" in msg_lower or "placement" in msg_lower:
        return f"Based on your current skills, your **Placement Readiness Score is around 68%**. You have standard foundations down, but to stand out for internships, you should finish at least one end-to-end project on your roadmap and build up your skills in Power BI / Tableau. Try completing your upcoming task today!"
    elif "dsa" in msg_lower or "data structure" in msg_lower:
        return "Data Structures and Algorithms are critical! For placements, focus on mastering: 1. Arrays & Hashing, 2. Two Pointers / Sliding Window, 3. Binary Search, and 4. Breadth-First Search (BFS). Start by practicing simple Leetcode problems like *Two Sum* and *Valid Parentheses*."
    elif "roadmap" in msg_lower or "plan" in msg_lower:
        return f"Your personalized {role} roadmap is set up to guide you day-by-day. In the first couple of weeks, we focus on establishing strong foundations (SQL & Power BI). If you find this too fast, we can adapt your daily study load. Make sure to complete the daily quiz tasks to keep your streak alive!"
    else:
        return f"Hello! I am your SkillForge AI Mentor. I am here to help you get placement-ready as a **{role}**. You can ask me how to crack specific interviews, check your resume ATS score, or explain complex technical concepts step-by-step. What is on your mind today?"
