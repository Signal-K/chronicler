import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CoinsDisplayProps {
  coins: number;
}

export function CoinsDisplay({ coins }: CoinsDisplayProps) {
  return (
    <View style={styles.cardCoins}>
      <View style={styles.coinsRow}>
        <View style={styles.coinsIcon}>
          <View style={styles.coinOuter} />
          <View style={styles.coinInner} />
        </View>
        <View>
          <Text style={styles.coinsLabel}>Coins</Text>
          <Text style={styles.coinsValue}>{coins}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardCoins: {
    padding: 16,
    backgroundColor: '#FEF9C3',
    borderWidth: 2,
    borderColor: '#CA8A04',
    borderRadius: 12,
    marginBottom: 8,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coinsIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coinOuter: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBBF24',
    borderWidth: 2,
    borderColor: '#92400E',
  },
  coinInner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FDE68A',
    borderWidth: 1,
    borderColor: '#CA8A04',
  },
  coinsLabel: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  coinsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#78350F',
  },
});
