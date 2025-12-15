import { useCallback, useEffect, useState } from 'react';
import { getPlayerExperienceInfo, type PlayerExperienceInfo } from '../lib/experienceSystem';

export function usePlayerExperience() {
  const [experience, setExperience] = useState<PlayerExperienceInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshExperience = useCallback(async () => {
    try {
      const expInfo = await getPlayerExperienceInfo();
      setExperience(expInfo);
    } catch (error) {
      console.error('Error loading player experience:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshExperience();
  }, [refreshExperience]);

  return {
    experience,
    loading,
    refreshExperience,
  };
}