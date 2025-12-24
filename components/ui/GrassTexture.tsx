import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

type Props = {
  style?: StyleProp<ViewStyle>;
  width?: number | string;
  height?: number | string;
};

export default function GrassTexture({ style, width = '100%', height = '100%' }: Props) {
  return (
    <Svg
          width={width}
          height={height}
          viewBox="0 0 800 1200"
      preserveAspectRatio="xMidYMid slice"
      style={style}
    >
      <Defs>
            <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#9fefb9" />
              <Stop offset="45%" stopColor="#79eaa0" />
              <Stop offset="100%" stopColor="#4fc76f" />
            </LinearGradient>

            {/* large sweeping blades for a stylized textured look */}
            <LinearGradient id="bladeGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#6fcf6b" stopOpacity="0.28" />
              <Stop offset="100%" stopColor="#1f7f44" stopOpacity="0.14" />
            </LinearGradient>
      </Defs>

      {/* background gradient */}
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#bg)" />

      {/* sweeping large blades - left side cluster (faint) */}
      <G opacity={0.25} transform="translate(-120,80) scale(1.1)">
        <Path d="M120 120 C200 40, 320 -40, 420 20 C360 120, 260 260, 120 520 Z" fill="url(#bladeGrad)" />
        <Path d="M200 220 C300 100, 420 10, 520 60 C470 160, 380 300, 200 520 Z" fill="#3aa663" opacity={0.12} />
      </G>

      {/* right side blades */}
      <G opacity={0.28} transform="translate(160,40) scale(1)">
        <Path d="M260 80 C350 -20, 480 -120, 620 -40 C560 60, 480 220, 330 520 Z" fill="url(#bladeGrad)" />
        <Path d="M340 160 C440 40, 560 -60, 680 10 C620 120, 520 280, 360 540 Z" fill="#2b8f45" opacity={0.12} />
      </G>

      {/* subtle diagonal strokes for texture */}
      <G opacity={0.12} transform="rotate(-18 400 600)">
        <Path d="M40 800 C120 600, 200 420, 340 220" stroke="#2b8f45" strokeWidth={28} strokeLinecap="round" strokeOpacity={0.09} fill="none" />
        <Path d="M140 880 C220 660, 320 480, 460 260" stroke="#1f7f44" strokeWidth={18} strokeLinecap="round" strokeOpacity={0.06} fill="none" />
      </G>

      {/* light vignette on right edge like your reference */}
      <Rect x="720" y="0" width="80" height="100%" fill="#79eaa0" opacity={0.14} />
    </Svg>
  );
}
