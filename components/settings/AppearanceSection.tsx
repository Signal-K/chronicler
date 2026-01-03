import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';

interface AppearanceSectionProps {
  isDark: boolean;
  onToggleDarkMode: () => void;
}

export function AppearanceSection({ isDark, onToggleDarkMode }: AppearanceSectionProps) {
  const darkSwitchTrackFalse = useThemeColor({ light: '#767577', dark: '#444' }, 'icon');
  const darkSwitchTrackTrue = useThemeColor({ light: '#81b0ff', dark: '#81b0ff' }, 'tint');

  return (
    <View style={[styles.section, isDark && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Appearance</Text>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, isDark && styles.darkText]}>Dark Mode</Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            Switch between light and dark themes
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={onToggleDarkMode}
          trackColor={{ false: darkSwitchTrackFalse, true: darkSwitchTrackTrue }}
          thumbColor={isDark ? darkSwitchTrackTrue : '#f4f3f4'}
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
