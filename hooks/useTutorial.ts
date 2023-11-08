import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/auth';

const TUTORIAL_COMPLETED_KEY = 'tutorial_completed';
const TUTORIAL_SHOWN_KEY = 'tutorial_auto_shown';
const USER_TUTORIAL_SHOWN_KEY = 'user_tutorial_shown_';

export type TutorialAction = 
  | 'till-plot' 
  | 'plant-seed' 
  | 'water-plant' 
  | 'harvest-crop' 
  | 'open-shop' 
  | 'view-hives'
  | 'tap-hive'
  | 'bottle-honey'
  | 'fulfill-order';

export interface UseTutorialReturn {
  /** Whether the new user tutorial should be shown */
  shouldShowTutorial: boolean;
  /** Whether the user has completed the full tutorial */
  hasCompletedTutorial: boolean;
  /** Mark tutorial as shown (prevents auto-show) */
  markTutorialShown: () => Promise<void>;
  /** Mark tutorial as completed */
  markTutorialCompleted: () => Promise<void>;
  /** Reset tutorial state (for testing) */
  resetTutorialState: () => Promise<void>;
  /** Loading state */
  isLoading: boolean;
  /** Current tool selected (for tutorial tracking) */
  currentTool: string | null;
  /** Set current tool (called by toolbar) */
  setCurrentTool: (tool: string | null) => void;
  /** Last action performed (for tutorial tracking) */
  lastAction: TutorialAction | null;
  /** Report an action for tutorial progress */
  reportAction: (action: TutorialAction) => void;
}

export function useTutorial(): UseTutorialReturn {
  const { session, loading: authLoading } = useAuth();
  const [shouldShowTutorial, setShouldShowTutorial] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Tutorial action tracking
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<TutorialAction | null>(null);
  const actionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Report an action (clears after 2 seconds)
  const reportAction = useCallback((action: TutorialAction) => {
    console.log('📚 Tutorial action reported:', action);
    setLastAction(action);
    
    // Clear action after 2 seconds
    if (actionTimeoutRef.current) {
      clearTimeout(actionTimeoutRef.current);
    }
    actionTimeoutRef.current = setTimeout(() => {
      setLastAction(null);
    }, 2000);
  }, []);

  // Check tutorial state on mount and when auth changes
  useEffect(() => {
    const checkTutorialState = async () => {
      if (authLoading || !session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const userId = session.user.id;
        const [completed, globalShown, userShown] = await Promise.all([
          AsyncStorage.getItem(TUTORIAL_COMPLETED_KEY),
          AsyncStorage.getItem(TUTORIAL_SHOWN_KEY),
          AsyncStorage.getItem(USER_TUTORIAL_SHOWN_KEY + userId),
        ]);

        const isCompleted = completed === 'true';
        const wasGlobalShown = globalShown === 'true';
        const wasUserShown = userShown === 'true';

        setHasCompletedTutorial(isCompleted);

        // Show tutorial if:
        // 1. User hasn't seen tutorial before (per-user tracking) AND
        // 2. Tutorial hasn't been completed globally AND
        // 3. Not already globally shown (legacy check)
        if (!wasUserShown && !isCompleted && !wasGlobalShown) {
          console.log('📚 Showing tutorial for new user:', userId);
          setShouldShowTutorial(true);
        }
      } catch (error) {
        console.error('Error checking tutorial state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTutorialState();
  }, [session, authLoading]);

  const markTutorialShown = useCallback(async () => {
    if (!session?.user) return;
    
    try {
      const userId = session.user.id;
      await Promise.all([
        AsyncStorage.setItem(TUTORIAL_SHOWN_KEY, 'true'),
        AsyncStorage.setItem(USER_TUTORIAL_SHOWN_KEY + userId, 'true'),
      ]);
      setShouldShowTutorial(false);
    } catch (error) {
      console.error('Error marking tutorial as shown:', error);
    }
  }, [session]);

  const markTutorialCompleted = useCallback(async () => {
    if (!session?.user) return;
    
    try {
      const userId = session.user.id;
      await Promise.all([
        AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true'),
        AsyncStorage.setItem(TUTORIAL_SHOWN_KEY, 'true'),
        AsyncStorage.setItem(USER_TUTORIAL_SHOWN_KEY + userId, 'true'),
      ]);
      setHasCompletedTutorial(true);
      setShouldShowTutorial(false);
    } catch (error) {
      console.error('Error marking tutorial as completed:', error);
    }
  }, [session]);

  const resetTutorialState = useCallback(async () => {
    try {
      const userId = session?.user?.id;
      const keysToRemove = [
        TUTORIAL_COMPLETED_KEY,
        TUTORIAL_SHOWN_KEY,
      ];
      
      if (userId) {
        keysToRemove.push(USER_TUTORIAL_SHOWN_KEY + userId);
      }
      
      await Promise.all(keysToRemove.map(key => AsyncStorage.removeItem(key)));
      setHasCompletedTutorial(false);
      setShouldShowTutorial(true);
    } catch (error) {
      console.error('Error resetting tutorial state:', error);
    }
  }, [session]);

  return {
    shouldShowTutorial,
    hasCompletedTutorial,
    markTutorialShown,
    markTutorialCompleted,
    resetTutorialState,
    isLoading,
    currentTool,
    setCurrentTool,
    lastAction,
    reportAction,
  };
}
