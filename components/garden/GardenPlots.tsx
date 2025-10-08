import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { gardenPlotsStyles as styles } from '../../styles/garden/GardenPlotsStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GardenPlotsProps {
  showFlowers: boolean;
}

export default function GardenPlots({ showFlowers }: GardenPlotsProps) {
  return (
    <>
      {/* Plots using sand_07 sprite */}
      <Image 
        source={require('@/assets/Sprites/Sand/sand_07.png')}
        style={[styles.plotContainer, { left: 40, top: screenHeight * 0.58 }]}
        resizeMode="cover"
      />
      <Image 
        source={require('@/assets/Sprites/Sand/sand_07.png')}
        style={[styles.plotContainer, { left: screenWidth * 0.3, top: screenHeight * 0.62 }]}
        resizeMode="cover"
      />
      <Image 
        source={require('@/assets/Sprites/Sand/sand_07.png')}
        style={[styles.plotContainer, { left: screenWidth * 0.6, top: screenHeight * 0.59 }]}
        resizeMode="cover"
      />
      <Image 
        source={require('@/assets/Sprites/Sand/sand_07.png')}
        style={[styles.plotContainer, { left: 60, top: screenHeight * 0.72 }]}
        resizeMode="cover"
      />
      <Image 
        source={require('@/assets/Sprites/Sand/sand_07.png')}
        style={[styles.plotContainer, { left: screenWidth * 0.4, top: screenHeight * 0.75 }]}
        resizeMode="cover"
      />
      <Image 
        source={require('@/assets/Sprites/Sand/sand_07.png')}
        style={[styles.plotContainer, { left: screenWidth * 0.75, top: screenHeight * 0.7 }]}
        resizeMode="cover"
      />

      {/* Flowers on the plots - only show when no tool is selected */}
      {showFlowers && (
        <View style={styles.flowerContainer}>
          {/* Plot 1 flowers */}
          <View style={[styles.flower, styles.pinkFlower, { left: 60, top: screenHeight * 0.6 }]} />
          <View style={[styles.flowerCenter, { left: 65, top: screenHeight * 0.605 }]} />
          <View style={[styles.flower, styles.pinkFlower, { left: 75, top: screenHeight * 0.61 }]} />
          
          {/* Plot 2 flowers */}
          <View style={[styles.flower, styles.orangeFlower, { left: screenWidth * 0.32, top: screenHeight * 0.64 }]} />
          <View style={[styles.flowerCenter, { left: screenWidth * 0.325, top: screenHeight * 0.645 }]} />
          <View style={[styles.flower, styles.orangeFlower, { left: screenWidth * 0.34, top: screenHeight * 0.65 }]} />
          
          {/* Plot 3 flowers */}
          <View style={[styles.flower, styles.purpleFlower, { left: screenWidth * 0.62, top: screenHeight * 0.61 }]} />
          <View style={[styles.flowerCenter, { left: screenWidth * 0.625, top: screenHeight * 0.615 }]} />
          <View style={[styles.flower, styles.purpleFlower, { left: screenWidth * 0.64, top: screenHeight * 0.62 }]} />
          
          {/* Plot 4 flowers */}
          <View style={[styles.flower, styles.yellowFlower, { left: 80, top: screenHeight * 0.74 }]} />
          <View style={[styles.flowerCenter, { left: 85, top: screenHeight * 0.745 }]} />
          <View style={[styles.flower, styles.yellowFlower, { left: 95, top: screenHeight * 0.75 }]} />
          
          {/* Plot 5 flowers */}
          <View style={[styles.flower, styles.redFlower, { left: screenWidth * 0.42, top: screenHeight * 0.77 }]} />
          <View style={[styles.flowerCenter, { left: screenWidth * 0.425, top: screenHeight * 0.775 }]} />
          <View style={[styles.flower, styles.redFlower, { left: screenWidth * 0.44, top: screenHeight * 0.78 }]} />
          
          {/* Plot 6 flowers */}
          <View style={[styles.flower, styles.blueFlower, { left: screenWidth * 0.77, top: screenHeight * 0.72 }]} />
          <View style={[styles.flowerCenter, { left: screenWidth * 0.775, top: screenHeight * 0.725 }]} />
          <View style={[styles.flower, styles.blueFlower, { left: screenWidth * 0.79, top: screenHeight * 0.73 }]} />
        </View>
      )}
    </>
  );
}