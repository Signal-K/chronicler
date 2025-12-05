import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Almanac } from '../../app/screens/almanac';
import { Shop } from '../../app/screens/shop';
import type { InventoryData } from '../../hooks/useGameState';
import { Inventory } from '../inventory/inventory';

interface SiloModalProps {
  visible: boolean;
  onClose: () => void;
  inventory: InventoryData;
  setInventory: (inventory: InventoryData) => void;
  onSellCrop?: (cropType: string, count: number, coinsEarned: number, emoji: string) => void;
}

type TabType = 'inventory' | 'almanac' | 'shop';

export function SiloModal({
  visible,
  onClose,
  inventory,
  setInventory,
  onSellCrop = () => {},
}: SiloModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header with tabs */}
          <View style={styles.header}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'inventory' && styles.activeTab]}
                onPress={() => setActiveTab('inventory')}
              >
                <Text style={[styles.tabText, activeTab === 'inventory' && styles.activeTabText]}>
                  📦 Inventory
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'almanac' && styles.activeTab]}
                onPress={() => setActiveTab('almanac')}
              >
                <Text style={[styles.tabText, activeTab === 'almanac' && styles.activeTabText]}>
                  📖 Almanac
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.tab, activeTab === 'shop' && styles.activeTab]}
                onPress={() => setActiveTab('shop')}
              >
                <Text style={[styles.tabText, activeTab === 'shop' && styles.activeTabText]}>
                  🛍️ Shop
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {activeTab === 'inventory' && (
              <Inventory
                inventory={inventory}
                setInventory={setInventory}
                onSellCrop={onSellCrop}
                onClose={onClose}
                isExpanded={false}
                onToggleExpand={() => {}}
              />
            )}
            
            {activeTab === 'almanac' && (
              <Almanac
                onClose={onClose}
                isExpanded={false}
                onToggleExpand={() => {}}
              />
            )}
            
            {activeTab === 'shop' && (
              <Shop
                inventory={inventory}
                setInventory={setInventory}
                onClose={onClose}
                isExpanded={false}
                onToggleExpand={() => {}}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 600,
    height: '80%',
    backgroundColor: '#fef3c7',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fde68a',
    borderBottomWidth: 2,
    borderBottomColor: '#d97706',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#d97706',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78350f',
    opacity: 0.6,
  },
  activeTabText: {
    opacity: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});
