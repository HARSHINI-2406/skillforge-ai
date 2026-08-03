import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIMentor from "../components/AIMentor";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Briefcase, 
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Loader2
} from "lucide-react";

export default function ResumeAnalyzer() {
  const { latestResume, uploadResume, fetchResumeHistory, isLoading } = useStore();
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchResumeHistory();
  }, [fetchResumeHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage("");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      await uploadResume(file);
      setFile(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to analyze resume. Try again.");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    if (score >= 60) return "text-amber-400 border-amber-500/20 bg-amber-500/10";
    return "text-red-400 border-red-500/20 bg-red-500/10";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-73px)]">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              AI Resume ATS Optimizer <FileText className="h-6 w-6 text-primary-light" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Upload your resume to check keywords match rates, scan syntax, and view bulleted suggestions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Uploader Left Column */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4">
                <h3 className="font-bold text-sm text-slate-200">Upload Resume</h3>
                
                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-800 bg-slate-900/30 text-center relative group hover:border-primary/50 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      onChange={handleFileChange}
                      required
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {file ? (
                      <div className="space-y-2 text-center">
                        <CheckCircle className="h-10 w-10 text-green-400 mx-auto" />
                        <span className="text-[11px] font-bold text-slate-200 block truncate max-w-[150px]">{file.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2 text-center">
                        <Upload className="h-8 w-8 text-slate-500 mx-auto group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] text-slate-400 block">Select PDF or TXT resume</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !file}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white hover:opacity-90 active:scale-95 shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" /> Analyzing Content...
                      </>
                    ) : (
                      "Scan with AI"
                    )}
                  </button>
                </form>
              </div>

              {/* History list */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4">
                <h3 className="font-bold text-sm text-slate-200">Scan History</h3>
                {latestResume ? (
                  <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-300 truncate max-w-[120px]">{latestResume.filename}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">{new Date(latestResume.analyzed_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400">Score: {latestResume.ats_score}</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic text-center p-2">No history scans found.</p>
                )}
              </div>

            </div>

            {/* Results Right Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {latestResume ? (
                <div className="space-y-6">
                  
                  {/* Score & General Stats HUD */}
                  <div className={`p-6 rounded-2xl border flex items-center justify-between ${getScoreColor(latestResume.ats_score)}`}>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider block">ATS Compliance Grade</span>
                      <h2 className="text-4xl font-extrabold">{latestResume.ats_score} / 100</h2>
                    </div>
                    <div className="text-xs leading-relaxed max-w-[300px]">
                      {latestResume.ats_score >= 80 
                        ? "Strong compliance! Your resume covers core keywords. Implement bullets suggestions to polish."
                        : latestResume.ats_score >= 60
                        ? "Moderate compatibility. Multiple required keywords are missing from your project descriptions."
                        : "Critical warnings. Significant structural gaps or missing skills flagged. Improve bullet sentences immediately."
                      }
                    </div>
                  </div>

                  {/* Bullet comparisons */}
                  <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-5">
                    <h3 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                      <TrendingUp className="h-4.5 w-4.5 text-primary-light" /> Bullet Improvements Examples
                    </h3>

                    <div className="space-y-4">
                      {latestResume.improved_bullets?.map((bullet, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-red-400">Original Bullets:</span>
                            <p className="text-xs text-slate-400 italic">"{bullet.original}"</p>
                          </div>
                          
                          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-800/80 pt-3 md:pt-0 md:pl-4">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-400">AI Improved Bullets:</span>
                            <p className="text-xs text-slate-200 font-medium">"{bullet.improved}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keywords & Weak Sections */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Missing keywords */}
                    <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-3">
                      <h3 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-500" /> Missing ATS Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {latestResume.missing_keywords?.map((keyword) => (
                          <span 
                            key={keyword}
                            className="text-[10px] bg-slate-900 text-slate-300 border border-slate-750 px-2.5 py-1 rounded-md"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Weak Sections */}
                    <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-3">
                      <h3 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-red-500" /> Weak Resume Areas
                      </h3>
                      <ul className="space-y-2 pt-2 text-xs text-slate-400 leading-relaxed">
                        {latestResume.weak_sections?.map((sect, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-red-400 mt-0.5">•</span>
                            <span>{sect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Project Suggestions */}
                  <div className="p-6 rounded-2xl glass-panel border border-slate-700/50 space-y-4">
                    <h3 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-primary-light" /> Project suggestions to stand out
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
                      {latestResume.project_suggestions?.map((proj, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                          <ArrowRight className="h-4 w-4 text-slate-500 mt-0.5" />
                          <span>{proj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 glass-panel">
                  <FileText className="h-10 w-10 text-slate-500 mx-auto mb-4" />
                  <p className="text-sm text-slate-400">Upload your resume to see ATS score calculations.</p>
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
