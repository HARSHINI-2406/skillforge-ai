import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIMentor from "../components/AIMentor";
import { BarChart2, Download, Share2, Sparkles, AlertCircle } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, CartesianGrid 
} from "recharts";

export default function Analytics() {
  const { analytics, fetchAnalytics } = useStore();
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
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
                Learning Analytics Insights <BarChart2 className="h-6 w-6 text-primary-light print:text-primary" />
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-500 mt-1">
                Visualizing skill accumulation speed, study consistency, and readiness trends.
              </p>
            </div>

            <div className="flex gap-3 print:hidden">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all"
              >
                <Share2 className="h-4 w-4" /> Share Card
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white hover:opacity-90 active:scale-95 shadow-md transition-all"
              >
                <Download className="h-4 w-4" /> Export Report
              </button>
            </div>
          </div>

          {analytics ? (
            <div className="space-y-8">
              
              {/* Summary Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 print:grid-cols-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center print:border-slate-350">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Streak</span>
                  <span className="text-2xl font-extrabold text-amber-500 mt-1 block">{analytics.streak} days</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center print:border-slate-350">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">XP Points</span>
                  <span className="text-2xl font-extrabold text-primary-light mt-1 block">{analytics.total_xp} XP</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center print:border-slate-350">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Completion Rate</span>
                  <span className="text-2xl font-extrabold text-secondary-light mt-1 block">{analytics.completion_rate}%</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center print:border-slate-350">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Mock Score</span>
                  <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{analytics.latest_mock_test_score}/100</span>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-1">
                
                {/* 1. Study Hours Chart */}
                <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4 print:border-slate-300 print:bg-slate-50">
                  <h3 className="font-bold text-xs text-slate-200 print:text-slate-850">Weekly Study Effort (Hours)</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.trend_history} margin={{ left: -30, right: 10, top: 10, bottom: 0 }}>
                        <XAxis dataKey="date" stroke="#475569" fontSize={9} />
                        <YAxis stroke="#475569" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
                        <Area type="monotone" dataKey="study_hours" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.15} strokeWidth={2} name="Hours Studied" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Readiness Index Trend */}
                <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4 print:border-slate-300 print:bg-slate-50">
                  <h3 className="font-bold text-xs text-slate-200 print:text-slate-850">Placement Readiness Curve (%)</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.trend_history} margin={{ left: -30, right: 10, top: 10, bottom: 0 }}>
                        <XAxis dataKey="date" stroke="#475569" fontSize={9} />
                        <YAxis stroke="#475569" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
                        <Line type="monotone" dataKey="readiness_score" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Readiness Index" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Skill Growth Score */}
                <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4 print:border-slate-300 print:bg-slate-50">
                  <h3 className="font-bold text-xs text-slate-200 print:text-slate-850">Skill Growth Score Progression</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.trend_history} margin={{ left: -30, right: 10, top: 10, bottom: 0 }}>
                        <XAxis dataKey="date" stroke="#475569" fontSize={9} />
                        <YAxis stroke="#475569" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
                        <Bar dataKey="skill_growth" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Skill Growth" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Mock Assessment Scores */}
                <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4 print:border-slate-300 print:bg-slate-50">
                  <h3 className="font-bold text-xs text-slate-200 print:text-slate-850">Mock Test Scores Trend</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.trend_history} margin={{ left: -30, right: 10, top: 10, bottom: 0 }}>
                        <XAxis dataKey="date" stroke="#475569" fontSize={9} />
                        <YAxis stroke="#475569" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }} />
                        <Line type="monotone" dataKey="mock_test" stroke="#10B981" strokeWidth={2} name="Test Score" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 glass-panel">
              <AlertCircle className="h-10 w-10 text-slate-500 mx-auto mb-4" />
              <p className="text-sm text-slate-400">No analytics data recorded yet. Please complete tasks to initiate metrics tracing.</p>
            </div>
          )}

          {/* Social Share Modal Mockup */}
          {showShareModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-sm rounded-2xl border border-slate-700/60 p-6 shadow-2xl space-y-5 bg-slate-900">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-200">Share Progress Card</h3>
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="text-xs text-slate-450 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                {/* Progress Card preview */}
                <div className="p-5 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/15 to-secondary/5 text-center space-y-3">
                  <Sparkles className="h-6 w-6 text-primary-light mx-auto animate-pulse" />
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    "I just pushed my Placement Readiness Score on SkillForge AI to <strong>{analytics?.current_readiness_score || 40}%</strong> while targeting my career goal as a Data Analyst!"
                  </p>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-2">
                    #SkillForgeAI #CareerRoadmap
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert("Progress card copied to clipboard!");
                    setShowShareModal(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white transition-opacity"
                >
                  Copy to Clipboard
                </button>
              </div>
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
