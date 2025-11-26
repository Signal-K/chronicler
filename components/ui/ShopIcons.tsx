import React from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

export const TomatoSeedIcon = ({ size = 48 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="26" r="14" fill="#DC2626" />
    <Path d="M24 12 L20 18 L24 18 L22 12 L24 18 L26 12 L24 18 L28 18 L24 12Z" fill="#16A34A" />
    <Circle cx="20" cy="24" r="1.5" fill="#FCA5A5" opacity="0.5" />
    <Circle cx="28" cy="28" r="1.5" fill="#FCA5A5" opacity="0.5" />
    <Circle cx="24" cy="30" r="1.5" fill="#FCA5A5" opacity="0.5" />
  </Svg>
);

export const CarrotSeedIcon = ({ size = 48 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="14" fill="#EA580C" />
    <Path d="M24 10 L22 16 L24 16 L23 10 L24 16 L25 10Z" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
    <Ellipse cx="24" cy="25" rx="4" ry="8" fill="#FDBA74" opacity="0.3" />
  </Svg>
);

export const WheatSeedIcon = ({ size = 48 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="14" fill="#D97706" />
    <G transform="translate(24, 12)">
      <Line x1="0" y1="0" x2="0" y2="20" stroke="#92400E" strokeWidth="2" />
      <Ellipse cx="-3" cy="5" rx="3" ry="4" fill="#FCD34D" />
      <Ellipse cx="3" cy="5" rx="3" ry="4" fill="#FCD34D" />
      <Ellipse cx="-3" cy="10" rx="3" ry="4" fill="#FCD34D" />
      <Ellipse cx="3" cy="10" rx="3" ry="4" fill="#FCD34D" />
      <Ellipse cx="0" cy="15" rx="3" ry="4" fill="#FCD34D" />
    </G>
  </Svg>
);

export const GlassBottleIcon = ({ size = 48 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Bottle body */}
    <Path
      d="M18 14 L18 8 L30 8 L30 14 L32 20 L32 38 C32 40 30 42 28 42 L20 42 C18 42 16 40 16 38 L16 20 Z"
      fill="#60A5FA"
      opacity="0.3"
      stroke="#1E40AF"
      strokeWidth="2"
    />
    {/* Neck */}
    <Rect x="20" y="4" width="8" height="4" rx="1" fill="#E0F2FE" stroke="#1E40AF" strokeWidth="1.5" />
    {/* Cork/Cap */}
    <Rect x="19" y="2" width="10" height="3" rx="1.5" fill="#92400E" />
    {/* Honey inside */}
    <Path
      d="M17 28 C17 28 18 26 24 26 C30 26 31 28 31 28 L31 38 C31 39 29.5 40 28 40 L20 40 C18.5 40 17 39 17 38 Z"
      fill="#F59E0B"
      opacity="0.6"
    />
    {/* Shine effect */}
    <Path
      d="M20 10 L22 10 L22 36 L20 36 Z"
      fill="#FFFFFF"
      opacity="0.4"
    />
  </Svg>
);

export const OrderBoxIcon = ({ size = 48 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Rect x="8" y="16" width="32" height="24" rx="2" fill="#92400E" stroke="#78350F" strokeWidth="2" />
    <Path d="M8 20 L24 28 L40 20" stroke="#78350F" strokeWidth="2" fill="none" />
    <Path d="M24 28 L24 40" stroke="#78350F" strokeWidth="2" />
    <Rect x="20" y="12" width="8" height="8" fill="#FCD34D" stroke="#78350F" strokeWidth="1.5" />
    <Path d="M24 10 L24 16" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
    <Path d="M21 13 L27 13" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const CoinIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#FCD34D" stroke="#92400E" strokeWidth="1.5" />
    <Circle cx="12" cy="12" r="7" fill="#FDE68A" />
    <Path d="M12 8 L12 16 M9 12 L15 12" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
