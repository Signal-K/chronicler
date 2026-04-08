import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate toolbar button positions dynamically
// Toolbar has 4 buttons, each minWidth 62, gap 6, centered
const BUTTON_WIDTH = 70; // Approximate width including padding
const BUTTON_GAP = 6;
const TOTAL_BUTTONS_WIDTH = (BUTTON_WIDTH * 4) + (BUTTON_GAP * 3); // ~300px
const TOOLBAR_START_X = (SCREEN_WIDTH - TOTAL_BUTTONS_WIDTH) / 2;

export type TutorialStepType = 
  | 'welcome'
  | 'highlight-header'
  | 'highlight-toolbar'
  | 'click-tool'
  | 'click-plot'
  | 'navigate'
  | 'wait-action'
  | 'info'
  | 'section-header'
  | 'complete';

export interface InteractiveTutorialStep {
  id: string;
  type: TutorialStepType;
  title: string;
  message: string;
  icon?: string;
  /** Which UI element to highlight */
  highlightTarget?: 'header' | 'toolbar' | 'coins' | 'water' | 'level' | 'weather' | 
                   'till-button' | 'plant-button' | 'water-button' | 'harvest-button' |
                   'garden' | 'plot' | 'nav-left' | 'nav-right' | 'shop';
  /** Which tool should be selected to advance */
  requireTool?: 'till' | 'plant' | 'water' | 'harvest';
  /** Which action must happen to advance */
  requireAction?: 'till-plot' | 'plant-seed' | 'water-plant' | 'harvest-crop' | 'open-shop' | 'view-hives' | 'tap-hive' | 'bottle-honey' | 'fulfill-order';
  /** Position of the tooltip */
  tooltipPosition?: 'top' | 'bottom' | 'center';
  /** Allow user to tap anywhere to continue (for info steps) */
  tapToContinue?: boolean;
  /** Auto-advance after delay (ms) */
  autoAdvanceDelay?: number;
  /** Section number for grouping related steps */
  section?: number;
}

// Interactive tutorial steps that guide actual gameplay
export const INTERACTIVE_TUTORIAL_STEPS: InteractiveTutorialStep[] = [
  // === SECTION 1: WELCOME & OVERVIEW ===
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Welcome to Bee Garden! 🐝',
    message: 'Grow crops, raise bees, and build a thriving farm. This quick guide will show you the essentials!',
    icon: '🌻',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 1,
  },
  {
    id: 'header-intro',
    type: 'highlight-header',
    title: 'Your Dashboard',
    message: 'Your coins 🪙, water 💧, and level are shown here. Tap the weather icon to access settings.',
    highlightTarget: 'header',
    tooltipPosition: 'bottom',
    tapToContinue: true,
    section: 1,
  },
  {
    id: 'toolbar-intro',
    type: 'highlight-toolbar',
    title: 'Farming Tools',
    message: 'Till 🚜, Plant 🌱, Water 💧, and Harvest 🌾 — your four essential farming tools!',
    highlightTarget: 'toolbar',
    tooltipPosition: 'top',
    tapToContinue: true,
    section: 1,
  },

  // === SECTION 2: GROWING CROPS ===
  {
    id: 'growing-intro',
    type: 'section-header',
    title: '🌱 Growing Crops',
    message: 'Let\'s plant your first crop! The process is: Till → Plant → Water → Wait → Harvest.',
    icon: '🌱',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 2,
  },
  {
    id: 'till-tool',
    type: 'click-tool',
    title: 'Step 1: Till the Soil',
    message: 'Tap the TILL button 🚜 to prepare soil for planting.',
    icon: '🚜',
    highlightTarget: 'till-button',
    requireTool: 'till',
    tooltipPosition: 'top',
    section: 2,
  },
  {
    id: 'till-plot',
    type: 'click-plot',
    title: 'Till a Plot',
    message: 'Tap any empty plot in your garden to till it.',
    icon: '🌱',
    highlightTarget: 'garden',
    requireAction: 'till-plot',
    tooltipPosition: 'center',
    section: 2,
  },
  {
    id: 'plant-tool',
    type: 'click-tool',
    title: 'Step 2: Plant Seeds',
    message: 'Tap PLANT 🌱 and choose a seed type.',
    icon: '🌱',
    highlightTarget: 'plant-button',
    requireTool: 'plant',
    tooltipPosition: 'top',
    section: 2,
  },
  {
    id: 'plant-seed',
    type: 'click-plot',
    title: 'Plant a Seed',
    message: 'Tap your tilled plot to plant your seed.',
    icon: '🌾',
    highlightTarget: 'garden',
    requireAction: 'plant-seed',
    tooltipPosition: 'bottom',
    section: 2,
  },
  {
    id: 'water-tool',
    type: 'click-tool',
    title: 'Step 3: Water Your Crop',
    message: 'Tap WATER 💧 to help your crop grow.',
    icon: '💧',
    highlightTarget: 'water-button',
    requireTool: 'water',
    tooltipPosition: 'top',
    section: 2,
  },
  {
    id: 'water-plant',
    type: 'click-plot',
    title: 'Water Your Crop',
    message: 'Tap your planted crop to water it.',
    icon: '🌧️',
    highlightTarget: 'garden',
    requireAction: 'water-plant',
    tooltipPosition: 'bottom',
    section: 2,
  },

  // === SECTION 3: HARVESTING ===
  {
    id: 'growth-info',
    type: 'info',
    title: 'Growth Stages ⏰',
    message: 'Crops grow over time: Planted → Growing → Ready. When fully grown, they\'ll have a sparkle!',
    icon: '🌿',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 3,
  },
  {
    id: 'harvest-intro',
    type: 'info',
    title: 'Harvesting Crops 🌾',
    message: 'Use HARVEST and tap mature crops to collect them. You\'ll earn coins and contribute to honey production!',
    icon: '🪙',
    highlightTarget: 'harvest-button',
    tooltipPosition: 'top',
    tapToContinue: true,
    section: 3,
  },

  // === SECTION 4: BEE HIVES & POPULATION ===
  {
    id: 'hives-intro',
    type: 'navigate',
    title: 'Your Bee Hives 🐝',
    message: 'Navigate left ← to visit your hives. Bees help pollinate crops and produce honey!',
    icon: '🐝',
    highlightTarget: 'nav-left',
    tooltipPosition: 'top',
    requireAction: 'view-hives',
    section: 4,
  },
  {
    id: 'hive-setup',
    type: 'info',
    title: 'Your First Hive 🏠',
    message: 'We\'ve given you some bees and filled your hive with honey so you can practice! Tap on your hive to see details.',
    icon: '🍯',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 4,
  },
  {
    id: 'tap-hive',
    type: 'wait-action',
    title: 'Tap Your Hive',
    message: 'Tap on the beehive card to open it and see your honey production.',
    icon: '👆',
    tooltipPosition: 'center',
    requireAction: 'tap-hive',
    section: 4,
  },
  {
    id: 'bottle-honey-intro',
    type: 'info',
    title: 'Bottling Honey 🫙',
    message: 'Your hive is full of honey! Tap the "Bottle Honey" button to collect it. You\'ll need glass bottles (we gave you 5!).',
    icon: '🫙',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 4,
  },
  {
    id: 'bottle-honey-action',
    type: 'wait-action',
    title: 'Bottle Your Honey!',
    message: 'Press the "Bottle Honey" button to collect your first batch of honey.',
    icon: '🍯',
    tooltipPosition: 'center',
    requireAction: 'bottle-honey',
    section: 4,
  },
  {
    id: 'bee-population',
    type: 'info',
    title: 'Growing Your Colony 🐝',
    message: 'Harvest crops to increase your Pollination Score. Every 10 points, new bees will hatch and join your hive!',
    icon: '🥚',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 4,
  },
  {
    id: 'add-hives',
    type: 'info',
    title: 'Adding New Hives 🏠',
    message: 'As your colony grows, buy more hives from the shop. More hives = more honey production!',
    icon: '🍯',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 4,
  },

  // === SECTION 5: HONEY PRODUCTION ===
  {
    id: 'honey-production',
    type: 'info',
    title: 'Honey Production 🍯',
    message: 'Bees produce honey during active hours (8AM-4PM and 8PM-4AM). When the hive fills, you can bottle it!',
    icon: '🍯',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 5,
  },
  {
    id: 'honey-types',
    type: 'info',
    title: 'Customising Honey 🎨',
    message: 'The crops you harvest affect honey type! Light honey (tomatoes), Amber (sunflowers), Dark (blueberries), or Specialty (lavender).',
    icon: '🌺',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 5,
  },

  // === SECTION 6: ORDERS & SALES ===
  {
    id: 'orders-intro',
    type: 'info',
    title: 'Honey Orders 📋',
    message: 'Villagers place daily orders for specific honey types. Check the Orders tab in your hive view!',
    icon: '📋',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 6,
  },
  {
    id: 'fulfill-order-intro',
    type: 'info',
    title: 'Fulfilling Orders 📦',
    message: 'You now have bottled honey! Match it to an order to earn coins and XP. Tap an order to fulfill it.',
    icon: '💰',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 6,
  },
  {
    id: 'fulfill-order-action',
    type: 'wait-action',
    title: 'Fulfill an Order!',
    message: 'Tap on an order that matches your honey type to complete it and earn rewards!',
    icon: '📦',
    tooltipPosition: 'center',
    requireAction: 'fulfill-order',
    section: 6,
  },
  {
    id: 'sales-tip',
    type: 'info',
    title: 'Sales Tips 💡',
    message: 'Plan your crops to match upcoming orders. Specialty honey (lavender) pays the most but takes longer!',
    icon: '📈',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 6,
  },

  // === SECTION 7: EXPERIENCE & LEVELING ===
  {
    id: 'experience-intro',
    type: 'info',
    title: 'Experience Points ⭐',
    message: 'Earn XP from harvesting, pollination events, fulfilling orders, and making classifications. First harvests give bonus XP!',
    icon: '⭐',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 7,
  },
  {
    id: 'leveling-up',
    type: 'info',
    title: 'Leveling Up 📊',
    message: 'Each level requires more XP than the last. Higher levels unlock new features and show off your farming skills!',
    icon: '🎯',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 7,
  },

  // === SECTION 8: EXPANDING YOUR FARM ===
  {
    id: 'expansion-intro',
    type: 'info',
    title: 'Expanding Your Farm 🗺️',
    message: 'Navigate right → to find new biomes! Desert, Swamp, Ocean, and Forest each cost 100 coins to unlock.',
    icon: '🗺️',
    highlightTarget: 'nav-right',
    tooltipPosition: 'top',
    tapToContinue: true,
    section: 8,
  },
  {
    id: 'biome-benefits',
    type: 'info',
    title: 'Biome Benefits 🌍',
    message: 'Each biome has unique conditions! Swamp = faster growth, Desert = less water needed. Experiment to find your favourite!',
    icon: '🌴',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 8,
  },

  // === SECTION 9: WEATHER & DAY/NIGHT ===
  {
    id: 'weather-intro',
    type: 'info',
    title: 'Weather System 🌦️',
    message: 'Weather changes based on your real location! Rain helps water crops, while sunny days boost bee activity.',
    icon: '☀️',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 9,
  },
  {
    id: 'day-night',
    type: 'info',
    title: 'Day & Night Cycle 🌙',
    message: 'The game follows real time! Bees are most active during daytime (6AM-8PM). At night, the garden rests.',
    icon: '🌙',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 9,
  },

  // === SECTION 10: POLLINATION & CLASSIFICATIONS ===
  {
    id: 'pollination-intro',
    type: 'info',
    title: 'Pollination Score 🌼',
    message: 'Every harvest adds to your Pollination Score. This represents how much your bees help your garden thrive!',
    icon: '🌼',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 10,
  },
  {
    id: 'classifications',
    type: 'info',
    title: 'Classifications 🔬',
    message: 'Make up to 2 classifications per day (based on hive count). These earn XP and help track your garden\'s biodiversity!',
    icon: '📚',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 10,
  },

  // === SECTION 11: SHOP ===
  {
    id: 'shop-intro',
    type: 'info',
    title: 'The Shop 🛒',
    message: 'Tap your coins 🪙 to open the shop. Buy seeds, glass bottles, and unlock new biomes!',
    icon: '🛒',
    highlightTarget: 'coins',
    tooltipPosition: 'bottom',
    tapToContinue: true,
    section: 11,
  },

  // === COMPLETION ===
  {
    id: 'complete',
    type: 'complete',
    title: 'You\'re Ready! 🎉',
    message: 'You know the essentials! Grow crops, raise bees, bottle honey, and expand your farm. Happy farming!',
    icon: '🌻',
    tooltipPosition: 'center',
    tapToContinue: true,
    section: 12,
  },
];

interface InteractiveTutorialProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
  /** Callbacks to receive tutorial events */
  onStepChange?: (step: InteractiveTutorialStep) => void;
  /** Current tool selected by user */
  currentTool?: string | null;
  /** Last action performed */
  lastAction?: string | null;
}

export function InteractiveTutorial({
  visible,
  onClose,
  onComplete,
  onStepChange,
  currentTool,
  lastAction,
}: InteractiveTutorialProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const arrowBounce = useRef(new Animated.Value(0)).current;

  const currentStep = INTERACTIVE_TUTORIAL_STEPS[currentStepIndex];

  // Fade in animation
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  // Pulse animation for highlighted elements
  useEffect(() => {
    if (visible && currentStep?.highlightTarget) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [visible, currentStep?.highlightTarget, pulseAnim]);

  // Arrow bounce animation
  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowBounce, {
          toValue: -10,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(arrowBounce, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    bounce.start();
    return () => bounce.stop();
  }, [arrowBounce]);

  const advanceStep = useCallback(() => {
    if (currentStepIndex < INTERACTIVE_TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Tutorial complete
      onComplete();
      onClose();
    }
  }, [currentStepIndex, onComplete, onClose]);

  // Watch for tool selection to advance
  useEffect(() => {
    if (!visible || !currentStep?.requireTool) return;

    if (currentTool === currentStep.requireTool) {
      // Tool selected, advance to next step
      setTimeout(() => advanceStep(), 300);
    }
  }, [currentTool, currentStep, visible, advanceStep]);

  // Watch for actions to advance
  useEffect(() => {
    if (!visible || !currentStep?.requireAction) return;

    if (lastAction === currentStep.requireAction) {
      setTimeout(() => advanceStep(), 500);
    }
  }, [lastAction, currentStep, visible, advanceStep]);

  // Notify parent of step changes
  useEffect(() => {
    if (visible && currentStep) {
      onStepChange?.(currentStep);
    }
  }, [currentStepIndex, visible, currentStep, onStepChange]);

  const handleTap = useCallback(() => {
    if (currentStep?.tapToContinue) {
      advanceStep();
    }
  }, [currentStep, advanceStep]);

  const handleSkip = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!visible || !currentStep) return null;

  // Get highlight position based on target
  const getHighlightStyle = () => {
    // Toolbar button positions (4 buttons centered, minWidth ~70px each, gap 6)
    const buttonHeight = 50;
    const toolbarBottomOffset = 8; // Distance from bottom of screen to buttons
    
    switch (currentStep.highlightTarget) {
      case 'header':
        return { top: Platform.OS === 'ios' ? 44 : 20, left: 0, right: 0, height: 50 };
      case 'toolbar':
        return { bottom: 0, left: 0, right: 0, height: 130 };
      case 'till-button':
        return { 
          bottom: toolbarBottomOffset, 
          left: TOOLBAR_START_X, 
          width: BUTTON_WIDTH, 
          height: buttonHeight 
        };
      case 'plant-button':
        return { 
          bottom: toolbarBottomOffset, 
          left: TOOLBAR_START_X + BUTTON_WIDTH + BUTTON_GAP, 
          width: BUTTON_WIDTH, 
          height: buttonHeight 
        };
      case 'water-button':
        return { 
          bottom: toolbarBottomOffset, 
          left: TOOLBAR_START_X + (BUTTON_WIDTH + BUTTON_GAP) * 2, 
          width: BUTTON_WIDTH, 
          height: buttonHeight 
        };
      case 'harvest-button':
        return { 
          bottom: toolbarBottomOffset, 
          left: TOOLBAR_START_X + (BUTTON_WIDTH + BUTTON_GAP) * 3, 
          width: BUTTON_WIDTH, 
          height: buttonHeight 
        };
      case 'coins':
        return { top: Platform.OS === 'ios' ? 50 : 26, right: 8, width: 90, height: 40 };
      case 'water':
        return { top: Platform.OS === 'ios' ? 50 : 26, right: 110, width: 100, height: 40 };
      case 'nav-left':
        return { bottom: 85, left: 12, width: 44, height: 44 };
      case 'garden':
        return { top: 110, left: 16, right: 16, bottom: 140 };
      default:
        return null;
    }
  };

  const highlightStyle = getHighlightStyle();

  // Get tooltip position
  const getTooltipStyle = () => {
    switch (currentStep.tooltipPosition) {
      case 'top':
        return { top: 120 };
      case 'bottom':
        return { bottom: 180 };
      case 'center':
      default:
        return { top: SCREEN_HEIGHT / 2 - 100 };
    }
  };

  // Get arrow pointing direction
  const getArrowStyle = () => {
    if (!currentStep.highlightTarget) return null;
    
    const arrowBottomOffset = 65; // Position arrow above the buttons
    const arrowCenterOffset = BUTTON_WIDTH / 2 - 8; // Center arrow on button
    
    switch (currentStep.highlightTarget) {
      case 'till-button':
        return { 
          bottom: arrowBottomOffset, 
          left: TOOLBAR_START_X + arrowCenterOffset, 
          transform: [{ rotate: '180deg' }, { translateY: arrowBounce }] 
        };
      case 'plant-button':
        return { 
          bottom: arrowBottomOffset, 
          left: TOOLBAR_START_X + BUTTON_WIDTH + BUTTON_GAP + arrowCenterOffset, 
          transform: [{ rotate: '180deg' }, { translateY: arrowBounce }] 
        };
      case 'water-button':
        return { 
          bottom: arrowBottomOffset, 
          left: TOOLBAR_START_X + (BUTTON_WIDTH + BUTTON_GAP) * 2 + arrowCenterOffset, 
          transform: [{ rotate: '180deg' }, { translateY: arrowBounce }] 
        };
      case 'harvest-button':
        return { 
          bottom: arrowBottomOffset, 
          left: TOOLBAR_START_X + (BUTTON_WIDTH + BUTTON_GAP) * 3 + arrowCenterOffset, 
          transform: [{ rotate: '180deg' }, { translateY: arrowBounce }] 
        };
      case 'coins':
        return { top: 95, right: 40, transform: [{ translateY: arrowBounce }] };
      case 'nav-left':
        return { bottom: 135, left: 22, transform: [{ rotate: '180deg' }, { translateY: arrowBounce }] };
      default:
        return null;
    }
  };

  const arrowStyle = getArrowStyle();

  // For steps that require clicking buttons, we use pointerEvents="none" on backdrop
  const requiresInteraction = currentStep?.requireTool || currentStep?.requireAction;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} pointerEvents="box-none">
      {/* Semi-transparent backdrop - passes through touches when interaction required */}
      <View 
        style={styles.backdrop} 
        pointerEvents={requiresInteraction ? "none" : "auto"}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill}
          activeOpacity={1} 
          onPress={handleTap}
          disabled={!!requiresInteraction}
        />
      </View>

      {/* Highlight border overlay - always passes through touches */}
      {highlightStyle && (
        <Animated.View 
          style={[
            styles.highlightCutout, 
            highlightStyle,
            { transform: [{ scale: pulseAnim }] }
          ]} 
          pointerEvents="none"
        />
      )}

      {/* Pointing arrow */}
      {arrowStyle && (
        <Animated.Text style={[styles.arrow, arrowStyle]}>
          👆
        </Animated.Text>
      )}

      {/* Tooltip card */}
      <View style={[styles.tooltipContainer, getTooltipStyle()]} pointerEvents="box-none">
        <View style={styles.tooltipCard}>
          {/* Progress dots */}
          <View style={styles.progressContainer}>
            {INTERACTIVE_TUTORIAL_STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStepIndex && styles.progressDotActive,
                  index < currentStepIndex && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>

          {/* Icon */}
          {currentStep.icon && (
            <Text style={styles.icon}>{currentStep.icon}</Text>
          )}

          {/* Title */}
          <Text style={styles.title}>{currentStep.title}</Text>

          {/* Message */}
          <Text style={styles.message}>{currentStep.message}</Text>

          {/* Action hint */}
          {currentStep.requireTool && (
            <View style={styles.actionHint}>
              <Text style={styles.actionHintText}>
                👇 Tap the button below to continue
              </Text>
            </View>
          )}

          {currentStep.requireAction && (
            <View style={styles.actionHint}>
              <Text style={styles.actionHintText}>
                ✨ Complete the action to continue
              </Text>
            </View>
          )}

          {/* Tap to continue hint */}
          {currentStep.tapToContinue && (
            <TouchableOpacity style={styles.continueButton} onPress={advanceStep}>
              <Text style={styles.continueButtonText}>
                {currentStep.type === 'complete' ? 'Start Playing! 🚀' : 'Continue →'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Skip button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip Tutorial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  highlightCutout: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#fbbf24',
    borderRadius: 12,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  arrow: {
    position: 'absolute',
    fontSize: 32,
    zIndex: 10000,
  },
  tooltipContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  tooltipCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#fbbf24',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#fbbf24',
    width: 20,
  },
  progressDotCompleted: {
    backgroundColor: '#22c55e',
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  actionHint: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  actionHintText: {
    color: '#fbbf24',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
});
