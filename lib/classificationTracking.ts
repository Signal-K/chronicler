import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DailyClassificationData {
  date: string; // YYYY-MM-DD format
  totalCount: number; // Total classifications made today
  maxDailyClassifications: number; // Based on min(hive_count, 2)
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

export async function getDailyClassificationData(hiveCount: number = 1): Promise<DailyClassificationData> {
    try {
        const stored = await AsyncStorage.getItem(CLASSIFICATION_STORAGE_KEY);
        const data: DailyClassificationData = stored ? JSON.parse(stored) : null;
        const today = getTodayDateString();

        if (!data || data.date !== today) {
            return {
                date: today,
                totalCount: 0,
                maxDailyClassifications: Math.min(hiveCount, 2),
            };
        };

        // Update max classifications based on current hive count
        data.maxDailyClassifications = Math.min(hiveCount, 2);
        return data;
    } catch (error: any) {
        console.error("Error: loading daily classification data: ", error);
        return {
            date: getTodayDateString(),
            totalCount: 0,
            maxDailyClassifications: Math.min(hiveCount, 2),
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

export async function canMakeClassification(hiveCount: number): Promise<boolean> {
    const data = await getDailyClassificationData(hiveCount);
    return data.totalCount < data.maxDailyClassifications;
};

export async function recordClassification(hiveCount: number, classificationType: string): Promise<boolean> {
    try {
        const data = await getDailyClassificationData(hiveCount);
        if (data.totalCount >= data.maxDailyClassifications) {
            console.log(`📊 Daily classification limit reached: ${data.totalCount}/${data.maxDailyClassifications}`);
            return false; // Already reached daily limit
        }

        // Increment total classification count
        data.totalCount += 1;
        
        // Save updated data
        await saveDailyClassificationData(data);
        
        // Also save to user's classification history (for almanac)
        await saveClassificationToHistory(classificationType);
        
        console.log(`📊 Classification recorded: ${data.totalCount}/${data.maxDailyClassifications} for today`);
        return true;
    } catch (error) {
        console.error('Error recording classification:', error);
        return false;
    }
}

/**
 * Save classification to user's history for almanac tracking
 */
async function saveClassificationToHistory(classificationType: string): Promise<void> {
    try {
        const HISTORY_KEY = 'user_classifications_history';
        const stored = await AsyncStorage.getItem(HISTORY_KEY);
        const history: {
            id: string;
            classificationType: string;
            timestamp: number;
            date: string;
        }[] = stored ? JSON.parse(stored) : [];
        
        history.push({
            id: `classification_${Date.now()}`,
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