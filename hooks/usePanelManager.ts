import { useState } from 'react';
import { Animated, Dimensions, Platform, StatusBar } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calculate safe space to avoid status bar and dynamic island
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (StatusBar.currentHeight || 44) : (StatusBar.currentHeight || 24);
const DYNAMIC_ISLAND_BUFFER = Platform.OS === 'ios' ? 54 : 0; // Extra space for dynamic island on newer iPhones
const TOP_SAFE_SPACE = STATUS_BAR_HEIGHT + DYNAMIC_ISLAND_BUFFER;

export type PanelType = 'almanac' | 'inventory' | 'shop' | 'settings' | null;

export function usePanelManager() {
  const [showAlmanac, setShowAlmanac] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [panelHeight] = useState(new Animated.Value(0));
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate safe heights - leave space for status bar/dynamic island
  const normalHeight = SCREEN_HEIGHT * 0.5;
  const expandedHeight = SCREEN_HEIGHT - TOP_SAFE_SPACE;

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
      
      setIsExpanded(false);
      Animated.spring(panelHeight, {
        toValue: normalHeight,
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
      setIsExpanded(false);
    });
  };

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    Animated.spring(panelHeight, {
      toValue: newExpandedState ? expandedHeight : normalHeight,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
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
    isExpanded,
    toggleExpand,
  };
}
