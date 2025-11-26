import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

interface FlyingBeeProps {
  beeId: string;
  startX: number;
  startY: number;
  onPress: (beeId: string) => void;
}

export function FlyingBee({ beeId, startX, startY, onPress }: FlyingBeeProps) {
  const positionX = useRef(new Animated.Value(startX)).current;
  const positionY = useRef(new Animated.Value(startY)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const generateWaypoints = () => {
  const waypoints = [];
  const numWaypoints = 3 + Math.floor(Math.random() * 3);
  
  for (let i = 0; i < numWaypoints; i++) {
    waypoints.push({
      x: Math.random() * (SCREEN_WIDTH - 100) + 50,
      y: Math.random() * (SCREEN_HEIGHT * 0.5) + SCREEN_HEIGHT * 0.2,
    });
  }
  
  return waypoints;
};

const waypoints = generateWaypoints();

// Animate through waypoints
const animateToWaypoint = (index: number) => {
  if (index >= waypoints.length) {
    // Return to start and loop
    animateToWaypoint(0);
    return;
  }

  const target = waypoints[index];
  const duration = 15000 + Math.random() * 10000; 

  Animated.parallel([
    Animated.timing(positionX, {
      toValue: target.x,
      duration,
      useNativeDriver: true,
    }),
    Animated.timing(positionY, {
      toValue: target.y,
      duration,
      useNativeDriver: true,
    }),
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: -0.1,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    ),
  ]).start(() => animateToWaypoint(index + 1));
};

animateToWaypoint(0);
  }, [startX, startY, positionX, positionY, rotation]);

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: positionX },
            { translateY: positionY },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress(beeId)}
        style={styles.touchableWrapper}
        activeOpacity={1}
      >
        <Animated.Text style={[styles.beeEmoji, { transform: [{ rotate: rotationInterpolate }] }]}>🐝</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 99999,
    elevation: 99999,
  },
  touchableWrapper: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beeEmoji: {
    fontSize: 52,
  },
});
