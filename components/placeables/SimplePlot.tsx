import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCropConfig } from '../../lib/cropConfig';

const getPlotWidth = () => {
  // Fixed width for consistent 2x3 grid layout
  // Smaller size to ensure 2 columns fit side by side
  return 145;
};

type PlotData = {
  state: 'empty' | 'tilled' | 'planted' | 'growing';
  growthStage: number;
  cropType: string | null;
  needsWater: boolean;
  plantedAt?: number;
  lastWateredAt?: number;
};

type Tool = 'till' | 'plant' | 'water' | 'shovel' | 'harvest' | null;

type PlotProps = {
  index: number;
  plot: PlotData;
  selectedTool?: Tool;
  onPress: () => void;
};

export function SimplePlot({ index, plot, selectedTool, onPress }: PlotProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [plotWidth, setPlotWidth] = useState(getPlotWidth());

  // Update plot width on dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setPlotWidth(getPlotWidth());
    });
    
    return () => subscription?.remove();
  }, []);

  // Calculate time remaining until next stage
  useEffect(() => {
    if (plot.state !== 'planted' && plot.state !== 'growing') {
      setTimeRemaining(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const lastAction = plot.lastWateredAt || plot.plantedAt || now;
      const elapsed = now - lastAction;
      const remaining = Math.max(0, 10000 - elapsed); // 10 seconds per stage
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);
    return () => clearInterval(interval);
  }, [plot.state, plot.plantedAt, plot.lastWateredAt]);

  const formatTime = (ms: number): string => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  const getCropImageSource = (cropType: string | null, stage: number) => {
    if (!cropType) return null;
    
    const config = getCropConfig(cropType);
    if (!config) return null;
    
    // Stage is 1-5, but growthImages array is 0-indexed with 4 items
    // Stage 5 (fully grown) uses the same image as stage 4
    const imageIndex = Math.min(stage - 1, 3);
    const imagePath = config.growthImages[imageIndex];
    
    // Convert the path to a require statement
    // For now, we'll use a mapping since we know the crops
    const imageMap: Record<string, any[]> = {
      wheat: [
        require('../../assets/Sprites/Crops/Wheat/1 - Wheat Seed.png'),
        require('../../assets/Sprites/Crops/Wheat/2 - Wheat Sprout.png'),
        require('../../assets/Sprites/Crops/Wheat/3 - Wheat Mid.png'),
        require('../../assets/Sprites/Crops/Wheat/4 - Wheat Full.png'),
      ],
      // Placeholder requires for other crops - replace with actual images when available
      tomato: [
        require('../../assets/Sprites/Crops/Wheat/1 - Wheat Seed.png'), // Placeholder
        require('../../assets/Sprites/Crops/Wheat/2 - Wheat Sprout.png'),
        require('../../assets/Sprites/Crops/Wheat/3 - Wheat Mid.png'),
        require('../../assets/Sprites/Crops/Wheat/4 - Wheat Full.png'),
      ],
      carrot: [
        require('../../assets/Sprites/Crops/Wheat/1 - Wheat Seed.png'), // Placeholder
        require('../../assets/Sprites/Crops/Wheat/2 - Wheat Sprout.png'),
        require('../../assets/Sprites/Crops/Wheat/3 - Wheat Mid.png'),
        require('../../assets/Sprites/Crops/Wheat/4 - Wheat Full.png'),
      ],
      corn: [
        require('../../assets/Sprites/Crops/Wheat/1 - Wheat Seed.png'), // Placeholder
        require('../../assets/Sprites/Crops/Wheat/2 - Wheat Sprout.png'),
        require('../../assets/Sprites/Crops/Wheat/3 - Wheat Mid.png'),
        require('../../assets/Sprites/Crops/Wheat/4 - Wheat Full.png'),
      ],
    };
    
    return imageMap[cropType]?.[imageIndex] || null;
  };

  const getPlotStyle = () => {
    if (plot.state === 'empty') {
      return {
        backgroundColor: '#a16207',
        borderColor: '#451a03',
      };
    }
    if (plot.growthStage === 5) {
      return {
        backgroundColor: '#92400e',
        borderColor: '#0c0a09',
        shadowColor: '#3b82f6',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
      };
    }
    return {
      backgroundColor: '#92400e',
      borderColor: '#451a03',
    };
  };

  const showToolHint = selectedTool && !['planted', 'growing'].includes(plot.state);
  const getToolHint = () => {
    if (selectedTool === 'till' && plot.state === 'empty') return '⛏️ TILL';
    if (selectedTool === 'plant' && plot.state === 'tilled') return '🌱 PLANT';
    if (selectedTool === 'water' && (plot.state === 'planted' || plot.state === 'growing')) {
      if (plot.needsWater) return '💧 WATER';
    }
    if (selectedTool === 'harvest' && plot.growthStage === 5) return '🌾 HARVEST';
    if (selectedTool === 'harvest' && plot.state !== 'empty') return '🪓 CLEAR';
    return '';
  };

  const plotStyle = getPlotStyle();

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.plot, plotStyle, { width: plotWidth, height: plotWidth }]}
      activeOpacity={0.7}
    >
      {/* Tilled lines */}
      {plot.state !== 'empty' && (
        <View style={styles.tilledLines}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={styles.tilledLine} />
          ))}
        </View>
      )}

      {/* Plant sprite - show based on growth stage */}
      {(plot.state === 'planted' || plot.state === 'growing') && plot.growthStage > 0 && (
        <View style={styles.grownPlant}>
          {getCropImageSource(plot.cropType, plot.growthStage) ? (
            <Image 
              source={getCropImageSource(plot.cropType, plot.growthStage)} 
              style={plot.growthStage === 5 ? styles.plantImageLarge : styles.plantImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={plot.growthStage === 5 ? styles.plantEmojiLarge : styles.plantEmoji}>
              🌱
            </Text>
          )}
          {plot.growthStage === 5 && (
            <Text style={styles.harvestable}>✨</Text>
          )}
          {/* Growth stage indicator */}
          <Text style={styles.stageIndicator}>Stage {plot.growthStage}</Text>
          
          {/* Countdown timer */}
          {plot.growthStage < 5 && timeRemaining > 0 && (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            </View>
          )}
          
          {/* Ready for water indicator */}
          {plot.growthStage < 5 && timeRemaining === 0 && plot.needsWater && (
            <View style={styles.readyIndicator}>
              <Text style={styles.readyText}>💧 Ready</Text>
            </View>
          )}
        </View>
      )}

      {/* Tool hint overlay */}
      {showToolHint && getToolHint() && (
        <View style={styles.toolHintOverlay}>
          <Text style={styles.toolHintText}>{getToolHint()}</Text>
        </View>
      )}

      {/* Water needs indicator */}
      {plot.needsWater && selectedTool === 'water' && (
        <View style={styles.waterIndicator}>
          <Text style={styles.waterIcon}>💧</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  plot: {
    // width and height will be set dynamically
    borderRadius: 16,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  tilledLines: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    justifyContent: 'space-around',
  },
  tilledLine: {
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 1.5,
  },
  plantEmoji: {
    fontSize: 48,
    textAlign: 'center',
  },
  plantImage: {
    width: 80,
    height: 80,
  },
  plantImageLarge: {
    width: 100,
    height: 100,
  },
  grownPlant: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantEmojiLarge: {
    fontSize: 64,
    textAlign: 'center',
  },
  harvestable: {
    position: 'absolute',
    top: -10,
    left: -10,
    fontSize: 28,
  },
  toolHintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  toolHintText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  waterIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  waterIcon: {
    fontSize: 24,
  },
  stageIndicator: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timerContainer: {
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  readyIndicator: {
    marginTop: 4,
    backgroundColor: 'rgba(59,130,246,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  readyText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});
