'use client';

import React from 'react';
import Link from 'next/link';
import { UserProfile } from '@/lib/auth/AuthContext';
import {
  Zap,
  Eye,
  Gauge,
  GitPullRequest,
  Layers,
  User,
  BarChart3,
  ExternalLink,
  Hash,
  Volume2,
  HeartPulse,
  Crosshair,
  HelpCircle,
  Home,
  Sliders,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  Radio,
  CheckCircle2,
} from 'lucide-react';

export type DashboardTab = 'cockpit' | 'simulator' | 'code' | 'macros' | 'identity' | 'analytics';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  // Integration action triggers
  onOpenFloatingHUD: () => void;
  onOpenSlack: () => void;
  onOpenAudioGuide: () => void;
  onOpenCaregiver: () => void;
  onOpenSettings: () => void;
  onOpenOnboarding: () => void;
  onOpenCalibration: () => void;
  // User session
  user: UserProfile | null;
  onSignOut: () => void;
  // Status info
  slackEnabled?: boolean;
  slackChannel?: string;
  isFloorReserved?: boolean;
  isSimulatingMouse?: boolean;
}

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  onOpenFloatingHUD,
  onOpenSlack,
  onOpenAudioGuide,
  onOpenCaregiver,
  onOpenSettings,
  onOpenOnboarding,
  onOpenCalibration,
  user,
  onSignOut,
  slackEnabled = true,
  slackChannel = '#engineering-standup',
  isFloorReserved = false,
  isSimulatingMouse = false,
}: DashboardSidebarProps) {
  const primaryNavItems: {
    id: DashboardTab;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: 'cockpit',
      label: 'Assistive Cockpit',
      sublabel: 'Iris tracking & 4-quadrant HUD',
      icon: Eye,
      badge: 'LIVE',
    },
    {
      id: 'simulator',
      label: 'Benchmark Simulator',
      sublabel: 'Feel The Gap AAC latency comparison',
      icon: Gauge,
      badge: 'Bench',
    },
    {
      id: 'code',
      label: 'Code Review Bridge',
      sublabel: 'GitHub PR synthesis & diff approval',
      icon: GitPullRequest,
      badge: 'AI Bridge',
    },
    {
      id: 'macros',
      label: 'Macro Studio',
      sublabel: 'Dynamic intent wheels & phrase packs',
      icon: Layers,
      badge: 'Presets',
    },
    {
      id: 'identity',
      label: 'Voice & Persona',
      sublabel: 'Custom TTS pitch, speed & vocal tone',
      icon: User,
      badge: 'Acoustic',
    },
    {
      id: 'analytics',
      label: 'Telemetry & Metrics',
      sublabel: 'Fixation precision, WPM & fatigue aborts',
      icon: BarChart3,
      badge: 'Real-Time',
    },
  ];

  const integrationTools = [
    {
      id: 'pip',
      label: 'Floating HUD Window',
      sublabel: 'Always-On-Top PiP for Meet/Zoom',
      icon: ExternalLink,
      badge: 'Pop-Out',
      onClick: onOpenFloatingHUD,
      isAction: true,
    },
    {
      id: 'slack',
      label: 'Slack Broadcast',
      sublabel: slackEnabled ? `Active: ${slackChannel}` : 'Broadcast disconnected',
      icon: Hash,
      badge: slackEnabled ? 'Connected' : 'Off',
      activeColor: slackEnabled ? 'text-white' : 'text-neutral-500',
      onClick: onOpenSlack,
      isAction: true,
    },
    {
      id: 'calibration',
      label: 'Iris Calibration',
      sublabel: '9-point gaze landmark matrix',
      icon: Crosshair,
      badge: 'Calibrate',
      onClick: onOpenCalibration,
      isAction: true,
    },
    {
      id: 'caregiver',
      label: 'Caregiver Safeguard',
      sublabel: 'Distress pause & ergonomic alerts',
      icon: HeartPulse,
      badge: 'Safety',
      onClick: onOpenCaregiver,
      isAction: true,
    },
    {
      id: 'audio',
      label: 'Virtual Cable Guide',
      sublabel: 'BlackHole / VB-Cable setup',
      icon: Volume2,
      badge: 'Audio',
      onClick: onOpenAudioGuide,
      isAction: true,
    },
    {
      id: 'tour',
      label: 'Tour & Shortcuts',
      sublabel: 'Interactive quick start guide',
      icon: HelpCircle,
      badge: 'Guide',
      onClick: onOpenOnboarding,
      isAction: true,
    },
  ];

  const handleSelectTab = (tab: DashboardTab) => {
    onTabChange(tab);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const handleActionClick = (action: () => void) => {
    action();
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-neutral-950 border-r border-neutral-800 transition-all duration-300 ease-in-out ${
          isMobileOpen
            ? 'translate-x-0 w-[290px] shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[74px]' : 'lg:w-[270px]'}`}
      >
        {/* Brand & Collapse Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-800/80 bg-black/60">
          <Link
            href="/"
            className="flex items-center gap-3 group overflow-hidden"
            title="Dialectica Home"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black font-black flex-shrink-0 transition-transform group-hover:scale-105 shadow-md shadow-white/10">
              <Zap className="w-4 h-4 fill-black" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-white truncate">
                    Dialectica
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-neutral-850 text-neutral-300 border border-neutral-700 font-bold uppercase">
                    v2.4
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 truncate">Assistive Engine</span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-6">
          {/* Section 1: Assistive Workspaces */}
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Workspaces</span>
                {isFloorReserved && (
                  <span className="text-[9px] text-emerald-400 font-mono animate-pulse flex items-center gap-1 font-semibold">
                    <Radio className="w-2.5 h-2.5" /> Floor Active
                  </span>
                )}
              </div>
            )}

            <nav className="space-y-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    title={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group relative ${
                      isActive
                        ? 'bg-white text-black font-bold shadow-md shadow-white/5'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-900/80 font-medium'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-black' : 'text-neutral-400 group-hover:text-white'
                      }`}
                    />

                    {(!isCollapsed || isMobileOpen) && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="truncate">
                          <div className="text-xs truncate">{item.label}</div>
                          <div
                            className={`text-[10px] truncate ${
                              isActive ? 'text-neutral-700' : 'text-neutral-400'
                            }`}
                          >
                            {item.sublabel}
                          </div>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ml-2 flex-shrink-0 ${
                              isActive
                                ? 'bg-black text-white'
                                : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section 2: Real-Time Assistive Tools & Integrations */}
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Live Tools & Controls
              </div>
            )}

            <div className="space-y-1">
              {integrationTools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleActionClick(tool.onClick)}
                    title={tool.label}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-neutral-300 hover:text-white hover:bg-neutral-900 transition group"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 text-neutral-400 group-hover:text-white transition-colors" />

                    {(!isCollapsed || isMobileOpen) && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="truncate">
                          <div className="text-xs font-semibold truncate group-hover:text-white">
                            {tool.label}
                          </div>
                          <div className="text-[10px] text-neutral-400 truncate">
                            {tool.sublabel}
                          </div>
                        </div>

                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 ml-2 flex-shrink-0">
                          {tool.badge}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: System Links */}
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                System
              </div>
            )}

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleActionClick(onOpenSettings)}
                title="Ergonomic & Vision Settings"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-neutral-300 hover:text-white hover:bg-neutral-900 transition group"
              >
                <Sliders className="w-4 h-4 flex-shrink-0 text-neutral-400 group-hover:text-white" />
                {(!isCollapsed || isMobileOpen) && (
                  <span className="text-xs font-medium">Vision & Dwell Settings</span>
                )}
              </button>

              <Link
                href="/"
                title="Return to Home Landing Page"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-neutral-300 hover:text-white hover:bg-neutral-900 transition group"
              >
                <Home className="w-4 h-4 flex-shrink-0 text-neutral-400 group-hover:text-white" />
                {(!isCollapsed || isMobileOpen) && (
                  <span className="text-xs font-medium">Dialectica Home</span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer: Real User Account Card */}
        <div className="p-3 border-t border-neutral-800/80 bg-black/60">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-lg bg-white text-black font-black text-xs flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    {user?.name || 'Authenticated Member'}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                    title="Online / Session Active"
                  />
                </div>
                <div className="text-[10px] text-neutral-400 truncate">
                  {user?.email || 'Active Session'}
                </div>
                {user?.provider === 'google' && (
                  <div className="text-[9px] text-neutral-300 flex items-center gap-1 mt-0.5 font-medium">
                    <CheckCircle2 className="w-2.5 h-2.5 text-neutral-300" />
                    <span>Google Verified</span>
                  </div>
                )}
              </div>
            )}

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={onSignOut}
              title="Sign Out"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
