import React, { useState } from "react";
import { SECTORS, SIMULATION_CATEGORIES } from "../data/sectorsAndScenarios";
import { SectorId, ExperienceLevel, InterviewStyle, InterviewMode, SimulationCategory } from "../types";
import {
  Code,
  TrendingUp,
  HeartPulse,
  Megaphone,
  Cpu,
  Users,
  Scale,
  UtensilsCrossed,
  Sparkles,
  Camera,
  Mic,
  Volume2,
  ShieldCheck,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Rocket,
  Trophy,
  BookOpenCheck,
  Dumbbell,
  SlidersHorizontal,
  Terminal,
  Wrench,
  Plus,
  X,
  Layers,
  Code2,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Search,
  Check
} from "lucide-react";

interface SetupScreenProps {
  onStartInterview: (config: {
    category: SimulationCategory;
    sector: SectorId;
    role: string;
    experienceLevel: ExperienceLevel;
    interviewStyle: InterviewStyle;
    mode: InterviewMode;
    totalQuestions: number;
    enableSpeechSynthesis: boolean;
    customScenarioText: string;
    selectedTechStack: string[];
  }) => void;
  preselectedScenario?: any;
}

const PRESET_PROGRAMMING_LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Java", "C++", "C# / .NET",
  "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL", "Shell / Bash"
];

const PRESET_FRAMEWORKS = [
  "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express", "NestJS",
  "Django", "FastAPI", "Spring Boot", "Laravel", "Flutter", "PyTorch", "TensorFlow", "Tailwind CSS"
];

const PRESET_TOOLS_DEVOPS = [
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Git / GitHub",
  "CI/CD", "PostgreSQL", "MongoDB", "Redis", "Kafka", "Terraform", "Figma", "Jira"
];

const PRESET_BUSINESS_TOOLS = [
  "Excel Avancé", "Financial Modeling", "Power BI", "Tableau", "SAP",
  "Salesforce", "Google Analytics", "SEO / SEA", "Agile / Scrum", "RGPD / Compliance"
];

export const SetupScreen: React.FC<SetupScreenProps> = ({
  onStartInterview,
  preselectedScenario,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SimulationCategory>(
    preselectedScenario?.category || "entretien_embauche"
  );
  const [selectedSector, setSelectedSector] = useState<SectorId>(
    preselectedScenario?.sectorId || "tech"
  );
  const [role, setRole] = useState<string>(
    preselectedScenario?.role || "Développeur Fullstack React/Node"
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    preselectedScenario?.level || "confirme"
  );
  const [interviewStyle, setInterviewStyle] = useState<InterviewStyle>("professionnel");
  const [mode, setMode] = useState<InterviewMode>(
    preselectedScenario?.mode || "classique"
  );
  const [totalQuestions, setTotalQuestions] = useState<number>(4);
  const [enableSpeechSynthesis, setEnableSpeechSynthesis] = useState<boolean>(true);
  const [customScenarioText, setCustomScenarioText] = useState<string>(
    preselectedScenario?.context || ""
  );

  const [selectedTechStack, setSelectedTechStack] = useState<string[]>(
    preselectedScenario?.tags || ["TypeScript", "React", "Node.js", "Docker"]
  );
  const [customTechInput, setCustomTechInput] = useState<string>("");

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    langages: true,
    frameworks: true,
    devops: false,
    business: false,
  });
  const [techSearch, setTechSearch] = useState<string>("");

  const toggleCategoryOpen = (catKey: string) => {
    setOpenCategories((prev) => ({ ...prev, [catKey]: !prev[catKey] }));
  };

  const toggleAllInCategory = (items: string[], enableAll: boolean) => {
    if (enableAll) {
      const merged = Array.from(new Set([...selectedTechStack, ...items]));
      setSelectedTechStack(merged);
    } else {
      setSelectedTechStack(selectedTechStack.filter((item) => !items.includes(item)));
    }
  };

  const toggleTech = (techName: string) => {
    if (selectedTechStack.includes(techName)) {
      setSelectedTechStack(selectedTechStack.filter((t) => t !== techName));
    } else {
      setSelectedTechStack([...selectedTechStack, techName]);
    }
  };

  const handleAddCustomTech = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customTechInput.trim();
    if (trimmed && !selectedTechStack.includes(trimmed)) {
      setSelectedTechStack([...selectedTechStack, trimmed]);
      setCustomTechInput("");
    }
  };

  const categoryObj = SIMULATION_CATEGORIES.find((c) => c.id === selectedCategory) || SIMULATION_CATEGORIES[0];
  const sectorObj = SECTORS.find((s) => s.id === selectedSector) || SECTORS[0];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap": return <GraduationCap className="w-5 h-5 text-purple-400" />;
      case "Rocket": return <Rocket className="w-5 h-5 text-emerald-400" />;
      case "Trophy": return <Trophy className="w-5 h-5 text-amber-400" />;
      case "BookOpenCheck": return <BookOpenCheck className="w-5 h-5 text-rose-400" />;
      case "Dumbbell": return <Dumbbell className="w-5 h-5 text-cyan-400" />;
      default: return <Briefcase className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return <Code className="w-5 h-5" />;
      case "TrendingUp": return <TrendingUp className="w-5 h-5" />;
      case "HeartPulse": return <HeartPulse className="w-5 h-5" />;
      case "Megaphone": return <Megaphone className="w-5 h-5" />;
      case "Cpu": return <Cpu className="w-5 h-5" />;
      case "Users": return <Users className="w-5 h-5" />;
      case "Scale": return <Scale className="w-5 h-5" />;
      case "UtensilsCrossed": return <UtensilsCrossed className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;
    onStartInterview({
      category: selectedCategory,
      sector: selectedSector,
      role,
      experienceLevel,
      interviewStyle,
      mode,
      totalQuestions,
      enableSpeechSynthesis,
      customScenarioText,
      selectedTechStack,
    });
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl mb-8">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulateur IA de Nouvelle Génération</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Préparez vos <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">Entretiens, Examens, Pitchs & Soutenances</span> avec l'IA
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Profitez d'un feedback en temps réel sur votre <strong className="text-indigo-200">tonalité vocale</strong>, votre <strong className="text-cyan-200">langage corporel</strong> (contact visuel, posture) et la clarté de vos arguments.
          </p>
        </div>
      </div>

      <form onSubmit={handleStart} className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (xl:col-span-7): Steps 1, 2, 4, 5 & Checklist */}
        <div className="xl:col-span-7 space-y-6">
          {/* Step 1: Category Selection */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                1
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Choisissez votre Type de Simulation</h2>
                <p className="text-xs text-slate-400">Sélectionnez la catégorie de l'épreuve orale que vous souhaitez entraîner.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SIMULATION_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      if (cat.id === "examen_concours") setRole("Grand Oral du Concours Administratif");
                      else if (cat.id === "pitch_keynote") setRole("Pitch Levée de Fonds Seed Startup");
                      else if (cat.id === "competition_hackathon") setRole("Présentation Finale Hackathon AI");
                      else if (cat.id === "soutenance_devoir") setRole("Soutenance de Mémoire de Fin d'Études");
                      else if (cat.id === "activite_pratique") setRole("Média Training Conférence de Presse");
                      else setRole("Développeur Fullstack React/Node");
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="p-2 rounded-lg bg-slate-800">
                        {getCategoryIcon(cat.icon)}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                        {cat.badge}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5">{cat.name}</div>
                      <div className="text-[10px] text-slate-400 leading-tight line-clamp-2">{cat.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Industry / Sector Selection */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                  2
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Sélectionnez le Secteur ou Domaine
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SECTORS.map((sec) => {
                const isSelected = selectedSector === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setSelectedSector(sec.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}>
                        {getSectorIcon(sec.icon)}
                      </div>
                      {isSelected && <ShieldCheck className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{sec.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Role Choice */}
            <div className="mt-6 pt-6 border-t border-slate-800/80 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  {categoryObj.roleLabel}
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Grand Oral de Concours, Pitch Startup, Soutenance Mémoire..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Exemples recommandés ({sectorObj.name})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {sectorObj.popularRoles.slice(0, 4).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        role === r
                          ? "bg-indigo-500/30 text-indigo-200 border-indigo-400 font-bold"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        {/* Step 3: Programming Languages, Frameworks & Domain Tools Selection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                3
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  <span>Langages de Programmation, Outils & Compétences Clés</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Sélectionnez les langages, frameworks et outils sur lesquels l'évaluateur IA doit vous poser des questions techniques ciblées.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              {selectedTechStack.length} élément{selectedTechStack.length > 1 ? "s" : ""} sélectionné{selectedTechStack.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Active Selected Stack Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Votre Stack / Outils Sélectionnés ({selectedTechStack.length}) :
              </label>
              {selectedTechStack.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTechStack([])}
                  className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors font-medium"
                >
                  Tout effacer
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[50px] items-center">
              {selectedTechStack.length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Aucun outil sélectionné. Cochez les cases dans les menus déroulants ci-dessous ou ajoutez un outil sur-mesure.
                </span>
              ) : (
                selectedTechStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500 text-indigo-200 text-xs font-bold shadow-sm"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className="hover:text-rose-400 transition-colors p-0.5"
                      title="Retirer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Search Filter and Custom Add Controls */}
          <div className="grid md:grid-cols-2 gap-3">
            {/* Real-time search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                placeholder="Filtrer ou rechercher un langage, outil, framework..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {techSearch && (
                <button
                  type="button"
                  onClick={() => setTechSearch("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Custom Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTechInput}
                onChange={(e) => setCustomTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomTech();
                  }
                }}
                placeholder="Ajouter un outil sur-mesure (ex: Snowflake, Svelte...)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddCustomTech()}
                disabled={!customTechInput.trim()}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                  customTechInput.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Collapsible Dropdown Accordion Menus with Checklists */}
          <div className="space-y-3 pt-1">
            {[
              {
                key: "langages",
                title: "Langages de Programmation",
                icon: Terminal,
                iconColor: "text-emerald-400",
                badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                items: PRESET_PROGRAMMING_LANGUAGES,
              },
              {
                key: "frameworks",
                title: "Frameworks & Bibliothèques",
                icon: Layers,
                iconColor: "text-indigo-400",
                badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
                items: PRESET_FRAMEWORKS,
              },
              {
                key: "devops",
                title: "Outils Cloud, DevOps & Bases de Données",
                icon: Wrench,
                iconColor: "text-cyan-400",
                badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                items: PRESET_TOOLS_DEVOPS,
              },
              {
                key: "business",
                title: "Outils Métier, Finance, Marketing & Méthodes",
                icon: SlidersHorizontal,
                iconColor: "text-amber-400",
                badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                items: PRESET_BUSINESS_TOOLS,
              },
            ].map((cat) => {
              const IconComp = cat.icon;
              const filteredItems = cat.items.filter((item) =>
                item.toLowerCase().includes(techSearch.trim().toLowerCase())
              );
              const selectedInCat = cat.items.filter((item) => selectedTechStack.includes(item));
              const allSelected = cat.items.every((item) => selectedTechStack.includes(item));
              const isOpen = openCategories[cat.key] || techSearch.trim().length > 0;

              // Hide empty category if searching and no matches
              if (techSearch.trim() && filteredItems.length === 0) {
                return null;
              }

              return (
                <div
                  key={cat.key}
                  className="border border-slate-800 bg-slate-950/70 rounded-xl overflow-hidden transition-all shadow-sm"
                >
                  {/* Dropdown Header */}
                  <div
                    onClick={() => toggleCategoryOpen(cat.key)}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-900/90 hover:bg-slate-800/80 transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 ${cat.iconColor}`} />
                      <span className="text-xs font-bold text-slate-200">{cat.title}</span>
                      {selectedInCat.length > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                          {selectedInCat.length} sélectionné{selectedInCat.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {isOpen && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAllInCategory(cat.items, !allSelected);
                          }}
                          className="text-[10px] font-semibold text-slate-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                        >
                          {allSelected ? "Tout décocher" : "Tout cocher"}
                        </button>
                      )}
                      <div className="text-slate-400">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Checklist Items Menu */}
                  {isOpen && (
                    <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/90 animate-fadeIn">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {filteredItems.map((tech) => {
                          const isChecked = selectedTechStack.includes(tech);
                          return (
                            <label
                              key={tech}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleTech(tech);
                              }}
                              className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs font-medium cursor-pointer select-none transition-all ${
                                isChecked
                                  ? "bg-indigo-600/20 border-indigo-500/80 text-white font-semibold shadow-sm"
                                  : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60 hover:text-white"
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-indigo-400" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-600" />
                                )}
                              </div>
                              <span className="truncate">{tech}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Experience & Interview Persona */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Level & Mode */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                3
              </div>
              <h2 className="text-lg font-bold text-white">Niveau & Format d'Épreuve</h2>
            </div>

            {/* Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Niveau d'exigence / Expérience
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "debutant", label: "Débutant / Étudiant", sub: "Prise en main" },
                  { id: "confirme", label: "Confirmé / Intermédiaire", sub: "Standard exigé" },
                  { id: "senior", label: "Senior / Avancé", sub: "Niveau élevé" },
                  { id: "executive", label: "Executive / Expert", sub: "Exigence maximale" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setExperienceLevel(item.id as ExperienceLevel)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      experienceLevel === item.id
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Format de l'exercice
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "classique", label: "Oral & Présentation", desc: "Questions & Réponses classiques" },
                  { id: "mise_en_situation", label: "Mise en Situation", desc: "Gestion de crise & imprévus" },
                  { id: "cas_pratique", label: "Cas Pratique / Démo", desc: "Démonstration & raisonnement" },
                  { id: "negociation_salaire", label: "Session Négociation", desc: "Objections & Contre-arguments" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id as InterviewMode)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      mode === item.id
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style & AI Recruiter Settings */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                4
              </div>
              <h2 className="text-lg font-bold text-white">Style de l'Évaluateur / Jury</h2>
            </div>

            {/* Interview Style */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Attitude du Jury Virtuel
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: "bienveillant",
                    title: "Bienveillant & Pédagogue",
                    desc: "Ideal pour s'entraîner en toute confiance.",
                    badge: "Conseillé"
                  },
                  {
                    id: "professionnel",
                    title: "Professionnel & Rigoureux",
                    desc: "Format officiel de concours et d'entretien."
                  },
                  {
                    id: "stress_test",
                    title: "Jury Challengeant / Question Piège",
                    desc: "Contradictions incisives pour tester la résistance."
                  },
                  {
                    id: "technique",
                    title: "Expert Fondamental & Pointilleux",
                    desc: "Focus minutieux sur les détails techniques."
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setInterviewStyle(item.id as InterviewStyle)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      interviewStyle === item.id
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    {interviewStyle === item.id && (
                      <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions count */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Nombre d'échanges / questions ({totalQuestions} questions ~ {totalQuestions * 3} min)
              </label>
              <div className="flex items-center gap-3">
                {[3, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTotalQuestions(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      totalQuestions === num
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {num} questions
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Optional Custom Scenario Context */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Contexte ou Énoncé Particulier (Optionnel)</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Vous pouvez coller un sujet de concours, un sujet de mémoire, ou un synopsis d'examen pour que l'IA adapte l'épreuve sur-mesure.
          </p>
          <textarea
            value={customScenarioText}
            onChange={(e) => setCustomScenarioText(e.target.value)}
            rows={3}
            placeholder="Ex: Sujet du Grand Oral : La régulation de l'intelligence artificielle dans l'Union Européenne. Les questions doivent porter sur le RGPD, l'AI Act et l'impact économique..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Warm-up & Prep Checklist before launching */}
        <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Fiche de Préparation Rapide Avant-Entretien (Warm-up)</h3>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
              Checklist Recommandée
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                1
              </div>
              <div>
                <strong className="text-white block">Posture & Regard :</strong>
                <span className="text-slate-400">Positionnez votre caméra à hauteur des yeux et maintenez un éclairage de face.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                2
              </div>
              <div>
                <strong className="text-white block">Pitch de 2 Minutes :</strong>
                <span className="text-slate-400">Préparez une présentation fluide : Parcours + Motivations + Pourquoi ce rôle.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                3
              </div>
              <div>
                <strong className="text-white block">Méthode STAR en Tête :</strong>
                <span className="text-slate-400">Donnez toujours un exemple concret (Situation, Tâche, Action, Résultat).</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                4
              </div>
              <div>
                <strong className="text-white block">Gestique & Respiration :</strong>
                <span className="text-slate-400">Marquez de légères pauses plutôt que d'utiliser des tics de langage ("euh", "en fait").</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (xl:col-span-5): Step 3 (Tech Stack) & Sticky Summary Launch Panel */}
      <div className="xl:col-span-5 space-y-6 xl:sticky xl:top-24">
        {/* Step 3: Programming Languages, Frameworks & Domain Tools Selection */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                5
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  <span>Stack & Outils Évalués</span>
                </h2>
              </div>
            </div>

            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              {selectedTechStack.length} outil{selectedTechStack.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Active Selected Stack Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Outils Sélectionnés ({selectedTechStack.length}) :
              </label>
              {selectedTechStack.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTechStack([])}
                  className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors font-medium"
                >
                  Effacer
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl min-h-[48px] items-center">
              {selectedTechStack.length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Aucun outil sélectionné. Cochez ci-dessous.
                </span>
              ) : (
                selectedTechStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500 text-indigo-200 text-xs font-bold shadow-sm"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className="hover:text-rose-400 transition-colors p-0.5"
                      title="Retirer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Add Custom Tech Input */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Ajouter un Outil ou Sujet Personnalisé :
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTechInput}
                onChange={(e) => setCustomTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomTech();
                  }
                }}
                placeholder="Ex: GraphQL, Rust, Droit..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddCustomTech()}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Search Filter Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={techSearch}
              onChange={(e) => setTechSearch(e.target.value)}
              placeholder="Rechercher un outil (React, Python, Docker...)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Categories Accordions */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {[
              {
                key: "langages",
                title: "Langages & Scripts",
                items: PRESET_PROGRAMMING_LANGUAGES,
                icon: Code,
                iconColor: "text-indigo-400",
                badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
              },
              {
                key: "frameworks",
                title: "Frameworks & Librairies",
                items: PRESET_FRAMEWORKS,
                icon: Terminal,
                iconColor: "text-sky-400",
                badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
              },
              {
                key: "devops",
                title: "Cloud, DevOps & Bases de Données",
                items: PRESET_TOOLS_DEVOPS,
                icon: Wrench,
                iconColor: "text-cyan-400",
                badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
              },
              {
                key: "business",
                title: "Finance, Data, Legal & Management",
                items: PRESET_BUSINESS_TOOLS,
                icon: SlidersHorizontal,
                iconColor: "text-purple-400",
                badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
              },
            ].map((cat) => {
              const IconComp = cat.icon;
              const filteredItems = cat.items.filter((item) =>
                item.toLowerCase().includes(techSearch.trim().toLowerCase())
              );
              const selectedInCat = cat.items.filter((item) => selectedTechStack.includes(item));
              const allSelected = cat.items.every((item) => selectedTechStack.includes(item));
              const isOpen = openCategories[cat.key] || techSearch.trim().length > 0;

              if (techSearch.trim() && filteredItems.length === 0) {
                return null;
              }

              return (
                <div
                  key={cat.key}
                  className="border border-slate-800 bg-slate-950/70 rounded-xl overflow-hidden transition-all shadow-sm"
                >
                  <div
                    onClick={() => toggleCategoryOpen(cat.key)}
                    className="w-full flex items-center justify-between p-3 bg-slate-900/90 hover:bg-slate-800/80 transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className={`w-4 h-4 ${cat.iconColor}`} />
                      <span className="text-xs font-bold text-slate-200">{cat.title}</span>
                      {selectedInCat.length > 0 && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                          {selectedInCat.length}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isOpen && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAllInCategory(cat.items, !allSelected);
                          }}
                          className="text-[10px] font-semibold text-slate-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                        >
                          {allSelected ? "Tout décocher" : "Tout cocher"}
                        </button>
                      )}
                      <div className="text-slate-400">
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-1.5">
                        {filteredItems.map((tech) => {
                          const isChecked = selectedTechStack.includes(tech);
                          return (
                            <label
                              key={tech}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleTech(tech);
                              }}
                              className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs font-medium cursor-pointer select-none transition-all ${
                                isChecked
                                  ? "bg-indigo-600/20 border-indigo-500/80 text-white font-semibold shadow-sm"
                                  : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {isChecked ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-600" />
                                )}
                              </div>
                              <span className="truncate text-[11px]">{tech}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Quick Launch Summary Panel */}
        <div className="bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Récapitulatif de votre Épreuve</h3>
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
              Prêt à démarrer
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Type :</span>
              <span className="font-bold text-white">{categoryObj.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Secteur :</span>
              <span className="font-bold text-indigo-300">{sectorObj.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Poste / Épreuve :</span>
              <span className="font-bold text-cyan-300 truncate max-w-[180px]">{role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nombre de questions :</span>
              <span className="font-bold text-emerald-400">{totalQuestions} questions</span>
            </div>
          </div>

          {/* Hardware & Preferences checklist */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px]">Caméra (Visuel)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">Microphone (Vocal)</span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 pt-1">
              <input
                type="checkbox"
                checked={enableSpeechSynthesis}
                onChange={(e) => setEnableSpeechSynthesis(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
              />
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px]">Voix audio évaluateur active</span>
            </label>
          </div>

          {/* Submit Launch Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-700 hover:from-indigo-600 hover:to-blue-800 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Lancer la Simulation ({categoryObj.name})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      </form>
    </div>
  );
};

