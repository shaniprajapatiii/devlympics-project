'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GazeCoords, CalibrationMatrix, GestureType, GestureDiagnostics } from '@/lib/types';
import { IrisGazeEngine } from '@/lib/vision/irisTracker';
import { CalibrationManager } from '@/lib/vision/calibration';
import { GestureEngine } from '@/lib/vision/gestureTracker';
import CalibrationModal from './CalibrationModal';
import {
  Camera,
  Eye,
  Sliders,
  AlertCircle,
  RefreshCw,
  MousePointer,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Smile,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface Props {
  onGazeUpdate: (coords: GazeCoords, quadrant: 0 | 1 | 2 | 3 | null) => void;
  onProlongedBlink?: () => void;
  onGesture?: (gesture: GestureType) => void;
  onRawGazeSample?: (raw: { x: number; y: number }) => void;
  isSimulatingMouse?: boolean;
  onToggleMouseSimulation?: () => void;
  externalCalibrationTrigger?: boolean;
  onCalibrationComplete?: (matrix: CalibrationMatrix) => void;
}

export default function EyeTracker({
  onGazeUpdate,
  onProlongedBlink,
  onGesture,
  onRawGazeSample,
  isSimulatingMouse = false,
  onToggleMouseSimulation,
  externalCalibrationTrigger,
  onCalibrationComplete,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<IrisGazeEngine>(new IrisGazeEngine());
  const gestureEngineRef = useRef<GestureEngine>(new GestureEngine());

  const [isLoading, setIsLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [currentEar, setCurrentEar] = useState(0.28);
  const [isBlinking, setIsBlinking] = useState(false);
  const [calibrationModalOpen, setCalibrationModalOpen] = useState(false);
  const [calibrationMatrix, setCalibrationMatrix] = useState<CalibrationMatrix | null>(null);
  const [rawGazeSample, setRawGazeSample] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [isCameraExpanded, setIsCameraExpanded] = useState(false);

  // Gesture Diagnostics state
  const [gesturesEnabled, setGesturesEnabled] = useState(true);
  const [gestureDiagnostics, setGestureDiagnostics] = useState<GestureDiagnostics>({
    headPitch: 0,
    headYaw: 0,
    browRatio: 1.0,
    isNodding: false,
    isShaking: false,
    isBrowRaised: false,
  });
  const [activeGestureToast, setActiveGestureToast] = useState<{
    type: GestureType;
    label: string;
    sublabel: string;
    color: string;
  } | null>(null);

  // Watch for external calibration open requests
  useEffect(() => {
    if (externalCalibrationTrigger) {
      setCalibrationModalOpen(true);
    }
  }, [externalCalibrationTrigger]);

  // Load saved calibration on mount
  useEffect(() => {
    const saved = CalibrationManager.loadSavedCalibration();
    if (saved) {
      setCalibrationMatrix(saved);
      engineRef.current.setCalibration(saved);
    }
  }, []);

  // Handle Mouse Simulation mode when active
  useEffect(() => {
    if (!isSimulatingMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Map screen coords to [-1, 1]
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;

      const quadrant = engineRef.current.getGazeQuadrant(nx, ny);
      const coords: GazeCoords = {
        x: nx,
        y: ny,
        rawLeftIris: { x: 0.5, y: 0.5 },
        rawRightIris: { x: 0.5, y: 0.5 },
        ear: 0.28,
        isBlinking: false,
        isProlongedBlink: false,
        confidence: 1.0,
      };

      onGazeUpdate(coords, quadrant);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isSimulatingMouse, onGazeUpdate]);

  // Initialize MediaPipe and Webcam
  useEffect(() => {
    let landmarker: any = null;
    let animFrameId: number;
    let stream: MediaStream | null = null;
    let frameCount = 0;
    let lastTime = performance.now();

    async function initVision() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const visionModule = await import('@mediapipe/tasks-vision');
        const { FaceLandmarker, FilesetResolver } = visionModule;

        const fileset = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
        );

        landmarker = await FaceLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          outputFaceBlendshapes: false,
          runningMode: 'VIDEO',
          numFaces: 1,
        });

        // Request webcam
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraActive(true);
          setIsLoading(false);
          startLoop();
        }
      } catch (err: any) {
        console.warn('Vision initialization note:', err.message);
        setErrorMessage(err.message || 'Webcam permission not granted or device offline.');
        setIsLoading(false);
      }
    }

    function startLoop() {
      function render() {
        if (!videoRef.current || !canvasRef.current || !landmarker) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.readyState >= 2 && ctx) {
          const now = performance.now();
          const results = landmarker.detectForVideo(video, now);

          // Calculate FPS
          frameCount++;
          if (now - lastTime >= 1000) {
            setFps(frameCount);
            frameCount = 0;
            lastTime = now;
          }

          // Clear Canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];

            // 1. Process Iris Gaze with engine
            const coords = engineRef.current.processFrame(landmarks);
            const quadrant = engineRef.current.getGazeQuadrant(coords.x, coords.y);

            setCurrentEar(coords.ear);
            setIsBlinking(coords.isBlinking);

            // Save raw sample for calibration
            const rawRatio = engineRef.current.extractRawIrisRatio(landmarks);
            setRawGazeSample(rawRatio);
            if (onRawGazeSample) {
              onRawGazeSample(rawRatio);
            }

            if (coords.isProlongedBlink && onProlongedBlink) {
              onProlongedBlink();
            }

            if (!isSimulatingMouse) {
              onGazeUpdate(coords, quadrant);
            }

            // 2. Process Multi-Modal Facial Gestures
            if (gesturesEnabled) {
              const diag = gestureEngineRef.current.processGestures(landmarks);
              setGestureDiagnostics(diag);

              if (diag.isBrowRaised) {
                setActiveGestureToast({
                  type: 'browRaise',
                  label: 'Brow Raise Detected',
                  sublabel: 'Reserving Meeting Floor Beacon',
                  color: 'border-white bg-neutral-900/95 text-white',
                });
                onGesture?.('browRaise');
                setTimeout(() => setActiveGestureToast(null), 1500);
              } else if (diag.isNodding) {
                setActiveGestureToast({
                  type: 'nod',
                  label: 'Head Nod Detected',
                  sublabel: 'Quick Affirmation Dispatched',
                  color: 'border-white bg-neutral-900/95 text-white',
                });
                onGesture?.('nod');
                setTimeout(() => setActiveGestureToast(null), 1500);
              } else if (diag.isShaking) {
                setActiveGestureToast({
                  type: 'shake',
                  label: 'Head Shake Detected',
                  sublabel: 'Soft Hold / Selection Aborted',
                  color: 'border-white bg-neutral-900/95 text-white',
                });
                onGesture?.('shake');
                setTimeout(() => setActiveGestureToast(null), 1500);
              }
            }

            // Draw eye mesh & irises on canvas
            drawEyeLandmarks(ctx, canvas, landmarks, coords);
          }
        }

        animFrameId = requestAnimationFrame(render);
      }

      animFrameId = requestAnimationFrame(render);
    }

    function drawEyeLandmarks(
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      landmarks: any[],
      coords: GazeCoords
    ) {
      const w = canvas.width;
      const h = canvas.height;

      // Draw Left Eye Contour
      const leftEyeIndices = [33, 160, 158, 133, 153, 144, 33];
      ctx.beginPath();
      ctx.strokeStyle = coords.isBlinking ? '#737373' : '#ffffff';
      ctx.lineWidth = 1.5;
      leftEyeIndices.forEach((idx, i) => {
        const pt = landmarks[idx];
        if (pt) {
          if (i === 0) ctx.moveTo(pt.x * w, pt.y * h);
          else ctx.lineTo(pt.x * w, pt.y * h);
        }
      });
      ctx.stroke();

      // Draw Right Eye Contour
      const rightEyeIndices = [362, 385, 387, 263, 373, 380, 362];
      ctx.beginPath();
      ctx.strokeStyle = coords.isBlinking ? '#737373' : '#ffffff';
      ctx.lineWidth = 1.5;
      rightEyeIndices.forEach((idx, i) => {
        const pt = landmarks[idx];
        if (pt) {
          if (i === 0) ctx.moveTo(pt.x * w, pt.y * h);
          else ctx.lineTo(pt.x * w, pt.y * h);
        }
      });
      ctx.stroke();

      // Draw Iris Centers (468, 473)
      const leftIris = landmarks[468];
      const rightIris = landmarks[473];

      if (leftIris && rightIris) {
        ctx.beginPath();
        ctx.arc(leftIris.x * w, leftIris.y * h, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rightIris.x * w, rightIris.y * h, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    }

    initVision();

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (landmarker) {
        landmarker.close();
      }
    };
  }, [isSimulatingMouse, onGazeUpdate, onProlongedBlink, onGesture, onRawGazeSample, gesturesEnabled]);

  const handleCalibrationComplete = useCallback(
    (matrix: CalibrationMatrix) => {
      setCalibrationMatrix(matrix);
      engineRef.current.setCalibration(matrix);
      if (onCalibrationComplete) {
        onCalibrationComplete(matrix);
      }
    },
    [onCalibrationComplete]
  );

  return (
    <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800/80 shadow-xl transition-all">
      {/* Sleek Top Bar with Mode Switchers */}
      <div className="p-3 bg-neutral-900/90 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Mode Selector Pill */}
          <div className="flex items-center gap-1 bg-black/60 border border-neutral-800 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => onToggleMouseSimulation && (isSimulatingMouse ? null : onToggleMouseSimulation())}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                isSimulatingMouse
                  ? 'bg-white text-black shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span>Cursor Gaze (Smooth Demo)</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleMouseSimulation && (!isSimulatingMouse ? null : onToggleMouseSimulation())}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                !isSimulatingMouse
                  ? 'bg-white text-black shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Webcam Iris Mesh (478)</span>
            </button>
          </div>
        </div>

        {/* Right Tools: Expand Camera, Gestures & Calibration */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setGesturesEnabled(!gesturesEnabled)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition flex items-center gap-1.5 ${
              gesturesEnabled
                ? 'bg-neutral-800 text-white border-neutral-700'
                : 'bg-black text-neutral-500 border-neutral-850'
            }`}
            title="Toggle nod/shake/brow gestures"
          >
            <Smile className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gestures</span>
          </button>

          <button
            type="button"
            onClick={() => setCalibrationModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 transition flex items-center gap-1.5 font-medium"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Calibrate</span>
          </button>

          {/* Camera Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsCameraExpanded(!isCameraExpanded)}
            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-white border border-neutral-700 transition flex items-center gap-1"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isCameraExpanded ? 'Hide Feed' : 'View Feed'}</span>
            {isCameraExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Mode 1: Cursor Mode Banner (Clean, Uncluttered, Zero Distraction) */}
      {isSimulatingMouse && !isCameraExpanded && (
        <div className="p-3 bg-black/40 border-b border-neutral-850 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong>Cursor Gaze Active:</strong> Move your mouse across the 4 quadrant cards below to dwell and trigger vocal synthesis.
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            Zero Fatigue Mode
          </span>
        </div>
      )}

      {/* Expandable Camera Video / Canvas Area */}
      {isCameraExpanded && (
        <div className="relative aspect-video max-h-56 w-full bg-black flex items-center justify-center overflow-hidden border-b border-neutral-800">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100 opacity-80"
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute inset-0 w-full h-full -scale-x-100 pointer-events-none"
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white gap-2 p-4 text-center">
              <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <p className="text-xs text-neutral-300">
                Initializing MediaPipe 478-Landmark GPU Landmarker...
              </p>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/95 text-white gap-2 p-4 text-center">
              <AlertCircle className="w-6 h-6 text-neutral-300" />
              <p className="text-xs font-semibold text-white">Webcam Signal Inactive</p>
              <p className="text-[11px] text-neutral-400 max-w-xs">{errorMessage}</p>
              <button
                type="button"
                onClick={() => onToggleMouseSimulation && !isSimulatingMouse && onToggleMouseSimulation()}
                className="mt-1 py-1 px-3 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200 transition"
              >
                Switch to Cursor Gaze Mode
              </button>
            </div>
          )}

          {/* Telemetry Overlays */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end pointer-events-none text-[10px] font-mono">
            <div className="bg-black/70 backdrop-blur-md border border-neutral-800 rounded px-2 py-0.5 text-neutral-300 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${cameraActive ? 'bg-emerald-400' : 'bg-neutral-500'}`} />
              {fps} FPS
            </div>
            <div className="bg-black/70 backdrop-blur-md border border-neutral-800 rounded px-2 py-0.5 text-neutral-300">
              EAR: {currentEar.toFixed(2)}
            </div>
          </div>

          {/* Active Gesture Trigger Toast */}
          {activeGestureToast && (
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 z-20 ${activeGestureToast.color}`}
            >
              <Sparkles className="w-4 h-4 shrink-0 animate-spin" />
              <div>
                <p className="text-xs font-bold leading-tight">{activeGestureToast.label}</p>
                <p className="text-[10px] opacity-80">{activeGestureToast.sublabel}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5-Point Calibration Modal */}
      <CalibrationModal
        isOpen={calibrationModalOpen}
        onClose={() => setCalibrationModalOpen(false)}
        rawGaze={rawGazeSample}
        onCalibrationComplete={handleCalibrationComplete}
      />
    </div>
  );
}
