'use client';

import React from 'react';
import { Volume2, Radio } from 'lucide-react';

interface Props {
  isFloorReserved: boolean;
  isSpeaking: boolean;
  speakingText?: string;
  userName?: string;
}

export default function FloorBeacon({
  isFloorReserved,
  isSpeaking,
  speakingText,
  userName = 'Alex',
}: Props) {
  if (!isFloorReserved && !isSpeaking) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-auto animate-in slide-in-from-top-4 fade-in duration-200">
      <div
        className={`px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 transition-all duration-200 bg-neutral-950 border-white text-white ${
          isSpeaking
            ? 'shadow-[0_0_35px_rgba(255,255,255,0.2)]'
            : 'border-neutral-500 shadow-[0_0_25px_rgba(255,255,255,0.1)]'
        }`}
      >
        {/* Pulsing indicator */}
        <div className="relative flex items-center justify-center">
          <span
            className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-white opacity-75"
          ></span>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-black font-bold"
          >
            {isSpeaking ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Radio className="w-4 h-4 animate-spin" />}
          </div>
        </div>

        {/* Content text */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wide">
              {userName}
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-neutral-900 text-white border border-neutral-700"
            >
              {isSpeaking ? 'Speaking Aloud' : 'Floor Reserved (Drafting Response)'}
            </span>
          </div>

          <p className="text-xs text-neutral-300 font-medium truncate mt-0.5 max-w-sm sm:max-w-md">
            {isSpeaking ? `"${speakingText}"` : 'Please hold the floor for a moment...'}
          </p>
        </div>

        {/* Animated Audio Equalizer Bars */}
        <div className="flex items-center gap-0.5 h-4">
          <span className="w-1 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3"></span>
          <span className="w-1 bg-white rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.2s] h-4"></span>
          <span className="w-1 bg-white rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s] h-2"></span>
        </div>
      </div>
    </div>
  );
}
