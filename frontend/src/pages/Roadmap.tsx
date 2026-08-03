import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIMentor from "../components/AIMentor";
import { 
  Map, 
  Sparkles, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  PlayCircle, 
  Download, 
  RefreshCw, 
  BookOpen, 
  ExternalLink,
  Code
} from "lucide-react";

export default function Roadmap() {
  const { 
    user, 
    activeRoadmap, 
    fetchActiveRoadmap, 
    generateRoadmap, 
    completeTask, 
    isLoading 
  } = useStore();
  
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({ 1: true });
  const [duration, setDuration] = useState(90);

  useEffect(() => {
    fetchActiveRoadmap();
  }, [fetchActiveRoadmap]);

  const handleToggleWeek = (week: number) => {
    setExpandedWeeks({
      ...expandedWeeks,
      [week]: !expandedWeeks[week],
    });
  };

  const handleRegenerate = async () => {
    if (!user?.career_goal) return;
    if (window.confirm("Regenerate roadmap with AI? This will reset current task progress.")) {
      await generateRoadmap(user.career_goal, duration);
      // Auto expand first week
      setExpandedWeeks({ 1: true });
    }
  };

  const handleCheckTask = async (taskId: number) => {
    await completeTask(taskId);
  };

  // Simple clean PDF export using print dialogue (optimized via print styling)
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Hide navbar/sidebar in print mode */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="flex-1 flex">
        <div className="print:hidden">
          <Sidebar />
        </div>

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-73px)] print:p-0 print:max-h-none print:overflow-visible bg-slate-950 print:bg-white print:text-slate-900">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:mb-8 print:border-b print:pb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-100 print:text-slate-900 flex items-center gap-2">
                Personalized Learning Roadmap <Map className="text-primary-light print:text-primary h-6 w-6" />
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-500 mt-1">
                Target Role: <span className="text-slate-200 print:text-slate-800 font-semibold">{user?.career_goal}</span> • Duration: {activeRoadmap?.duration_days || duration} Days
              </p>
            </div>

            <div className="flex flex-wrap gap-3 print:hidden">
              {/* Duration filter for generation */}
              {!activeRoadmap && (
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value={30}>30 Days (Fast Track)</option>
                  <option value={60}>60 Days (Standard)</option>
                  <option value={90}>90 Days (Placement Ready)</option>
                </select>
              )}

              {activeRoadmap ? (
                <>
                  <button
                    onClick={handleRegenerate}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 disabled:opacity-50 transition-all"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Regenerate
                  </button>
                  
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700 transition-all"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                </>
              ) : (
                <button
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white hover:opacity-90 active:scale-95 shadow-lg shadow-primary/25 transition-all"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Generating Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" /> Generate with AI
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {activeRoadmap ? (
            <div className="space-y-6">
              
              {/* AI Summary Banner */}
              {activeRoadmap.ai_summary && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 print:border-slate-300 print:from-slate-100 print:to-slate-100 space-y-2">
                  <h3 className="text-xs font-bold text-slate-100 print:text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary-light print:text-primary animate-pulse" /> Learning Strategy
                  </h3>
                  <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                    {activeRoadmap.ai_summary}
                  </p>
                </div>
              )}

              {/* Group tasks by week */}
              {Array.from(new Set(activeRoadmap.tasks.map((t) => t.week_number)))
                .sort((a, b) => a - b)
                .map((weekNum) => {
                  const weekTasks = activeRoadmap.tasks.filter((t) => t.week_number === weekNum);
                  const isExpanded = expandedWeeks[weekNum] || false;
                  
                  // Stats for week
                  const completedCount = weekTasks.filter((t) => t.is_completed).length;
                  const totalCount = weekTasks.length;
                  const isWeekDone = completedCount === totalCount && totalCount > 0;

                  return (
                    <div 
                      key={weekNum} 
                      className={`rounded-2xl border transition-all ${
                        isWeekDone
                          ? "border-emerald-500/20 bg-emerald-500/5 print:border-slate-300"
                          : "border-slate-800 bg-slate-900/40 print:border-slate-300"
                      }`}
                    >
                      {/* Week Accordion Trigger */}
                      <button
                        onClick={() => handleToggleWeek(weekNum)}
                        className="w-full flex items-center justify-between p-5 text-left print:pointer-events-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isWeekDone ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-200 print:text-slate-800 flex items-center gap-2">
                              Week {weekNum} : Foundation & Focus
                              {isWeekDone && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">All Done</span>}
                            </h3>
                            <p className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">
                              {completedCount} of {totalCount} tasks completed
                            </p>
                          </div>
                        </div>

                        <div className="print:hidden">
                          {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                        </div>
                      </button>

                      {/* Week Tasks list */}
                      {(isExpanded || window.matchMedia('print').matches) && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 print:border-slate-300 space-y-4">
                          {weekTasks.map((task) => (
                            <div 
                              key={task.id}
                              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all ${
                                task.is_completed 
                                  ? "bg-slate-950/40 border-slate-850 opacity-70 print:bg-slate-50 print:border-slate-200" 
                                  : "bg-slate-900/60 border-slate-800 print:bg-white print:border-slate-200"
                              }`}
                            >
                              <div className="flex items-start gap-3.5">
                                {/* Checkoff action */}
                                <button
                                  onClick={() => handleCheckTask(task.id)}
                                  disabled={task.is_completed}
                                  className="mt-0.5 print:hidden"
                                >
                                  {task.is_completed ? (
                                    <CheckCircle className="h-5 w-5 text-emerald-400 fill-emerald-500/10" />
                                  ) : (
                                    <PlayCircle className="h-5 w-5 text-slate-600 hover:text-primary-light transition-colors" />
                                  )}
                                </button>
                                
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-slate-200 print:text-slate-800 flex items-center gap-2">
                                    Day {task.day_number}: {task.title}
                                    {task.is_completed && <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded print:text-emerald-700">Done</span>}
                                  </h4>
                                  <p className="text-xs text-slate-400 print:text-slate-600 leading-relaxed max-w-xl">
                                    {task.description}
                                  </p>

                                  {/* Practice / Projects details */}
                                  {task.practice_problems && task.practice_problems.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-slate-800/40 flex items-center gap-2">
                                      <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                                        <Code className="h-3 w-3" /> Practice Challenges:
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {task.practice_problems.map((prob, i) => (
                                          <a
                                            key={i}
                                            href={`https://leetcode.com/problemset/all/?search=${encodeURIComponent(prob)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[9px] bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded flex items-center gap-0.5 print:bg-slate-100 print:text-slate-700"
                                          >
                                            {prob} <ExternalLink className="h-2 w-2" />
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {task.mini_project && (
                                    <div className="mt-2 pt-2 border-t border-slate-800/40 flex items-center gap-2 text-[10px]">
                                      <span className="text-slate-500 font-semibold">Weekend Deliverable:</span>
                                      <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                                        {task.mini_project.name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex md:flex-col items-end gap-2 text-right">
                                <span className={`text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold ${
                                  task.difficulty === "Advanced" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                  task.difficulty === "Intermediate" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                  "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                }`}>
                                  {task.difficulty}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">
                                  Estimate: {task.time_estimate_mins} mins
                                </span>
                                <span className="text-[10px] text-primary-light font-bold">
                                  +{task.xp_value} XP
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 glass-panel">
              <Map className="h-10 w-10 text-slate-500 mx-auto mb-4" />
              <p className="text-sm text-slate-400">Your AI-driven career learning roadmap is ready to be structured.</p>
              <button
                onClick={handleRegenerate}
                className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-lg"
              >
                Assemble Learning Roadmap
              </button>
            </div>
          )}
        </main>
      </div>

      <div className="print:hidden">
        <AIMentor />
      </div>
    </div>
  );
}
