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

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: 'header' | 'toolbar' | 'garden' | 'hives' | 'shop' | 'inventory' | 'navigation';
  tips?: string[];
}

interface TutorialOverlayProps {
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
  steps: TutorialStep[];
  initialStep?: number;
}

export function TutorialOverlay({
  visible,
  onClose,
  onComplete,
  steps,
  initialStep = 0,
}: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete?.();
      onClose();
    }
  }, [currentStep, steps.length, onComplete, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!visible || steps.length === 0) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
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
            {steps.map((_, index) => (
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
              Step {currentStep + 1} of {steps.length}
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
                  {isLastStep ? 'Start Playing! 🎮' : 'Next →'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
    marginBottom: 20,
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
    transform: [{ scale: 1.3 }],
  },
  progressDotCompleted: {
    backgroundColor: '#22C55E',
  },
  skipButton: {
    position: 'absolute',
    top: -50,
    right: 0,
    padding: 10,
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FEF3C7',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.7,
    borderWidth: 3,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 12,
  },
  descriptionScroll: {
    maxHeight: 200,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 24,
  },
  tipsContainer: {
    marginTop: 16,
    backgroundColor: '#FDE68A',
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
    fontSize: 14,
    color: '#92400E',
    marginRight: 8,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 13,
    color: '#78350F',
    flex: 1,
    lineHeight: 18,
  },
  stepIndicator: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonFull: {
    flex: 1,
  },
  buttonPrimary: {
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#D97706',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D97706',
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondaryText: {
    color: '#92400E',
    fontSize: 16,
    fontWeight: '600',
  },
});
