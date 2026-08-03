import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { 
  LayoutDashboard, 
  Target, 
  Map, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  BarChart2, 
  Users, 
  LogOut, 
  Brain,
  Award
} from "lucide-react";

export default function Sidebar() {
  const { logout, analytics } = useStore();
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/skills", label: "Skill Analysis", icon: Target },
    { to: "/roadmap", label: "Roadmap", icon: Map },
    { to: "/courses", label: "Courses", icon: BookOpen },
    { to: "/tasks", label: "Tasks & Habits", icon: CheckSquare },
    { to: "/resume", label: "Resume ATS", icon: FileText },
    { to: "/analytics", label: "Analytics", icon: BarChart2 },
    { to: "/community", label: "Community", icon: Users },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col h-[calc(100vh-73px)] sticky top-[73px]">
      {/* Navigation list */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-secondary/10 border border-primary/30 text-white font-semibold shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Streak and XP HUD in Sidebar */}
      {analytics && (
        <div className="px-4 py-4 m-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">🔥 Streak</span>
            <span className="font-bold text-amber-400">{analytics.streak} days</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">✨ XP Points</span>
            <span className="font-bold text-primary-light">{analytics.total_xp} XP</span>
          </div>
          {analytics.badges && analytics.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-slate-700/30">
              {analytics.badges.map((badge, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20"
                >
                  <Award className="h-3 w-3" />
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
