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
  GENOTYPES,
  calculateGenotypeCompatibility,
} from '../utils/compatibilityEngine';
import { Genotype } from '../types/medical';
import { COLORS } from '../constants/theme';
import { MedicalDisclaimerFooter } from '../components/MedicalDisclaimerFooter';

export const GenotypeCalculatorScreen: React.FC = () => {
  const { activeProfile, partnerProfile } = useBloodin();

  const [partnerA, setPartnerA] = useState<Genotype>(activeProfile.genotype);
  const [partnerB, setPartnerB] = useState<Genotype>(
    partnerProfile ? partnerProfile.genotype : 'AS'
  );

  const result = calculateGenotypeCompatibility(partnerA, partnerB);

  const getRiskStyle = () => {
    if (result.riskLevel === 'HIGH') {
      return {
        bg: COLORS.crimsonLight,
        border: COLORS.crimson,
        badgeBg: COLORS.crimson,
        textColor: COLORS.crimsonDark,
        badgeLabel: 'HIGH RISK FOR SICKLE CELL DISEASE',
      };
    }
    if (result.riskLevel === 'MODERATE') {
      return {
        bg: COLORS.amberLight,
        border: COLORS.amber,
        badgeBg: COLORS.amber,
        textColor: COLORS.amber,
        badgeLabel: 'MODERATE / CARRIER RISK',
      };
    }
    return {
      bg: COLORS.tealLight,
      border: COLORS.teal,
      badgeBg: COLORS.teal,
      textColor: COLORS.tealDark,
      badgeLabel: 'LOW RISK / SAFE MATCH',
    };
  };

  const riskTheme = getRiskStyle();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>
        Genotype & Partner Compatibility
      </Text>
      <Text style={styles.screenSubtitle}>
        Select Partner A and Partner B hemoglobin genotypes to view exact
        Mendelian Punnett Square inheritance probabilities for each pregnancy.
      </Text>

      {/* Dual Partner Selector */}
      <View style={styles.partnerBoxCard}>
        <Text style={styles.partnerLabel}>
          PARTNER A ({activeProfile.name.toUpperCase()})
        </Text>
        <View style={styles.genotypeRow}>
          {GENOTYPES.map((gt) => (
            <TouchableOpacity
              key={`A-${gt}`}
              style={[
                styles.gtButton,
                partnerA === gt && styles.gtButtonActiveA,
              ]}
              onPress={() => setPartnerA(gt)}
            >
              <Text
                style={[
                  styles.gtButtonText,
                  partnerA === gt && styles.gtButtonTextActive,
                ]}
              >
                {gt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.plusDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.pairingChip}>
            {partnerA} × {partnerB}
          </Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.partnerLabel}>
          PARTNER B ({partnerProfile ? partnerProfile.name.toUpperCase() : 'PARTNER'})
        </Text>
        <View style={styles.genotypeRow}>
          {GENOTYPES.map((gt) => (
            <TouchableOpacity
              key={`B-${gt}`}
              style={[
                styles.gtButton,
                partnerB === gt && styles.gtButtonActiveB,
              ]}
              onPress={() => setPartnerB(gt)}
            >
              <Text
                style={[
                  styles.gtButtonText,
                  partnerB === gt && styles.gtButtonTextActive,
                ]}
              >
                {gt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Compatibility Risk Banner */}
      <View
        style={[
          styles.riskCard,
          { backgroundColor: riskTheme.bg, borderColor: riskTheme.border },
        ]}
      >
        <View
          style={[styles.riskBadge, { backgroundColor: riskTheme.badgeBg }]}
        >
          <Text style={styles.riskBadgeText}>{riskTheme.badgeLabel}</Text>
        </View>
        <Text style={[styles.riskTitle, { color: riskTheme.textColor }]}>
          {result.riskTitle}
        </Text>
        <Text style={styles.riskSummaryText}>{result.clinicalSummary}</Text>
      </View>

      {/* Interactive 2x2 Punnett Square Grid */}
      <View style={styles.punnettCard}>
        <Text style={styles.cardTitle}>
          2×2 Mendelian Punnett Square ({partnerA} × {partnerB})
        </Text>
        <Text style={styles.cardSubtitle}>
          Each cell represents a 25% (1 in 4) statistical probability for every
          pregnancy.
        </Text>

        <View style={styles.punnettTable}>
          {/* Top Header Row: Partner B Alleles */}
          <View style={styles.punnettRow}>
            <View style={styles.punnettCornerCell}>
              <Text style={styles.cornerLabel}>A \ B</Text>
            </View>
            <View style={styles.punnettHeaderCell}>
              <Text style={styles.alleleHeaderText}>
                Allele {partnerB[0]}
              </Text>
            </View>
            <View style={styles.punnettHeaderCell}>
              <Text style={styles.alleleHeaderText}>
                Allele {partnerB[1]}
              </Text>
            </View>
          </View>

          {/* Matrix Rows */}
          {result.punnettGrid.map((row, rIdx) => (
            <View key={`row-${rIdx}`} style={styles.punnettRow}>
              <View style={styles.punnettHeaderCell}>
                <Text style={styles.alleleHeaderText}>
                  Allele {partnerA[rIdx]}
                </Text>
              </View>
              {row.map((cell, cIdx) => (
                <View
                  key={`cell-${rIdx}-${cIdx}`}
                  style={[
                    styles.punnettDataCell,
                    cell.isSickleCellDisease
                      ? styles.cellDisease
                      : cell.isCarrier
                      ? styles.cellCarrier
                      : styles.cellNormal,
                  ]}
                >
                  <Text
                    style={[
                      styles.cellGenotypeText,
                      cell.isSickleCellDisease
                        ? styles.textDisease
                        : cell.isCarrier
                        ? styles.textCarrier
                        : styles.textNormal,
                    ]}
                  >
                    {cell.genotype}
                  </Text>
                  <Text style={styles.cellPercentText}>25%</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Probability Breakdown Bars */}
      <View style={styles.breakdownCard}>
        <Text style={styles.cardTitle}>Offspring Probability Breakdown</Text>
        {result.probabilities.map((prob) => {
          const isDisease = prob.category === 'Sickle Cell / HbC Disease';
          const isCarrier = prob.category === 'Trait / Carrier';
          const barColor = isDisease
            ? COLORS.crimson
            : isCarrier
            ? COLORS.amber
            : COLORS.teal;

          return (
            <View key={prob.genotype} style={styles.probItem}>
              <View style={styles.probTopRow}>
                <View style={styles.probLeft}>
                  <View
                    style={[styles.gtPill, { backgroundColor: barColor }]}
                  >
                    <Text style={styles.gtPillText}>{prob.genotype}</Text>
                  </View>
                  <Text style={styles.probLabel}>{prob.label}</Text>
                </View>
                <Text style={[styles.probPercent, { color: barColor }]}>
                  {prob.percentage}%
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${prob.percentage}%`, backgroundColor: barColor },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Non-alarmist Genetic Counseling Recommendation */}
      <View style={styles.counselorCard}>
        <Text style={styles.counselorHeader}>
          GENETIC COUNSELING & HEMATOLOGY GUIDANCE
        </Text>
        <Text style={styles.counselorBody}>{result.counselorGuidance}</Text>
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
  partnerBoxCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: 16,
  },
  partnerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate600,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  genotypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  gtButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  gtButtonActiveA: {
    backgroundColor: COLORS.crimson,
    borderColor: COLORS.crimson,
  },
  gtButtonActiveB: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  gtButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate700,
  },
  gtButtonTextActive: {
    color: '#FFFFFF',
  },
  plusDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.slate200,
  },
  pairingChip: {
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.slate900,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  riskCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  riskBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  riskBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  riskSummaryText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.slate700,
  },
  punnettCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate900,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.slate500,
    marginTop: 2,
    marginBottom: 14,
  },
  punnettTable: {
    gap: 8,
  },
  punnettRow: {
    flexDirection: 'row',
    gap: 8,
  },
  punnettCornerCell: {
    width: 72,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.slate500,
  },
  punnettHeaderCell: {
    flex: 1,
    minWidth: 72,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: COLORS.slate900,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  alleleHeaderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  punnettDataCell: {
    flex: 1,
    height: 68,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellNormal: {
    backgroundColor: COLORS.tealLight,
    borderColor: COLORS.tealBorder,
  },
  cellCarrier: {
    backgroundColor: COLORS.amberLight,
    borderColor: COLORS.amberBorder,
  },
  cellDisease: {
    backgroundColor: COLORS.crimsonLight,
    borderColor: COLORS.crimsonBorder,
  },
  cellGenotypeText: {
    fontSize: 22,
    fontWeight: '900',
  },
  textNormal: {
    color: COLORS.tealDark,
  },
  textCarrier: {
    color: COLORS.amber,
  },
  textDisease: {
    color: COLORS.crimson,
  },
  cellPercentText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.slate600,
    marginTop: 2,
  },
  breakdownCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: 16,
    gap: 12,
  },
  probItem: {
    marginTop: 6,
  },
  probTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  probLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  gtPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gtPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  probLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.slate700,
    flexShrink: 1,
  },
  probPercent: {
    fontSize: 15,
    fontWeight: '900',
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.slate100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  counselorCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.teal,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  counselorHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.tealDark,
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  counselorBody: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.slate700,
  },
});
