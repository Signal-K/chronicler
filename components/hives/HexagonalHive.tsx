import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Polygon, Stop } from 'react-native-svg';
import type { BeeHealth, HiveData } from '../../types/hive';

interface HexagonalHiveProps {
  hive: HiveData | null;
  size?: number;
  onPress: () => void;
}

export function HexagonalHive({ hive, size = 80, onPress }: HexagonalHiveProps) {
  // Calculate hexagon points for SVG polygon (pointy-top orientation)
  const getHexagonPoints = (s: number): string => {
    const points: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i; // Pointy-top: starts at 0
      const x = s + s * Math.cos(angle);
      const y = s + s * Math.sin(angle);
      points.push([x, y]);
    }
    return points.map(p => p.join(',')).join(' ');
  };

  const getHealthColor = (health: BeeHealth): string => {
    switch (health) {
      case 'excellent': return '#22c55e';
      case 'good': return '#4ade80';
      case 'fair': return '#facc15';
      case 'poor': return '#fb923c';
      case 'critical': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  const hexSize = size;
  const viewBoxSize = size * 2;
  const centerX = size;
  const centerY = size;

  // Empty slot
  if (!hive) {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.container, { width: viewBoxSize, height: viewBoxSize }]}>
        <Svg width={viewBoxSize} height={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
          <Polygon
            points={getHexagonPoints(hexSize)}
            fill="#f9fafb"
            stroke="#d1d5db"
            strokeWidth="3"
            strokeDasharray="10,5"
            opacity="0.5"
          />
        </Svg>
        <Text style={styles.emptyPlus}>+</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { width: viewBoxSize, height: viewBoxSize }]}>
      <Svg width={viewBoxSize} height={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        <Defs>
          {/* Wood texture gradient */}
          <LinearGradient id={`woodGradient-${hive.id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#d97706" stopOpacity="1" />
            <Stop offset="0.2" stopColor="#c2610c" stopOpacity="1" />
            <Stop offset="0.5" stopColor="#b45309" stopOpacity="1" />
            <Stop offset="0.8" stopColor="#92400e" stopOpacity="1" />
            <Stop offset="1" stopColor="#78350f" stopOpacity="1" />
          </LinearGradient>

          {/* Darker wood grain */}
          <LinearGradient id={`darkWood-${hive.id}`} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#78350f" stopOpacity="0.3" />
            <Stop offset="0.5" stopColor="#92400e" stopOpacity="0.6" />
            <Stop offset="1" stopColor="#78350f" stopOpacity="0.3" />
          </LinearGradient>

          {/* Honey glow */}
          <LinearGradient id={`honeyGlow-${hive.id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#fbbf24" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#f59e0b" stopOpacity="0.5" />
          </LinearGradient>

          {/* Pollen shimmer */}
          <LinearGradient id={`pollenShimmer-${hive.id}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#fef3c7" stopOpacity="0.4" />
            <Stop offset="0.5" stopColor="#fde68a" stopOpacity="0.7" />
            <Stop offset="1" stopColor="#fef3c7" stopOpacity="0.4" />
          </LinearGradient>
        </Defs>

        {/* Shadow layer */}
        <Polygon
          points={getHexagonPoints(hexSize + 3)}
          fill="#000000"
          opacity="0.15"
        />

        {/* Main hive body */}
        <Polygon
          points={getHexagonPoints(hexSize)}
          fill={`url(#woodGradient-${hive.id})`}
          stroke="#451a03"
          strokeWidth="3"
        />

        {/* Wood grain texture (vertical streaks) */}
        <Path
          d={`M ${centerX - hexSize * 0.5} ${centerY - hexSize * 0.7} 
              L ${centerX - hexSize * 0.5} ${centerY + hexSize * 0.7}`}
          stroke="#92400e"
          strokeWidth="2"
          opacity="0.4"
        />
        <Path
          d={`M ${centerX - hexSize * 0.2} ${centerY - hexSize * 0.8} 
              L ${centerX - hexSize * 0.2} ${centerY + hexSize * 0.8}`}
          stroke="#78350f"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <Path
          d={`M ${centerX + hexSize * 0.1} ${centerY - hexSize * 0.75} 
              L ${centerX + hexSize * 0.1} ${centerY + hexSize * 0.75}`}
          stroke="#92400e"
          strokeWidth="2"
          opacity="0.4"
        />
        <Path
          d={`M ${centerX + hexSize * 0.4} ${centerY - hexSize * 0.7} 
              L ${centerX + hexSize * 0.4} ${centerY + hexSize * 0.7}`}
          stroke="#78350f"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Horizontal planks */}
        <Path
          d={`M ${centerX - hexSize * 0.7} ${centerY - hexSize * 0.5} 
              L ${centerX + hexSize * 0.7} ${centerY - hexSize * 0.5}`}
          stroke="#78350f"
          strokeWidth="2.5"
          opacity="0.5"
        />
        <Path
          d={`M ${centerX - hexSize * 0.75} ${centerY - hexSize * 0.2} 
              L ${centerX + hexSize * 0.75} ${centerY - hexSize * 0.2}`}
          stroke="#92400e"
          strokeWidth="2"
          opacity="0.4"
        />
        <Path
          d={`M ${centerX - hexSize * 0.7} ${centerY + hexSize * 0.1} 
              L ${centerX + hexSize * 0.7} ${centerY + hexSize * 0.1}`}
          stroke="#78350f"
          strokeWidth="2.5"
          opacity="0.5"
        />
        <Path
          d={`M ${centerX - hexSize * 0.75} ${centerY + hexSize * 0.4} 
              L ${centerX + hexSize * 0.75} ${centerY + hexSize * 0.4}`}
          stroke="#92400e"
          strokeWidth="2"
          opacity="0.4"
        />

        {/* Wood knots (circular details) */}
        <Circle
          cx={centerX - hexSize * 0.3}
          cy={centerY - hexSize * 0.35}
          r={hexSize * 0.08}
          fill="#78350f"
          opacity="0.6"
        />
        <Circle
          cx={centerX + hexSize * 0.25}
          cy={centerY + hexSize * 0.25}
          r={hexSize * 0.06}
          fill="#92400e"
          opacity="0.5"
        />

        {/* Entrance hole (larger, more prominent) */}
        <Ellipse
          cx={centerX}
          cy={centerY + hexSize * 0.55}
          rx={hexSize * 0.3}
          ry={hexSize * 0.18}
          fill="#1a1a1a"
          stroke="#0a0a0a"
          strokeWidth="2"
        />

        {/* Honeycomb pattern inside entrance */}
        <Ellipse
          cx={centerX}
          cy={centerY + hexSize * 0.55}
          rx={hexSize * 0.22}
          ry={hexSize * 0.12}
          fill={`url(#honeyGlow-${hive.id})`}
          opacity="0.4"
        />

        {/* Pollen dust overlay (when pollen > 50%) */}
        {(hive.resources?.pollen || 0) > 50 && (
          <Polygon
            points={getHexagonPoints(hexSize)}
            fill={`url(#pollenShimmer-${hive.id})`}
            opacity={Math.min(((hive.resources?.pollen || 0) - 50) / 50, 1) * 0.5}
          />
        )}

        {/* Honey drip effects removed */}

        {/* Health indicator - subtle inner glow only */}
        <Polygon
          points={getHexagonPoints(hexSize - 8)}
          fill="none"
          stroke={getHealthColor(hive.health || 'good')}
          strokeWidth="2"
          opacity="0.4"
        />
      </Svg>

      {/* Minimal info overlay */}
      <View style={styles.infoOverlay}>
        {/* Queen indicator */}
        {hive.population?.queen && (
          <View style={styles.queenBadge}>
            <Text style={styles.queenIcon}>👑</Text>
          </View>
        )}

        {/* Status warnings only */}
        {hive.status === 'swarming' && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningIcon}>⚠️</Text>
          </View>
        )}

        {hive.health === 'critical' && (
          <View style={[styles.warningBadge, { backgroundColor: 'rgba(239, 68, 68, 0.95)', left: 4, top: 4 }]}>
            <Text style={styles.warningIcon}>🆘</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPlus: {
    position: 'absolute',
    top: '38%',
    fontSize: 60,
    color: '#d1d5db',
    fontWeight: '200',
  },
  infoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  queenBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.95)',
    borderRadius: 14,
    padding: 4,
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  queenIcon: {
    fontSize: 16,
  },
  warningBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(251, 146, 60, 0.95)',
    borderRadius: 14,
    padding: 4,
    borderWidth: 2,
    borderColor: '#ea580c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  warningIcon: {
    fontSize: 16,
  },
});
