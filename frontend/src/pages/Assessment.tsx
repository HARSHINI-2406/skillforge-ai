import React, { useState } from "react";

const API_URL = "https://skillforge-ai-backend-b0eb.onrender.com";

interface Question {
  question: string;
  skill: string;
  difficulty: string;
}

interface Answer {
  question: string;
  skill: string;
  answer: string;
}

interface AssessmentResult {
  [key: string]: any;
}

const Assessment: React.FC = () => {
  const [step, setStep] = useState<"setup" | "questions" | "results">("setup");

  const [targetRole, setTargetRole] = useState("Data Analyst");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [skills, setSkills] = useState<string[]>([
    "Excel",
    "SQL",
    "Python",
  ]);

  const [skillInput, setSkillInput] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (!skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkills([...skills, skill]);
    }

    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const generateAssessment = async () => {
    setError("");

    if (!targetRole.trim()) {
      setError("Please enter your target role.");
      return;
    }

    if (skills.length === 0) {
      setError("Please add at least one current skill.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/assessment/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          target_role: targetRole,
          current_skills: skills,
          experience_level: experienceLevel,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to generate assessment.");
      }

      const data = await response.json();

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions were generated.");
      }

      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(""));
      setCurrentQuestion(0);
      setStep("questions");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = value;
    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (!answers[currentQuestion]?.trim()) {
      setError("Please answer this question before continuing.");
      return;
    }

    setError("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    setError("");

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    if (!answers[currentQuestion]?.trim()) {
      setError("Please answer this question before submitting.");
      return;
    }

    setError("");

    try {
      setLoading(true);

      const formattedAnswers: Answer[] = questions.map((question, index) => ({
        question: question.question,
        skill: question.skill,
        answer: answers[index] || "",
      }));

      const response = await fetch(`${API_URL}/assessment/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          target_role: targetRole,
          answers: formattedAnswers,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to evaluate assessment.");
      }

      const data = await response.json();

      setResult(data);
      setStep("results");
    } catch (err: any) {
      setError(err.message || "Unable to evaluate assessment.");
    } finally {
      setLoading(false);
    }
  };

  const restartAssessment = () => {
    setStep("setup");
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestion(0);
    setResult(null);
    setError("");
  };

  const renderResults = () => {
    if (!result) return null;

    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-cyan-400">
              SkillForge AI
            </p>

            <h1 className="text-4xl font-bold">
              AI Skill Assessment Results
            </h1>

            <p className="mt-3 text-slate-400">
              Your assessment has been evaluated for the{" "}
              <span className="font-semibold text-white">
                {targetRole}
              </span>{" "}
              role.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Target Role</p>
              <p className="mt-2 text-xl font-semibold">{targetRole}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Experience</p>
              <p className="mt-2 text-xl font-semibold">
                {experienceLevel}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Questions</p>
              <p className="mt-2 text-xl font-semibold">
                {questions.length}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold">
              Evaluation Summary
            </h2>

            <div className="mt-6 space-y-4">
              {Object.entries(result).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <p className="text-sm font-medium capitalize text-cyan-400">
                    {key.replace(/_/g, " ")}
                  </p>

                  <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-300">
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : String(value)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={restartAssessment}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Take Assessment Again
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (step === "results") {
    return renderResults();
  }

  if (step === "questions") {
    const question = questions[currentQuestion];
    const progress =
      ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-cyan-400">
                  AI Skill Assessment
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  {targetRole}
                </h1>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-400">
                  Question
                </p>

                <p className="text-xl font-bold">
                  {currentQuestion + 1} / {questions.length}
                </p>
              </div>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-400">
                {question.skill}
              </span>

              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400">
                {question.difficulty}
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-semibold leading-relaxed">
              {question.question}
            </h2>

            <textarea
              value={answers[currentQuestion] || ""}
              onChange={(e) => updateAnswer(e.target.value)}
              placeholder="Write your answer here..."
              rows={8}
              className="mt-8 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={previousQuestion}
                disabled={currentQuestion === 0 || loading}
                className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={submitAssessment}
                  disabled={loading}
                  className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
                >
                  {loading ? "Evaluating..." : "Submit Assessment"}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  disabled={loading}
                  className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-cyan-400">
            SkillForge AI
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            AI Skill Assessment
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Evaluate your current skills for your target career and
            identify the areas you should improve.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <h2 className="text-2xl font-semibold">
            Assessment Setup
          </h2>

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Target Career Role
              </label>

              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Example: Data Analyst"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Experience Level
              </label>

              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Current Skills
              </label>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill"
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

                <button
                  onClick={addSkill}
                  className="rounded-xl border border-cyan-500 px-5 py-3 font-medium text-cyan-400 transition hover:bg-cyan-500 hover:text-slate-950"
                >
                  Add
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => removeSkill(skill)}
                    className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    {skill} ×
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={generateAssessment}
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-6 py-4 text-lg font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Generating Assessment..."
                : "Start AI Assessment →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;