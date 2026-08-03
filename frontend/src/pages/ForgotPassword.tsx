import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Mail, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="w-full max-w-md rounded-2xl glass-panel p-8 border border-slate-700/50 shadow-2xl relative">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="bg-primary/20 p-3 rounded-2xl border border-primary/30 mb-3">
              <Brain className="h-8 w-8 text-primary-light" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Reset Password</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your email to receive recovery instructions.
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400">
                A password reset link has been dispatched to <strong>{email}</strong> if it is registered with us.
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs text-primary-light hover:underline mt-4"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </div>
          ) : (
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

              <button
                type="submit"
                className="w-full py-3.5 font-semibold text-sm rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 active:scale-95 transition-all text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                Send Instructions
              </button>

              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
