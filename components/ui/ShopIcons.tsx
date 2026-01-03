import React from 'react';
import { Image } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export const TomatoSeedIcon = ({ size = 48 }: { size?: number }) => (
  <Image
    source={require('../../assets/Sprites/Crops/Tomato/1 - Tomato Seed.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const BlueberrySeedIcon = ({ size = 48 }: { size?: number }) => (
  <Image
    source={require('../../assets/Sprites/Crops/Blueberry.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const LavenderSeedIcon = ({ size = 48 }: { size?: number }) => (
  <Image
    source={require('../../assets/Sprites/Crops/Lavender.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const SunflowerSeedIcon = ({ size = 48 }: { size?: number }) => (
  <Image
    source={require('../../assets/Sprites/Crops/Sunflower.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

export const GlassBottleIcon = ({ size = 48 }: { size?: number }) => (
  <Image
    source={require('../../assets/Sprites/Bottle.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
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

