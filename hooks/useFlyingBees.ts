import React, { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import type { HiveData } from '../types/hive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FlyingBeeData {
  id: string;
  hiveId: string;
  startX: number;
  startY: number;
  spawnedAt: number;
};

interface PlotData {
    state: string;
    growthStage: number;
};

export function useFlyingBees(
  hives: HiveData[], 
  isDaytime: boolean, 
  debugMode: boolean = false,
  plots: PlotData[] = []
) {
    const [flyingBees, setFlyingBees] = useState<FlyingBeeData[]>([]);
    const spawnIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isDaytime && !debugMode) {
            if (spawnIntervalRef.current) {
                clearInterval(spawnIntervalRef.current);
                spawnIntervalRef.current = null;
            };

            setFlyingBees([]);
            return;
        };

        const spawnInterval = debugMode ? 2000 : 30000;
        const maxFlyingBees = 2;

        const trySpawnBee = () => {
            setFlyingBees(prev => {
                // Bees should always spawn during daytime, regardless of plants
                if (prev.length >= maxFlyingBees) {
                    return prev;
                };

                // Find hives with bees
                const availableHives = hives.filter(h => (h.beeCount || 0) > 0);
                
                if (availableHives.length === 0) {
                    return prev;
                };

                const hive = availableHives[Math.floor(Math.random() * availableHives.length)];
                const startX = Math.random() * SCREEN_WIDTH;
                const startY = SCREEN_HEIGHT * 0.3 + Math.random() * 100;
                const newBee: FlyingBeeData = {
                    id: `bee-${Date.now()}-${Math.random()}`,
                    hiveId: hive.id,
                    startX,
                    startY,
                    spawnedAt: Date.now(),
                };

                return [...prev, newBee];
            });
        };

        // Call once immediately
        trySpawnBee();
        
        spawnIntervalRef.current = window.setInterval(trySpawnBee, spawnInterval);

        return () => {
            if (spawnIntervalRef.current) {
                clearInterval(spawnIntervalRef.current);
            };
        };
    }, [isDaytime, debugMode, hives, plots]);

    // Bees despawn after two minutes
    useEffect(() => {
        const despawnInterval = setInterval(() => {
            const now = Date.now();
            setFlyingBees(prev => 
                prev.filter(bee => now - bee.spawnedAt < 120000)
            );
        }, 5000);

        return () => clearInterval(despawnInterval);
    }, []);

    const removeBee = React.useCallback((beeId: string) => {
        setFlyingBees(prev => prev.filter(bee => bee.id !== beeId));
    }, []);

    return {
        flyingBees,
        removeBee,
    };
};