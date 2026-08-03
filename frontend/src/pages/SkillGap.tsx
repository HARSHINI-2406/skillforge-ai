import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIMentor from "../components/AIMentor";
import { Target, Sparkles, AlertCircle, CheckCircle, RefreshCw, Star } from "lucide-react";

export default function SkillGap() {
  const { skillGap, fetchSkillGap, updateSkillProficiency, isLoading } = useStore();
  const [updatingSkill, setUpdatingSkill] = useState<string | null>(null);

  useEffect(() => {
    fetchSkillGap();
  }, [fetchSkillGap]);

  const handleRatingChange = async (name: string, proficiency: number) => {
    setUpdatingSkill(name);
    await updateSkillProficiency(name, proficiency);
    setUpdatingSkill(null);
  };

  const getMatchColor = (pct: number) => {
    if (pct >= 80) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    if (pct >= 50) return "text-amber-400 border-amber-500/20 bg-amber-500/10";
    return "text-red-400 border-red-500/20 bg-red-500/10";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-73px)]">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
                Skill Gap Analysis <Target className="h-6 w-6 text-primary-light" />
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Evaluate your compatibility against requirements for: <span className="text-slate-200 font-semibold">{skillGap?.target_role || "Selected Role"}</span>
              </p>
            </div>
            
            <button
              onClick={() => fetchSkillGap()}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
              title="Recalculate Gap"
            >
              <RefreshCw className={`h-4 w-4 text-slate-300 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {skillGap ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Visual Radar/Grid & AI Summary */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Match HUD */}
                <div className={`p-6 rounded-2xl border flex items-center gap-5 justify-between ${getMatchColor(skillGap.match_percentage)}`}>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider block">Target Compatibility</span>
                    <h2 className="text-4xl font-extrabold">{skillGap.match_percentage}% Match</h2>
                  </div>
                  <div className="text-xs leading-relaxed max-w-[300px]">
                    {skillGap.match_percentage >= 80 
                      ? "Excellent! You are highly competitive for this role. Refine projects to stand out."
                      : skillGap.match_percentage >= 50
                      ? "Moderate progress. You have established core foundations but need to bridge visualizing and stats gaps."
                      : "Significant gaps remaining. Follow the 30/60/90-day learning roadmap to build core skills."
                    }
                  </div>
                </div>

                {/* AI Explanation card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 space-y-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-primary-light animate-pulse" /> AI Gap Diagnosis
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {skillGap.ai_explanation}
                  </p>
                </div>

                {/* Interactive SVG Skill Grid */}
                <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-6">
                  <h3 className="font-bold text-sm text-slate-200">Skill Proficiency Matrix</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...skillGap.current_skills, ...skillGap.missing_skills].map((skill) => (
                      <div 
                        key={skill.name} 
                        className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between gap-3 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{skill.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            skill.proficiency > 0 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {skill.proficiency > 0 ? "Mastered" : "Missing"}
                          </span>
                        </div>

                        {/* Interactive stars */}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-slate-500">Self Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                disabled={updatingSkill === skill.name}
                                onClick={() => handleRatingChange(skill.name, val)}
                                className={`p-0.5 rounded transition-colors ${
                                  val <= skill.proficiency 
                                    ? "text-amber-400 hover:text-amber-500" 
                                    : "text-slate-700 hover:text-slate-500"
                                }`}
                              >
                                <Star className="h-4 w-4 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Comparative Skill Lists */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Current skills */}
                <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4">
                  <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" /> Acquired Skills ({skillGap.current_skills.length})
                  </h3>
                  
                  {skillGap.current_skills.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-2">No skills registered yet. Try updating levels below.</p>
                  ) : (
                    <div className="space-y-2">
                      {skillGap.current_skills.map((skill) => (
                        <div 
                          key={skill.name} 
                          className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800"
                        >
                          <span className="text-xs text-slate-300 font-semibold">{skill.name}</span>
                          <span className="text-xs font-bold text-amber-400">Level {skill.proficiency}/5</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Missing/Target Skills */}
                <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4">
                  <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-400" /> Target Gaps to Bridge ({skillGap.missing_skills.length})
                  </h3>
                  
                  {skillGap.missing_skills.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-2">Amazing! You have 100% compliance with this role.</p>
                  ) : (
                    <div className="space-y-2">
                      {skillGap.missing_skills.map((skill) => (
                        <div 
                          key={skill.name} 
                          className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800/80"
                        >
                          <span className="text-xs text-slate-400 font-medium">{skill.name}</span>
                          <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                            Required
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 glass-panel">
              <AlertCircle className="h-10 w-10 text-slate-500 mx-auto mb-4" />
              <p className="text-sm text-slate-400">No profile configuration found. Go to onboarding first.</p>
            </div>
          )}
        </main>
      </div>

      <AIMentor />
    </div>
  );
}
