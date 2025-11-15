import { supabase } from "../../lib/supabase";
import { getUserStats, HarvestedPlant } from "../../lib/userStats";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import styles from "./AlmanacModal.styles";
import PlantItem from "./PlantItem";
import PollinatorItem from "./PollinatorItem";
import type { AlmanacModalProps, PlantInfo, PollinatorInfo } from "./types";

export default function AlmanacModal({
  visible,
  onClose,
}: AlmanacModalProps) {
  const [activeTab, setActiveTab] = useState<'pollinators' | 'plants'>('pollinators');
  const [pollinators, setPollinators] = useState<PollinatorInfo[]>([]);
  const [plants, setPlants] = useState<PlantInfo[]>([]);
  const [loading, setLoading] = useState(true);
  
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      loadAlmanacData();
    }
  }, [visible, scaleAnim, fadeAnim]);

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

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>📖 Garden Almanac</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
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
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
