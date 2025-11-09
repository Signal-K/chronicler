import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabType = 'seeds' | 'crops' | 'tools' | 'expansions';

interface InventoryTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function InventoryTabs({ activeTab, onTabChange }: InventoryTabsProps) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'seeds' && styles.tabActive]}
        onPress={() => onTabChange('seeds')}
      >
        <Text style={[styles.tabText, activeTab === 'seeds' && styles.tabTextActive]}>🌱 Seeds</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'crops' && styles.tabActive]}
        onPress={() => onTabChange('crops')}
      >
        <Text style={[styles.tabText, activeTab === 'crops' && styles.tabTextActive]}>🌾 Crops</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'tools' && styles.tabActive]}
        onPress={() => onTabChange('tools')}
      >
        <Text style={[styles.tabText, activeTab === 'tools' && styles.tabTextActive]}>🔧 Tools</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'expansions' && styles.tabActive]}
        onPress={() => onTabChange('expansions')}
      >
        <Text style={[styles.tabText, activeTab === 'expansions' && styles.tabTextActive]}>📦 Expansions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FDE68A',
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FBBF24',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    opacity: 0.6,
  },
  tabTextActive: {
    opacity: 1,
  },
});
