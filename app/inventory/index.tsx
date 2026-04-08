import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGameState } from '../../hooks/useGameState';

type InventoryRowProps = {
  label: string;
  value: number;
};

function InventoryRow({ label, value }: InventoryRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function InventoryScreen() {
  const router = useRouter();
  const { inventory } = useGameState();
  const seedEntries = Object.entries(inventory.seeds).filter(([, amount]) => amount > 0);
  const cropEntries = Object.entries(inventory.harvested).filter(([, amount]) => amount > 0);
  const itemEntries = Object.entries(inventory.items || {}).filter(([, amount]) => amount > 0);
  const bottledHoney = inventory.bottledHoney || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </Pressable>

      <Text style={styles.title}>Inventory</Text>
      <Text style={styles.subtitle}>Your current farm stock and honey stores.</Text>

      <View style={styles.summaryCard}>
        <InventoryRow label="Coins" value={inventory.coins} />
        <InventoryRow label="Water" value={inventory.water} />
        <InventoryRow label="Honey Bottles" value={inventory.items?.honey_bottles || 0} />
        <InventoryRow label="Glass Bottles" value={inventory.items?.glass_bottle || 0} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seeds</Text>
        {seedEntries.length > 0 ? (
          seedEntries.map(([seed, amount]) => (
            <InventoryRow key={seed} label={seed} value={amount} />
          ))
        ) : (
          <Text style={styles.emptyState}>No seeds in storage.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Harvested Crops</Text>
        {cropEntries.length > 0 ? (
          cropEntries.map(([crop, amount]) => (
            <InventoryRow key={crop} label={crop} value={amount} />
          ))
        ) : (
          <Text style={styles.emptyState}>No harvested crops yet.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {itemEntries.length > 0 ? (
          itemEntries.map(([item, amount]) => (
            <InventoryRow key={item} label={item} value={amount} />
          ))
        ) : (
          <Text style={styles.emptyState}>No tools or storage items yet.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bottled Honey</Text>
        {bottledHoney.length > 0 ? (
          bottledHoney.map((bottle) => (
            <View key={bottle.id} style={styles.honeyCard}>
              <View style={[styles.honeySwatch, { backgroundColor: bottle.color }]} />
              <View style={styles.honeyInfo}>
                <Text style={styles.honeyType}>{bottle.type}</Text>
                <Text style={styles.honeyAmount}>{bottle.amount} bottle(s)</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyState}>No bottled honey collected yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fefae0',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#78350f',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#78350f',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#57534e',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f3d9bf',
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  section: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e7d3b6',
    padding: 16,
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400e',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowLabel: {
    fontSize: 15,
    color: '#44403c',
    textTransform: 'capitalize',
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1c1917',
  },
  emptyState: {
    fontSize: 14,
    color: '#78716c',
  },
  honeyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3d9bf',
    padding: 12,
    gap: 12,
  },
  honeySwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#92400e',
  },
  honeyInfo: {
    flex: 1,
  },
  honeyType: {
    fontSize: 15,
    fontWeight: '700',
    color: '#78350f',
    textTransform: 'capitalize',
  },
  honeyAmount: {
    fontSize: 14,
    color: '#57534e',
  },
});
