
import { useRouter } from "expo-router";
import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CoinIcon, GlassBottleIcon, TomatoSeedIcon, BlueberrySeedIcon, LavenderSeedIcon, SunflowerSeedIcon } from "../../components/ui/ShopIcons";
import { useThemeColor } from '../../hooks/use-theme-color';
import type { InventoryData } from '../../hooks/useGameState';
import { CROP_CONFIGS } from '../../lib/cropConfig';

type ShopProps = {
  inventory: InventoryData;
  setInventory: (inventory: any) => void
  onClose: () => void
  isExpanded: boolean
  onToggleExpand: () => void
}

const shopItems = [
  { name: "Tomato Seeds", shortName: "Tomato Seeds", price: 10, type: "tomato", category: "seeds", icon: TomatoSeedIcon },
  { name: "Blueberry Seeds", shortName: "Blueberry Seeds", price: 12, type: "blueberry", category: "seeds", icon: BlueberrySeedIcon },
  { name: "Lavender Seeds", shortName: "Lavender Seeds", price: 15, type: "lavender", category: "seeds", icon: LavenderSeedIcon },
  { name: "Sunflower Seeds", shortName: "Sunflower Seeds", price: 18, type: "sunflower", category: "seeds", icon: SunflowerSeedIcon },
  { name: "Glass Bottle", shortName: "Bottle", price: 20, type: "glass_bottle", category: "items", icon: GlassBottleIcon, description: "Holds 10 nectar" },
]

export function Shop({ inventory, setInventory, onClose, isExpanded, onToggleExpand }: ShopProps) {
  const router = useRouter()
  const bg = useThemeColor({}, 'background');
  const headerBg = useThemeColor({ light: '#FDE68A', dark: '#1a1a1a' }, 'background');
  const headerBorder = useThemeColor({ light: '#92400E', dark: '#2b2b2b' }, 'icon');
  const headerText = useThemeColor({}, 'tint');
  const cardBg = useThemeColor({ light: '#FEF9C3', dark: '#0f1720' }, 'background');
  const cardBorder = useThemeColor({ light: '#F59E0B', dark: '#2b2b2b' }, 'icon');
  const itemText = useThemeColor({}, 'text');
  const priceBg = useThemeColor({ light: '#FEF3C7', dark: '#0f1720' }, 'background');
  const primaryBtnBg = useThemeColor({ light: '#92400E', dark: '#7c341f' }, 'icon');
  
  const handlePurchase = (item: (typeof shopItems)[0]) => {
    if (inventory.coins >= item.price) {
      const newInventory = {
        ...inventory,
        coins: inventory.coins - item.price,
      };
      
      if (item.category === 'seeds') {
        newInventory.seeds = {
          ...inventory.seeds,
          [item.type]: (inventory.seeds[item.type as keyof typeof inventory.seeds] || 0) + 1,
        };
      } else if (item.category === 'items') {
        newInventory.items = {
          ...(inventory.items || {}),
          [item.type]: ((inventory.items || {})[item.type] || 0) + 1,
        };
      }
      
      setInventory(newInventory);
    }
  }

  // Sell generic items (bottles, bottled_nectar, etc.)
  const ITEM_SELL_PRICES: Record<string, number> = {
    glass_bottle: 3,
    bottled_nectar: 25,
    bottled_honey: 40,
  };

  const handleSellItem = (itemType: string) => {
    const count = ((inventory as any).items || {})[itemType] || 0;
    if (count > 0) {
      const price = ITEM_SELL_PRICES[itemType] || 5;
      setInventory((prev: any) => ({
        ...prev,
        coins: prev.coins + price,
        items: {
          ...(prev.items || {}),
          [itemType]: Math.max(0, (prev.items || {})[itemType] - 1),
        },
      }));
    }
  };

  const content = (
    <View style={[styles.container, isExpanded && styles.expandedContainer, { backgroundColor: bg }] }>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerBg, borderBottomColor: headerBorder }] }>
        <Text style={[styles.headerTitle, { color: headerText }]}>🛍️ Shop</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onToggleExpand} style={styles.iconButton}>
            <Text style={[styles.iconButtonText, { color: headerText }]}>{isExpanded ? "−" : "+"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <Text style={[styles.iconButtonText, { color: headerText }]}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Coins Display */}
        <View style={[styles.coinsCard, { backgroundColor: cardBg, borderColor: cardBorder }] }>
          <CoinIcon size={32} />
          <View style={styles.coinsInfo}>
            <Text style={styles.coinsLabel}>Your Balance</Text>
            <Text style={[styles.coinsValue, { color: itemText }]}>{inventory.coins}</Text>
          </View>
        </View>

        {/* Items Grid */}
        <View style={styles.gridContainer}>
          {shopItems.map((item) => {
            const ItemIcon = item.icon;
            const canAfford = inventory.coins >= item.price;
            
            return (
              <TouchableOpacity
                key={item.type}
                style={[styles.gridItem, !canAfford && styles.gridItemDisabled, { backgroundColor: bg, borderColor: cardBorder }]}
                onPress={() => handlePurchase(item)}
                disabled={!canAfford}
                activeOpacity={0.7}
              >
                <View style={styles.itemIconContainer}>
                  <ItemIcon size={56} />
                </View>
                <Text style={[styles.itemNameText, { color: itemText }]}>{item.shortName}</Text>
                {item.description && (
                  <Text style={[styles.itemDescText, { color: itemText }]} numberOfLines={1}>{item.description}</Text>
                )}
                <View style={styles.priceContainer}>
                  <CoinIcon size={16} />
                  <Text style={[styles.priceText, !canAfford && styles.priceTextDisabled, { color: itemText }]}>
                    {item.price}
                  </Text>
                </View>
                {!canAfford && (
                  <View style={styles.lockedOverlay}>
                    <Text style={styles.lockedText}>🔒</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sell miscellaneous items */}
        {inventory.items && Object.keys(inventory.items).length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: itemText, marginBottom: 8 }}>Sell Items</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(inventory.items).map(([key, val]) => (
                <TouchableOpacity key={key} onPress={() => handleSellItem(key)} disabled={(val as number) <= 0} style={{ padding: 8, backgroundColor: cardBg, borderRadius: 8, borderWidth: 2, borderColor: cardBorder, marginRight: 8, marginBottom: 8 }}>
                  <Text style={{ fontWeight: '700', color: itemText }}>{key.replace(/_/g, ' ')} x{val}</Text>
                  <Text style={{ color: itemText }}>Sell for {ITEM_SELL_PRICES[key] || 5} coins</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* View Orders Button */}
        <TouchableOpacity 
          style={[styles.viewOrdersButton, { backgroundColor: primaryBtnBg, borderColor: cardBorder }]}
          onPress={() => router.push('/orders' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.viewOrdersIcon}>📦</Text>
          <Text style={[styles.viewOrdersButtonText, { color: priceBg }]}>View Orders</Text>
        </TouchableOpacity>
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
    backgroundColor: "#FFFBEB",
  },
  expandedContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FDE68A",
    borderBottomWidth: 3,
    borderBottomColor: "#92400E",
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#92400E",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#D97706",
  },
  iconButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400E",
  },
  scrollContent: {
    padding: 16,
  },
  coinsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF9C3",
    borderWidth: 3,
    borderColor: "#F59E0B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  coinsInfo: {
    marginLeft: 12,
    flex: 1,
  },
  coinsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coinsValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#92400E",
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FDE68A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridItemDisabled: {
    opacity: 0.6,
    borderColor: "#D1D5DB",
  },
  itemIconContainer: {
    marginBottom: 8,
  },
  itemNameText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 2,
    textAlign: "center",
  },
  itemDescText: {
    fontSize: 10,
    color: "#78350F",
    marginBottom: 8,
    textAlign: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#92400E",
  },
  priceTextDisabled: {
    color: "#9CA3AF",
  },
  lockedOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedText: {
    fontSize: 12,
  },
  viewOrdersButton: {
    flexDirection: "row",
    backgroundColor: "#92400E",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#78350F",
    shadowColor: "#92400E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: 12,
  },
  viewOrdersIcon: {
    fontSize: 24,
  },
  viewOrdersButtonText: {
    color: "#FEF3C7",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.5,
  },
})
