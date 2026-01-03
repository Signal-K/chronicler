import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const getPlotWidth = () => {
  // Fixed width for consistent 2x3 grid layout
  // Smaller size to ensure 2 columns fit side by side
  return 145;

};

import type { PlotData, Tool } from '../../hooks/useGameState';
import { getCropConfig } from '../../lib/cropConfig';

type PlotProps = {
  index: number;
  plot: PlotData;
  selectedTool?: Tool;
  onPress: () => void;
  displayNumber?: number;
  seedIndex?: number;
};

export function SimplePlot({ index, plot, selectedTool, onPress, displayNumber, seedIndex }: PlotProps) {
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
    // Prefer images defined on the crop config (supports 5 stages)
    const config = getCropConfig(cropType);
    if (config && config.growthImages && config.growthImages.length > 0) {
      const idx = Math.min(Math.max(stage - 1, 0), config.growthImages.length - 1);
      const src = config.growthImages[idx];
      return src;
    }

    // Fallback to wheat placeholder assets if crop config missing images
    const imageIndex = Math.min(Math.max(stage - 1, 0), 3);
    const wheatImages = [
      require('../../assets/Sprites/Crops/Wheat/1---Wheat-Seed.png'),
      require('../../assets/Sprites/Crops/Wheat/2---Wheat-Sprout.png'),
      require('../../assets/Sprites/Crops/Wheat/3---Wheat-Mid.png'),
      require('../../assets/Sprites/Crops/Wheat/4---Wheat-Full.png'),
    ];
    const src = wheatImages[imageIndex] || null;
    return src;
  };

  // Deterministic per-plot variation so each plot appears unique but stable
  const seededRandom = (seed: number) => {
    // simple deterministic pseudo-random using sin
    return Math.abs(Math.sin(seed) * 10000) % 1;
  };

  const getPlotOffsets = () => {
    const base = typeof seedIndex === 'number' ? seedIndex : index;
    const seedBase = base + (plot.plantedAt || 0) / 1000;
    const rx = (seededRandom(seedBase * 7) - 0.5) * 24; // -12..12 px
    const ry = (seededRandom(seedBase * 13) - 0.5) * 14; // -7..7 px
    const rot = (seededRandom(seedBase * 17) - 0.5) * 10; // -5..5 deg
    return { translateX: Math.round(rx), translateY: Math.round(ry), rotate: Math.round(rot * 10) / 10 };
  };

  const offsets = getPlotOffsets();

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
      {/* Plot number badge */}
      {typeof displayNumber === 'number' && (
        <View style={styles.plotNumberBadge}>
          <Text style={styles.plotNumberText}>{displayNumber}</Text>
        </View>
      )}
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
          <View style={{ transform: [{ translateX: offsets.translateX }, { translateY: offsets.translateY }, { rotate: `${offsets.rotate}deg` }] }}>
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
          </View>
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
  plotNumberBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 10,
  },
  plotNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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
