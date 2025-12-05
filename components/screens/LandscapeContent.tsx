import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Greenhouse Component
function Greenhouse({ size = 160, x = 0, y = 0, onPress }: { size?: number; x?: number; y?: number; onPress?: () => void }) {
  return (
    <TouchableOpacity 
      style={{ position: 'absolute', left: x, top: y, width: size, height: size }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={size * 0.1} y={size * 0.75} width={size * 0.8} height={size * 0.15} fill="#8B7355" stroke="#654321" strokeWidth="2" />
      <Rect x={size * 0.12} y={size * 0.25} width={size * 0.76} height={size * 0.5} fill="#90EE90" opacity="0.25" stroke="#228B22" strokeWidth="2.5" />
      <Polygon points={`${size * 0.12},${size * 0.25} ${size * 0.88},${size * 0.25} ${size * 0.5},${size * 0.05}`} fill="#90EE90" opacity="0.3" stroke="#228B22" strokeWidth="2.5" />
      <Line x1={size * 0.5} y1={size * 0.05} x2={size * 0.5} y2={size * 0.25} stroke="#228B22" strokeWidth="1.5" />
      
      {[0, 1, 2, 3, 4].map((col) =>
        [0, 1, 2].map((row) => (
          <React.Fragment key={`window-${col}-${row}`}>
            <Rect x={size * 0.18 + col * size * 0.14} y={size * 0.32 + row * size * 0.12} width={size * 0.11} height={size * 0.1} fill="#E0F7FF" opacity="0.6" stroke="#228B22" strokeWidth="1.2" />
            <Line x1={size * 0.235 + col * size * 0.14} y1={size * 0.32 + row * size * 0.12} x2={size * 0.235 + col * size * 0.14} y2={size * 0.42 + row * size * 0.12} stroke="#228B22" strokeWidth="0.8" opacity="0.5" />
            <Line x1={size * 0.18 + col * size * 0.14} y1={size * 0.37 + row * size * 0.12} x2={size * 0.29 + col * size * 0.14} y2={size * 0.37 + row * size * 0.12} stroke="#228B22" strokeWidth="0.8" opacity="0.5" />
          </React.Fragment>
        ))
      )}
      
      <Rect x={size * 0.35} y={size * 0.6} width={size * 0.3} height={size * 0.25} fill="#8B4513" stroke="#654321" strokeWidth="1.5" />
      <Circle cx={size * 0.6} cy={size * 0.72} r={size * 0.03} fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
      <Line x1={size * 0.5} y1={size * 0.6} x2={size * 0.5} y2={size * 0.85} stroke="#654321" strokeWidth="1" />
      
      {[0.28, 0.5, 0.72].map((xPos) => (
        <React.Fragment key={`plant-${xPos}`}>
          <Polygon points={`${size * xPos},${size * 0.62} ${size * (xPos - 0.05)},${size * 0.68} ${size * (xPos + 0.05)},${size * 0.68}`} fill="#8B6F47" stroke="#654321" strokeWidth="1" />
          <Line x1={size * xPos} y1={size * 0.62} x2={size * xPos} y2={size * 0.42} stroke="#228B22" strokeWidth="1.5" />
          <Ellipse cx={size * (xPos - 0.04)} cy={size * 0.5} rx={size * 0.04} ry={size * 0.08} fill="#32CD32" />
          <Ellipse cx={size * (xPos + 0.04)} cy={size * 0.48} rx={size * 0.04} ry={size * 0.08} fill="#32CD32" />
          <Circle cx={size * xPos} cy={size * 0.38} r={size * 0.05} fill="#228B22" />
        </React.Fragment>
      ))}
      
      <Rect x={size * 0.14} y={size * 0.27} width={size * 0.72} height={size * 0.04} fill="white" opacity="0.15" />
    </Svg>
    </TouchableOpacity>
  );
}

// Tree Component
function Tree({ size = 140, x = 0, y = 0 }: { size?: number; x?: number; y?: number }) {
  return (
    <View style={{ position: 'absolute', left: x, top: y, width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={size * 0.4} y={size * 0.5} width={size * 0.2} height={size * 0.45} fill="#8B4513" stroke="#654321" strokeWidth="1.5" />
      <Rect x={size * 0.4} y={size * 0.5} width={size * 0.08} height={size * 0.45} fill="#A0522D" opacity="0.7" />
      <Rect x={size * 0.52} y={size * 0.5} width={size * 0.08} height={size * 0.45} fill="#5C2E0A" opacity="0.5" />
      
      {[-0.08, 0.08].map((offset) => (
        <Path key={`root-${offset}`} d={`M ${size * (0.5 + offset)} ${size * 0.95} Q ${size * (0.48 + offset)} ${size * 1.0} ${size * (0.46 + offset)} ${size * 0.98}`} stroke="#654321" strokeWidth="1.5" fill="none" />
      ))}
      
      <Circle cx={size * 0.5} cy={size * 0.5} r={size * 0.26} fill="#1a6b1a" stroke="#0d3d0d" strokeWidth="1" opacity="0.9" />
      <Circle cx={size * 0.5} cy={size * 0.35} r={size * 0.24} fill="#228B22" stroke="#1a6b1a" strokeWidth="1" />
      <Circle cx={size * 0.32} cy={size * 0.4} r={size * 0.22} fill="#32CD32" stroke="#228B22" strokeWidth="1" />
      <Circle cx={size * 0.68} cy={size * 0.4} r={size * 0.22} fill="#32CD32" stroke="#228B22" strokeWidth="1" />
      <Circle cx={size * 0.5} cy={size * 0.25} r={size * 0.23} fill="#3CB371" stroke="#228B22" strokeWidth="1" />
      <Circle cx={size * 0.5} cy={size * 0.2} r={size * 0.15} fill="#7CFC00" opacity="0.4" />
      <Ellipse cx={size * 0.45} cy={size * 0.45} rx={size * 0.12} ry={size * 0.15} fill="#0d3d0d" opacity="0.3" />
    </Svg>
    </View>
  );
}

// Train Station Component
function TrainStation({ size = 180, x = 0, y = 0, onPress }: { size?: number; x?: number; y?: number; onPress?: () => void }) {
  return (
    <TouchableOpacity 
      style={{ position: 'absolute', left: x, top: y, width: size, height: size * 1.1 }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Svg width={size} height={size * 1.1} viewBox={`0 0 ${size} ${size * 1.1}`} pointerEvents="none">
      <Rect x="0" y={size * 0.65} width={size} height={size * 0.45} fill="#9B8B7E" stroke="#6B5B4F" strokeWidth="2" />
      <Line x1="0" y1={size * 0.65} x2={size} y2={size * 0.65} stroke="#6B5B4F" strokeWidth="1.5" />
      
      {[0, 0.25, 0.5, 0.75].map((offset) => (
        <Line key={`board-${offset}`} x1={size * offset} y1={size * 0.65} x2={size * offset} y2={size * 1.1} stroke="#6B5B4F" strokeWidth="1.5" opacity="0.4" />
      ))}
      
      <Rect x={size * 0.1} y={size * 0.2} width={size * 0.12} height={size * 0.45} fill="#8B6F47" stroke="#654321" strokeWidth="1.5" />
      <Rect x={size * 0.78} y={size * 0.2} width={size * 0.12} height={size * 0.45} fill="#8B6F47" stroke="#654321" strokeWidth="1.5" />
      <Polygon points={`${size * 0.08},${size * 0.2} ${size * 0.92},${size * 0.2} ${size * 0.9},${size * 0.05} ${size * 0.1},${size * 0.05}`} fill="#A0522D" stroke="#654321" strokeWidth="2" />
      
      {[0.1, 0.35, 0.6].map((offset) => (
        <Line key={`roof-beam-${offset}`} x1={size * 0.1} y1={size * (0.2 - offset * 0.08)} x2={size * 0.9} y2={size * (0.2 - offset * 0.08)} stroke="#8B6F47" strokeWidth="1" opacity="0.5" />
      ))}
      
      <Rect x={size * 0.08} y={size * 0.15} width={size * 0.08} height={size * 0.5} fill="#A0826D" opacity="0.4" stroke="#654321" strokeWidth="1" />
      <Rect x={size * 0.84} y={size * 0.15} width={size * 0.08} height={size * 0.5} fill="#A0826D" opacity="0.4" stroke="#654321" strokeWidth="1" />
      <Rect x={size * 0.25} y={size * 0.25} width={size * 0.5} height={size * 0.3} fill="none" stroke="#654321" strokeWidth="2" />
      <Line x1={size * 0.5} y1={size * 0.25} x2={size * 0.5} y2={size * 0.55} stroke="#654321" strokeWidth="1" />
      <Line x1={size * 0.25} y1={size * 0.4} x2={size * 0.75} y2={size * 0.4} stroke="#654321" strokeWidth="1" />
      
      {[0.25, 0.5, 0.75].map((offset) => (
        <Line key={`support-${offset}`} x1={size * offset} y1={size * 0.2} x2={size * offset} y2={size * 0.65} stroke="#8B6F47" strokeWidth="1.2" opacity="0.3" />
      ))}
      
      <Polygon points={`${size * 0.5},${size * 0.02} ${size * 0.55},${size * 0.08} ${size * 0.45},${size * 0.08}`} fill="#654321" opacity="0.6" />
    </Svg>
    </TouchableOpacity>
  );
}

// Grain Silo Component
function GrainSilo({ size = 110, opacity = 0.8, x = 0, y = 0, onPress }: { size?: number; opacity?: number; x?: number; y?: number; onPress?: () => void }) {
  return (
    <TouchableOpacity 
      style={{ position: 'absolute', left: x, top: y, width: size, height: size * 1.3, opacity }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Svg width={size} height={size * 1.3} viewBox={`0 0 ${size} ${size * 1.3}`} pointerEvents="none">
      <Polygon points={`${size * 0.5},${size * 0.08} ${size * 0.8},${size * 0.25} ${size * 0.2},${size * 0.25}`} fill="#A0826D" stroke="#8B6F47" strokeWidth="1.5" />
      <Ellipse cx={size * 0.5} cy={size * 0.25} rx={size * 0.38} ry={size * 0.12} fill="#D2B48C" stroke="#A0826D" strokeWidth="1.5" />
      <Rect x={size * 0.12} y={size * 0.25} width={size * 0.76} height={size * 0.7} fill="#C9A876" stroke="#A0826D" strokeWidth="1.5" />
      <Ellipse cx={size * 0.5} cy={size * 0.95} rx={size * 0.38} ry={size * 0.15} fill="#B89968" stroke="#8B6F47" strokeWidth="1.5" />
      <Line x1={size * 0.5} y1={size * 0.25} x2={size * 0.5} y2={size * 0.95} stroke="#8B6F47" strokeWidth="1.2" opacity="0.6" />
      
      {[0.35, 0.5, 0.65, 0.8].map((yOffset) => (
        <Ellipse key={`band-${yOffset}`} cx={size * 0.5} cy={size * yOffset} rx={size * 0.38} ry={size * 0.04} fill="none" stroke="#8B6F47" strokeWidth="1" opacity="0.4" />
      ))}
      
      <Rect x={size * 0.12} y={size * 0.3} width={size * 0.06} height={size * 0.6} fill="#8B6F47" opacity="0.2" />
      <Rect x={size * 0.82} y={size * 0.3} width={size * 0.06} height={size * 0.6} fill="#8B6F47" opacity="0.2" />
      <Polygon points={`${size * 0.42},${size * 0.95} ${size * 0.58},${size * 0.95} ${size * 0.5},${size * 1.15}`} fill="#8B6F47" stroke="#654321" strokeWidth="1" opacity="0.7" />
      <Ellipse cx={size * 0.25} cy={size * 0.5} rx={size * 0.1} ry={size * 0.3} fill="white" opacity="0.08" />
    </Svg>
    </TouchableOpacity>
  );
}

// Minecart Component positioned along track path
function MinecartWithTrack({ fromX, fromY, toX, toY, size = 40 }: { fromX: number; fromY: number; toX: number; toY: number; size?: number }) {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        let newPos = prev + direction * 0.8;
        if (newPos >= 100) {
          newPos = 100;
          setDirection(-1);
        } else if (newPos <= 0) {
          newPos = 0;
          setDirection(1);
        }
        return newPos;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [direction]);

  // Calculate position along the track
  const t = position / 100;
  const currentX = fromX + (toX - fromX) * t;
  const currentY = fromY + (toY - fromY) * t;

  return (
    <View
      style={{
        position: 'absolute',
        left: currentX - size / 2,
        top: currentY - size * 0.35,
        width: size,
        height: size * 0.7,
        transform: [{ scaleX: direction === -1 ? -1 : 1 }],
      }}
    >
      <Svg
        width={size}
        height={size * 0.7}
        viewBox={`0 0 ${size} ${size * 0.7}`}
      >
      <Rect x={size * 0.1} y={size * 0.15} width={size * 0.8} height={size * 0.4} fill="#CD5C5C" stroke="#8B3A3A" strokeWidth="1.5" rx="3" />
      <Rect x={size * 0.15} y={size * 0.2} width={size * 0.7} height={size * 0.25} fill="#E8A8A8" opacity="0.6" />
      <Circle cx={size * 0.25} cy={size * 0.62} r={size * 0.1} fill="#1a1a1a" stroke="#000" strokeWidth="1" />
      <Circle cx={size * 0.75} cy={size * 0.62} r={size * 0.1} fill="#1a1a1a" stroke="#000" strokeWidth="1" />
      <Circle cx={size * 0.25} cy={size * 0.62} r={size * 0.045} fill="none" stroke="#666" strokeWidth="0.8" />
      <Circle cx={size * 0.75} cy={size * 0.62} r={size * 0.045} fill="none" stroke="#666" strokeWidth="0.8" />
      
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <Line
            key={`spoke-${angle}`}
            x1={size * 0.25 + Math.cos(rad) * size * 0.04}
            y1={size * 0.62 + Math.sin(rad) * size * 0.04}
            x2={size * 0.25 + Math.cos(rad) * size * 0.08}
            y2={size * 0.62 + Math.sin(rad) * size * 0.08}
            stroke="#888"
            strokeWidth="0.6"
          />
        );
      })}
    </Svg>
    </View>
  );
}

// Track Component
function MinecartTrack({ fromX, fromY, toX, toY, strokeWidth = 3 }: { fromX: number; fromY: number; toX: number; toY: number; strokeWidth?: number }) {
  const angle = Math.atan2(toY - fromY, toX - fromX);

  return (
    <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
      <Line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="#8B4513" strokeWidth={strokeWidth * 0.6} />
      <Line x1={fromX} y1={fromY + 8} x2={toX} y2={toY + 8} stroke="#8B4513" strokeWidth={strokeWidth * 0.6} />
      
      {Array.from({ length: 8 }).map((_, i) => {
        const t = i / 7;
        const x = fromX + (toX - fromX) * t;
        const y = fromY + (toY - fromY) * t;
        const sleeperLen = 20;
        const perpX = Math.cos(angle + Math.PI / 2) * sleeperLen;
        const perpY = Math.sin(angle + Math.PI / 2) * sleeperLen;

        return (
          <Line
            key={`sleeper-${i}`}
            x1={x - perpX}
            y1={y - perpY}
            x2={x + perpX}
            y2={y + perpY}
            stroke="#D2691E"
            strokeWidth={strokeWidth * 0.4}
          />
        );
      })}
    </Svg>
  );
}

export function LandscapeContent({ onNavigateToFarm, onOpenSiloModal, onOpenOrdersModal }: { onNavigateToFarm?: () => void; onOpenSiloModal?: () => void; onOpenOrdersModal?: () => void }) {
  const [dimensions, setDimensions] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 80, // Only account for header since bottom bars are hidden
  });
  const [isModalOpening, setIsModalOpening] = useState(false);

  useEffect(() => {
    console.log('🌄 LandscapeContent mounted');
    // Update dimensions on mount for web
    const updateDimensions = () => {
      setDimensions({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT - 80, // Only account for header
      });
    };
    updateDimensions();
  }, []);

  const handleSiloPress = () => {
    if (isModalOpening) return;
    setIsModalOpening(true);
    onOpenSiloModal?.();
    // Reset after a short delay
    setTimeout(() => setIsModalOpening(false), 500);
  };

  const stationX = dimensions.width * 0.92; // Moved further right (was 0.85)
  const stationY = dimensions.height * 0.15;
  const greenhouseX = dimensions.width * 0.25;
  const greenhouseY = dimensions.height * 0.35;

  return (
    <View style={styles.container}>
      <View style={styles.grassBackground} />
      
      <View style={styles.sceneContainer}>
        {/* Tree positioned behind greenhouse and lower on display - 50% smaller */}
        <Tree size={90} x={dimensions.width * 0.05} y={dimensions.height * 0.5} />
        
        {/* Tracks and minecart rendered before train station to fix z-layering - 50% smaller */}
        <MinecartTrack fromX={stationX} fromY={stationY} toX={greenhouseX} toY={greenhouseY} strokeWidth={2} />
        <MinecartWithTrack fromX={stationX} fromY={stationY} toX={greenhouseX} toY={greenhouseY} size={25} />
        
        {/* Train station and greenhouse on top layer - 50% smaller */}
        <TrainStation size={110} x={dimensions.width - 130} y={10} onPress={onOpenOrdersModal} />
        <Greenhouse size={100} x={greenhouseX - 50} y={greenhouseY - 50} onPress={onNavigateToFarm} />
        
        <GrainSilo size={140} opacity={0.45} x={dimensions.width * 0.05} y={dimensions.height - 320} onPress={handleSiloPress} />
        <GrainSilo size={160} opacity={0.5} x={dimensions.width * 0.38} y={dimensions.height - 340} onPress={handleSiloPress} />
        <GrainSilo size={145} opacity={0.48} x={dimensions.width - 145 - dimensions.width * 0.05} y={dimensions.height - 320} onPress={handleSiloPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#6BA842',
  },
  grassBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#6BA842',
  },
  sceneContainer: {
    flex: 1,
    position: 'relative',
  },
});
