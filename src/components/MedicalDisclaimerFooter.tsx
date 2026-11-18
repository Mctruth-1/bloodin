import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { APP_IDENTITY, COLORS } from '../constants/theme';

export const MedicalDisclaimerFooter: React.FC = () => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.badgeRow}>
        <View style={styles.dot} />
        <Text style={styles.badgeText}>CLINICAL GUIDANCE NOTE</Text>
      </View>
      <Text style={styles.disclaimerText}>{APP_IDENTITY.disclaimer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: COLORS.slate100,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.crimson,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: COLORS.slate700,
  },
  disclaimerText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: COLORS.slate600,
  },
});
