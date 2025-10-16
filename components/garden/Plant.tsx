import type { Plant, PlantComponentProps, Plot } from '@/types/plant';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

// Growth time in milliseconds (20 minutes)
export const GROWTH_TIME = 20 * 60 * 1000;

// Sprite mapping for each stage
const PLANT_SPRITES: Record<number, any> = {
  0: require('../../assets/Sprites/Growing Plants/tile000.png'),
  1: require('../../assets/Sprites/Growing Plants/tile001.png'),
  2: require('../../assets/Sprites/Growing Plants/tile009.png'),
};

export function PlantComponent({ plant, onWater }: PlantComponentProps) {
  return (
    <View style={plantStyles.container}>
      <Image
        source={PLANT_SPRITES[plant.stage]}
        style={plantStyles.sprite}
        resizeMode="contain"
      />
      {plant.needsWater && (
        <TouchableOpacity
          onPress={onWater}
          style={plantStyles.waterIcon}
        >
          <View style={plantStyles.waterBubble}>
            <Image
              source={require('../../assets/Sprites/Growing Plants/tile000.png')}
              style={{ width: 24, height: 24 }}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const plantStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 120,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sprite: {
    width: 180,
    height: 135,
    opacity: 1.0,
    tintColor: undefined, // Ensures full brightness
  },
  waterIcon: {
    position: 'absolute',
    top: -20,
    right: -10,
  },
  waterBubble: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// Helper function to check if plant needs water
export function checkPlantGrowth(plant: Plant): Plant {
  const now = Date.now();
  const timeSinceWatered = now - plant.lastWateredAt;
  
  if (timeSinceWatered >= GROWTH_TIME && !plant.needsWater && plant.stage < 2) {
    return { ...plant, needsWater: true };
  }
  
  return plant;
}

// Helper function to water a plant
export function waterPlant(plant: Plant): Plant {
  if (!plant.needsWater || plant.stage >= 2) {
    return plant;
  }
  
  return {
    ...plant,
    stage: (plant.stage + 1) as 0 | 1 | 2,
    lastWateredAt: Date.now(),
    needsWater: false,
  };
}

// Helper function to plant grass on a plot
export function plantGrass(plot: Plot): Plot {
  if (!plot.isTilled || plot.plant) {
    return plot;
  }
  
  const now = Date.now();
  return {
    ...plot,
    plant: {
      type: 'grass',
      stage: 0,
      plantedAt: now,
      lastWateredAt: now,
      needsWater: false,
    },
  };
}