import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { getCropConfig } from '../../lib/cropConfig';

type CropSpriteProps = {
  crop: string
  growthStage: number // 1-4
}

export function CropSprite({ crop, growthStage }: CropSpriteProps) {
  const config = getCropConfig(crop);
  
  if (!config) {
    return null;
  }

  // Growth stage is 1-4, array is 0-indexed
  const imageIndex = Math.min(Math.max(growthStage - 1, 0), 3);
  
  // Map crop types to their image sources
  const getImageSource = () => {
    const imageMap: Record<string, any[]> = {
      wheat: [
        require('@/assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'),
        require('@/assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
        require('@/assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
        require('@/assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      ],
      // Placeholder requires for other crops - replace with actual images when available
      tomato: [
        require('@/assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'), // Placeholder
        require('@/assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
        require('@/assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
        require('@/assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      ],
      carrot: [
        require('@/assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'), // Placeholder
        require('@/assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
        require('@/assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
        require('@/assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      ],
      corn: [
        require('@/assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'), // Placeholder
        require('@/assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
        require('@/assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
        require('@/assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      ],
      sunflower: [
        require('@/assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'), // Placeholder
        require('@/assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
        require('@/assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
        require('@/assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
      ],
    };
    
    return imageMap[crop]?.[imageIndex];
  };

  const imageSource = getImageSource();
  
  if (!imageSource) {
    return null;
  }

  return (
    <Image 
      source={imageSource}
      style={styles.cropImage}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  cropImage: {
    width: 80,
    height: 80,
  },
});