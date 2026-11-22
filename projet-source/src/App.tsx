/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { SetupScreen } from "./components/SetupScreen";
import { InterviewRoom } from "./components/InterviewRoom";
import { InterviewReportView } from "./components/InterviewReportView";
import { HistoryDashboard } from "./components/HistoryDashboard";
import { ScenarioLibrary } from "./components/ScenarioLibrary";
import { StarMethodGuide } from "./components/StarMethodGuide";
import { FeedbackSection } from "./components/FeedbackSection";
import { INITIAL_SAVED_SESSIONS } from "./data/sectorsAndScenarios";
import { SavedInterviewSession, PrebuiltScenario } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "setup" | "scenarios" | "history" | "star_guide" | "feedback" | "interview" | "report"
  >("setup");

  // Saved sessions local state
  const [savedSessions, setSavedSessions] = useState<SavedInterviewSession[]>(() => {
    try {
      const stored = localStorage.getItem("simuemploi_sessions");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load local sessions:", e);
    }
    return INITIAL_SAVED_SESSIONS;
  });

  const [activeConfig, setActiveConfig] = useState<any>(null);
  const [selectedReportSession, setSelectedReportSession] = useState<SavedInterviewSession | null>(null);
  const [preselectedScenario, setPreselectedScenario] = useState<PrebuiltScenario | null>(null);

  // Sync saved sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("simuemploi_sessions", JSON.stringify(savedSessions));
    } catch (e) {
      console.error("Failed to save sessions:", e);
    }
  }, [savedSessions]);

  // Handle start from setup
  const handleStartInterview = (config: any) => {
    setActiveConfig(config);
    setActiveTab("interview");
  };

  // Handle select scenario from library
  const handleSelectScenario = (scenario: PrebuiltScenario) => {
    setPreselectedScenario(scenario);
    setActiveTab("setup");
  };

  // Handle completed interview
  const handleFinishInterview = (session: SavedInterviewSession) => {
    setSavedSessions((prev) => [session, ...prev]);
    setSelectedReportSession(session);
    setActiveTab("report");
  };

  // Handle select session from history
  const handleSelectHistorySession = (session: SavedInterviewSession) => {
    setSelectedReportSession(session);
    setActiveTab("report");
  };

  const handleClearHistory = () => {
    if (window.confirm("Voulez-vous vraiment effacer tout l'historique d'entretiens ?")) {
      setSavedSessions([]);
      localStorage.removeItem("simuemploi_sessions");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between w-full overflow-x-hidden">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === "setup") setPreselectedScenario(null);
            setActiveTab(tab);
          }}
          savedSessionsCount={savedSessions.length}
        />

        <main className="pb-16 sm:pb-12 px-2 sm:px-4 lg:px-6 max-w-[1600px] mx-auto w-full">
          {activeTab === "setup" && (
            <SetupScreen
              onStartInterview={handleStartInterview}
              preselectedScenario={preselectedScenario}
            />
          )}

          {activeTab === "interview" && activeConfig && (
            <InterviewRoom
              config={activeConfig}
              onFinishInterview={handleFinishInterview}
            />
          )}

          {activeTab === "report" && selectedReportSession && (
            <InterviewReportView
              session={selectedReportSession}
              onRestart={() => setActiveTab("setup")}
              onViewHistory={() => setActiveTab("history")}
            />
          )}

          {activeTab === "history" && (
            <HistoryDashboard
              sessions={savedSessions}
              onSelectSession={handleSelectHistorySession}
              onClearHistory={handleClearHistory}
              onStartNew={() => setActiveTab("setup")}
            />
          )}

          {activeTab === "scenarios" && (
            <ScenarioLibrary onSelectScenario={handleSelectScenario} />
          )}

          {activeTab === "star_guide" && <StarMethodGuide />}

          {activeTab === "feedback" && <FeedbackSection />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SimuEmploi AI</span>
            <span>— Plateforme de Coaching d'Entretien IA</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <button
              onClick={() => setActiveTab("feedback")}
              className="text-slate-400 hover:text-slate-200 underline font-medium cursor-pointer flex items-center gap-1"
            >
              <span>Poster une suggestion / remarque</span>
            </button>
            <span>•</span>
            <span>Propulsé par Gemini 3.6 Flash</span>
            <span>•</span>
            <span>Analyse Vocale & Corporelle Live</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
