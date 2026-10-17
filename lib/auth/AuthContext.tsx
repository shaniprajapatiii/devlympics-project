'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  provider: 'google' | 'email';
  techStack?: string;
  tone?: 'professional' | 'direct' | 'casual';
  passwordHash?: string;
  createdAt: string;
}

const SESSION_STORAGE_KEY = 'dialectica_active_session_v3';
const USERS_DB_KEY = 'dialectica_registered_accounts_v3';
const GOOGLE_CLIENT_ID_KEY = 'dialectica_google_client_id_v3';

export function decodeGoogleJwt(token: string): {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
} | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode Google JWT token:', e);
    return null;
  }
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  googleClientId: string;
  setGoogleClientId: (id: string) => void;
  signInWithGoogle: (account?: { name: string; email: string; avatar?: string; role?: string; sub?: string }) => Promise<UserProfile>;
  loginWithGoogleCredential: (credentialToken: string) => Promise<UserProfile>;
  loginWithGoogleOAuth: (accessToken: string) => Promise<UserProfile>;
  signInWithEmail: (email: string, password: string) => Promise<UserProfile>;
  signUp: (name: string, email: string, password: string, role?: string, tone?: 'professional' | 'direct' | 'casual') => Promise<UserProfile>;
  signOut: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  isGoogleModalOpen: boolean;
  openGoogleModal: () => void;
  closeGoogleModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleClientId, setGoogleClientIdState] = useState<string>('');

  // Helper: Read registered accounts database (no hardcoded users)
  const getRegisteredUsers = useCallback((): UserProfile[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load registered accounts:', e);
    }
    return [];
  }, []);

  // Helper: Save accounts database
  const saveRegisteredUsers = (users: UserProfile[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users database', e);
    }
  };

  const setGoogleClientId = (id: string) => {
    const clean = id.trim();
    setGoogleClientIdState(clean);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clean);
      } catch (e) {}
    }
  };

  // Initialize session on mount
  useEffect(() => {
    try {
      // Load saved Google Client ID if present
      const envClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      const savedClientId = localStorage.getItem(GOOGLE_CLIENT_ID_KEY) || '';
      setGoogleClientIdState(savedClientId || envClientId);

      // Read active session
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.warn('Session initialization error', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<UserProfile> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setIsLoading(false);
      throw new Error('Please enter your email address.');
    }
    if (!cleanPassword) {
      setIsLoading(false);
      throw new Error('Please enter your password.');
    }

    const accounts = getRegisteredUsers();
    const existing = accounts.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!existing) {
      setIsLoading(false);
      throw new Error('No registered account found with this email. Please sign up first.');
    }

    if (existing.passwordHash && existing.passwordHash !== cleanPassword) {
      setIsLoading(false);
      throw new Error('Incorrect password. Please verify and try again.');
    }

    // Authenticated successfully!
    const sessionUser = { ...existing };
    setUser(sessionUser);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    } catch (e) {}
    setIsLoading(false);
    return sessionUser;
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    role: string = 'Software Engineer',
    tone: 'professional' | 'direct' | 'casual' = 'professional'
  ): Promise<UserProfile> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName) {
      setIsLoading(false);
      throw new Error('Please enter your full name.');
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setIsLoading(false);
      throw new Error('Please enter a valid email address.');
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setIsLoading(false);
      throw new Error('Password must be at least 6 characters long.');
    }

    const accounts = getRegisteredUsers();
    const existing = accounts.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      setIsLoading(false);
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      role: role || 'Software Engineer',
      provider: 'email',
      techStack: 'Full-Stack Systems, TypeScript, AI',
      tone,
      passwordHash: cleanPassword,
      createdAt: new Date().toISOString(),
    };

    const updatedAccounts = [...accounts, newUser];
    saveRegisteredUsers(updatedAccounts);

    setUser(newUser);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
    } catch (e) {}
    setIsLoading(false);
    return newUser;
  };

  // Sign in using real Google Identity Services JWT credential
  const loginWithGoogleCredential = async (credentialToken: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const payload = decodeGoogleJwt(credentialToken);
      if (!payload || !payload.email) {
        throw new Error('Invalid Google credential token received.');
      }

      const googleEmail = payload.email.toLowerCase();
      const googleName = payload.name || payload.given_name || googleEmail.split('@')[0];
      const googleAvatar = payload.picture;
      const googleSub = payload.sub || `usr_g_${Date.now()}`;

      const accounts = getRegisteredUsers();
      let userRecord = accounts.find((u) => u.email.toLowerCase() === googleEmail);

      if (!userRecord) {
        userRecord = {
          id: googleSub,
          name: googleName,
          email: googleEmail,
          avatar: googleAvatar,
          role: 'Member / Engineer',
          provider: 'google',
          techStack: 'Web, TypeScript, AI Assistive',
          tone: 'professional',
          createdAt: new Date().toISOString(),
        };
        saveRegisteredUsers([...accounts, userRecord]);
      } else {
        userRecord = {
          ...userRecord,
          name: userRecord.name || googleName,
          provider: 'google',
          avatar: googleAvatar || userRecord.avatar,
        };
        const updatedAccounts = accounts.map((u) => (u.id === userRecord!.id ? userRecord! : u));
        saveRegisteredUsers(updatedAccounts);
      }

      setUser(userRecord);
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userRecord));
      } catch (e) {}
      setIsGoogleModalOpen(false);
      return userRecord;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in using Google OAuth 2.0 access token via UserInfo endpoint
  const loginWithGoogleOAuth = async (accessToken: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve user profile from Google OAuth.');
      }
      const data = await res.json();
      if (!data.email) {
        throw new Error('Google OAuth profile does not include a verified email address.');
      }

      const googleEmail = data.email.toLowerCase();
      const googleName = data.name || data.given_name || googleEmail.split('@')[0];
      const googleAvatar = data.picture;
      const googleSub = data.sub || `usr_g_${Date.now()}`;

      const accounts = getRegisteredUsers();
      let userRecord = accounts.find((u) => u.email.toLowerCase() === googleEmail);

      if (!userRecord) {
        userRecord = {
          id: googleSub,
          name: googleName,
          email: googleEmail,
          avatar: googleAvatar,
          role: 'Member / Engineer',
          provider: 'google',
          techStack: 'Web, TypeScript, AI Assistive',
          tone: 'professional',
          createdAt: new Date().toISOString(),
        };
        saveRegisteredUsers([...accounts, userRecord]);
      } else {
        userRecord = {
          ...userRecord,
          name: userRecord.name || googleName,
          provider: 'google',
          avatar: googleAvatar || userRecord.avatar,
        };
        const updatedAccounts = accounts.map((u) => (u.id === userRecord!.id ? userRecord! : u));
        saveRegisteredUsers(updatedAccounts);
      }

      setUser(userRecord);
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userRecord));
      } catch (e) {}
      setIsGoogleModalOpen(false);
      return userRecord;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (accountDetails?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    sub?: string;
  }): Promise<UserProfile> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!accountDetails || !accountDetails.email) {
      setIsLoading(false);
      throw new Error('Please provide account information or authenticate via Google.');
    }

    const cleanEmail = accountDetails.email.trim().toLowerCase();
    const cleanName = accountDetails.name.trim() || cleanEmail.split('@')[0];
    const avatar = accountDetails.avatar;
    const role = accountDetails.role || 'Member / Engineer';

    const accounts = getRegisteredUsers();
    let userRecord = accounts.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!userRecord) {
      userRecord = {
        id: accountDetails.sub || `usr_g_${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        avatar,
        role,
        provider: 'google',
        techStack: 'Web, TypeScript, AI Assistive',
        tone: 'professional',
        createdAt: new Date().toISOString(),
      };
      saveRegisteredUsers([...accounts, userRecord]);
    } else {
      userRecord = {
        ...userRecord,
        provider: 'google',
        avatar: avatar || userRecord.avatar,
      };
      const updatedAccounts = accounts.map((u) => (u.id === userRecord!.id ? userRecord! : u));
      saveRegisteredUsers(updatedAccounts);
    }

    setUser(userRecord);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userRecord));
    } catch (e) {}
    setIsLoading(false);
    setIsGoogleModalOpen(false);
    return userRecord;
  };

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
        const accounts = getRegisteredUsers();
        const updatedAccounts = accounts.map((a) => (a.id === updated.id ? updated : a));
        saveRegisteredUsers(updatedAccounts);
      } catch (e) {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        googleClientId,
        setGoogleClientId,
        signInWithGoogle,
        loginWithGoogleCredential,
        loginWithGoogleOAuth,
        signInWithEmail,
        signUp,
        signOut,
        updateUser,
        isGoogleModalOpen,
        openGoogleModal: () => setIsGoogleModalOpen(true),
        closeGoogleModal: () => setIsGoogleModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
