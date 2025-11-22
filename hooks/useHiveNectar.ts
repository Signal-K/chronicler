import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import type { HiveData } from '../types/hive';

const STORAGE_KEY = 'hive_nectar_levels';
const NECTAR_ACCUMULATION_RATE = 1;
const MAX_NECTAR = 100;

interface HiveNectarState {
  [hiveId: string]: number;
};

export function useHiveNectar(hives: HiveData[], isDaytime: boolean) {
    const [nectarLevels, setNectarLevels] = useState<HiveNectarState>({});
    const [loaded, setLoaded] = useState<boolean>(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const loadNectarLevels = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setNectarLevels(JSON.parse(stored));
                };

                setLoaded(true);
            } catch (error: any) {
                console.error("Failed to load nectar levels: ", error);
                setLoaded(true);
            };
        };

        loadNectarLevels();
    }, []);

    // Save nectar levels to storage when they change
    useEffect(() => {
        if (!loaded) {
            return;
        };

        const saveNectarLevels = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nectarLevels));
            } catch (error: any) {
                console.error("Failed to save nectar levels: ", error);
            };
        };

        saveNectarLevels();
    }, [nectarLevels, loaded]);

    // Accumulate nectar during daytime
    useEffect(() => {
        if (!isDaytime || hives.length === 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            };

            return;
        };

        intervalRef.current = setInterval(() => {
            setNectarLevels(prev => {
                const updated = { ...prev };
                hives.forEach(hive => {
                    const currentNectar = updated[hive.id] || 0;
                    const beeCount = hive.beeCount || 0;
                    const nectarGain = beeCount * NECTAR_ACCUMULATION_RATE;
                    updated[hive.id] = Math.min(currentNectar + nectarGain, MAX_NECTAR);
                });

                return updated;
            });
        }, 60000); // Every minute

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            };
        };
    }, [isDaytime, hives]);

    // Add nectar bonus to all hives (from classification)
    const addNectarBonus = React.useCallback((bonusAmount: number) => {
        setNectarLevels(prev => {
            const updated = { ...prev };
            hives.forEach(hive => {
                const currentNectar = updated[hive.id] || 0;
                updated[hive.id] = Math.min(currentNectar + bonusAmount, MAX_NECTAR);
            });
            return updated;
        });
    }, [hives]);

    return {
        hiveNectarLevels: nectarLevels,
        addNectarBonus,
    };
}
