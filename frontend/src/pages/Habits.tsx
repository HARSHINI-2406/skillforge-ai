import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIMentor from "../components/AIMentor";
import { CheckSquare, Flame, Award, Shield, Check, Star, Trophy } from "lucide-react";

export default function Habits() {
  const { analytics, fetchAnalytics, completeTask } = useStore();
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [loadingHabit, setLoadingHabit] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const habits = [
    { id: "learn", label: "Learn: Read technical blogs, docs or watch a tutorial", xp: 30 },
    { id: "practice", label: "Practice: Solve 1-2 coding problems on Leetcode/Hackerrank", xp: 40 },
    { id: "revise", label: "Revise: Go over previously learned concepts or definitions", xp: 20 },
    { id: "build", label: "Build: Write code for your weekend portfolio mini-project", xp: 50 },
    { id: "apply", label: "Apply: Tailor your resume or apply to 1 relevant internship", xp: 30 }
  ];

  const handleCheckHabit = async (habitId: string, xpValue: number) => {
    if (completedToday.includes(habitId)) return;
    setLoadingHabit(habitId);
    
    // Simulate updating XP points and habits in database
    // We will call completeTask or locally simulate a database refresh
    // For local visual feedback, we append to state
    setCompletedToday([...completedToday, habitId]);
    
    // Call analytics refresh after small timeout
    setTimeout(() => {
      setLoadingHabit(null);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-73px)]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
                Daily Habit Tracker <CheckSquare className="h-6 w-6 text-primary-light" />
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Establish placement readiness habits. Check off items daily to lock in streaks and gain XP points.
              </p>
            </div>

            <div className="flex gap-4 items-center bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl">
              <div className="flex items-center gap-1">
                <Flame className="h-5 w-5 text-amber-500 fill-current" />
                <span className="text-sm font-extrabold text-slate-200">{analytics?.streak || 0} Day Streak</span>
              </div>
              <div className="h-4 w-px bg-slate-850" />
              <div className="flex items-center gap-1">
                <Trophy className="h-4.5 w-4.5 text-primary-light" />
                <span className="text-sm font-extrabold text-slate-200">{analytics?.total_xp || 0} XP</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Daily Checklist Column */}
            <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-5">
              <h3 className="font-bold text-sm text-slate-200">Daily Study Habits</h3>
              
              <div className="space-y-4">
                {habits.map((habit) => {
                  const isDone = completedToday.includes(habit.id);
                  return (
                    <div 
                      key={habit.id}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                        isDone 
                          ? "bg-slate-950/40 border-slate-850 opacity-60" 
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCheckHabit(habit.id, habit.xp)}
                          disabled={isDone || loadingHabit === habit.id}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                            isDone 
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" 
                              : "border-slate-700 hover:border-primary hover:bg-primary/5 text-transparent"
                          }`}
                        >
                          {isDone ? <Check className="h-4 w-4" /> : <span className="w-2.5 h-2.5 bg-primary rounded-sm opacity-0 hover:opacity-50 transition-opacity" />}
                        </button>

                        <span className="text-xs font-medium text-slate-300">
                          {habit.label}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold text-primary-light whitespace-nowrap bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                        +{habit.xp} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badges Column */}
            <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-6">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" /> Achievement Badges
              </h3>

              {analytics?.badges && analytics.badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {analytics.badges.map((badge, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-center gap-2"
                    >
                      <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400">
                        <Shield className="h-6 w-6 fill-current" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">
                        {badge}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-slate-900/20 border border-dashed border-slate-800 text-xs text-slate-500">
                  Complete your first roadmap task to earn your "First Milestone" badge!
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <AIMentor />
    </div>
  );
}
