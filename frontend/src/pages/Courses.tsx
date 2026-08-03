import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIMentor from "../components/AIMentor";
import { BookOpen, Search, Filter, ExternalLink, Play } from "lucide-react";

export default function Courses() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [price, setPrice] = useState("all");

  const resources = [
    {
      title: "Advanced SQL Masterclass",
      platform: "YouTube",
      author: "Alex The Analyst",
      level: "Intermediate",
      price: "Free",
      duration: "10 hours",
      url: "https://www.youtube.com/results?search_query=alex+the+analyst+sql",
      category: "SQL"
    },
    {
      title: "Python for Data Analysis & Pandas",
      platform: "FreeCodeCamp",
      author: "Keith Galli",
      level: "Beginner",
      price: "Free",
      duration: "4 hours",
      url: "https://www.youtube.com/results?search_query=freecodecamp+pandas",
      category: "Python"
    },
    {
      title: "Power BI Bootcamp & Visualizations",
      platform: "Coursera",
      author: "PwC Technical Specialists",
      level: "Intermediate",
      price: "Paid",
      duration: "18 hours",
      url: "https://www.coursera.org/search?query=power%20bi",
      category: "Power BI"
    },
    {
      title: "Data Structures & Algorithms in Java",
      platform: "GeeksforGeeks",
      author: "GFG Authors",
      level: "Advanced",
      price: "Free",
      duration: "30 hours",
      url: "https://www.geeksforgeeks.org/data-structures/",
      category: "DSA"
    },
    {
      title: "React (Vite) & TypeScript Full Course",
      platform: "FreeCodeCamp",
      author: "John Smilga",
      level: "Beginner",
      price: "Free",
      duration: "12 hours",
      url: "https://www.youtube.com/results?search_query=freecodecamp+react+typescript",
      category: "React"
    },
    {
      title: "System Design Fundamentals",
      platform: "LeetCode",
      author: "LeetCode Premium",
      level: "Advanced",
      price: "Paid",
      duration: "15 hours",
      url: "https://leetcode.com/discuss/general-discussion/1082786/System-Design-Introduction-a-beginner's-guide",
      category: "System Design"
    }
  ];

  // Filtering Logic
  const filteredResources = resources.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          res.category.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = level === "all" || res.level.toLowerCase() === level.toLowerCase();
    const matchesPrice = price === "all" || res.price.toLowerCase() === price.toLowerCase();
    return matchesSearch && matchesLevel && matchesPrice;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-73px)]">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              Curated Courses & Resources <BookOpen className="h-6 w-6 text-primary-light" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Top technical playlists, guides, and modules tailored to accelerate your active roadmap gaps.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills (SQL, Python, React...)"
                className="w-full bg-slate-850 border border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Level */}
            <div className="relative">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700/60 rounded-xl py-3 px-4 text-xs text-slate-300 focus:outline-none appearance-none"
              >
                <option value="all">All Difficulty Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Price */}
            <div className="relative">
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700/60 rounded-xl py-3 px-4 text-xs text-slate-300 focus:outline-none appearance-none"
              >
                <option value="all">Free & Paid</option>
                <option value="free">Free Only</option>
                <option value="paid">Paid Only</option>
              </select>
            </div>
          </div>

          {/* Resources Catalog Grid */}
          {filteredResources.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 glass-panel">
              <Filter className="h-10 w-10 text-slate-500 mx-auto mb-4" />
              <p className="text-sm text-slate-400">No resources matched your selected query filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res, i) => (
                <div 
                  key={i} 
                  className="rounded-2xl p-5 glass-panel border border-slate-750/50 hover:border-primary/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        {res.category}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                        res.price === "Free" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {res.price}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-100 hover:text-primary-light transition-colors line-clamp-1">
                        {res.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1">
                        by {res.author} • {res.platform}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-3 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {res.level} • {res.duration}
                    </span>
                    
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200 px-3.5 py-2 rounded-lg transition-colors border border-slate-700"
                    >
                      Start <Play className="h-3 w-3 text-slate-400 fill-current" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <AIMentor />
    </div>
  );
}
