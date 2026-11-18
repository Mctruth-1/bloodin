import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthUser,
  BloodGroup,
  Genotype,
  HealthTrackCategory,
  PersonalHealthTrack,
  UserProfile,
} from '../types/medical';

const API_BASE = 'http://localhost:8095';
const TOKEN_KEY = '@bloodin_auth_token_v1';

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  bloodGroup: BloodGroup;
  genotype: Genotype;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

interface BloodinContextValue {
  currentUser: AuthUser | null;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  tracks: PersonalHealthTrack[];
  addHealthTrack: (entry: {
    category: HealthTrackCategory;
    title: string;
    value: string;
    notes: string;
  }) => Promise<void>;
  deleteHealthTrack: (id: string) => Promise<void>;
  profiles: UserProfile[];
  activeProfile: UserProfile;
  partnerProfile: UserProfile | null;
  setActiveProfileId: (id: string) => void;
  addOrUpdateProfile: (profile: Omit<UserProfile, 'id'> & { id?: string }) => void;
  deleteProfile: (id: string) => void;
}

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'primary-user',
    name: 'Amara Okafor',
    relationship: 'Self',
    bloodGroup: 'O-',
    genotype: 'AS',
    allergies: 'Penicillin, Latex',
    emergencyContactName: 'Dr. Tunde Okafor (Spouse)',
    emergencyContactPhone: '+1 (555) 234-8910',
    isPrimary: true,
  },
  {
    id: 'partner-user',
    name: 'Tunde Okafor',
    relationship: 'Partner',
    bloodGroup: 'A+',
    genotype: 'AA',
    allergies: 'None Known (NKDA)',
    emergencyContactName: 'Amara Okafor',
    emergencyContactPhone: '+1 (555) 987-6543',
    isPrimary: false,
  },
];

const BloodinContext = createContext<BloodinContextValue | undefined>(undefined);

export const BloodinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [tracks, setTracks] = useState<PersonalHealthTrack[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>(DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('primary-user');

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (savedToken) {
          const res = await fetch(`${API_BASE}/api/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setToken(savedToken);
            setCurrentUser(data.user);
            setTracks(data.tracks || []);
          }
        }
      } catch {
        // Offline fallback
      }
    })();
  }, []);

  const syncUserToPrimaryProfile = (user: AuthUser) => {
    setProfiles((prev) => {
      const selfProfile: UserProfile = {
        id: user.id,
        name: user.name,
        relationship: 'Self',
        bloodGroup: user.bloodGroup,
        genotype: user.genotype,
        allergies: user.allergies,
        emergencyContactName: user.emergencyContactName,
        emergencyContactPhone: user.emergencyContactPhone,
        isPrimary: true,
      };
      const others = prev.filter((p) => p.relationship !== 'Self');
      return [selfProfile, ...others];
    });
    setActiveProfileId(user.id);
  };

  const login = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Invalid credentials');
        return;
      }
      setToken(data.token);
      setCurrentUser(data.user);
      setTracks(data.tracks || []);
      syncUserToPrimaryProfile(data.user);
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
    } catch {
      setAuthError('Unable to reach Bloodin database server.');
    }
  };

  const signup = async (payload: SignupPayload) => {
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Could not create account');
        return;
      }
      setToken(data.token);
      setCurrentUser(data.user);
      setTracks(data.tracks || []);
      syncUserToPrimaryProfile(data.user);
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
    } catch {
      setAuthError('Unable to reach Bloodin database server.');
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    setToken(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
  };

  const addHealthTrack = async (entry: {
    category: HealthTrackCategory;
    title: string;
    value: string;
    notes: string;
  }) => {
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/tracks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(entry),
        });
        if (res.ok) {
          const data = await res.json();
          setTracks(data.tracks);
          return;
        }
      } catch {
        // Fallback to local state
      }
    }
    const fallback: PersonalHealthTrack = {
      id: `track-${Date.now()}`,
      userId: currentUser?.id || 'local',
      ...entry,
      recordedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setTracks((prev) => [fallback, ...prev]);
  };

  const deleteHealthTrack = async (id: string) => {
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/tracks/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTracks(data.tracks);
          return;
        }
      } catch {
        // Fallback
      }
    }
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  const addOrUpdateProfile = (
    input: Omit<UserProfile, 'id'> & { id?: string }
  ) => {
    if (input.id) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === input.id ? ({ ...input, id: input.id } as UserProfile) : p
        )
      );
    } else {
      const newProfile: UserProfile = {
        ...input,
        id: `profile-${Date.now()}`,
      };
      setProfiles((prev) => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
    }
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const filtered = profiles.filter((p) => p.id !== id);
    setProfiles(filtered);
    if (activeProfileId === id) {
      setActiveProfileId(filtered[0].id);
    }
  };

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const partnerProfile =
    profiles.find(
      (p) => p.relationship === 'Partner' && p.id !== activeProfile.id
    ) ||
    profiles.find((p) => p.id !== activeProfile.id) ||
    null;

  return (
    <BloodinContext.Provider
      value={{
        currentUser,
        authError,
        login,
        signup,
        logout,
        tracks,
        addHealthTrack,
        deleteHealthTrack,
        profiles,
        activeProfile,
        partnerProfile,
        setActiveProfileId,
        addOrUpdateProfile,
        deleteProfile,
      }}
    >
      {children}
    </BloodinContext.Provider>
  );
};

export const useBloodin = (): BloodinContextValue => {
  const ctx = useContext(BloodinContext);
  if (!ctx) {
    throw new Error('useBloodin must be used within a BloodinProvider');
  }
  return ctx;
};
