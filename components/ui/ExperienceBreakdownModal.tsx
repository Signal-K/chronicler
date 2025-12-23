import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ExperienceBreakdownModalProps {
  visible: boolean;
  onClose: () => void;
  breakdown: {
    totalXP: number;
    harvestsCount: number;
    uniqueHarvests: string[];
    pollinationEvents: number;
    salesCompleted: number;
  };
}

export function ExperienceBreakdownModal({ visible, onClose, breakdown }: ExperienceBreakdownModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Experience Breakdown</Text>
          <Text style={styles.xpTotal}>Total XP: {breakdown.totalXP}</Text>
          <View style={styles.section}>
            <Text style={styles.label}>Harvests:</Text>
            <Text style={styles.value}>+1 XP × {breakdown.harvestsCount} = {breakdown.harvestsCount}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>First-Time Harvests:</Text>
            <Text style={styles.value}>+10 XP × {breakdown.uniqueHarvests.length} = {breakdown.uniqueHarvests.length * 10}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Pollination Events:</Text>
            <Text style={styles.value}>+10 XP × {breakdown.pollinationEvents} = {breakdown.pollinationEvents * 10}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Sales Completed:</Text>
            <Text style={styles.value}>+2~4 XP × {breakdown.salesCompleted}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 320,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 12,
  },
  xpTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b45309',
    marginBottom: 16,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#78350f',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#92400e',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
