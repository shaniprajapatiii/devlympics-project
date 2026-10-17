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
  BookOpen,
  Sparkles,
} from 'lucide-react';

export type DashboardTab =
  | 'cockpit'
  | 'code'
  | 'translator'
  | 'simulator'
  | 'macros'
  | 'identity'
  | 'analytics';

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
  // Group 1: The Core Theme Bridges
  const cognitiveBridges: {
    id: DashboardTab;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: 'cockpit',
      label: 'Assistive Cockpit',
      sublabel: 'Iris Gaze ↔ Agile Meeting Bridge',
      icon: Eye,
      badge: 'LIVE',
    },
    {
      id: 'code',
      label: 'Code Review Bridge',
      sublabel: 'Hands-free GitHub PR & Architecture',
      icon: GitPullRequest,
      badge: 'GitHub',
    },
    {
      id: 'translator',
      label: 'Opportunity Translator',
      sublabel: 'Complex Specs ↔ Actionable Steps',
      icon: BookOpen,
      badge: 'Theme',
    },
    {
      id: 'simulator',
      label: 'Feel The Gap Benchmark',
      sublabel: '8-WPM Keyboard vs 0.82s Speedup',
      icon: Gauge,
      badge: '51.8x',
    },
  ];

  // Group 2: Personalization & Analytics
  const personalTools: {
    id: DashboardTab;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: 'macros',
      label: 'Macro Studio',
      sublabel: 'Intent packs & custom phrase wheels',
      icon: Layers,
    },
    {
      id: 'identity',
      label: 'Voice & Persona',
      sublabel: 'Neural voice pitch, tone & title',
      icon: User,
    },
    {
      id: 'analytics',
      label: 'Clinical Telemetry',
      sublabel: 'WPM, fatigue aborts & precision',
      icon: BarChart3,
    },
  ];

  const integrationTools = [
    {
      id: 'pip',
      label: 'Floating HUD Window',
      sublabel: 'Picture-in-Picture for Meet/Zoom',
      icon: ExternalLink,
      badge: 'PiP',
      onClick: onOpenFloatingHUD,
    },
    {
      id: 'slack',
      label: 'Slack Broadcast',
      sublabel: slackEnabled ? `Active: ${slackChannel}` : 'Broadcast disconnected',
      icon: Hash,
      badge: slackEnabled ? 'Sync' : 'Off',
      onClick: onOpenSlack,
    },
    {
      id: 'caregiver',
      label: 'Caregiver Safeguard',
      sublabel: 'Medical pause & distress alerts',
      icon: HeartPulse,
      badge: 'Safety',
      onClick: onOpenCaregiver,
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
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-neutral-950 border-r border-neutral-800/80 transition-all duration-300 ease-in-out ${
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
                    v2.5
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 truncate">Cognitive Bridge</span>
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
          {/* Section 1: The Cognitive Bridges */}
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Cognitive Bridges</span>
                {isFloorReserved && (
                  <span className="text-[9px] text-emerald-400 font-mono animate-pulse flex items-center gap-1 font-semibold">
                    <Radio className="w-2.5 h-2.5" /> Floor Active
                  </span>
                )}
              </div>
            )}

            <nav className="space-y-1">
              {cognitiveBridges.map((item) => {
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

          {/* Section 2: Personalization & Tools */}
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Studio & Telemetry
              </div>
            )}

            <div className="space-y-1">
              {personalTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTab === tool.id;

                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelectTab(tool.id)}
                    title={tool.label}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 group ${
                      isActive
                        ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 text-neutral-400 group-hover:text-white transition-colors" />

                    {(!isCollapsed || isMobileOpen) && (
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{tool.label}</div>
                        <div className="text-[10px] text-neutral-500 truncate">{tool.sublabel}</div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Integrations & Quick Actions */}
          <div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Connected Integrations
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
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-neutral-400 hover:text-white hover:bg-neutral-900 transition group"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 text-neutral-500 group-hover:text-white transition-colors" />

                    {(!isCollapsed || isMobileOpen) && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="text-xs font-medium truncate">{tool.label}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 ml-2">
                          {tool.badge}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer: User Account Status */}
        <div className="p-3 border-t border-neutral-800/80 bg-black/60">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="w-8 h-8 rounded-lg bg-white text-black font-black text-xs flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
              )}
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    {user?.name || 'Alex Chen'}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                    title="Online"
                  />
                </div>
                <div className="text-[10px] text-neutral-400 truncate">
                  {user?.email || 'alex.chen@enterprise.io'}
                </div>
              </div>
            )}

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
