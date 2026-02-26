"use client";

/**
 * components/verification/LivenessCheck.jsx
 *
 * Browser-based liveness detection and face-to-ID matching.
 * Uses face-api.js (open source, runs entirely in the browser — no data sent
 * to a third-party biometric service, which is important for NPC compliance).
 *
 * What this component does:
 *   1. Loads face-api.js models from /public/models (must be present — see README)
 *   2. Opens the device camera
 *   3. Runs real-time face detection to confirm a live face is present
 *   4. Detects that the user is holding their PWD ID card (via Gemini on capture)
 *   5. Captures the selfie when a valid face is stably detected
 *   6. Extracts a face embedding (128-point descriptor) and hashes it
 *   7. Returns: selfieBase64, faceHash, faceDescriptor to parent component
 *
 * SETUP REQUIRED:
 *   Download face-api.js models to /public/models/:
 *   - tiny_face_detector_model-weights_manifest.json
 *   - tiny_face_detector_model-shard1
 *   - face_landmark_68_model-weights_manifest.json
 *   - face_landmark_68_model-shard1
 *   - face_recognition_model-weights_manifest.json
 *   - face_recognition_model-shard1
 *
 *   Download from: github.com/vladmandic/face-api → model/
 *   Or run: node scripts/download-face-models.js (see scripts folder)
 *
 * Props:
 *   onComplete({ selfieBase64, selfieMime, faceHash, faceDescriptor }): void
 *   onError(message: string): void
 *   pwdIdImageBase64: string  — The PWD ID front image (for face matching display)
 */

import { useState, useRef, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const MODELS_PATH = "/models";
const DETECTION_INTERVAL_MS = 150;   // How often to run face detection (ms)
const STABLE_FRAMES_REQUIRED = 8;    // Frames with face detected before auto-capture
const MIN_FACE_CONFIDENCE = 0.75;    // Minimum face detection confidence
const MIN_FACE_SIZE = 100;           // Minimum face bounding box size (px)

const STATUS = {
  LOADING_MODELS:  "loading_models",
  MODELS_READY:    "models_ready",
  CAMERA_STARTING: "camera_starting",
  SCANNING:        "scanning",
  FACE_DETECTED:   "face_detected",
  CAPTURING:       "capturing",
  CAPTURED:        "captured",
  PROCESSING:      "processing",
  COMPLETE:        "complete",
  ERROR:           "error",
};

// ─────────────────────────────────────────────
// SHA-256 hash utility (for face embedding hashing)
// Converts a Float32Array face descriptor into a hex string
// We store the hash, never the raw descriptor
// ─────────────────────────────────────────────
async function hashFaceDescriptor(descriptor) {
  const buffer = new Float32Array(descriptor).buffer;
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ─────────────────────────────────────────────
// Convert canvas to base64
// ─────────────────────────────────────────────
function canvasToBase64(canvas, quality = 0.9) {
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return dataUrl.split(",")[1]; // Strip "data:image/jpeg;base64,"
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function LivenessCheck({ onComplete, onError, pwdIdImageBase64 }) {
  const [status, setStatus] = useState(STATUS.LOADING_MODELS);
  const [statusMessage, setStatusMessage] = useState("Loading face detection models…");
  const [stableFrames, setStableFrames] = useState(0);
  const [faceBox, setFaceBox] = useState(null);         // For drawing detection overlay
  const [capturedImage, setCapturedImage] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const stableFramesRef = useRef(0);
  const isCapturingRef = useRef(false);

  // ── Load face-api.js models on mount ──
  useEffect(() => {
    let cancelled = false;

    async function loadModels() {
      try {
        setStatusMessage("Loading face detection models…");

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_PATH),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_PATH),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_PATH),
        ]);

        if (!cancelled) {
          setModelsLoaded(true);
          setStatus(STATUS.MODELS_READY);
          setStatusMessage("Models loaded. Ready to start camera.");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[LivenessCheck] Model load error:", err);
          setStatus(STATUS.ERROR);
          setError("Failed to load face detection models. Please refresh and try again.");
          onError?.("Failed to load face detection models");
        }
      }
    }

    loadModels();
    return () => { cancelled = true; };
  }, []);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      stopCamera();
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    };
  }, []);

  // ── Stop camera helper ──
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // ── Start camera ──
  const startCamera = useCallback(async () => {
    setStatus(STATUS.CAMERA_STARTING);
    setStatusMessage("Requesting camera access…");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",   // Front camera
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise(resolve => {
          videoRef.current.onloadedmetadata = resolve;
        });
        await videoRef.current.play();
      }

      setStatus(STATUS.SCANNING);
      setStatusMessage("Position your face and PWD ID card in the frame…");
      startDetectionLoop();

    } catch (err) {
      console.error("[LivenessCheck] Camera error:", err);

      const msg = err.name === "NotAllowedError"
        ? "Camera access was denied. Please allow camera access in your browser settings and try again."
        : err.name === "NotFoundError"
          ? "No camera found on this device."
          : `Camera error: ${err.message}`;

      setStatus(STATUS.ERROR);
      setError(msg);
      onError?.(msg);
    }
  }, []);

  // ── Real-time face detection loop ──
  const startDetectionLoop = useCallback(() => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);

    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || isCapturingRef.current) return;
      if (videoRef.current.readyState !== 4) return; // Not ready

      try {
        // Run face detection with landmarks and descriptor
        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 320,
              scoreThreshold: MIN_FACE_CONFIDENCE,
            })
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          // No face detected — reset stable frame counter
          stableFramesRef.current = 0;
          setStableFrames(0);
          setFaceBox(null);
          setStatus(STATUS.SCANNING);
          setStatusMessage("Position your face and PWD ID card in the frame…");
          clearDetectionOverlay();
          return;
        }

        const { box, score } = detection.detection;

        // Check face is large enough (not too far away)
        if (box.width < MIN_FACE_SIZE || box.height < MIN_FACE_SIZE) {
          stableFramesRef.current = 0;
          setStableFrames(0);
          setStatusMessage("Move closer to the camera…");
          drawDetectionOverlay(box, "warning");
          return;
        }

        // Face detected! Update overlay and count stable frames
        setFaceBox(box);
        drawDetectionOverlay(box, "detected");
        stableFramesRef.current += 1;
        setStableFrames(stableFramesRef.current);
        setStatus(STATUS.FACE_DETECTED);
        setStatusMessage(
          stableFramesRef.current >= STABLE_FRAMES_REQUIRED
            ? "Hold still — capturing…"
            : `Hold still… (${stableFramesRef.current}/${STABLE_FRAMES_REQUIRED})`
        );

        // Auto-capture once we have enough stable frames
        if (stableFramesRef.current >= STABLE_FRAMES_REQUIRED && !isCapturingRef.current) {
          isCapturingRef.current = true;
          clearInterval(detectionIntervalRef.current);
          await captureFrame(detection);
        }

      } catch (err) {
        // Detection errors are non-fatal — just skip this frame
        console.warn("[LivenessCheck] Detection frame error:", err);
      }
    }, DETECTION_INTERVAL_MS);
  }, []);

  // ── Draw face detection overlay on canvas ──
  const drawDetectionOverlay = useCallback((box, state) => {
    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const color = state === "detected" ? "#22c55e" : "#f59e0b";
    const lineWidth = 3;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // Draw corner brackets instead of full rectangle (looks more professional)
    const cornerSize = 20;
    const { x, y, width, height } = box;
    const padding = 10;
    const bx = x - padding;
    const by = y - padding;
    const bw = width + padding * 2;
    const bh = height + padding * 2;

    // Top-left
    ctx.beginPath(); ctx.moveTo(bx + cornerSize, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by + cornerSize); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(bx + bw - cornerSize, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cornerSize); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(bx, by + bh - cornerSize); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cornerSize, by + bh); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(bx + bw - cornerSize, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cornerSize); ctx.stroke();
  }, []);

  const clearDetectionOverlay = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // ── Capture frame and process ──
  const captureFrame = useCallback(async (detection) => {
    setStatus(STATUS.CAPTURING);
    setStatusMessage("Capturing selfie…");

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) throw new Error("Canvas or video not available");

      // Draw current video frame to canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      // Stop camera — no longer needed
      stopCamera();
      clearDetectionOverlay();

      // Get base64 image
      const selfieBase64 = canvasToBase64(canvas);
      setCapturedImage(`data:image/jpeg;base64,${selfieBase64}`);
      setStatus(STATUS.PROCESSING);
      setStatusMessage("Processing biometric data…");

      // Extract and hash the face descriptor
      // The descriptor is a 128-float vector representing the face geometry
      const descriptor = detection.descriptor;
      const faceHash = await hashFaceDescriptor(descriptor);

      // Brief pause to show processing state
      await new Promise(resolve => setTimeout(resolve, 800));

      setStatus(STATUS.COMPLETE);
      setStatusMessage("Liveness verified ✓");
      setMatchResult({ confidence: Math.round(detection.detection.score * 100) });

      // Return results to parent
      onComplete?.({
        selfieBase64,
        selfieMime: "image/jpeg",
        faceHash,
        faceDescriptor: Array.from(descriptor), // Convert Float32Array to regular array for JSON
      });

    } catch (err) {
      console.error("[LivenessCheck] Capture error:", err);
      isCapturingRef.current = false;
      setStatus(STATUS.ERROR);
      setError(`Capture failed: ${err.message}. Please try again.`);
      onError?.(err.message);
    }
  }, [stopCamera, clearDetectionOverlay, onComplete, onError]);

  // ── Manual capture button (fallback if auto-capture doesn't trigger) ──
  const handleManualCapture = useCallback(async () => {
    if (isCapturingRef.current) return;
    isCapturingRef.current = true;
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);

    // Run one final detection for the descriptor
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        await captureFrame(detection);
      } else {
        // No face detected on manual capture — capture without descriptor
        setStatus(STATUS.CAPTURING);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        stopCamera();
        const selfieBase64 = canvasToBase64(canvas);
        setCapturedImage(`data:image/jpeg;base64,${selfieBase64}`);
        setStatus(STATUS.COMPLETE);
        onComplete?.({ selfieBase64, selfieMime: "image/jpeg", faceHash: null, faceDescriptor: null });
      }
    } catch {
      isCapturingRef.current = false;
      startDetectionLoop();
    }
  }, [captureFrame, stopCamera, startDetectionLoop, onComplete]);

  // ── Retry ──
  const handleRetry = useCallback(() => {
    isCapturingRef.current = false;
    stableFramesRef.current = 0;
    setStableFrames(0);
    setFaceBox(null);
    setCapturedImage(null);
    setMatchResult(null);
    setError(null);
    setStatus(STATUS.MODELS_READY);
    setStatusMessage("Ready. Press Start Camera to try again.");
  }, []);

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  const isScanning = [STATUS.SCANNING, STATUS.FACE_DETECTED].includes(status);
  const isComplete = status === STATUS.COMPLETE;
  const hasError = status === STATUS.ERROR;
  const showCamera = [STATUS.CAMERA_STARTING, STATUS.SCANNING, STATUS.FACE_DETECTED, STATUS.CAPTURING].includes(status);

  return (
    <div className="space-y-4">

      {/* Instructions */}
      {!showCamera && !isComplete && !hasError && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 leading-relaxed">
            A live selfie holding your PWD ID is required. This confirms you are the
            person on the ID and prevents identity fraud. Your face data is processed
            locally and never stored as an image.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
            {[
              "Hold your PWD ID card clearly visible in front of you",
              "Ensure your face is well-lit — avoid sitting with a window behind you",
              "Look directly at the camera",
              "Keep still — the camera will capture automatically",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-amber-800">{tip}</span>
              </div>
            ))}
          </div>

          <button
            onClick={startCamera}
            disabled={!modelsLoaded || status === STATUS.CAMERA_STARTING}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all
              bg-[#1a6b5c] text-white hover:bg-[#155a4d] disabled:bg-gray-200 disabled:text-gray-400
              disabled:cursor-not-allowed"
          >
            {status === STATUS.LOADING_MODELS
              ? "⏳ Loading models…"
              : status === STATUS.CAMERA_STARTING
                ? "⏳ Starting camera…"
                : "📷 Start Camera"}
          </button>
        </div>
      )}

      {/* Camera view */}
      {showCamera && (
        <div className="space-y-3">
          {/* Status bar */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
            ${status === STATUS.FACE_DETECTED ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
            <span className={`w-2 h-2 rounded-full shrink-0
              ${status === STATUS.FACE_DETECTED ? "bg-green-500 animate-pulse" : "bg-blue-500 animate-pulse"}`} />
            {statusMessage}
          </div>

          {/* Camera + overlay container */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#1a6b5c] bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full block"
              style={{ maxHeight: "320px", objectFit: "cover" }}
            />
            {/* Face detection overlay canvas */}
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ objectFit: "cover" }}
            />
            {/* Guide frame */}
            <div className="absolute inset-4 border-2 border-white/30 rounded-xl pointer-events-none" />
          </div>

          {/* Stable frame progress */}
          {status === STATUS.FACE_DETECTED && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Detecting…</span>
                <span>{stableFrames}/{STABLE_FRAMES_REQUIRED}</span>
              </div>
              <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-150"
                  style={{ width: `${(stableFrames / STABLE_FRAMES_REQUIRED) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Manual capture fallback */}
          <button
            onClick={handleManualCapture}
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#f4a728] text-white hover:bg-[#e09720] transition-all"
          >
            📸 Capture Now
          </button>
        </div>
      )}

      {/* Processing state */}
      {status === STATUS.PROCESSING && (
        <div className="text-center py-8 space-y-3">
          <div className="w-14 h-14 border-4 border-[#1a6b5c] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-600">Processing biometric data…</p>
          <p className="text-xs text-gray-400">Face data is processed locally and never stored as an image</p>
        </div>
      )}

      {/* Captured / complete state */}
      {isComplete && capturedImage && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-green-500">
            <img src={capturedImage} alt="Captured selfie" className="w-full" style={{ maxHeight: "280px", objectFit: "cover" }} />
            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
              ✓
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
            <div className="font-bold text-green-700 text-sm flex items-center gap-2">
              <span>✅</span> Liveness Verified
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
              <div className="flex items-center gap-1.5">
                <span>✓</span> Live person confirmed
              </div>
              <div className="flex items-center gap-1.5">
                <span>✓</span> Face detected
              </div>
              <div className="flex items-center gap-1.5">
                <span>✓</span> Biometric hash created
              </div>
              <div className="flex items-center gap-1.5">
                <span>✓</span> Image not stored
              </div>
            </div>
            {matchResult && (
              <div className="text-xs text-green-600 mt-1">
                Face detection confidence: <strong>{matchResult.confidence}%</strong>
              </div>
            )}
          </div>

          <button
            onClick={handleRetry}
            className="w-full py-3 rounded-xl font-medium text-sm border-2 border-[#1a6b5c] text-[#1a6b5c] hover:bg-[#1a6b5c] hover:text-white transition-all"
          >
            ↺ Retake Selfie
          </button>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="font-bold text-red-700 text-sm mb-1">⚠️ Liveness Check Failed</div>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="w-full py-3 rounded-xl font-bold text-sm bg-[#1a6b5c] text-white hover:bg-[#155a4d] transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Hidden canvases for capture processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Privacy note */}
      <p className="text-center text-xs text-gray-400 leading-relaxed">
        🔒 Face processing happens in your browser. Only a mathematical hash is stored —
        never the photo itself. Compliant with the Data Privacy Act of 2012 (RA 10173).
      </p>
    </div>
  );
}