import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { BloodinProvider, useBloodin } from './src/context/BloodinContext';
import { BloodinLogo } from './src/components/BloodinLogo';
import { ProfileSetupScreen } from './src/screens/ProfileSetupScreen';
import { TransfusionCheckerScreen } from './src/screens/TransfusionCheckerScreen';
import { GenotypeCalculatorScreen } from './src/screens/GenotypeCalculatorScreen';
import { EmergencyCardScreen } from './src/screens/EmergencyCardScreen';
import { EducationLabHubScreen } from './src/screens/EducationLabHubScreen';
import { APP_IDENTITY, COLORS } from './src/constants/theme';

type TabKey = 'profile' | 'transfusion' | 'genotype' | 'idcard' | 'learn';

const TABS: { key: TabKey; label: string; shortBadge: string }[] = [
  { key: 'profile', label: 'Profiles', shortBadge: 'USER' },
  { key: 'transfusion', label: 'Transfusion', shortBadge: 'ABO' },
  { key: 'genotype', label: 'Genotype', shortBadge: 'DNA' },
  { key: 'idcard', label: 'Bloodin ID', shortBadge: 'ICE' },
  { key: 'learn', label: 'Lab & Guide', shortBadge: 'LAB' },
];

const BloodinShell: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const { activeProfile } = useBloodin();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Top Brand Header */}
      <View style={styles.header}>
        <View style={styles.brandLeft}>
          <BloodinLogo size={40} />
          <View style={styles.titleContainer}>
            <Text style={styles.appName}>{APP_IDENTITY.name}</Text>
            <Text style={styles.tagline}>{APP_IDENTITY.tagline}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.activeUserPill}
          onPress={() => setActiveTab('idcard')}
        >
          <Text style={styles.activeUserBlood}>{activeProfile.bloodGroup}</Text>
          <View style={styles.pillDivider} />
          <Text style={styles.activeUserGenotype}>{activeProfile.genotype}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Screen Content */}
      <View style={styles.mainViewport}>
        {activeTab === 'profile' && (
          <ProfileSetupScreen
            onNavigateToMatch={() => setActiveTab('genotype')}
            onNavigateToCard={() => setActiveTab('idcard')}
          />
        )}
        {activeTab === 'transfusion' && <TransfusionCheckerScreen />}
        {activeTab === 'genotype' && <GenotypeCalculatorScreen />}
        {activeTab === 'idcard' && <EmergencyCardScreen />}
        {activeTab === 'learn' && <EducationLabHubScreen />}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        {TABS.map((tab) => {
          const isFocused = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.key)}
            >
              <View
                style={[
                  styles.tabIconBadge,
                  isFocused && styles.tabIconBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    isFocused && styles.tabBadgeTextActive,
                  ]}
                >
                  {tab.shortBadge}
                </Text>
              </View>
              <Text
                style={[styles.tabLabel, isFocused && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <BloodinProvider>
      <BloodinShell />
    </BloodinProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.slate900,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.slate500,
  },
  activeUserPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.crimsonLight,
    borderWidth: 1,
    borderColor: COLORS.crimsonBorder,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  activeUserBlood: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.crimson,
  },
  pillDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.crimsonBorder,
  },
  activeUserGenotype: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.teal,
  },
  mainViewport: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: COLORS.slate100,
    marginBottom: 3,
  },
  tabIconBadgeActive: {
    backgroundColor: COLORS.crimson,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.slate600,
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: COLORS.slate500,
  },
  tabLabelActive: {
    color: COLORS.crimson,
    fontWeight: '800',
  },
});
