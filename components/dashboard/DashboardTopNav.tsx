'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserProfile } from '@/lib/auth/AuthContext';
import { DashboardTab } from './DashboardSidebar';
import {
  Menu,
  ExternalLink,
  HeartPulse,
  Sliders,
  ChevronDown,
  LogOut,
  Home,
  Radio,
  Eye,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

interface DashboardTopNavProps {
  activeTab: DashboardTab;
  onOpenMobileMenu: () => void;
  user: UserProfile | null;
  onSignOut: () => void;
  onOpenFloatingHUD: () => void;
  onOpenCaregiver: () => void;
  onOpenSettings: () => void;
  dwellTimeMs: number;
  activeQuadrant: number | null;
  isFloorReserved: boolean;
  isSimulatingMouse: boolean;
  slackEnabled: boolean;
}

export default function DashboardTopNav({
  activeTab,
  onOpenMobileMenu,
  user,
  onSignOut,
  onOpenFloatingHUD,
  onOpenCaregiver,
  onOpenSettings,
  dwellTimeMs,
  activeQuadrant,
  isFloorReserved,
  isSimulatingMouse,
  slackEnabled,
}: DashboardTopNavProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const tabMeta: Record<DashboardTab, { title: string; subtitle: string }> = {
    cockpit: {
      title: 'Assistive Cockpit',
      subtitle: 'Iris Gaze Tracking & 4-Quadrant Polar HUD',
    },
    simulator: {
      title: 'Benchmark Simulator',
      subtitle: 'Feel The Gap AAC Latency & Typing Speed Comparison',
    },
    code: {
      title: 'Code Review Bridge',
      subtitle: 'Assistive Pull Request Review & Intent Dispatch',
    },
    macros: {
      title: 'Macro Studio',
      subtitle: 'Dynamic Phrase Wheel Presets & Pack Editor',
    },
    identity: {
      title: 'Voice & Persona',
      subtitle: 'Acoustic Tone, Cadence & Custom Voice Profile',
    },
    analytics: {
      title: 'Telemetry & Analytics',
      subtitle: 'Real-Time Fixation Precision, WPM & Fatigue Monitoring',
    },
  };

  const currentMeta = tabMeta[activeTab] || tabMeta.cockpit;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-neutral-800 bg-black/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Hamburger & Active Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-850 transition"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* View Breadcrumb / Title */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-400 hidden sm:inline">
              Dialectica /
            </span>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {currentMeta.title}
            </h1>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300">
              Live Engine
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 hidden lg:block truncate max-w-md">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Center: System Status Telemetry Pills */}
      <div className="hidden xl:flex items-center gap-2">
        {/* Eye Tracking / Mouse Simulation Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-[11px] font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              isSimulatingMouse ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="text-neutral-400">
            {isSimulatingMouse ? 'Mouse Emulation' : 'Iris Mesh 478'}
          </span>
        </div>

        {/* Quadrant Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-[11px] font-mono">
          <Eye className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-300">
            {activeQuadrant !== null ? (
              <span className="text-white font-bold">Quadrant #{activeQuadrant}</span>
            ) : (
              <span className="text-neutral-400">Neutral</span>
            )}
          </span>
        </div>

        {/* Floor Reservation Indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition ${
            isFloorReserved
              ? 'bg-white text-black font-bold border-white shadow-sm'
              : 'bg-neutral-950 text-neutral-400 border-neutral-800'
          }`}
        >
          <Radio className="w-3 h-3" />
          <span>{isFloorReserved ? 'Floor Reserved' : 'Open Floor'}</span>
        </div>

        {/* Dwell Duration */}
        <div className="text-[11px] text-neutral-400 font-mono px-2 py-1">
          Dwell: <strong className="text-neutral-200">{dwellTimeMs}ms</strong>
        </div>
      </div>

      {/* Right: Action Buttons & User Menu */}
      <div className="flex items-center gap-2">
        {/* Floating HUD Trigger */}
        <button
          type="button"
          onClick={onOpenFloatingHUD}
          className="py-1.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center gap-1.5 text-xs font-semibold transition shadow-sm"
          title="Open Floating HUD window (Picture-in-Picture) to use over Google Meet, Zoom, or VS Code"
        >
          <ExternalLink className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">Floating HUD</span>
        </button>

        {/* Caregiver Distress Trigger */}
        <button
          type="button"
          onClick={onOpenCaregiver}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition"
          title="Caregiver Distress Alert & Ergonomic Rest Pause"
        >
          <HeartPulse className="w-4 h-4" />
        </button>

        {/* Ergonomic & Dwell Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition"
          title="Ergonomic Dwell & Sensitivity Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 transition"
          >
            <div className="w-6 h-6 rounded-lg bg-white text-black font-black text-[11px] flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
                {user?.name || 'Authorized Member'}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-neutral-950 border border-neutral-700 shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 border-b border-neutral-800 mb-1">
                <div className="font-bold text-white truncate">{user?.name || 'Authorized User'}</div>
                <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                  {user?.email || 'Authenticated Session'}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    {user?.role || 'Engineer / Member'}
                  </span>
                  {user?.provider === 'google' && (
                    <span className="text-[10px] text-neutral-300 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-2.5 h-2.5 text-neutral-300" /> Google
                    </span>
                  )}
                </div>
              </div>

              <Link
                href="/"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dialectica Landing Page</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Vision & Dwell Settings</span>
              </button>

              <div className="border-t border-neutral-800 mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition text-left font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
