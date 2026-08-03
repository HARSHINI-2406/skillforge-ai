import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Brain, Lock, Mail, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const { login, isLoading, authError, user, checkAuth } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      if (user.is_onboarded) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in all credentials.");
      return;
    }
    setErrorMsg("");
    try {
      await login(email, password);
      // Retrieve updated auth status
      const updatedUser = useStore.getState().user;
      if (updatedUser) {
        if (updatedUser.is_onboarded) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-md rounded-2xl glass-panel p-8 border border-slate-700/50 shadow-2xl relative">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30 mb-3">
              <Brain className="h-8 w-8 text-primary-light" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-1">
              Log in to continue building your career roadmap.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  required
                  className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary-light hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 font-semibold text-sm rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 active:scale-95 transition-all text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Loggin in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-light hover:underline font-medium">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
