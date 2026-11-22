import React, { useState } from "react";
import { SavedInterviewSession } from "../types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import {
  Award,
  TrendingUp,
  Calendar,
  Clock,
  Video,
  FileText,
  Trash2,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight,
  Filter,
  BarChart3,
  CheckCircle2
} from "lucide-react";

interface HistoryDashboardProps {
  sessions: SavedInterviewSession[];
  onSelectSession: (session: SavedInterviewSession) => void;
  onClearHistory: () => void;
  onStartNew: () => void;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({
  sessions,
  onSelectSession,
  onClearHistory,
  onStartNew,
}) => {
  const [sectorFilter, setSectorFilter] = useState<string>("all");

  // Filtered sessions
  const filteredSessions = sessions.filter(
    (s) => sectorFilter === "all" || s.sectorId === sectorFilter
  );

  // Compute aggregate stats
  const totalInterviews = sessions.length;
  const avgOverallScore = totalInterviews > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.report.overallScore, 0) / totalInterviews)
    : 0;
  const avgVocalScore = totalInterviews > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.report.vocalToneScore, 0) / totalInterviews)
    : 0;
  const avgBodyScore = totalInterviews > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.report.bodyLanguageScore, 0) / totalInterviews)
    : 0;

  // Chart data sorted chronologically
  const chartData = [...sessions]
    .sort((a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime())
    .map((s, index) => ({
      name: `Session ${index + 1}`,
      date: new Date(s.dateIso).toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
      score: s.report.overallScore,
      vocal: s.report.vocalToneScore,
      body: s.report.bodyLanguageScore,
      star: s.report.contentStarScore,
    }));

  const badges = [
    { title: "Premier Entretien", desc: "A réalisé sa 1ère simulation", unlocked: totalInterviews >= 1, icon: "🎯" },
    { title: "Contact Visuel Maîtrisé", desc: "Score visuel > 85%", unlocked: avgBodyScore >= 85, icon: "👁️" },
    { title: "Tonalité Éloquente", desc: "Score vocal > 85%", unlocked: avgVocalScore >= 85, icon: "🎙️" },
    { title: "Expert STAR", desc: "Score global > 88%", unlocked: avgOverallScore >= 88, icon: "⭐" },
  ];

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100 space-y-8">
      {/* Hero Overview Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Suivi de Progression Temporelle</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Historique & Statistiques d'Entretien
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Visualisez votre évolution au fil des sessions et identifiez votre montée en puissance.
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Lancer un Entretien</span>
        </button>
      </div>

      {/* Aggregate Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Entretiens Réalisés</div>
          <div className="text-3xl font-black text-white mt-1">{totalInterviews}</div>
          <div className="text-[11px] text-indigo-400 mt-1">Sessions enregistrées</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Moyenne Score Global</div>
          <div className="text-3xl font-black text-indigo-400 mt-1">{avgOverallScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
          <div className="text-[11px] text-emerald-400 mt-1">Niveau global</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Moyenne Tonalité Vocale</div>
          <div className="text-3xl font-black text-sky-400 mt-1">{avgVocalScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Assurance orale</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="text-xs text-slate-400 font-semibold uppercase">Moyenne Langage Corporel</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">{avgBodyScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Posture & visuel</div>
        </div>
      </div>

      {/* Progression Graphs */}
      {chartData.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Courbe d'Évolution des Scores au Fil du Temps</span>
              </h3>
              <p className="text-xs text-slate-400">Progression comparée de la Tonalité, du Langage corporel et de la Méthode STAR.</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                />
                <Line type="monotone" dataKey="score" name="Score Global" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="vocal" name="Tonalité Vocale" stroke="#38bdf8" strokeWidth={2} />
                <Line type="monotone" dataKey="body" name="Langage Corporel" stroke="#34d399" strokeWidth={2} />
                <Line type="monotone" dataKey="star" name="Méthode STAR" stroke="#fbbf24" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Badges & Achievements */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <span>Objectifs & Badges Débloqués</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border text-center transition-all ${
                b.unlocked
                  ? "bg-indigo-600/10 border-indigo-500/40 text-white"
                  : "bg-slate-950/40 border-slate-800 text-slate-500 opacity-60"
              }`}
            >
              <div className="text-2xl mb-1">{b.icon}</div>
              <div className="text-xs font-bold">{b.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{b.desc}</div>
              {b.unlocked && (
                <div className="mt-2 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 py-0.5 rounded-full">
                  Débloqué
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sessions History List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Historique des Sessions Réalisées ({filteredSessions.length})</span>
          </h3>

          {sessions.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Réinitialiser l'historique</span>
            </button>
          )}
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-sm">
            Aucun entretien enregistré pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => onSelectSession(sess)}
                className="p-4 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex flex-col items-center justify-center shrink-0">
                    <span className="text-base font-bold">{sess.report.overallScore}</span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400">/ 100</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {sess.role}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {sess.sectorName} • Recruteur: {sess.recruiterInfo.name} ({sess.recruiterInfo.companyName})
                    </p>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                      <span>{new Date(sess.dateIso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                      <span>•</span>
                      <span>{Math.round(sess.durationSeconds / 60)} min</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Consulter le Rapport</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
