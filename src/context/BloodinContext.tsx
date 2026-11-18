import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BloodGroup, Genotype, UserProfile } from '../types/medical';

interface BloodinContextValue {
  profiles: UserProfile[];
  activeProfile: UserProfile;
  partnerProfile: UserProfile | null;
  setActiveProfileId: (id: string) => void;
  addOrUpdateProfile: (profile: Omit<UserProfile, 'id'> & { id?: string }) => void;
  deleteProfile: (id: string) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

const STORAGE_KEY = '@bloodin_profiles_v1';

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
  const [profiles, setProfiles] = useState<UserProfile[]>(DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('primary-user');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as UserProfile[];
          if (parsed.length > 0) {
            setProfiles(parsed);
            setActiveProfileId(parsed[0].id);
          }
        }
      } catch {
        // Fallback to in-memory default profiles
      }
    })();
  }, []);

  const persistProfiles = async (next: UserProfile[]) => {
    setProfiles(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage write errors in restricted environments
    }
  };

  const addOrUpdateProfile = (
    input: Omit<UserProfile, 'id'> & { id?: string }
  ) => {
    if (input.id) {
      const updated = profiles.map((p) =>
        p.id === input.id ? ({ ...input, id: input.id } as UserProfile) : p
      );
      persistProfiles(updated);
    } else {
      const newProfile: UserProfile = {
        ...input,
        id: `profile-${Date.now()}`,
      };
      const updated = [...profiles, newProfile];
      persistProfiles(updated);
      setActiveProfileId(newProfile.id);
    }
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const filtered = profiles.filter((p) => p.id !== id);
    persistProfiles(filtered);
    if (activeProfileId === id) {
      setActiveProfileId(filtered[0].id);
    }
  };

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const partnerProfile =
    profiles.find((p) => p.relationship === 'Partner' && p.id !== activeProfile.id) ||
    profiles.find((p) => p.id !== activeProfile.id) ||
    null;

  return (
    <BloodinContext.Provider
      value={{
        profiles,
        activeProfile,
        partnerProfile,
        setActiveProfileId,
        addOrUpdateProfile,
        deleteProfile,
        hasCompletedOnboarding,
        completeOnboarding: () => setHasCompletedOnboarding(true),
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
