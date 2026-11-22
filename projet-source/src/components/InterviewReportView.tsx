import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { SavedInterviewSession } from "../types";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Volume2,
  Eye,
  Activity,
  Download,
  RotateCcw,
  Video,
  FileText,
  Clock,
  Layers,
  ChevronDown,
  UserCheck,
  Copy,
  Check,
  HelpCircle,
  Info
} from "lucide-react";
import { BodyLanguageTooltipModal } from "./BodyLanguageTooltipModal";

interface InterviewReportViewProps {
  session: SavedInterviewSession;
  onRestart: () => void;
  onViewHistory: () => void;
}

export const InterviewReportView: React.FC<InterviewReportViewProps> = ({
  session,
  onRestart,
  onViewHistory,
}) => {
  const { report, recruiterInfo, role, sectorName, durationSeconds, history } = session;
  const [copied, setCopied] = useState<boolean>(false);
  const [isBodyLanguageHelpOpen, setIsBodyLanguageHelpOpen] = useState<boolean>(false);

  const handleCopyTranscript = () => {
    const text = `RAPPORT DE SIMULATION D'ENTRETIEN - ${role} (${sectorName})
Score Global: ${report.overallScore}/100
Analyse Vocale: ${report.vocalToneScore}/100 | Contact Visuel: ${report.bodyLanguageScore}/100 | Méthode STAR: ${report.contentStarScore}/100

HISTORIQUE DES ÉCHANGES:
${history.map((item, idx) => `Q${idx + 1}: ${item.question}\nRéponse: ${item.userAnswer}\nFeedback: ${item.feedback.instantAdvice}\n`).join("\n")}

PLAN D'ACTION:
${report.personalizedActionPlan.map((p, idx) => `${idx + 1}. ${p}`).join("\n")}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Trigger celebration confetti on high score!
  useEffect(() => {
    if (report.overallScore >= 75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [report.overallScore]);

  // Radar chart data for skill distribution
  const radarData = [
    { subject: "Tonalité Vocale", score: report.vocalToneScore, benchmark: 80 },
    { subject: "Contact Visuel", score: report.bodyLanguageScore, benchmark: 80 },
    { subject: "Méthode STAR", score: report.contentStarScore, benchmark: 75 },
    { subject: "Fluidité & Rythme", score: report.fluencyPaceScore, benchmark: 82 },
    { subject: "Précision & Impact", score: report.overallScore, benchmark: 78 },
  ];

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} min ${s} sec`;
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (score >= 70) return "text-indigo-400 border-indigo-500/40 bg-indigo-500/10";
    return "text-amber-400 border-amber-500/40 bg-amber-500/10";
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100 space-y-8">
      {/* Hero Header & Overall Score */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Rapport Diagnostique RH Officiel</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Bilan de l'Entretien - {role}
            </h1>
            <p className="text-sm text-slate-300 mt-2 flex flex-wrap items-center gap-3">
              <span>Secteur: <strong className="text-indigo-300">{sectorName}</strong></span>
              <span>•</span>
              <span>Recruteur: <strong className="text-white">{recruiterInfo.name}</strong> ({recruiterInfo.companyName})</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {formatSeconds(durationSeconds)}</span>
            </p>

            {session.selectedTechStack && session.selectedTechStack.length > 0 && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400 font-medium">Technologies & Outils évalués:</span>
                {session.selectedTechStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-xs font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Big Score Gauge Badge */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-3xl bg-slate-950 border-2 border-indigo-500/40 shadow-2xl shadow-indigo-500/20 flex flex-col items-center justify-center relative group">
              <span className="text-4xl font-black bg-gradient-to-r from-indigo-300 via-sky-200 to-white bg-clip-text text-transparent">
                {report.overallScore}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mt-0.5">
                Score Global / 100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Tonalité Vocale</span>
            <Volume2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{report.vocalToneScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Clarté, débit & intonation</div>
        </div>

        <div
          onClick={() => setIsBodyLanguageHelpOpen(true)}
          className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-xl transition-all cursor-pointer group"
          title="Cliquer pour afficher le guide d'amélioration du langage corporel"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1">
              <span>Langage Corporel</span>
              <Info className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
            </span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{report.bodyLanguageScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
          <div className="text-[11px] text-indigo-300 font-medium mt-1 flex items-center justify-between">
            <span>Contact visuel & posture</span>
            <span className="group-hover:underline text-[10px]">Conseils →</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Méthode STAR</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">{report.contentStarScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Structure Situation/Tâche/Action/Résultat</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Fluidité Orale</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{report.fluencyPaceScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
          <div className="text-[11px] text-slate-400 mt-1">Débit ({report.avgSpeakingSpeedWpm || 135} WPM)</div>
        </div>
      </div>

      {/* Radar Chart Skills Analysis & Executive Summary */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Skill Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Cartographie des Compétences d'Entretien</h3>
            <p className="text-xs text-slate-400">Comparaison de vos prestations par rapport aux attentes du marché.</p>
          </div>

          <div className="h-64 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Candidat" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                <Radar name="Attendu" dataKey="benchmark" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-500" />
              <span>Votre Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-sky-400/50" />
              <span>Attendu Senior</span>
            </div>
          </div>
        </div>

        {/* Executive Summary & Key Highlights */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Synthèse de l'Expert RH</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              "{report.executiveSummary}"
            </p>
          </div>

          {/* Strengths */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Forces Majeures Détectées</span>
            </h4>
            <ul className="space-y-1.5">
              {report.topStrengths.map((str, i) => (
                <li key={i} className="text-xs text-slate-200 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Axes d'Amélioration Prioritaires</span>
            </h4>
            <ul className="space-y-1.5">
              {report.keyAreasForImprovement.map((imp, i) => (
                <li key={i} className="text-xs text-slate-200 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Question-by-Question Deep Analysis & Ideal STAR Answers */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Analyse Détaillée Question par Question</h3>
          <p className="text-xs text-slate-400">Examen de vos réponses avec modèle de réponse parfaite selon la méthode STAR.</p>
        </div>

        <div className="space-y-4">
          {report.questionAnalysis.map((qa) => (
            <div key={qa.questionIndex} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
                    Q{qa.questionIndex}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{qa.questionText}</h4>
                    <p className="text-xs text-slate-400 mt-1 italic">
                      " {qa.userResponse} "
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-xl text-xs font-bold border shrink-0 bg-indigo-500/20 text-indigo-300 border-indigo-500/40">
                  {qa.questionScore} / 100
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-xl">
                  <strong className="text-emerald-400 block mb-1">Point Fort :</strong>
                  <span className="text-slate-300">{qa.strength}</span>
                </div>
                <div className="bg-amber-950/30 border border-amber-500/20 p-3 rounded-xl">
                  <strong className="text-amber-400 block mb-1">Piste d'Amélioration :</strong>
                  <span className="text-slate-300">{qa.improvement}</span>
                </div>
              </div>

              {/* Ideal STAR Response Box */}
              <div className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Exemple de Réponse Idéale (Méthode STAR)</span>
                </div>
                <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-mono">
                  {qa.idealStarResponse}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Action Plan */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <span>Plan d'Action Personnalisé pour votre Prochain Entretien</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {report.personalizedActionPlan.map((action, i) => (
            <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={onViewHistory}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
        >
          Voir mes autres sessions & statistiques
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyTranscript}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? "Synthèse Copiée !" : "Copier le Compte-Rendu"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Imprimer / PDF</span>
          </button>

          <button
            onClick={onRestart}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nouvelle Simulation</span>
          </button>
        </div>
      </div>

      {/* Body Language Interactive Coaching Tooltip Modal */}
      <BodyLanguageTooltipModal
        isOpen={isBodyLanguageHelpOpen}
        onClose={() => setIsBodyLanguageHelpOpen(false)}
      />
    </div>
  );
};
