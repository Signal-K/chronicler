import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LocalProgressSectionProps {
  localDataSummary: {
    totalKeys: number;
    totalDataSize: number;
    keyDetails: { key: string; size: number; hasData: boolean }[];
  };
  isDark: boolean;
}

export function LocalProgressSection({ localDataSummary, isDark }: LocalProgressSectionProps) {
  return (
    <View style={[styles.section, isDark && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Local Progress</Text>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, isDark && styles.darkText]}>Saved Data</Text>
          <Text style={[styles.settingValue, isDark && styles.darkText]}>
            {localDataSummary.keyDetails.length} items saved
          </Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            {Math.round(localDataSummary.totalDataSize / 1024)}KB • Experience, inventory, hives & more
          </Text>
        </View>
      </View>

      <View style={styles.progressInfoContainer}>
        <Text style={[styles.progressInfoText, isDark && styles.darkText]}>
          💾 Your progress is automatically preserved when you sign in or create an account
        </Text>
        <Text style={[styles.progressInfoText, isDark && styles.darkText]}>
          🔒 All data stays on your device until you choose to sync
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkSection: {
    backgroundColor: '#2d2d2d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#999',
  },
  progressInfoContainer: {
    backgroundColor: 'rgba(100, 200, 100, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(100, 200, 100, 0.3)',
  },
  progressInfoText: {
    fontSize: 13,
    color: '#4A90E2',
    marginBottom: 4,
    lineHeight: 18,
  },
  darkText: {
    color: '#fff',
  },
});
