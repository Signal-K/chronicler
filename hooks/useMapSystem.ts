import { MAP_CONFIGS, MAP_ORDER, type MapData, type MapType } from '../types/maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const MAPS_STORAGE_KEY = '@bee_garden_unlocked_maps';
const ACTIVE_MAP_STORAGE_KEY = '@bee_garden_active_map';

export function useMapSystem() {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [activeMapId, setActiveMapId] = useState<MapType>('default');
  const [isLoading, setIsLoading] = useState(true);

  const initializeMaps = async () => {
    try {
        const unlockedMapIds = await loadUnlockedMaps();
        const activeMapIdFromStorage = await loadActiveMap();

        const mapData: MapData[] = MAP_ORDER.map(mapId => ({
            ...MAP_CONFIGS[mapId],
            unlocked: mapId === 'default' || unlockedMapIds.includes(mapId),
        }));

        setMaps(mapData);
        setActiveMapId(activeMapIdFromStorage);
    } catch (error: any) {
        setMaps([{ ...MAP_CONFIGS.default, unlocked: true}]);
        setActiveMapId('default');
        setIsLoading(false);
    };
  };

  const loadUnlockedMaps = async (): Promise<MapType[]> => {
    try {
        const data = await AsyncStorage.getItem(MAPS_STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data) as MapType[];
            return parsed;
        };
        
        return [];
    } catch (error: any) {
        return [];
    };
  };

  const loadActiveMap = async (): Promise<MapType> => {
    try {
        const data = await AsyncStorage.getItem(ACTIVE_MAP_STORAGE_KEY);
        if (data) {
            return data as MapType;
        };

        return 'default';
    } catch (error) {
        return 'default';
    };
  };

  const saveUnlockedMaps = async (unlockedMapIds: MapType[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(MAPS_STORAGE_KEY, JSON.stringify(unlockedMapIds));
    } catch (error) {
        console.error()
    };
  };

  const saveActiveMap = async (mapId: MapType): Promise<void> => {
    try {
        await AsyncStorage.setItem(ACTIVE_MAP_STORAGE_KEY, mapId);
    } catch (error) {
        console.error();
    };
  };

  const unlockMap = async (mapId: MapType, currentCoins: number): Promise<boolean> => {
    const map = maps.find(m => m.id === mapId);
    if (!map) {
        return false;
    };

    if (map.unlocked) {
        return false;
    };

    if (currentCoins < map.unlockCost) {
        return false;
    };

    const updatedMaps = maps.map(m =>
        m.id === mapId ? { ...m, unlocked: true } : m
    );

    setMaps(updatedMaps);

    const unlockedIds = updatedMaps
        .filter(m => m.unlocked && m.id !== 'default')
        .map(m => m.id);

    await saveUnlockedMaps(unlockedIds);
    return true;
  };

  const setActiveMap = async (mapId: MapType): Promise<void> => {
    const map = maps.find(m => m.id === mapId);
    if (!map) {
        return;
    };

    if (!map.unlocked) {
        return;
    };

    setActiveMapId(mapId);
    await saveActiveMap(mapId);
  };

  const getMap = (mapId: MapType): MapData | undefined => {
    return maps.find(m => m.id === mapId);
  };

  /**
   * Get all unlocked maps
   */
  const getUnlockedMaps = (): MapData[] => {
    return maps.filter(m => m.unlocked);
  };

  /**
   * Get the currently active map
   */
  const getActiveMap = (): MapData | undefined => {
    return maps.find(m => m.id === activeMapId);
  };

  /**
   * Check if a specific map is unlocked
   */
  const isMapUnlocked = (mapId: MapType): boolean => {
    return maps.find(m => m.id === mapId)?.unlocked || false;
  };

  /**
   * Get all maps in display order
   */
  const getAllMaps = (): MapData[] => {
    return MAP_ORDER.map(mapId => {
      const mapData = maps.find(m => m.id === mapId);
      return mapData || {
        ...MAP_CONFIGS[mapId],
        unlocked: false,
      };
    });
  };

  // Initialize on mount
  useEffect(() => {
    initializeMaps();
  }, []);

  return {
    maps,
    activeMapId,
    isLoading,
    unlockMap,
    setActiveMap,
    getMap,
    getUnlockedMaps,
    getActiveMap,
    isMapUnlocked,
    getAllMaps,
  };
}
