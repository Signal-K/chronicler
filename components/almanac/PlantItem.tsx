import React from "react";
import { Image, Text, View } from "react-native";
import styles from "./AlmanacModal.styles";
import type { PlantInfo } from "./types";

export default function PlantItem({ plant }: { plant: PlantInfo }) {
  return (
    <View key={plant.type} style={styles.itemCard}>
      {plant.encountered ? (
        <>
          <Image
            source={require("../../assets/Sprites/Growing Plants/tile009.png")}
            style={styles.itemImage}
            resizeMode="contain"
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemLabel}>{plant.label}</Text>
            <Text style={styles.itemDescription}>{plant.description}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                ✓ Harvested {plant.timesHarvested} time{plant.timesHarvested !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.itemImageLocked}>
            <Text style={styles.lockedIcon}>🔒</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemLabelLocked}>???</Text>
            <Text style={styles.itemDescription}>
              Harvest this plant to unlock its entry.
            </Text>
            <View style={[styles.statusBadge, styles.statusBadgeLocked]}>
              <Text style={styles.statusTextLocked}>Not Yet Harvested</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
