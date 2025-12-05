
import React from "react"
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type AlmanacProps = {
  onClose: () => void
  isExpanded: boolean
  onToggleExpand: () => void
}

const crops = [
  {
    name: "Tomato",
    growthTime: "7 days",
    seasons: "Spring, Summer",
    sellPrice: 50,
    description: "A juicy red fruit perfect for salads and sauces.",
  },
  {
    name: "Pumpkin",
    growthTime: "5 days",
    seasons: "Fall",
    sellPrice: 30,
    description: "A large orange squash perfect for pies and decoration.",
  },
  {
    name: "Wheat",
    growthTime: "4 days",
    seasons: "Summer, Fall",
    sellPrice: 20,
    description: "A golden grain used for making bread and flour.",
  },
  {
    name: "Potato",
    growthTime: "6 days",
    seasons: "Spring, Fall",
    sellPrice: 25,
    description: "A starchy tuber that grows underground, versatile for cooking.",
  },
]

// Placeholder icons for React Native (replace with vector-icons or images as needed)
const Icon = ({ name, size = 24, color = "#000" }: { name: string; size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color, marginRight: 6 }}>{name}</Text>
)

export function Almanac({ onClose, isExpanded, onToggleExpand }: AlmanacProps) {
  const content = (
    <View style={[styles.container, isExpanded && styles.expandedContainer]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crop Almanac</Text>
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
        {crops.map((crop) => (
          <View key={crop.name} style={styles.card}>
            <Text style={styles.cropName}>{crop.name}</Text>
            <Text style={styles.cropDesc}>{crop.description}</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Growth Time:</Text>
                <Text style={styles.infoValue}>{crop.growthTime}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Seasons:</Text>
                <Text style={styles.infoValue}>{crop.seasons}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Sell Price:</Text>
                <Text style={styles.infoValue}>{crop.sellPrice} coins</Text>
              </View>
            </View>
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
  card: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FDE68A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cropName: {
    fontWeight: "bold",
    color: "#92400E",
    fontSize: 20,
    marginBottom: 6,
  },
  cropDesc: {
    color: "#57534e",
    fontSize: 14,
    marginBottom: 10,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoCol: {
    flex: 1,
    minWidth: 120,
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: "600",
    color: "#B45309",
    fontSize: 14,
  },
  infoValue: {
    color: "#57534e",
    fontSize: 14,
  },
})