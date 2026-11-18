import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useBloodin } from '../context/BloodinContext';
import { BLOOD_GROUPS, GENOTYPES } from '../utils/compatibilityEngine';
import { BloodGroup, Genotype, UserProfile } from '../types/medical';
import { COLORS } from '../constants/theme';
import { MedicalDisclaimerFooter } from '../components/MedicalDisclaimerFooter';

const RELATIONSHIPS: UserProfile['relationship'][] = [
  'Self',
  'Partner',
  'Child',
  'Parent',
  'Sibling',
  'Other',
];

export const ProfileSetupScreen: React.FC<{
  onNavigateToMatch?: () => void;
  onNavigateToCard?: () => void;
}> = ({ onNavigateToMatch, onNavigateToCard }) => {
  const {
    profiles,
    activeProfile,
    setActiveProfileId,
    addOrUpdateProfile,
    deleteProfile,
  } = useBloodin();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState(activeProfile.name);
  const [relationship, setRelationship] =
    useState<UserProfile['relationship']>(activeProfile.relationship);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(
    activeProfile.bloodGroup
  );
  const [genotype, setGenotype] = useState<Genotype>(activeProfile.genotype);
  const [allergies, setAllergies] = useState(activeProfile.allergies);
  const [emergencyContactName, setEmergencyContactName] = useState(
    activeProfile.emergencyContactName
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    activeProfile.emergencyContactPhone
  );

  const startEditProfile = (profile: UserProfile) => {
    setEditingId(profile.id);
    setName(profile.name);
    setRelationship(profile.relationship);
    setBloodGroup(profile.bloodGroup);
    setGenotype(profile.genotype);
    setAllergies(profile.allergies);
    setEmergencyContactName(profile.emergencyContactName);
    setEmergencyContactPhone(profile.emergencyContactPhone);
    setIsEditing(true);
  };

  const startNewProfile = () => {
    setEditingId(undefined);
    setName('');
    setRelationship('Partner');
    setBloodGroup('O+');
    setGenotype('AA');
    setAllergies('None Known (NKDA)');
    setEmergencyContactName(activeProfile.name);
    setEmergencyContactPhone('');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    addOrUpdateProfile({
      id: editingId,
      name: name.trim(),
      relationship,
      bloodGroup,
      genotype,
      allergies: allergies.trim() || 'None Known (NKDA)',
      emergencyContactName: emergencyContactName.trim() || 'Not Specified',
      emergencyContactPhone: emergencyContactPhone.trim() || 'Not Specified',
    });
    setIsEditing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Saved Family & Partner Profiles Selector */}
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={styles.sectionTitle}>Saved Bloodin Profiles</Text>
          <Text style={styles.sectionSubtitle}>
            Switch between yourself, your partner, or family members
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={startNewProfile}>
          <Text style={styles.addBtnText}>+ Add Member</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.profileStrip}
      >
        {profiles.map((prof) => {
          const isSelected = prof.id === activeProfile.id;
          return (
            <TouchableOpacity
              key={prof.id}
              style={[
                styles.profileChip,
                isSelected && styles.profileChipActive,
              ]}
              onPress={() => {
                setActiveProfileId(prof.id);
                setIsEditing(false);
              }}
            >
              <View style={styles.chipTopRow}>
                <Text
                  style={[
                    styles.chipRelation,
                    isSelected && styles.chipRelationActive,
                  ]}
                >
                  {prof.relationship.toUpperCase()}
                </Text>
                <View style={styles.chipBadges}>
                  <View style={styles.miniBadgeCrimson}>
                    <Text style={styles.miniBadgeText}>{prof.bloodGroup}</Text>
                  </View>
                  <View style={styles.miniBadgeTeal}>
                    <Text style={styles.miniBadgeText}>{prof.genotype}</Text>
                  </View>
                </View>
              </View>
              <Text
                style={[styles.chipName, isSelected && styles.chipNameActive]}
                numberOfLines={1}
              >
                {prof.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Active Profile Summary Card or Editor */}
      {!isEditing ? (
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.relationshipTag}>
                {activeProfile.relationship} Profile
              </Text>
              <Text style={styles.profileFullName}>{activeProfile.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => startEditProfile(activeProfile)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricBoxCrimson}>
              <Text style={styles.metricLabel}>BLOOD GROUP (ABO/Rh)</Text>
              <Text style={styles.metricValueCrimson}>
                {activeProfile.bloodGroup}
              </Text>
              <Text style={styles.metricNote}>
                {activeProfile.bloodGroup === 'O-'
                  ? 'Universal Red Cell Donor'
                  : activeProfile.bloodGroup === 'AB+'
                  ? 'Universal Recipient'
                  : 'Standard ABO/Rh Type'}
              </Text>
            </View>

            <View style={styles.metricBoxTeal}>
              <Text style={styles.metricLabel}>HB GENOTYPE</Text>
              <Text style={styles.metricValueTeal}>
                {activeProfile.genotype}
              </Text>
              <Text style={styles.metricNote}>
                {activeProfile.genotype === 'AA'
                  ? 'Normal Adult Hb'
                  : activeProfile.genotype === 'AS' ||
                    activeProfile.genotype === 'AC'
                  ? 'Healthy Trait Carrier'
                  : 'Clinical Hb Variant'}
              </Text>
            </View>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Known Allergies</Text>
              <Text style={styles.infoVal}>{activeProfile.allergies}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Emergency Contact</Text>
              <Text style={styles.infoVal}>
                {activeProfile.emergencyContactName} ({activeProfile.emergencyContactPhone})
              </Text>
            </View>
          </View>

          <View style={styles.quickActionRow}>
            {onNavigateToMatch && (
              <TouchableOpacity
                style={styles.secondaryCta}
                onPress={onNavigateToMatch}
              >
                <Text style={styles.secondaryCtaText}>
                  Run Partner Genotype Check
                </Text>
              </TouchableOpacity>
            )}
            {onNavigateToCard && (
              <TouchableOpacity
                style={styles.primaryCta}
                onPress={onNavigateToCard}
              >
                <Text style={styles.primaryCtaText}>View Bloodin ID Card</Text>
              </TouchableOpacity>
            )}
          </View>

          {profiles.length > 1 && (
            <TouchableOpacity
              style={styles.deleteLink}
              onPress={() => deleteProfile(activeProfile.id)}
            >
              <Text style={styles.deleteLinkText}>Remove this profile</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingId ? 'Update Bloodin Profile' : 'New Family / Partner Profile'}
          </Text>

          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Amara Okafor"
            placeholderTextColor={COLORS.slate400}
          />

          <Text style={styles.inputLabel}>Relationship</Text>
          <View style={styles.pillGrid}>
            {RELATIONSHIPS.map((rel) => (
              <TouchableOpacity
                key={rel}
                style={[
                  styles.choicePill,
                  relationship === rel && styles.choicePillSelected,
                ]}
                onPress={() => setRelationship(rel)}
              >
                <Text
                  style={[
                    styles.choicePillText,
                    relationship === rel && styles.choicePillTextSelected,
                  ]}
                >
                  {rel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Select Blood Group (ABO & Rh)</Text>
          <View style={styles.pillGrid}>
            {BLOOD_GROUPS.map((bg) => (
              <TouchableOpacity
                key={bg}
                style={[
                  styles.typeButton,
                  bloodGroup === bg && styles.typeButtonCrimson,
                ]}
                onPress={() => setBloodGroup(bg)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    bloodGroup === bg && styles.typeButtonTextActive,
                  ]}
                >
                  {bg}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Select Hemoglobin Genotype</Text>
          <View style={styles.pillGrid}>
            {GENOTYPES.map((gt) => (
              <TouchableOpacity
                key={gt}
                style={[
                  styles.typeButton,
                  genotype === gt && styles.typeButtonTeal,
                ]}
                onPress={() => setGenotype(gt)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    genotype === gt && styles.typeButtonTextActive,
                  ]}
                >
                  {gt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Allergies & Medical Notes</Text>
          <TextInput
            style={styles.textInput}
            value={allergies}
            onChangeText={setAllergies}
            placeholder="e.g. Penicillin, Latex, or NKDA"
            placeholderTextColor={COLORS.slate400}
          />

          <Text style={styles.inputLabel}>Emergency Contact Name</Text>
          <TextInput
            style={styles.textInput}
            value={emergencyContactName}
            onChangeText={setEmergencyContactName}
            placeholder="e.g. Dr. Tunde Okafor (Spouse)"
            placeholderTextColor={COLORS.slate400}
          />

          <Text style={styles.inputLabel}>Emergency Contact Phone</Text>
          <TextInput
            style={styles.textInput}
            value={emergencyContactPhone}
            onChangeText={setEmergencyContactPhone}
            placeholder="e.g. +1 (555) 234-8910"
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.slate400}
          />

          <View style={styles.formActionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.slate500,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: COLORS.crimsonLight,
    borderWidth: 1,
    borderColor: COLORS.crimsonBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  addBtnText: {
    color: COLORS.crimson,
    fontWeight: '700',
    fontSize: 12,
  },
  profileStrip: {
    marginBottom: 16,
  },
  profileChip: {
    width: 155,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
  },
  profileChipActive: {
    borderColor: COLORS.crimson,
    backgroundColor: COLORS.crimsonLight,
  },
  chipTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chipRelation: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate500,
    letterSpacing: 0.6,
  },
  chipRelationActive: {
    color: COLORS.crimson,
  },
  chipBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  miniBadgeCrimson: {
    backgroundColor: COLORS.crimson,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  miniBadgeTeal: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  miniBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  chipName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  chipNameActive: {
    color: COLORS.crimsonDark,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  relationshipTag: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  profileFullName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.slate900,
    marginTop: 2,
  },
  editButton: {
    backgroundColor: COLORS.slate100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate700,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricBoxCrimson: {
    flex: 1,
    backgroundColor: COLORS.crimsonLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.crimsonBorder,
  },
  metricBoxTeal: {
    flex: 1,
    backgroundColor: COLORS.tealLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.slate600,
    letterSpacing: 0.6,
  },
  metricValueCrimson: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.crimson,
    marginVertical: 4,
  },
  metricValueTeal: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.teal,
    marginVertical: 4,
  },
  metricNote: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate700,
  },
  infoList: {
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
    paddingTop: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoKey: {
    fontSize: 13,
    color: COLORS.slate500,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 13,
    color: COLORS.slate900,
    fontWeight: '600',
    maxWidth: '62%',
    textAlign: 'right',
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  secondaryCta: {
    flex: 1,
    backgroundColor: COLORS.tealLight,
    borderWidth: 1,
    borderColor: COLORS.teal,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryCtaText: {
    color: COLORS.tealDark,
    fontSize: 12,
    fontWeight: '700',
  },
  primaryCta: {
    flex: 1,
    backgroundColor: COLORS.crimson,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteLink: {
    marginTop: 14,
    alignItems: 'center',
  },
  deleteLinkText: {
    fontSize: 12,
    color: COLORS.slate400,
    textDecorationLine: 'underline',
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.slate900,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate700,
    marginTop: 12,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.slate900,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choicePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.slate100,
  },
  choicePillSelected: {
    backgroundColor: COLORS.slate900,
  },
  choicePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate700,
  },
  choicePillTextSelected: {
    color: '#FFFFFF',
  },
  typeButton: {
    width: '22%',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  typeButtonCrimson: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  typeButtonTeal: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate700,
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  formActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.slate100,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.slate700,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.crimson,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
