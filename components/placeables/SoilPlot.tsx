import { SoilPlotProps } from '@/types/SoilPlot';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CropSprite } from '../sprites/CropSprite';

export function SoilPlot({ plot, onClick, selectedTool }: SoilPlotProps) {
  console.log('🟣 SoilPlot rendering, has onClick:', !!onClick);

  const getColors = () => {
    if (plot.watered) return ['#3f1f0a', '#2d1508', '#1a0d05'] as const;
    if (plot.tilled) return ['#b45309', '#92400e', '#78350f'] as const;
    return ['#a16207', '#94200e', '#78350f'] as const;
  };

  const getBorder = () => {
    if (plot.watered) return '#0c0a09';
    return '#451a03';
  };

  return (
    <Pressable 
      onPress={() => {
        console.log('🔴 PRESSABLE FIRED');
        onClick();
      }}
      style={({ pressed }) => {
        console.log('🟣 Pressable style called, pressed:', pressed);
        return [styles.container, pressed && styles.pressed];
      }}
    >
      {({ pressed }) => (
        <>
          <Text style={{ position: 'absolute', top: 0, left: 0, zIndex: 9999, color: 'white', backgroundColor: 'red' }}>
            CLICK ME
          </Text>
          <LinearGradient
            colors={getColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.plot, { borderColor: getBorder() }]}
          >
            {plot.tilled && (
              <View style={styles.tilledLines} pointerEvents="none">
                {[...Array(5)].map((_, i) => (
                  <View key={i} style={styles.line} />
                ))}
              </View>
            )}

            {plot.crop && plot.growthStage > 0 && (
              <View pointerEvents="none">
                <CropSprite crop={plot.crop} growthStage={plot.growthStage} />
              </View>
            )}

            {selectedTool && (
              <View style={styles.hint} pointerEvents="none">
                <Text style={styles.hintText}>
                  {selectedTool === 'till' && !plot.tilled && !plot.crop && '⛏️'}
                  {selectedTool === 'plant' && plot.tilled && !plot.crop && '🌱'}
                  {selectedTool === 'water' && plot.crop && plot.needsWater && '💧'}
                </Text>
              </View>
            )}

            {plot.crop && (
              <View style={styles.stageIndicator} pointerEvents="none">
                <Text style={styles.stageText}>Stage {plot.growthStage}/4</Text>
              </View>
            )}

            {plot.growthStage === 4 && (
              <View style={styles.harvestReady} pointerEvents="none">
                <Text style={styles.harvestText}>✨ Ready!</Text>
              </View>
            )}
          </LinearGradient>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  plot: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tilledLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 8,
  },
  line: {
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 1,
  },
  hint: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 4,
  },
  hintText: {
    fontSize: 20,
  },
  stageIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stageText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  harvestReady: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  harvestText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fde047',
  },
});
