import React, { useState } from "react";
import { PREBUILT_SCENARIOS, SECTORS, SIMULATION_CATEGORIES } from "../data/sectorsAndScenarios";
import { PrebuiltScenario, SimulationCategory } from "../types";
import {
  Layers,
  Play,
  Clock,
  Briefcase,
  GraduationCap,
  Rocket,
  Trophy,
  BookOpenCheck,
  Dumbbell
} from "lucide-react";

interface ScenarioLibraryProps {
  onSelectScenario: (scenario: PrebuiltScenario) => void;
}

export const ScenarioLibrary: React.FC<ScenarioLibraryProps> = ({
  onSelectScenario,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>("all");

  const filteredScenarios = PREBUILT_SCENARIOS.filter((sc) => {
    const matchCategory = selectedCategoryFilter === "all" || sc.category === selectedCategoryFilter;
    const matchSector = selectedSectorFilter === "all" || sc.sectorId === selectedSectorFilter;
    return matchCategory && matchSector;
  });

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Facile": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Intermédiaire": return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
      case "Avancé": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Expert": return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default: return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getCategoryIcon = (catId?: SimulationCategory) => {
    switch (catId) {
      case "examen_concours": return <GraduationCap className="w-3.5 h-3.5 text-purple-400" />;
      case "pitch_keynote": return <Rocket className="w-3.5 h-3.5 text-emerald-400" />;
      case "competition_hackathon": return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
      case "soutenance_devoir": return <BookOpenCheck className="w-3.5 h-3.5 text-rose-400" />;
      case "activite_pratique": return <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <Briefcase className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Bibliothèque Multi-Épreuves</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Mises en Situation, Examens, Concours & Pitchs
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Entraînez-vous sur des scénarios réels de haute intensité : oraux de concours administratifs, soutenance de mémoire, pitch de levée de fonds, hackathons et entretiens RH.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Filtrer par Type d'Épreuve</div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategoryFilter === "all"
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              Toutes les épreuves ({PREBUILT_SCENARIOS.length})
            </button>
            {SIMULATION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  selectedCategoryFilter === cat.id
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sector Filter Tabs */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Filtrer par Secteur</div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedSectorFilter("all")}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                selectedSectorFilter === "all"
                  ? "bg-slate-800 border-indigo-500 text-white"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              Tous secteurs
            </button>

            {SECTORS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectorFilter(sec.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  selectedSectorFilter === sec.id
                    ? "bg-slate-800 border-indigo-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredScenarios.map((sc) => {
          const secObj = SECTORS.find((s) => s.id === sc.sectorId);
          const catObj = SIMULATION_CATEGORIES.find((c) => c.id === sc.category);
          return (
            <div
              key={sc.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 shadow-xl transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 flex items-center gap-1.5">
                      {getCategoryIcon(sc.category)}
                      <span>{catObj?.badge || sc.category}</span>
                    </span>

                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {secObj?.name || sc.sectorId}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${getDifficultyBadge(sc.difficulty)}`}>
                    {sc.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {sc.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {sc.description}
                </p>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-1">
                  <strong className="text-indigo-300 block">Contexte & Enjeux :</strong>
                  <p>{sc.context}</p>
                </div>
              </div>

              {/* Tags & Action Button */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>~{sc.estimatedDuration} min</span>
                </div>

                <button
                  onClick={() => onSelectScenario(sc)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Lancer l'Épreuve</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

