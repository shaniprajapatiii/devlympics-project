'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import EyeTracker from '@/components/vision/EyeTracker';
import RadialHUD from '@/components/hud/RadialHUD';
import FloorBeacon from '@/components/hud/FloorBeacon';
import MeetingRoom from '@/components/meeting/MeetingRoom';
import SettingsDrawer from '@/components/hud/SettingsDrawer';
import MacroStudio, { PRESET_PACKS } from '@/components/studio/MacroStudio';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import FeelTheGapSimulator from '@/components/experience/FeelTheGapSimulator';
import CodeReviewBridge from '@/components/code/CodeReviewBridge';
import VoiceProfileManager from '@/components/profile/VoiceProfileManager';
import CaregiverSafeguard from '@/components/safety/CaregiverSafeguard';
import SlackIntegrationModal from '@/components/integrations/SlackIntegrationModal';
import VirtualAudioGuide from '@/components/integrations/VirtualAudioGuide';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import CalibrationModal from '@/components/vision/CalibrationModal';
import GoogleAuthModal from '@/components/auth/GoogleAuthModal';
import DashboardSidebar, { DashboardTab } from '@/components/dashboard/DashboardSidebar';
import DashboardTopNav from '@/components/dashboard/DashboardTopNav';
import { GazeCoords, QuadrantOption, ToneType, VoiceProfile, GestureType, CalibrationMatrix } from '@/lib/types';
import { SpeechService, DEFAULT_VOICE_PROFILE } from '@/lib/audio/speechService';
import { CalibrationManager } from '@/lib/vision/calibration';
import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Eye,
  Volume2,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Cpu,
  MousePointer,
  ExternalLink,
  Hash,
  HelpCircle,
  BarChart3,
  GitPullRequest,
  HeartPulse,
  User,
  Gauge,
  LogOut,
  Home,
  ChevronDown,
  Lock,
} from 'lucide-react';

export default function DialecticaDashboardPage() {
  const router = useRouter();
  const { user, isLoading, signOut, isGoogleModalOpen, openGoogleModal, closeGoogleModal, signInWithGoogle } = useAuth();

  // Navigation Tabs & Sidebar State
  const [activeTab, setActiveTab] = useState<DashboardTab>('cockpit');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Gaze & Vision State
  const [activeQuadrant, setActiveQuadrant] = useState<number | null>(null);
  const [gazeCoords, setGazeCoords] = useState<GazeCoords | null>(null);
  const [rawGazeSample, setRawGazeSample] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [isProlongedBlink, setIsProlongedBlink] = useState(false);
  const [isSimulatingMouse, setIsSimulatingMouse] = useState(false);
  const [calibrationModalOpen, setCalibrationModalOpen] = useState(false);

  // Audio & Meeting State
  const [isFloorReserved, setIsFloorReserved] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [dwellTimeMs, setDwellTimeMs] = useState(350);

  // User Profile State
  const [profile, setProfile] = useState<VoiceProfile>(DEFAULT_VOICE_PROFILE);

  // Options & Meeting Context
  const [options, setOptions] = useState<QuadrantOption[]>(PRESET_PACKS[0].options);
  const [lastMeetingDialogue, setLastMeetingDialogue] = useState(
    'Alex, how are we looking on the auth middleware and rate limiting PR?'
  );

  // Real-Time Analytics State
  const [totalPhrasesSpoken, setTotalPhrasesSpoken] = useState(5);
  const [totalWordsSpoken, setTotalWordsSpoken] = useState(72);
  const [abortedCount, setAbortedCount] = useState(0);

  // Integrations & Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSlackOpen, setIsSlackOpen] = useState(false);
  const [isAudioGuideOpen, setIsAudioGuideOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCaregiverOpen, setIsCaregiverOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [slackEnabled, setSlackEnabled] = useState(true);
  const [slackChannel, setSlackChannel] = useState('#engineering-standup');
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');
  const [lastSlackDispatched, setLastSlackDispatched] = useState('');

  // Cross-Window Synchronizer
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const saved = SpeechService.loadSavedVoiceProfile();
    if (user) {
      setProfile({
        ...saved,
        userName: user.name || saved.userName,
        role: user.role || saved.role,
        techStack: user.techStack || saved.techStack,
      });
    } else {
      setProfile(saved);
    }

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('dialectica_bus');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'REQUEST_SYNC') {
          channel.postMessage({
            type: 'SYNC_STATE',
            options,
            tone,
            profile,
          });
        } else if (data.type === 'FLOOR_RESERVE') {
          setIsFloorReserved(Boolean(data.isReserved));
        } else if (data.type === 'SPOKEN_PHRASE') {
          const phrase = data.text || '';
          setTotalPhrasesSpoken((c) => c + 1);
          setTotalWordsSpoken((w) => w + phrase.split(' ').length);
          setCurrentSpeakingText(phrase);
          setIsSpeaking(true);
          setTimeout(() => {
            setIsSpeaking(false);
            setCurrentSpeakingText('');
          }, 3000);
        } else if (data.type === 'TONE_UPDATE') {
          if (data.tone) setTone(data.tone);
        }
      };

      return () => channel.close();
    }
  }, [options, tone, profile, user]);

  // Handle Aborted Eye-Closure
  const handleProlongedBlink = useCallback(() => {
    setIsProlongedBlink(true);
    setAbortedCount((c) => c + 1);
  }, []);

  // Inbound Bridge: When meeting speech arrives, distill into 4 new response cards
  const handleTranscriptUpdate = useCallback(
    async (transcript: string, speaker: string) => {
      setLastMeetingDialogue(transcript);
      try {
        const res = await fetch('/api/distill-meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recentTranscript: transcript,
            speakerName: speaker,
            tone,
          }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.options) && data.options.length === 4) {
          setOptions(data.options);
        }
      } catch (err) {
        console.error('Failed to distill meeting dialogue:', err);
      }
    },
    [tone]
  );

  // Gaze state update from EyeTracker
  const handleGazeUpdate = useCallback(
    (coords: GazeCoords, quadrant: 0 | 1 | 2 | 3 | null) => {
      setGazeCoords(coords);
      setActiveQuadrant(quadrant);
      setIsProlongedBlink(coords.isProlongedBlink);
    },
    []
  );

  // Outbound Bridge: When user dwells on a card, expand intent, speak aloud & broadcast to Slack
  const handleSelectOption = useCallback(
    async (option: QuadrantOption) => {
      setIsFloorReserved(false);
      setIsSpeaking(true);
      const previewFallback = option.previewText || option.intentToken;
      setCurrentSpeakingText(previewFallback);

      try {
        const res = await fetch('/api/expand-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            intentToken: option.intentToken,
            category: option.category,
            tone,
            meetingContext: lastMeetingDialogue,
            activeTopic: 'Sprint Review',
            userName: profile.userName,
            userRole: profile.role,
            techStack: profile.techStack,
          }),
        });

        const data = await res.json();
        const speechOutput = data.expandedSpeech || previewFallback;

        setCurrentSpeakingText(speechOutput);
        setTotalPhrasesSpoken((c) => c + 1);
        setTotalWordsSpoken((w) => w + speechOutput.split(' ').length);

        // Speak aloud via TTS using user's configured profile
        SpeechService.speakText(
          speechOutput,
          tone,
          () => {
            setIsSpeaking(false);
            setCurrentSpeakingText('');
          },
          profile
        );

        // Notify floating HUD
        broadcastChannelRef.current?.postMessage({
          type: 'SPOKEN_PHRASE',
          text: speechOutput,
        });

        // Broadcast to Slack if enabled
        if (slackEnabled) {
          setLastSlackDispatched(speechOutput);
          fetch('/api/slack-broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: speechOutput,
              channel: slackChannel,
              webhookUrl: slackWebhookUrl,
              userName: profile.userName,
              tone,
            }),
          }).catch((err) => console.warn('Slack broadcast background notice:', err));
        }
      } catch (err) {
        console.error('Failed to expand intent:', err);
        SpeechService.speakText(
          previewFallback,
          tone,
          () => {
            setIsSpeaking(false);
            setCurrentSpeakingText('');
          },
          profile
        );
      }
    },
    [tone, lastMeetingDialogue, slackEnabled, slackChannel, slackWebhookUrl, profile]
  );

  // Facial Gesture Action Handler
  const handleGesture = useCallback(
    (gesture: GestureType) => {
      if (gesture === 'browRaise') {
        setIsFloorReserved(true);
        SpeechService.playGestureChime('brow');
      } else if (gesture === 'nod') {
        SpeechService.playGestureChime('nod');
        if (activeQuadrant !== null) {
          const selected = options.find((opt) => opt.quadrant === activeQuadrant);
          if (selected) {
            handleSelectOption(selected);
          }
        } else {
          // Quick Affirmative spoken phrase
          const quickAgree = 'Yes, exactly, I completely agree.';
          setCurrentSpeakingText(quickAgree);
          setIsSpeaking(true);
          SpeechService.speakText(
            quickAgree,
            tone,
            () => {
              setIsSpeaking(false);
              setCurrentSpeakingText('');
            },
            profile
          );
          setTotalPhrasesSpoken((c) => c + 1);
          setTotalWordsSpoken((w) => w + quickAgree.split(' ').length);
          if (slackEnabled) {
            fetch('/api/slack-broadcast', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: quickAgree,
                channel: slackChannel,
                webhookUrl: slackWebhookUrl,
                userName: profile.userName,
                tone,
              }),
            }).catch(() => {});
          }
        }
      } else if (gesture === 'shake') {
        SpeechService.playGestureChime('shake');
        setIsFloorReserved(false);
        setActiveQuadrant(null);
      }
    },
    [activeQuadrant, options, handleSelectOption, tone, profile, slackEnabled, slackChannel, slackWebhookUrl]
  );

  // Open Pop-out Floating HUD in native Always-On-Top Picture-in-Picture or pop-out window
  const handleOpenFloatingWindow = async () => {
    if (typeof window === 'undefined') return;

    if ('documentPictureInPicture' in window) {
      try {
        const pipWin = await (window as any).documentPictureInPicture.requestWindow({
          width: 460,
          height: 600,
        });

        [...document.styleSheets].forEach((styleSheet) => {
          try {
            const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
            const style = pipWin.document.createElement('style');
            style.textContent = cssRules;
            pipWin.document.head.appendChild(style);
          } catch (e) {
            const link = pipWin.document.createElement('link');
            if (styleSheet.href) {
              link.rel = 'stylesheet';
              link.type = styleSheet.type;
              link.media = styleSheet.media.toString();
              link.href = styleSheet.href;
              pipWin.document.head.appendChild(link);
            }
          }
        });

        const iframe = pipWin.document.createElement('iframe');
        iframe.src = '/hud';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.background = '#000000';
        pipWin.document.body.style.margin = '0';
        pipWin.document.body.appendChild(iframe);
        return;
      } catch (pipErr) {
        console.warn('Native PiP window requested fallback to standard popup:', pipErr);
      }
    }

    window.open(
      '/hud',
      'DialecticaFloatingHUD',
      'width=480,height=620,resizable=yes,scrollbars=no,status=no'
    );
  };

  const handleSignOut = () => {
    signOut();
    router.push('/login');
  };

  // FULL AUTHENTICATION PROTECTION GATE
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-white selection:text-black">
        {/* Header */}
        <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-neutral-900">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black font-black">
              <Zap className="w-4 h-4 fill-black" />
            </div>
            <span className="font-black text-lg tracking-tight text-white">Dialectica</span>
          </Link>
          <Link href="/" className="text-xs text-neutral-400 hover:text-white transition">
            Back to Home
          </Link>
        </header>

        {/* Protection Modal / Card */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Authentication Required</h2>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                The Dialectica Assistive Cockpit requires an authenticated session to manage voice profiles, iris calibration, and Slack telemetry.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={openGoogleModal}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Continue with Google</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                href="/login"
                className="w-full py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-white text-white font-semibold text-xs transition flex items-center justify-center"
              >
                Sign In with Email
              </Link>
            </div>

            <div className="pt-2 text-[11px] text-neutral-500">
              New to Dialectica?{' '}
              <Link href="/signup" className="text-white hover:underline font-bold">
                Create an account
              </Link>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-xs text-neutral-600 border-t border-neutral-900">
          Dialectica Secure Authentication System • Zero-Storage Client-Side Architecture
        </footer>

        <GoogleAuthModal
          isOpen={isGoogleModalOpen}
          onClose={closeGoogleModal}
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
      {/* Floor Reservation Beacon */}
      <FloorBeacon
        isFloorReserved={isFloorReserved}
        isSpeaking={isSpeaking}
        speakingText={currentSpeakingText}
        userName={profile.userName}
      />

      {/* Dedicated Side Navigation Bar with all views, tools, and real user info */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenFloatingHUD={handleOpenFloatingWindow}
        onOpenSlack={() => setIsSlackOpen(true)}
        onOpenAudioGuide={() => setIsAudioGuideOpen(true)}
        onOpenCaregiver={() => setIsCaregiverOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenCalibration={() => setCalibrationModalOpen(true)}
        user={user}
        onSignOut={handleSignOut}
        slackEnabled={slackEnabled}
        slackChannel={slackChannel}
        isFloorReserved={isFloorReserved}
        isSimulatingMouse={isSimulatingMouse}
      />

      {/* Main Content Area with Desktop Sidebar Offset */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-[74px]' : 'lg:pl-[270px]'
        }`}
      >
        {/* Improved Dashboard Top Navbar */}
        <DashboardTopNav
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          user={user}
          onSignOut={handleSignOut}
          onOpenFloatingHUD={handleOpenFloatingWindow}
          onOpenCaregiver={() => setIsCaregiverOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          dwellTimeMs={dwellTimeMs}
          activeQuadrant={activeQuadrant}
          isFloorReserved={isFloorReserved}
          isSimulatingMouse={isSimulatingMouse}
          slackEnabled={slackEnabled}
        />

      {/* Main Tab Views */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'cockpit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (Side A: Zero-Hardware Vision & Dynamic HUD) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Side A: Zero-Hardware Assistive Cockpit
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    Fixation Dwell: <strong className="text-white">{dwellTimeMs}ms</strong>
                  </span>
                </div>

                {/* Eye Tracking Camera & Landmark Mesh */}
                <div className="mb-4">
                  <EyeTracker
                    onGazeUpdate={handleGazeUpdate}
                    onProlongedBlink={handleProlongedBlink}
                    onGesture={handleGesture}
                    onRawGazeSample={setRawGazeSample}
                    isSimulatingMouse={isSimulatingMouse}
                    onToggleMouseSimulation={() => setIsSimulatingMouse(!isSimulatingMouse)}
                  />
                </div>

                {/* 4-Quadrant Polar Radial HUD */}
                <div className="border-t border-neutral-800 pt-3">
                  <div className="text-[11px] text-neutral-400 mb-2 flex items-center justify-between">
                    <span className="font-semibold text-white">
                      Fitts's Law 4-Quadrant Polar HUD
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Active: {activeQuadrant !== null ? `Quadrant #${activeQuadrant}` : 'None'}
                    </span>
                  </div>
                  <div className="py-2">
                    <RadialHUD
                      options={options}
                      activeQuadrant={activeQuadrant}
                      tone={tone}
                      onToneChange={setTone}
                      onSelectOption={handleSelectOption}
                      onFloorReserveChange={setIsFloorReserved}
                      dwellDurationMs={dwellTimeMs}
                      isProlongedBlink={isProlongedBlink}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Side B: Meeting Room & Telemetry) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 shadow-xl flex flex-col h-full min-h-[580px]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Side B: Live Collaboration Stage
                    </span>
                  </div>
                  <span className="text-[11px] text-white font-mono flex items-center gap-1 font-bold">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* Simulated Google Meet / Zoom Conference */}
                <div className="flex-1">
                  <MeetingRoom
                    onTranscriptUpdate={handleTranscriptUpdate}
                    userSpeakingText={currentSpeakingText}
                    isUserSpeaking={isSpeaking}
                    activeFloorUser={isFloorReserved ? profile.userName : undefined}
                    userName={profile.userName}
                    userRole={profile.role}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEEL THE GAP SIMULATOR */}
        {activeTab === 'simulator' && <FeelTheGapSimulator />}

        {/* TAB 3: CODE REVIEW BRIDGE */}
        {activeTab === 'code' && (
          <CodeReviewBridge
            tone={tone}
            userName={profile.userName}
            userRole={profile.role}
            onLoadPRCardsToHUD={(newOptions) => {
              setOptions(newOptions);
              setActiveTab('cockpit');
              broadcastChannelRef.current?.postMessage({
                type: 'OPTIONS_UPDATE',
                options: newOptions,
              });
            }}
          />
        )}

        {/* TAB 4: MACRO STUDIO */}
        {activeTab === 'macros' && (
          <MacroStudio
            activeOptions={options}
            onApplyPack={(newOptions) => {
              setOptions(newOptions);
              broadcastChannelRef.current?.postMessage({
                type: 'OPTIONS_UPDATE',
                options: newOptions,
              });
            }}
          />
        )}

        {/* TAB 5: VOICE & PERSONA IDENTITY */}
        {activeTab === 'identity' && (
          <VoiceProfileManager
            tone={tone}
            onToneChange={setTone}
            onProfileChange={(newProfile) => {
              setProfile(newProfile);
              broadcastChannelRef.current?.postMessage({
                type: 'PROFILE_UPDATE',
                profile: newProfile,
              });
            }}
          />
        )}

        {/* TAB 6: ANALYTICS */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            totalPhrasesSpoken={totalPhrasesSpoken}
            totalWordsSpoken={totalWordsSpoken}
            abortedCount={abortedCount}
            activeDwellTimeMs={dwellTimeMs}
            onResetTelemetry={() => {
              setTotalPhrasesSpoken(0);
              setTotalWordsSpoken(0);
              setAbortedCount(0);
            }}
          />
        )}
      </div>

      {/* Footer Telemetry Banner (Monochrome) */}
      <footer className="border-t border-neutral-800 bg-black py-3 px-4 sm:px-6 text-xs text-neutral-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white font-bold">
              <Zap className="w-3.5 h-3.5 fill-white" /> Dialectica Active
            </span>
            <span>Spoken: <strong className="text-white">{totalPhrasesSpoken} phrases</strong> ({totalWordsSpoken} words)</span>
            <span>Aborts / Blinks: <strong className="text-white">{abortedCount}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            <span>Client-Side WebGL 478 Landmarks</span>
            <span>•</span>
            <span>Tone: <strong className="text-white uppercase">{tone}</strong></span>
            <span>•</span>
            <Link href="/" className="text-neutral-400 hover:text-white transition">
              Home
            </Link>
          </div>
        </div>
      </footer>
      </div>

      {/* Modals & Drawers */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tone={tone}
        onToneChange={setTone}
        dwellTimeMs={dwellTimeMs}
        onDwellTimeChange={setDwellTimeMs}
        isSimulatingMouse={isSimulatingMouse}
        onToggleMouseSimulation={() => setIsSimulatingMouse(!isSimulatingMouse)}
      />

      <SlackIntegrationModal
        isOpen={isSlackOpen}
        onClose={() => setIsSlackOpen(false)}
        slackEnabled={slackEnabled}
        onToggleSlack={setSlackEnabled}
        channel={slackChannel}
        onChannelChange={setSlackChannel}
        webhookUrl={slackWebhookUrl}
        onWebhookUrlChange={setSlackWebhookUrl}
        lastDispatchedMessage={lastSlackDispatched}
      />

      <CaregiverSafeguard
        isOpen={isCaregiverOpen}
        onClose={() => setIsCaregiverOpen(false)}
        onBroadcastAlert={(type, message) => {
          setTotalPhrasesSpoken((c) => c + 1);
          setTotalWordsSpoken((w) => w + message.split(' ').length);
          if (slackEnabled) {
            const prefix =
              type === 'medical'
                ? '🚨 [EMERGENCY MEDICAL PAUSE]'
                : type === 'caregiver'
                ? '🔔 [CAREGIVER ASSISTANCE PING]'
                : '☕ [ERGONOMIC BREAK REQUEST]';
            fetch('/api/slack-broadcast', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: `${prefix} ${profile.userName}: "${message}"`,
                channel: slackChannel,
                webhookUrl: slackWebhookUrl,
                userName: profile.userName,
                tone: 'direct',
              }),
            }).catch(() => {});
          }
        }}
      />

      <VirtualAudioGuide
        isOpen={isAudioGuideOpen}
        onClose={() => setIsAudioGuideOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onStartCalibration={() => setCalibrationModalOpen(true)}
      />

      <CalibrationModal
        isOpen={calibrationModalOpen}
        onClose={() => setCalibrationModalOpen(false)}
        rawGaze={rawGazeSample}
        onCalibrationComplete={(matrix) => {
          CalibrationManager.saveCalibration(matrix);
          setCalibrationModalOpen(false);
        }}
      />

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={closeGoogleModal}
      />
    </main>
  );
}
