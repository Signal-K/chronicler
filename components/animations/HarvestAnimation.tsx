import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface HarvestAnimationProps {
  visible: boolean;
  cropEmoji: string;
  cropCount: number;
  seedCount: number;
  pollinationIncrease?: number;
  onComplete: () => void;
}

export function HarvestAnimation({
  visible,
  cropEmoji,
  cropCount,
  seedCount,
  pollinationIncrease = 1,
  onComplete,
}: HarvestAnimationProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(0);

      // Fade in and slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start();

      // Fade out after showing
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onComplete();
        });
      }, 1500);
    }
  }, [visible, fadeAnim, slideAnim, onComplete]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        {/* Crop rewards */}
        <View style={styles.rewardRow}>
          <Text style={styles.emoji}>{cropEmoji}</Text>
          <Text style={styles.countText}>+{cropCount}</Text>
        </View>

        {/* Seed rewards */}
        {seedCount > 0 && (
          <View style={styles.rewardRow}>
            <Text style={styles.emoji}>🌱</Text>
            <Text style={styles.countText}>+{seedCount}</Text>
          </View>
        )}
        
        {/* Pollination factor increase */}
        <View style={styles.rewardRow}>
          <Text style={styles.emoji}>🌸</Text>
          <Text style={styles.pollinationText}>+{pollinationIncrease}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    pointerEvents: 'none',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: '#facc15',
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  emoji: {
    fontSize: 36,
  },
  countText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#facc15',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  pollinationText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ec4899',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
