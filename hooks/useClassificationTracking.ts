import { useState, useEffect, useCallback } from 'react';
import { 
  recordClassification, 
  getDailyClassificationData,
  canMakeClassification,
  DailyClassificationData 
} from '../lib/classificationTracking';

export function useClassificationTracking(hiveCount: number) {
  const [dailyData, setDailyData] = useState<DailyClassificationData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load daily classification data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getDailyClassificationData(hiveCount);
        setDailyData(data);
      } catch (error) {
        console.error('Error loading classification data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [hiveCount]);

  // Check if user can make more classifications today
  const canClassifyBee = useCallback(async (): Promise<boolean> => {
    if (!dailyData || loading) return false;
    return await canMakeClassification(hiveCount);
  }, [dailyData, loading, hiveCount]);

  // Synchronous version for immediate UI checks
  const canClassifyBeeSync = useCallback((): boolean => {
    if (!dailyData || loading) return false;
    return dailyData.totalCount < dailyData.maxDailyClassifications;
  }, [dailyData, loading]);

  // Record a new classification
  const submitClassification = useCallback(async (
    classificationType: string
  ): Promise<boolean> => {
    try {
      const success = await recordClassification(hiveCount, classificationType);
      
      if (success) {
        // Refresh daily data
        const updatedData = await getDailyClassificationData(hiveCount);
        setDailyData(updatedData);
      }
      
      return success;
    } catch (error) {
      console.error('Error submitting classification:', error);
      return false;
    }
  }, [hiveCount]);

  return {
    dailyData,
    loading,
    canClassifyBee,
    canClassifyBeeSync,
    submitClassification,
    // Helper functions
    remainingClassifications: dailyData ? dailyData.maxDailyClassifications - dailyData.totalCount : 0,
    maxClassifications: dailyData?.maxDailyClassifications || 0,
    todayCount: dailyData?.totalCount || 0,
  };
};