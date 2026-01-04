import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DailyClassificationData {
  date: string; // YYYY-MM-DD format
  classificationsByHive: { [hiveId: string]: number };
  maxClassificationsPerHive: number;
};

const CLASSIFICATION_STORAGE_KEY = 'daily_classifications';

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const today = new Date();
  return today.getFullYear() + '-' + 
    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
    String(today.getDate()).padStart(2, '0');
};

export async function getDailyClassificationData(): Promise<DailyClassificationData> {
    try {
        const stored = await AsyncStorage.getItem(CLASSIFICATION_STORAGE_KEY);
        const data: DailyClassificationData = stored ? JSON.parse(stored) : null;
        const today = getTodayDateString();

        if (!data || data.date !== today) {
            return {
                date: today,
                classificationsByHive: {},
                maxClassificationsPerHive: 1,
            };
        };

        return data;
    } catch (error: any) {
        console.error("Error: loading daily classification data: ", error);
        return {
            date: getTodayDateString(),
            classificationsByHive: {},
            maxClassificationsPerHive: 1,
        };
    };
};

export async function saveDailyClassificationData(data: DailyClassificationData): Promise<void> {
    try {
        await AsyncStorage.setItem(CLASSIFICATION_STORAGE_KEY, JSON.stringify(data));
    } catch (error: any) {
        console.error("Error setting daily classification data: ", error);
    };
};

export async function canClassifyHive(hiveId: string): Promise<boolean> {
    const data = await getDailyClassificationData();
    const currentCount = data.classificationsByHive[hiveId] || 0;
    return currentCount < data.maxClassificationsPerHive;
};

export async function recordClassification(hiveId: string, classificationType: string): Promise<boolean> {
    try {
        const data = await getDailyClassificationData();
        const currentCount = data.classificationsByHive[hiveId] || 0;
        if (currentCount >= data.maxClassificationsPerHive) {
            return false; // Already reached daily limit
        }

        // Increment classification count
        data.classificationsByHive[hiveId] = currentCount + 1;
        
        // Save updated data
        await saveDailyClassificationData(data);
        
        // Also save to user's classification history (for almanac)
        await saveClassificationToHistory(hiveId, classificationType);
        
        return true;
    } catch (error) {
        console.error('Error recording classification:', error);
        return false;
    }
}

/**
 * Save classification to user's history for almanac tracking
 */
async function saveClassificationToHistory(hiveId: string, classificationType: string): Promise<void> {
    try {
        const HISTORY_KEY = 'user_classifications_history';
        const stored = await AsyncStorage.getItem(HISTORY_KEY);
        const history: {
            id: string;
            hiveId: string;
            classificationType: string;
            timestamp: number;
            date: string;
        }[] = stored ? JSON.parse(stored) : [];
        
        history.push({
            id: `${hiveId}_${Date.now()}`,
            hiveId,
            classificationType,
            timestamp: Date.now(),
            date: getTodayDateString(),
        });
        
        // Keep only last 1000 classifications to prevent storage bloat
        if (history.length > 1000) {
            history.splice(0, history.length - 1000);
        }
        
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error saving classification to history:', error);
    }
}

/**
 * Get classification history for almanac
 */
export async function getClassificationHistory(): Promise<{
    id: string;
    hiveId: string;
    classificationType: string;
    timestamp: number;
    date: string;
}[]> {
    try {
        const HISTORY_KEY = 'user_classifications_history';
        const stored = await AsyncStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading classification history:', error);
        return [];
    }
}