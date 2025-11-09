import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GardenBottomBar } from '../components/garden/GardenBottomBar';
import { SimpleToolbar } from '../components/garden/SimpleToolbar';
import { GameHeader } from '../components/ui/GameHeader';

export default function ExpandScreen() {
  const router = useRouter();

  // TODO: Implement farm expansion functionality
  // This screen will allow users to purchase new farm plots

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <GameHeader 
        coins={0} 
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
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>🏡</Text>
          <Text style={styles.placeholderTitle}>Expand Your Farm</Text>
          <Text style={styles.placeholderText}>
            Unlock new farm plots and expand your gardening empire!
          </Text>
          <Text style={styles.placeholderSubtext}>
            Coming soon...
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
        onNavigate={(route) => router.push(route as any)}
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
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  placeholder: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#92400e',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#78350f',
    textAlign: 'center',
    marginBottom: 8,
    maxWidth: 300,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#a8a29e',
    fontStyle: 'italic',
  },
});
