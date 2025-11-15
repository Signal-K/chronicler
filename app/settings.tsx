import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<string>('unknown');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plotStates, setPlotStates] = useState<{[key: number]: {watered: boolean, planted: boolean, wateredAt?: number}}>({});

  useEffect(() => {
    checkAuthState();
    checkLocationPermission();
    loadPlotStates();
    
    // Auto-refresh timer display every second for watered plots
    const interval = setInterval(() => {
      loadPlotStates();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

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
      console.log('Error loading plot states:', error);
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
    console.log('Sign Out: Are you sure you want to sign out?');
    // Automatically proceed with sign out
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Error:', error.message);
    } else {
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
      
      if (status === 'granted') {
        console.log('Success: Location permission granted!');
      } else {
        console.log('Permission Denied: Location permission is needed for weather features.');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      console.log('Error: Failed to request location permission');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual dark mode functionality
    console.log(`Dark Mode: ${!isDarkMode ? 'enabled' : 'disabled'} (Coming soon!)`);
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
});