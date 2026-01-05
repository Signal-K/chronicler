import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { checkForBeeHatching } from "../lib/beeHatching";
import type {
    PollinationFactorData,
    PollinationFactorHookReturn,
} from "../types/pollinationFactor";

const DEFAULT_THRESHOLD = 10;
const STORAGE_KEY = "pollination_factor";

export function usePollinationFactor(): PollinationFactorHookReturn {
  const [pollinationFactor, setPollinationFactor] =
    useState<PollinationFactorData>({
      factor: 0,
      totalHarvests: 0,
      threshold: DEFAULT_THRESHOLD,
    });
  const [loaded, setLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Save to storage whenever pollination factor changes (only after initial load)
  useEffect(() => {
    if (
      loaded &&
      (pollinationFactor.totalHarvests > 0 || pollinationFactor.factor > 0)
    ) {
      saveToStorage(pollinationFactor);
    }
  }, [pollinationFactor, loaded]);

  const loadFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPollinationFactor(parsed);
        console.log("📂 Loaded pollination factor from storage:", parsed);
      }
    } catch (error) {
      console.error("Error loading pollination factor:", error);
    } finally {
      setLoaded(true);
    }
  };

  const saveToStorage = async (data: PollinationFactorData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving pollination factor:", error);
    }
  };

  const incrementFactor = async (amount: number = 1) => {
    const newFactor = pollinationFactor.factor + amount;
    const newTotalHarvests = pollinationFactor.totalHarvests + 1;

    setPollinationFactor((prev) => ({
      ...prev,
      factor: newFactor,
      totalHarvests: newTotalHarvests,
    }));

    // Award xp for pollination event
    try {
      const { awardPollinationXP } = await import("../lib/experienceSystem");
      const xpEvent = await awardPollinationXP();
      // Pollination XP awarded

      // Check for bee hatching AFTER updating score
      const stored = await AsyncStorage.getItem("hives");
      const hives = stored ? JSON.parse(stored) : [];
      const hatchResult = await checkForBeeHatching(newFactor, hives);

      if (hatchResult.shouldShowAlert) {
        if ((globalThis as any).showBeeHatchAlert && hatchResult.message) {
          (globalThis as any).showBeeHatchAlert(hatchResult.message);
        }

        // Add bees to appropriate hive
        if (hatchResult.newBeesHatched > 0 && hatchResult.targetHiveId) {
        // We need to trigger the addBees function - this requires access to the hive state
        // Since we can't directly access React state from here, we'll set a flag that
        // the UI can pick up via useEffect
        await AsyncStorage.setItem('pending_bee_addition', JSON.stringify({
          hiveId: hatchResult.targetHiveId,
          count: hatchResult.newBeesHatched,
          timestamp: Date.now()
        }));
        
        // Set a refresh signal for hive state to pick up the change
        await AsyncStorage.setItem('hivesRefreshSignal', Date.now().toString());
      }
      }
    } catch (error) {
      console.error("Failed to award pollination XP:", error);
    }
  };

  const canSpawnBees = pollinationFactor.factor >= pollinationFactor.threshold;

  return {
    pollinationFactor,
    incrementFactor,
    canSpawnBees,
  };
}
