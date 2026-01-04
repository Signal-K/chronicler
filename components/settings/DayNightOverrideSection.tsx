import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';

interface DayNightOverrideSectionProps {
  isDark: boolean;
  forceDaytime: boolean;
  onToggleForceDaytime: () => void;
}

export function DayNightOverrideSection({ 
  isDark, 
  forceDaytime, 
  onToggleForceDaytime 
}: DayNightOverrideSectionProps) {
  const darkSwitchTrackFalse = useThemeColor({ light: '#767577', dark: '#444' }, 'icon');
  const darkSwitchTrackTrue = useThemeColor({ light: '#81b0ff', dark: '#81b0ff' }, 'tint');

  return (
    <View style={[styles.section, isDark && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
        🐛 Day/Night Debug
      </Text>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, isDark && styles.darkText]}>
            Force Daytime Mode
          </Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            Override real time and always show daytime
          </Text>
        </View>
        <Switch
          value={forceDaytime}
          onValueChange={onToggleForceDaytime}
          trackColor={{ false: darkSwitchTrackFalse, true: darkSwitchTrackTrue }}
          thumbColor={forceDaytime ? darkSwitchTrackTrue : '#f4f3f4'}
        />
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
  settingSubtext: {
    fontSize: 12,
    color: '#999',
  },
  darkText: {
    color: '#fff',
  },
});
