import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BeeProps {
  index: number;
}

function SingleBee({ index }: BeeProps) {
  const translateX = useRef(new Animated.Value(Math.random() * SCREEN_WIDTH)).current;
  const translateY = useRef(new Animated.Value(Math.random() * (SCREEN_HEIGHT * 0.6))).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Random flight pattern
    const duration = 8000 + Math.random() * 4000; // 8-12 seconds
    const startX = Math.random() * SCREEN_WIDTH;
    const startY = 100 + Math.random() * (SCREEN_HEIGHT * 0.4);

    translateX.setValue(startX);
    translateY.setValue(startY);

    const animateFlight = () => {
      const newEndX = Math.random() * SCREEN_WIDTH;
      const newEndY = 100 + Math.random() * (SCREEN_HEIGHT * 0.4);
      
      // Determine rotation based on direction
      const currentX = (translateX as any)._value || startX;
      const direction = newEndX > currentX ? 0 : 1;
      
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: newEndX,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: newEndY,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: direction,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Loop the animation
        animateFlight();
      });
    };

    // Stagger start times
    setTimeout(() => {
      animateFlight();
    }, index * 2000);
  }, [index, translateX, translateY, rotate]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View
      style={[
        styles.bee,
        {
          transform: [
            { translateX },
            { translateY },
            { rotateY: rotateInterpolate },
          ],
        },
      ]}
    >
      <Text style={styles.beeEmoji}>🐝</Text>
    </Animated.View>
  );
}

interface HoveringBeesProps {
  isDaytime?: boolean;
  count?: number;
}

export function HoveringBees({ isDaytime = true, count = 5 }: HoveringBeesProps) {
  if (!isDaytime) return null;

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <SingleBee key={index} index={index} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  bee: {
    position: 'absolute',
    zIndex: 10,
  },
  beeEmoji: {
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
