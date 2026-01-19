import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HiveComponent from '../components/hives/HiveComponent';
import { OrdersPanel } from '../components/hives/OrdersPanel';
import { HiveTutorial } from '../components/tutorial/HiveTutorial';
import { useGameState } from '../hooks/useGameState';
import { useHiveState } from '../hooks/useHiveState';
import { useHoneyOrders } from '../hooks/useHoneyOrders';
import { awardSaleXP } from '../lib/experienceSystem';
import { HONEY_TYPE_CONFIG, HoneyType } from '../types/honeyOrders';
import type { BottledHoney } from '../types/inventory';

const HIVE_TUTORIAL_SHOWN_KEY = 'hive_tutorial_shown';

export default function HivesScreen() {
  const { hives, bottleHoneyFromHive, honeyProduction } = useHiveState();
  const { inventory, setInventory } = useGameState();
  const { 
    orders, 
    refreshDailyOrders, 
    fulfillOrder, 
    getQuotaStatus,
    loaded: ordersLoaded,
  } = useHoneyOrders();
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [forceDay, setForceDay] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeTab, setActiveTab] = useState<'hives' | 'orders'>('hives');

  // Check if we should show the hive tutorial
  useEffect(() => {
    const checkTutorialStatus = async () => {
      const shown = await AsyncStorage.getItem(HIVE_TUTORIAL_SHOWN_KEY);
      if (!shown) {
        setShowTutorial(true);
      }
    };
    checkTutorialStatus();
  }, []);

  // Handle tutorial completion
  const handleTutorialComplete = async () => {
    await AsyncStorage.setItem(HIVE_TUTORIAL_SHOWN_KEY, 'true');
    setShowTutorial(false);
  };

  // Get user's bottled honey from inventory
  const getBottledHoney = (): BottledHoney[] => {
    const bottledHoneyArray: BottledHoney[] = inventory.bottledHoney || [];
    return bottledHoneyArray;
  };

  // Get glass bottle count
  const getGlassBottles = (): number => {
    return inventory.items?.glass_bottle || 0;
  };

  // Get farming history (which crops user has harvested)
  const getFarmingHistory = (): string[] => {
    return Object.keys(inventory.harvested || {}).filter(
      crop => (inventory.harvested[crop] || 0) > 0
    );
  };

  // Refresh daily orders when screen loads
  useEffect(() => {
    if (ordersLoaded) {
      refreshDailyOrders(getBottledHoney(), getFarmingHistory());
    }
  }, [ordersLoaded]);

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
      // Determine honey type from result
      const honeyType: HoneyType = (result.honeyType?.type as HoneyType) || 'wildflower';
      
      // Create new bottled honey entry
      const newBottle: BottledHoney = {
        id: `bottle-${Date.now()}`,
        type: honeyType,
        color: HONEY_TYPE_CONFIG[honeyType]?.color || '#FFE4B5',
        amount: result.bottlesCollected,
      };
      
      // Add to inventory
      const existingBottledHoney = inventory.bottledHoney || [];
      const existingIndex = existingBottledHoney.findIndex(b => b.type === honeyType);
      
      let updatedBottledHoney: BottledHoney[];
      if (existingIndex >= 0) {
        // Update existing entry
        updatedBottledHoney = existingBottledHoney.map((b, i) => 
          i === existingIndex 
            ? { ...b, amount: b.amount + result.bottlesCollected }
            : b
        );
      } else {
        // Add new entry
        updatedBottledHoney = [...existingBottledHoney, newBottle];
      }
      
      const newInventory = {
        ...inventory,
        bottledHoney: updatedBottledHoney,
        items: {
          ...inventory.items,
          honey_bottles: (inventory.items?.honey_bottles || 0) + result.bottlesCollected,
        },
      };
      setInventory(newInventory);
      
      // Show success message
      const config = HONEY_TYPE_CONFIG[honeyType];
      let message = `Collected ${result.bottlesCollected} bottles of ${config?.name || 'honey'}!`;
      if (result.honeyType) {
        message += `\n\n${result.honeyType.blendDescription}\nQuality: ${Math.round(result.honeyType.quality)}/100`;
      }
      
      Alert.alert('🍯 Honey Collected!', message);
      setRefreshKey(prev => prev + 1);
    } else {
      Alert.alert('🐝 Not Ready', 'This hive needs more harvests or is not in production hours.');
    }
  };

  const handleFulfillOrder = async (orderId: string) => {
    const bottledHoney = getBottledHoney();
    const glassBottles = getGlassBottles();
    
    // Find the order to get details
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const result = fulfillOrder(orderId, bottledHoney, glassBottles);
    
    if (result.success) {
      // Deduct honey from inventory
      const updatedBottledHoney = bottledHoney.map(b => {
        if (b.type === order.honeyType) {
          return { ...b, amount: b.amount - order.bottlesRequested };
        }
        return b;
      }).filter(b => b.amount > 0);
      
      // Deduct glass bottles and add coins
      const newInventory = {
        ...inventory,
        coins: inventory.coins + result.coinsEarned,
        bottledHoney: updatedBottledHoney,
        items: {
          ...inventory.items,
          glass_bottle: (inventory.items?.glass_bottle || 0) - order.bottlesRequested,
          honey_bottles: Math.max(0, (inventory.items?.honey_bottles || 0) - order.bottlesRequested),
        },
      };
      setInventory(newInventory);
      
      // Award XP
      const config = HONEY_TYPE_CONFIG[order.honeyType];
      await awardSaleXP(result.xpEarned, config.name, order.bottlesRequested);
      
      // Show success message
      let message = `${result.message}\n\n`;
      message += `🪙 +${result.coinsEarned} coins\n`;
      message += `⭐ +${result.xpEarned} XP`;
      if (result.wasReduced) {
        message += '\n\n⚠️ Daily quota reached for this honey type!';
      }
      
      Alert.alert('📦 Order Fulfilled!', message);
      setRefreshKey(prev => prev + 1);
    } else {
      Alert.alert('❌ Cannot Fulfill', result.message);
    }
  };

  // Calculate total bottled honey count
  const totalBottledHoney = getBottledHoney().reduce((sum, b) => sum + b.amount, 0);

  return (
    <View style={styles.container}>
      {/* Hive Tutorial */}
      <HiveTutorial
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
      />

      <View style={styles.header}>
        <Text style={styles.title}>🐝 Bee Hives</Text>
        <Text style={styles.subtitle}>
          Honey production: 8AM-4PM & 8PM-4AM
        </Text>
        <View style={styles.inventoryRow}>
          <Text style={styles.inventoryText}>
            🍯 {totalBottledHoney} bottles
          </Text>
          <Text style={styles.inventoryText}>
            🫙 {getGlassBottles()} glass
          </Text>
          <Text style={styles.inventoryText}>
            🪙 {inventory.coins}
          </Text>
        </View>
        
        {/* Tutorial button */}
        <TouchableOpacity 
          style={styles.tutorialButton}
          onPress={() => setShowTutorial(true)}
        >
          <Text style={styles.tutorialButtonText}>❓ Tutorial</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hives' && styles.tabActive]}
          onPress={() => setActiveTab('hives')}
        >
          <Text style={[styles.tabText, activeTab === 'hives' && styles.tabTextActive]}>
            🏺 Hives
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.tabActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
            📋 Orders ({orders.filter(o => !o.isCompleted).length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'hives' ? (
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
      ) : (
        <OrdersPanel
          orders={orders}
          userHoneyStock={getBottledHoney()}
          glassBottles={getGlassBottles()}
          onFulfillOrder={handleFulfillOrder}
          getQuotaStatus={getQuotaStatus}
          onRefreshOrders={() => refreshDailyOrders(getBottledHoney(), getFarmingHistory())}
        />
      )}
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
  inventoryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  inventoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  tutorialButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#FCD34D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tutorialButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#F59E0B',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#F59E0B',
    backgroundColor: '#FCD34D20',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#78716C',
  },
  tabTextActive: {
    color: '#92400E',
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
