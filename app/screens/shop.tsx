
import React from "react"
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type ShopProps = {
  inventory: {
    coins: number
    seeds: Record<string, number>
  }
  setInventory: (inventory: any) => void
  onClose: () => void
  isExpanded: boolean
  onToggleExpand: () => void
}

const shopItems = [
  { name: "Tomato Seeds", price: 10, type: "tomato" },
  { name: "Carrot Seeds", price: 8, type: "carrot" },
  { name: "Wheat Seeds", price: 5, type: "wheat" },
]

// Placeholder icons for React Native (replace with vector-icons or images as needed)
const Icon = ({ name, size = 24, color = "#000" }: { name: string; size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color, marginRight: 6 }}>{name}</Text>
)

export function Shop({ inventory, setInventory, onClose, isExpanded, onToggleExpand }: ShopProps) {
  const handlePurchase = (item: (typeof shopItems)[0]) => {
    if (inventory.coins >= item.price) {
      setInventory({
        ...inventory,
        coins: inventory.coins - item.price,
        seeds: {
          ...inventory.seeds,
          [item.type]: inventory.seeds[item.type as keyof typeof inventory.seeds] + 1,
        },
      })
    }
  }

  const content = (
    <View style={[styles.container, isExpanded && styles.expandedContainer]}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="🛍️" size={24} color="#92400E" />
          <Text style={styles.headerTitle}>Shop</Text>
        </View>
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
        <View style={styles.coinsCard}>
          <Text style={styles.coinsText}>
            Your Coins: <Text style={styles.coinsValue}>{inventory.coins}</Text>
          </Text>
        </View>
        {shopItems.map((item) => (
          <View key={item.name} style={styles.itemCard}>
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price} coins</Text>
            </View>
            <TouchableOpacity
              onPress={() => handlePurchase(item)}
              disabled={inventory.coins < item.price}
              style={[styles.buyButton, inventory.coins < item.price && styles.buyButtonDisabled]}
            >
              <Text style={styles.buyButtonText}>
                {inventory.coins >= item.price ? "Buy" : "Not Enough Coins"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
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
    marginLeft: 8,
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
  coinsCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FEF9C3",
    borderWidth: 2,
    borderColor: "#CA8A04",
    borderRadius: 10,
  },
  coinsText: {
    color: "#B45309",
    fontSize: 15,
    fontWeight: "500",
  },
  coinsValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400E",
  },
  itemCard: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FDE68A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    fontWeight: "bold",
    color: "#92400E",
    fontSize: 17,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#22C55E",
  },
  buyButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  buyButtonDisabled: {
    backgroundColor: "#D6D3D1",
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
})
