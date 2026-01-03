import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';

interface HoneyProductionSectionProps {
  autoFillHoneyEnabled: boolean;
  onToggleAutoFillHoney: () => void;
  plots: any[];
  isDark: boolean;
}

export function HoneyProductionSection({
  autoFillHoneyEnabled,
  onToggleAutoFillHoney,
  plots,
  isDark,
}: HoneyProductionSectionProps) {
  const [isFastForwarding, setIsFastForwarding] = React.useState(false);
  const darkSwitchTrackFalse = useThemeColor({ light: '#767577', dark: '#444' }, 'icon');
  const darkHoneySwitchTrack = useThemeColor({ light: '#FFB300', dark: '#FFB300' }, 'tint');
  const darkHoneySwitchThumb = useThemeColor({ light: '#FF8F00', dark: '#FF8F00' }, 'tint');

  const fastForwardHoneyProduction = async () => {
    if (!autoFillHoneyEnabled) {
      alert('Auto-fill honey must be enabled to use fast forward.');
      return;
    }

    setIsFastForwarding(true);
    
    try {
      const userStatsData = await AsyncStorage.getItem('user_stats');
      let recentlyHarvestedCount = 0;

      if (userStatsData) {
        const userStats = JSON.parse(userStatsData);
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        recentlyHarvestedCount = userStats.harvestedPlants
          ?.filter((harvest: any) => harvest.harvestedAt > twentyFourHoursAgo)
          ?.length || 0;
      }

      const activeCrops = plots.filter(plot => 
        plot && (plot.state === 'planted' || plot.state === 'growing') && plot.cropType
      );

      if (activeCrops.length === 0 && recentlyHarvestedCount === 0) {
        alert('No crops found! Plant some flowers or wait for recent harvests to produce honey.');
        setIsFastForwarding(false);
        return;
      }

      const hoursToSimulate = 8;
      await AsyncStorage.setItem('honeyFastForwardRequest', JSON.stringify({
        hours: hoursToSimulate,
        timestamp: Date.now(),
        activeCropsCount: activeCrops.length,
        recentHarvestsCount: recentlyHarvestedCount
      }));
      
      setTimeout(() => {
        alert(`✅ Fast forward complete! Your bees collected nectar from ${activeCrops.length} active crops and ${recentlyHarvestedCount} recently harvested plants for ${hoursToSimulate} hours. Check your hives!`);
        setIsFastForwarding(false);
        
        AsyncStorage.setItem('honeyFastForwardTrigger', Date.now().toString());
      }, 2000);
      
    } catch {
      alert('Failed to fast forward honey production. Please try again');
      setIsFastForwarding(false);
    }
  };

  return (
    <View style={[styles.section, isDark && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>🍯 Honey Production</Text>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, isDark && styles.darkText]}>Auto-Fill Honey</Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            Automatically track honey production based on planted and harvested crops
          </Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            {autoFillHoneyEnabled 
              ? '🐝 Bees will collect nectar from your active crops' 
              : '⭕ Manual honey management only'
            }
          </Text>
        </View>
        <Switch
          value={autoFillHoneyEnabled}
          onValueChange={onToggleAutoFillHoney}
          trackColor={{ false: darkSwitchTrackFalse, true: darkHoneySwitchTrack }}
          thumbColor={autoFillHoneyEnabled ? darkHoneySwitchThumb : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, isDark && styles.darkText]}>Fast Forward Production</Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            Simulate 8 hours of honey production from current/recent crops
          </Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            {autoFillHoneyEnabled 
              ? '🍯 Ready to fast forward honey production' 
              : '⚠️ Requires Auto-Fill Honey to be enabled'
            }
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            styles.fastForwardButton,
            (!autoFillHoneyEnabled || isFastForwarding) && styles.disabledButton
          ]}
          onPress={fastForwardHoneyProduction}
          disabled={!autoFillHoneyEnabled || isFastForwarding}
        >
          <Text style={[
            styles.actionButtonText,
            styles.fastForwardButtonText
          ]}>
            {isFastForwarding ? '⏳ Fast Forwarding...' : '⚡ Fast Forward'}
          </Text>
        </TouchableOpacity>
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
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  fastForwardButton: {
    backgroundColor: '#FFB300',
    minWidth: 120,
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fastForwardButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#fff',
  },
});
