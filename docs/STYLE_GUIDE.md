# Bee Garden Style Guide

## Overview

This project uses **React Native's StyleSheet API** for styling. Unlike web development with CSS/Tailwind, React Native styles are defined using JavaScript objects and the `StyleSheet.create()` method.

## Style Organization

### 1. **Location of Styles**

Styles are organized in three primary ways:

#### A. Dedicated Style Files (`/styles/`)
Reusable, extracted style definitions for specific features:

```
/styles/
├── garden/
│   ├── BeesStyles.ts
│   ├── CloudsStyles.ts
│   ├── GardenPlotsStyles.ts
│   ├── GrassTerrainStyles.ts
│   ├── MoonStyles.ts
│   ├── PlantingToolbarStyles.ts
│   ├── StarsStyles.ts
│   ├── ToolbarIconStyles.ts
│   └── WeatherHUDStyles.ts
└── screens/
    └── GardenViewStyles.ts
```

**Usage Example:**
```typescript
import { beesStyles } from '@/styles/garden/BeesStyles';

<View style={beesStyles.beeContainer}>
  <View style={beesStyles.beeHead} />
</View>
```

#### B. Component-Level Styles
Styles defined at the bottom of component files:

```typescript
// /components/garden/SimpleToolbar.tsx
const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    backgroundColor: '#92400e',
    paddingHorizontal: 20,
  },
});
```

**Files with inline styles (48 total):**
- All `/app/*.tsx` screens (home, nests, expand, planets, settings, etc.)
- All `/components/**/*.tsx` components
- Modal components, animations, UI components

#### C. Theme Constants (`/constants/theme.ts`)
Central color and font definitions:

```typescript
export const Colors = {
  light: { text, background, tint, icon, tabIconDefault, tabIconSelected },
  dark: { text, background, tint, icon, tabIconDefault, tabIconSelected }
};

export const Fonts = {
  ios: { sans, serif, rounded, mono },
  web: { sans, serif, rounded, mono }
};
```

---

## Color Palette

### Primary Theme Colors

The project uses a **brown/earth and green/nature** color scheme representing gardening:

#### Brown/Earth Tones (UI, Borders, Soil)
```typescript
// Primary Browns
'#92400e'  // Brown-800 - Main UI elements, borders, text
'#78350f'  // Brown-900 - Darker accents, secondary text
'#b45309'  // Amber-700 - Tilled soil (light)
'#a16207'  // Amber-800 - Untilled soil

// Neutral Browns
'#44403c'  // Stone-700 - Border accents
'#57534e'  // Stone-600 - Disabled states
'#292524'  // Stone-800 - Dark borders
'#1c1917'  // Stone-900 - Darkest borders
'#a8a29e'  // Stone-400 - Subtle text

// Golden/Bee Colors
'#B8860B'  // DarkGoldenRod - Bee body
'#DAA520'  // GoldenRod - Bee thorax
'#FFD700'  // Gold - Bee abdomen
'#654321'  // Dark Brown - Bee details
```

#### Green Tones (Plants, Growth, Success)
```typescript
// Primary Greens
'#22c55e'  // Green-500 - Active states, success, mature plants
'#4ade80'  // Green-400 - Buttons, highlights
'#86efac'  // Green-300 - Light accents, gradients

// Deeper Greens
'#16a34a'  // Green-600 - Secondary plant colors
'#15803d'  // Green-700 - Leaf colors
'#166534'  // Green-800 - Dark borders on green elements
```

#### Background Gradients
```typescript
// Garden/Growth Gradient (most common)
colors={['#86efac', '#4ade80', '#22c55e']}  // Light → Medium → Dark green

// Brown/Soil Gradient
colors={['#b45309', '#92400e']}  // Amber → Brown

// Tilled Soil Gradient
['#b45309', '#92400e', '#78350f']  // Light → Medium → Dark brown
```

### Weather & Astronomy Colors

Dynamic colors from `/lib/weather.ts` and `/lib/astronomy.ts`:

#### Sky Colors (by time of day)
```typescript
Dawn:   { primary: '#FFB6C1', secondary: '#FFA07A', accent: '#F0E68C' }
Sunrise: { primary: '#FF6347', secondary: '#FFA500', accent: '#FFD700' }
Morning: { primary: '#87CEEB', secondary: '#B0E0E6', accent: '#F0F8FF' }
Sunset:  { primary: '#DDA0DD', secondary: '#F0E68C', accent: '#FF69B4' }
Dusk:    { primary: '#FF4500', secondary: '#FF8C00', accent: '#9370DB' }
Night:   { primary: '#1A1A2E', secondary: '#16213E' }
```

#### Weather-Based Colors
```typescript
Overcast: { primary: '#2C3E50', secondary: '#34495E', accent: '#7F8C8D' }
Rainy:    { primary: '#95A5A6', secondary: '#BDC3C7' }  // when cloudy
Clear:    { primary: '#87CEEB', secondary: '#B0E0E6' }
```

### Plant/Crop Colors

From `/components/sprites/CropSprite.tsx`:

```typescript
Tomato: { primary: '#ef4444', secondary: '#dc2626', leaf: '#22c55e' }  // Red
Lettuce: { primary: '#22c55e', secondary: '#16a34a', leaf: '#15803d' } // Green
// ... additional crops follow similar pattern
```

---

## Typography

### Font Families

Defined in `/constants/theme.ts`:

```typescript
// iOS
ios: {
  sans: 'system-ui',           // Default UI
  serif: 'ui-serif',            // Decorative
  rounded: 'ui-rounded',        // Friendly/soft
  mono: 'ui-monospace'          // Code/numbers
}

// Web
web: {
  sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', ...",
  serif: "Georgia, 'Times New Roman', serif",
  rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', ...",
  mono: "SFMono-Regular, Menlo, Monaco, Consolas, ..."
}
```

### Font Sizes

Common sizes used throughout the app:

```typescript
// Headings
fontSize: 32  // Large headings
fontSize: 24  // Section headers
fontSize: 20  // Sub-headers
fontSize: 18  // Card titles

// Body Text
fontSize: 16  // Standard body, buttons
fontSize: 14  // Secondary text, labels

// Small Text
fontSize: 12  // Captions, metadata
fontSize: 10  // Tiny labels
```

### Font Weights

```typescript
fontWeight: '900'  // Extra bold headings
fontWeight: '800'  // Bold headings
fontWeight: '700'  // Semibold titles
fontWeight: '600'  // Medium emphasis
fontWeight: '500'  // Normal emphasis
fontWeight: '400'  // Regular text
```

---

## Common Style Patterns

### Layout Patterns

#### Flex Containers
```typescript
container: {
  flex: 1,
  flexDirection: 'column',  // or 'row'
  justifyContent: 'center', // or 'space-between', 'flex-start', 'flex-end'
  alignItems: 'center',     // or 'flex-start', 'flex-end', 'stretch'
  gap: 12,                  // spacing between children (common: 8, 12, 16, 20)
}
```

#### Absolute Positioning (for overlays)
```typescript
overlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 100,  // Layer control (common: 1, 10, 20, 50, 100)
}
```

### Button Styles

#### Standard Button Pattern
```typescript
button: {
  paddingHorizontal: 24,
  paddingVertical: 12,
  borderRadius: 25,          // Fully rounded
  backgroundColor: '#4ade80',
  borderWidth: 3,
  borderColor: '#166534',
  justifyContent: 'center',
  alignItems: 'center',
  
  // Shadow (iOS)
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  
  // Shadow (Android)
  elevation: 4,
}

buttonText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#fff',
  textAlign: 'center',
}
```

#### Disabled State
```typescript
buttonDisabled: {
  backgroundColor: '#57534e',
  borderColor: '#292524',
  opacity: 0.5,
}
```

### Card/Panel Styles

```typescript
card: {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',  // Semi-transparent white
  borderRadius: 16,
  padding: 16,
  borderWidth: 3,
  borderColor: '#92400e',
  marginVertical: 8,
  
  // Shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
}
```

### Border Styles

```typescript
// Heavy border (UI elements)
borderWidth: 3,
borderColor: '#92400e',

// Medium border (cards)
borderWidth: 2,
borderColor: '#78350f',

// Light border (dividers)
borderBottomWidth: 1,
borderBottomColor: '#92400E',
```

### Border Radius

```typescript
borderRadius: 25  // Fully rounded buttons
borderRadius: 16  // Cards, panels
borderRadius: 12  // Medium rounding
borderRadius: 8   // Subtle rounding
borderRadius: 4   // Minimal rounding
```

### Shadows & Elevation

```typescript
// iOS Shadow
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },  // Common: 2, 4, 6
shadowOpacity: 0.3,                      // Common: 0.1, 0.2, 0.3
shadowRadius: 4,                         // Common: 4, 6, 8

// Android Shadow
elevation: 4,  // Common: 2, 4, 6, 8
```

### Opacity/Transparency

```typescript
// Background transparency
backgroundColor: 'rgba(255, 255, 255, 0.9)',  // Almost opaque white
backgroundColor: 'rgba(0, 0, 0, 0.5)',        // Semi-transparent black
backgroundColor: 'rgba(120, 53, 15, 0.9)',    // Semi-transparent brown

// Element opacity
opacity: 0.5,   // Disabled states
opacity: 0.7,   // Translucent wings, overlays
opacity: 0.8,   // Slightly transparent
```

---

## Component-Specific Guidelines

### Toolbar (SimpleToolbar.tsx)

```typescript
toolbar: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#92400e',       // Brown background
  borderTopWidth: 3,
  borderTopColor: '#44403c',
  paddingHorizontal: 20,
  paddingVertical: 16,
}

toolButton: {
  backgroundColor: '#78350f',        // Inactive tools
  // OR
  backgroundColor: '#22c55e',        // Active/selected tool
}
```

### Game Header (GameHeader.tsx)

```typescript
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: 'rgba(120, 53, 15, 0.9)',  // Semi-transparent brown
  paddingHorizontal: 16,
  paddingVertical: 12,
  zIndex: 20,
}

actionButton: {
  width: 48,
  height: 48,
  borderRadius: 24,                  // Circular
  backgroundColor: '#4ade80',        // Green
  borderWidth: 3,
  borderColor: '#166534',
}
```

### Inventory

```typescript
inventoryContainer: {
  borderBottomWidth: 1,
  borderBottomColor: '#92400E',
}

itemText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#92400E',                  // Brown text
}

quantityText: {
  fontSize: 12,
  color: '#78350F',                  // Darker brown
}
```

### Garden Elements

```typescript
plot: {
  backgroundColor: '#92400e',        // Soil base
  borderWidth: 2,
  borderColor: '#78350f',
  borderRadius: 8,
}

plant: {
  // Uses dynamic colors based on growth stage
}

fence: {
  borderWidth: 3,
  borderColor: '#78350f',            // Brown fencing
}
```

---

## Responsive Design

### Screen Dimensions

```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Usage
container: {
  width: width * 0.9,    // 90% of screen width
  maxWidth: 400,          // Cap at 400px
}
```

### Platform-Specific Styles

```typescript
import { Platform } from 'react-native';

header: {
  paddingTop: Platform.OS === 'ios' ? 44 : 20,
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
    },
    android: {
      elevation: 4,
    },
  }),
}
```

---

## Animation Styles

### Common Animated Values

```typescript
import { Animated } from 'react-native';

// In component
const fadeAnim = new Animated.Value(0);  // Opacity
const slideAnim = new Animated.Value(-100);  // Position
const scaleAnim = new Animated.Value(0);  // Scale

// Usage
<Animated.View style={{
  opacity: fadeAnim,
  transform: [
    { translateY: slideAnim },
    { scale: scaleAnim }
  ]
}} />
```

### Spring Animations (Panels)

```typescript
Animated.spring(panelHeight, {
  toValue: height * 0.65,
  useNativeDriver: false,
  tension: 50,
  friction: 8,
}).start();
```

---

## Best Practices

### 1. **Extract Reusable Styles**

❌ **Bad:** Inline repeated styles
```typescript
<View style={{ backgroundColor: '#92400e', padding: 16, borderRadius: 8 }}>
<View style={{ backgroundColor: '#92400e', padding: 16, borderRadius: 8 }}>
```

✅ **Good:** Create reusable style
```typescript
const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#92400e',
    padding: 16,
    borderRadius: 8,
  }
});

<View style={styles.panel}>
<View style={styles.panel}>
```

### 2. **Use Color Constants**

❌ **Bad:** Hardcoded colors
```typescript
backgroundColor: '#92400e',
borderColor: '#92400e',
color: '#92400e',
```

✅ **Good:** Create color constants
```typescript
const COLORS = {
  primary: '#92400e',
  secondary: '#78350f',
  success: '#22c55e',
};

backgroundColor: COLORS.primary,
```

### 3. **Combine Styles with Arrays**

```typescript
<View style={[
  styles.button,
  isActive && styles.buttonActive,
  isDisabled && styles.buttonDisabled,
]} />
```

### 4. **Use StyleSheet.create() for Performance**

```typescript
// ✅ Optimized
const styles = StyleSheet.create({
  container: { flex: 1 }
});

// ❌ Creates new object on every render
<View style={{ flex: 1 }} />
```

### 5. **Organize Styles Logically**

```typescript
const styles = StyleSheet.create({
  // Containers first
  container: { ... },
  section: { ... },
  
  // Elements
  title: { ... },
  text: { ... },
  
  // Buttons
  button: { ... },
  buttonText: { ... },
  
  // States
  active: { ... },
  disabled: { ... },
});
```

### 6. **Use Semantic Naming**

```typescript
// ✅ Clear intent
styles.primaryButton
styles.errorText
styles.headerContainer

// ❌ Vague
styles.button1
styles.text2
styles.container3
```

---

## Migration Checklist

When refactoring components and extracting styles:

- [ ] Extract hardcoded colors to constants
- [ ] Move repeated styles to dedicated style files in `/styles/`
- [ ] Use `StyleSheet.create()` for all style objects
- [ ] Ensure consistent naming conventions
- [ ] Add comments for complex or dynamic styles
- [ ] Test on both iOS and Android (if applicable)
- [ ] Verify shadow/elevation works on both platforms
- [ ] Check responsive behavior at different screen sizes

---

## Quick Reference

### File Structure
```
/constants/theme.ts          → Colors & Fonts
/styles/garden/*.ts          → Garden component styles
/styles/screens/*.ts         → Screen-level styles
/components/**/*.tsx         → Inline component styles
/app/**/*.tsx                → Inline screen styles
```

### Most Used Colors
```typescript
'#92400e'  // Primary brown (borders, text)
'#78350f'  // Secondary brown (darker accents)
'#22c55e'  // Primary green (success, active)
'#4ade80'  // Light green (highlights)
'#86efac'  // Lightest green (gradients)
```

### Common Spacing
```typescript
padding: 16        // Standard padding
paddingVertical: 12
paddingHorizontal: 20
gap: 12            // Flexbox spacing
marginVertical: 8
```

### Common Borders
```typescript
borderWidth: 3
borderColor: '#92400e'
borderRadius: 16   // Cards
borderRadius: 25   // Buttons (fully rounded)
```

---

## Additional Resources

- **React Native StyleSheet Docs:** https://reactnative.dev/docs/stylesheet
- **Flexbox Guide:** https://reactnative.dev/docs/flexbox
- **Platform Specific Code:** https://reactnative.dev/docs/platform-specific-code
- **Colors in RN:** https://reactnative.dev/docs/colors

---

**Last Updated:** November 2025
**Project:** Bee Garden Mobile Game
**Framework:** React Native + Expo
