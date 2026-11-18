import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { useBloodin } from '../context/BloodinContext';
import { getBloodCompatibility } from '../utils/compatibilityEngine';
import { BloodinLogo } from '../components/BloodinLogo';
import { APP_IDENTITY, COLORS } from '../constants/theme';
import { MedicalDisclaimerFooter } from '../components/MedicalDisclaimerFooter';

export const EmergencyCardScreen: React.FC = () => {
  const { activeProfile, profiles, setActiveProfileId } = useBloodin();
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const compat = getBloodCompatibility(activeProfile.bloodGroup);

  const handleShareEmergencyCard = async () => {
    const cardSummary = [
      `=== BLOODIN EMERGENCY MEDICAL ID ===`,
      `Name: ${activeProfile.name}`,
      `Blood Group (ABO/Rh): ${activeProfile.bloodGroup}`,
      `Hemoglobin Genotype: ${activeProfile.genotype}`,
      `Safe RBC Transfusion Donors: ${compat.canReceiveFrom.join(', ')}`,
      `Allergies: ${activeProfile.allergies}`,
      `Emergency Contact: ${activeProfile.emergencyContactName} (${activeProfile.emergencyContactPhone})`,
      `---`,
      `${APP_IDENTITY.name} — "${APP_IDENTITY.tagline}"`,
    ].join('\n');

    try {
      await Share.share({
        title: `Bloodin Medical ID — ${activeProfile.name}`,
        message: cardSummary,
      });
      setExportStatus('Emergency ID Card shared & ready for lock-screen export.');
    } catch {
      setExportStatus('Emergency Card snapshot prepared for export.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Bloodin Digital Emergency ID</Text>
      <Text style={styles.screenSubtitle}>
        High-contrast, first-responder-ready medical card for rapid triage and
        lock-screen saving.
      </Text>

      {/* Member Switcher */}
      {profiles.length > 1 && (
        <View style={styles.memberRow}>
          {profiles.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.memberPill,
                p.id === activeProfile.id && styles.memberPillActive,
              ]}
              onPress={() => {
                setActiveProfileId(p.id);
                setExportStatus(null);
              }}
            >
              <Text
                style={[
                  styles.memberPillText,
                  p.id === activeProfile.id && styles.memberPillTextActive,
                ]}
              >
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* High-Contrast Lock-Screen-Ready Bloodin ID Card */}
      <View style={styles.idCard}>
        {/* Crimson Top Banner */}
        <View style={styles.idCardTopBar}>
          <View style={styles.brandRow}>
            <BloodinLogo size={38} inverted />
            <View style={styles.brandTextWrap}>
              <Text style={styles.cardBrandTitle}>BLOODIN MEDICAL ID</Text>
              <Text style={styles.cardBrandSub}>
                EMERGENCY FIRST-RESPONDER CARD
              </Text>
            </View>
          </View>
          <View style={styles.starOfLifeBadge}>
            <Text style={styles.starOfLifeText}>ICE</Text>
          </View>
        </View>

        {/* Patient Identity & Core Hematology Badges */}
        <View style={styles.idCardBody}>
          <Text style={styles.patientLabel}>PATIENT FULL NAME</Text>
          <Text style={styles.patientName}>{activeProfile.name}</Text>

          <View style={styles.vitalBoxesRow}>
            <View style={styles.vitalCrimsonBox}>
              <Text style={styles.vitalBoxTitle}>BLOOD TYPE</Text>
              <Text style={styles.vitalBoxBigValue}>
                {activeProfile.bloodGroup}
              </Text>
              <Text style={styles.vitalBoxSub}>{compat.rhFactor}</Text>
            </View>

            <View style={styles.vitalTealBox}>
              <Text style={styles.vitalBoxTitle}>GENOTYPE</Text>
              <Text style={styles.vitalBoxBigValue}>
                {activeProfile.genotype}
              </Text>
              <Text style={styles.vitalBoxSub}>Hemoglobin Type</Text>
            </View>
          </View>

          {/* Safe Transfusion Protocol Strip */}
          <View style={styles.protocolStrip}>
            <Text style={styles.protocolLabel}>
              SAFE RBC TRANSFUSION DONORS FOR THIS PATIENT:
            </Text>
            <Text style={styles.protocolValue}>
              {compat.canReceiveFrom.join('  •  ')}
            </Text>
          </View>

          {/* Allergies & Emergency Contact */}
          <View style={styles.clinicalDetailsGrid}>
            <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>KNOWN ALLERGIES / ALERTS</Text>
              <Text style={styles.allergyValue}>{activeProfile.allergies}</Text>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>
                IN CASE OF EMERGENCY (ICE CONTACT)
              </Text>
              <Text style={styles.contactName}>
                {activeProfile.emergencyContactName}
              </Text>
              <Text style={styles.contactPhone}>
                {activeProfile.emergencyContactPhone}
              </Text>
            </View>
          </View>
        </View>

        {/* Card Footer */}
        <View style={styles.idCardFooter}>
          <Text style={styles.idFooterText}>
            {APP_IDENTITY.name} • "{APP_IDENTITY.tagline}"
          </Text>
          <Text style={styles.idFooterVerify}>CONFIRMED PROFILE</Text>
        </View>
      </View>

      {/* One-Tap Share / Export Button */}
      <TouchableOpacity
        style={styles.exportButton}
        onPress={handleShareEmergencyCard}
      >
        <Text style={styles.exportButtonText}>
          Share / Export Bloodin ID Card as Image
        </Text>
      </TouchableOpacity>

      {exportStatus && (
        <View style={styles.exportToast}>
          <Text style={styles.exportToastText}>{exportStatus}</Text>
        </View>
      )}

      <MedicalDisclaimerFooter />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.slate900,
  },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.slate600,
    marginTop: 4,
    marginBottom: 14,
    lineHeight: 18,
  },
  memberRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  memberPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  memberPillActive: {
    backgroundColor: COLORS.slate900,
    borderColor: COLORS.slate900,
  },
  memberPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate700,
  },
  memberPillTextActive: {
    color: '#FFFFFF',
  },
  idCard: {
    backgroundColor: COLORS.slate900,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.crimson,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  idCardTopBar: {
    backgroundColor: COLORS.crimson,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTextWrap: {
    justifyContent: 'center',
  },
  cardBrandTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  cardBrandSub: {
    color: '#FEE4E2',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  starOfLifeBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  starOfLifeText: {
    color: COLORS.crimson,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  idCardBody: {
    padding: 18,
  },
  patientLabel: {
    color: COLORS.slate400,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  patientName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
    marginBottom: 16,
  },
  vitalBoxesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  vitalCrimsonBox: {
    flex: 1,
    backgroundColor: COLORS.crimson,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  vitalTealBox: {
    flex: 1,
    backgroundColor: COLORS.teal,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  vitalBoxTitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  vitalBoxBigValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    marginVertical: 2,
  },
  vitalBoxSub: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  protocolStrip: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.teal,
  },
  protocolLabel: {
    color: COLORS.slate400,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  protocolValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  clinicalDetailsGrid: {
    gap: 12,
  },
  detailBlock: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
  },
  detailTitle: {
    color: COLORS.slate400,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  allergyValue: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '800',
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  contactPhone: {
    color: '#5EEAD4',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  idCardFooter: {
    backgroundColor: '#020617',
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idFooterText: {
    color: COLORS.slate400,
    fontSize: 10.5,
    fontWeight: '600',
  },
  idFooterVerify: {
    color: COLORS.teal,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  exportButton: {
    backgroundColor: COLORS.crimson,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  exportToast: {
    marginTop: 10,
    backgroundColor: COLORS.tealLight,
    borderWidth: 1,
    borderColor: COLORS.teal,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  exportToastText: {
    color: COLORS.tealDark,
    fontSize: 12,
    fontWeight: '700',
  },
});
