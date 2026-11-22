export type SimulationCategory =
  | "entretien_embauche"
  | "examen_concours"
  | "pitch_keynote"
  | "competition_hackathon"
  | "soutenance_devoir"
  | "activite_pratique";

export interface SimulationCategoryInfo {
  id: SimulationCategory;
  name: string;
  icon: string;
  badge: string;
  description: string;
  roleLabel: string;
  contextLabel: string;
  evaluatorLabel: string;
  color: string;
}

export type SectorId =
  | "tech"
  | "finance"
  | "health"
  | "marketing"
  | "engineering"
  | "hospitality"
  | "hr"
  | "legal"
  | "luxury"
  | "education";

export type ExperienceLevel = "debutant" | "confirme" | "senior" | "executive";

export type InterviewStyle = "bienveillant" | "professionnel" | "stress_test" | "technique";

export type InterviewMode = "classique" | "mise_en_situation" | "cas_pratique" | "negociation_salaire";

export interface Sector {
  id: SectorId;
  name: string;
  icon: string;
  description: string;
  popularRoles: string[];
  keyCompetencies: string[];
  color: string;
}

export interface PrebuiltScenario {
  id: string;
  title: string;
  category: SimulationCategory;
  sectorId: SectorId;
  role: string;
  level: ExperienceLevel;
  difficulty: "Facile" | "Intermédiaire" | "Avancé" | "Expert";
  description: string;
  context: string;
  mode: InterviewMode;
  estimatedDuration: number; // in minutes
  tags: string[];
}

export interface LiveAudioMetrics {
  wpm: number; // words per minute
  volumeLevel: number; // 0-100
  pitchStability: number; // 0-100
  pauseDurationAvg: number; // seconds
  fillerWordsCount: number; // "euh", "donc", "en fait"
  confidenceScore: number; // 0-100
}

export interface LiveVideoMetrics {
  eyeContactScore: number; // 0-100
  postureQuality: string;
  facialExpression: string;
  perceivedConfidence: number; // 0-100
  headMovementStability: number; // 0-100
  realtimeTip: string;
}

export interface QuestionAnswerRecord {
  questionIndex: number;
  questionText: string;
  userAnswerText: string;
  answerDurationSeconds: number;
  audioMetrics: LiveAudioMetrics;
  videoMetrics: LiveVideoMetrics;
  instantFeedback?: {
    starScore: number;
    relevanceScore: number;
    concisenessRating: string;
    strongAspect: string;
    improvementHint: string;
    suggestedKeyTerm?: string;
  };
}

export interface FinalReportData {
  overallScore: number;
  vocalToneScore: number;
  bodyLanguageScore: number;
  contentStarScore: number;
  fluencyPaceScore: number;
  executiveSummary: string;
  topStrengths: string[];
  keyAreasForImprovement: string[];
  questionAnalysis: {
    questionIndex: number;
    questionText: string;
    userResponse: string;
    questionScore: number;
    strength: string;
    improvement: string;
    idealStarResponse: string;
  }[];
  personalizedActionPlan: string[];
  fillerWordsCount: number;
  avgSpeakingSpeedWpm: number;
}

export interface SavedInterviewSession {
  id: string;
  dateIso: string;
  category?: SimulationCategory;
  categoryName?: string;
  sectorId: SectorId;
  sectorName: string;
  role: string;
  selectedTechStack?: string[];
  experienceLevel: ExperienceLevel;
  interviewStyle: InterviewStyle;
  mode: InterviewMode;
  durationSeconds: number;
  totalQuestions: number;
  history: QuestionAnswerRecord[];
  report: FinalReportData;
  recruiterInfo: {
    name: string;
    title: string;
    companyName: string;
  };
  hasMediaRecording?: boolean;
}

export interface UserStats {
  totalInterviews: number;
  avgOverallScore: number;
  avgVocalScore: number;
  avgBodyLanguageScore: number;
  avgStarScore: number;
  totalTimeMinutes: number;
  fillerWordsReducedPercentage: number;
  unlockedBadges: string[];
}

export type FeedbackType = "suggestion" | "bug" | "feature" | "recommendation" | "other";

export interface AppFeedback {
  id: string;
  type: FeedbackType;
  title: string;
  description: string;
  rating?: number; // 1-5
  category?: string;
  userEmail?: string;
  createdAt: string;
  status: "Reçu" | "En cours d'étude" | "Pris en compte";
  upvotes?: number;
}

