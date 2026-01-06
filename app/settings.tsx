import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    AccountSection,
    AppearanceSection,
    DayNightOverrideSection,
    DebugSection,
    FillHivesSection,
    GrowthAlgorithmSection,
    LocalProgressSection,
    PermissionsSection,
} from '../components/settings';
import { setOverride as setThemeOverride } from '../hooks/themeManager';
import { useColorScheme } from '../hooks/use-color-scheme';
import { getLocalDataSummary } from '../lib/progressPreservation';
import { supabase } from '../lib/supabase';

export default function SettingsScreen() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [locationPermission, setLocationPermission] = useState<string>('unknown');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plotStates, setPlotStates] = useState<{[key: number]: {watered: boolean, planted: boolean, wateredAt?: number}}>({});
  const [autoFillHoneyEnabled, setAutoFillHoneyEnabled] = useState<boolean>(true);
  const [plots, setPlots] = useState<any[]>([]);
  const [forceDaytime, setForceDaytime] = useState<boolean>(false);
  const [localDataSummary, setLocalDataSummary] = useState<{
    totalKeys: number;
    totalDataSize: number;
    keyDetails: { key: string; size: number; hasData: boolean }[];
  }>({ totalKeys: 0, totalDataSize: 0, keyDetails: [] });

  // Load plots data
  useEffect(() => {
    const loadPlots = async () => {
      try {
        const plotsData = await AsyncStorage.getItem('plots');
        if (plotsData) {
          setPlots(JSON.parse(plotsData));
        }
      } catch {
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
    loadForceDaytimeSettings();
    loadLocalDataSummary();

    // load persisted dark mode preference (set runtime override)
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('darkMode');
        if (stored !== null) {
          const v = stored === 'true';
          setThemeOverride(v ? 'dark' : 'light');
        }
      } catch {
        // ignore
      }
    })();
    
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
    } catch {
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
    } catch {
      // error loading plot states
    }
  };
  const loadHoneySettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('autoFillHoneyEnabled');
      if (saved !== null) {
        setAutoFillHoneyEnabled(JSON.parse(saved));
      }
    } catch {
      // error loading honey settings
    }
  };

  const loadForceDaytimeSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('forceDaytime');
      if (saved !== null) {
        setForceDaytime(saved === 'true');
      }
    } catch {
      // error loading force daytime settings
    }
  };

  const handleSignOut = async () => {
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
    } catch {
      // location request error
    }
  };

  const toggleDarkMode = async () => {
    const newValue = !isDark;
    try {
      await AsyncStorage.setItem('darkMode', newValue ? 'true' : 'false');
    } catch {
      // ignore write errors
    }
    setThemeOverride(newValue ? 'dark' : 'light');
  };

  const toggleAutoFillHoney = async () => {
    const newValue = !autoFillHoneyEnabled;
    setAutoFillHoneyEnabled(newValue);
    
    try {
      await AsyncStorage.setItem('autoFillHoneyEnabled', JSON.stringify(newValue));
    } catch {
      // error saving honey auto-fill setting
    }
  };

  const toggleForceDaytime = async () => {
    const newValue = !forceDaytime;
    setForceDaytime(newValue);
    
    try {
      await AsyncStorage.setItem('forceDaytime', newValue ? 'true' : 'false');
    } catch {
      // error saving force daytime setting
    }
  };

  const clearAllHoney = async () => {
    try {
      console.log('🧹 Starting honey clear process...');
      
      // Get all hives and clear their honey
      const hivesData = await AsyncStorage.getItem('hives');
      if (hivesData) {
        const hives = JSON.parse(hivesData);
        console.log('🧹 Current hives before clear:', hives.map(h => `${h.id}: ${h.honey?.honeyBottles || 0} bottles`));
        
        const clearedHives = hives.map((hive: any) => ({
          ...hive,
          honey: {
            ...hive.honey,
            honeyBottles: 0,
            dailyHarvests: [],
            currentCapacity: 0,
          }
        }));
        await AsyncStorage.setItem('hives', JSON.stringify(clearedHives));
        console.log('🧹 Hives cleared and saved to storage');
        
        // Clear honey bottles from inventory
        const inventoryData = await AsyncStorage.getItem('inventory');
        if (inventoryData) {
          const inventory = JSON.parse(inventoryData);
          if (inventory.items) {
            inventory.items.honey_bottles = 0;
            await AsyncStorage.setItem('inventory', JSON.stringify(inventory));
          }
        }
        
        // Trigger refresh signal
        await AsyncStorage.setItem('hivesRefreshSignal', Date.now().toString());
        
        console.log('🍯 All honey cleared from hives and inventory');
      }
    } catch (error) {
      console.error('Error clearing honey:', error);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, isDark && styles.darkText]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.darkText]}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <AccountSection
          userEmail={userEmail}
          isGuest={isGuest}
          isLoading={isLoading}
          onSignOut={handleSignOut}
          onConnectAccount={handleConnectAccount}
          isDark={isDark}
        />

        <LocalProgressSection
          localDataSummary={localDataSummary}
          isDark={isDark}
        />

        <AppearanceSection
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
        />

        <FillHivesSection isDark={isDark} />

        <PermissionsSection
          locationPermission={locationPermission}
          onRequestLocationPermission={handleLocationPermission}
          isDark={isDark}
        />

        <GrowthAlgorithmSection isDark={isDark} />

        <DayNightOverrideSection
          isDark={isDark}
          forceDaytime={forceDaytime}
          onToggleForceDaytime={toggleForceDaytime}
        />

        <DebugSection
          plotStates={plotStates}
          onRefresh={loadPlotStates}
          onClearHoney={clearAllHoney}
          isDark={isDark}
        />
      </ScrollView>
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
  darkHeader: {
    backgroundColor: '#151718',
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  darkText: {
    color: '#fff',
  },
});