import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ToolsTab() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionIcon}>🔧</Text>
        <Text style={styles.sectionTitle}>Tools</Text>
      </View>
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No tools yet</Text>
        <Text style={styles.emptySubtext}>Visit the shop to buy tools</Text>
      </View>
    </View>
  );
}

export function ExpansionsTab() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionIcon}>📦</Text>
        <Text style={styles.sectionTitle}>Expansions</Text>
      </View>
      <View style={styles.cardExpansion}>
        <Text style={styles.expansionTitle}>Garden Plots</Text>
        <Text style={styles.expansionCount}>6 plots available</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CA8A04',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#92400E',
    opacity: 0.7,
  },
  cardExpansion: {
    padding: 16,
    backgroundColor: '#FEF9C3',
    borderWidth: 2,
    borderColor: '#CA8A04',
    borderRadius: 8,
  },
  expansionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78350F',
    marginBottom: 4,
  },
  expansionCount: {
    fontSize: 12,
    color: '#92400E',
  },
});
