import { CROP_CONFIGS } from "@/lib/cropConfig";
import { CROP_PRICES, InventoryProps } from "@/types/inventory";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CoinsDisplay } from "./CoinsDisplay";
import { CropsTab } from "./CropsTab";
import { ExpansionsTab, ToolsTab } from "./InventoryExtras";
import { InventoryTabs } from "./InventoryTabs";
import { SeedsTab } from "./SeedsTab";

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
        <CoinsDisplay coins={inventory.coins} />
        
        <InventoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'seeds' && <SeedsTab seeds={inventory.seeds} />}
        {activeTab === 'crops' && <CropsTab harvested={inventory.harvested} onSell={handleSell} />}
        {activeTab === 'tools' && <ToolsTab />}
        {activeTab === 'expansions' && <ExpansionsTab />}
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