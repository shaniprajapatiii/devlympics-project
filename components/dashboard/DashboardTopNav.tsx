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
  MousePointer,
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

  const tabMeta: Record<DashboardTab, { title: string; subtitle: string; tag: string }> = {
    cockpit: {
      title: 'Assistive Meeting Cockpit',
      subtitle: 'Zero-Hardware Iris Gaze ↔ Google Meet Agile Standup Stage',
      tag: 'Bridge 1',
    },
    code: {
      title: 'Code Review Bridge',
      subtitle: 'Hands-Free GitHub PR Diff Inspection & Technical Sign-off',
      tag: 'Bridge 2',
    },
    translator: {
      title: 'Opportunity & Spec Translator',
      subtitle: 'Transform Complex Competition & Fellowship Criteria into Action Plans',
      tag: 'Bridge 3',
    },
    simulator: {
      title: 'Feel The Gap Benchmark',
      subtitle: 'Traditional 8-WPM Eye Keyboard vs. 0.82s Dialectica Speedup',
      tag: 'Bridge 4',
    },
    macros: {
      title: 'Macro Studio',
      subtitle: 'Custom Intent Wheels, Agile Standup & Incident Packs',
      tag: 'Studio',
    },
    identity: {
      title: 'Voice & Identity',
      subtitle: 'Acoustic Tone, Cadence & Custom Voice Profile Persona',
      tag: 'Persona',
    },
    analytics: {
      title: 'Assistive Telemetry',
      subtitle: 'Real-Time Fixation Precision, Effective WPM & Fatigue Aborts',
      tag: 'Metrics',
    },
  };

  const currentMeta = tabMeta[activeTab] || tabMeta.cockpit;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-neutral-800/80 bg-black/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Hamburger & Active Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800 font-bold uppercase hidden sm:inline">
              {currentMeta.tag}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {currentMeta.title}
            </h1>
          </div>
          <p className="text-[11px] text-neutral-400 hidden lg:block truncate max-w-lg">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Center: System Status Telemetry Badges */}
      <div className="hidden md:flex items-center gap-2">
        {/* Input Mode */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              isSimulatingMouse ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="text-neutral-300 font-medium">
            {isSimulatingMouse ? 'Cursor Gaze' : 'Iris 478 Mesh'}
          </span>
        </div>

        {/* Floor Reservation */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition ${
            isFloorReserved
              ? 'bg-white text-black font-bold border-white shadow-md'
              : 'bg-neutral-950 text-neutral-400 border-neutral-800'
          }`}
        >
          <Radio className="w-3 h-3" />
          <span>{isFloorReserved ? 'Floor Reserved' : 'Open Floor'}</span>
        </div>

        {/* Slack Sync */}
        {slackEnabled && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Slack Live</span>
          </div>
        )}
      </div>

      {/* Right: Quick Actions & Profile Dropdown */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition"
          title="Vision Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-white text-black font-black text-xs flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-neutral-950 border border-neutral-850 p-2 shadow-2xl z-50 text-xs">
              <div className="p-2.5 border-b border-neutral-850 mb-1">
                <div className="font-bold text-white truncate">{user?.name || 'Alex Chen'}</div>
                <div className="text-[11px] text-neutral-400 truncate">{user?.email || 'alex.chen@enterprise.io'}</div>
              </div>

              <Link
                href="/"
                className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
