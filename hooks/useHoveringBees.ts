import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import type { HiveData } from '../types/hive';

const STORAGE_KEY = 'hive_bee_identities';

export interface BeeIdentity {
  id: string;
  name: string; // Unique identifier like "A1", "B2", etc.
  hiveId: string;
  assignedAt: number;
  personalityTrait?: string; // Future enhancement
}

export interface HoveringBeeData {
  identity: BeeIdentity;
  startedHoveringAt: number;
  currentX: number;
  currentY: number;
  targetCropIndex?: number;
}

interface PlotData {
  state: string;
  growthStage: number;
  cropType?: string;
}

export function useHoveringBees(
  hives: HiveData[],
  isDaytime: boolean,
  plots: PlotData[] = []
) {
  const [hoveringBees, setHoveringBees] = useState<HoveringBeeData[]>([]);
  const [beeIdentities, setBeeIdentities] = useState<BeeIdentity[]>([]);
  const spawnIntervalRef = useRef<number | null>(null);

  // Load bee identities from storage
  useEffect(() => {
    const loadBeeIdentities = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setBeeIdentities(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading bee identities:', error);
      }
    };
    loadBeeIdentities();
  }, []);

  // Save bee identities to storage whenever they change
  useEffect(() => {
    const saveBeeIdentities = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(beeIdentities));
      } catch (error) {
        console.error('Error saving bee identities:', error);
      }
    };
    if (beeIdentities.length > 0) {
      saveBeeIdentities();
    }
  }, [beeIdentities]);

  // Generate unique bee identities for each hive (only when hives change)
  useEffect(() => {
    const generateIdentities = () => {
      console.log('useHoveringBees: Generating identities for hives:', hives.map(h => ({ id: h.id, beeCount: h.beeCount })));
      
      const newIdentities: BeeIdentity[] = [];
      
      // Only consider first 2 hives for hovering bees
      const hivesToConsider = hives.slice(0, 2);
      
      hivesToConsider.forEach((hive, hiveIndex) => {
        const hiveLetter = String.fromCharCode(65 + hiveIndex); // A, B, C, etc.
        
        // Only show one bee per hive for hovering
        const beeNumber = 1;
        const beeName = `${hiveLetter}${beeNumber}`;
        
        // Check if this identity already exists
        const existingIdentity = beeIdentities.find(
          identity => identity.hiveId === hive.id && identity.name === beeName
        );
        
        if (existingIdentity) {
          newIdentities.push(existingIdentity);
        } else {
          newIdentities.push({
            id: `${hive.id}_${beeName}`,
            name: beeName,
            hiveId: hive.id,
            assignedAt: Date.now(),
          });
        }
      });

      console.log('useHoveringBees: Generated identities:', newIdentities);

      // Only update if identities actually changed
      if (JSON.stringify(newIdentities) !== JSON.stringify(beeIdentities)) {
        console.log('useHoveringBees: Updating bee identities');
        setBeeIdentities(newIdentities);
      }
    };

    if (hives.length > 0) {
      generateIdentities();
    }
  }, [hives]); // Remove beeIdentities from dependencies

  // Clear hovering bees when not daytime
  useEffect(() => {
    console.log('useHoveringBees: Daytime check -', { isDaytime, hivesCount: hives.length, plotsCount: plots.length });
    
    if (!isDaytime) {
      console.log('useHoveringBees: Not daytime, clearing bees');
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
      setHoveringBees([]);
      return;
    }

    // Find crops that are growing
    const growingCrops = plots
      .map((plot, index) => ({ plot, index }))
      .filter(({ plot }) => 
        (plot.state === 'planted' || plot.state === 'growing') && 
        plot.growthStage >= 1
      );

    console.log('useHoveringBees: Growing crops found -', growingCrops.length);

    if (growingCrops.length === 0) {
      console.log('useHoveringBees: No growing crops, clearing bees');
      setHoveringBees([]);
      return;
    }

    const spawnBees = () => {
      setHoveringBees(prev => {
        // Remove existing hovering bees to respawn
        const currentTime = Date.now();
        
        // Get available hives with bees (limit to first 2 hives)
        const availableHives = hives
          .filter(hive => hive.beeCount >= 0) // Changed from > 0 to >= 0 for testing
          .slice(0, 2); // Maximum 2 hives can have hovering bees
        
        console.log('useHoveringBees: Available hives with bees -', availableHives.map(h => ({ id: h.id, beeCount: h.beeCount })));
        
        if (availableHives.length === 0) {
          console.log('useHoveringBees: No hives with bees available');
          return [];
        }

        const newHoveringBees: HoveringBeeData[] = [];
        
        availableHives.forEach(hive => {
          // Get a random identity from this hive
          const hiveIdentities = beeIdentities.filter(identity => identity.hiveId === hive.id);
          
          console.log('useHoveringBees: Hive identities for', hive.id, ':', hiveIdentities);
          
          if (hiveIdentities.length > 0) {
            const randomIdentity = hiveIdentities[Math.floor(Math.random() * hiveIdentities.length)];
            const randomCrop = growingCrops[Math.floor(Math.random() * growingCrops.length)];
            
            // Calculate bee position based on crop grid layout (3x2 grid)
            const plotsPerRow = 3;
            const plotSize = 80; // Approximate size of each plot
            const plotSpacing = 20; // Spacing between plots
            const gridOffsetX = 40; // Offset from left edge
            const gridOffsetY = 120; // Offset from top edge
            
            const row = Math.floor(randomCrop.index / plotsPerRow);
            const col = randomCrop.index % plotsPerRow;
            
            const baseCropX = gridOffsetX + col * (plotSize + plotSpacing);
            const baseCropY = gridOffsetY + row * (plotSize + plotSpacing);
            
            // Add some randomness around the crop position
            const hoverRadius = 60;
            const randomAngle = Math.random() * 2 * Math.PI;
            const randomDistance = Math.random() * hoverRadius + 20;
            
            const beeX = baseCropX + Math.cos(randomAngle) * randomDistance;
            const beeY = baseCropY + Math.sin(randomAngle) * randomDistance;
            
            newHoveringBees.push({
              identity: randomIdentity,
              startedHoveringAt: currentTime,
              currentX: beeX,
              currentY: beeY,
              targetCropIndex: randomCrop.index,
            });
          }
        });

        return newHoveringBees;
      });
    };

    // Spawn bees immediately and then every 30 seconds
    spawnBees();
    spawnIntervalRef.current = window.setInterval(spawnBees, 30000);

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, [isDaytime, hives, beeIdentities, plots]);

  // Despawn bees after 2 minutes
  useEffect(() => {
    const despawnInterval = setInterval(() => {
      const now = Date.now();
      setHoveringBees(prev => 
        prev.filter(bee => now - bee.startedHoveringAt < 120000) // 2 minutes
      );
    }, 5000);

    return () => clearInterval(despawnInterval);
  }, []);

  return {
    hoveringBees,
    beeIdentities,
  };
}