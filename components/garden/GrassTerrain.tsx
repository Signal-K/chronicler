import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { grassTerrainStyles as styles } from '../../styles/garden/GrassTerrainStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GrassTerrain() {
  const renderGrassTiles = () => {
    const tiles = [];
    const tileSize = 90; // Increased tile size to match plot sizes
    const tilesPerRow = Math.ceil(screenWidth / tileSize) + 1;
    const tilesPerColumn = Math.ceil((screenHeight * 0.45) / tileSize) + 1;
    
    // Pre-define grass sprites to avoid dynamic require (using fewer variants for performance)
    const grassSprites = [
      require('@/assets/Sprites/Grass/grass_00.png'),
      require('@/assets/Sprites/Grass/grass_03.png'),
      require('@/assets/Sprites/Grass/grass_06.png'),
      require('@/assets/Sprites/Grass/grass_09.png'),
      require('@/assets/Sprites/Grass/grass_12.png'),
    ];
    
    // Create a grid of grass tiles with some variety
    for (let row = 0; row < tilesPerColumn; row++) {
      for (let col = 0; col < tilesPerRow; col++) {
        // Use different grass sprites for variety
        const grassVariant = (row + col) % grassSprites.length;
        
        tiles.push(
          <Image
            key={`grass-${row}-${col}`}
            source={grassSprites[grassVariant]}
            style={[
              styles.grassTile,
              {
                left: col * tileSize,
                top: row * tileSize,
                width: tileSize,
                height: tileSize,
              }
            ]}
            resizeMode="cover"
          />
        );
      }
    }
    
    return tiles;
  };

  return (
    <View style={styles.grassTerrain}>
      {renderGrassTiles()}
    </View>
  );
}