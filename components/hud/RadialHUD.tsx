'use client';

import React, { useEffect, useState, useRef } from 'react';
import { QuadrantOption, ToneType } from '@/lib/types';
import { SpeechService } from '@/lib/audio/speechService';
import { Check, ShieldX, Sparkles, Volume2, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  options: QuadrantOption[];
  activeQuadrant: number | null; // 0, 1, 2, 3 or null
  tone: ToneType;
  onToneChange: (tone: ToneType) => void;
  onSelectOption: (option: QuadrantOption) => void;
  onFloorReserveChange?: (isReserved: boolean) => void;
  dwellDurationMs?: number;
  isProlongedBlink?: boolean;
}

export default function RadialHUD({
  options,
  activeQuadrant,
  tone,
  onToneChange,
  onSelectOption,
  onFloorReserveChange,
  dwellDurationMs = 350,
  isProlongedBlink = false,
}: Props) {
  const [dwellProgress, setDwellProgress] = useState(0); // 0 to 1
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [showCancelToast, setShowCancelToast] = useState(false);

  const dwellStartRef = useRef<number | null>(null);
  const floorReservedRef = useRef(false);

  // Handle prolonged eye-closure cancel guard
  useEffect(() => {
    if (isProlongedBlink) {
      dwellStartRef.current = null;
      setDwellProgress(0);
      if (floorReservedRef.current) {
        floorReservedRef.current = false;
        onFloorReserveChange?.(false);
      }
      setShowCancelToast(true);
      const t = setTimeout(() => setShowCancelToast(false), 2000);
      return () => clearTimeout(t);
    }
  }, [isProlongedBlink, onFloorReserveChange]);

  // Handle Dwell Timer Loop
  useEffect(() => {
    let animId: number;

    if (activeQuadrant !== null && !isProlongedBlink) {
      const now = performance.now();
      if (!dwellStartRef.current) {
        dwellStartRef.current = now;
      }

      const loop = () => {
        if (!dwellStartRef.current) return;
        const elapsed = performance.now() - dwellStartRef.current;
        const progress = Math.min(1, elapsed / dwellDurationMs);
        setDwellProgress(progress);

        // Sub-90ms: Reserve floor acoustically and broadcast intent
        if (elapsed >= 90 && !floorReservedRef.current) {
          floorReservedRef.current = true;
          onFloorReserveChange?.(true);
          SpeechService.playGestureChime('brow');
        }

        // Dwell Complete: Fire Selection
        if (progress >= 1) {
          const selectedOption = options.find((o) => o.quadrant === activeQuadrant);
          if (selectedOption) {
            setLastSelectedId(selectedOption.id);
            onSelectOption(selectedOption);
            SpeechService.playGestureChime('nod');
          }
          dwellStartRef.current = null;
          setDwellProgress(0);
          floorReservedRef.current = false;
          onFloorReserveChange?.(false);
          return;
        }

        animId = requestAnimationFrame(loop);
      };

      animId = requestAnimationFrame(loop);
    } else {
      dwellStartRef.current = null;
      setDwellProgress(0);
      if (floorReservedRef.current) {
        floorReservedRef.current = false;
        onFloorReserveChange?.(false);
      }
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [activeQuadrant, dwellDurationMs, options, onSelectOption, onFloorReserveChange, isProlongedBlink]);

  // Quadrant positioning metadata (Monochrome)
  const getQuadrantStyle = (quad: number) => {
    switch (quad) {
      case 0: // Top
        return {
          wrapper: 'top-3 left-1/2 -translate-x-1/2',
          activeBg: 'bg-neutral-900 border-white text-white shadow-[0_0_25px_rgba(255,255,255,0.25)]',
          badge: 'bg-neutral-800 text-white border-neutral-600',
        };
      case 1: // Right
        return {
          wrapper: 'right-3 top-1/2 -translate-y-1/2',
          activeBg: 'bg-neutral-900 border-white text-white shadow-[0_0_25px_rgba(255,255,255,0.25)]',
          badge: 'bg-neutral-800 text-white border-neutral-600',
        };
      case 2: // Bottom
        return {
          wrapper: 'bottom-3 left-1/2 -translate-x-1/2',
          activeBg: 'bg-neutral-900 border-white text-white shadow-[0_0_25px_rgba(255,255,255,0.25)]',
          badge: 'bg-neutral-800 text-white border-neutral-600',
        };
      case 3: // Left
        return {
          wrapper: 'left-3 top-1/2 -translate-y-1/2',
          activeBg: 'bg-neutral-900 border-white text-white shadow-[0_0_25px_rgba(255,255,255,0.25)]',
          badge: 'bg-neutral-800 text-white border-neutral-600',
        };
      default:
        return {
          wrapper: '',
          activeBg: '',
          badge: '',
        };
    }
  };

  const circumference = 2 * Math.PI * 46; // Radius = 46

  return (
    <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] flex items-center justify-center select-none">
      {/* Background Radial Glow */}
      <div className="absolute inset-4 rounded-full bg-neutral-950 border border-neutral-800 backdrop-blur-xl shadow-2xl flex items-center justify-center">
        {/* Subtle Quadrant Dividing Crosshairs */}
        <div className="absolute w-full h-[1px] bg-neutral-900 pointer-events-none"></div>
        <div className="absolute h-full w-[1px] bg-neutral-900 pointer-events-none"></div>
      </div>

      {/* Center Resting Deadzone & Dwell Ring */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        <svg className="w-28 h-28 -rotate-90">
          {/* Base Ring */}
          <circle
            cx="56"
            cy="56"
            r="46"
            stroke="currentColor"
            strokeWidth="5"
            className="text-neutral-900 fill-black"
          />
          {/* Animated Dwell Progress Ring (Pure White) */}
          <circle
            cx="56"
            cy="56"
            r="46"
            stroke="currentColor"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - dwellProgress)}
            strokeLinecap="round"
            className="transition-all duration-75 fill-transparent text-white"
          />
        </svg>

        {/* Center Status / Tone Switcher */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center pointer-events-auto">
          {activeQuadrant !== null ? (
            <div className="flex flex-col items-center animate-in zoom-in-90 duration-150">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                {dwellProgress > 0.25 ? 'Speaking...' : 'Locking'}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
                {Math.round(dwellProgress * 100)}%
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase">TONE</span>
              <button
                onClick={() => {
                  const nextTone: ToneType =
                    tone === 'professional' ? 'direct' : tone === 'direct' ? 'casual' : 'professional';
                  onToneChange(nextTone);
                }}
                className="mt-0.5 text-xs font-bold capitalize text-white hover:bg-neutral-700 transition flex items-center gap-1 bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-700"
                title="Click or blink to switch conversation persona"
              >
                {tone}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 Quadrant Cards */}
      {options.map((opt) => {
        const quadStyle = getQuadrantStyle(opt.quadrant);
        const isActive = activeQuadrant === opt.quadrant;
        const isRecentSelected = lastSelectedId === opt.id;

        return (
          <div
            key={opt.id}
            onClick={() => onSelectOption(opt)}
            className={`absolute z-10 w-36 md:w-44 p-2.5 rounded-xl border backdrop-blur-md transition-all duration-200 cursor-pointer ${
              quadStyle.wrapper
            } ${
              isActive
                ? `scale-105 ${quadStyle.activeBg}`
                : isRecentSelected
                ? 'bg-neutral-900 border-white text-white'
                : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span
                className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${quadStyle.badge}`}
              >
                {opt.category}
              </span>
              {isActive && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              )}
            </div>

            <p className="text-xs md:text-sm font-bold text-white leading-snug truncate">
              {opt.title}
            </p>
            <p className="text-[10px] md:text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
              {opt.previewText || opt.intentToken}
            </p>
          </div>
        );
      })}

      {/* Safety Cancel Notification Toast */}
      {showCancelToast && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 z-30 font-semibold">
          <ShieldX className="w-3.5 h-3.5 text-white" />
          <span>Intent Aborted (&gt;800ms Blink Guard)</span>
        </div>
      )}
    </div>
  );
}
