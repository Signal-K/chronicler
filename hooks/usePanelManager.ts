import { useState } from 'react';
import { Animated, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type PanelType = 'almanac' | 'inventory' | 'shop' | 'settings' | null;

export function usePanelManager() {
  const [showAlmanac, setShowAlmanac] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [panelHeight] = useState(new Animated.Value(0));

  const openPanel = (panelType: PanelType) => {
    if (!panelType) return;
    
    // Close all panels first
    setShowAlmanac(false);
    setShowInventory(false);
    setShowShop(false);
    setShowSettings(false);
    
    // Open the selected panel with animation
    setTimeout(() => {
      switch (panelType) {
        case 'almanac':
          setShowAlmanac(true);
          break;
        case 'inventory':
          setShowInventory(true);
          break;
        case 'shop':
          setShowShop(true);
          break;
        case 'settings':
          setShowSettings(true);
          break;
      }
      
      Animated.spring(panelHeight, {
        toValue: SCREEN_HEIGHT * 0.5,
        useNativeDriver: false,
        tension: 50,
        friction: 8,
      }).start();
    }, 50);
  };

  const closePanel = () => {
    Animated.timing(panelHeight, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setShowAlmanac(false);
      setShowInventory(false);
      setShowShop(false);
      setShowSettings(false);
    });
  };

  const isAnyPanelOpen = showAlmanac || showInventory || showShop || showSettings;

  return {
    showAlmanac,
    showInventory,
    showShop,
    showSettings,
    panelHeight,
    openPanel,
    closePanel,
    isAnyPanelOpen,
  };
}
