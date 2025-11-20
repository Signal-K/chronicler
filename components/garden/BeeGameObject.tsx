import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BeeGameObjectProps {
  beeId: string;
  onDespawn: (beeId: string) => void;
}

export function BeeGameObject({ beeId, onDespawn }: BeeGameObjectProps) {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH / 2)).current;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT / 2)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

    const rotateInterpolate = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    useEffect(() => {
        const HOVER_DURATION = 5000 + Math.random() * 3000;
        const FLY_DURATION = 2000;
        const startX = (SCREEN_WIDTH * 0.3) + Math.random() * (SCREEN_WIDTH * 0.4);
        const startY = (SCREEN_HEIGHT * 0.3) + Math.random() * (SCREEN_HEIGHT * 0.3);
        translateX.setValue(startX);
        translateY.setValue(startY);
        opacity.setValue(0);
        
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        const hoverAnimation = () => {
            const hoverX = (SCREEN_WIDTH * 0.2) + Math.random() * (SCREEN_WIDTH * 0.6);
            const hoverY = (SCREEN_HEIGHT * 0.2) + Math.random() * (SCREEN_HEIGHT * 0.5);
            const duration = 2000 + Math.random() * 2000;
            const currentX = (translateX as any)._value || startX;
            const direction = hoverX > currentX ? 0 : 1;

            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: hoverX,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: hoverY,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(rotate, {
                    toValue: direction,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        };

        hoverAnimation();
        const hoverInterval = setInterval(hoverAnimation, 2500);

        const leaveTimeout = setTimeout(() => {
            clearInterval(hoverInterval);
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: -100,
                    duration: FLY_DURATION,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: SCREEN_HEIGHT * 0.3,
                    duration: FLY_DURATION,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: FLY_DURATION,
                    useNativeDriver: true,
                }),
                Animated.timing(rotate, {
                    toValue: 1, // Direction: facing left
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onDespawn(beeId);
            });
        }, HOVER_DURATION);

        return () => {
            clearInterval(hoverInterval);
            clearTimeout(leaveTimeout);
        };
    }, [beeId, translateX, translateY, opacity, rotate, onDespawn]);

  return (
    <Animated.View
      style={[
        styles.bee,
        {
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotateY: rotateInterpolate },
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
    zIndex: 10,
  },
  beeEmoji: {
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
