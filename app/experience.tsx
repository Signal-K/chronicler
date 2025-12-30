
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExperienceBar } from '../components/ui/ExperienceBar';
import { useGameState } from '../hooks/useGameState';
import { usePlayerExperience } from '../hooks/usePlayerExperience';

export default function ExperienceDetailsScreen() {
  const { experience } = usePlayerExperience();
  const router = useRouter();

  // Fallbacks for null experience
  const level = experience?.level ?? 0;
  const xpInCurrentLevel = experience?.xpInCurrentLevel ?? 0;
  const xpNeededForNext = experience?.xpNeededForNext ?? 100;
  const progress = experience?.progress ?? 0;
  const totalXP = experience?.totalXP ?? 0;
  const harvestsCount = experience?.harvestsCount ?? 0;
  const uniqueHarvests = experience?.uniqueHarvests?.length ?? 0;
  const pollinationEvents = experience?.pollinationEvents ?? 0;
  const salesCompleted = experience?.salesCompleted ?? 0;

  const { plots, setPlots, inventory, setInventory } = useGameState();

  const isUpgradePurchased = (pagesToHave: number) => {
    return plots.length >= pagesToHave * 6;
  };

  const makeEmptyPlots = (count: number) => {
    return Array.from({ length: count }).map(() => ({
      state: 'empty' as 'empty',
      growthStage: 0,
      cropType: null,
      needsWater: false,
    }));
  };

  const purchaseUpgrade = async (requiredLevel: number, cost: number, targetPages: number) => {
    if ((experience?.level ?? 0) < requiredLevel) {
      Alert.alert('Locked', `Reach level ${requiredLevel} to unlock this upgrade.`);
      return;
    }
    if (isUpgradePurchased(targetPages)) {
      Alert.alert('Already purchased', 'You already own this upgrade.');
      return;
    }
    if (inventory.coins < cost) {
      Alert.alert('Not enough coins', `You need ${cost} coins to buy this.`);
      return;
    }

    const newInventory = { ...inventory, coins: (inventory.coins || 0) - cost };
    const newPlots = [...plots, ...makeEmptyPlots(6)];

    setInventory(newInventory);
    setPlots(newPlots);

    // Persist immediately so other screens see the change
    try {
      await AsyncStorage.setItem('inventory', JSON.stringify(newInventory));
      await AsyncStorage.setItem('plots', JSON.stringify(newPlots));
    } catch {
      // ignore storage errors
    }

    Alert.alert('Purchase successful', 'New farm plots have been added.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Level {level}</Text>
      <ExperienceBar
        level={level}
        currentXP={xpInCurrentLevel}
        nextLevelXP={xpNeededForNext}
        progress={progress}
        showDetails
      />
      <Text style={styles.sectionTitle}>Experience Breakdown</Text>
      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownItem}>Total XP: {totalXP}</Text>
        <Text style={styles.breakdownItem}>Harvests: {harvestsCount}</Text>
        <Text style={styles.breakdownItem}>First-Time Harvests: {uniqueHarvests}</Text>
        <Text style={styles.breakdownItem}>Pollination Events: {pollinationEvents}</Text>
        <Text style={styles.breakdownItem}>Sales Completed: {salesCompleted}</Text>
      </View>

      <Text style={styles.sectionTitle}>Upgrades</Text>
      <View style={styles.upgradesContainer}>
        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Extra Farm Page (6 plots)</Text>
          <Text style={styles.upgradeDesc}>Unlock a second farm page with 6 additional crop slots.</Text>
          <Text style={styles.upgradeInfo}>Unlocks at Level 3 · Cost: 20 coins</Text>
          <TouchableOpacity
            style={[styles.upgradeButton, (isUpgradePurchased(2) || level < 3) ? styles.buttonDisabled : null]}
            onPress={() => purchaseUpgrade(3, 20, 2)}
            disabled={isUpgradePurchased(2) || level < 3}
          >
            <Text style={styles.upgradeButtonText}>{isUpgradePurchased(2) ? 'Purchased' : (level < 3 ? 'Locked' : 'Buy for 20 coins')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Extra Farm Page (6 plots)</Text>
          <Text style={styles.upgradeDesc}>Unlock another farm page with 6 more crop slots.</Text>
          <Text style={styles.upgradeInfo}>Unlocks at Level 6 · Cost: 40 coins</Text>
          <TouchableOpacity
            style={[styles.upgradeButton, (isUpgradePurchased(3) || level < 6) ? styles.buttonDisabled : null]}
            onPress={() => purchaseUpgrade(6, 40, 3)}
            disabled={isUpgradePurchased(3) || level < 6}
          >
            <Text style={styles.upgradeButtonText}>{isUpgradePurchased(3) ? 'Purchased' : (level < 6 ? 'Locked' : 'Buy for 40 coins')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
    backgroundColor: '#fefbe9',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#78350f',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#78350f',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 12,
    color: '#a16207',
  },
  breakdownContainer: {
    width: '100%',
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  breakdownItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#78350f',
  },
  upgradesContainer: {
    width: '100%',
    marginTop: 8,
    gap: 12,
  },
  upgradeCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3d9bf',
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 6,
  },
  upgradeDesc: {
    color: '#57534e',
    marginBottom: 6,
  },
  upgradeInfo: {
    color: '#78350f',
    marginBottom: 8,
  },
  upgradeButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
