import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface SellAnimationProps {
  visible: boolean;
  cropEmoji: string;
  cropCount: number;
  coinsEarned: number;
  onComplete: () => void;
}

export function SellAnimation({
  visible,
  cropEmoji,
  cropCount,
  coinsEarned,
  onComplete,
}: SellAnimationProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));
  const [coinSlide] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(0);
      coinSlide.setValue(0);

      // Fade in and slide up
      Animated.sequence([
        // First show the crop being sold
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -30,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Then show coins
        Animated.timing(coinSlide, {
          toValue: 1,
          duration: 500,
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
      }, 1800);
    }
  }, [visible, fadeAnim, slideAnim, coinSlide, onComplete]);

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
        {/* Crops sold */}
        <View style={styles.soldRow}>
          <Text style={styles.emoji}>{cropEmoji}</Text>
          <Text style={styles.countText}>-{cropCount}</Text>
        </View>

        {/* Coins earned */}
        <Animated.View 
          style={[
            styles.coinsRow,
            {
              opacity: coinSlide,
              transform: [
                { 
                  translateX: coinSlide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  })
                }
              ],
            }
          ]}
        >
          <Text style={styles.coinEmoji}>🪙</Text>
          <Text style={styles.coinText}>+{coinsEarned}</Text>
        </Animated.View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
    minWidth: 200,
  },
  soldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 4,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 4,
    marginTop: 12,
  },
  emoji: {
    fontSize: 36,
  },
  countText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ef4444',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  coinEmoji: {
    fontSize: 36,
  },
  coinText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22c55e',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
