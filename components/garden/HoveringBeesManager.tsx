import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HoveringBeeWithTag } from './HoveringBeeWithTag';
import type { HoveringBeeData } from '../../hooks/useHoveringBees';

interface HoveringBeesManagerProps {
  bees: HoveringBeeData[];
  onDespawn?: (beeId: string) => void;
  onBeePress?: (bee: HoveringBeeData) => void;
  canClassifyBee?: (hiveId: string) => boolean;
}

export function HoveringBeesManager({ 
  bees, 
  onDespawn, 
  onBeePress, 
  canClassifyBee 
}: HoveringBeesManagerProps) {
  if (bees.length === 0) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      {bees.map((bee) => (
        <HoveringBeeWithTag
          key={bee.identity.id}
          bee={bee}
          onDespawn={onDespawn}
          onBeePress={onBeePress}
          showClassificationArrow={canClassifyBee?.(bee.identity.hiveId) ?? false}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});