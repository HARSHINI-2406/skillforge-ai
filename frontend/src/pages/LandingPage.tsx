import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  Brain, 
  Target, 
  Map, 
  TrendingUp, 
  FileText, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  Play,
  Star,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "10,000+", label: "Students Empowered" },
    { value: "92%", label: "Roadmap Completion Rate" },
    { value: "85%", label: "Placement Readiness Rate" },
    { value: "4.8/5", label: "User Satisfaction" },
  ];

  const features = [
    {
      icon: Target,
      title: "Skill Gap Detection",
      desc: "Instantly compare your capabilities against real industry roles and identify precisely what is holding you back.",
      color: "from-violet-500/20 to-purple-500/10"
    },
    {
      icon: Map,
      title: "AI Career Roadmaps",
      desc: "Receive a personalized 30/60/90-day day-by-day learning layout that adapts dynamically based on your progress.",
      color: "from-cyan-500/20 to-blue-500/10"
    },
    {
      icon: TrendingUp,
      title: "Adaptive Learning Engine",
      desc: "Our model customizes challenges: recommending foundational exercises if you hit a wall, or advanced paths if you zoom ahead.",
      color: "from-amber-500/20 to-orange-500/10"
    },
    {
      icon: FileText,
      title: "Resume ATS Analyzer",
      desc: "Upload your resume in PDF format to receive instant AI ratings, keyword optimization recommendations, and better writing templates.",
      color: "from-emerald-500/20 to-teal-500/10"
    },
    {
      icon: GraduationCap,
      title: "Placement Readiness Score",
      desc: "Keep tabs on a numerical score summarizing your readiness index. Watch it build as you complete skills and tests.",
      color: "from-rose-500/20 to-pink-500/10"
    },
    {
      icon: ShieldCheck,
      title: "Curation & Free Resources",
      desc: "Access structured playlists, coding playgrounds, and documentation links without scanning thousands of disjointed links.",
      color: "from-indigo-500/20 to-violet-500/10"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Assess & Target",
      desc: "Select your career goal (e.g. Data Analyst, AI Engineer) and complete a quick onboarding skills diagnostic questionnaire."
    },
    {
      step: "02",
      title: "Adapt & Learn",
      desc: "Follow your AI-generated roadmap, check off daily learning steps, read curated tutorials, and build mini projects."
    },
    {
      step: "03",
      title: "Analyze & Get Hired",
      desc: "Refine your resume with our ATS optimizer, track your readiness metrics, practice mock interviews, and land placements."
    }
  ];

  const faqs = [
    {
      q: "How does the AI create my roadmap?",
      a: "Our system combines role prerequisites with your onboarding self-assessments and resume keywords. Using generative AI (Gemini), it slices this data into a day-by-day sequence of bite-sized tasks, practice questions, and projects."
    },
    {
      q: "Can I use SkillForge AI without an API key?",
      a: "Yes! While an API key unlocks real-time dynamic AI responses, the platform has a high-fidelity mock generator that creates fully structured roadmaps and resume ATS reports, letting you demo the features completely offline."
    },
    {
      q: "How does the Placement Readiness Score work?",
      a: "It computes a score from 0 to 100 based on your completed roadmap tasks, your skill proficiency scores, and your resume score. It acts as an indicator of how prepared you are to clear technical selection screens."
    },
    {
      q: "Is the platform mobile responsive?",
      a: "Absolutely! The entire dashboard, roadmap timeline, and chatbot interface are designed with flexible responsive layouts, allowing you to study on desktop, tablet, or mobile."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 self-center lg:self-start bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-full text-xs text-primary-light font-medium mb-6">
              <Brain className="h-4 w-4" /> AI-Powered Career Optimization
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6">
              Forge Your Skills.<br />
              <span className="bg-gradient-to-r from-primary-light via-secondary-light to-accent-light bg-clip-text text-transparent">
                Shape Your Career.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              SkillForge AI identifies your skill gaps, designs custom learning paths, and optimizes your resume. Track your placements readiness score index day-by-day.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 text-center font-bold rounded-xl bg-gradient-to-r from-primary via-primary-light to-secondary hover:scale-105 active:scale-95 transition-all text-white shadow-xl shadow-primary/25 flex items-center justify-center gap-2 group"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 text-center font-bold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Hero Right Dashboard Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Background glow orbs */}
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary/15 rounded-full blur-3xl" />

            <div className="w-full max-w-[420px] rounded-2xl glass-panel p-6 shadow-2xl relative border border-slate-700/60 overflow-hidden animate-float">
              {/* Fake window controls */}
              <div className="flex gap-1.5 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>

              {/* Mockup layout */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Target: Data Analyst</span>
                  <span className="text-xs font-bold text-secondary-light">Match: 78%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: "78%" }} />
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Active 90-Day Roadmap</span>
                  <div className="mt-2 space-y-2">
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-xs font-medium text-slate-300">Advanced Joins & CTEs</span>
                      </div>
                      <span className="text-[9px] bg-slate-900 px-2 py-0.5 rounded text-green-400 border border-green-500/20">Done</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-slate-300">Power BI DAX measures</span>
                      </div>
                      <span className="text-[9px] bg-slate-900 px-2 py-0.5 rounded text-amber-400 border border-amber-500/20">In Progress</span>
                    </div>
                  </div>
                </div>

                {/* Score badge in mockup */}
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Placement Score:</span>
                  <span className="text-sm font-bold text-amber-400 glow-text-secondary bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    78 Points
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 border-y border-slate-800 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Equipped with Everything to Forge Your Success
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              A comprehensive career accelerator combined in a single dashboard to speed up your learning curve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={i} 
                  className="rounded-2xl p-6 glass-panel glass-panel-hover flex flex-col items-start"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feat.color} border border-white/5 mb-4`}>
                    <Icon className="h-6 w-6 text-slate-200" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-6 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How SkillForge AI Works
            </h2>
            <p className="text-slate-400 text-sm">
              Three simple steps to accelerate your college placement preparedness index.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative group">
                <span className="text-7xl font-extrabold text-slate-800/30 group-hover:text-slate-800/70 transition-all select-none">
                  {step.step}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-2 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Success Stories
            </h2>
            <p className="text-slate-400 text-sm">
              See how senior students and pre-placement aspirants land their targets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl glass-panel flex flex-col justify-between">
              <p className="text-slate-300 italic text-sm leading-relaxed mb-6">
                &ldquo;SkillForge AI was incredibly helpful before my campus placements. It marked my database gaps (I lacked advanced aggregations and query syntax) and mapped a 30-day dashboard path. The resume parsed keyword improvements improved my response rates from employers.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center font-bold text-white text-xs">
                  AR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Aniket Roy</h4>
                  <p className="text-[11px] text-slate-500">Placed as Data Analyst @ Deloittte</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl glass-panel flex flex-col justify-between">
              <p className="text-slate-300 italic text-sm leading-relaxed mb-6">
                &ldquo;I loved the adaptive roadmap! When I failed the tree quiz exercises, the bot instantly generated revision tasks and resource explanations. Watching my placement readiness score index push towards 85% gave me deep confidence.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center font-bold text-white text-xs">
                  MS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Megha Sharma</h4>
                  <p className="text-[11px] text-slate-500">AI/ML Engineer Intern @ Tech Mahindra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {activeFaq === i ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                {activeFaq === i && (
                  <div className="p-5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 bg-slate-900/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 px-6 py-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-slate-300">SkillForge AI</span>
          </div>
          <p>&copy; {new Date().getFullYear()} SkillForge AI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
