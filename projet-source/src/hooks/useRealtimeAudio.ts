import { useState, useEffect, useRef, useCallback } from "react";
import { LiveAudioMetrics } from "../types";

const FRENCH_FILLER_WORDS = ["euh", "heu", "donc", "en fait", "genre", "du coup", "voilà", "basiquement", "littéralement"];

export function useRealtimeAudio() {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [isMicAvailable, setIsMicAvailable] = useState<boolean>(true);
  const [micError, setMicError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<LiveAudioMetrics>({
    wpm: 130,
    volumeLevel: 0,
    pitchStability: 85,
    pauseDurationAvg: 1.0,
    fillerWordsCount: 0,
    confidenceScore: 85,
  });

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const wordTimestampsRef = useRef<{ word: string; timestamp: number }[]>([]);
  const detectedFillersRef = useRef<number>(0);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Web Speech API not supported in this browser.");
      setIsMicAvailable(false);
      setMicError("La reconnaissance vocale Web Speech n'est pas supportée par ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fr-FR";

    recognition.onresult = (event: any) => {
      let finalStr = "";
      let interimStr = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalStr += transcriptChunk + " ";
          
          // Count fillers
          const lowerChunk = transcriptChunk.toLowerCase();
          FRENCH_FILLER_WORDS.forEach((filler) => {
            const regex = new RegExp(`\\b${filler}\\b`, "gi");
            const matches = lowerChunk.match(regex);
            if (matches) {
              detectedFillersRef.current += matches.length;
            }
          });

          // Calculate WPM
          const words = transcriptChunk.trim().split(/\s+/);
          const now = Date.now();
          words.forEach((w: string) => {
            wordTimestampsRef.current.push({ word: w, timestamp: now });
          });
        } else {
          interimStr += transcriptChunk;
        }
      }

      if (finalStr) {
        setTranscript((prev) => (prev + " " + finalStr).trim());
      }
      setInterimTranscript(interimStr);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") return;
      setMicError(`Erreur micro: ${event.error}`);
    };

    recognition.onend = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch (e) {
          // ignore restart error
        }
      }
    };

    recognitionRef.current = recognition;
  }, [isListening]);

  // Audio volume analyzer
  const startAudioAnalyzer = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioStats = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute RMS volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avgVol = Math.min(100, Math.round((sum / dataArray.length / 128) * 100));

        // Filter timestamps older than 60s for WPM
        const now = Date.now();
        wordTimestampsRef.current = wordTimestampsRef.current.filter(
          (item) => now - item.timestamp < 60000
        );
        const currentWpm = Math.max(90, Math.min(190, wordTimestampsRef.current.length * (60000 / Math.max(1, now - (wordTimestampsRef.current[0]?.timestamp || now - 60000)))));

        // Pitch stability estimate based on volume variance
        const pitchStability = Math.max(65, Math.min(98, 90 - Math.abs(avgVol - 45) * 0.4));
        const confidenceScore = Math.max(50, Math.min(98, Math.round((pitchStability * 0.5) + (currentWpm >= 120 && currentWpm <= 160 ? 45 : 30))));

        setMetrics({
          wpm: Math.round(currentWpm),
          volumeLevel: avgVol,
          pitchStability: Math.round(pitchStability),
          pauseDurationAvg: avgVol < 10 ? 1.8 : 0.8,
          fillerWordsCount: detectedFillersRef.current,
          confidenceScore: Math.round(confidenceScore),
        });

        animationFrameRef.current = requestAnimationFrame(updateAudioStats);
      };

      updateAudioStats();
    } catch (err: any) {
      console.error("Mic access failed:", err);
      setIsMicAvailable(false);
      setMicError("Accès au microphone refusé ou non disponible.");
    }
  }, []);

  const startListening = useCallback(() => {
    setIsListening(true);
    detectedFillersRef.current = 0;
    wordTimestampsRef.current = [];
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // already started
      }
    }
    startAudioAnalyzer();
  }, [startAudioAnalyzer]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    detectedFillersRef.current = 0;
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    metrics,
    isMicAvailable,
    micError,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  };
}
