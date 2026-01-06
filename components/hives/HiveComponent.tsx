import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { HiveData } from '../../types/hive';

interface HiveComponentProps {
  hive: HiveData;
  onBottleHoney: () => void;
}

export default function HiveComponent({
  hive,
  onBottleHoney,
}: HiveComponentProps) {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [forceDay, setForceDay] = useState(false);
  
  console.log('🚨 NEW COMPONENT LOADING - HONEY BOTTLES:', hive.honey?.honeyBottles || 0);
  
  // Check force daytime setting for debug
  useEffect(() => {
    const checkForceDay = async () => {
      const setting = await AsyncStorage.getItem('forceDaytime');
      const isForceDay = setting === 'true';
      setForceDay(isForceDay);
    };
    checkForceDay();
    const interval = setInterval(checkForceDay, 2000);
    return () => clearInterval(interval);
  }, []);

  const honeyBottles = hive.honey?.honeyBottles || 0;
  const isProducing = hive.honey?.productionActive || false;

  // Pulsing animation for active production
  useEffect(() => {
    if (isProducing) {
      const pulse = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);
      
      const loopAnimation = Animated.loop(pulse);
      loopAnimation.start();
      
      return () => loopAnimation.stop();
    }
  }, [isProducing, pulseAnim]);

  const formatTime = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if ((hour >= 8 && hour <= 16) || (hour >= 20 || hour <= 4)) {
      return isProducing ? '🟢 Active' : '🟡 Ready';
    } else {
      return '🔴 Dormant';
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.hiveBody}>
        {/* Hive Icon */}
        <Text style={styles.hiveIcon}>🏺</Text>
        
        {/* Hive Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.hiveTitle}>Hive #{hive.id.split('-')[0]}</Text>
          <Text style={styles.beeCount}>🐝 {hive.beeCount} bees</Text>
          <Text style={styles.status}>{formatTime()}</Text>
          
          {/* Simple Honey Bottles Display */}
          <Text style={styles.honeyText}>🍯 {honeyBottles}/15 bottles</Text>
          
          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                backgroundColor: honeyBottles > 0 ? '#FCD34D' : '#D1D5DB',
                opacity: honeyBottles > 0 ? 1 : 0.5 
              }
            ]}
            onPress={onBottleHoney}
            disabled={honeyBottles === 0}
          >
            <Text style={styles.buttonText}>
              {honeyBottles > 0 ? 'Collect Honey' : 'No Honey Ready'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hiveBody: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hiveIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  hiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  beeCount: {
    fontSize: 14,
    color: '#78716C',
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    color: '#57534E',
    marginBottom: 8,
  },
  honeyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 8,
  },
  honeyType: {
    fontSize: 12,
    color: '#78716C',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    textAlign: 'center',
  },
});