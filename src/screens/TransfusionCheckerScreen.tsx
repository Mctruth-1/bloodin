import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useBloodin } from '../context/BloodinContext';
import {
  BLOOD_GROUPS,
  getBloodCompatibility,
} from '../utils/compatibilityEngine';
import { BloodGroup } from '../types/medical';
import { COLORS } from '../constants/theme';
import { MedicalDisclaimerFooter } from '../components/MedicalDisclaimerFooter';

export const TransfusionCheckerScreen: React.FC = () => {
  const { activeProfile } = useBloodin();
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>(
    activeProfile.bloodGroup
  );

  const profile = getBloodCompatibility(selectedGroup);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Blood Transfusion Compatibility</Text>
      <Text style={styles.screenSubtitle}>
        Select any ABO/Rh blood group to inspect Red Blood Cell (RBC) donor and
        recipient compatibility.
      </Text>

      {/* Interactive Blood Group Selector */}
      <View style={styles.selectorGrid}>
        {BLOOD_GROUPS.map((bg) => {
          const isSelected = bg === selectedGroup;
          const isUserGroup = bg === activeProfile.bloodGroup;
          return (
            <TouchableOpacity
              key={bg}
              style={[
                styles.bloodButton,
                isSelected && styles.bloodButtonSelected,
              ]}
              onPress={() => setSelectedGroup(bg)}
            >
              <Text
                style={[
                  styles.bloodButtonText,
                  isSelected && styles.bloodButtonTextSelected,
                ]}
              >
                {bg}
              </Text>
              {isUserGroup && (
                <Text
                  style={[
                    styles.youBadge,
                    isSelected && styles.youBadgeSelected,
                  ]}
                >
                  YOU
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Special Universal Donor / Universal Recipient Callout */}
      {(profile.isUniversalDonor || profile.isUniversalRecipient) && (
        <View
          style={[
            styles.universalBanner,
            profile.isUniversalDonor
              ? styles.universalDonorBanner
              : styles.universalRecipientBanner,
          ]}
        >
          <Text style={styles.universalBadgeLabel}>
            {profile.isUniversalDonor
              ? 'UNIVERSAL RED CELL DONOR (O-)'
              : 'UNIVERSAL RED CELL RECIPIENT (AB+)'}
          </Text>
          <Text style={styles.universalBannerText}>
            {profile.isUniversalDonor
              ? 'O- red blood cells carry no A, B, or RhD antigens and can be safely transfused to patients of any blood group in emergencies.'
              : 'AB+ plasma carries no Anti-A, Anti-B, or Anti-RhD antibodies, allowing safe receipt of packed red blood cells from all 8 blood groups.'}
          </Text>
        </View>
      )}

      {/* Physiological Antigens & Antibodies Breakdown */}
      <View style={styles.physiologyCard}>
        <Text style={styles.cardHeader}>
          Immunological Profile for {selectedGroup}
        </Text>
        <Text style={styles.summaryParagraph}>
          {profile.physiologicalSummary}
        </Text>

        <View style={styles.immunoRow}>
          <View style={styles.immunoBox}>
            <Text style={styles.immunoLabel}>RED CELL ANTIGENS</Text>
            <Text style={styles.immunoValue}>{profile.antigens}</Text>
          </View>
          <View style={styles.immunoBox}>
            <Text style={styles.immunoLabel}>PLASMA ANTIBODIES</Text>
            <Text style={styles.immunoValue}>{profile.antibodies}</Text>
          </View>
        </View>
      </View>

      {/* DONATE TO Matrix */}
      <View style={styles.matrixCard}>
        <View style={styles.matrixHeaderRow}>
          <Text style={styles.matrixTitle}>
            Who {selectedGroup} Can DONATE Red Cells To
          </Text>
          <Text style={styles.matchCountBadge}>
            {profile.canDonateTo.length} / 8 Compatible
          </Text>
        </View>
        <View style={styles.badgeGrid}>
          {BLOOD_GROUPS.map((targetGroup) => {
            const isCompatible = profile.canDonateTo.includes(targetGroup);
            return (
              <View
                key={`donate-${targetGroup}`}
                style={[
                  styles.compatCell,
                  isCompatible
                    ? styles.compatCellSafe
                    : styles.compatCellIncompatible,
                ]}
              >
                <Text
                  style={[
                    styles.compatGroupText,
                    isCompatible
                      ? styles.compatGroupTextSafe
                      : styles.compatGroupTextIncompatible,
                  ]}
                >
                  {targetGroup}
                </Text>
                <Text
                  style={[
                    styles.compatStatusText,
                    isCompatible
                      ? styles.compatStatusSafe
                      : styles.compatStatusIncompatible,
                  ]}
                >
                  {isCompatible ? 'Compatible' : 'Incompatible'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* RECEIVE FROM Matrix */}
      <View style={styles.matrixCard}>
        <View style={styles.matrixHeaderRow}>
          <Text style={styles.matrixTitle}>
            Who {selectedGroup} Can RECEIVE Red Cells From
          </Text>
          <Text style={styles.matchCountBadge}>
            {profile.canReceiveFrom.length} / 8 Compatible
          </Text>
        </View>
        <View style={styles.badgeGrid}>
          {BLOOD_GROUPS.map((donorGroup) => {
            const isCompatible = profile.canReceiveFrom.includes(donorGroup);
            return (
              <View
                key={`receive-${donorGroup}`}
                style={[
                  styles.compatCell,
                  isCompatible
                    ? styles.compatCellSafe
                    : styles.compatCellIncompatible,
                ]}
              >
                <Text
                  style={[
                    styles.compatGroupText,
                    isCompatible
                      ? styles.compatGroupTextSafe
                      : styles.compatGroupTextIncompatible,
                  ]}
                >
                  {donorGroup}
                </Text>
                <Text
                  style={[
                    styles.compatStatusText,
                    isCompatible
                      ? styles.compatStatusSafe
                      : styles.compatStatusIncompatible,
                  ]}
                >
                  {isCompatible ? 'Safe Donor' : 'Incompatible'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

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
    marginBottom: 16,
    lineHeight: 18,
  },
  selectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  bloodButton: {
    width: '23%',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodButtonSelected: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  bloodButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.slate900,
  },
  bloodButtonTextSelected: {
    color: '#FFFFFF',
  },
  youBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.crimson,
    marginTop: 2,
  },
  youBadgeSelected: {
    color: '#FFFFFF',
  },
  universalBanner: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  universalDonorBanner: {
    backgroundColor: COLORS.tealLight,
    borderColor: COLORS.teal,
  },
  universalRecipientBanner: {
    backgroundColor: COLORS.crimsonLight,
    borderColor: COLORS.crimson,
  },
  universalBadgeLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: COLORS.slate900,
    marginBottom: 4,
  },
  universalBannerText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.slate700,
  },
  physiologyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate900,
    marginBottom: 6,
  },
  summaryParagraph: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.slate600,
    marginBottom: 12,
  },
  immunoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  immunoBox: {
    flex: 1,
    backgroundColor: COLORS.slate100,
    padding: 10,
    borderRadius: 10,
  },
  immunoLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.slate500,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  immunoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate900,
    lineHeight: 16,
  },
  matrixCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: 16,
  },
  matrixHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matrixTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate900,
  },
  matchCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.teal,
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  compatCell: {
    width: '23%',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
  },
  compatCellSafe: {
    backgroundColor: COLORS.tealLight,
    borderColor: COLORS.tealBorder,
  },
  compatCellIncompatible: {
    backgroundColor: COLORS.crimsonLight,
    borderColor: COLORS.crimsonBorder,
    opacity: 0.75,
  },
  compatGroupText: {
    fontSize: 16,
    fontWeight: '800',
  },
  compatGroupTextSafe: {
    color: COLORS.tealDark,
  },
  compatGroupTextIncompatible: {
    color: COLORS.crimsonDark,
  },
  compatStatusText: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 2,
  },
  compatStatusSafe: {
    color: COLORS.teal,
  },
  compatStatusIncompatible: {
    color: COLORS.crimson,
  },
});
