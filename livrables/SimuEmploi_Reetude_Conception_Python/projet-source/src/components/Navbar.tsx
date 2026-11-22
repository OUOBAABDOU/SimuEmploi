import React from "react";
import { Video, Award, BookOpen, Layers, Sparkles, MessageSquarePlus } from "lucide-react";

interface NavbarProps {
  activeTab: "setup" | "scenarios" | "history" | "star_guide" | "feedback" | "interview" | "report";
  setActiveTab: (tab: "setup" | "scenarios" | "history" | "star_guide" | "feedback") => void;
  savedSessionsCount: number;
}


export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedSessionsCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab("setup")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Video className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  SimuEmploi AI
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> IA Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                Simulation d'entretiens & Coaching vocal / corporel
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab("setup")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "setup"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Simulateur</span>
            </button>

            <button
              onClick={() => setActiveTab("scenarios")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "scenarios"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Scénarios</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Suivi & Historique</span>
              {savedSessionsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-indigo-500/30 text-indigo-200 rounded-full">
                  {savedSessionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("star_guide")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "star_guide"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Méthode STAR</span>
            </button>

            <button
              onClick={() => setActiveTab("feedback")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "feedback"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
              <span>Avis</span>
            </button>
          </nav>

          {/* Quick Status */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Gemini 3.6 IA Connecté</span>
            </div>

            <button
              onClick={() => setActiveTab("setup")}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Démarrer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 py-1.5 px-1 text-[11px] font-medium sticky bottom-0 z-50">
        <button
          onClick={() => setActiveTab("setup")}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-lg min-h-[44px] transition-colors ${
            activeTab === "setup" ? "text-indigo-400 font-bold bg-indigo-500/10" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Simulateur</span>
        </button>
        <button
          onClick={() => setActiveTab("scenarios")}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-lg min-h-[44px] transition-colors ${
            activeTab === "scenarios" ? "text-indigo-400 font-bold bg-indigo-500/10" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Scénarios</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-lg min-h-[44px] transition-colors relative ${
            activeTab === "history" ? "text-indigo-400 font-bold bg-indigo-500/10" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <div className="relative">
            <Award className="w-4 h-4" />
            {savedSessionsCount > 0 && (
              <span className="absolute -top-1 -right-2 text-[9px] font-extrabold bg-indigo-500 text-white rounded-full px-1 min-w-[14px] text-center">
                {savedSessionsCount}
              </span>
            )}
          </div>
          <span>Historique</span>
        </button>
        <button
          onClick={() => setActiveTab("star_guide")}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-lg min-h-[44px] transition-colors ${
            activeTab === "star_guide" ? "text-indigo-400 font-bold bg-indigo-500/10" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Guide</span>
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-lg min-h-[44px] transition-colors ${
            activeTab === "feedback" ? "text-indigo-400 font-bold bg-indigo-500/10" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
          <span>Avis</span>
        </button>
      </div>
    </header>
  );
};
