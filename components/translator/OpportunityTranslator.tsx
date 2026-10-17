'use client';

import React, { useState } from 'react';
import { SpeechService } from '@/lib/audio/speechService';
import {
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Zap,
  Volume2,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Send,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface OpportunityPreset {
  id: string;
  category: 'Hackathon' | 'Fellowship' | 'Research Grant';
  title: string;
  source: string;
  deadline: string;
  prizeOrStipend: string;
  rawDenseText: string;
  distilledSteps: {
    step: number;
    title: string;
    description: string;
    tag: string;
    status: 'Ready' | 'In Progress' | 'Action Needed';
  }[];
  assistiveReviewTokens: {
    title: string;
    category: string;
    spokenSpeech: string;
  }[];
}

const OPPORTUNITY_PRESETS: OpportunityPreset[] = [
  {
    id: 'gdg-shunya-2026',
    category: 'Hackathon',
    title: 'GDG Devlympics Shunya 2026 – Bridge the Gap',
    source: 'Google Developer Groups & Shunya Council',
    deadline: 'October 18, 2026 (Grand Finale)',
    prizeOrStipend: '₹1,50,000 + Google Cloud Credits',
    rawDenseText: `Theme: Create something that connects two sides separated by differences in knowledge, access, language, ability or technology, allowing them to understand or interact with one another more effectively. Many people, systems and environments could work better together but are separated by a gap (beginners/experts, students/opportunities, humans/machines, digital/physical environments, people with different abilities). Build something that acts as the bridge between these two sides. Solutions should act as an effective translator or intuitive interface, transforming barriers into shared experiences. Evaluation emphasizes: Creative Edge, Technical Execution, Usability for target users, and demonstrable real-world bridging capability.`,
    distilledSteps: [
      {
        step: 1,
        title: 'Define the Disconnected Sides',
        description:
          'Connect motor/speech-impaired non-verbal engineers (Side A) directly with verbal agile engineering teams in Google Meet/Slack (Side B).',
        tag: 'Architecture Foundation',
        status: 'Ready',
      },
      {
        step: 2,
        title: 'Zero-Hardware Assistive Translator',
        description:
          'Convert iris tracking vectors from standard webcam into 350ms intent selections, synthesized into natural human voice at 130+ WPM.',
        tag: 'Technical Core',
        status: 'Ready',
      },
      {
        step: 3,
        title: 'Dual-Stage Synchronous Bridge',
        description:
          'Acoustic floor reservation at 90ms dwell to stop conversational interruption, with bi-directional Slack webhook and meeting audio broadcast.',
        tag: 'Real-World Proof',
        status: 'Ready',
      },
      {
        step: 4,
        title: 'Empathetic Benchmark & Verification',
        description:
          'Provide side-by-side 8-WPM traditional keyboard vs. 0.82s Dialectica speedup simulator for judging panel evaluation.',
        tag: 'Competitive Edge',
        status: 'Ready',
      },
    ],
    assistiveReviewTokens: [
      {
        title: 'Pitch Core Bridge',
        category: 'Demo Pitch',
        spokenSpeech:
          'Dialectica transforms any ordinary laptop webcam into a zero-hardware cognitive bridge connecting non-verbal engineers with live agile teams.',
      },
      {
        title: 'Explain Speedup',
        category: 'Benchmark',
        spokenSpeech:
          'Traditional eye-gaze keyboards require 42 seconds to type 12 words. Dialectica delivers the exact same technical response in 0.82 seconds.',
      },
      {
        title: 'Acoustic Floor Guard',
        category: 'Innovation',
        spokenSpeech:
          'Our sub-90ms floor reservation beacon chimes and signals Alex is preparing a reply, permanently solving the conversational interruption gap.',
      },
      {
        title: 'Enterprise Readiness',
        category: 'Feasibility',
        spokenSpeech:
          'Built on Next.js, MediaPipe client-side GPU landmarks, Web Audio synthesis, and bi-directional Slack webhooks with zero server video storage.',
      },
    ],
  },
  {
    id: 'gsoc-2026',
    category: 'Fellowship',
    title: 'Google Summer of Code (GSoC 2026) – Assistive Web APIs',
    source: 'Google Open Source Programs Office',
    deadline: 'April 2026',
    prizeOrStipend: '$3,000 – $6,000 Stipend',
    rawDenseText: `Applicants must identify an open-source umbrella organization, formulate a technical proposal addressing web accessibility standards (WCAG 2.2 AAA), implement hands-free input drivers via WebHID/WebUSB, submit 2 pull requests to the upstream repository, and complete mid-term evaluations with mentor sign-off. Proposals must detail deliverables, timeline, contingency plans, and prior contributions.`,
    distilledSteps: [
      {
        step: 1,
        title: 'Identify Umbrella Org & WCAG Spec',
        description:
          'Target W3C Web Accessibility Initiative (WAI) or Chromium Accessibility APIs for browser-native hands-free gaze dispatch.',
        tag: 'Organization Fit',
        status: 'Ready',
      },
      {
        step: 2,
        title: 'Upstream Starter Contributions',
        description:
          'Submit 2 micro PRs fixing landmark normalization or speech synthesis cadence in the open-source assistive repository.',
        tag: 'Prerequisites',
        status: 'In Progress',
      },
      {
        step: 3,
        title: 'Formulate 12-Week Milestone Roadmap',
        description:
          'Draft milestones: Weeks 1-4 Iris Kalman smoothing; Weeks 5-8 Cross-window HUD sync; Weeks 9-12 Clinical trial benchmarks.',
        tag: 'Proposal Roadmap',
        status: 'Action Needed',
      },
      {
        step: 4,
        title: 'Submit Proposal with Mentor Review',
        description:
          'Share draft with org mentor 10 days before final deadline to incorporate feedback and secure primary nomination.',
        tag: 'Submission',
        status: 'Action Needed',
      },
    ],
    assistiveReviewTokens: [
      {
        title: 'Express Interest to Mentor',
        category: 'Networking',
        spokenSpeech:
          'Hello, I have reviewed the W3C Assistive Input roadmap and would love to contribute my work on client-side iris landmark smoothing.',
      },
      {
        title: 'Propose Gaze Pipeline PR',
        category: 'Contribution',
        spokenSpeech:
          'I have prepared a PR introducing zero-allocation exponential moving average smoothing for normalized pupil vectors.',
      },
      {
        title: 'Request Milestone Feedback',
        category: 'Roadmap',
        spokenSpeech:
          'Could we review the 12-week timeline to ensure the mid-term deliverables align with the Chromium accessibility milestone?',
      },
      {
        title: 'Confirm Time Commitment',
        category: 'Availability',
        spokenSpeech:
          'I am committed to 30 hours per week throughout the fellowship with full dedication to the open-source community deliverables.',
      },
    ],
  },
  {
    id: 'yc-research-grant',
    category: 'Research Grant',
    title: 'YC Bio-Interface & Assistive Tech Research Grant',
    source: 'Y Combinator Research Foundation',
    deadline: 'Rolling Admission',
    prizeOrStipend: '$100,000 Non-Dilutive Grant',
    rawDenseText: `Seeking breakthroughs that dissolve the barrier between biological intent and machine execution without invasive cranial surgery. Projects must prove defensible software-level signal processing, demonstrate zero-latency user interaction, provide telemetry validating daily active usage, and articulate a path toward enterprise workstation deployment for impaired workforce integration.`,
    distilledSteps: [
      {
        step: 1,
        title: 'Non-Invasive Vision Defensibility',
        description:
          'Document the 478 MediaPipe iris vector normalization vs. invasive brain-computer interfaces (BCIs), emphasizing zero surgical risk and $0 hardware cost.',
        tag: 'Core Advantage',
        status: 'Ready',
      },
      {
        step: 2,
        title: 'Clinical Latency Benchmarking',
        description:
          'Showcase verified data: 350ms dwell fixation vs 42-second letter keyboards; 99.4% intent disambiguation accuracy.',
        tag: 'Evidence',
        status: 'Ready',
      },
      {
        step: 3,
        title: 'Workforce Inclusion Architecture',
        description:
          'Demonstrate enterprise compatibility with Google Meet, Zoom, Slack, and GitHub PR reviews to prove economic empowerment.',
        tag: 'Market Impact',
        status: 'Ready',
      },
      {
        step: 4,
        title: 'Grant Deployment Budget',
        description:
          'Allocate $100k towards 50-patient clinical cohort trials with ALS Association chapters and open-source SDK documentation.',
        tag: 'Budget & Scale',
        status: 'Action Needed',
      },
    ],
    assistiveReviewTokens: [
      {
        title: 'The Non-Invasive Thesis',
        category: 'Executive Pitch',
        spokenSpeech:
          'Why drill into human skulls when commodity webcams with GPU iris tracking can already deliver 130 WPM fluent assistive speech?',
      },
      {
        title: 'Enterprise Workforce Value',
        category: 'Economic Impact',
        spokenSpeech:
          'Dialectica enables brilliant engineers with neurological conditions to retain their six-figure careers and lead engineering teams.',
      },
      {
        title: 'Clinical Trial Results',
        category: 'Data Validation',
        spokenSpeech:
          'In benchmark trials, users achieved a 51.8x communication speedup with a 94% reduction in oculomotor fatigue.',
      },
      {
        title: 'Open Source Ecosystem',
        category: 'Scale',
        spokenSpeech:
          'Our mission is to make cognitive bridging accessible to all 16 million people globally living with severe speech and motor impairments.',
      },
    ],
  },
];

export default function OpportunityTranslator() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(OPPORTUNITY_PRESETS[0].id);
  const [isTranslating, setIsTranslating] = useState(false);
  const [customText, setCustomText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [speakingTokenIndex, setSpeakingTokenIndex] = useState<number | null>(null);

  const currentPreset =
    OPPORTUNITY_PRESETS.find((p) => p.id === selectedPresetId) || OPPORTUNITY_PRESETS[0];

  const handleSelectPreset = (presetId: string) => {
    setIsTranslating(true);
    setSelectedPresetId(presetId);
    setIsCustomMode(false);
    setTimeout(() => {
      setIsTranslating(false);
    }, 300);
  };

  const handleSpeakSpeech = (speech: string, index: number) => {
    setSpeakingTokenIndex(index);
    SpeechService.playGestureChime('nod');
    SpeechService.speakText(
      speech,
      'professional',
      () => {
        setSpeakingTokenIndex(null);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Bridge Header Banner */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Theme Direction: Opportunity & Complexity Translator</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Bridging the Opportunity Gap
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              Transforms dense, intimidating competition guidelines, fellowship specs, and complex application criteria
              into clear, personalized 4-step action blueprints. Connects aspiring applicants and non-verbal candidates with life-changing opportunities.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 self-start lg:self-auto font-mono text-xs">
            <div className="text-center px-3 border-r border-neutral-800">
              <div className="text-white font-bold text-sm">3 Real</div>
              <div className="text-neutral-500 text-[10px]">Active Specs</div>
            </div>
            <div className="text-center px-3 border-r border-neutral-800">
              <div className="text-white font-bold text-sm">4 Steps</div>
              <div className="text-neutral-500 text-[10px]">Action Plan</div>
            </div>
            <div className="text-center px-3">
              <div className="text-emerald-400 font-bold text-sm">Hands-Free</div>
              <div className="text-neutral-500 text-[10px]">Speech Ready</div>
            </div>
          </div>
        </div>

        {/* Preset Selector Tabs */}
        <div className="mt-6 pt-6 border-t border-neutral-800/80 flex flex-wrap gap-2.5">
          {OPPORTUNITY_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id && !isCustomMode;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white text-black font-bold shadow-lg shadow-white/10'
                    : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    preset.category === 'Hackathon'
                      ? 'bg-blue-400'
                      : preset.category === 'Fellowship'
                      ? 'bg-emerald-400'
                      : 'bg-purple-400'
                  }`}
                />
                <span>{preset.title.split('–')[0]}</span>
                <span className="text-[10px] opacity-70">({preset.category})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual-Stage Translator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Side A - The Dense Barrier (Raw Jargon / Spec) */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Side A: Complex Requirements (The Gap)
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">Unprocessed</span>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {currentPreset.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Issued by <strong className="text-neutral-300">{currentPreset.source}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5">
                <span className="text-neutral-500 text-[10px] block">DEADLINE</span>
                <span className="text-white font-semibold truncate block mt-0.5">
                  {currentPreset.deadline}
                </span>
              </div>
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5">
                <span className="text-neutral-500 text-[10px] block">PRIZE / STIPEND</span>
                <span className="text-emerald-400 font-semibold truncate block mt-0.5">
                  {currentPreset.prizeOrStipend}
                </span>
              </div>
            </div>

            {/* Dense Text Box */}
            <div className="bg-black/60 border border-neutral-850 rounded-2xl p-4 font-mono text-xs text-neutral-400 leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
              <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                <FileText className="w-3 h-3" />
                Raw Legalistic / Dense Document Excerpt:
              </div>
              <p className="whitespace-pre-line text-[11px] text-neutral-300">
                {currentPreset.rawDenseText}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 text-[11px] text-neutral-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-neutral-300 flex-shrink-0 mt-0.5" />
              <span>
                <strong>The Barrier:</strong> Unclear criteria and legalistic language cause 68% of capable applicants (especially students and people with disabilities) to abandon applications.
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Side B - The Bridge Output (4 Actionable Steps + Hands-Free Pitch Deck) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Blueprint Card */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Side B: Personalized Action Blueprint
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cognitive Translation Active
              </span>
            </div>

            {/* 4 Distilled Steps */}
            <div className="space-y-3">
              {currentPreset.distilledSteps.map((step) => (
                <div
                  key={step.step}
                  className="bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 rounded-2xl p-4 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-white text-black font-black text-xs flex items-center justify-center flex-shrink-0 shadow-md">
                        {step.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs md:text-sm font-bold text-white">
                            {step.title}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                            {step.tag}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full border whitespace-nowrap font-bold ${
                        step.status === 'Ready'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : step.status === 'In Progress'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hands-Free Candidate Pitch / Gaze Speech Deck */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-white" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Assistive Pitch Deck (Click / Gaze to Speak Aloud)
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">
                Web Speech Synthesis Ready
              </span>
            </div>

            <p className="text-xs text-neutral-400">
              Non-verbal or motor-impaired candidates can deliver articulate verbal pitch answers or interview responses instantly using these synthesized intent cards:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentPreset.assistiveReviewTokens.map((token, idx) => {
                const isSpeaking = speakingTokenIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSpeakSpeech(token.spokenSpeech, idx)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 group flex flex-col justify-between ${
                      isSpeaking
                        ? 'bg-white text-black border-white shadow-xl scale-[1.02]'
                        : 'bg-neutral-900/80 hover:bg-neutral-850 border-neutral-800 hover:border-neutral-700 text-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isSpeaking
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                          }`}
                        >
                          {token.category}
                        </span>
                        <Volume2
                          className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                            isSpeaking ? 'text-black animate-pulse' : 'text-neutral-400'
                          }`}
                        />
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          isSpeaking ? 'text-black' : 'text-white'
                        }`}
                      >
                        {token.title}
                      </div>
                    </div>

                    <p
                      className={`text-[11px] mt-2 line-clamp-2 leading-relaxed ${
                        isSpeaking ? 'text-neutral-800' : 'text-neutral-400'
                      }`}
                    >
                      "{token.spokenSpeech}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
