import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { capturePosthogEvent } from '../lib/posthog';
import type { SurveyDefinition } from '../components/surveys/FeedbackSurveyModal';

const SHOWN_KEY = 'feedback_surveys_shown_v1';
const ACTIONS_KEY = 'feedback_survey_actions_v1';

export type SurveyId =
  | 'farm_mechanics_quick'
  | 'classification_quick'
  | 'hive_orders_quick'
  | 'basics_nps';

export function isSurveyId(value: unknown): value is SurveyId {
  return value === 'farm_mechanics_quick'
    || value === 'classification_quick'
    || value === 'hive_orders_quick'
    || value === 'basics_nps';
}

interface FeedbackSurveyOptions {
  forcedSurveyId?: SurveyId | null;
  forceInDev?: boolean;
}

const SURVEYS: Record<SurveyId, SurveyDefinition> = {
  farm_mechanics_quick: {
    id: 'farm_mechanics_quick',
    title: 'Quick feedback: core farming',
    subtitle: '2 quick questions',
    questions: [
      { id: 'clarity', prompt: 'How clear were till/plant/water/harvest mechanics?', type: 'scale', min: 1, max: 5 },
      { id: 'pace', prompt: 'How does early-game farming pace feel?', type: 'choice', options: ['Too slow', 'About right', 'Too fast'] },
    ],
    commentPrompt: 'Anything confusing in farming?',
  },
  classification_quick: {
    id: 'classification_quick',
    title: 'Quick feedback: classification',
    subtitle: '2 quick questions',
    questions: [
      { id: 'confidence', prompt: 'How confident did you feel during classification?', type: 'scale', min: 1, max: 5 },
      { id: 'friction', prompt: 'What was the hardest part?', type: 'choice', options: ['Image clarity', 'Bee options', 'Flow speed', 'Nothing hard'] },
    ],
    commentPrompt: 'How can classification improve?',
  },
  hive_orders_quick: {
    id: 'hive_orders_quick',
    title: 'Quick feedback: hives & orders',
    subtitle: '2 quick questions',
    questions: [
      { id: 'hive_clarity', prompt: 'How understandable was bottling + order fulfillment?', type: 'scale', min: 1, max: 5 },
      { id: 'reward_feel', prompt: 'How rewarding did order completion feel?', type: 'choice', options: ['Not rewarding', 'Okay', 'Very rewarding'] },
    ],
    commentPrompt: 'What should change in hives/orders?',
  },
  basics_nps: {
    id: 'basics_nps',
    title: 'Overall basics feedback',
    subtitle: 'NPS-style survey',
    questions: [
      { id: 'nps', prompt: 'How likely are you to recommend this game to a friend?', type: 'scale', min: 0, max: 10 },
      { id: 'focus', prompt: 'Which area needs the most improvement now?', type: 'choice', options: ['Farming', 'Classification', 'Hives/Orders', 'Tutorial/Onboarding'] },
      { id: 'return_intent', prompt: 'How likely are you to come back tomorrow?', type: 'scale', min: 0, max: 10 },
    ],
    commentPrompt: 'What is the main reason for your score?',
  },
};

interface SurveyActionCounts {
  till: boolean;
  plant: boolean;
  water: boolean;
  harvest: boolean;
  bottleHoney: boolean;
  fulfillOrder: boolean;
  classification: boolean;
}

const EMPTY_COUNTS: SurveyActionCounts = {
  till: false,
  plant: false,
  water: false,
  harvest: false,
  bottleHoney: false,
  fulfillOrder: false,
  classification: false,
};

export function useFeedbackSurveys(hasCompletedBasics: boolean, options?: FeedbackSurveyOptions) {
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [counts, setCounts] = useState<SurveyActionCounts>(EMPTY_COUNTS);
  const [queue, setQueue] = useState<SurveyId[]>([]);
  const [activeSurveyId, setActiveSurveyId] = useState<SurveyId | null>(null);
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';
  const canForceInDev = options?.forceInDev ?? true;
  const forcedSurveyId = isDev && canForceInDev && options?.forcedSurveyId ? options.forcedSurveyId : null;

  useEffect(() => {
    const load = async () => {
      const [shownRaw, countsRaw] = await Promise.all([AsyncStorage.getItem(SHOWN_KEY), AsyncStorage.getItem(ACTIONS_KEY)]);
      if (shownRaw) setShown(JSON.parse(shownRaw));
      if (countsRaw) setCounts({ ...EMPTY_COUNTS, ...JSON.parse(countsRaw) });
    };
    load();
  }, []);

  const persist = useCallback(async (nextShown: Record<string, boolean>, nextCounts: SurveyActionCounts) => {
    await Promise.all([AsyncStorage.setItem(SHOWN_KEY, JSON.stringify(nextShown)), AsyncStorage.setItem(ACTIONS_KEY, JSON.stringify(nextCounts))]);
  }, []);

  const maybeQueue = useCallback((nextShown: Record<string, boolean>, nextCounts: SurveyActionCounts) => {
    const toAdd: SurveyId[] = [];
    const didBasics = nextCounts.till && nextCounts.plant && nextCounts.water && nextCounts.harvest;
    if (didBasics && !nextShown.farm_mechanics_quick) toAdd.push('farm_mechanics_quick');
    if (nextCounts.classification && !nextShown.classification_quick) toAdd.push('classification_quick');
    if (nextCounts.bottleHoney && nextCounts.fulfillOrder && !nextShown.hive_orders_quick) toAdd.push('hive_orders_quick');
    if (hasCompletedBasics && didBasics && !nextShown.basics_nps) toAdd.push('basics_nps');
    if (toAdd.length > 0) {
      setQueue((prev) => [...prev, ...toAdd.filter((id) => !prev.includes(id) && id !== activeSurveyId)]);
    }
  }, [activeSurveyId, hasCompletedBasics]);

  useEffect(() => {
    if (!activeSurveyId && queue.length > 0) {
      setActiveSurveyId(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [activeSurveyId, queue]);

  useEffect(() => {
    if (forcedSurveyId && isSurveyId(forcedSurveyId)) {
      setActiveSurveyId(forcedSurveyId);
    }
  }, [forcedSurveyId]);

  const recordAction = useCallback(async (action: string) => {
    const nextCounts: SurveyActionCounts = { ...counts };
    if (action === 'till-plot') nextCounts.till = true;
    if (action === 'plant-seed') nextCounts.plant = true;
    if (action === 'water-plant') nextCounts.water = true;
    if (action === 'harvest-crop') nextCounts.harvest = true;
    if (action === 'bottle-honey') nextCounts.bottleHoney = true;
    if (action === 'fulfill-order') nextCounts.fulfillOrder = true;
    if (action === 'classification-complete') nextCounts.classification = true;
    setCounts(nextCounts);
    await capturePosthogEvent('gameplay_mechanic_event', { action });
    maybeQueue(shown, nextCounts);
    await persist(shown, nextCounts);
  }, [counts, maybeQueue, persist, shown]);

  const submitSurvey = useCallback(async (answers: Record<string, string | number>, comment: string) => {
    if (!activeSurveyId) return;
    const isForcedPreview = !!forcedSurveyId;
    await capturePosthogEvent('feedback_survey_submitted', {
      survey_id: activeSurveyId,
      answers,
      comment,
      forced_preview: isForcedPreview,
    });
    if (!isForcedPreview) {
      const nextShown = { ...shown, [activeSurveyId]: true };
      setShown(nextShown);
      await persist(nextShown, counts);
    }
    setActiveSurveyId(null);
  }, [activeSurveyId, counts, forcedSurveyId, persist, shown]);

  const dismissSurvey = useCallback(() => {
    setActiveSurveyId(null);
  }, []);

  const activeSurvey = useMemo(() => (activeSurveyId ? SURVEYS[activeSurveyId] : null), [activeSurveyId]);

  return {
    activeSurvey,
    submitSurvey,
    dismissSurvey,
    recordAction,
  };
}
