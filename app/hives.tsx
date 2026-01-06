import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import HiveComponent from '../components/hives/HiveComponent';
import { useGameState } from '../hooks/useGameState';
import { useHiveState } from '../hooks/useHiveState';

export default function HivesScreen() {
  const { hives, bottleHoneyFromHive, honeyProduction } = useHiveState();
  const { inventory, setInventory } = useGameState();
  const [refreshKey, setRefreshKey] = useState(0);
  const [forceDay, setForceDay] = useState(false);

  // Check force daytime setting and refresh more frequently when active
  useEffect(() => {
    const checkForceDay = async () => {
      const setting = await AsyncStorage.getItem('forceDaytime');
      const isForceDay = setting === 'true';
      setForceDay(isForceDay);
      
      if (isForceDay) {
        // Force refresh every 2 seconds when in force day mode
        setRefreshKey(prev => prev + 1);
      }
    };
    
    checkForceDay();
    const interval = setInterval(checkForceDay, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleBottleHoney = (hiveId: string) => {
    const result = bottleHoneyFromHive(hiveId);
    
    if (result.bottlesCollected > 0) {
      // Add honey bottles to inventory
      const newInventory = {
        ...inventory,
        items: {
          ...inventory.items,
          honey_bottles: (inventory.items?.honey_bottles || 0) + result.bottlesCollected,
        },
      };
      setInventory(newInventory);
      
      // Show success message
      let message = `Collected ${result.bottlesCollected} honey bottles!`;
      if (result.honeyType) {
        message += `\n\n${result.honeyType.blendDescription}\nQuality: ${Math.round(result.honeyType.quality)}/100`;
      }
      
      Alert.alert('🍯 Honey Collected!', message);
      setRefreshKey(prev => prev + 1);
    } else {
      Alert.alert('🐝 Not Ready', 'This hive needs more harvests or is not in production hours.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐝 Bee Hives</Text>
        <Text style={styles.subtitle}>
          Honey production: 8AM-4PM & 8PM-4AM
        </Text>
        {inventory.items?.honey_bottles && (
          <Text style={styles.inventoryText}>
            🍯 {inventory.items.honey_bottles} honey bottles in storage
          </Text>
        )}
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {hives.map((hive) => (
          <HiveComponent
            key={`${hive.id}-${refreshKey}`}
            hive={hive}
            onBottleHoney={() => handleBottleHoney(hive.id)}
          />
        ))}
        
        {hives.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hives available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F59E0B',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
  },
  inventoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#78716C',
    textAlign: 'center',
  },
});
