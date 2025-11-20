import { useEffect, useRef, useState } from 'react';

export interface Bee {
  id: string;
  spawnTime: number;
  state: 'spawning' | 'hovering' | 'leaving' | 'despawned';
}

interface UseBeeManagerParams {
  pollinationFactor: number;
  hiveCount: number;
  isDaytime: boolean;
}

export function useBeeManager({
    pollinationFactor,
    hiveCount,
    isDaytime,
}: UseBeeManagerParams) {
    const [activeBees, setActiveBees] = useState<Bee[]>([]);
    const lastFactorRef = useRef(0);
    const updateHiveBeeCountRef = useRef<((count: number) => void) | null>(null);

    // Expose method to set hive bee count updater
    const setHiveBeeCountUpdater = (updater: (count: number) => void) => {
        updateHiveBeeCountRef.current = updater;
    };

    useEffect(() => {
        if (!isDaytime) {
            setActiveBees([]);
            return;
        };

        const maxBeesPerHive = 10;
        const beesPerFactor = Math.floor(pollinationFactor / 5);
        const targetBeeCount = Math.min(beesPerFactor, maxBeesPerHive * hiveCount);

        const currentMultiple = Math.floor(pollinationFactor / 5);
        const lastMultiple = Math.floor(lastFactorRef.current / 5);

        if (currentMultiple > lastMultiple && pollinationFactor >= 5) {
            const newBee: Bee = {
                id: `bee_${Date.now()}_${Math.random()}`,
                spawnTime: Date.now(),
                state: 'spawning',
            };

            console.log(`🐝 Spawning bee (Factor: ${pollinationFactor}, Total bees: ${targetBeeCount})`);

            setActiveBees(prev => {
                if (prev.length >= targetBeeCount) {
                    return prev;
                };

                const newBees = [...prev, newBee];
                // Update hive bee count
                if (updateHiveBeeCountRef.current) {
                    updateHiveBeeCountRef.current(newBees.length);
                }
                return newBees;
            });
        };

        lastFactorRef.current = pollinationFactor;
    }, [pollinationFactor, hiveCount, isDaytime]);

    const despawnBee = (beeId: string) => {
        console.log('✅ Despawning bee:', beeId);
        setActiveBees(prev => {
            const newBees = prev.filter(bee => bee.id !== beeId);
            // Update hive bee count
            if (updateHiveBeeCountRef.current) {
                updateHiveBeeCountRef.current(newBees.length);
            }
            return newBees;
        });
    };

    return {
        activeBees,
        despawnBee,
        setHiveBeeCountUpdater,
    };
};