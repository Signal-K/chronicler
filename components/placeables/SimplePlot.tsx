import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const getPlotWidth = () => {
  const screenWidth = Dimensions.get('window').width;
  // Calculate width for 2 columns with padding and gaps
  // Much larger plots to fill vertical space
  return Math.min((screenWidth - 80) / 2, 160);
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

  const getCropEmoji = (cropType: string | null, stage: number) => {
    if (!cropType) return '🌱';
    
    const emojis: Record<string, string[]> = {
      tomato: ['🌱', '🌿', '🪴', '🍅', '🍅'],
      carrot: ['🌱', '🌿', '🪴', '🥕', '🥕'],
      wheat: ['🌱', '🌿', '🪴', '🌾', '🌾'],
      corn: ['🌱', '🌿', '🪴', '🌽', '🌽'],
    };
    
    return emojis[cropType]?.[Math.min(stage - 1, 4)] || '🌱';
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
          <Text style={plot.growthStage === 5 ? styles.plantEmojiLarge : styles.plantEmoji}>
            {getCropEmoji(plot.cropType, plot.growthStage)}
          </Text>
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
