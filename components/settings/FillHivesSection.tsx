import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FillHivesSectionProps {
  isDark: boolean;
}

export function FillHivesSection({ isDark }: FillHivesSectionProps) {
  const handleFillHives = async () => {
    console.log('🐝 Fill Hives button pressed');
    try {
      const pollinationData = await AsyncStorage.getItem('pollination_factor');
      const hivesData = await AsyncStorage.getItem('hives');
      
      console.log('🐝 Retrieved pollination data:', pollinationData);
      console.log('🐝 Retrieved hives data:', hivesData);
      
      if (pollinationData && hivesData) {
        const pollinationFactor = JSON.parse(pollinationData);
        const hives = JSON.parse(hivesData);
        
        console.log('🐝 Parsed pollination factor:', pollinationFactor);
        console.log('🐝 Parsed hives:', hives);
        
        const HIVE_CAPACITY = 100;
        const totalCapacity = hives.length * HIVE_CAPACITY;
        const currentTotal = hives.reduce((sum: number, h: any) => sum + h.beeCount, 0);
        const remainingCapacity = totalCapacity - currentTotal;
        
        // Debug feature: Calculate max bees based on pollination score
        // For every 10 pollination points, you can have 1 bee
        const maxBeesAllowed = Math.floor(pollinationFactor.factor / 10);
        const beesUnspawned = maxBeesAllowed - currentTotal;
        
        console.log('🐝 Total capacity:', totalCapacity);
        console.log('🐝 Current total bees:', currentTotal);
        console.log('🐝 Pollination factor:', pollinationFactor.factor);
        console.log('🐝 Max bees allowed by pollination:', maxBeesAllowed);
        console.log('🐝 Bees unspawned:', beesUnspawned);
        console.log('🐝 Remaining capacity:', remainingCapacity);
        
        if (beesUnspawned > 0) {
          const beesToAdd = Math.min(beesUnspawned, remainingCapacity);
          
          console.log('🐝 Bees to add:', beesToAdd);
          
          if (beesToAdd > 0) {
            let remaining = beesToAdd;
            const updatedHives = hives.map((h: any) => {
              const hiveCapacity = HIVE_CAPACITY - h.beeCount;
              const beesForThisHive = Math.min(remaining, hiveCapacity);
              remaining -= beesForThisHive;
              console.log(`🐝 Updating hive ${h.id}: ${h.beeCount} + ${beesForThisHive} = ${h.beeCount + beesForThisHive}`);
              return {
                ...h,
                beeCount: h.beeCount + beesForThisHive
              };
            });
            
            console.log('🐝 Updated hives:', updatedHives);
            await AsyncStorage.setItem('hives', JSON.stringify(updatedHives));
            
            const timestamp = Date.now();
            await AsyncStorage.setItem('hivesRefreshSignal', timestamp.toString());
            console.log('🐝 Refresh signal sent at', timestamp);
            
            alert(`✅ Added ${beesToAdd} bees to your hives!\nYou now have ${currentTotal + beesToAdd}/${maxBeesAllowed} bees (based on pollination score)`);
          } else {
            console.log('🐝 No remaining capacity to add bees');
            alert('⚠️ Your hives are at full capacity!');
          }
        } else if (currentTotal >= maxBeesAllowed) {
          console.log('🐝 Current bees match or exceed pollination score');
          alert(`✅ Your bees are up to date!\nYou have ${currentTotal}/${maxBeesAllowed} bees based on your pollination score of ${pollinationFactor.factor}`);
        } else {
          console.log('🐝 Bees unspawned is not positive');
          alert(`⚠️ Your bees are already at the maximum for your pollination score (${currentTotal}/${maxBeesAllowed})`);
        }
      } else {
        console.warn('⚠️ Missing pollination data or hives data');
        alert('⚠️ Could not load game data');
      }
    } catch (error) {
      console.error('🐝 Error in Fill Hives button:', error);
      alert('❌ Error filling hives. Check console for details.');
    }
  };

  const handleDeleteAllBees = async () => {
    console.log('🗑️ Delete All Bees button pressed');
    try {
      const hivesData = await AsyncStorage.getItem('hives');
      
      if (hivesData) {
        const hives = JSON.parse(hivesData);
        console.log('🗑️ Current hives:', hives);
        
        const emptyHives = hives.map((h: any) => ({
          ...h,
          beeCount: 0
        }));
        
        console.log('🗑️ Empty hives:', emptyHives);
        await AsyncStorage.setItem('hives', JSON.stringify(emptyHives));
        
        const timestamp = Date.now();
        await AsyncStorage.setItem('hivesRefreshSignal', timestamp.toString());
        console.log('🗑️ All bees deleted');
        
        alert('✅ All bees have been removed from your hives!');
      }
    } catch (error) {
      console.error('🗑️ Error deleting bees:', error);
      alert('❌ Error deleting bees. Check console for details.');
    }
  };

  return (
    <View style={[styles.section, isDark && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>🐝 Fill Hives</Text>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, isDark && styles.darkText]}>Fill Hives with Bees</Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            Use your pollination score to fill hive capacity
          </Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            🐝 Fill all hives to capacity based on your progress
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            styles.fillHivesButton
          ]}
          onPress={handleFillHives}
        >
          <Text style={[
            styles.actionButtonText,
            styles.fillHivesButtonText
          ]}>
            Fill Hives
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, isDark && styles.darkText]}>Delete All Bees</Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            Remove all bees from all hives
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            { backgroundColor: '#FF6B6B' }
          ]}
          onPress={handleDeleteAllBees}
        >
          <Text style={[
            styles.actionButtonText,
            { color: '#fff' }
          ]}>
            Delete All Bees
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkSection: {
    backgroundColor: '#2d2d2d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#999',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  fillHivesButton: {
    backgroundColor: '#16A34A',
    minWidth: 120,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fillHivesButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#fff',
  },
});
