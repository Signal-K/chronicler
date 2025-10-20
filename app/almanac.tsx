import PlanetIcon from '@/components/PlanetIcon';
import { supabase } from '@/lib/supabase';
import { getUserStats, HarvestedPlant } from '@/lib/userStats';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PlantItem from '../components/almanac/PlantItem';
import PollinatorItem from '../components/almanac/PollinatorItem';
import type { PlantInfo, PollinatorInfo } from '../components/almanac/types';

export default function AlmanacScreen() {
  const [activeTab, setActiveTab] = useState<'pollinators' | 'plants'>('pollinators');
  const [pollinators, setPollinators] = useState<PollinatorInfo[]>([]);
  const [plants, setPlants] = useState<PlantInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlmanacData();
  }, []);

  const loadAlmanacData = async () => {
    setLoading(true);
    
    try {
      // Get user's encountered pollinators from classifications
      const { data: { session } } = await supabase.auth.getSession();
      
      const allPollinators: PollinatorInfo[] = [
        {
          id: "bumble",
          label: "Bumble bee",
          imageUrl: "https://thumbnails.zooniverse.org/500x/panoptes-uploads.zooniverse.org/workflow_attached_image/50d6cb6a-9a70-477f-99f3-e05d3e97c8f4.png",
          description: "Large, fuzzy bees with distinctive yellow and black stripes. Important pollinators for many plants.",
          encountered: false,
        },
        {
          id: "eastern-carpenter",
          label: "Eastern carpenter bee",
          imageUrl: "https://thumbnails.zooniverse.org/500x/panoptes-uploads.zooniverse.org/workflow_attached_image/8b1d1837-b35d-49b3-81bc-7a981832e520.png",
          description: "Large, black bees that nest in wood. Often mistaken for bumblebees.",
          encountered: false,
        },
        {
          id: "western-honey",
          label: "Western honey bee",
          imageUrl: "https://thumbnails.zooniverse.org/500x/panoptes-uploads.zooniverse.org/workflow_attached_image/014fe364-bbe3-463f-a649-081999e82a7a.png",
          description: "The most common honey bee species. Essential for agriculture and honey production.",
          encountered: false,
        },
      ];

      // Fetch user's classifications of type 'bumble'
      if (session?.user) {
        const { data: classifications, error } = await supabase
          .from('classifications')
          .select('classificationConfiguration')
          .eq('author', session.user.id)
          .eq('classificationtype', 'bumble');

        if (!error && classifications) {
          const encounteredTypes = new Set<string>();
          
          classifications.forEach((classification) => {
            try {
              const config = JSON.parse(classification.classificationConfiguration);
              if (config.selected) {
                encounteredTypes.add(config.selected);
              }
            } catch (e) {
              console.error('Error parsing classification config:', e);
            }
          });

          allPollinators.forEach((pollinator) => {
            pollinator.encountered = encounteredTypes.has(pollinator.id);
          });
        }
      }

      setPollinators(allPollinators);

      // Load plant data from local storage
      const userStats = await getUserStats();
      
      const allPlants: PlantInfo[] = [
        {
          type: "grass",
          label: "Grass Plant",
          imageUrl: "", // Will use the sprite image
          description: "A hardy grass plant that grows in three stages. Can be pollinated by bees to produce seeds.",
          encountered: false,
          timesHarvested: 0,
        },
      ];

      // Check which plants have been harvested
      const plantHarvestCounts: { [key: string]: number } = {};
      
      userStats.harvestedPlants.forEach((plant: HarvestedPlant) => {
        plantHarvestCounts[plant.plantType] = (plantHarvestCounts[plant.plantType] || 0) + 1;
      });

      allPlants.forEach((plant) => {
        plant.timesHarvested = plantHarvestCounts[plant.type] || 0;
        plant.encountered = plant.timesHarvested > 0;
      });

      setPlants(allPlants);
    } catch (error) {
      console.error('Error loading almanac data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGardenPress = () => {
    router.back();
  };

  const handlePlanetsPress = () => {
    router.push('/planets');
  };

  const handlePlanetPress = () => {
    router.push('/settings');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Title and Tabs */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>📖 Garden Almanac</Text>
        
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pollinators' && styles.tabActive]}
            onPress={() => setActiveTab('pollinators')}
          >
            <Text style={[styles.tabText, activeTab === 'pollinators' && styles.tabTextActive]}>
              🐝 Pollinators
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'plants' && styles.tabActive]}
            onPress={() => setActiveTab('plants')}
          >
            <Text style={[styles.tabText, activeTab === 'plants' && styles.tabTextActive]}>
              🌱 Plants
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentContainer}>
          {activeTab === 'pollinators' ? (
            <>
              <Text style={styles.sectionDescription}>
                Discover and learn about the pollinators you have encountered in your garden.
              </Text>
              {pollinators.map((p) => (
                <PollinatorItem key={p.id} pollinator={p} />
              ))}
            </>
          ) : (
            <>
              <Text style={styles.sectionDescription}>
                Track the plants you have grown and harvested in your garden.
              </Text>
              {plants.map((pl) => (
                <PlantItem key={pl.type} plant={pl} />
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleGardenPress}>
          <Text style={styles.navIcon}>🏡</Text>
          <Text style={styles.navText}>Garden</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handlePlanetsPress}>
          <PlanetIcon size={28} color="#4A90E2" />
          <Text style={styles.navText}>Planets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>📖</Text>
          <Text style={styles.navText}>Almanac</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={handlePlanetPress}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  tabActive: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  navIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
