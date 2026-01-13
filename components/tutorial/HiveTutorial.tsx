import React, { useCallback, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface HiveTutorialStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: 'hive' | 'bottles' | 'orders' | 'quota';
  tips?: string[];
}

const HIVE_TUTORIAL_STEPS: HiveTutorialStep[] = [
  {
    id: 'hive-welcome',
    title: 'Welcome to Your Hives! 🏺',
    description: 'This is where the magic happens! Your beehives produce honey from the crops you harvest.\n\nLet\'s learn about the bottling process and how to sell honey to fulfill orders!',
    icon: '🐝',
    tips: [
      'More bees = faster honey production',
      'Different crops create different honey types',
    ],
  },
  {
    id: 'honey-production',
    title: 'Honey Production',
    description: 'When you harvest crops on your farm, your bees collect nectar and produce honey!\n\n🍯 Each hive shows bottles ready: "🍯 X/15"\n\n☀️ Active hours: 8AM-4PM & 8PM-4AM\n\nThe type of honey depends on which crops you harvest most!',
    icon: '🍯',
    highlight: 'hive',
    tips: [
      'Lavender creates specialty honey (premium!)',
      'Sunflowers produce amber honey',
      'Mix crops for wildflower blends',
    ],
  },
  {
    id: 'bottling-process',
    title: 'Bottling Your Honey',
    description: 'When your hive has honey ready, tap "Collect Honey" to bottle it!\n\n📦 You\'ll need glass bottles from your inventory\n🍯 Each collection gives you bottled honey\n\nBottled honey goes into your inventory and can be sold to fulfill orders!',
    icon: '🫙',
    highlight: 'bottles',
    tips: [
      'Buy glass bottles from the shop',
      'Higher quality crops = better honey',
      'Keep an eye on your bottle supply!',
    ],
  },
  {
    id: 'daily-orders',
    title: 'Daily Honey Orders 📋',
    description: 'Every day, characters from the village request specific types of honey!\n\n👨‍🌾 Characters request X bottles of Y honey type\n🪙 Fulfill orders for coins AND experience\n⭐ XP helps you level up faster!\n\nCheck the Orders Panel below your hives.',
    icon: '📋',
    highlight: 'orders',
    tips: [
      'At least one order matches your likely production',
      'Orders refresh daily at midnight',
      'Prioritize orders that match your stock!',
    ],
  },
  {
    id: 'quota-system',
    title: 'Daily Quota System',
    description: 'Here\'s the catch: You can only sell a limited amount of each honey type at full price!\n\n✅ First 2 orders of each type: FULL reward\n⚠️ After quota: 50% reduced reward\n\nThis encourages growing diverse crops and strategic selling!',
    icon: '📊',
    highlight: 'quota',
    tips: [
      'Grow different crops for honey variety',
      'Fulfill high-value orders first',
      'Specialty honey sells for the most!',
    ],
  },
  {
    id: 'hive-complete',
    title: 'You\'re Ready! 🎉',
    description: 'Now you know how to:\n\n🐝 Produce honey from harvests\n🍯 Bottle and collect your honey\n📋 Fulfill daily orders for rewards\n📊 Manage your quota wisely\n\nTime to start your honey business!',
    icon: '🌟',
    tips: [
      'Specialty honey from lavender is most valuable',
      'Keep diverse crops for flexible orders',
      'Level up to unlock more hives!',
    ],
  },
];

interface HiveTutorialProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function HiveTutorial({
  visible,
  onClose,
  onComplete,
}: HiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      setCurrentStep(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  const handleNext = useCallback(() => {
    if (currentStep < HIVE_TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete?.();
      onClose();
    }
  }, [currentStep, onComplete, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!visible) return null;

  const step = HIVE_TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === HIVE_TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.container}>
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            {HIVE_TUTORIAL_STEPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep && styles.progressDotActive,
                  index < currentStep && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>

          {/* Skip button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip Tutorial</Text>
          </TouchableOpacity>

          {/* Content Card */}
          <View style={styles.card}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{step.icon}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{step.title}</Text>

            {/* Description */}
            <ScrollView style={styles.descriptionScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.description}>{step.description}</Text>

              {/* Tips */}
              {step.tips && step.tips.length > 0 && (
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsHeader}>💡 Pro Tips:</Text>
                  {step.tips.map((tip, index) => (
                    <View key={index} style={styles.tipRow}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Step indicator */}
            <Text style={styles.stepIndicator}>
              Step {currentStep + 1} of {HIVE_TUTORIAL_STEPS.length}
            </Text>

            {/* Navigation buttons */}
            <View style={styles.buttonContainer}>
              {!isFirstStep && (
                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={handlePrevious}
                >
                  <Text style={styles.buttonSecondaryText}>← Back</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, isFirstStep && styles.buttonFull]}
                onPress={handleNext}
              >
                <Text style={styles.buttonPrimaryText}>
                  {isLastStep ? "Let's Go! 🐝" : 'Next →'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

export { HIVE_TUTORIAL_STEPS };

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#FCD34D',
    transform: [{ scale: 1.2 }],
  },
  progressDotCompleted: {
    backgroundColor: '#86EFAC',
  },
  skipButton: {
    position: 'absolute',
    top: -10,
    right: 0,
    padding: 8,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FFFBF5',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.7,
    borderWidth: 3,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconContainer: {
    alignSelf: 'center',
    backgroundColor: '#FEF3C7',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FCD34D',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 16,
  },
  descriptionScroll: {
    maxHeight: SCREEN_HEIGHT * 0.3,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#57534E',
    lineHeight: 22,
    textAlign: 'center',
  },
  tipsContainer: {
    marginTop: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
  },
  tipsHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tipBullet: {
    color: '#F59E0B',
    fontSize: 14,
    marginRight: 8,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#78716C',
  },
  stepIndicator: {
    textAlign: 'center',
    fontSize: 12,
    color: '#A8A29E',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#F59E0B',
  },
  buttonSecondary: {
    backgroundColor: '#E5E7EB',
  },
  buttonFull: {
    flex: 1,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondaryText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
