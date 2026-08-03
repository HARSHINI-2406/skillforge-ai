import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Brain, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useStore();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 glass-panel border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-lg border border-primary/40 group-hover:border-secondary transition-all">
            <Brain className="h-6 w-6 text-primary group-hover:text-secondary transition-all" />
          </div>
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
            SkillForge AI
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          {isAuthenticated && (
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 hidden sm:inline">
                Welcome, <span className="text-slate-200 font-semibold">{user?.full_name}</span>
              </span>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                Portal
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all text-white shadow-lg shadow-primary/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
