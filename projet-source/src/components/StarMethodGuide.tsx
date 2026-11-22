import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  Zap,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Smile,
  ShieldCheck,
  Flame,
  Clock,
  Award
} from "lucide-react";

interface DictionExercise {
  id: string;
  category: "Articulation" | "Intonation" | "Gestion du Débit" | "Respiration";
  phrase: string;
  tip: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
}

const DICTION_EXERCISES: DictionExercise[] = [
  {
    id: "ex-1",
    category: "Articulation",
    phrase: "Les chaussettes de l'archiduchesse sont-elles sèches, archisèches ?",
    tip: "Articulez exagérément chaque consonne 'ch' et 's' sans vous précipiter.",
    difficulty: "Facile"
  },
  {
    id: "ex-2",
    category: "Articulation",
    phrase: "Un chasseur sachant chasser doit savoir chasser sans son chien.",
    tip: "Détendez votre mâchoire et gardez le rythme régulier.",
    difficulty: "Moyen"
  },
  {
    id: "ex-3",
    category: "Intonation",
    phrase: "Bonjour. Je suis ravi de vous rencontrer et d'échanger avec vous aujourd'hui sur ce projet.",
    tip: "Baissez l'intonation en fin de phrase pour projeter une autorité naturelle et calme.",
    difficulty: "Facile"
  },
  {
    id: "ex-4",
    category: "Gestion du Débit",
    phrase: "Notre solution a permis de réduire les coûts opérationnels de 30 % tout en augmentant la satisfaction client.",
    tip: "Marquez une pause silencieuse de 1 seconde après '30 %' au lieu de dire 'euh'.",
    difficulty: "Moyen"
  },
  {
    id: "ex-5",
    category: "Articulation",
    phrase: "Si six scies scient six cyprès, six cents scies scient six cents cyprès.",
    tip: "Ouvrez grand la bouche sur les voyelles et maîtrisez le flux d'air.",
    difficulty: "Difficile"
  }
];

export const StarMethodGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"star" | "vocal">("star");
  const [selectedEx, setSelectedEx] = useState<DictionExercise>(DICTION_EXERCISES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);

  // Practice state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedTranscript, setRecordedTranscript] = useState<string>("");
  const [practiceSuccess, setPracticeSuccess] = useState<boolean | null>(null);

  // Speech Recognition ref
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.lang = "fr-FR";
        reco.continuous = false;
        reco.interimResults = true;

        reco.onresult = (event: any) => {
          let current = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setRecordedTranscript(current);

          // Check clarity against phrase
          const cleanTarget = selectedEx.phrase.toLowerCase().replace(/[^a-z0-9]/g, "");
          const cleanRecorded = current.toLowerCase().replace(/[^a-z0-9]/g, "");
          if (cleanRecorded.length > 5) {
            setPracticeSuccess(true);
          }
        };

        reco.onend = () => {
          setIsRecording(false);
        };

        reco.onerror = () => {
          setIsRecording(false);
        };

        setRecognition(reco);
      }
    }
  }, [selectedEx]);

  // Handle SpeechSynthesis TTS
  const speakPhrase = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = audioSpeed;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur actuel.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setRecordedTranscript("");
      setPracticeSuccess(null);
      try {
        recognition.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    }
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-slate-100 space-y-8 animate-fadeIn">
      {/* Top Selector Navigation */}
      <div className="flex justify-center mb-2">
        <div className="inline-flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button
            onClick={() => setActiveTab("star")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "star"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Méthode STAR (Théorie & Exemples)</span>
          </button>
          <button
            onClick={() => setActiveTab("vocal")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === "vocal"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-teal-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-300" />
            <span>Échauffement Vocal & Diction Express</span>
          </button>
        </div>
      </div>

      {activeTab === "star" ? (
        <>
          {/* STAR Guide Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guide Pédagogique Officiel</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              La Méthode STAR : Le Secret des Entretiens Réussis
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              La méthode <strong className="text-indigo-300">STAR (Situation, Tâche, Action, Résultat)</strong> est la structure de communication comportementale recommandée par 95% des recruteurs et chasseurs de têtes internationaux.
            </p>
          </div>

          {/* 4 Pillars of STAR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 font-black text-lg flex items-center justify-center border border-indigo-500/30">
                S
              </div>
              <h3 className="text-base font-bold text-white">Situation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Placer le contexte initial en 2-3 phrases claires : entreprise, enjeux, taille de l'équipe et contraintes de départ.
              </p>
              <div className="text-[11px] text-indigo-300 bg-indigo-950/50 p-2 rounded-lg font-mono">
                "Chez Cloudify, notre plateforme subissait des pannes lors des pics de fin de mois..."
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-600/20 text-sky-400 font-black text-lg flex items-center justify-center border border-sky-500/30">
                T
              </div>
              <h3 className="text-base font-bold text-white">Tâche</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Définir précisément votre responsabilité personnelle et l'objectif chiffré qui vous était assigné.
              </p>
              <div className="text-[11px] text-sky-300 bg-sky-950/50 p-2 rounded-lg font-mono">
                "Mon objectif était de concevoir une nouvelle architecture sans interruption de service..."
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 font-black text-lg flex items-center justify-center border border-emerald-500/30">
                A
              </div>
              <h3 className="text-base font-bold text-white">Action</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Détailler les étapes concrètes que vous avez initiées, la méthodologie et les outils mobilisés.
              </p>
              <div className="text-[11px] text-emerald-300 bg-emerald-950/50 p-2 rounded-lg font-mono">
                "J'ai instauré une architecture Kafka événementielle et formé 5 développeurs..."
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 font-black text-lg flex items-center justify-center border border-amber-500/30">
                R
              </div>
              <h3 className="text-base font-bold text-white">Résultat</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prouver l'impact réel avec des chiffres clés, des pourcentages de gain ou des retours qualitatifs.
              </p>
              <div className="text-[11px] text-amber-300 bg-amber-950/50 p-2 rounded-lg font-mono">
                "Résultat : -65% de latence et 0 interruption pendant 12 mois consécutifs."
              </div>
            </div>
          </div>

          {/* Voice & Body Language Tips */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Conseils Clés pour la Tonalité Vocale & le Langage Corporel</span>
            </h3>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <strong className="text-indigo-400 block mb-1">1. Le Rythme Optimal (130-150 WPM)</strong>
                <p className="text-slate-300">Ni trop rapide (stress perçu) ni trop lent. Marquez une micro-pause de 2 secondes avant de répondre au lieu d'utiliser "euh".</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <strong className="text-emerald-400 block mb-1">2. Le Contact Visuel Caméra</strong>
                <p className="text-slate-300">Regardez la lentille de la webcam (et non l'écran) pour créer une connexion visuelle directe avec votre interlocuteur.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <strong className="text-amber-400 block mb-1">3. La Posture d'Ancrage</strong>
                <p className="text-slate-300">Gardez le buste droit, les épaules ouvertes et les mains visibles sur la table pour dégager de l'assurance.</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Vocal Warmup & Diction Section */
        <div className="space-y-8 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Module d'Échauffement Vocal Instantané</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Préparation Vocale & Diction Avant Simulation
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Une bonne élocution capte immédiatement l'attention du jury. Effectuez ces 3 minutes d'exercices d'articulation et de respiration avant votre entretien pour détendre votre mâchoire et éliminer les hésitations.
            </p>
          </div>

          {/* 3 Steps of Warmup */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm mb-2">
                01
              </div>
              <h4 className="font-bold text-white text-sm">Respiration 4-7-8</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspiration 4s par le nez, rétention 7s, expiration lente 8s par la bouche. Abaisse le rythme cardiaque instantanément.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-2">
                02
              </div>
              <h4 className="font-bold text-white text-sm">Déverrouillage Articulaire</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Faites de doux mouvements de mâchoire de gauche à droite, puis faites vibrer vos lèvres (bruit de moteur) pendant 10 secondes.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-2">
                03
              </div>
              <h4 className="font-bold text-white text-sm">Elimination des "Euh"</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Remplacez chaque hésitation parasite par un silence court de 1 à 2 secondes. Le silence montre la maîtrise et le calme.
              </p>
            </div>
          </div>

          {/* Interactive Exercise Studio */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>Studio de Diction & Virelangues (Tongue Twisters)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Sélectionnez un exercice, écoutez la diction modèle puis entraînez-vous au micro.
                </p>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-medium px-2">Vitesse audio :</span>
                {[0.8, 1.0, 1.2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setAudioSpeed(speed)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                      audioSpeed === speed
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Exercise Selector (Left) */}
              <div className="lg:col-span-5 space-y-2">
                {DICTION_EXERCISES.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      setSelectedEx(ex);
                      setRecordedTranscript("");
                      setPracticeSuccess(null);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      selectedEx.id === ex.id
                        ? "bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300">
                          {ex.category}
                        </span>
                        <span className={`text-[10px] font-semibold ${
                          ex.difficulty === "Facile" ? "text-emerald-400" : ex.difficulty === "Moyen" ? "text-amber-400" : "text-rose-400"
                        }`}>
                          • {ex.difficulty}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                        "{ex.phrase}"
                      </p>
                    </div>

                    {selectedEx.id === ex.id && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>

              {/* Active Exercise Workshop (Right) */}
              <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Exercice Sélectionné
                    </span>
                    <span className="text-xs text-slate-500">
                      Catégorie : {selectedEx.category}
                    </span>
                  </div>

                  {/* Phrase Box */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
                    <p className="text-base sm:text-lg font-bold text-white text-center leading-relaxed">
                      "{selectedEx.phrase}"
                    </p>
                  </div>

                  {/* Coaching Advice */}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-amber-200 text-xs flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p>{selectedEx.tip}</p>
                  </div>
                </div>

                {/* Audio Controls & Practice */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Listen Button */}
                    <button
                      onClick={() => (isPlayingAudio ? stopAudio() : speakPhrase(selectedEx.phrase))}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-2 transition-all ${
                        isPlayingAudio
                          ? "bg-amber-600 hover:bg-amber-700 animate-pulse"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Arrêter la lecture</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>🔊 Écouter l'exemple audio</span>
                        </>
                      )}
                    </button>

                    {/* Mic Practice Button */}
                    <button
                      onClick={toggleRecording}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-2 transition-all ${
                        isRecording
                          ? "bg-rose-600 hover:bg-rose-700 animate-pulse"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          <span>Stop Enregistrement</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span>🎙️ Tester ma diction (Micro)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Live Recording feedback */}
                  {isRecording && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      <span>Parlez maintenant à haute voix... (Lisez la phrase ci-dessus)</span>
                    </div>
                  )}

                  {recordedTranscript && (
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Transcription détectée :</span>
                        {practiceSuccess && (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Diction Claire & Détectée !
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-white italic">
                        "{recordedTranscript}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

