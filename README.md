# SkillForge AI

## 🌐 Live Website

The SkillForge AI platform is deployed and available online.  
Explore the live application to experience the AI-powered learning roadmap, skill analysis, and career guidance features.

🔗 Live Demo: https://talentforge-hub.netlify.app

> **AI-powered personalized learning and career roadmap platform**

SkillForge AI is a production-ready, full-stack application built to help college students identify skill gaps, master missing competencies via custom 30/60/90-day learning roadmaps, parse resumes against ATS engines, log study sessions, and consult an AI mentor to become placement and internship ready.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (scaffolded via Vite + TypeScript)
- **Styling**: Tailwind CSS (customized premium color scheme)
- **Animations**: Framer Motion & CSS transitions
- **State Management**: Zustand
- **Charting**: Recharts (for analytics dashboards)
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.13 compatible)
- **ORM & Database**: SQLAlchemy (configured dynamically for SQLite/PostgreSQL)
- **Data Validation**: Pydantic
- **Security**: JWT Authentication (using python-jose & passlib with bcrypt)
- **PDF Parser**: PyPDF2 (extracts resume contents)
- **AI Integrations**: Google Generative AI (Gemini Pro) *with high-fidelity offline fallback simulations.*

---

## 📂 Project Structure

```text
SkillForge-AI/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py          # Registration, login, onboarding
│   │   │   ├── skills.py        # Skill gap mapping algorithms
│   │   │   ├── roadmap.py       # 30/60/90-day roadmaps & task completions
│   │   │   ├── resume.py        # PDF extraction & resume scanning
│   │   │   ├── analytics.py     # Aggregated student study logs
│   │   │   ├── chat.py          # AI Mentor floating chat endpoint
│   │   │   └── community.py     # Discussion forum & comment boards
│   │   ├── ai.py                # Gemini Prompt engineering & Mock Fallbacks
│   │   ├── auth.py              # JWT token signatures & dependencies
│   │   ├── database.py          # Database engines & SQL sessions
│   │   ├── models.py            # SQLAlchemy database tables mapping
│   │   ├── schemas.py           # Pydantic schemas for data serialization
│   │   └── main.py              # FastAPI startup & CORS middleware
│   └── requirements.txt         # Backend Python requirements
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Navigation headers
│   │   │   ├── Sidebar.tsx      # Sidebar links & user progress HUD
│   │   │   └── AIMentor.tsx     # Floating AI career advisor widget
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx  # Premium landing page with FAQs
│   │   │   ├── Login.tsx        # Login form
│   │   │   ├── Register.tsx     # Signup form containing student columns
│   │   │   ├── ForgotPassword.tsx# Password reset recovery form
│   │   │   ├── Onboarding.tsx   # Multi-step wizard setup
│   │   │   ├── Dashboard.tsx    # General overview & weekly hours Recharts
│   │   │   ├── SkillGap.tsx     # Gaps comparison radar grids
│   │   │   ├── Roadmap.tsx      # Timeline roadmap with PDF exports
│   │   │   ├── Courses.tsx      # Filterable course lists
│   │   │   ├── Habits.tsx       # Daily check-in trackers & badge cabinets
│   │   │   ├── ResumeAnalyzer.tsx# Resume ATS scoring & comparative bullets
│   │   │   ├── Analytics.tsx    # Detailed charts dashboard
│   │   │   └── Community.tsx    # Feed forums & likes/comments
│   │   ├── store/
│   │   │   └── useStore.ts      # Global Zustand state store
│   │   ├── utils/
│   │   │   └── api.ts           # Headers & fetch client wrappers
│   │   ├── App.tsx              # React router routing setup
│   │   └── index.css            # Tailwind bases, glassmorphism, animations
│   ├── index.html               # Main HTML markup
│   ├── postcss.config.js        # PostCSS configuration
│   ├── tailwind.config.js       # Custom design system colors
│   └── tsconfig.json            # TypeScript configuration
└── README.md                    # System documentation
```

---

## ⚙️ Environment Variables

Create files to customize variables in production:

### Backend Configuration
Create a `.env` file under `/backend`:
```env
# Optional. Default is SQLite (sqlite:///./skillforge.db)
DATABASE_URL=postgresql://user:password@localhost:5432/skillforge

# Token Encryption
SECRET_KEY=skillforge_super_secret_signing_key_987654321

# Optional. If not set, high-fidelity mock AI will generate content offline
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🚀 Running locally

### 1. Launch the Backend API
1. Navigate to `/backend`
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   *The Swagger API documentation will be available at http://127.0.0.1:8000/docs*

### 2. Launch the Frontend
1. Navigate to `/frontend`
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The React UI application will be available at http://localhost:5173*

---

## 📋 Comprehensive Demo Flow (Walkthrough)

For portfolio displays or final presentations, execute this flow:

1. **Onboarding Setup**:
   - Register a new account (Rahul Sharma, CSE, 3rd Year).
   - Upon logging in, complete the Onboarding steps:
     - Target role: Select **Data Analyst** or **Software Engineer**.
     - Pick current skills & rate proficiency.
     - Upload a sample PDF resume.
     - Set weekly study load to **12 Hours**.

2. **Skill Gap**:
   - Visit **Skill Analysis**. Observe target matches (e.g. 78% Match).
   - Read the AI explanation summary outlining specific missing blocks (e.g., Power BI, SQL Window Functions).
   - Update proficiency levels using the stars panel to see the gap recalculate instantly.

3. **Roadmap**:
   - Visit **Roadmap** and click **Generate with AI**.
   - Expand the accordions. View daily study blocks, estimate timings, difficulty tags, and LeetCode practice items.
   - Click **Download PDF** to export/print a clean, single-page view of the roadmap.

4. **Checks & Gamification**:
   - Complete tasks in the roadmap timeline or **Tasks & Habits** checklists.
   - Observe your **Placement Readiness Score** and **XP** increase.
   - View your earned badges (e.g., "First Milestone") appear in the sidebar and Habits dashboard.

5. **ATS Scanner**:
   - Visit **Resume ATS**. Scan your PDF.
   - Read suggestions, ATS Score, missing keywords, and the **Original vs. Improved** bullet point rewriting side-by-side.

6. **Consult Mentor**:
   - Toggle the floating chat widget on the bottom right.
   - Ask: `"What should I learn next?"` or `"Explain sliding window"` to see the adaptive mentor respond.
