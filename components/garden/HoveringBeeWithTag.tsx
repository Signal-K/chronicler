import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { HoveringBeeData } from '../hooks/useHoveringBees';

interface HoveringBeeWithTagProps {
  bee: HoveringBeeData;
  onDespawn?: (beeId: string) => void;
  onBeePress?: (bee: HoveringBeeData) => void;
  showClassificationArrow?: boolean;
}

export function HoveringBeeWithTag({ 
  bee, 
  onDespawn, 
  onBeePress, 
  showClassificationArrow = false 
}: HoveringBeeWithTagProps) {
  const translateX = useRef(new Animated.Value(bee.currentX)).current;
  const translateY = useRef(new Animated.Value(bee.currentY)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Calculate time bee has been hovering
  const getHoveringTime = React.useCallback(() => {
    const seconds = Math.floor((Date.now() - bee.startedHoveringAt) / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [bee.startedHoveringAt]);

  const [hoveringTime, setHoveringTime] = React.useState(getHoveringTime());

  // Update hovering time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setHoveringTime(getHoveringTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [getHoveringTime]);

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Hovering animation - gentle movement around the target crop
    const createHoverAnimation = () => {
      const hoverRadius = 40; // Stay within 40px of starting position
      const randomAngle = Math.random() * 2 * Math.PI;
      const randomDistance = Math.random() * hoverRadius;
      
      const randomX = bee.currentX + Math.cos(randomAngle) * randomDistance;
      const randomY = bee.currentY + Math.sin(randomAngle) * randomDistance;
      const duration = 3000 + Math.random() * 2000; // 3-5 seconds
      
      // Determine rotation based on direction
      const currentX = (translateX as any)._value || bee.currentX;
      const direction = randomX > currentX ? 0 : 1; // 0 = right, 1 = left

      return Animated.parallel([
        Animated.timing(translateX, {
          toValue: randomX,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: randomY,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: direction,
          duration: 800,
          useNativeDriver: true,
        }),
      ]);
    };

    const startHovering = () => {
      createHoverAnimation().start(() => {
        // Continue hovering if component is still mounted
        setTimeout(startHovering, 500 + Math.random() * 1000);
      });
    };

    startHovering();

    // Auto-despawn after 2 minutes
    const despawnTimeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        onDespawn?.(bee.identity.id);
      });
    }, 120000); // 2 minutes

    return () => {
      clearTimeout(despawnTimeout);
    };
  }, [bee, translateX, translateY, opacity, rotate, onDespawn]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotateY: rotateInterpolate },
          ],
        },
      ]}
    >
      {/* Classification Arrow - appears when user can classify */}
      {showClassificationArrow && (
        <View style={styles.arrowContainer}>
          <Text style={styles.classificationArrow}>↓</Text>
        </View>
      )}
      
      {/* Clickable bee */}
      <TouchableOpacity 
        style={styles.beeContainer}
        onPress={() => onBeePress?.(bee)}
        activeOpacity={0.7}
      >
        {/* Bee emoji */}
        <Text style={styles.beeEmoji}>🐝</Text>
      </TouchableOpacity>
      
      {/* Info tag below bee */}
      <View style={styles.infoTag}>
        <Text style={styles.beeIdentifier}>{bee.identity.name}</Text>
        <Text style={styles.hoveringTime}>{hoveringTime}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 15,
  },
  arrowContainer: {
    position: 'absolute',
    top: -25,
    alignItems: 'center',
    zIndex: 20,
  },
  classificationArrow: {
    fontSize: 20,
    color: '#FF4444',
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  beeContainer: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  beeEmoji: {
    fontSize: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  infoTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  beeIdentifier: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
  },
  hoveringTime: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    marginTop: 1,
  },
});