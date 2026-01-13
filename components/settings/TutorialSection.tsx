import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    CLASSIFICATION_TUTORIAL,
    COMPLETE_TUTORIAL,
    EXPERIENCE_TUTORIAL,
    HIVES_TUTORIAL,
    QUICK_TIPS,
    SHOP_TUTORIAL,
    TutorialOverlay,
    WELCOME_TUTORIAL,
} from '../tutorial';

const TUTORIAL_COMPLETED_KEY = 'tutorial_completed';
const TUTORIAL_SEEN_KEY = 'tutorial_sections_seen';

interface TutorialSectionProps {
  isDark?: boolean;
  alwaysShowReset?: boolean;
  forceTutorial?: TutorialType | null;
  onClose?: () => void;
}

type TutorialType = 
  | 'complete' 
  | 'welcome' 
  | 'hives' 
  | 'shop' 
  | 'experience' 
  | 'classification'
  | 'quick-tips';

interface TutorialOption {
  id: TutorialType;
  title: string;
  icon: string;
  description: string;
}

const TUTORIAL_OPTIONS: TutorialOption[] = [
  {
    id: 'complete',
    title: 'Full Tutorial',
    icon: '📚',
    description: 'Complete beginner walkthrough',
  },
  {
    id: 'welcome',
    title: 'Getting Started',
    icon: '👋',
    description: 'Basic controls & navigation',
  },
  {
    id: 'hives',
    title: 'Hives & Honey',
    icon: '🍯',
    description: 'Beekeeping & honey production',
  },
  {
    id: 'shop',
    title: 'Shop & Inventory',
    icon: '🛍️',
    description: 'Buying & managing items',
  },
  {
    id: 'experience',
    title: 'XP & Leveling',
    icon: '⭐',
    description: 'Experience & progression',
  },
  {
    id: 'classification',
    title: 'Bee Classification',
    icon: '🔬',
    description: 'Classify bees for XP',
  },
  {
    id: 'quick-tips',
    title: 'Quick Tips',
    icon: '⚡',
    description: 'Fast reminders for pros',
  },
];

const TutorialSection: React.FC<TutorialSectionProps> = ({
  isDark = false,
  alwaysShowReset = false,
  forceTutorial = null,
  onClose,
}) => {
  const router = useRouter();
  const [activeTutorial, setActiveTutorial] = useState<TutorialType | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [showReset, setShowReset] = useState(false);

  // Load completed tutorials on mount
  useEffect(() => {
    const loadCompletedTutorials = async () => {
      try {
        const stored = await AsyncStorage.getItem(TUTORIAL_SEEN_KEY);
        if (stored) {
          setCompletedTutorials(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading tutorial progress:', error);
      }
    };
    loadCompletedTutorials();
  }, []);

  // If forceTutorial is set, open that tutorial overlay immediately
  useEffect(() => {
    if (forceTutorial) {
      setActiveTutorial(forceTutorial);
    }
  }, [forceTutorial]);

  // Mark tutorial as completed
  const markTutorialCompleted = useCallback(async (tutorialId: TutorialType) => {
    try {
      const updated = [...new Set([...completedTutorials, tutorialId])];
      setCompletedTutorials(updated);
      await AsyncStorage.setItem(TUTORIAL_SEEN_KEY, JSON.stringify(updated));
      
      // If complete tutorial is done, mark overall tutorial as completed
      if (tutorialId === 'complete') {
        await AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
      }
    } catch (error) {
      console.error('Error saving tutorial progress:', error);
    }
  }, [completedTutorials]);

  // Get tutorial steps based on type
  const getTutorialSteps = (type: TutorialType) => {
    switch (type) {
      case 'complete':
        return COMPLETE_TUTORIAL;
      case 'welcome':
        return WELCOME_TUTORIAL;
      case 'hives':
        return HIVES_TUTORIAL;
      case 'shop':
        return SHOP_TUTORIAL;
      case 'experience':
        return EXPERIENCE_TUTORIAL;
      case 'classification':
        return CLASSIFICATION_TUTORIAL;
      case 'quick-tips':
        return QUICK_TIPS;
      default:
        return COMPLETE_TUTORIAL;
    }
  };

  const handleTutorialSelect = (tutorialId: TutorialType) => {
    setActiveTutorial(tutorialId);
  };

  const handleTutorialClose = () => {
    setActiveTutorial(null);
  };

  const handleTutorialComplete = () => {
    if (activeTutorial) {
      markTutorialCompleted(activeTutorial);
    }
    setActiveTutorial(null);
  };

  const resetAllTutorials = async () => {
    try {
      await AsyncStorage.removeItem(TUTORIAL_SEEN_KEY);
      await AsyncStorage.removeItem(TUTORIAL_COMPLETED_KEY);
      setCompletedTutorials([]);
      setShowReset(true);
      setTimeout(() => setShowReset(false), 2000);
    } catch (error) {
      console.error('Error resetting tutorials:', error);
    }
  };

  const cardBg = isDark ? '#1a1a1a' : '#FEF3C7';
  const cardBorder = isDark ? '#333' : '#F59E0B';
  const textColor = isDark ? '#fff' : '#92400E';
  const subTextColor = isDark ? '#aaa' : '#78350F';
  const sectionTitleColor = isDark ? '#fff' : '#92400E';

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>
        📖 Tutorials & Help
      </Text>
      
      <View style={styles.tutorialsGrid}>
        {TUTORIAL_OPTIONS.map((option) => {
          const isCompleted = completedTutorials.includes(option.id);
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.tutorialCard,
                { backgroundColor: cardBg, borderColor: cardBorder },
                isCompleted && styles.tutorialCardCompleted,
              ]}
              onPress={() => handleTutorialSelect(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.tutorialIconContainer}>
                <Text style={styles.tutorialIcon}>{option.icon}</Text>
                {isCompleted && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tutorialTitle, { color: textColor }]}>
                {option.title}
              </Text>
              <Text style={[styles.tutorialDescription, { color: subTextColor }]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Always show reset button if alwaysShowReset is true, or if any completed */}
      {(alwaysShowReset || completedTutorials.length > 0) && (
        <TouchableOpacity
          style={[styles.resetButton, { borderColor: cardBorder }]}
          onPress={resetAllTutorials}
        >
          <Text style={[styles.resetButtonText, { color: subTextColor }]}> 
            🔄 Reset Tutorial Progress
          </Text>
        </TouchableOpacity>
      )}
      {showReset && (
        <Text style={{ color: '#22C55E', textAlign: 'center', marginTop: 6, fontWeight: 'bold' }}>
          Tutorial progress reset!
        </Text>
      )}

      {/* Full Help Guide Link */}
      <TouchableOpacity
        style={[styles.helpButton, { backgroundColor: cardBg, borderColor: cardBorder }]}
        onPress={() => router.push('/help')}
        activeOpacity={0.7}
      >
        <Text style={styles.helpIcon}>📖</Text>
        <View style={styles.helpTextContainer}>
          <Text style={[styles.helpTitle, { color: textColor }]}>Full Help Guide</Text>
          <Text style={[styles.helpDescription, { color: subTextColor }]}>
            Detailed FAQ & game documentation
          </Text>
        </View>
        <Text style={[styles.helpArrow, { color: textColor }]}>→</Text>
      </TouchableOpacity>

      {/* Tutorial Overlay */}
      {activeTutorial && (
        <TutorialOverlay
          visible={true}
          steps={getTutorialSteps(activeTutorial)}
          onClose={() => {
            handleTutorialClose();
            if (onClose) onClose();
          }}
          onComplete={handleTutorialComplete}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tutorialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tutorialCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tutorialCardCompleted: {
    opacity: 0.7,
  },
  tutorialIconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  tutorialIcon: {
    fontSize: 32,
  },
  completedBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#22C55E',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tutorialTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  tutorialDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
  },
  helpButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  helpIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  helpDescription: {
    fontSize: 12,
  },
  helpArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TutorialSection;


