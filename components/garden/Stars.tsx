import type { StarsProps } from '@/types/garden';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { starsStyles as styles } from '../../styles/garden/StarsStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Stars({ starVisibility, starField }: StarsProps) {
  if (!starVisibility?.isVisible || starField.length === 0) return null;

  return (
    <>
      {starField.map((star, index) => (
        star.visible ? (
          <View
            key={`star-${index}`}
            style={[
              styles.star,
              {
                left: star.x * screenWidth,
                top: star.y * screenHeight * 0.6, // Only in upper 60% of screen
                width: star.size,
                height: star.size,
                opacity: star.magnitude,
                borderRadius: star.size / 2,
              }
            ]}
          />
        ) : null
      ))}
    </>
  );
}