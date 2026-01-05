import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';

// Local type definition
type PlanetIconProps = {
  size?: number;
  color?: string;
  style?: any;
};

export default function PlanetIcon({ size = 28, color = '#4A90E2' }: PlanetIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="planetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor="#2980B9" />
        </LinearGradient>
      </Defs>
      {/* Main planet body */}
      <Circle cx="50" cy="50" r="40" fill="url(#planetGrad)" />
      
      {/* Surface features */}
      <Path d="M20,35 Q35,30 40,40 Q45,50 35,55 Q25,50 20,35" fill="rgba(255,255,255,0.2)" />
      <Path d="M60,25 Q75,30 80,45 Q70,55 60,50 Q55,35 60,25" fill="rgba(255,255,255,0.15)" />
      <Path d="M25,70 Q40,65 50,75 Q35,85 25,70" fill="rgba(255,255,255,0.1)" />
      
      {/* Orbital ring */}
      <Ellipse cx="50" cy="50" rx="55" ry="15" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      
      {/* Planet highlight */}
      <Circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    </Svg>
  );
}