import { useState, useEffect, useRef, useCallback } from "react";
import { LiveVideoMetrics } from "../types";

export function useRealtimeVideo() {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [metrics, setMetrics] = useState<LiveVideoMetrics>({
    eyeContactScore: 92,
    postureQuality: "Posture droite & ouverte",
    facialExpression: "Attentif & Confiant",
    perceivedConfidence: 88,
    headMovementStability: 90,
    realtimeTip: "Contact visuel optimal. Gardez les épaules détendues.",
  });

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setCameraError(null);
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setIsCameraActive(false);
      setCameraError("Impossible d'accéder à la caméra. Vérifiez les autorisations.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Capture frame as base64 JPEG
  const captureFrameBase64 = useCallback((): string | null => {
    if (!videoRef.current || !isCameraActive) return null;
    const video = videoRef.current;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  }, [isCameraActive]);

  // Periodic video posture simulation/gemini sync
  useEffect(() => {
    if (!isCameraActive) return;

    const interval = setInterval(() => {
      // Simulate slight dynamic video metric fluctuations
      const baseEye = 88 + Math.round((Math.random() - 0.5) * 8);
      const baseConf = 85 + Math.round((Math.random() - 0.5) * 6);
      
      const tips = [
        "Contact visuel optimal avec la caméra.",
        "Gardez le menton relevé et le regard fixe vers l'objectif.",
        "Sourire accueillant détecté, excellent engagement.",
        "Posture droite et bien centrée dans le cadre."
      ];

      setMetrics({
        eyeContactScore: Math.min(99, Math.max(70, baseEye)),
        postureQuality: "Posture droite & ouverte",
        facialExpression: "Engagé & Attentif",
        perceivedConfidence: Math.min(99, Math.max(70, baseConf)),
        headMovementStability: 92,
        realtimeTip: tips[Math.floor(Math.random() * tips.length)],
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isCameraActive]);

  return {
    isCameraActive,
    cameraError,
    videoRef,
    metrics,
    setMetrics,
    startCamera,
    stopCamera,
    captureFrameBase64,
    stream: streamRef.current
  };
}
