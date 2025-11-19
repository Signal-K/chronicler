import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';
import { SoilPlot } from '../../components/placeables/SoilPlot';
import type { GardenGridProps } from '../../types/SoilPlot';

const { width: screenWidth } = Dimensions.get('window');

export function GardenGrid({ plots, onPlotClick, selectedTool }: GardenGridProps) {
  return (
    <View style={styles.container}>
      {/* Grass background with gradient */}
      <LinearGradient
        colors={['#86efac', '#4ade80', '#22c55e']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Grass texture overlay */}
      <View style={styles.textureOverlay}>
        <Svg width="100%" height="100%" style={styles.grassTexture}>
          <Defs>
            <Pattern id="grass" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <Path d="M10,40 Q10,30 8,20 T10,0" stroke="#14532d" strokeWidth="1" fill="none" />
              <Path d="M15,40 Q15,28 17,18 T15,0" stroke="#14532d" strokeWidth="1" fill="none" />
              <Path d="M25,40 Q25,32 23,22 T25,0" stroke="#14532d" strokeWidth="1" fill="none" />
              <Path d="M30,40 Q30,29 32,19 T30,0" stroke="#14532d" strokeWidth="1" fill="none" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grass)" opacity="0.15" />
        </Svg>
      </View>

      {/* Main content with fence frame */}
      <View style={styles.contentContainer}>
        {/* Wooden Fence Frame */}
        <View style={styles.fenceFrame} pointerEvents="none">
          {/* Top fence */}
          <LinearGradient
            colors={['#c2410c', '#9a3412']}
            style={styles.fenceTop}
          >
            {[...Array(6)].map((_, i) => (
              <LinearGradient
                key={i}
                colors={['#ea580c', '#c2410c']}
                style={styles.fencePostTop}
              />
            ))}
          </LinearGradient>

          {/* Bottom fence */}
          <LinearGradient
            colors={['#c2410c', '#9a3412']}
            style={styles.fenceBottom}
          >
            {[...Array(6)].map((_, i) => (
              <LinearGradient
                key={i}
                colors={['#ea580c', '#c2410c']}
                style={styles.fencePostBottom}
              />
            ))}
          </LinearGradient>

          {/* Left fence */}
          <LinearGradient
            colors={['#c2410c', '#9a3412']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fenceLeft}
          >
            {[...Array(3)].map((_, i) => (
              <LinearGradient
                key={i}
                colors={['#ea580c', '#c2410c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fencePostLeft}
              />
            ))}
          </LinearGradient>

          {/* Right fence */}
          <LinearGradient
            colors={['#c2410c', '#9a3412']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fenceRight}
          >
            {[...Array(3)].map((_, i) => (
              <LinearGradient
                key={i}
                colors={['#ea580c', '#c2410c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fencePostRight}
              />
            ))}
          </LinearGradient>
        </View>

        {/* Garden plots grid */}
        <View style={styles.plotsGrid}>
          {plots.map((plot, index) => (
            <View key={index} style={styles.plotWrapper}>
              <SoilPlot 
                plot={plot} 
                onClick={() => onPlotClick(index)} 
                selectedTool={selectedTool} 
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  textureOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  grassTexture: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  fenceFrame: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    bottom: '10%',
  },
  fenceTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    borderWidth: 2,
    borderColor: '#431407',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  fencePostTop: {
    width: 12,
    height: 32,
    borderWidth: 2,
    borderColor: '#431407',
    borderRadius: 16,
  },
  fenceBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    borderWidth: 2,
    borderColor: '#431407',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  fencePostBottom: {
    width: 12,
    height: 32,
    borderWidth: 2,
    borderColor: '#431407',
    borderRadius: 16,
  },
  fenceLeft: {
    position: 'absolute',
    top: 24,
    bottom: 24,
    left: 0,
    width: 24,
    borderWidth: 2,
    borderColor: '#431407',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  fencePostLeft: {
    width: 32,
    height: 12,
    borderWidth: 2,
    borderColor: '#431407',
    borderRadius: 16,
  },
  fenceRight: {
    position: 'absolute',
    top: 24,
    bottom: 24,
    right: 0,
    width: 24,
    borderWidth: 2,
    borderColor: '#431407',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  fencePostRight: {
    width: 32,
    height: 12,
    borderWidth: 2,
    borderColor: '#431407',
    borderRadius: 16,
  },
  plotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 600,
    gap: 12,
    padding: 20,
    zIndex: 10,
  },
  plotWrapper: {
    width: screenWidth > 600 ? '30%' : '45%',
    aspectRatio: 1,
    minWidth: 100,
    maxWidth: 180,
  },
});