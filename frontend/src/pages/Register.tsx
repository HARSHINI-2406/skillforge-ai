import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Brain, User, Mail, Lock, Building, GraduationCap, Calendar, Compass, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("");
  const [goal, setGoal] = useState("Software Engineer");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, isLoading } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !college || !dept || !year) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setErrorMsg("");
    try {
      await register({
        full_name: name,
        email,
        password,
        college,
        department: dept,
        year,
        career_goal: goal,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Try again.");
    }
  };

  const roles = [
    "Software Engineer",
    "Data Analyst",
    "Business Analyst",
    "Product Manager",
    "UI/UX Designer",
    "AI/ML Engineer"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-lg rounded-2xl glass-panel p-8 border border-slate-700/50 shadow-2xl relative">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30 mb-3">
              <Brain className="h-8 w-8 text-primary-light" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Create Your Account</h2>
            <p className="text-xs text-slate-400 mt-1">
              Begin mapping your placements readiness profile today.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400">
              Registration successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    required
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-100 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@college.edu"
                    required
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-100 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-100 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  College Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="IIT Madras"
                    required
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-100 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Department
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="Computer Science"
                    required
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-100 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Academic Year
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="3rd Year"
                    required
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-100 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                Target Career Goal
              </label>
              <div className="relative">
                <Compass className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-100 focus:outline-none focus:border-primary transition-all appearance-none"
                >
                  {roles.map((r) => (
                    <option key={r} value={r} className="bg-slate-900">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3.5 mt-2 font-semibold text-sm rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 active:scale-95 transition-all text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Registering...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-light hover:underline font-medium">
              Log In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
