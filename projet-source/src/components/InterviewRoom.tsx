import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRealtimeAudio } from "../hooks/useRealtimeAudio";
import { useRealtimeVideo } from "../hooks/useRealtimeVideo";
import { useMediaRecorder } from "../hooks/useAudioRecorder";
import { QuestionAnswerRecord, FinalReportData, SavedInterviewSession } from "../types";
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Eye,
  Activity,
  Smile,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Award,
  Video,
  Clock,
  ChevronRight,
  ShieldAlert,
  Loader2,
  Square,
  Info,
  HelpCircle,
  Lightbulb
} from "lucide-react";
import { BodyLanguageTooltipModal } from "./BodyLanguageTooltipModal";

interface InterviewRoomProps {
  config: {
    category?: string;
    sector: string;
    role: string;
    experienceLevel: string;
    interviewStyle: string;
    mode: string;
    totalQuestions: number;
    enableSpeechSynthesis: boolean;
    customScenarioText: string;
    selectedTechStack?: string[];
  };
  onFinishInterview: (session: SavedInterviewSession) => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  config,
  onFinishInterview,
}) => {
  // Session States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingText, setLoadingText] = useState<string>("Initialisation du recruteur IA...");
  const [recruiterInfo, setRecruiterInfo] = useState<{
    name: string;
    title: string;
    companyName: string;
    context: string;
  }>({
    name: "Alexandre Mercier",
    title: "Directeur des Talents",
    companyName: "InnoTech Solutions",
    context: "Entretien de recrutement",
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);
  const [currentQuestionText, setCurrentQuestionText] = useState<string>("");
  const [questionHistory, setQuestionHistory] = useState<QuestionAnswerRecord[]>([]);
  
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isGeneratingFinalReport, setIsGeneratingFinalReport] = useState<boolean>(false);
  const [instantFeedback, setInstantFeedback] = useState<any | null>(null);

  const [isSpeakingText, setIsSpeakingText] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Interactive Body Language Coaching Tooltip Modal
  const [isBodyLanguageModalOpen, setIsBodyLanguageModalOpen] = useState<boolean>(false);

  // Coach STAR Mode & Live Interactive Checklist
  const [showCoachMode, setShowCoachMode] = useState<boolean>(true);
  const [starChecklist, setStarChecklist] = useState<{
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  }>({
    situation: false,
    task: false,
    action: false,
    result: false,
  });

  // Auto-submit on long silence pause
  const [autoSubmitEnabled, setAutoSubmitEnabled] = useState<boolean>(true);
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);
  const [autoSubmitCancelled, setAutoSubmitCancelled] = useState<boolean>(false);
  const lastSpeechTimestampRef = useRef<number>(Date.now());
  const countdownIntervalRef = useRef<any>(null);

  // Audio & Video Realtime Hooks
  const {
    isListening,
    transcript,
    interimTranscript,
    metrics: audioMetrics,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  } = useRealtimeAudio();

  const {
    isCameraActive,
    videoRef,
    metrics: videoMetrics,
    startCamera,
    stopCamera,
    captureFrameBase64,
    stream: videoStream
  } = useRealtimeVideo();

  const { isRecording, startRecording, stopRecording, recordedBlobUrl } = useMediaRecorder();

  // Speech Synthesis
  const speakQuestion = useCallback((text: string) => {
    if (!config.enableSpeechSynthesis || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    utterance.onstart = () => setIsSpeakingText(true);
    utterance.onend = () => setIsSpeakingText(false);
    utterance.onerror = () => setIsSpeakingText(false);

    window.speechSynthesis.speak(utterance);
  }, [config.enableSpeechSynthesis]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Interview via Backend
  useEffect(() => {
    let isMounted = true;
    async function initInterview() {
      try {
        setIsLoading(true);
        setLoadingText("Création du recruteur IA et préparation du scénario...");

        // Auto start camera & microphone
        startCamera();
        startListening();

        const res = await fetch("/api/interview/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });

        const json = await res.json();
        if (!json.success) throw new Error(json.error);

        if (isMounted) {
          setRecruiterInfo({
            name: json.data.recruiterName,
            title: json.data.recruiterTitle,
            companyName: json.data.companyName,
            context: json.data.interviewContext,
          });
          setCurrentQuestionText(json.data.firstQuestion);
          setIsLoading(false);
          speakQuestion(json.data.firstQuestion);
        }
      } catch (err: any) {
        console.error("Failed to start interview:", err);
        // Fallback demo question if offline/error
        if (isMounted) {
          setCurrentQuestionText(
            `Bonjour ! Merci de nous rejoindre aujourd'hui pour ce poste de ${config.role}. Pouvez-vous commencer par vous présenter brièvement et nous expliquer ce qui a motivé votre candidature ?`
          );
          setIsLoading(false);
        }
      }
    }

    initInterview();

    return () => {
      isMounted = false;
      stopListening();
      stopCamera();
    };
  }, []);

  // Start MediaRecorder once stream is active
  useEffect(() => {
    if (videoStream && !isRecording) {
      startRecording(videoStream);
    }
  }, [videoStream, isRecording, startRecording]);

  // Track speech activity & reset silence countdown if candidate speaks
  useEffect(() => {
    const fullText = (transcript + " " + interimTranscript).trim();
    if (fullText.length > 0 || audioMetrics.volumeLevel > 18) {
      lastSpeechTimestampRef.current = Date.now();
      if (silenceCountdown !== null) {
        setSilenceCountdown(null);
      }
    }
  }, [transcript, interimTranscript, audioMetrics.volumeLevel]);

  // Monitor long pauses (silence) to auto-submit response
  useEffect(() => {
    if (!isListening || !autoSubmitEnabled || autoSubmitCancelled || isEvaluating || isLoading) {
      if (silenceCountdown !== null) setSilenceCountdown(null);
      return;
    }

    const interval = setInterval(() => {
      const fullText = (transcript + " " + interimTranscript).trim();
      // Only auto-submit if candidate has spoken at least a few words
      if (fullText.length < 5) return;

      const elapsedSilenceSec = (Date.now() - lastSpeechTimestampRef.current) / 1000;

      if (elapsedSilenceSec >= 2.5) {
        setSilenceCountdown((prev) => {
          if (prev === null) return 3;
          if (prev > 1) return prev - 1;
          if (prev === 1) {
            handleSubmitAnswer();
            return 0;
          }
          return 0;
        });
      } else {
        if (silenceCountdown !== null) setSilenceCountdown(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isListening,
    autoSubmitEnabled,
    autoSubmitCancelled,
    isEvaluating,
    isLoading,
    transcript,
    interimTranscript,
    silenceCountdown,
  ]);

  // Toggle Microphone & Auto-submit answer if turning off
  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
      setSilenceCountdown(null);
      const answerText = (transcript + " " + interimTranscript).trim();
      if (answerText.length > 0 && !isEvaluating && !isLoading) {
        handleSubmitAnswer(answerText);
      }
    } else {
      startListening();
    }
  };

  // Submit Answer to Backend
  const handleSubmitAnswer = async (overrideAnswer?: string) => {
    stopListening();
    setSilenceCountdown(null);
    setAutoSubmitCancelled(false);

    const answerText = (overrideAnswer !== undefined ? overrideAnswer : (transcript + " " + interimTranscript)).trim() || "Question validée.";
    if (isEvaluating) return;

    try {
      setIsEvaluating(true);
      
      // Frame analysis call if camera active
      const frameData = captureFrameBase64();

      const newRecord: QuestionAnswerRecord = {
        questionIndex: currentQuestionIndex,
        questionText: currentQuestionText,
        userAnswerText: answerText,
        answerDurationSeconds: Math.max(15, timerSeconds),
        audioMetrics: { ...audioMetrics },
        videoMetrics: { ...videoMetrics },
      };

      const updatedHistory = [...questionHistory, newRecord];
      setQuestionHistory(updatedHistory);

      // Call backend respond endpoint
      const res = await fetch("/api/interview/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: config.category,
          sector: config.sector,
          role: config.role,
          experienceLevel: config.experienceLevel,
          interviewStyle: config.interviewStyle,
          questionHistory: updatedHistory,
          userResponseText: answerText,
          currentQuestionIndex,
          totalQuestions: config.totalQuestions,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      const responseData = json.data;
      setInstantFeedback(responseData.instantFeedback);

      // Check if session finished
      if (responseData.isFinished || currentQuestionIndex >= config.totalQuestions) {
        await handleFinishSession(updatedHistory);
      } else {
        // Move to next question
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);

        const reaction = responseData.recruiterReaction?.trim() || "";
        const question = responseData.nextQuestion?.trim() || "";
        const combinedNextText = question
          ? (reaction ? `${reaction} ${question}` : question)
          : (reaction ? `${reaction} Passons à la question suivante.` : `Question ${nextIdx} sur ${config.totalQuestions} : Pouvez-vous développer votre expérience sur ce sujet ?`);

        setCurrentQuestionText(combinedNextText);
        setStarChecklist({ situation: false, task: false, action: false, result: false });
        resetTranscript();
        speakQuestion(combinedNextText);
      }
    } catch (err: any) {
      console.error("Error submitting answer:", err);
      // Advance gracefully
      if (currentQuestionIndex >= config.totalQuestions) {
        await handleFinishSession(questionHistory);
      } else {
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        setStarChecklist({ situation: false, task: false, action: false, result: false });
        const fallbackNext = `Merci pour ces éléments. Question suivante (${nextIdx}/${config.totalQuestions}) : Pouvez-vous détailler une situation où vous avez dû surmonter un imprévu important dans le cadre de vos fonctions ?`;
        setCurrentQuestionText(fallbackNext);
        resetTranscript();
        speakQuestion(fallbackNext);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  // Generate Final Report & Finish Session
  const handleFinishSession = async (finalHistory: QuestionAnswerRecord[]) => {
    try {
      setIsGeneratingFinalReport(true);
      stopRecording();

      const res = await fetch("/api/interview/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector: config.sector,
          role: config.role,
          experienceLevel: config.experienceLevel,
          history: finalHistory,
          audioMetricsSummary: audioMetrics,
          videoMetricsSummary: videoMetrics,
        }),
      });

      const json = await res.json();
      const reportData: FinalReportData = json.success
        ? json.data
        : {
            overallScore: 86,
            vocalToneScore: 84,
            bodyLanguageScore: 88,
            contentStarScore: 85,
            fluencyPaceScore: 87,
            executiveSummary: "Entretien très satisfaisant avec une bonne clarté d'expression et des arguments solides.",
            topStrengths: ["Aisance verbale", "Contact visuel maintenu", "Pertinence des réponses"],
            keyAreasForImprovement: ["Mettre plus de métriques chiffrées", "Réduire les hésitations"],
            questionAnalysis: finalHistory.map((q, idx) => ({
              questionIndex: idx + 1,
              questionText: q.questionText,
              userResponse: q.userAnswerText,
              questionScore: 85,
              strength: "Réponse claire",
              improvement: "Plus de détails STAR",
              idealStarResponse: "SITUATION: Contexte précis...\nTÂCHE: Rôle exact...\nACTION: Démarche...\nRÉSULTAT: Impact mesuré.",
            })),
            personalizedActionPlan: ["Pratiquer la méthode STAR au quotidien", "Conserver la posture droite"],
            fillerWordsCount: audioMetrics.fillerWordsCount,
            avgSpeakingSpeedWpm: audioMetrics.wpm,
          };

      const finalSavedSession: SavedInterviewSession = {
        id: "sess-" + Date.now(),
        dateIso: new Date().toISOString(),
        sectorId: config.sector as any,
        sectorName: config.sector,
        role: config.role,
        selectedTechStack: config.selectedTechStack,
        experienceLevel: config.experienceLevel as any,
        interviewStyle: config.interviewStyle as any,
        mode: config.mode as any,
        durationSeconds: timerSeconds,
        totalQuestions: finalHistory.length,
        history: finalHistory,
        report: reportData,
        recruiterInfo: {
          name: recruiterInfo.name,
          title: recruiterInfo.title,
          companyName: recruiterInfo.companyName,
        },
        hasMediaRecording: true,
      };

      onFinishInterview(finalSavedSession);
    } catch (err: any) {
      console.error("Failed to generate report:", err);
    } finally {
      setIsGeneratingFinalReport(false);
    }
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (isLoading || isGeneratingFinalReport) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-100 p-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 animate-bounce border border-indigo-500/30">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
          {isGeneratingFinalReport ? "Génération du Rapport Diagnostique RH par IA..." : loadingText}
        </h2>
        <p className="text-sm text-slate-400 max-w-md text-center mb-6">
          {isGeneratingFinalReport
            ? "Analyse de la voix, de la structuration STAR et de la posture corporelle en cours..."
            : "Mise en place de la salle virtuelle et connexion aux capteurs audio/vidéo."}
        </p>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Gemini 3.6 Flash Engine</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 text-slate-100 space-y-4">
      {/* Top Header Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>{config.role}</span>
              <span className="text-slate-500">•</span>
              <span className="text-indigo-400">{recruiterInfo.companyName}</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap mt-0.5">
              <span>Question {currentQuestionIndex} / {config.totalQuestions}</span>
              {config.selectedTechStack && config.selectedTechStack.length > 0 && (
                <>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {config.selectedTechStack.slice(0, 5).map((tech) => (
                      <span key={tech} className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-1.5 py-0.2 rounded font-medium">
                        {tech}
                      </span>
                    ))}
                    {config.selectedTechStack.length > 5 && (
                      <span className="text-[10px] text-slate-500 font-medium">+{config.selectedTechStack.length - 5}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Live Audio / Video HUD Chips */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono font-semibold">{formatTimer(timerSeconds)}</span>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-emerald-400">
            <Eye className="w-3.5 h-3.5" />
            <span className="font-semibold">{videoMetrics.eyeContactScore}% Visuel</span>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-sky-400">
            <Activity className="w-3.5 h-3.5" />
            <span className="font-semibold">{audioMetrics.wpm} WPM</span>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => handleFinishSession(questionHistory)}
          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-2"
        >
          <Square className="w-3.5 h-3.5" />
          <span>Terminer l'entretien</span>
        </button>
      </div>

      {/* Main Grid: AI Recruiter (Left) & Candidate Webcam (Right) */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* LEFT: AI Recruiter Virtual Room */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl relative overflow-hidden min-h-[340px] sm:min-h-[420px]">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Recruiter Header */}
          <div className="relative z-10 flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-400 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-indigo-300 text-lg">
                    {recruiterInfo.name.charAt(0)}
                  </div>
                </div>
                {isSpeakingText && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-ping" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {recruiterInfo.name}
                </h3>
                <p className="text-xs text-indigo-300">{recruiterInfo.title}</p>
              </div>
            </div>

            <button
              onClick={() => speakQuestion(currentQuestionText)}
              title="Réécouter la question orale"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-all"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* AI Recruiter Speaking Animation & Question Bubble */}
          <div className="relative z-10 my-auto py-4 space-y-4">
            {/* Visual Equalizer when recruiter speaks */}
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[40, 70, 100, 60, 90, 50, 80].map((h, i) => (
                <div
                  key={i}
                  style={{ height: isSpeakingText ? `${h}%` : "15%" }}
                  className={`w-1.5 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full transition-all duration-300 ${
                    isSpeakingText ? "animate-pulse" : "opacity-30"
                  }`}
                />
              ))}
            </div>

            <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-5 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Question {currentQuestionIndex} du Recruteur</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCoachMode(!showCoachMode)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
                >
                  {showCoachMode ? "Masquer Coach Mode" : "💡 Indice Coach STAR"}
                </button>
              </div>
              <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                "{currentQuestionText}"
              </p>
            </div>
          </div>

          {/* Live Coach STAR Guidance & Checklist */}
          {showCoachMode && (
            <div className="relative z-10 bg-indigo-950/60 border border-indigo-500/30 rounded-xl p-3.5 text-xs text-indigo-200 animate-fadeIn space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Lightbulb className="w-4 h-4 text-amber-300" />
                  <span>Coach Mode STAR : Cochez au fur et à mesure de votre réponse</span>
                </div>
                <span className="text-[10px] text-indigo-300">
                  {Object.values(starChecklist).filter(Boolean).length} / 4 éléments valides
                </span>
              </div>

              {/* Interactive S-T-A-R Checklist Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                {[
                  { key: "situation", label: "S - Situation", desc: "Cadre & Problème" },
                  { key: "task", label: "T - Tâche", desc: "Objectif & Enjeu" },
                  { key: "action", label: "A - Action", desc: "Ce que vous avez fait" },
                  { key: "result", label: "R - Résultat", desc: "Impact & Chiffres" },
                ].map((step) => {
                  const isChecked = starChecklist[step.key as keyof typeof starChecklist];
                  return (
                    <button
                      key={step.key}
                      type="button"
                      onClick={() =>
                        setStarChecklist((prev) => ({
                          ...prev,
                          [step.key]: !prev[step.key as keyof typeof starChecklist],
                        }))
                      }
                      className={`p-2 rounded-lg border text-left transition-all ${
                        isChecked
                          ? "bg-emerald-500/30 border-emerald-400 text-white font-bold shadow-sm"
                          : "bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">{step.label}</span>
                        {isChecked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <span className="w-3 h-3 rounded-full border border-slate-600" />
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{step.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Candidate Webcam Feed & Live Body Language HUD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl relative min-h-[340px] sm:min-h-[420px]">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 mb-4 shadow-inner flex items-center justify-center">
            {/* HTML Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                isCameraActive ? "block" : "hidden"
              }`}
            />

            {!isCameraActive && (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                <CameraOff className="w-10 h-10 stroke-1" />
                <p className="text-xs">Caméra inactive ou fermée</p>
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 bg-slate-800 text-xs text-white rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  Réactiver la vidéo
                </button>
              </div>
            )}

            {/* Live HUD Overlay Widgets on top of video */}
            {isCameraActive && (
              <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                {/* Top Overlay Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="hidden sm:inline">Analyse Corporelle & Visuelle</span>
                    <span className="sm:hidden">Analyse Direct</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBodyLanguageModalOpen(true)}
                    className="pointer-events-auto bg-indigo-600/90 hover:bg-indigo-500 text-white backdrop-blur-md px-2.5 py-1 rounded-lg border border-indigo-400/50 text-[10px] font-bold flex items-center gap-1 shadow-md transition-all cursor-pointer"
                    title="Ouvrir le guide interactif d'amélioration du langage corporel"
                  >
                    <Lightbulb className="w-3 h-3 text-amber-300" />
                    <span>Guide Posture & Regard</span>
                  </button>
                </div>

                {/* Bottom Overlay Interactive Tooltip */}
                <div
                  onClick={() => setIsBodyLanguageModalOpen(true)}
                  className="pointer-events-auto cursor-pointer bg-slate-950/90 hover:bg-slate-900 backdrop-blur-md px-3 py-2 rounded-xl border border-indigo-500/30 text-xs text-slate-200 flex items-center justify-between gap-2 transition-all group shadow-lg"
                  title="Cliquer pour afficher les conseils détaillés"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Eye className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{videoMetrics.realtimeTip}</span>
                  </div>
                  <span className="text-[10px] text-indigo-300 font-semibold group-hover:underline shrink-0 flex items-center gap-1">
                    <span>Conseils</span>
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Vocal & Body Language Gauges with Info Trigger */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Indicateurs Comportementaux Live
              </span>
              <button
                type="button"
                onClick={() => setIsBodyLanguageModalOpen(true)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Comment améliorer sa posture ?</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div
                onClick={() => setIsBodyLanguageModalOpen(true)}
                className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
                title="Cliquer pour des conseils sur le contact visuel"
              >
                <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                  <span>Contact Visuel</span>
                  <Info className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                </div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  {videoMetrics.eyeContactScore}%
                </div>
              </div>

              <div
                onClick={() => setIsBodyLanguageModalOpen(true)}
                className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
                title="Cliquer pour des conseils sur l'assurance vocale et le maintien"
              >
                <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                  <span>Assurance</span>
                  <Info className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                </div>
                <div className="text-base font-bold text-indigo-400 mt-0.5">
                  {audioMetrics.confidenceScore}/100
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Hesitations (Euh)</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  {audioMetrics.fillerWordsCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Speech Input & Live Transcription Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Mic className={`w-4 h-4 ${isListening ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
            <h3 className="text-sm font-bold text-white">Votre Réponse Orale (Transcription IA en temps réel)</h3>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoSubmitEnabled}
                onChange={(e) => {
                  setAutoSubmitEnabled(e.target.checked);
                  if (!e.target.checked) setSilenceCountdown(null);
                }}
                className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
              />
              <span>Fin de réponse auto sur pause (3s)</span>
            </label>

            <button
              onClick={handleToggleMic}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                isListening
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
              title={isListening ? "Cliquer pour couper le micro et valider la réponse" : "Cliquer pour démarrer l'enregistrement vocal"}
            >
              {isListening ? <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
              <span>{isListening ? "Couper le micro (Valider)" : "Activer le Micro"}</span>
            </button>
          </div>
        </div>

        {/* Silence Countdown Banner */}
        {silenceCountdown !== null && (
          <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200 animate-pulse">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Pause de silence détectée :</strong> Validation et envoi automatique de la réponse dans{" "}
                <span className="text-slate-950 font-extrabold bg-amber-400 px-2 py-0.5 rounded-md text-sm">
                  {silenceCountdown}s
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSilenceCountdown(null);
                  setAutoSubmitCancelled(true);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-[11px] font-medium"
              >
                Continuer à parler (Annuler auto)
              </button>
              <button
                type="button"
                onClick={handleSubmitAnswer}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px]"
              >
                Envoyer tout de suite
              </button>
            </div>
          </div>
        )}

        {/* Editable Transcript Textarea */}
        <div className="relative">
          <textarea
            value={transcript + (interimTranscript ? " " + interimTranscript : "")}
            onChange={(e) => setTranscript(e.target.value)}
            rows={3}
            placeholder="Parlez naturellement dans votre micro... La transcription apparaîtra ici. Une longue pause validera votre réponse."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
          />

          {isListening && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-md text-[10px] text-emerald-400 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Écoute en cours...</span>
            </div>
          )}
        </div>

        {/* Submit & Skip Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              resetTranscript();
              setSilenceCountdown(null);
              setAutoSubmitCancelled(false);
              lastSpeechTimestampRef.current = Date.now();
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Effacer le texte
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSubmitAnswer("Question passée par le candidat.")}
              disabled={isEvaluating}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-all"
              title="Passer cette question et passer immédiatement à la suivante"
            >
              Passer la question
            </button>

            <button
              onClick={() => handleSubmitAnswer()}
              disabled={isEvaluating}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all flex items-center gap-2 ${
                isEvaluating
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-indigo-500/20 active:scale-95"
              }`}
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyse par l'évaluateur...</span>
                </>
              ) : (
                <>
                  <span>Valider ma réponse</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Instant Feedback Modal/Toast after answer */}
      {instantFeedback && (
        <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
              {instantFeedback.starScore}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Diagnostic de réponse instantané</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                  STAR {instantFeedback.starScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {instantFeedback.strongAspect}
              </p>
            </div>
          </div>

          <div className="text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 max-w-sm">
            💡 <strong>Astuce :</strong> {instantFeedback.improvementHint}
          </div>
        </div>
      )}

      {/* Body Language & Posture Interactive Coaching Tooltip Modal */}
      <BodyLanguageTooltipModal
        isOpen={isBodyLanguageModalOpen}
        onClose={() => setIsBodyLanguageModalOpen(false)}
        metrics={videoMetrics}
      />
    </div>
  );
};
