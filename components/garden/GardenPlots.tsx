import type { GardenPlotsProps } from '../../types/garden';
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { gardenPlotsStyles as styles } from "../../styles/garden/GardenPlotsStyles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function GardenPlots({
  showFlowers,
  selectedTool,
  plotStates,
  onPlotPress,
}: GardenPlotsProps) {
const plotPositions = [
  { left: screenWidth * 0.2, top: screenHeight * 0.6 },
  { left: screenWidth * 0.4, top: screenHeight * 0.6 },
  { left: screenWidth * 0.6, top: screenHeight * 0.6 },
  { left: screenWidth * 0.2, top: screenHeight * 0.7 },
  { left: screenWidth * 0.4, top: screenHeight * 0.7 },
  { left: screenWidth * 0.6, top: screenHeight * 0.7 },
];

  const isWateringMode = selectedTool === "watering-can";

  // Plant sprite mapping based on growth stage
  const getPlantSprite = (growthStage: number = 0) => {
    switch (growthStage) {
      case 0:
        return require("@/assets/Sprites/Growing Plants/tile000.png");
      case 1:
        return require("@/assets/Sprites/Growing Plants/tile001.png");
      case 2:
        return require("@/assets/Sprites/Growing Plants/tile009.png");
      default:
        return require("@/assets/Sprites/Growing Plants/tile000.png");
    }
  };

  // Debug: log tilled states
  React.useEffect(() => {
    const tilledPlots = Object.entries(plotStates)
      .filter(([_, state]) => state.tilled)
      .map(([id]) => id);
    if (tilledPlots.length > 0) {
      console.log('🔨 Tilled plots:', tilledPlots);
    }
  }, [plotStates]);

  return (
    <>
      {/* Render each plot */}
      {plotPositions.map((position, index) => (
        <View key={`plot-${index}`}>
          {/* Highlight border when watering can is selected */}
          {isWateringMode && (
            <View
              style={[
                styles.plotHighlight,
                {
                  left: position.left - 2,
                  top: position.top - 2,
                },
              ]}
            />
          )}

          {/* Arrow pointing to plot when watering can is selected */}
          {isWateringMode && (
            <Text
              style={[
                styles.plotArrow,
                {
                  left: position.left + 40,
                  top: position.top - 35,
                },
              ]}
            >
              ↓
            </Text>
          )}

          {/* Base plot sprite */}
          <View
            style={{
              position: 'absolute',
              left: position.left,
              top: position.top,
              width: 120,
              height: 90,
              borderRadius: 30,
              backgroundColor: '#D4C4B0',
              overflow: 'hidden',
            }}
          >
            <Image
              source={require("@/assets/Sprites/Sand/sand_07.png")}
              style={{ width: 120, height: 90 }}
              resizeMode="stretch"
            />
          </View>

          {/* Watered overlay - positioned identically */}
          {plotStates[index]?.watered && (
            <View 
              style={{
                position: 'absolute',
                left: position.left,
                top: position.top,
                width: 120,
                height: 90,
                borderRadius: 30,
                backgroundColor: 'rgba(0, 100, 200, 0.4)',
                zIndex: 8,
                overflow: 'hidden',
              }} 
            />
          )}

          {/* Tilled overlay - positioned identically */}
          {plotStates[index]?.tilled && (
            <View 
              style={{
                position: 'absolute',
                left: position.left,
                top: position.top,
                width: 120,
                height: 90,
                borderRadius: 30,
                backgroundColor: 'rgba(92, 51, 23, 0.6)',
                zIndex: 9,
                overflow: 'hidden',
              }} 
              pointerEvents="none"
            >
              {/* Diagonal lines at 45deg */}
              {Array.from({ length: 12 }).map((_, i) => (
                <View
                  key={`h1-${i}`}
                  style={[
                    styles.tilledHatchLine,
                    {
                      left: i * 10 - 50,
                      transform: [{ rotate: '45deg' }],
                    },
                  ]}
                />
              ))}

              {/* Diagonal lines at -45deg */}
              {Array.from({ length: 12 }).map((_, i) => (
                <View
                  key={`h2-${i}`}
                  style={[
                    styles.tilledHatchLine,
                    {
                      left: i * 10 - 50,
                      transform: [{ rotate: '-45deg' }],
                      backgroundColor: 'rgba(0,0,0,0.6)',
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Planted grass overlay */}
          {plotStates[index]?.planted && (
            <View
              style={{
                position: 'absolute',
                left: position.left - 30,
                top: position.top - 22.5,
                width: 180,
                height: 135,
                zIndex: 10001,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              pointerEvents="none"
            >
              <Image
                source={getPlantSprite(plotStates[index]?.growthStage || 0)}
                style={{
                  width: 180,
                  height: 135,
                  opacity: 1.0,
                }}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      ))}

      {/* Flowers on the plots - only show when no tool is selected */}
      {showFlowers && (
        <View style={styles.flowerContainer}>
          {/* Plot 1 flowers */}
          <View
            style={[
              styles.flower,
              styles.pinkFlower,
              { left: 60, top: screenHeight * 0.6 },
            ]}
          />
          <View
            style={[
              styles.flowerCenter,
              { left: 65, top: screenHeight * 0.605 },
            ]}
          />
          <View
            style={[
              styles.flower,
              styles.pinkFlower,
              { left: 75, top: screenHeight * 0.61 },
            ]}
          />

          {/* Plot 2 flowers */}
          <View
            style={[
              styles.flower,
              styles.orangeFlower,
              { left: screenWidth * 0.32, top: screenHeight * 0.64 },
            ]}
          />
          <View
            style={[
              styles.flowerCenter,
              { left: screenWidth * 0.325, top: screenHeight * 0.645 },
            ]}
          />
          <View
            style={[
              styles.flower,
              styles.orangeFlower,
              { left: screenWidth * 0.34, top: screenHeight * 0.65 },
            ]}
          />

          {/* Plot 3 flowers */}
          <View
            style={[
              styles.flower,
              styles.purpleFlower,
              { left: screenWidth * 0.62, top: screenHeight * 0.61 },
            ]}
          />
          <View
            style={[
              styles.flowerCenter,
              { left: screenWidth * 0.625, top: screenHeight * 0.615 },
            ]}
          />
          <View
            style={[
              styles.flower,
              styles.purpleFlower,
              { left: screenWidth * 0.64, top: screenHeight * 0.62 },
            ]}
          />

          {/* Plot 4 flowers */}
          <View
            style={[
              styles.flower,
              styles.yellowFlower,
              { left: 80, top: screenHeight * 0.74 },
            ]}
          />
          <View
            style={[
              styles.flowerCenter,
              { left: 85, top: screenHeight * 0.745 },
            ]}
          />
          <View
            style={[
              styles.flower,
              styles.yellowFlower,
              { left: 95, top: screenHeight * 0.75 },
            ]}
          />

          {/* Plot 5 flowers */}
          <View
            style={[
              styles.flower,
              styles.redFlower,
              { left: screenWidth * 0.42, top: screenHeight * 0.77 },
            ]}
          />
          <View
            style={[
              styles.flowerCenter,
              { left: screenWidth * 0.425, top: screenHeight * 0.775 },
            ]}
          />
          <View
            style={[
              styles.flower,
              styles.redFlower,
              { left: screenWidth * 0.44, top: screenHeight * 0.78 },
            ]}
          />

          {/* Plot 6 flowers */}
          <View
            style={[
              styles.flower,
              styles.blueFlower,
              { left: screenWidth * 0.77, top: screenHeight * 0.72 },
            ]}
          />
          <View
            style={[
              styles.flowerCenter,
              { left: screenWidth * 0.775, top: screenHeight * 0.725 },
            ]}
          />
          <View
            style={[
              styles.flower,
              styles.blueFlower,
              { left: screenWidth * 0.79, top: screenHeight * 0.73 },
            ]}
          />
        </View>
      )}
    </>
  );
}
