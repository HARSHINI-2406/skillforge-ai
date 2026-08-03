import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import type { UserSkill } from "../store/useStore";
import Navbar from "../components/Navbar";
import { 
  Compass, 
  BookOpen, 
  Star, 
  FileText, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  CheckCircle,
  Briefcase
} from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("Software Engineer");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillProficiencies, setSkillProficiencies] = useState<Record<string, number>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [weeklyHours, setWeeklyHours] = useState(10);
  
  const { onboardUser, uploadResume, isLoading } = useStore();
  const navigate = useNavigate();

  const careerGoals = [
    { name: "Software Engineer", desc: "Build robust APIs, algorithms, and full-stack software applications." },
    { name: "Data Analyst", desc: "Query databases, extract insights, and build interactive dashboards." },
    { name: "Business Analyst", desc: "Translate business requirements into technical insights and analytical data." },
    { name: "Product Manager", desc: "Design product roadmaps, user stories, and drive cross-functional releases." },
    { name: "UI/UX Designer", desc: "Conduct user research, build wireframes, and design responsive user experiences." },
    { name: "AI/ML Engineer", desc: "Train neural networks, build predictive models, and optimize pipeline data." }
  ];

  const skillOptions: Record<string, string[]> = {
    "Software Engineer": ["Java", "Python", "SQL", "React", "Git", "DSA", "OOP", "System Design"],
    "Data Analyst": ["SQL", "Excel", "Python", "Power BI", "Statistics", "Tableau", "Pandas", "Math"],
    "Business Analyst": ["Excel", "SQL", "Power BI", "Communication", "Aptitude", "Tableau", "Agile"],
    "Product Manager": ["Communication", "Product Strategy", "Analytics", "Wireframing", "Aptitude", "Agile"],
    "UI/UX Designer": ["Figma", "Wireframing", "Prototyping", "User Research", "CSS", "HTML", "Creative"],
    "AI/ML Engineer": ["Python", "Machine Learning", "Deep Learning", "SQL", "Math", "Statistics", "PyTorch"]
  };

  const currentSkillsList = skillOptions[selectedGoal] || ["Communication", "Aptitude", "SQL"];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      const newProf = { ...skillProficiencies };
      delete newProf[skill];
      setSkillProficiencies(newProf);
    } else {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillProficiencies({ ...skillProficiencies, [skill]: 3 }); // default to 3
    }
  };

  const handleRatingChange = (skill: string, val: number) => {
    setSkillProficiencies({
      ...skillProficiencies,
      [skill]: val
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    const formattedSkills: UserSkill[] = selectedSkills.map((s) => ({
      name: s,
      proficiency: skillProficiencies[s] || 0
    }));

    try {
      // 1. Submit skills & career path
      await onboardUser({
        career_goal: selectedGoal,
        skills: formattedSkills,
        weekly_study_hours: weeklyHours
      });

      // 2. If resume was uploaded, parse and upload it
      if (resumeFile) {
        await uploadResume(resumeFile);
      }

      // 3. Move to dashboard portal
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to submit onboarding data. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col justify-center">
        
        {/* Step Indicator Header */}
        <div className="flex justify-between items-center mb-8 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`h-2.5 w-8 rounded-full transition-all ${
                  i <= step 
                    ? "bg-gradient-to-r from-primary to-secondary" 
                    : "bg-slate-800"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Step {step} of 5
          </span>
        </div>

        {/* Step 1: Choose Career Goal */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2 justify-center md:justify-start">
                <Compass className="h-6 w-6 text-primary-light" /> Choose Your Target Role
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select the career pathway you want to build and become placement-ready for.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careerGoals.map((goal) => (
                <button
                  key={goal.name}
                  onClick={() => {
                    setSelectedGoal(goal.name);
                    setSelectedSkills([]);
                    setSkillProficiencies({});
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all relative ${
                    selectedGoal === goal.name
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/5"
                      : "border-slate-800 bg-slate-900/40 hover:bg-slate-900/60"
                  }`}
                >
                  {selectedGoal === goal.name && (
                    <span className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <h3 className="font-bold text-sm text-slate-100 mb-1 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    {goal.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{goal.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Current Skills */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary-light" /> What are your current skills?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select the tools, concepts, or languages you have already been exposed to.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {currentSkillsList.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent"
                        : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Rate Proficiency */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Star className="h-6 w-6 text-primary-light" /> Rate Your Skill Proficiency
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Self-evaluate your comfort level with your selected skills (0 = None, 5 = Expert).
              </p>
            </div>

            {selectedSkills.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/30 border border-dashed border-slate-800 text-slate-500 text-sm">
                No skills selected in the previous step. Click Back to select some.
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {selectedSkills.map((skill) => (
                  <div 
                    key={skill} 
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <span className="font-bold text-sm text-slate-200">{skill}</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const score = skillProficiencies[skill] || 0;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleRatingChange(skill, val)}
                            className={`p-1 rounded transition-colors ${
                              val <= score ? "text-amber-400" : "text-slate-700 hover:text-slate-500"
                            }`}
                          >
                            <Star className="h-5 w-5 fill-current" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Upload Resume */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary-light" /> Upload Your Resume (Optional)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload your resume in PDF/TXT format to let the AI calculate your ATS score and suggest missing keywords.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/20 text-center relative group hover:border-primary/50 transition-all">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              
              {resumeFile ? (
                <div className="space-y-3 flex flex-col items-center">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-200">{resumeFile.name}</p>
                    <p className="text-[10px] text-slate-500">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="bg-slate-800/80 p-4 rounded-full border border-slate-700/60 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-300">Click or Drag & Drop File</p>
                    <p className="text-[10px] text-slate-500 mt-1">PDF or TXT format up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Weekly Study Hours */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary-light" /> Set Your Learning Committment
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                How many hours per week do you want to allocate for studying?
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Weekly Target:</span>
                <span className="text-2xl font-bold text-secondary-light">{weeklyHours} Hours</span>
              </div>

              <input
                type="range"
                min="3"
                max="40"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />

              <div className="flex justify-between text-[10px] text-slate-500">
                <span>3 hrs (Light Study)</span>
                <span>15 hrs (Moderate)</span>
                <span>40 hrs (Placement BootCamp)</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-900">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-1 px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 disabled:opacity-30 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary font-bold text-xs text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/10"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary font-bold text-sm text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isLoading ? "Saving Setup..." : "Finish & Forge Roadmap"} <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
