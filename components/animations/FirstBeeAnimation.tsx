import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FirstBeeAnimationProps {
  onComplete: () => void;
}

export function FirstBeeAnimation({ onComplete }: FirstBeeAnimationProps) {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH / 2)).current;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT / 2)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startX = SCREEN_WIDTH / 2;
    const startY = SCREEN_HEIGHT * 0.5;
    const endX = -100;
    const endY = SCREEN_HEIGHT * 0.3;

    translateX.setValue(startX);
    translateY.setValue(startY);
    scale.setValue(0);

    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.5,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: startX + 50,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: startX,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: startY - 50,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: startY,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),

      Animated.delay(300),
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: endX,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: endY,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete();
    });
  }, [translateX, translateY, scale, onComplete]);

  return (
    <Animated.View
      style={[
        styles.bee,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
        },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.beeEmoji}>🐝</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bee: {
    position: 'absolute',
    zIndex: 1000,
  },
  beeEmoji: {
    fontSize: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
