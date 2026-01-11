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
  requireAction?: 'till-plot' | 'plant-seed' | 'water-plant' | 'harvest-crop' | 'open-shop' | 'view-hives';
  /** Position of the tooltip */
  tooltipPosition?: 'top' | 'bottom' | 'center';
  /** Allow user to tap anywhere to continue (for info steps) */
  tapToContinue?: boolean;
  /** Auto-advance after delay (ms) */
  autoAdvanceDelay?: number;
}

// Interactive tutorial steps that guide actual gameplay
export const INTERACTIVE_TUTORIAL_STEPS: InteractiveTutorialStep[] = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Welcome to Bee Garden! 🐝',
    message: 'Let\'s learn how to grow your garden and raise bees together. This tutorial will guide you through the basics step by step.',
    icon: '🌻',
    tooltipPosition: 'center',
    tapToContinue: true,
  },
  {
    id: 'header-intro',
    type: 'highlight-header',
    title: 'Your Resources',
    message: 'This is your header bar. Here you can see your coins 🪙, water supply 💧, and current level. Tap the weather icon ☀️ to access settings.',
    highlightTarget: 'header',
    tooltipPosition: 'bottom',
    tapToContinue: true,
  },
  {
    id: 'toolbar-intro',
    type: 'highlight-toolbar',
    title: 'Your Tools',
    message: 'These are your farming tools! Use them to till soil, plant seeds, water crops, and harvest your produce.',
    highlightTarget: 'toolbar',
    tooltipPosition: 'top',
    tapToContinue: true,
  },
  {
    id: 'till-tool',
    type: 'click-tool',
    title: 'Step 1: Till the Soil 🚜',
    message: 'First, we need to prepare the soil. Tap the TILL button (🚜) in the toolbar below.',
    icon: '🚜',
    highlightTarget: 'till-button',
    requireTool: 'till',
    tooltipPosition: 'top',
  },
  {
    id: 'till-plot',
    type: 'click-plot',
    title: 'Now Till a Plot!',
    message: 'Great! Now tap on any empty plot in your garden to till it. This prepares the soil for planting.',
    icon: '🌱',
    highlightTarget: 'garden',
    requireAction: 'till-plot',
    tooltipPosition: 'center',
  },
  {
    id: 'plant-tool',
    type: 'click-tool',
    title: 'Step 2: Plant Seeds 🌱',
    message: 'Excellent work! Now let\'s plant something. Tap the PLANT button (🌱) to choose what to grow.',
    icon: '🌱',
    highlightTarget: 'plant-button',
    requireTool: 'plant',
    tooltipPosition: 'top',
  },
  {
    id: 'plant-seed',
    type: 'click-plot',
    title: 'Plant Your First Crop!',
    message: 'After selecting a seed type, tap on your tilled plot to plant it!',
    icon: '🌾',
    highlightTarget: 'garden',
    requireAction: 'plant-seed',
    tooltipPosition: 'center',
  },
  {
    id: 'water-tool',
    type: 'click-tool',
    title: 'Step 3: Water Your Plants 💧',
    message: 'Plants need water to grow! Tap the WATER button (💧) to water your crops.',
    icon: '💧',
    highlightTarget: 'water-button',
    requireTool: 'water',
    tooltipPosition: 'top',
  },
  {
    id: 'water-plant',
    type: 'click-plot',
    title: 'Water Your Crop!',
    message: 'Tap on your planted crop to give it water. Watch it grow!',
    icon: '🌧️',
    highlightTarget: 'garden',
    requireAction: 'water-plant',
    tooltipPosition: 'center',
  },
  {
    id: 'growth-info',
    type: 'info',
    title: 'Growing Takes Time ⏰',
    message: 'Your plants will grow over time. When they\'re fully grown, they\'ll be ready to harvest! The growth stages are: planted → growing → ready.',
    icon: '🌿',
    tooltipPosition: 'center',
    tapToContinue: true,
  },
  {
    id: 'harvest-intro',
    type: 'info',
    title: 'Harvesting Crops 🌾',
    message: 'When crops are ready, use the HARVEST button (🌾) and tap on them to collect your produce and earn coins!',
    icon: '🪙',
    highlightTarget: 'harvest-button',
    tooltipPosition: 'top',
    tapToContinue: true,
  },
  {
    id: 'hives-intro',
    type: 'info',
    title: 'Meet Your Bees! 🐝',
    message: 'Navigate left using the arrow to visit your Bee Hives. Bees help pollinate your garden and produce honey!',
    icon: '🐝',
    highlightTarget: 'nav-left',
    tooltipPosition: 'top',
    tapToContinue: true,
  },
  {
    id: 'shop-intro',
    type: 'info',
    title: 'The Shop 🛒',
    message: 'Tap on your coins 🪙 in the header to open the shop. Buy more seeds, upgrades, and expand your farm!',
    icon: '🛒',
    highlightTarget: 'coins',
    tooltipPosition: 'bottom',
    tapToContinue: true,
  },
  {
    id: 'complete',
    type: 'complete',
    title: 'You\'re Ready! 🎉',
    message: 'Congratulations! You know the basics. Now explore, grow your garden, build hives, and watch your bee colony thrive. Happy farming!',
    icon: '🌻',
    tooltipPosition: 'center',
    tapToContinue: true,
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

  const advanceStep = useCallback(() => {
    if (currentStepIndex < INTERACTIVE_TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Tutorial complete
      onComplete();
      onClose();
    }
  }, [currentStepIndex, onComplete, onClose]);

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
          disabled={requiresInteraction}
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

export default InteractiveTutorial;
