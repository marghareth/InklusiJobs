"use client";

/**
 * components/verification/LivenessCheck.jsx
 * No face-api.js needed — uses browser camera directly.
 * Selfie is sent to Gemini server-side for face matching.
 */

import { useState, useRef, useCallback } from "react";

export default function LivenessCheck({ onCapture, onSkip }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [phase, setPhase]             = useState("idle");
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError]             = useState(null);
  const [countdown, setCountdown]     = useState(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase("camera");
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Camera permission denied. Please allow camera access in your browser settings.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError(`Camera error: ${err.message}`);
      }
      setPhase("error");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const base64  = dataUrl.split(",")[1];

    setCapturedImage(dataUrl);
    stopCamera();
    setPhase("captured");
    onCapture?.(base64, "image/jpeg");
  }, [stopCamera, onCapture]);

  const startCountdown = useCallback(() => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(interval);
        setCountdown(null);
        capturePhoto();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [capturePhoto]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setPhase("idle");
    onCapture?.(null, null);
  }, [onCapture]);

  return (
    <div className="space-y-4">

      {phase === "idle" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          {[
            "Hold your PWD ID card clearly visible in front of you",
            "Ensure your face is well-lit",
            "Look directly at the camera",
            "Click Capture or use the 3-second timer",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#f4a728] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-amber-800">{tip}</span>
            </div>
          ))}
        </div>
      )}

      <div className={`relative bg-gray-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center ${phase === "captured" ? "hidden" : ""}`}>
        {phase === "idle" && (
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm">Camera preview will appear here</div>
          </div>
        )}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${phase !== "camera" ? "hidden" : ""}`}
          style={{ transform: "scaleX(-1)" }}
          playsInline
          muted
        />
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-white text-8xl font-extrabold animate-pulse">{countdown}</div>
          </div>
        )}
        {phase === "camera" && countdown === null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-56 border-4 border-white/60 rounded-full" />
          </div>
        )}
      </div>

      {phase === "captured" && capturedImage && (
        <div className="relative rounded-2xl overflow-hidden aspect-video">
          <img src={capturedImage} alt="Captured selfie" className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            ✓ Captured
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="space-y-2">
        {phase === "idle" && (
          <button onClick={startCamera} className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#1a6b5c] text-white hover:bg-[#155a4d] transition-all">
            📷 Start Camera
          </button>
        )}

        {phase === "camera" && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={startCountdown}
              disabled={countdown !== null}
              className="py-3.5 rounded-xl font-bold text-sm bg-[#f4a728] text-white hover:bg-[#e09620] disabled:opacity-50 transition-all"
            >
              {countdown !== null ? `${countdown}…` : "⏱ Timer (3s)"}
            </button>
            <button
              onClick={capturePhoto}
              disabled={countdown !== null}
              className="py-3.5 rounded-xl font-bold text-sm bg-[#1a6b5c] text-white hover:bg-[#155a4d] disabled:opacity-50 transition-all"
            >
              📸 Capture Now
            </button>
          </div>
        )}

        {phase === "captured" && (
          <div className="grid grid-cols-2 gap-2">
            <button onClick={retake} className="py-3.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-all">
              🔄 Retake
            </button>
            <button
              onClick={() => onCapture?.(capturedImage.split(",")[1], "image/jpeg")}
              className="py-3.5 rounded-xl font-bold text-sm bg-[#1a6b5c] text-white hover:bg-[#155a4d] transition-all"
            >
              ✓ Use This Photo
            </button>
          </div>
        )}

        {onSkip && (
          <button onClick={onSkip} className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-all">
            Skip liveness check (testing only)
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <div className="text-sm text-red-600">⚠️ {error}</div>
          <button onClick={() => { setError(null); setPhase("idle"); }} className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#1a6b5c] text-white">
            Try Again
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        🔒 Your selfie is sent to Gemini Vision for face matching only. Not stored after verification. Compliant with RA 10173.
      </p>
    </div>
  );
}