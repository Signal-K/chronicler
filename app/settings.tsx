import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { getLocalDataSummary } from '../lib/progressPreservation';
import { supabase } from '../lib/supabase';

export default function SettingsScreen() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<string>('unknown');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plotStates, setPlotStates] = useState<{[key: number]: {watered: boolean, planted: boolean, wateredAt?: number}}>({});
  const [autoFillHoneyEnabled, setAutoFillHoneyEnabled] = useState<boolean>(true);
  const [isFastForwarding, setIsFastForwarding] = useState<boolean>(false);
  const [plots, setPlots] = useState<any[]>([]);
  const [localDataSummary, setLocalDataSummary] = useState<{
    totalKeys: number;
    totalDataSize: number;
    keyDetails: Array<{ key: string; size: number; hasData: boolean }>;
  }>({ totalKeys: 0, totalDataSize: 0, keyDetails: [] });

  // Load plots data
  useEffect(() => {
    const loadPlots = async () => {
      try {
        const plotsData = await AsyncStorage.getItem('plots');
        if (plotsData) {
          setPlots(JSON.parse(plotsData));
        }
      } catch (error) {
        // error loading plots
      }
    };
    loadPlots();
  }, []);

  useEffect(() => {
    checkAuthState();
    checkLocationPermission();
    loadPlotStates();
    loadHoneySettings();
    loadLocalDataSummary();
    
    // Auto-refresh timer display every second for watered plots
    const interval = setInterval(() => {
      loadPlotStates();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadLocalDataSummary = async () => {
    try {
      const summary = await getLocalDataSummary();
      setLocalDataSummary(summary);
    } catch (error) {
      // error loading local data summary
    }
  };

  const checkAuthState = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserEmail(session.user.email || 'Anonymous User');
      setIsGuest(session.user.is_anonymous || false);
    } else {
      setUserEmail('Not logged in');
      setIsGuest(true);
    }
  };

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setLocationPermission(status);
  };

  const loadPlotStates = async () => {
    try {
      const saved = await AsyncStorage.getItem('plotStates');
      if (saved) {
        setPlotStates(JSON.parse(saved));
      }
    } catch (error) {
      // error loading plot states
    }
  };
  const loadHoneySettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('autoFillHoneyEnabled');
      if (saved !== null) {
        setAutoFillHoneyEnabled(JSON.parse(saved));
      }
    } catch (error) {
      // error loading honey settings
    }
  };

  const fastForwardHoneyProduction = async () => {
    if (!autoFillHoneyEnabled) {
      alert('Auto-fill honey must be enabled to use fast forward.');
      return;
    }

    setIsFastForwarding(true);
    
    try {
      // Check if we have any active crops or recently harvested plants
      const userStatsData = await AsyncStorage.getItem('user_stats');
      let recentlyHarvestedCount = 0;

      if (userStatsData) {
        const userStats = JSON.parse(userStatsData);
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        recentlyHarvestedCount = userStats.harvestedPlants
          ?.filter((harvest: any) => harvest.harvestedAt > twentyFourHoursAgo)
          ?.length || 0;
      }

      // Count active crops from loaded plots
      const activeCrops = plots.filter(plot => 
        plot && (plot.state === 'planted' || plot.state === 'growing') && plot.cropType
      );

      // active crops and recent harvest counts available for fast-forward logic

      if (activeCrops.length === 0 && recentlyHarvestedCount === 0) {
        alert('No crops found! Plant some flowers or wait for recent harvests to produce honey.');
        setIsFastForwarding(false);
        return;
      }

      // Trigger fast forward through AsyncStorage - the main honey production hook will pick this up
      const hoursToSimulate = 8;
      await AsyncStorage.setItem('honeyFastForwardRequest', JSON.stringify({
        hours: hoursToSimulate,
        timestamp: Date.now(),
        activeCropsCount: activeCrops.length,
        recentHarvestsCount: recentlyHarvestedCount
      }));
      
      // Show progress
      setTimeout(() => {
        alert(`✅ Fast forward complete! Your bees collected nectar from ${activeCrops.length} active crops and ${recentlyHarvestedCount} recently harvested plants for ${hoursToSimulate} hours. Check your hives!`);
        setIsFastForwarding(false);
        
        // Trigger a storage update to notify other components
        AsyncStorage.setItem('honeyFastForwardTrigger', Date.now().toString());
      }, 2000); // 2 second delay for realism
      
    } catch (error) {
      // error handling for fast forward
        alert('Failed to fast forward honey production. Please try again.');
      setIsFastForwarding(false);
    }
  };
  // Format remaining time for watered plots
  const formatTimeRemaining = (wateredAt: number) => {
    const now = Date.now();
    const elapsed = now - wateredAt;
    const twentyMinutes = 20 * 60 * 1000; // 20 minutes in milliseconds
    const remaining = twentyMinutes - elapsed;
    
    if (remaining <= 0) {
      return 'Expired';
    }
    
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSignOut = async () => {
    // Automatically proceed with sign out
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace('/auth');
    }
    setIsLoading(false);
  };

  const handleConnectAccount = () => {
    router.push('/auth');
  };

  const handleLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      
      // location permission updated
    } catch (error) {
      // location request error
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual dark mode functionality
    // dark mode toggle changed
  };

  const toggleAutoFillHoney = async () => {
    const newValue = !autoFillHoneyEnabled;
    setAutoFillHoneyEnabled(newValue);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('autoFillHoneyEnabled', JSON.stringify(newValue));
    } catch (error) {
      // error saving honey auto-fill setting
    }
  };

  const getPermissionStatusText = () => {
    switch (locationPermission) {
      case 'granted':
        return 'Granted ✅';
      case 'denied':
        return 'Denied ❌';
      case 'undetermined':
        return 'Not requested';
      default:
        return 'Unknown';
    }
  };

  const getPermissionStatusColor = () => {
    switch (locationPermission) {
      case 'granted':
        return '#4CAF50';
      case 'denied':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, isDarkMode && styles.darkText]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Settings Content */}
      <View style={styles.content}>
        
        {/* Account Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Account</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>User</Text>
              <Text style={[styles.settingValue, isDarkMode && styles.darkText]}>{userEmail}</Text>
              <Text style={[styles.settingSubtext, isDarkMode && styles.darkText]}>
                {isGuest ? 'Guest Account' : 'Full Account'}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.actionButton, 
              isGuest ? styles.connectButton : styles.signOutButton,
              isLoading && styles.disabledButton
            ]}
            onPress={isGuest ? handleConnectAccount : handleSignOut}
            disabled={isLoading}
          >
            <Text style={styles.actionButtonText}>
              {isLoading ? 'Loading...' : (isGuest ? 'Connect Account' : 'Sign Out')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Local Progress Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Local Progress</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Saved Data</Text>
              <Text style={[styles.settingValue, isDarkMode && styles.darkText]}>
                {localDataSummary.keyDetails.length} items saved
              </Text>
              <Text style={[styles.settingSubtext, isDarkMode && styles.darkText]}>
                {Math.round(localDataSummary.totalDataSize / 1024)}KB • Experience, inventory, hives & more
              </Text>
            </View>
          </View>

          <View style={styles.progressInfoContainer}>
            <Text style={[styles.progressInfoText, isDarkMode && styles.darkText]}>
              💾 Your progress is automatically preserved when you sign in or create an account
            </Text>
            <Text style={[styles.progressInfoText, isDarkMode && styles.darkText]}>
              🔒 All data stays on your device until you choose to sync
            </Text>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Appearance</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Dark Mode</Text>
              <Text style={[styles.settingSubtext, isDarkMode && styles.darkText]}>
                Switch between light and dark themes
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Honey Production Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>🍯 Honey Production</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Auto-Fill Honey</Text>
              <Text style={[styles.settingSubtext, isDarkMode && styles.darkText]}>
                Automatically track honey production based on planted and harvested crops
              </Text>
              <Text style={[styles.settingSubtext, isDarkMode && styles.darkText]}>
                {autoFillHoneyEnabled 
                  ? '🐝 Bees will collect nectar from your active crops' 
                  : '⭕ Manual honey management only'
                }
              </Text>
            </View>
            <Switch
              value={autoFillHoneyEnabled}
              onValueChange={toggleAutoFillHoney}
              trackColor={{ false: '#767577', true: '#FFB300' }}
              thumbColor={autoFillHoneyEnabled ? '#FF8F00' : '#f4f3f4'}
            />
          </View>
          
          {/* Fast Forward Honey Production */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Fast Forward Production</Text>
              <Text style={[styles.settingSubtext, isDarkMode && styles.darkText]}>
                Simulate 8 hours of honey production from current/recent crops
              </Text>
              <Text style={[styles.settingSubtext, isDarkMode && styles.darkText]}>
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

        {/* Permissions Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Permissions</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Location</Text>
              <Text style={[styles.settingSubtext, isDarkMode && styles.darkText]}>
                Required for weather features
              </Text>
              <Text style={[styles.permissionStatus, { color: getPermissionStatusColor() }]}>
                Status: {getPermissionStatusText()}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.permissionButton]}
              onPress={handleLocationPermission}
            >
              <Text style={styles.permissionButtonText}>
                {locationPermission === 'granted' ? 'Granted' : 'Request'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Growth Algorithm Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>🌱 Plant Growth Algorithm</Text>
          
          <View style={styles.algorithmInfo}>
            <Text style={[styles.algorithmText, isDarkMode && styles.darkText]}>
              The growth rate system calculates optimal conditions for your plants based on real-time environmental data:
            </Text>
            
            <View style={styles.factorSection}>
              <Text style={[styles.factorTitle, isDarkMode && styles.darkText]}>🌡️ Temperature Factor</Text>
              <Text style={[styles.factorDetails, isDarkMode && styles.darkText]}>
                • Optimal: 18-25°C (100% efficiency){'\n'}
                • Good: 10-18°C or 25-30°C (50-100%){'\n'}
                • Poor: 5-10°C or 30-35°C (10-50%){'\n'}
                • Critical: Below 5°C or above 35°C (≤20%)
              </Text>
            </View>
            
            <View style={styles.factorSection}>
              <Text style={[styles.factorTitle, isDarkMode && styles.darkText]}>💧 Humidity Factor</Text>
              <Text style={[styles.factorDetails, isDarkMode && styles.darkText]}>
                • Optimal: 40-70% (100% efficiency){'\n'}
                • Moderate: 20-40% or 70-85% (50-100%){'\n'}
                • Poor: Below 20% or above 85% (≤70%)
              </Text>
            </View>
            
            <View style={styles.factorSection}>
              <Text style={[styles.factorTitle, isDarkMode && styles.darkText]}>🪐 Planetary Factor</Text>
              <Text style={[styles.factorDetails, isDarkMode && styles.darkText]}>
                • Earth: No penalty (100%){'\n'}
                • Other Planets: 90% growth penalty (10% efficiency){'\n'}
                • Reflects challenges of off-world cultivation
              </Text>
            </View>
            
            <View style={styles.formulaSection}>
              <Text style={[styles.formulaTitle, isDarkMode && styles.darkText]}>📊 Final Calculation</Text>
              <Text style={[styles.formulaText, isDarkMode && styles.darkText]}>
                Growth Rate = Base Rate × Temperature Factor × Humidity Factor × Planet Factor
              </Text>
            </View>
          </View>
        </View>

        {/* Debugging Section - Plot States */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <View style={styles.debugHeader}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>🐛 Plot Debug Info</Text>
            <TouchableOpacity 
              style={[styles.refreshButton, isDarkMode && styles.darkRefreshButton]}
              onPress={loadPlotStates}
            >
              <Text style={[styles.refreshText, isDarkMode && styles.darkText]}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.debugGrid}>
            {[0, 1, 2, 3, 4, 5].map(plotId => (
              <View key={plotId} style={[styles.debugPlot, isDarkMode && styles.darkDebugPlot]}>
                <Text style={[styles.debugPlotTitle, isDarkMode && styles.darkText]}>
                  Plot {plotId + 1}
                </Text>
                <Text style={[styles.debugText, isDarkMode && styles.darkText]}>
                  💧 Watered: {plotStates[plotId]?.watered ? '✅' : '❌'}
                </Text>
                <Text style={[styles.debugText, isDarkMode && styles.darkText]}>
                  🌱 Planted: {plotStates[plotId]?.planted ? '✅' : '❌'}
                </Text>
                {plotStates[plotId]?.watered && plotStates[plotId]?.wateredAt && (
                  <Text style={[styles.debugText, isDarkMode && styles.darkText]}>
                    ⏱️ Timer: {formatTimeRemaining(plotStates[plotId].wateredAt!)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
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
  permissionStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  connectButton: {
    backgroundColor: '#4CAF50',
  },
  signOutButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
  algorithmInfo: {
    marginTop: 10,
  },
  algorithmText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  factorSection: {
    marginBottom: 15,
  },
  factorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  factorDetails: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 10,
  },
  formulaSection: {
    marginTop: 10,
    padding: 15,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 5,
  },
  formulaText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  debugGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  debugPlot: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  darkDebugPlot: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  debugPlotTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  refreshButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  darkRefreshButton: {
    backgroundColor: '#5BA2F2',
  },
  refreshText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  fastForwardButton: {
    backgroundColor: '#FFB300',
    minWidth: 120,
  },
  fastForwardButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
});