'use client';

import React, { useEffect, useState, useRef } from 'react';
import { QuadrantOption, ToneType } from '@/lib/types';
import { SpeechService } from '@/lib/audio/speechService';
import {
  Check,
  ShieldX,
  Sparkles,
  Volume2,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Disc,
  Radio,
  Clock,
  Mic,
} from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'matrix' | 'wheel'>('matrix');

  const dwellStartRef = useRef<number | null>(null);
  const floorReservedRef = useRef(false);

  // Handle prolonged eye-closure cancel guard (>800ms)
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

  const circumference = 2 * Math.PI * 38; // Radius = 38

  const getQuadrantLabel = (quad: number) => {
    switch (quad) {
      case 0:
        return 'Top Left (Q0)';
      case 1:
        return 'Top Right (Q1)';
      case 2:
        return 'Bottom Left (Q2)';
      case 3:
        return 'Bottom Right (Q3)';
      default:
        return `Quadrant #${quad}`;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* HUD Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                viewMode === 'matrix'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Ergonomic Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('wheel')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                viewMode === 'wheel'
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              <span>Polar Wheel</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Dwell: <strong className="text-white">{dwellDurationMs}ms</strong></span>
          </div>
        </div>

        {/* Tone Selector Pill */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider hidden sm:inline">
            Acoustic Tone:
          </span>
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1 text-xs">
            {(['professional', 'direct', 'casual'] as ToneType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onToneChange(t)}
                className={`px-2.5 py-1 rounded-lg capitalize text-xs font-semibold transition ${
                  tone === t
                    ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: MODERN ERGONOMIC MATRIX (UNCONGESTED & SPACIOUS) */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {options.map((opt) => {
            const isActive = activeQuadrant === opt.quadrant;
            const isRecentSelected = lastSelectedId === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => onSelectOption(opt)}
                className={`group relative p-4 rounded-2xl border backdrop-blur-xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] ${
                  isActive
                    ? 'bg-neutral-900 border-white text-white shadow-[0_0_30px_rgba(255,255,255,0.18)] scale-[1.015]'
                    : isRecentSelected
                    ? 'bg-neutral-900/90 border-neutral-600 text-white'
                    : 'bg-neutral-950/90 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900/60'
                }`}
              >
                {/* Active Dwell Progress Top Fill Bar */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-800 rounded-t-2xl overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{ width: `${Math.round(dwellProgress * 100)}%` }}
                    />
                  </div>
                )}

                {/* Card Top Metadata */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800 uppercase">
                        {getQuadrantLabel(opt.quadrant)}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-850 text-neutral-400 border border-neutral-800">
                        {opt.category}
                      </span>
                    </div>

                    {/* Dwell Countdown Pill */}
                    {isActive ? (
                      <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded-full animate-pulse">
                        <Radio className="w-3 h-3 text-white" />
                        <span>{Math.round(dwellProgress * 100)}%</span>
                      </div>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 transition text-[10px] text-neutral-400 font-mono">
                        Hover or Look to Fire
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-white tracking-tight leading-snug">
                    {opt.title}
                  </h3>
                </div>

                {/* Spoken Speech Preview */}
                <div className="mt-3 pt-2.5 border-t border-neutral-850/80 flex items-center justify-between gap-3">
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    "{opt.previewText || opt.intentToken}"
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOption(opt);
                    }}
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-white hover:text-black border border-neutral-800 transition flex-shrink-0 text-neutral-400"
                    title="1-Click Speak Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: CLASSIC POLAR WHEEL */}
      {viewMode === 'wheel' && (
        <div className="relative w-full max-w-[420px] h-[380px] mx-auto flex items-center justify-center select-none py-4">
          <div className="absolute inset-2 rounded-full bg-neutral-950 border border-neutral-800 backdrop-blur-xl shadow-2xl flex items-center justify-center">
            <div className="absolute w-full h-[1px] bg-neutral-850 pointer-events-none" />
            <div className="absolute h-full w-[1px] bg-neutral-850 pointer-events-none" />
          </div>

          {/* Center Deadzone */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            <svg className="w-24 h-24 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="currentColor"
                strokeWidth="4"
                className="text-neutral-900 fill-black"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - dwellProgress)}
                strokeLinecap="round"
                className="transition-all duration-75 fill-transparent text-white"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              {activeQuadrant !== null ? (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    {dwellProgress > 0.25 ? 'Speaking...' : 'Locking'}
                  </span>
                  <span className="text-[11px] text-white font-mono font-bold">
                    {Math.round(dwellProgress * 100)}%
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest">
                    REST ZONE
                  </span>
                  <span className="text-[10px] text-neutral-300 font-bold capitalize mt-0.5">
                    {tone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4 Cards Around Ring */}
          {options.map((opt) => {
            const isActive = activeQuadrant === opt.quadrant;
            const positions = [
              'top-2 left-1/2 -translate-x-1/2', // Q0 Top
              'right-2 top-1/2 -translate-y-1/2', // Q1 Right
              'bottom-2 left-1/2 -translate-x-1/2', // Q2 Bottom
              'left-2 top-1/2 -translate-y-1/2', // Q3 Left
            ];

            return (
              <div
                key={opt.id}
                onClick={() => onSelectOption(opt)}
                className={`absolute z-10 w-40 p-2.5 rounded-xl border backdrop-blur-md transition-all duration-200 cursor-pointer ${
                  positions[opt.quadrant] || ''
                } ${
                  isActive
                    ? 'scale-105 bg-neutral-900 border-white text-white shadow-xl'
                    : 'bg-neutral-950/90 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="text-[9px] font-mono text-neutral-500 uppercase">
                  {opt.category}
                </div>
                <div className="text-xs font-bold text-white truncate mt-0.5">
                  {opt.title}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Toast on prolonged eye closure */}
      {showCancelToast && (
        <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-700 text-white text-xs flex items-center justify-center gap-2 shadow-2xl animate-in fade-in duration-150">
          <ShieldX className="w-4 h-4 text-white" />
          <span className="font-semibold">Intent Aborted (&gt;800ms Blink Guard Triggered)</span>
        </div>
      )}
    </div>
  );
}
