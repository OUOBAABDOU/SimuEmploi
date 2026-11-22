# SimuEmploi AI — Plateforme de Coaching & Simulation d'Oral par Intelligence Artificielle

> **SimuEmploi AI** est un simulateur immersif et intelligent d'épreuves orales et d'entretiens professionnels. Propulsé par la plateforme Google Gemini AI et l'analyse multimédia en temps réel, l'application offre une préparation à 360° pour les entretiens d'embauche, grands oraux de concours, pitchs de levée de fonds, soutenances académiques et séances de média-training.

---

## 📋 Table des Matières

1. [Présentation Générale](#-présentation-générale)
2. [Cahier des Charges Complet](#-cahier-des-charges-complet)
   - [1. Contextualisation & Objectifs](#1-contextualisation--objectifs)
   - [2. Personas Utilisateurs](#2-personas-utilisateurs)
   - [3. Spécifications Fonctionnelles](#3-spécifications-fonctionnelles)
   - [4. Spécifications Non-Fonctionnelles](#4-spécifications-non-fonctionnelles)
3. [Architecture Système & Technique](#-architecture-système--technique)
   - [1. Diagramme de Flux de Données (Data Flow)](#1-diagramme-de-flux-de-données-data-flow)
   - [2. Arborescence du Code & Micro-Composants](#2-arborescence-du-code--micro-composants)
   - [3. Pipeline Vision, Audio & Intelligence Artificielle](#3-pipeline-vision-audio--intelligence-artificielle)
   - [4. Modèle de Données TypeScript](#4-modèle-de-données-typescript)
   - [5. Stack Technologique Complexe](#5-stack-technologique-complexe)
4. [Guide de Démarrage & Déploiement](#-guide-de-démarrage--déploiement)

---

## 🌟 Présentation Générale

**SimuEmploi AI** a été conçu pour éliminer l'anxiété de la prise de parole en public et maximiser les taux de réussite aux épreuves orales. Contrairement aux simples chatbots textuels, SimuEmploi AI combine :

* **Analyse de la posture et du contact visuel** via la caméra web (détection d'alignement du visage et d'ancrage visuel).
* **Analyse vocale active** via microphone (détection des tics de langage comme *"euh"*, *"du coup"*, rythme de parole en mots/minute, clarté tonale).
* **Questions adaptatives générées par l'IA Gemini** adaptées à votre niveau, au secteur d'activité et aux outils/technologies sélectionnés.
* **Méthode STAR intégrée** (Situation, Tâche, Action, Résultat) pour structurer vos réponses comportementales.
* **Bilan détaillé & scoring multi-axes** (Clarté, Pertinence technique, Posture, Ton de voix) avec conseils correctifs et rapport téléchargeable.

---

## 📄 Cahier des Charges Complet

### 1. Contextualisation & Objectifs

#### 1.1 Contexte
Les candidats aux concours, entretiens d'embauche et soutenances manquent souvent de retours objectifs et immédiats sur leur prestation orale. Les simulations humaines sont coûteuses et difficiles à planifier.

#### 1.2 Objectifs Stratégiques
* Fournir un entraînement illimité, réaliste et bienveillant 24h/24.
* Évaluer simultanément la **fond** (arguments, logique, vocabulaire métier) et la **forme** (posture, regard, débit verbal, hésitations).
* Garantir une expérience ultra-responsive adaptée aussi bien aux smartphones qu'aux très grands écrans PC/Mac 4K.

---

### 2. Personas Utilisateurs

1. **Julien (23 ans, Étudiant en Master)**
   * *Besoin :* Préparer sa soutenance de mémoire et son Grand Oral de concours administratif.
   * *Attente :* Un chronomètre strict, des questions pointues sur sa méthodologie et un feedback sur ses tics de langage.
2. **Sarah (29 ans, Développeuse Fullstack Senior)**
   * *Besoin :* S'entraîner aux entretiens techniques en React, Node.js et Architecture Cloud.
   * *Attente :* Une sélection précise de sa stack technique et des questions de mise en situation concrète.
3. **Mamadou (35 ans, Fondateur de Startup)**
   * *Besoin :* Pitcher son projet devant des investisseurs virtuels (Levée de fonds Seed).
   * *Attente :* Des relances incisives sur le business model et l'analyse de son assurance visuelle face caméra.

---

### 3. Spécifications Fonctionnelles

#### A. Module d'Accueil & Configuration de Simulation (`SetupScreen.tsx`)
* **Choix du type d'épreuve (6 catégories) :**
  1. *Entretien d'Embauche / Recrutement*
  2. *Examen, Concours & Grand Oral*
  3. *Pitch & Keynote (Startup / Investisseurs)*
  4. *Compétition & Hackathon*
  5. *Soutenance & Mémoire Académique*
  6. *Activité Pratique / Média-Training*
* **Sélecteur de Secteur (8 domaines) :** Tech & Software, Finance & Banque, Santé, Droit, Design/Creative, Marketing, Ingénierie, Vente & Business Dev.
* **Sélecteur de Stack & Outils (Plus de 60 technologies prédéfinies) :**
  * Langages (TypeScript, Python, Java, Rust...)
  * Frameworks (React, Next.js, Django, Spring...)
  * Cloud/DevOps (Docker, Kubernetes, AWS, PostgreSQL...)
  * Business & Legal (SaaS KPI, Finance, Droit des Affaires...)
* **Configuration Personnalisée :** Niveau de difficulté (Débutant, Intermédiaire, Senior, Expert), Nombre de questions (3 à 10), langue de passage, activation de la synthèse vocale audio.

#### B. Studio de Simulation Multimédia (`InterviewRoom.tsx`)
* **Affichage de l'Évaluateur IA Avatar :**
  * Avatar interactif réactif avec états (Attente, Réfléchit, Parle, Écoute).
  * Synthèse vocale intégrée (Web Speech Synthesis API) lisant les questions oralement.
* **Flux Vidéo Candidat & Analyse Facial/Ancrage :**
  * Flux retour caméra haute définition en direct.
  * Widget d'analyse en temps réel : Détection du centrage du visage, contact visuel, stabilisateur de posture.
* **Reconnaissance Vocale & Analyse de Parole en Direct :**
  * Retranscription temps réel via Web Speech Recognition / MediaRecorder.
  * Détection automatique des tics de langage (*euh, ben, du coup, en fait, voilà, genre*).
  * Calculateur dynamique du débit de parole (Mots Par Minute - MPM) avec jauge visuelle (Lent, Optimal 110-150 MPM, Trop rapide).
* **Boîte à Outils d'Aide STAR :**
  * Rappel dynamique de la structure de réponse STAR (Situation, Tâche, Action, Résultat).
  * Chronomètre de temps de réponse avec alertes visuelles.

#### C. Rapport Bilan & Analyse Détaillée (`InterviewReportView.tsx`)
* **Scoring Global sur 100 :**
  * Note globale calculée sur 4 piliers : Pertinence Technique, Clarté Verbale, Posture & Ancrage, Gestion du Stress & Débit.
* **Feedback Question par Question :**
  * Transcription exacte de la réponse du candidat.
  * Réponse idéale recommandée élaborée par l'IA.
  * Points forts et axes d'amélioration ciblés.
* **Exportation & Sauvegarde :**
  * Exportation du rapport au format JSON / PDF.
  * Enregistrement automatique dans l'historique local (`localStorage`).

#### D. Bibliothèque de Scénarios Pré-Configurés (`ScenarioLibrary.tsx`)
* Plus de 12 scénarios prêts à l'emploi (ex: *Développeur React chez BigTech, Pitch Startup devant Business Angels, Soutenance de Thèse, Oral de l'ENA*).
* Démarrage en 1 clic sans passer par la configuration manuelle.

#### E. Guide de Référence Méthode STAR (`StarMethodGuide.tsx`)
* Guide interactif explicitant les 4 étapes de la méthode STAR.
* Exemples concrets d'explication "Avant / Après" pour transformer une réponse vague en démonstration percutante.

#### F. Historique & Progression (`HistoryDashboard.tsx`)
* Graphiques de progression cumulée (Recharts).
* Évolution des scores moyens au fil des sessions.
* Exportation globale des données utilisateur.

#### G. Module d'Avis & Suggestions (`FeedbackSection.tsx`)
* Formulaire de notation de l'application avec étoiles, choix d'icônes de ressentis et envoi de commentaires.

---

### 4. Spécifications Non-Fonctionnelles

* **Ergonomie & Responsive Design Ultra-Fluide :**
  * Prise en charge parfaite des mobiles (Android, iOS), tablettes, laptops et écrans PC Ultra-Large (4K, 21:9) grâce au conteneur `max-w-[1600px]`.
  * Support du mode sombre moderne (*slate-950/indigo*) avec contrastes élevés conformes aux normes WCAG AA.
* **Performance :**
  * Temps de chargement initial < 1.5s.
  * Traitement local de l'audio/vidéo pour minimiser la bande passante.
* **Sécurité & Confidentialité :**
  * Traitement vidéo exclusivement local (aucun flux caméra n'est stocké sur serveur externe).
  * Clés d'API sécurisées côté serveur Express (`server.ts`) pour communiquer avec Google Gemini.

---

## 🏗️ Architecture Système & Technique

### 1. Diagramme de Flux de Données (Data Flow)

```
       ┌────────────────────────────────────────────────────────┐
       │                Utilisateur (Navigateur)               │
       └─┬──────────────────────┬──────────────────────┬────────┘
         │ (Webcam & Micro)     │ (Changements d'état) │ (Actions UI)
         ▼                      ▼                      ▼
 ┌──────────────┐     ┌──────────────────┐    ┌─────────────────┐
 │ MediaStream  │     │ React State Engine│    │ Web Speech API  │
 │ (Canvas/RTC) │     │ (App / Components)│    │ (STT & TTS)     │
 └───────┬──────┘     └─────────┬────────┘    └────────┬────────┘
         │                      │                      │
         │ (Frames / Posture)   │ (Payload Entretien)  │ (Texte / Voix)
         ▼                      ▼                      ▼
 ┌──────────────────────────────────────────────────────────────┐
 │                      Service API Client                      │
 └──────────────────────────────┬───────────────────────────────┘
                                │ (Requêtes HTTPS / REST)
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │             Serveur Backend Express (server.ts)              │
 │                     Port 3000 / Proxy API                    │
 └──────────────────────────────┬───────────────────────────────┘
                                │ (SDK Google Gen AI @google/genai)
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │              Google Gemini 2.5 Flash Model AI                │
 └──────────────────────────────────────────────────────────────┘
```

---

### 2. Arborescence du Code & Micro-Composants

```
simuemploi-ai/
├── server.ts                    # Serveur Express Node.js & Proxy API Gemini
├── index.html                   # Point d'entrée HTML5
├── package.json                 # Gestionnaire de dépendances et scripts
├── metadata.json                # Métadonnées de l'application & permissions iframe
├── vite.config.ts               # Configuration Vite & Tailwind CSS v4
├── src/
│   ├── main.tsx                 # Rendu React DOM Root
│   ├── App.tsx                  # Composant Racine & Gestionnaire de Navigation Top-Level
│   ├── index.css                # Styles globaux, utilitaires Tailwind & animations CSS
│   ├── types.ts                 # Interfaces TypeScript globales & modèles de données
│   ├── data/
│   │   ├── presetScenarios.ts   # Scénarios pré-configurés (Tech, Business, Concours)
│   │   └── starExamples.ts      # Données d'exemples de la méthode STAR
│   ├── services/
│   │   └── geminiService.ts     # Service client d'appel aux endpoints API Gemini
│   └── components/
│       ├── Navbar.tsx           # Barre de navigation principale & sélecteur d'onglets
│       ├── SetupScreen.tsx      # Formulaire complet de configuration de simulation (Grid 12-cols)
│       ├── InterviewRoom.tsx    # Studio principal de passage d'oral avec vidéo, audio & IA
│       ├── InterviewReportView.tsx # Rapport d'évaluation complet post-entretien
│       ├── ScenarioLibrary.tsx  # Galerie de scénarios prêts à l'emploi
│       ├── StarMethodGuide.tsx  # Guide interactif et tutoriel de la méthode STAR
│       ├── HistoryDashboard.tsx # Tableau de bord d'historique et de progression (Recharts)
│       ├── FeedbackSection.tsx  # Formulaire d'évaluation & avis utilisateur
│       └── BodyLanguageTooltipModal.tsx # Modale d'explication des indicateurs corporels
```

---

### 3. Pipeline Vision, Audio & Intelligence Artificielle

#### A. Analyse Visual/Posture (Vision Pipeline)
1. Acquisition du flux vidéo via `navigator.mediaDevices.getUserMedia({ video: true })`.
2. Capture de frames régulières sur un `HTMLCanvasElement` hors écran.
3. Calcul des indices de contraste et de centrage de la masse faciale pour estimer la stabilité de la posture et le maintien du regard face caméra.

#### B. Traitement Vocal & Audio (Audio Pipeline)
1. Capture du microphone via `SpeechRecognition` (Web Speech API).
2. Traitement temps réel du flux textuel retranscrit :
   * **Regex de détection de tics :** `/\b(euh|du coup|en fait|voilà|genre|ben|truc)\b/gi`
   * **Calculateur MPM (Mots Par Minute) :** `(mots_saisis / secondes_ecoulees) * 60`
3. Restitution vocale de l'avatar IA via `window.speechSynthesis` (SpeechSynthesisUtterance) en français/anglais.

#### C. Intégration Gemini AI (Server-Side)
1. Le client transmet le contexte de l'entretien (Poste, Stack technique, Difficulté, Historique des réponses).
2. Le serveur `server.ts` instancie le SDK `@google/genai` avec la clé `GEMINI_API_KEY`.
3. Le modèle `gemini-2.5-flash` génère une réponse JSON structurée contenant :
   * La question suivante adaptée à la prestation précédente.
   * La critique comportementale et technique en temps réel.
   * L'évaluation globale finale lorsque toutes les questions sont épuisées.

---

### 4. Modèle de Données TypeScript

Les types fondamentaux définis dans `/src/types.ts` :

```typescript
export type SimulationCategory = 
  | 'recrutement_job'
  | 'examen_concours'
  | 'pitch_keynote'
  | 'competition_hackathon'
  | 'soutenance_devoir'
  | 'activite_pratique';

export interface InterviewConfig {
  id: string;
  category: SimulationCategory;
  sector: string;
  role: string;
  techStack: string[];
  difficulty: 'débutant' | 'intermédiaire' | 'senior' | 'expert';
  totalQuestions: number;
  language: string;
  enableSpeechSynthesis: boolean;
  timestamp: number;
}

export interface QuestionAnswer {
  questionIndex: number;
  questionText: string;
  userAnswer: string;
  timeTakenSeconds: number;
  fillerWordsCount: number;
  wordsPerMinute: number;
  eyeContactScore: number;
  idealAnswer: string;
  feedbackTechnical: string;
  feedbackClarity: string;
  score: number;
}

export interface EvaluationReport {
  config: InterviewConfig;
  overallScore: number; // Sur 100
  scoreTechnical: number;
  scoreClarity: number;
  scorePosture: number;
  scoreTone: number;
  summaryFeedback: string;
  strongPoints: string[];
  areasForImprovement: string[];
  qaList: QuestionAnswer[];
  completedAt: number;
}
```

---

### 5. Stack Technologique Complexe

* **Frontend Framework :** React 18 avec TypeScript & Vite.
* **Styling & UI :** Tailwind CSS v4 (utilitaires natifs responsive), Lucide React (Icônes vectorielles).
* **Animations :** Motion / Framer Motion & CSS keyframes.
* **Graphiques & Data Viz :** Recharts (Visualisation des métriques d'historique).
* **Serveur Backend :** Node.js avec Express, tsx (dev) et esbuild (bundle CJS production).
* **Moteur d'IA :** `@google/genai` avec le modèle `gemini-2.5-flash`.
* **APIs Web Négociées :** MediaDevices (Caméra/Microphone), Web Speech Recognition & Speech Synthesis.

---

## 🚀 Guide de Démarrage & Déploiement

### Prérequis
* Node.js version 18+ ou supérieure.
* Clé d'API Google Gemini (`GEMINI_API_KEY`).

### Installation
```bash
# 1. Cloner le dépôt et installer les dépendances
npm install

# 2. Définir la variable d'environnement dans un fichier .env
echo "GEMINI_API_KEY=votre_cle_api_gemini" > .env

# 3. Lancer le serveur de développement fullstack
npm run dev
```

L'application s'exécute sur `http://localhost:3000`.

### Compilation pour la Production
```bash
npm run build
npm start
```

---

*© SimuEmploi AI — Développé avec excellence pour l'entraînement aux épreuves orales.*
