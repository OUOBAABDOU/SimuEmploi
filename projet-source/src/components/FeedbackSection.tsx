import React, { useState, useEffect } from "react";
import { AppFeedback, FeedbackType } from "../types";
import {
  MessageSquarePlus,
  Star,
  CheckCircle2,
  Send,
  Lightbulb,
  Bug,
  Sparkles,
  Heart,
  ListFilter,
  Trash2,
  ThumbsUp,
  MessageCircle,
  HelpCircle,
  Clock,
  ThumbsUpIcon
} from "lucide-react";

const INITIAL_FEEDBACKS: AppFeedback[] = [
  {
    id: "fb-1",
    type: "feature",
    title: "Téléchargement du rapport au format PDF",
    description: "Ce serait super de pouvoir télécharger le bilan final directement sous forme de PDF stylisé pour le conserver ou le partager avec un mentor.",
    rating: 5,
    category: "Rapports & Export",
    createdAt: "2026-07-28T14:30:00.000Z",
    status: "Pris en compte",
    upvotes: 14,
  },
  {
    id: "fb-2",
    type: "suggestion",
    title: "Option de réglage du débit de parole du recruteur IA",
    description: "Possibilité d'accélérer ou ralentir la voix de l'IA lors de la diction des questions.",
    rating: 4,
    category: "Voix & Synthèse",
    createdAt: "2026-07-30T09:15:00.000Z",
    status: "En cours d'étude",
    upvotes: 8,
  },
  {
    id: "fb-3",
    type: "recommendation",
    title: "Intégrer plus de cas pratiques en Marketing Digital",
    description: "Ajouter des exercices axés sur l'analyse de métriques d'acquisition (CAC, LTV, ROAS) en direct.",
    rating: 5,
    category: "Contenu & Secteurs",
    createdAt: "2026-07-31T10:00:00.000Z",
    status: "Reçu",
    upvotes: 5,
  }
];

const PRESET_SUGGESTIONS = [
  "Téléchargement PDF du compte-rendu",
  "Synthèse vocale plus rapide/lente",
  "Nouveaux secteurs d'activité",
  "Mode enregistrement vidéo réécoutable",
  "Timer ajustable par question",
  "Simulations d'entretiens en Anglais"
];

export const FeedbackSection: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<AppFeedback[]>(() => {
    try {
      const stored = localStorage.getItem("simuemploi_feedbacks");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Erreur chargement feedbacks:", e);
    }
    return INITIAL_FEEDBACKS;
  });

  const [type, setType] = useState<FeedbackType>("suggestion");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Amélioration Générale");
  const [rating, setRating] = useState<number>(5);
  const [userEmail, setUserEmail] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    try {
      localStorage.setItem("simuemploi_feedbacks", JSON.stringify(feedbacks));
    } catch (e) {
      console.error("Erreur sauvegarde feedbacks:", e);
    }
  }, [feedbacks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newFeedback: AppFeedback = {
      id: "fb-" + Date.now(),
      type,
      title: title.trim(),
      description: description.trim(),
      rating,
      category,
      userEmail: userEmail.trim() || undefined,
      createdAt: new Date().toISOString(),
      status: "Reçu",
      upvotes: 1
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);

    // Send to backend endpoint asynchronously
    try {
      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback)
      }).catch((e) => console.log("Server feedback sync:", e));
    } catch (e) {
      console.log("Server feedback sync error:", e);
    }

    setTitle("");
    setDescription("");
    setUserEmail("");
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const handleUpvote = (id: string) => {
    setFeedbacks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, upvotes: (item.upvotes || 0) + 1 } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setFeedbacks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPreset = (presetText: string) => {
    setTitle(presetText);
    if (!description) {
      setDescription(`J'aimerais suggérer l'ajout de : "${presetText}" afin de perfectionner l'expérience utilisateur.`);
    }
  };

  const filteredFeedbacks = feedbacks.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <MessageSquarePlus className="w-4 h-4 text-indigo-400" />
          <span>Boîte à Suggestions & Recommandations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Partagez vos remarques & idées d'amélioration
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Votre avis est essentiel pour faire évoluer SimuEmploi AI. Soumettez vos suggestions, recommandations ou remarques afin d'enrichir la plateforme.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Poster une suggestion</span>
            </h2>
            <span className="text-xs text-slate-500">Enregistrement local</span>
          </div>

          {submittedSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">Merci pour votre contribution !</p>
                <p className="text-emerald-300/80">Votre suggestion a bien été enregistrée et ajoutée à la liste ci-contre.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Feedback Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Type de retour :
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("suggestion")}
                  className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                    type === "suggestion"
                      ? "bg-indigo-600/30 text-indigo-200 border-indigo-500"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <Lightbulb className="w-4 h-4 text-indigo-400" />
                  <span>Suggestion</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType("recommendation")}
                  className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                    type === "recommendation"
                      ? "bg-emerald-600/30 text-emerald-200 border-emerald-500"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <Heart className="w-4 h-4 text-emerald-400" />
                  <span>Recommandation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType("feature")}
                  className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                    type === "feature"
                      ? "bg-blue-600/30 text-blue-200 border-blue-500"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Fonctionnalité</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType("bug")}
                  className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                    type === "bug"
                      ? "bg-rose-600/30 text-rose-200 border-rose-500"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <Bug className="w-4 h-4 text-rose-400" />
                  <span>Remarque / Bug</span>
                </button>
              </div>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Raccourcis d'idées fréquentes :
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SUGGESTIONS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-indigo-300 transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Objet / Intitulé <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Ajouter des vidéos explicatives pour la méthode STAR..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Catégorie concernée :
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Amélioration Générale">Amélioration Générale</option>
                <option value="Simulateur & Audio/Vidéo">Simulateur & Audio/Vidéo</option>
                <option value="Contenu & Secteurs">Contenu & Secteurs</option>
                <option value="Rapports & Export">Rapports & Export</option>
                <option value="Ergonomie & Design">Ergonomie & Design</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Note globale actuelle sur l'application :
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-700"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-400 ml-2">
                  {rating} / 5
                </span>
              </div>
            </div>

            {/* Description Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Détails & Recommandations <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Expliquez en détail ce que vous souhaitez voir amélioré, ajouté ou modifié dans l'application..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            {/* Email Optional */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Votre Email <span className="text-slate-500 font-normal">(Optionnel)</span>
              </label>
              <input
                type="email"
                placeholder="votre.email@exemple.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!title.trim() || !description.trim()}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                !title.trim() || !description.trim()
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-indigo-500/20 active:scale-95"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Enregistrer ma suggestion</span>
            </button>
          </form>
        </div>

        {/* Right Column: List of saved suggestions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">
                Suggestions enregistrées ({feedbacks.length})
              </h3>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterType === "all"
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setFilterType("suggestion")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterType === "suggestion"
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Suggestions
              </button>
              <button
                onClick={() => setFilterType("recommendation")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterType === "recommendation"
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Recommandations
              </button>
              <button
                onClick={() => setFilterType("feature")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterType === "feature"
                    ? "bg-indigo-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Idées
              </button>
            </div>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400">
              <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="font-semibold text-slate-300 mb-1">Aucune remarque enregistrée dans cette catégorie</p>
              <p className="text-xs text-slate-500">Utilisez le formulaire à gauche pour exprimer vos suggestions et recommandations.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFeedbacks.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {/* Type badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                            item.type === "suggestion"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : item.type === "recommendation"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : item.type === "feature"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {item.type === "suggestion" && <Lightbulb className="w-3 h-3" />}
                          {item.type === "recommendation" && <Heart className="w-3 h-3" />}
                          {item.type === "feature" && <Sparkles className="w-3 h-3" />}
                          {item.type === "bug" && <Bug className="w-3 h-3" />}
                          <span>{item.type}</span>
                        </span>

                        {/* Category */}
                        {item.category && (
                          <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
                            {item.category}
                          </span>
                        )}

                        {/* Status */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.status === "Pris en compte"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : item.status === "En cours d'étude"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          • {item.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-base leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition-all rounded-lg hover:bg-slate-800"
                      title="Supprimer cette remarque"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      {item.rating && (
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{item.rating}/5</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        <span>{new Date(item.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>

                    {/* Upvote button */}
                    <button
                      onClick={() => handleUpvote(item.id)}
                      className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Soutenir ({item.upvotes || 0})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
