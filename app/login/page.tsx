'use client';

import React, { useState, useEffect } from 'react';
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
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  ArrowRight,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithEmail, isGoogleModalOpen, openGoogleModal, closeGoogleModal } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, allow 1-click continuation
  const handleContinueAsLoggedIn = () => {
    router.push('/dashboard');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoadingEmail(true);

    try {
      await signInWithEmail(email, password);
      setSuccessMsg('Authenticated successfully. Entering Dialectica Cockpit...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
      setIsLoadingEmail(false);
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
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="max-w-md w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          {/* Active User Alert */}
          {user && (
            <div className="mb-6 p-4 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-between text-xs">
              <div>
                <div className="text-neutral-400">Currently active:</div>
                <div className="font-bold text-white">{user.name} ({user.email})</div>
              </div>
              <button
                type="button"
                onClick={handleContinueAsLoggedIn}
                className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition"
              >
                Dashboard →
              </button>
            </div>
          )}

          {/* Badge */}
          <div className="flex items-center justify-center mb-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-900 text-neutral-200 border border-neutral-700">
              Authentication Portal
            </span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign in to Dialectica
            </h1>
            <p className="text-xs text-neutral-400 mt-2">
              Access your zero-hardware assistive cockpit and live collaboration telemetry.
            </p>
          </div>

          {/* Error & Success Messages */}
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
            {/* Google Sign In Button */}
            <GoogleButton
              onClick={openGoogleModal}
              text="Continue with Google"
            />

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-neutral-800 w-full" />
              <span className="bg-neutral-950 px-3 text-[10px] text-neutral-400 uppercase tracking-widest font-bold absolute">
                or sign in with email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Password
                  </label>
                  <Link
                    href="/signup"
                    className="text-[11px] text-neutral-400 hover:text-white transition underline"
                  >
                    Need an account?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white transition"
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

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-900 text-white focus:ring-white"
                  />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoadingEmail}
                className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm shadow-lg transition active:scale-[0.99] disabled:opacity-50"
              >
                {isLoadingEmail ? 'Verifying Credentials...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Footer inside card */}
          <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-400">
            Don't have an account yet?{' '}
            <Link
              href="/signup"
              className="text-white hover:underline font-bold transition ml-1"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3 z-10 border-t border-neutral-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Client-Side Vision Security • WCAG AAA & HIPAA Zero-Storage Compliant</span>
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
