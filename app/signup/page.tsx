'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import GoogleButton from '@/components/auth/GoogleButton';
import GoogleAuthModal from '@/components/auth/GoogleAuthModal';
import {
  Zap,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Briefcase,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isGoogleModalOpen, openGoogleModal, closeGoogleModal } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Senior Staff Engineer');
  const [tone, setTone] = useState<'professional' | 'direct' | 'casual'>('professional');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreeTerms) {
      setError('Please accept the client-side privacy agreement to continue.');
      return;
    }

    setIsLoadingForm(true);
    try {
      await signUp(name, email, password, role, tone);
      setSuccessMsg('Account registered successfully! Entering your Dialectica Cockpit...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check inputs.');
      setIsLoadingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-white selection:text-black relative overflow-hidden">
      {/* Background ambient monochrome blur */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-neutral-800/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="flex items-center gap-2 group text-neutral-400 hover:text-white transition text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black font-black">
            <Zap className="w-4 h-4 fill-black" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            Dialectica
          </span>
        </Link>
      </header>

      {/* Main Form Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 z-10">
        <div className="max-w-lg w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          {/* Badge */}
          <div className="flex items-center justify-center mb-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-900 text-neutral-200 border border-neutral-700">
              Create an Account
            </span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Join Dialectica
            </h1>
            <p className="text-xs text-neutral-400 mt-2">
              Transform your commodity webcam into an assistive zero-hardware voice bridge.
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-neutral-900 border border-neutral-600 text-white text-xs flex items-start gap-2">
              <span className="font-bold text-neutral-300">Error:</span> {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-neutral-900 border border-white text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Google Sign Up Button */}
            <GoogleButton
              onClick={openGoogleModal}
              text="Sign up with Google"
            />

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-neutral-800 w-full" />
              <span className="bg-neutral-950 px-3 text-[10px] text-neutral-400 uppercase tracking-widest font-bold absolute">
                or configure custom profile
              </span>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Professional Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Software Engineer"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-white transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Default Generative Speech Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['professional', 'direct', 'casual'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition ${
                        tone === t
                          ? 'bg-white text-black border-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-400">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-white focus:ring-white"
                  />
                  <span>
                    I understand that Dialectica processes 478 MediaPipe iris landmarks 100% locally in browser memory with zero video telemetry storage.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoadingForm}
                className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm shadow-lg active:scale-[0.99] transition disabled:opacity-50"
              >
                {isLoadingForm ? 'Registering...' : 'Create Account'}
              </button>
            </form>
          </div>

          {/* Footer inside card */}
          <div className="mt-6 pt-5 border-t border-neutral-800 text-center text-xs text-neutral-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-white hover:underline font-bold transition ml-1"
            >
              Sign in to Dialectica
            </Link>
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3 z-10 border-t border-neutral-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>WCAG 2.2 AAA Accessibility Compliant • Zero Cloud Image Transmission</span>
        </div>
        <div>
          Dialectica Platform © 2026.
        </div>
      </footer>

      {/* Google Auth Account Chooser Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={closeGoogleModal}
        onSuccess={() => {
          setSuccessMsg('Google Account verified! Entering Dialectica...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 400);
        }}
      />
    </div>
  );
}
