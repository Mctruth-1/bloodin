import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { MedicalDisclaimerFooter } from '../components/MedicalDisclaimerFooter';

interface EducationCardItem {
  id: string;
  tag: string;
  title: string;
  summary: string;
  keyTakeaway: string;
}

const EDUCATIONAL_CARDS: EducationCardItem[] = [
  {
    id: 'abo-vs-genotype',
    tag: 'CORE FUNDAMENTALS',
    title: 'Blood Group (ABO/Rh) vs. Hemoglobin Genotype',
    summary:
      'Your Blood Group (A, B, AB, O with + or - Rh factor) describes microscopic surface antigens on the outside of your red blood cells—critical for safe blood transfusions and Rh care during pregnancy. Your Genotype (AA, AS, AC, SS, SC) describes the genetic structure of the oxygen-carrying hemoglobin protein inside your red blood cells.',
    keyTakeaway:
      'Having an O+ blood group does NOT tell you whether you are AA or AS. They require two separate blood tests.',
  },
  {
    id: 'myth-universal-marriage',
    tag: 'MYTH DEBUNKED',
    title: 'Myth: "O+ and O+ Couples Cannot Marry"',
    summary:
      'A common misconception confuses ABO blood groups with sickle cell genetics. Two people with O+ blood can safely have children without any risk of Sickle Cell Disease if their hemoglobin genotypes are compatible (for example, AA + AA or AA + AS).',
    keyTakeaway:
      'Partner genetic compatibility for Sickle Cell depends on Hemoglobin Genotype (AA, AS, SS), not ABO blood group.',
  },
  {
    id: 'rh-pregnancy',
    tag: 'MATERNAL HEALTH',
    title: 'Understanding Rh Factor in Pregnancy (Rh- Mother)',
    summary:
      'If an Rh-negative mother (e.g., O- or A-) carries an Rh-positive baby, her immune system may develop Anti-D antibodies. Modern obstetrics completely prevents complications using a routine Rh immunoglobulin (RhoGAM) injection during pregnancy and delivery.',
    keyTakeaway:
      'Rh incompatibility is easily managed by your obstetrician when you know your blood type early.',
  },
  {
    id: 'electrophoresis-gold-standard',
    tag: 'CONFIRMATORY TESTING',
    title: 'Why Hemoglobin Electrophoresis / HPLC Matters',
    summary:
      'Rapid sickling solubility strips can miss Hemoglobin C (AC/SC) or misclassify results. Certified laboratories use Hemoglobin Electrophoresis or High-Performance Liquid Chromatography (HPLC) to accurately quantify HbA, HbS, HbC, and HbF fractions.',
    keyTakeaway:
      'Always request quantitative Hemoglobin Electrophoresis or HPLC from an accredited diagnostic laboratory.',
  },
];

const CERTIFIED_LABS_PREVIEW = [
  {
    name: 'Metro Hematology & Genetic Reference Lab',
    distance: '1.4 km away',
    services: 'Hb Electrophoresis (HPLC) • ABO/Rh Typing • Coombs Test',
    turnaround: 'Results in 24 hrs',
  },
  {
    name: 'Lifeline Accredited Diagnostics & Blood Center',
    distance: '2.8 km away',
    services: 'Quantitative Hb Fractionation • Pre-Marital Genetic Panel',
    turnaround: 'Same-day ABO/Rh • 24h Genotype',
  },
  {
    name: 'University Hospital Clinical Pathology Lab',
    distance: '4.1 km away',
    services: 'Full Hematology • Genetic Counseling Referrals',
    turnaround: 'ISO-15189 Certified',
  },
];

export const EducationLabHubScreen: React.FC = () => {
  const [showLabsDirectory, setShowLabsDirectory] = useState(false);

  const openExternalMapSearch = () => {
    Linking.openURL(
      'https://www.google.com/maps/search/hematology+diagnostic+laboratory+hemoglobin+electrophoresis'
    ).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Educational Hub & Lab Finder</Text>
      <Text style={styles.screenSubtitle}>
        Plain-language hematology guides and certified diagnostic laboratory
        locator for confirmatory blood typing and electrophoresis.
      </Text>

      {/* Nearby Certified Lab Finder Card */}
      <View style={styles.labFinderBanner}>
        <View style={styles.labBadgeRow}>
          <Text style={styles.labBadge}>CONFIRMATORY TESTING</Text>
        </View>
        <Text style={styles.labBannerTitle}>
          Locate a Certified Diagnostic Lab Near You
        </Text>
        <Text style={styles.labBannerBody}>
          Confirm your ABO/Rh blood group and Hemoglobin Genotype via accredited
          Hemoglobin Electrophoresis or HPLC testing.
        </Text>

        <View style={styles.labButtonsRow}>
          <TouchableOpacity
            style={styles.labPrimaryBtn}
            onPress={() => setShowLabsDirectory(!showLabsDirectory)}
          >
            <Text style={styles.labPrimaryBtnText}>
              {showLabsDirectory
                ? 'Hide Certified Labs List'
                : 'View Nearby Accredited Labs'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.labSecondaryBtn}
            onPress={openExternalMapSearch}
          >
            <Text style={styles.labSecondaryBtnText}>Open Maps</Text>
          </TouchableOpacity>
        </View>

        {showLabsDirectory && (
          <View style={styles.labsList}>
            {CERTIFIED_LABS_PREVIEW.map((lab) => (
              <View key={lab.name} style={styles.labItem}>
                <View style={styles.labItemHeader}>
                  <Text style={styles.labName}>{lab.name}</Text>
                  <Text style={styles.labDistance}>{lab.distance}</Text>
                </View>
                <Text style={styles.labServices}>{lab.services}</Text>
                <Text style={styles.labTurnaround}>{lab.turnaround}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Plain-Language Educational Cards */}
      <Text style={styles.sectionHeader}>Blood & Genetics Explained</Text>
      {EDUCATIONAL_CARDS.map((card) => (
        <View key={card.id} style={styles.eduCard}>
          <Text style={styles.eduTag}>{card.tag}</Text>
          <Text style={styles.eduTitle}>{card.title}</Text>
          <Text style={styles.eduSummary}>{card.summary}</Text>
          <View style={styles.takeawayBox}>
            <Text style={styles.takeawayLabel}>KEY TAKEAWAY:</Text>
            <Text style={styles.takeawayText}>{card.keyTakeaway}</Text>
          </View>
        </View>
      ))}

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
  labFinderBanner: {
    backgroundColor: COLORS.slate900,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  labBadgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  labBadge: {
    backgroundColor: COLORS.teal,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    letterSpacing: 0.6,
  },
  labBannerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  labBannerBody: {
    color: COLORS.slate400,
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  labButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  labPrimaryBtn: {
    flex: 1,
    backgroundColor: COLORS.crimson,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  labPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  labSecondaryBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.slate700,
    alignItems: 'center',
  },
  labSecondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  labsList: {
    marginTop: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 12,
  },
  labItem: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
  },
  labItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  labDistance: {
    color: '#5EEAD4',
    fontSize: 11,
    fontWeight: '700',
  },
  labServices: {
    color: COLORS.slate400,
    fontSize: 11.5,
    marginBottom: 4,
  },
  labTurnaround: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate900,
    marginBottom: 12,
  },
  eduCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: 14,
  },
  eduTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.crimson,
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  eduTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate900,
    marginBottom: 6,
  },
  eduSummary: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.slate600,
    marginBottom: 12,
  },
  takeawayBox: {
    backgroundColor: COLORS.tealLight,
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.teal,
  },
  takeawayLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.tealDark,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  takeawayText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate900,
    lineHeight: 17,
  },
});
