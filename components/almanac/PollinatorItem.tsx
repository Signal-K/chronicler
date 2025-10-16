import React from "react";
import { Image, Text, View } from "react-native";
import styles from "./AlmanacModal.styles";
import type { PollinatorInfo } from "./types";

export default function PollinatorItem({ pollinator }: { pollinator: PollinatorInfo }) {
  return (
    <View key={pollinator.id} style={styles.itemCard}>
      {pollinator.encountered ? (
        <>
          <Image
            source={{ uri: pollinator.imageUrl }}
            style={styles.itemImage}
            resizeMode="cover"
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemLabel}>{pollinator.label}</Text>
            <Text style={styles.itemDescription}>{pollinator.description}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>✓ Encountered</Text>
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
              Encounter this pollinator to unlock its entry.
            </Text>
            <View style={[styles.statusBadge, styles.statusBadgeLocked]}>
              <Text style={styles.statusTextLocked}>Not Yet Encountered</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
