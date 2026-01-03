import { useState, useEffect, useCallback } from 'react';
import { 
  recordClassification, 
  getDailyClassificationData,
  DailyClassificationData 
} from '../lib/classificationTracking';

export function useClassificationTracking(hives: { id: string }[]) {
  const [dailyData, setDailyData] = useState<DailyClassificationData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load daily classification data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getDailyClassificationData();
        setDailyData(data);
      } catch (error) {
        console.error('Error loading classification data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Check if a specific hive can be classified
  const canClassifyBee = useCallback(async (hiveId: string): Promise<boolean> => {
    if (!dailyData || loading) return false;
    
    const currentCount = dailyData.classificationsByHive[hiveId] || 0;
    return currentCount < dailyData.maxClassificationsPerHive;
  }, [dailyData, loading]);

  // Record a new classification
  const submitClassification = useCallback(async (
    hiveId: string, 
    classificationType: string
  ): Promise<boolean> => {
    try {
      const success = await recordClassification(hiveId, classificationType);
      
      if (success) {
        // Refresh daily data
        const updatedData = await getDailyClassificationData();
        setDailyData(updatedData);
      }
      
      return success;
    } catch (error) {
      console.error('Error submitting classification:', error);
      return false;
    }
  }, []);

  // Get synchronous check for classification availability (for UI)
  const canClassifyHiveSync = useCallback((hiveId: string): boolean => {
    if (!dailyData) return false;
    const currentCount = dailyData.classificationsByHive[hiveId] || 0;
    return currentCount < dailyData.maxClassificationsPerHive;
  }, [dailyData]);

  return {
    dailyData,
    loading,
    canClassifyBee,
    canClassifyHiveSync,
    submitClassification,
  };
}