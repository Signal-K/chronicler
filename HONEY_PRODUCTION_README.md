# 🍯 Honey Production System

This document explains the new honey production system that allows bees to produce different types of honey based on the crops players are growing.

## 🌟 Features Overview

### 1. Crop-Based Nectar Production
Each crop now has detailed nectar properties that determine:
- **Nectar Amount**: How much nectar the crop produces
- **Nectar Quality**: Affects the final honey quality
- **Honey Profile**: Color, flavor, and description of the resulting honey
- **Pollen Properties**: Amount and quality of pollen produced
- **Bee Attraction**: How attractive the crop is to bees
- **Peak Production Hours**: When the crop produces the most nectar

### 2. Researched Honey Types

Based on real-world beekeeping knowledge, each crop produces unique honey:

| Crop | Honey Type | Description |
|------|------------|-------------|
| **Sunflower** 🌻 | Amber, Distinctive | Golden amber honey with rich, distinctive flavor - the premium choice |
| **Pumpkin** 🎃 | Light, Floral | Delicate honey with sweet floral notes from large pumpkin blossoms |
| **Tomato** 🍅 | Light, Mild | Light honey with subtle fruity notes from tomato flowers |
| **Potato** 🥔 | Light, Mild | Clean honey with subtle earthy undertones |
| **Wheat** 🌾 | N/A | No honey production - wheat is wind-pollinated |

### 3. Dynamic Pollination System
- **Automatic Bee Visits**: Bees automatically visit flowering crops during daylight hours (6 AM - 6 PM)
- **Growth Stage Dependent**: Only mature crops (growth stage 2+) produce nectar
- **Time-Based Production**: Nectar production varies throughout the day based on each crop's peak hours
- **Realistic Conversion**: 80% nectar-to-honey conversion rate

### 4. Hive Management
- **Current Batch Tracking**: Each hive maintains a current honey batch in production
- **Quality Calculation**: Honey quality is averaged across all nectar sources
- **Batch Completion**: Batches automatically complete at 100ml capacity
- **Blend Descriptions**: Automatic honey naming based on dominant nectar sources

### 5. User Interface Features
- **Hive Information Modal**: Click any hive to see detailed production information
- **Auto-Fill Settings**: Toggle automatic honey tracking in Settings
- **Debug Panel**: Development panel showing real-time production statistics

## 🔧 Implementation Details

### Core Files Added/Modified

#### New Libraries
- `lib/honeyProduction.ts` - Core honey production logic
- `hooks/useHoneyProduction.ts` - React hook for managing honey state
- `components/hives/HiveInfoModal.tsx` - Modal for displaying hive details
- `components/hives/EnhancedHive.tsx` - Enhanced hive component with honey tracking
- `components/debug/HoneyProductionDebug.tsx` - Debug panel for development

#### Modified Files
- `lib/cropConfig.ts` - Extended with nectar and honey properties
- `app/settings.tsx` - Added auto-fill honey toggle
- `app/home.tsx` - Integrated honey production system

### Data Structures

```typescript
interface NectarProperties {
  producesNectar: boolean;
  nectarAmount: number; // 0-100
  nectarQuality: number; // 0-100
  honeyProfile: {
    type: 'light' | 'amber' | 'dark' | 'specialty';
    flavor: 'mild' | 'floral' | 'robust' | 'distinctive';
    color: string; // Hex color
    description: string;
  };
  pollen: {
    amount: number; // 0-100
    quality: number; // 0-100
    color: string;
  };
  beeAttraction: number; // 0-100
  peakNectarHours: [number, number]; // [start, end] hours
}
```

### Honey Batch System

```typescript
interface HoneyBatch {
  id: string;
  sources: { [cropId: string]: number }; // Nectar contribution by crop
  quality: number;
  amount: number; // Total honey in ml
  createdAt: Date;
  dominantFlavor: string;
  color: string;
  description: string;
  isComplete: boolean;
}
```

## 🎮 Game Mechanics

### Pollination Cycle
1. **Daylight Hours**: Bees are active from 6 AM to 6 PM
2. **Crop Visits**: Bees visit crops every 15 minutes during active hours
3. **Nectar Collection**: Amount varies by crop type and time of day
4. **Batch Accumulation**: Nectar is converted to honey and added to current batch

### Quality System
- **Basic (0-39%)**: Poor nectar sources or limited diversity
- **Fair (40-59%)**: Average quality crops
- **Good (60-79%)**: Good mix of quality crops
- **Premium (80-100%)**: High-quality crops like sunflowers

### Harvest Tracking
- **Automatic Detection**: System tracks when crops are harvested
- **Daily Reset**: Collection data resets at midnight
- **Auto-Fill Option**: Can be enabled/disabled in settings

## 🛠️ Usage Instructions

### For Players
1. **Plant Flowering Crops**: Sunflowers, pumpkins, tomatoes, and potatoes all attract bees
2. **Watch Your Hives**: Click on hives to see current honey production
3. **Optimize Timing**: Plant crops that flower at different times for continuous production
4. **Check Settings**: Enable/disable auto-fill honey tracking in Settings > Honey Production

### For Developers
1. **Debug Panel**: Use the honey production debug panel to monitor system status
2. **Settings Integration**: The auto-fill setting is saved to AsyncStorage
3. **Harvest Tracking**: The system automatically detects crop harvests and updates honey production

## 🔮 Future Enhancements

### Planned Features
- **Seasonal Variations**: Different honey production rates by season
- **Weather Effects**: Rain, temperature affecting nectar production
- **Bee Health System**: Hive health affects production efficiency
- **Honey Market**: Selling different honey types at varying prices
- **Advanced Hives**: Unlockable hive types with special bonuses
- **Honey Bottling**: Convert raw honey to sellable products

### Expansion Possibilities
- **More Crop Types**: Additional flowers and plants with unique honey profiles
- **Cross-Pollination**: Bonus effects when multiple crop types are nearby
- **Bee Breeding**: Different bee types with specialized collection abilities
- **Honey Recipes**: Combining different honeys for special products

## 🧪 Testing

### Manual Testing Steps
1. Plant different crop types (sunflowers recommended for best results)
2. Wait for crops to reach growth stage 2+
3. Check hives during daylight hours (6 AM - 6 PM)
4. Harvest crops and verify honey production continues with harvested crop data
5. Toggle auto-fill setting and verify behavior changes

### Debug Information
- Use the debug panel to monitor real-time production statistics
- Check browser/device console for pollination event logs
- Verify nectar sources are correctly identified and tracked

## 📚 References

The honey production values are based on real-world beekeeping knowledge:
- Sunflower honey is indeed premium quality with distinctive flavor
- Pumpkin blossoms are excellent nectar sources
- Tomato and potato flowers do produce nectar that bees collect
- Wheat is wind-pollinated and produces minimal nectar

This system brings authentic agricultural knowledge into the game while maintaining engaging gameplay mechanics.