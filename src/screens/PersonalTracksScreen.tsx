import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useBloodin } from '../context/BloodinContext';
import { HealthTrackCategory } from '../types/medical';
import { COLORS } from '../constants/theme';
import { MedicalDisclaimerFooter } from '../components/MedicalDisclaimerFooter';

const CATEGORIES: HealthTrackCategory[] = [
  'Hb Level (g/dL)',
  'Blood Donation',
  'Hydration & Wellness',
  'Pain / Crisis Log',
  'Lab / Electrophoresis',
];

export const PersonalTracksScreen: React.FC = () => {
  const { tracks, addHealthTrack, deleteHealthTrack, activeProfile } =
    useBloodin();

  const [category, setCategory] =
    useState<HealthTrackCategory>('Hb Level (g/dL)');
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = async () => {
    if (!title.trim() || !value.trim()) return;
    await addHealthTrack({
      category,
      title: title.trim(),
      value: value.trim(),
      notes: notes.trim(),
    });
    setTitle('');
    setValue('');
    setNotes('');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>Personal Health Tracks</Text>
      <Text style={styles.screenSubtitle}>
        Database-backed log for {activeProfile.name}&apos;s hemoglobin readings,
        blood donations, hydration, and electrophoresis lab records.
      </Text>

      {/* New Track Entry Card */}
      <View style={styles.formCard}>
        <Text style={styles.cardHeader}>Log New Health Track</Text>

        <Text style={styles.label}>Category</Text>
        <View style={styles.catGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catPill,
                category === cat && styles.catPillActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.catPillText,
                  category === cat && styles.catPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Track Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Routine CBC Hemoglobin Check"
          placeholderTextColor={COLORS.slate400}
        />

        <Text style={styles.label}>Measured Value / Outcome</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="e.g. 13.6 g/dL or 450 mL Donated"
          placeholderTextColor={COLORS.slate400}
        />

        <Text style={styles.label}>Clinical Notes (Optional)</Text>
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. Feeling energetic, taking folic acid daily"
          placeholderTextColor={COLORS.slate400}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
          <Text style={styles.saveBtnText}>+ Save Track to Database</Text>
        </TouchableOpacity>
      </View>

      {/* Stored Tracks Timeline */}
      <Text style={styles.timelineTitle}>
        Saved Personal Tracks ({tracks.length})
      </Text>
      {tracks.map((item) => (
        <View key={item.id} style={styles.trackCard}>
          <View style={styles.trackTopRow}>
            <View style={styles.catBadge}>
              <Text style={styles.catBadgeText}>{item.category}</Text>
            </View>
            <Text style={styles.dateText}>{item.recordedAt}</Text>
          </View>

          <View style={styles.trackMainRow}>
            <Text style={styles.trackTitle}>{item.title}</Text>
            <Text style={styles.trackValue}>{item.value}</Text>
          </View>

          {item.notes ? (
            <Text style={styles.trackNotes}>{item.notes}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteHealthTrack(item.id)}
          >
            <Text style={styles.deleteBtnText}>Delete Entry</Text>
          </TouchableOpacity>
        </View>
      ))}

      <MedicalDisclaimerFooter />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 36 },
  screenTitle: { fontSize: 20, fontWeight: '800', color: COLORS.slate900 },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.slate600,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: 18,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate900,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slate700,
    marginTop: 10,
    marginBottom: 6,
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  catPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.slate100,
  },
  catPillActive: { backgroundColor: COLORS.crimson },
  catPillText: { fontSize: 11.5, fontWeight: '700', color: COLORS.slate700 },
  catPillTextActive: { color: '#FFFFFF' },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    color: COLORS.slate900,
  },
  saveBtn: {
    backgroundColor: COLORS.teal,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 13.5, fontWeight: '800' },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate900,
    marginBottom: 10,
  },
  trackCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    marginBottom: 10,
  },
  trackTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catBadge: {
    backgroundColor: COLORS.crimsonLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catBadgeText: { fontSize: 10, fontWeight: '800', color: COLORS.crimson },
  dateText: { fontSize: 11, color: COLORS.slate500, fontWeight: '600' },
  trackMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  trackTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.slate900,
    flex: 1,
    marginRight: 8,
  },
  trackValue: { fontSize: 14, fontWeight: '900', color: COLORS.tealDark },
  trackNotes: { fontSize: 12.5, color: COLORS.slate600, lineHeight: 17 },
  deleteBtn: { alignSelf: 'flex-end', marginTop: 8 },
  deleteBtnText: { fontSize: 11, color: COLORS.slate400, fontWeight: '700' },
});
