import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

interface HelpTooltipProps {
  /** The tooltip message */
  message: string;
  /** Icon to display */
  icon?: string;
  /** Auto-dismiss after ms (0 = manual dismiss only) */
  autoDismissMs?: number;
  /** Whether the tooltip is visible */
  visible: boolean;
  /** Callback when dismissed */
  onDismiss: () => void;
  /** Position on screen */
  position?: 'top' | 'bottom' | 'center';
}

export function HelpTooltip({
  message,
  icon = '💡',
  autoDismissMs = 5000,
  visible,
  onDismiss,
  position = 'bottom',
}: HelpTooltipProps) {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleDismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  }, [onDismiss, slideAnim, fadeAnim]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss timer
      if (autoDismissMs > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, autoDismissMs);
        return () => clearTimeout(timer);
      }
    }
  }, [visible, autoDismissMs, slideAnim, fadeAnim, handleDismiss]);

  if (!visible) return null;

  const positionStyle = position === 'top' 
    ? styles.positionTop 
    : position === 'center'
    ? styles.positionCenter
    : styles.positionBottom;

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity style={styles.tooltip} onPress={handleDismiss} activeOpacity={0.9}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.dismissText}>Tap to dismiss</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Contextual tips for different game states
export const CONTEXTUAL_TIPS = {
  emptyPlot: '🚜 Tap the Till button, then tap this empty plot to prepare it for planting!',
  tilledPlot: '🌱 Great! Now tap Plant, select a seed, then tap the tilled soil to plant.',
  plantedPlot: '💧 Your seed needs water! Tap the Water button, then tap the planted plot.',
  growingPlot: '⏳ Your plant is growing! Water it regularly and wait for it to mature.',
  readyPlot: '🌾 Time to harvest! Tap the Harvest button, then tap the mature plant.',
  noBees: '🐝 Keep harvesting crops to attract bees to your garden!',
  lowWater: '💧 Running low on water! It refills over time automatically.',
  firstHive: '🍯 Navigate to Hives (◀️) to check on your bees and collect honey!',
  honeyReady: '🫗 Your hive has honey ready! Go to Hives and tap "Collect Honey".',
  levelUp: '⭐ Congratulations on leveling up! Check new unlocks in your XP screen.',
  lowCoins: '🛒 Need more coins? Harvest and sell crops at the shop!',
  nightTime: '🌙 It\'s nighttime! Bees rest, but you can still farm and plan for tomorrow.',
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  positionTop: {
    top: 100,
  },
  positionCenter: {
    top: '40%',
  },
  positionBottom: {
    bottom: 160,
  },
  tooltip: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  dismissText: {
    fontSize: 12,
    color: '#92400E',
    opacity: 0.6,
  },
});
