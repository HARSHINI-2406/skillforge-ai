import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIMentor from "../components/AIMentor";
import { 
  Sparkles, 
  Flame, 
  Award, 
  CheckSquare, 
  BookOpen, 
  ChevronRight, 
  Play, 
  Compass,
  ArrowUpRight,
  Target
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function Dashboard() {
  const { 
    user, 
    analytics, 
    activeRoadmap, 
    fetchAnalytics, 
    fetchActiveRoadmap,
    completeTask 
  } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
    fetchActiveRoadmap();
  }, [fetchAnalytics, fetchActiveRoadmap]);

  const handleCheckTask = async (taskId: number) => {
    await completeTask(taskId);
  };

  // Get first 3 incomplete tasks
  const upcomingTasks = activeRoadmap?.tasks
    ?.filter((t) => !t.is_completed)
    ?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-73px)]">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
                Student Workspace <Sparkles className="h-6 w-6 text-primary-light animate-pulse" />
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Your daily overview for targeting: <span className="text-slate-200 font-semibold">{user?.career_goal}</span>
              </p>
            </div>
            
            {!activeRoadmap && (
              <button
                onClick={() => navigate("/roadmap")}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-primary/20"
              >
                <Compass className="h-4 w-4" /> Generate Learning Roadmap
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placement score card */}
            <div className="p-6 rounded-2xl glass-panel relative overflow-hidden border border-slate-700/50">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                Placement Readiness
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-400">
                  {analytics?.current_readiness_score || 40.0}%
                </span>
                <span className="text-[10px] text-green-400 flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" /> Ready
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${analytics?.current_readiness_score || 40}%` }} 
                />
              </div>
            </div>

            {/* Tasks Completed */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-700/50">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                Tasks Completed
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-primary-light">
                  {analytics?.completed_tasks || 0}
                </span>
                <span className="text-slate-500 text-xs font-semibold">
                  / {analytics?.total_tasks || 0} completed
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${analytics?.completion_rate || 0}%` }} 
                />
              </div>
            </div>

            {/* Weekly Learning Commitment */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-700/50">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                Weekly Study Load
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-secondary-light">
                  {analytics?.total_study_hours || 0.0} Hrs
                </span>
                <span className="text-slate-500 text-xs font-semibold">
                  out of {user?.weekly_hours}h goal
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full bg-secondary rounded-full" 
                  style={{ width: `${Math.min(((analytics?.total_study_hours || 0) / (user?.weekly_hours || 5)) * 100, 100)}%` }} 
                />
              </div>
            </div>

            {/* Internship matching rate */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-700/50">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                Internship Matching
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-400">
                  {analytics?.current_readiness_score ? Math.min(analytics.current_readiness_score + 10, 95) : 50}%
                </span>
                <span className="text-slate-500 text-xs font-semibold">
                  Compatibility Match
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${analytics?.current_readiness_score ? Math.min(analytics.current_readiness_score + 10, 95) : 50}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Charts & Streak Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Column */}
            <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-200">Study Hours Progress</h3>
                <span className="text-[10px] text-slate-500">Last 7 Days</span>
              </div>
              
              <div className="h-56">
                {analytics?.trend_history && analytics.trend_history.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.trend_history} margin={{ left: -30, right: 10, top: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="hoursGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#475569" fontSize={10} />
                      <YAxis stroke="#475569" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                        labelClassName="text-slate-300 font-bold"
                      />
                      <Area type="monotone" dataKey="study_hours" stroke="#7C3AED" fillOpacity={1} fill="url(#hoursGlow)" strokeWidth={2} name="Hours Studied" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    No analytics tracking data found. Complete tasks to display details.
                  </div>
                )}
              </div>
            </div>

            {/* Streak & Mentors Column */}
            <div className="space-y-6">
              
              {/* Streak HUD */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 relative overflow-hidden flex items-center justify-between">
                <div>
                  <h3 className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                    <Flame className="h-5 w-5 fill-current animate-pulse" /> Streak Master
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[180px] leading-snug">
                    Study daily to keep your streak multiplier active and claim bonus XP.
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-amber-400 block glow-text-primary">
                    {analytics?.streak || 0}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                    Days Active
                  </span>
                </div>
              </div>

              {/* AI Mentor Callout Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 relative overflow-hidden flex flex-col justify-between h-[130px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                      <Target className="h-4.5 w-4.5 text-primary-light" /> Stuck on a topic?
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Ask your adaptive AI mentor to explain concepts or generate quizzes.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Triggers mentor chat display
                    const botToggle = document.querySelector(".animate-float") as HTMLButtonElement;
                    if (botToggle) botToggle.click();
                  }}
                  className="w-full text-center py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all"
                >
                  Consult AI Mentor
                </button>
              </div>
            </div>
          </div>

          {/* Tasks & Recommended Learning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Today's Tasks */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-200">Today's Roadmap Checklist</h3>
                <Link to="/roadmap" className="text-xs text-primary-light hover:underline flex items-center gap-0.5">
                  Full View <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {upcomingTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 rounded-xl bg-slate-900/20 border border-dashed border-slate-800">
                  {activeRoadmap 
                    ? "Congratulations! You have completed all active roadmap tasks."
                    : "No active roadmap found. Generate one to view your tasks."
                  }
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCheckTask(task.id)}
                          className="w-5 h-5 rounded-md border border-slate-700 hover:border-primary flex items-center justify-center transition-colors"
                        >
                          <span className="w-2.5 h-2.5 bg-primary rounded-sm opacity-0 hover:opacity-50 transition-opacity" />
                        </button>
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{task.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Week {task.week_number} • Day {task.day_number}</p>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {task.task_type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Curated Recommendations */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-200">Recommended Learning Pathways</h3>
                <Link to="/courses" className="text-xs text-primary-light hover:underline flex items-center gap-0.5">
                  See All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-4 hover:border-slate-700 transition-all">
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">Advanced SQL Database Queries</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">YouTube Playlist • 14 videos • Free</p>
                  </div>
                  <a
                    href="https://www.youtube.com/results?search_query=advanced+sql"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Play className="h-4 w-4" />
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-4 hover:border-slate-700 transition-all">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">Power BI Complete Dax Functions</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Coursera Specialization • Intermediate • 12h</p>
                  </div>
                  <a
                    href="https://www.coursera.org/search?query=power%20bi%20dax"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Play className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AIMentor />
    </div>
  );
}
