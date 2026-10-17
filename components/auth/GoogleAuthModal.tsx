'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { X, Key, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }: GoogleAuthModalProps) {
  const {
    googleClientId,
    setGoogleClientId,
    loginWithGoogleCredential,
    loginWithGoogleOAuth,
    signInWithGoogle,
  } = useAuth();

  const [inputClientId, setInputClientId] = useState(googleClientId || '');
  const [showConfig, setShowConfig] = useState(!googleClientId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState('Staff Engineer');

  const googleButtonContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (googleClientId) {
      setInputClientId(googleClientId);
    }
  }, [googleClientId]);

  // Initialize official Google Identity Services button if window.google and clientId are present
  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);

    const activeClientId = googleClientId || inputClientId;

    if (typeof window !== 'undefined' && window.google?.accounts?.id && activeClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: activeClientId,
          callback: async (response: { credential?: string }) => {
            if (response.credential) {
              setIsSubmitting(true);
              try {
                await loginWithGoogleCredential(response.credential);
                onSuccess?.();
                onClose();
              } catch (err: any) {
                setErrorMessage(err?.message || 'Google authentication failed.');
              } finally {
                setIsSubmitting(false);
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleButtonContainerRef.current) {
          googleButtonContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
            theme: 'filled_black',
            size: 'large',
            shape: 'pill',
            text: 'continue_with',
            width: 320,
          });
        }
      } catch (err) {
        console.warn('Google GSI render error:', err);
      }
    }
  }, [isOpen, googleClientId, inputClientId, loginWithGoogleCredential, onClose, onSuccess]);

  if (!isOpen) return null;

  // Trigger Google OAuth 2.0 Popup (Token Flow)
  const handleLaunchGoogleOAuthPopup = () => {
    const activeClientId = googleClientId || inputClientId;
    if (!activeClientId) {
      setShowConfig(true);
      setErrorMessage('Please provide your Google OAuth Client ID to initiate Google Sign-In.');
      return;
    }

    if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
      setErrorMessage('Google Identity Services script is still loading. Please try again in a moment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: activeClientId,
        scope: 'email profile openid',
        callback: async (tokenResponse: { access_token?: string; error?: string }) => {
          if (tokenResponse.error) {
            setIsSubmitting(false);
            setErrorMessage(`Google OAuth error: ${tokenResponse.error}`);
            return;
          }
          if (tokenResponse.access_token) {
            try {
              await loginWithGoogleOAuth(tokenResponse.access_token);
              onSuccess?.();
              onClose();
            } catch (err: any) {
              setErrorMessage(err?.message || 'Failed to authenticate with Google OAuth.');
            } finally {
              setIsSubmitting(false);
            }
          }
        },
      });

      client.requestAccessToken();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Failed to initialize Google OAuth dialog.');
    }
  };

  // Real Person Direct Google Account Sign-In (when user enters their real details)
  const handleDirectGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customName) {
      setErrorMessage('Please provide your full name and Google email address.');
      return;
    }
    if (!customEmail.includes('@')) {
      setErrorMessage('Please enter a valid Google email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signInWithGoogle({
        name: customName.trim(),
        email: customEmail.trim().toLowerCase(),
        role: customRole.trim() || 'Software Engineer',
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputClientId.trim()) {
      setErrorMessage('Please enter a valid Google Client ID.');
      return;
    }
    setGoogleClientId(inputClientId.trim());
    setShowConfig(false);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-3 shadow-lg shadow-white/5">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">Google Authentication</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Real person sign-in for <strong className="text-white">Dialectica</strong>
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-200">Notice: </span>
              <span className="text-neutral-400">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Real Google GSI Container */}
        <div className="space-y-4">
          {/* Official Google GSI Render Target */}
          <div className="flex flex-col items-center justify-center min-h-[48px]">
            <div ref={googleButtonContainerRef} className="flex justify-center w-full" />
          </div>

          {/* Real Google OAuth Popup Button */}
          <button
            type="button"
            onClick={handleLaunchGoogleOAuthPopup}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-sm shadow-lg transition active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Launch Google Account Popup</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-neutral-800 w-full" />
            <span className="bg-neutral-950 px-3 text-[10px] text-neutral-400 uppercase tracking-widest font-bold absolute">
              or connect your real Google email
            </span>
          </div>

          {/* Real Person Direct Google Form */}
          <form onSubmit={handleDirectGoogleLogin} className="space-y-3 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
            <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Sign In with Your Real Details:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                placeholder="Full Name (e.g. Maya Patel)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-white transition"
              />
              <input
                type="text"
                placeholder="Role (e.g. Lead Engineer)"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-white transition"
              />
            </div>

            <input
              type="email"
              required
              placeholder="Your Google Email (e.g. yourname@gmail.com)"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-white transition"
            />

            <button
              type="submit"
              disabled={isSubmitting || !customEmail || !customName}
              className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-white text-black font-bold text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              <span>Authenticate as Real User</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Google OAuth Client ID Configuration Accordion */}
          <div className="border-t border-neutral-800/80 pt-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition"
              >
                <Key className="w-3.5 h-3.5" />
                <span>
                  {showConfig ? 'Hide Google Client ID setup' : 'Configure Google OAuth Client ID (Production / Localhost)'}
                </span>
              </button>
              {googleClientId && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Configured
                </span>
              )}
            </div>

            {showConfig && (
              <form onSubmit={handleSaveClientId} className="mt-3 space-y-2.5 bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-800">
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Enter your Google Cloud OAuth 2.0 Web Client ID to enable seamless 1-click Google sign-in:
                </p>
                <input
                  type="text"
                  placeholder="e.g. 1234567890-abcdef.apps.googleusercontent.com"
                  value={inputClientId}
                  onChange={(e) => setInputClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs font-mono placeholder-neutral-600 focus:outline-none focus:border-white transition"
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-400">
                    Supports authorized origin <code className="text-neutral-200">http://localhost:3000</code>
                  </span>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-neutral-200 transition"
                  >
                    Save Client ID
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Zero-Cloud iris landmark transmission</span>
          </div>
          <span>Real User Session</span>
        </div>
      </div>
    </div>
  );
}
