import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { BloodinLogo } from '../components/BloodinLogo';
import { BLOOD_GROUPS, GENOTYPES } from '../utils/compatibilityEngine';
import { BloodGroup, Genotype } from '../types/medical';
import { APP_IDENTITY, COLORS } from '../constants/theme';
import { useBloodin } from '../context/BloodinContext';

export const AuthScreen: React.FC = () => {
  const { login, signup, authError } = useBloodin();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [email, setEmail] = useState('amara@bloodin.health');
  const [password, setPassword] = useState('bloodin123');
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [genotype, setGenotype] = useState<Genotype>('AS');
  const [allergies, setAllergies] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  const handleSubmit = async () => {
    if (mode === 'login') {
      await login(email, password);
    } else {
      await signup({
        name,
        email,
        password,
        bloodGroup,
        genotype,
        allergies: allergies || 'None Known (NKDA)',
        emergencyContactName: emergencyContactName || 'Not Specified',
        emergencyContactPhone: emergencyContactPhone || 'Not Specified',
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroHeader}>
        <BloodinLogo size={56} />
        <Text style={styles.brandName}>{APP_IDENTITY.name}</Text>
        <Text style={styles.tagline}>{APP_IDENTITY.tagline}</Text>
      </View>

      <View style={styles.modeSwitchRow}>
        <TouchableOpacity
          style={[
            styles.modeTab,
            mode === 'login' && styles.modeTabActive,
          ]}
          onPress={() => setMode('login')}
        >
          <Text
            style={[
              styles.modeTabText,
              mode === 'login' && styles.modeTabTextActive,
            ]}
          >
            Log In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeTab,
            mode === 'signup' && styles.modeTabActive,
          ]}
          onPress={() => {
            setMode('signup');
            setEmail('');
            setPassword('');
          }}
        >
          <Text
            style={[
              styles.modeTabText,
              mode === 'signup' && styles.modeTabTextActive,
            ]}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {authError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{authError}</Text>
          </View>
        ) : null}

        {mode === 'signup' && (
          <>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Amara Okafor"
              placeholderTextColor={COLORS.slate400}
            />
          </>
        )}

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={COLORS.slate400}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={COLORS.slate400}
        />

        {mode === 'signup' && (
          <>
            <Text style={styles.label}>Your Blood Group (ABO/Rh)</Text>
            <View style={styles.pillGrid}>
              {BLOOD_GROUPS.map((bg) => (
                <TouchableOpacity
                  key={bg}
                  style={[
                    styles.pill,
                    bloodGroup === bg && styles.pillCrimson,
                  ]}
                  onPress={() => setBloodGroup(bg)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      bloodGroup === bg && styles.pillTextActive,
                    ]}
                  >
                    {bg}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Your Hemoglobin Genotype</Text>
            <View style={styles.pillGrid}>
              {GENOTYPES.map((gt) => (
                <TouchableOpacity
                  key={gt}
                  style={[styles.pill, genotype === gt && styles.pillTeal]}
                  onPress={() => setGenotype(gt)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      genotype === gt && styles.pillTextActive,
                    ]}
                  >
                    {gt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Known Allergies (Optional)</Text>
            <TextInput
              style={styles.input}
              value={allergies}
              onChangeText={setAllergies}
              placeholder="e.g. Penicillin, Latex, or NKDA"
              placeholderTextColor={COLORS.slate400}
            />

            <Text style={styles.label}>Emergency Contact Name & Phone</Text>
            <TextInput
              style={styles.input}
              value={emergencyContactName}
              onChangeText={setEmergencyContactName}
              placeholder="Contact Name (e.g. Dr. Tunde Okafor)"
              placeholderTextColor={COLORS.slate400}
            />
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              value={emergencyContactPhone}
              onChangeText={setEmergencyContactPhone}
              placeholder="Contact Phone (e.g. +1 555-234-8910)"
              placeholderTextColor={COLORS.slate400}
            />
          </>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>
            {mode === 'login'
              ? 'Log In to Bloodin'
              : 'Create Account & Save Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  heroHeader: { alignItems: 'center', marginVertical: 16 },
  brandName: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.slate900,
    marginTop: 8,
  },
  tagline: { fontSize: 12.5, color: COLORS.slate500, fontWeight: '600' },
  modeSwitchRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate200,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  modeTabActive: { backgroundColor: COLORS.surface },
  modeTabText: { fontSize: 13, fontWeight: '700', color: COLORS.slate600 },
  modeTabTextActive: { color: COLORS.crimson, fontWeight: '800' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  errorBanner: {
    backgroundColor: COLORS.crimsonLight,
    borderColor: COLORS.crimsonBorder,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  errorText: { color: COLORS.crimsonDark, fontSize: 12, fontWeight: '700' },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate700,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.slate900,
  },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    width: '22%',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
    alignItems: 'center',
  },
  pillCrimson: { backgroundColor: COLORS.crimson, borderColor: COLORS.crimson },
  pillTeal: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  pillText: { fontSize: 13, fontWeight: '800', color: COLORS.slate700 },
  pillTextActive: { color: '#FFFFFF' },
  submitBtn: {
    backgroundColor: COLORS.crimson,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
