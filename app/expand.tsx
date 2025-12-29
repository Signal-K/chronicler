import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GardenBottomBar } from '../components/garden/GardenBottomBar';
import { MapCard } from '../components/garden/MapCard';
import { SimpleToolbar } from '../components/garden/SimpleToolbar';
import { GameHeader } from '../components/ui/GameHeader';
import { useMapSystem } from '../hooks/useMapSystem';

export default function ExpandScreen() {
  const router = useRouter();
  const { getAllMaps, unlockMap, setActiveMap, activeMapId, isLoading } = useMapSystem();
  const [coins, setCoins] = useState(500); // TODO: Get from game state

  const handleNavigate = (route: string) => {
    router.replace(route as any);
  };

  const handleUnlockMap = async (mapId: string) => {
    const success = await unlockMap(mapId as any, coins);

    if (success) {
      const map = getAllMaps().find(m => m.id === mapId);
      if (map) {
        setCoins(prev => prev - map.unlockCost);
      };
    } else {
      Alert.alert(
        'Cannot unlock',
        'You need more coins to unlock this map',
        [{ text: 'OK' }]
      )
    };
  };

  const handleSelectMap = async (mapId: string) => {
    await setActiveMap(mapId as any);
  };

  const allMaps = getAllMaps();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient 
          colors={['#86efac', '#4ade80', '#22c55e']} 
          style={StyleSheet.absoluteFillObject} 
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading maps...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <GameHeader 
        coins={coins} 
        water={100} 
        maxWater={100}
        weather="sunny"
        onHarvestClick={() => {}}
        onShovelClick={() => {}}
        canHarvest={false}
        canShovel={false} 
        isHarvestSelected={false}
        isShovelSelected={false}
      />
      
      {/* Background */}
      <LinearGradient 
        colors={['#86efac', '#4ade80', '#22c55e']} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🗺️</Text>
          <Text style={styles.sectionTitle}>Unlock New Maps</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Each map has unique weather conditions and growth multipliers!
        </Text>

        {/* Map Cards */}
        {allMaps.map((map) => (
          <MapCard
            key={map.id}
            map={map}
            onUnlock={handleUnlockMap}
            onSelect={handleSelectMap}
            currentCoins={coins}
            isActive={map.id === activeMapId}
          />
        ))}

        {/* Future: Plot Purchasing Section */}
        <View style={styles.plotSection}>
          <Text style={styles.plotTitle}>🏡 Purchase Additional Plots</Text>
          <Text style={styles.plotDescription}>
            Coming soon - Expand your farm with more growing space!
          </Text>
        </View>
      </ScrollView>

      {/* Toolbar with navigation */}
      <SimpleToolbar 
        selectedTool={null}
        onToolSelect={() => {}}
        onPlantSelect={() => {}}
        canTill={false}
        canPlant={false}
        canWater={false}
        canShovel={false}
        seedInventory={{}}
        currentRoute="expand"
        onNavigate={handleNavigate}
      />
      
      <GardenBottomBar 
        onOpenAlmanac={() => {}}
        onOpenInventory={() => {}}
        onOpenShop={() => {}}
        onOpenSettings={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  content: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1917',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 32,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1917',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#44403c',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  plotSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#92400e',
    padding: 24,
    marginTop: 16,
    alignItems: 'center',
  },
  plotTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  plotDescription: {
    fontSize: 14,
    color: '#78350f',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
