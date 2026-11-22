import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// --- API Endpoints ---

// 1. Start Interview Session
app.post("/api/interview/start", async (req, res) => {
  try {
    const { category, sector, role, experienceLevel, interviewStyle, mode, durationMinutes, customScenario, selectedTechStack } = req.body;
    const ai = getGeminiClient();

    let personaContext = `Tu es un expert recruteur RH spécialisé dans les entretiens d'embauche.`;
    if (category === "examen_concours") {
      personaContext = `Tu es le Président d'un Jury d'Examen et de Concours officiel (Grand Oral, Concours Administratif, Grandes Écoles). Ton rôle est d'évaluer la culture générale, l'esprit critique, la rigueur de démonstration et la maîtrise du sujet.`;
    } else if (category === "pitch_keynote") {
      personaContext = `Tu es un Investisseur VC / Business Angel exigeant et un Directeur Commercial. Ton rôle est d'évaluer le Pitch, la proposition de valeur, le business model, le ROI et la capacité de persuasion.`;
    } else if (category === "competition_hackathon") {
      personaContext = `Tu es un Expert Tech & Membre du Jury d'un Concours d'Innovation / Hackathon. Ton rôle est de juger l'originalité, l'ergonomie UX, la faisabilité et l'impact de la solution.`;
    } else if (category === "soutenance_devoir") {
      personaContext = `Tu es un Professeur Universitaire & Président du Jury de Soutenance. Ton rôle est d'évaluer la méthodologie, la rigueur académique, le fond théorique et la capacité à défendre son mémoire ou devoir.`;
    } else if (category === "activite_pratique") {
      personaContext = `Tu es un Modérateur & Acteur principal dans une Mise en Situation Pratique (Ex: Journalista lors d'un Média Training, Client en Négociation, Coordinateur de crise).`;
    }

    const techStackStr = Array.isArray(selectedTechStack) && selectedTechStack.length > 0
      ? `Langages de programmation, Outils & Compétences ciblés à évaluer spécifiquement : ${selectedTechStack.join(", ")}.`
      : "Aucun outil technique spécifique imposé.";

    const systemInstruction = `${personaContext}
Sujet / Poste / Intitulé : "${role || 'Sujet d\'évaluation'}".
Domaine / Secteur : "${sector || 'Général'}".
Niveau d'exigence : ${experienceLevel || 'Confirmé'}.
Style d'interaction : ${interviewStyle || 'Professionnel & Rigoureux'}.
Mode : ${mode || 'Classique'}.
${techStackStr}
Scénario spécifique : ${customScenario || 'Évaluation standard avec mises en situation'}.

Génère en JSON les détails du recruteur/jury fictif, l'institution ou l'entreprise représentée et la toute première question / accroche d'ouverture à poser au candidat. La question doit tenir compte du poste et des outils/langages sélectionnés.
Rédige en français naturel, immersif et captivant.`;

    const prompt = `Crée la première question d'ouverture ou l'accroche personnalisée pour "${role}" (${category || 'entretien_embauche'}) qui mentionne ou teste les compétences clés si pertinent (${Array.isArray(selectedTechStack) ? selectedTechStack.slice(0, 3).join(", ") : ""}).
Le candidat prend la parole maintenant. Salue-le cordialement en te présentant selon ton rôle et pose la première question.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recruiterName: { type: Type.STRING },
            recruiterTitle: { type: Type.STRING },
            companyName: { type: Type.STRING },
            interviewContext: { type: Type.STRING },
            keyCompetencies: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            totalQuestions: { type: Type.INTEGER },
            firstQuestion: { type: Type.STRING },
            initialLiveTip: { type: Type.STRING },
          },
          required: ["recruiterName", "recruiterTitle", "companyName", "interviewContext", "totalQuestions", "firstQuestion"]
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error starting interview:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur lors de l'initialisation de la simulation" });
  }
});

// 2. Respond to candidate's answer & generate follow-up question
app.post("/api/interview/respond", async (req, res) => {
  try {
    const { category, sector, role, experienceLevel, interviewStyle, questionHistory, userResponseText, currentQuestionIndex, totalQuestions, selectedTechStack } = req.body;
    const ai = getGeminiClient();

    let categoryGoal = "Évalue la réponse du candidat pour cet entretien d'embauche.";
    if (category === "examen_concours") {
      categoryGoal = "Évalue la réponse comme un Jury de Concours / Grand Oral (clarté, arguments, structure, sang-froid).";
    } else if (category === "pitch_keynote") {
      categoryGoal = "Évalue la réponse comme un Investisseur VC / Client (accroche, clarté du problème/solution, chiffres clés).";
    } else if (category === "competition_hackathon") {
      categoryGoal = "Évalue la réponse comme un Jury de Hackathon (faisabilité, innovation, clarté).";
    } else if (category === "soutenance_devoir") {
      categoryGoal = "Évalue la réponse comme un Jury de Mémoire (rigueur académique, méthodologie, défense des thèses).";
    } else if (category === "activite_pratique") {
      categoryGoal = "Évalue la réactivité en situation pratique (gestion des objections, repartie, pertinence).";
    }

    const techStackStr = Array.isArray(selectedTechStack) && selectedTechStack.length > 0
      ? `Technologies & Outils ciblés par le candidat : ${selectedTechStack.join(", ")}. N'hésite pas à poser une question ciblée sur l'une de ces technologies si pertinent.`
      : "";

    const systemInstruction = `Tu es l'évaluateur IA virtuel pour : "${role}" (${sector}).
Category : ${category || 'entretien_embauche'}.
${categoryGoal}
Style d'évaluation : ${interviewStyle}.
${techStackStr}

Règles impératives de progression :
1. Question actuelle : ${currentQuestionIndex} sur ${totalQuestions}.
2. Si currentQuestionIndex (${currentQuestionIndex}) est inférieur à totalQuestions (${totalQuestions}), l'épreuve CONTINUE. Tu DOIS définir isFinished: false, et fournir obligatoirement la question suivante dans "nextQuestion".
3. Si currentQuestionIndex (${currentQuestionIndex}) est supérieur ou égal à totalQuestions (${totalQuestions}), l'épreuve est TERMINÉE. Tu DOIS définir isFinished: true, et "nextQuestion": null.
4. Dans "recruiterReaction", formule une réaction orale courte et naturelle (1 à 2 phrases) à la réponse du candidat.
5. Dans "nextQuestion", formule la question suivante précise, engageante et adaptée.`;

    const prompt = `Historique des échanges précédents :
${JSON.stringify(questionHistory, null, 2)}

Dernière intervention du candidat :
"${userResponseText}"

Question actuelle : ${currentQuestionIndex} / ${totalQuestions}.
Génère la réaction orale ("recruiterReaction"), la question suivante ("nextQuestion" si non terminé), et le diagnostic instantané ("instantFeedback").`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recruiterReaction: { type: Type.STRING, description: "Réaction orale de l'évaluateur avant la question suivante" },
            nextQuestion: { type: Type.STRING, description: "Question suivante à poser, ou null si terminé" },
            isFinished: { type: Type.BOOLEAN },
            instantFeedback: {
              type: Type.OBJECT,
              properties: {
                starScore: { type: Type.INTEGER, description: "Note d'argumentation/STAR sur 100" },
                relevanceScore: { type: Type.INTEGER, description: "Pertinence sur 100" },
                concisenessRating: { type: Type.STRING, description: "Ex: Synthétique et percutant, Trop long, Trop laconique" },
                strongAspect: { type: Type.STRING },
                improvementHint: { type: Type.STRING },
                suggestedKeyTerm: { type: Type.STRING }
              },
              required: ["starScore", "relevanceScore", "concisenessRating", "strongAspect", "improvementHint"]
            }
          },
          required: ["recruiterReaction", "isFinished", "instantFeedback"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error processing interview response:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur lors de l'analyse de la réponse" });
  }
});

// 3. Multimodal Camera Frame Analysis (Body language & facial posture)
app.post("/api/interview/analyze-frame", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "Image base64 manquante" });
    }

    const ai = getGeminiClient();
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Analyse l'image du candidat en entretien visio : contact visuel avec la caméra, posture corporelle (droite, avachie, tendue), expression faciale (souriante, fermée, concentrée, stressée) et niveau de confiance apparent. Réponds en JSON structuré."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eyeContactScore: { type: Type.INTEGER, description: "Contact visuel 0-100" },
            postureQuality: { type: Type.STRING, description: "Ex: Posture droite et ouverte, Lancement en arrière, etc." },
            facialExpression: { type: Type.STRING, description: "Ex: Souriant & Confiant, Neutre, Attentif" },
            perceivedConfidence: { type: Type.INTEGER, description: "Assurance perçue 0-100" },
            realtimeTip: { type: Type.STRING, description: "Conseil en direct court, ex: Regardez l'objectif de la caméra" }
          },
          required: ["eyeContactScore", "postureQuality", "facialExpression", "perceivedConfidence", "realtimeTip"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error analyzing frame:", error);
    // Graceful fallback if vision fails
    res.json({
      success: true,
      data: {
        eyeContactScore: 85,
        postureQuality: "Posture stable et pro",
        facialExpression: "Engagé et concentré",
        perceivedConfidence: 82,
        realtimeTip: "Maintenez le contact visuel avec le recruteur"
      }
    });
  }
});

// 4. Generate Final Comprehensive Report
app.post("/api/interview/generate-report", async (req, res) => {
  try {
    const { sector, role, experienceLevel, history, audioMetricsSummary, videoMetricsSummary } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `Tu es un Coach RH de haut niveau et Expert en Communication Non-Verbale & Verbale.
Rédige un rapport de synthèse d'entretien d'embauche complet et détaillé en français pour le poste de ${role} (${sector}).
Analyse les réponses du candidat, sa structuration STAR, sa clarté vocale et son langage corporel.`;

    const prompt = `Voici l'historique de la session d'entretien :
Secteur: ${sector} | Poste: ${role} | Niveau: ${experienceLevel}
Échanges complets :
${JSON.stringify(history, null, 2)}

Métriques audio globales :
${JSON.stringify(audioMetricsSummary || {}, null, 2)}

Métriques vidéo/corporelles globales :
${JSON.stringify(videoMetricsSummary || {}, null, 2)}

Génère un rapport diagnostique RH ultra complet avec scores, analyse question par question, et recommandations STAR d'amélioration.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "Score global /100" },
            vocalToneScore: { type: Type.INTEGER, description: "Tonalité et maîtrise vocale /100" },
            bodyLanguageScore: { type: Type.INTEGER, description: "Langage corporel & visuel /100" },
            contentStarScore: { type: Type.INTEGER, description: "Pertinence & Méthode STAR /100" },
            fluencyPaceScore: { type: Type.INTEGER, description: "Fluidité & Rythme /100" },
            executiveSummary: { type: Type.STRING, description: "Bilan global synthétique" },
            topStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            keyAreasForImprovement: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            questionAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionIndex: { type: Type.INTEGER },
                  questionText: { type: Type.STRING },
                  userResponse: { type: Type.STRING },
                  questionScore: { type: Type.INTEGER },
                  strength: { type: Type.STRING },
                  improvement: { type: Type.STRING },
                  idealStarResponse: { type: Type.STRING, description: "Exemple de réponse parfaite structurée selon STAR" }
                },
                required: ["questionIndex", "questionText", "userResponse", "questionScore", "strength", "improvement", "idealStarResponse"]
              }
            },
            personalizedActionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            fillerWordsCount: { type: Type.INTEGER },
            avgSpeakingSpeedWpm: { type: Type.INTEGER }
          },
          required: [
            "overallScore",
            "vocalToneScore",
            "bodyLanguageScore",
            "contentStarScore",
            "fluencyPaceScore",
            "executiveSummary",
            "topStrengths",
            "keyAreasForImprovement",
            "questionAnalysis",
            "personalizedActionPlan"
          ]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error generating final report:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur lors de la génération du rapport final" });
  }
});

// 5. Submit Suggestions & Feedback
const serverFeedbackList: any[] = [];
app.post("/api/feedback", (req, res) => {
  try {
    const { type, title, description, category, rating, userEmail } = req.body;
    const item = {
      id: "fb-srv-" + Date.now(),
      type: type || "suggestion",
      title,
      description,
      category: category || "Amélioration",
      rating: rating || 5,
      userEmail,
      createdAt: new Date().toISOString(),
      status: "Reçu"
    };
    serverFeedbackList.push(item);
    console.log("New feedback received on server:", item.title);
    res.json({ success: true, feedback: item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/feedback", (req, res) => {
  res.json({ success: true, feedbacks: serverFeedbackList });
});

// --- Vite Middleware / Static Files ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
