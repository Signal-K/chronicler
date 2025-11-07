
import { CROP_CONFIGS } from "@/lib/cropConfig";
import { CROP_PRICES, InventoryProps } from "@/types/inventory";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Placeholder icons for React Native (replace with vector-icons or images as needed)
type IconProps = {
  name: string;
  size?: number;
  color?: string;
};
const Icon = ({ name, size = 24, color = "#000" }: IconProps) => (
  <Text style={{ fontSize: size, color }}>{name}</Text>
)

export function Inventory({ inventory, setInventory, onClose, isExpanded, onToggleExpand, onSellCrop }: InventoryProps) {
  const [activeTab, setActiveTab] = useState<'seeds' | 'crops' | 'tools' | 'expansions'>('seeds');

  const handleSell = (crop: string) => {
    if (inventory.harvested[crop] > 0) {
      const price = CROP_PRICES[crop] || 10;
      const config = CROP_CONFIGS[crop];
      
      setInventory((prev: any) => ({
        ...prev,
        coins: prev.coins + price,
        harvested: {
          ...prev.harvested,
          [crop]: prev.harvested[crop] - 1,
        },
      }));
      
      // Trigger sell animation if callback provided
      if (onSellCrop && config) {
        onSellCrop(crop, 1, price, config.emoji);
      }
    }
  }



  const content = (
    <View style={[styles.container, isExpanded && styles.expandedContainer]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onToggleExpand} style={styles.iconButton}>
            <Icon name={isExpanded ? "-" : "+"} size={20} color="#8a5c00" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <Icon name="X" size={22} color="#8a5c00" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardCoins}>
          <View style={styles.coinsRow}>
            <View style={styles.coinsIcon}>
              <View style={styles.coinOuter} />
              <View style={styles.coinInner} />
            </View>
            <View>
              <Text style={styles.coinsLabel}>Coins</Text>
              <Text style={styles.coinsValue}>{inventory.coins}</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'seeds' && styles.tabActive]}
            onPress={() => setActiveTab('seeds')}
          >
            <Text style={[styles.tabText, activeTab === 'seeds' && styles.tabTextActive]}>🌱 Seeds</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'crops' && styles.tabActive]}
            onPress={() => setActiveTab('crops')}
          >
            <Text style={[styles.tabText, activeTab === 'crops' && styles.tabTextActive]}>🌾 Crops</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'tools' && styles.tabActive]}
            onPress={() => setActiveTab('tools')}
          >
            <Text style={[styles.tabText, activeTab === 'tools' && styles.tabTextActive]}>🔧 Tools</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'expansions' && styles.tabActive]}
            onPress={() => setActiveTab('expansions')}
          >
            <Text style={[styles.tabText, activeTab === 'expansions' && styles.tabTextActive]}>📦 Expansions</Text>
          </TouchableOpacity>
        </View>

        {/* Seeds Tab */}
        {activeTab === 'seeds' && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Icon name="🌱" size={18} />
              <Text style={styles.sectionTitle}>Seeds</Text>
            </View>
            {Object.entries(inventory.seeds).map(([seed, count]) => {
              const config = CROP_CONFIGS[seed];
              return (
                <View key={seed} style={styles.cardSeed}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemEmoji}>{config?.emoji || '🌱'}</Text>
                    <View>
                      <Text style={styles.seedName}>{config?.name || seed} Seeds</Text>
                      <Text style={styles.itemCategory}>{config?.category || 'seed'}</Text>
                    </View>
                  </View>
                  <Text style={styles.seedCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Crops Tab */}
        {activeTab === 'crops' && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Icon name="🌾" size={18} />
              <Text style={styles.sectionTitle}>Harvested Crops</Text>
            </View>
            {Object.entries(inventory.harvested).map(([crop, count]) => {
              const config = CROP_CONFIGS[crop];
              return (
                <View key={crop} style={styles.cardCrop}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemEmoji}>{config?.emoji || '🌾'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cropName}>{config?.name || crop}</Text>
                      <Text style={styles.cropSell}>Sell for {config?.sellPrice || CROP_PRICES[crop] || 10} coins</Text>
                    </View>
                  </View>
                  <Text style={styles.cropCount}>{count}</Text>
                  <TouchableOpacity
                    onPress={() => handleSell(crop)}
                    disabled={count === 0}
                    style={[styles.sellButton, count === 0 && styles.sellButtonDisabled]}
                  >
                    <Icon name="💰" size={16} />
                    <Text style={styles.sellButtonText}>Sell</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Icon name="🔧" size={18} />
              <Text style={styles.sectionTitle}>Tools</Text>
            </View>
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No tools yet</Text>
              <Text style={styles.emptySubtext}>Visit the shop to buy tools</Text>
            </View>
          </View>
        )}

        {/* Expansions Tab */}
        {activeTab === 'expansions' && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Icon name="📦" size={18} />
              <Text style={styles.sectionTitle}>Expansions</Text>
            </View>
            <View style={styles.cardExpansion}>
              <Text style={styles.expansionTitle}>Garden Plots</Text>
              <Text style={styles.expansionCount}>6 plots available</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )

  if (isExpanded) {
    return (
      <Modal visible={true} animationType="slide" onRequestClose={onClose}>
        {content}
      </Modal>
    )
  }
  return content
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF3C7",
  },
  expandedContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FDE68A",
    borderBottomWidth: 2,
    borderBottomColor: "#92400E",
    padding: 16,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#92400E",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  cardCoins: {
    padding: 16,
    backgroundColor: "#FEF9C3",
    borderWidth: 2,
    borderColor: "#CA8A04",
    borderRadius: 12,
    marginBottom: 8,
  },
  coinsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinsIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  coinOuter: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FACC15",
    opacity: 0.7,
  },
  coinInner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FDE68A",
    opacity: 0.9,
    left: 6,
    top: 6,
  },
  coinsLabel: {
    fontSize: 14,
    color: "#B45309",
    fontWeight: "500",
  },
  coinsValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#92400E",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400E",
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FDE68A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#CA8A04',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    opacity: 0.6,
  },
  tabTextActive: {
    opacity: 1,
    fontWeight: 'bold',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemCategory: {
    fontSize: 11,
    color: '#78716c',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#a8a29e',
  },
  cardExpansion: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E7FF',
    borderRadius: 10,
    padding: 16,
  },
  expansionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4C1D95',
    marginBottom: 4,
  },
  expansionCount: {
    fontSize: 14,
    color: '#7C3AED',
  },
  cardSeed: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FDE68A",
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
  },
  seedName: {
    fontWeight: "500",
    color: "#92400E",
    textTransform: "capitalize",
  },
  seedCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#CA8A04",
  },
  cardCrop: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#BBF7D0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    gap: 8,
  },
  cropName: {
    fontWeight: "500",
    color: "#166534",
    textTransform: "capitalize",
  },
  cropSell: {
    fontSize: 13,
    color: "#22C55E",
  },
  cropCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22C55E",
    marginHorizontal: 8,
  },
  sellButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sellButtonDisabled: {
    backgroundColor: "#A7F3D0",
  },
  sellButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },
})