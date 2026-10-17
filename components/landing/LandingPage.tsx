'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import GoogleAuthModal from '@/components/auth/GoogleAuthModal';
import {
  Zap,
  Eye,
  Volume2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Gauge,
  GitPullRequest,
  Layers,
  Radio,
  ExternalLink,
  ChevronRight,
  Cpu,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user, isGoogleModalOpen, openGoogleModal, closeGoogleModal } = useAuth();

  // Interactive Hero HUD Teaser state
  const [activeTeaserQuadrant, setActiveTeaserQuadrant] = useState<number | null>(null);
  const [dwellProgress, setDwellProgress] = useState(0);
  const [expandedSpeech, setExpandedSpeech] = useState<string>(
    "Alex Rivera: I've reviewed the distributed lock changes and all 42 tests pass; looks solid and ready to merge."
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const dwellTimerRef = useRef<NodeJS.Timeout | null>(null);

  const teaserOptions = [
    {
      id: 0,
      title: 'Approve PR #412',
      tag: 'Code Review',
      token: 'Approved with verified tests',
      speech:
        "Alex Rivera: I've reviewed the distributed locking changes and tests pass; looks solid and ready to merge to staging.",
    },
    {
      id: 1,
      title: 'Sprint: On Track',
      tag: 'Standup Status',
      token: 'Sprint goals on schedule',
      speech:
        'Alex Rivera: My tasks for the authentication middleware and rate limiting PR are on track for afternoon deployment.',
    },
    {
      id: 2,
      title: 'Agreed with Direction',
      tag: 'Meeting Consensus',
      token: 'Agree with approach',
      speech:
        'Alex Rivera: Yes, exactly, I completely agree with this architectural decision. Let us proceed with this plan.',
    },
    {
      id: 3,
      title: 'Clarify Latency Target',
      tag: 'Technical Inquiry',
      token: 'Clarify edge case latency',
      speech:
        'Alex Rivera: Could someone clarify the p99 latency threshold for our Redis distributed lock before we finalize?',
    },
  ];

  const handleQuadrantMouseEnter = (idx: number) => {
    setActiveTeaserQuadrant(idx);
    setDwellProgress(0);

    let progress = 0;
    if (dwellTimerRef.current) clearInterval(dwellTimerRef.current);

    dwellTimerRef.current = setInterval(() => {
      progress += 10;
      setDwellProgress(Math.min(100, progress));

      if (progress >= 100) {
        clearInterval(dwellTimerRef.current!);
        setIsSynthesizing(true);
        setExpandedSpeech(teaserOptions[idx].speech);
        // Play subtle acoustic feedback chime
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.18);
        } catch (e) {}

        setTimeout(() => setIsSynthesizing(false), 2000);
      }
    }, 35);
  };

  const handleQuadrantMouseLeave = () => {
    if (dwellTimerRef.current) clearInterval(dwellTimerRef.current);
    setActiveTeaserQuadrant(null);
    setDwellProgress(0);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden font-sans">
      {/* Background Subtle Monochrome Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-neutral-900/40 rounded-full blur-[140px]" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black font-black transition-transform group-hover:scale-105 shadow-md">
              <Zap className="w-5 h-5 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white">
                  Dialectica
                </span>
                <span className="text-[10px] font-bold bg-neutral-900 text-neutral-300 border border-neutral-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Enterprise Suite
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">Cognitive Voice & Gaze Interaction Platform</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#demo" className="hover:text-white transition">Interactive Teaser</a>
            <a href="#benchmark" className="hover:text-white transition">Benchmark</a>
            <a href="#pipeline" className="hover:text-white transition">Architecture</a>
            <a href="#impact" className="hover:text-white transition">Security & Ethics</a>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-200 hover:text-white transition text-xs font-semibold"
                >
                  <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-black overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition flex items-center gap-1.5 shadow-md"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 border border-neutral-700 hover:border-neutral-500 transition"
                >
                  Sign Up
                </Link>

                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition flex items-center gap-1.5 shadow-md"
                >
                  <span>Launch Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-14 pb-20 sm:pt-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Grand Submission Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>GDG NSUT Devlympics – Shunya 2026 Grand Submission</span>
          <span className="text-neutral-600">•</span>
          <span className="text-white font-bold">Theme: Bridge the Gap</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08] mb-6">
          Break the Silence.{' '}
          <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent underline decoration-neutral-700">
            Lead Engineering Teams
          </span>{' '}
          at the Speed of Thought.
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Zero expensive hardware required. <strong className="text-white">Dialectica</strong> transforms any standard commodity laptop webcam into a 478-landmark iris gaze controller. Paired with Gemini generative intent expansion, motor- and speech-impaired engineers can speak, review PRs, and lead live standups at <span className="text-white font-bold underline">130+ WPM</span>.
        </p>

        {/* Hero Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            type="button"
            onClick={openGoogleModal}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-3 border border-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#000000"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#000000"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#000000"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#000000"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-white text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            <span>Open Dialectica Dashboard</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="#benchmark"
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <Gauge className="w-4 h-4 text-white" />
            <span>51.8x Speed Benchmark</span>
          </a>
        </div>

        {/* Live Telemetry KPI Chips (Monochrome) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-16">
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="text-2xl sm:text-3xl font-black text-white">51.8x</div>
            <div className="text-xs text-neutral-300 mt-1 font-semibold">Communication Speedup</div>
            <div className="text-[10px] text-neutral-500">vs. 8 WPM eye keyboards</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="text-2xl sm:text-3xl font-black text-white">0.82s</div>
            <div className="text-xs text-neutral-300 mt-1 font-semibold">Intent-to-Speech Latency</div>
            <div className="text-[10px] text-neutral-500">with Gemini 1.5 Flash</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="text-2xl sm:text-3xl font-black text-white">478</div>
            <div className="text-xs text-neutral-300 mt-1 font-semibold">Iris & Face Landmarks</div>
            <div className="text-[10px] text-neutral-500">100% Client-Side WebGL</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="text-2xl sm:text-3xl font-black text-white">$0</div>
            <div className="text-xs text-neutral-300 mt-1 font-semibold">Hardware Add-On Cost</div>
            <div className="text-[10px] text-neutral-500">Any standard webcam</div>
          </div>
        </div>

        {/* INTERACTIVE HERO COCKPIT TEASER (Black & White) */}
        <div id="demo" className="relative max-w-4xl mx-auto rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Interactive Micro-Gaze Cockpit Teaser</span>
                  <span className="text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded-full border border-neutral-700">
                    Live Hover Dwell
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Hover your cursor over any quadrant to simulate 350ms iris fixation & intent distillation.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-white hover:underline flex items-center gap-1 transition"
            >
              <span>Full Cockpit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive 4-Quadrant Visual Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {teaserOptions.map((opt) => {
              const isSelected = activeTeaserQuadrant === opt.id;
              return (
                <div
                  key={opt.id}
                  onMouseEnter={() => handleQuadrantMouseEnter(opt.id)}
                  onMouseLeave={handleQuadrantMouseLeave}
                  className={`relative p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 select-none ${
                    isSelected
                      ? 'bg-neutral-900 border-white shadow-xl scale-[1.01]'
                      : 'bg-black border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-neutral-800 px-2 py-0.5 rounded-md border border-neutral-700">
                      {opt.tag}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">Quadrant #{opt.id}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{opt.title}</h4>
                  <p className="text-xs text-neutral-400 font-medium">{opt.token}</p>

                  {/* Dwell Progress Bar */}
                  {isSelected && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                        <div
                          className="h-full bg-white transition-all duration-75 ease-linear"
                          style={{ width: `${dwellProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-white mt-1 font-mono">
                        <span>Fixation Dwell</span>
                        <span>{dwellProgress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Real-time Generated Speech Output Bar */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition ${
                  isSynthesizing ? 'bg-white text-black' : 'bg-neutral-800 text-white'
                }`}
              >
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Synthesized Audio & Slack Broadcast
                </div>
                <div className="text-xs sm:text-sm text-neutral-200 font-medium italic mt-0.5">
                  "{expandedSpeech}"
                </div>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs flex-shrink-0 transition"
            >
              Try with Webcam →
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PILLARS & FEATURES SECTION */}
      <section id="features" className="py-20 border-t border-neutral-900 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 px-3 py-1 rounded-full border border-neutral-700">
              Core Architectural Pillars
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
              Engineered for High-Velocity Technical Collaboration
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-4">
              Traditional assistive tools treat communication as a slow typing chore. Dialectica rearchitects the experience for professional autonomy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-3xl bg-black border border-neutral-800 hover:border-neutral-600 transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero-Hardware Gaze HUD</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                Tracks 478 MediaPipe facial landmarks and extracts raw iris displacement vectors normalized against eye corner anchors with dynamic EMA velocity smoothing.
              </p>
              <ul className="text-xs text-neutral-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Sub-350ms dwell fixation detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Deliberate eye-closure (&gt;800ms) cancel safeguard</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-3xl bg-black border border-neutral-800 hover:border-neutral-600 transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Generative Intent Expansion</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                Powered by Google Gemini 1.5 Flash. Continuously ingests incoming meeting speech or code diffs, distilling them into 4 contextual responses in sub-second latency.
              </p>
              <ul className="text-xs text-neutral-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Adapts to Professional, Direct, or Casual tones</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Expands short intent tokens into fluent technical speech</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-3xl bg-black border border-neutral-800 hover:border-neutral-600 transition-all duration-200">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white mb-6">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Floor Reservation Beacon</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                Solves the #1 cause of AAC exclusion: being spoken over before typing completes. At 90ms gaze, plays an acoustic chime and broadcasts an active speech reserve beacon.
              </p>
              <ul className="text-xs text-neutral-400 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Acoustic turn-taking reserve signal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Cross-window broadcast to Slack & Floating PiP HUD</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* "FEEL THE GAP" BENCHMARK SECTION (Black & White) */}
      <section id="benchmark" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-neutral-950 border border-neutral-800 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 px-3 py-1 rounded-full border border-neutral-700">
              Live Clinical Benchmark
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              Feel the Gap: Traditional AAC vs. Dialectica
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-3">
              Experience the friction of traditional 8-WPM eye keyboards versus Dialectica’s 0.82-second micro-gaze bridge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Traditional Eye Keyboard Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-black border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Traditional AAC Keyboard
                  </span>
                  <span className="text-xs font-mono text-neutral-500">8 Words / Min</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  Spelling 12 Words Letter-by-Letter
                </h4>
                <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                  Requires 60+ individual ocular fixations. Takes <strong className="text-white">42.5 seconds</strong>. Teammates often speak over the engineer, creating intense social exhaustion.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
                <div className="flex items-center justify-between text-neutral-300 font-mono mb-2">
                  <span>Duration: 42.5s</span>
                  <span className="text-white font-bold">Physical Fatigue: High</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-neutral-500 w-[15%]" />
                </div>
              </div>
            </div>

            {/* Dialectica Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-white flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Dialectica Micro-Gaze Bridge
                  </span>
                  <span className="text-xs font-mono text-white font-bold">130+ Words / Min</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  1 Single 350ms Fixation + Generative Expansion
                </h4>
                <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
                  A 350ms glance at a contextual card triggers real-time Gemini intent synthesis. Spoken in <strong className="text-white">0.82 seconds</strong> (<strong className="text-white">51.8x speedup</strong> with zero physical fatigue).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black border border-neutral-700 text-xs text-white">
                <div className="flex items-center justify-between font-mono mb-2">
                  <span className="font-bold">Duration: 0.82s</span>
                  <span className="font-bold">Speedup: 51.8x</span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[100%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CODE REVIEW & REPOSITORY BRIDGE */}
      <section className="py-20 border-t border-neutral-900 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-neutral-900 px-3 py-1 rounded-full border border-neutral-700">
                Autonomous Senior Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
                Gaze-Driven GitHub Pull Request Review Bridge
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
                Empowers senior motor-impaired developers to lead architectural discussions and pair program. Dialectica parses PR diffs (e.g. distributed locking, JWT security) and generates four high-impact technical reviews.
              </p>

              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <GitPullRequest className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Line-by-Line Commenting & Verbal Review</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Fixation simultaneously vocalizes the code review in the live call and posts inline comments to the PR thread.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Always-On-Top Floating HUD</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Pop-out Picture-in-Picture window floats over VS Code, GitHub, Zoom, or Google Meet without obstructing the screen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition"
                >
                  <span>Test Code Review Bridge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual Code Bridge Representation */}
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4 text-neutral-400">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-white" />
                  <span className="font-semibold text-white">PR #412: Distributed Lock</span>
                </div>
                <span className="text-[10px] bg-neutral-900 text-white border border-neutral-700 px-2 py-0.5 rounded-full font-mono">
                  All 42 Tests Passed
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black border border-neutral-800 mb-4 space-y-1 text-neutral-300">
                <div className="text-neutral-500">// src/middleware/auth.ts</div>
                <div className="text-neutral-400">- await redis.set(lockKey, 'locked');</div>
                <div className="text-white font-bold">+ await redis.set(lockKey, 'locked', 'PX', 5000, 'NX');</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-white text-white">
                  <div className="font-bold">Approve & Merge</div>
                  <div className="text-[10px] text-neutral-400">Verify TTL & tests</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black border border-neutral-800 text-neutral-400">
                  <div className="font-bold text-neutral-300">Request Changes</div>
                  <div className="text-[10px] text-neutral-500">Handle race condition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl relative">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Ready to Experience Dialectica?
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto mb-8">
            Empower motor- and speech-impaired engineers with zero hardware barrier. Experience the live Assistive Cockpit in your browser right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={openGoogleModal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-sm shadow-xl transition flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#000000"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#000000"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#000000"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-white text-white font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 group"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black font-black">
              <Zap className="w-4 h-4 fill-black" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight">Dialectica</span>
              <p className="text-[11px] text-neutral-400">Zero-Hardware Assistive Cognitive Bridge</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-400">
            <Link href="/dashboard" className="hover:text-white transition">Cockpit Suite</Link>
            <Link href="/login" className="hover:text-white transition">Sign In</Link>
            <Link href="/signup" className="hover:text-white transition">Sign Up</Link>
            <Link href="/hud" className="hover:text-white transition">Floating HUD</Link>
          </div>

          <div className="text-xs text-neutral-500 text-center md:text-right">
            <div>Dialectica • Built for GDG NSUT Devlympics – Shunya 2026</div>
            <div className="text-[11px] text-neutral-600 mt-0.5">Theme: Bridge the Gap</div>
          </div>
        </div>
      </footer>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={closeGoogleModal}
        onSuccess={() => router.push('/dashboard')}
      />
    </div>
  );
}
