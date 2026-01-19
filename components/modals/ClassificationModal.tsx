import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from '../../contexts/auth';
import { usePlayerExperience } from '../../hooks/usePlayerExperience';
import { awardClassificationXP } from '../../lib/experienceSystem';
import { supabase } from "../../lib/supabase";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Anomaly {
  id: number;
  anomalytype: string;
  content?: string;
  ticId?: string;
}

interface BeeOption {
  id: string;
  label: string;
  imageUrl: string;
}

const BEE_OPTIONS: BeeOption[] = [
  {
    id: "bumble",
    label: "Bumble bee",
    imageUrl:
      "https://thumbnails.zooniverse.org/500x/panoptes-uploads.zooniverse.org/workflow_attached_image/50d6cb6a-9a70-477f-99f3-e05d3e97c8f4.png",
  },
  {
    id: "eastern-carpenter",
    label: "Eastern carpenter bee",
    imageUrl:
      "https://thumbnails.zooniverse.org/500x/panoptes-uploads.zooniverse.org/workflow_attached_image/8b1d1837-b35d-49b3-81bc-7a981832e520.png",
  },
  {
    id: "western-honey",
    label: "Western honey bee",
    imageUrl:
      "https://thumbnails.zooniverse.org/500x/panoptes-uploads.zooniverse.org/workflow_attached_image/014fe364-bbe3-463f-a649-081999e82a7a.png",
  },
  {
    id: "something-else",
    label: "Something Else",
    imageUrl: "",
  },
  {
    id: "nothing-here",
    label: "Nothing Here",
    imageUrl: "",
  },
];

interface ClassificationModalProps {
  visible: boolean;
  onClose: () => void;
  onClassify: (beeType: string) => void;
  beeIdentifier?: string;
  userId?: string; // Add userId prop for saving classifications
}

export default function ClassificationModal({
  visible,
  onClose,
  onClassify,
  beeIdentifier,
  userId,
}: ClassificationModalProps) {
  const { session } = useAuth();
  const { refreshExperience } = usePlayerExperience();
  const [selectedBeeType, setSelectedBeeType] = useState<string | null>(null);
  const [currentAnomaly, setCurrentAnomaly] = useState<Anomaly | null>(null);
  const [beeImageUrl, setBeeImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Global debug function (can be called from console)
  (global as any).testBumbleStorage = async () => {
    console.log('🐝 Testing bumble storage from modal...');
    const connected = await checkStorageConnectivity();
    if (connected) {
      await fetchRandomBumbleAnomaly();
    }
    return { connected, currentAnomaly };
  };

  // Debug function to test a specific anomaly ID (you can call this from console)
  const testSpecificAnomaly = async (anomalyId: number) => {
    console.log(`🧪 Testing specific anomaly ID: ${anomalyId}`);
    
    const imageFormats = ['jpeg', 'jpg', 'png'];
    
    for (const format of imageFormats) {
      const filename = `${anomalyId}.${format}`;
      console.log(`🔍 Testing: ${filename}`);
      
      const { data: urlData } = supabase.storage
        .from('bumble')
        .getPublicUrl(filename);
      
      if (urlData?.publicUrl) {
        console.log(`📸 URL: ${urlData.publicUrl}`);
        
        try {
          const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
          console.log(`📊 Status: ${response.status}`);
          
          if (response.ok) {
            console.log(`✅ SUCCESS: Image accessible at ${urlData.publicUrl}`);
            // Set this as current image for testing
            setBeeImageUrl(urlData.publicUrl);
            setCurrentAnomaly({ id: anomalyId, anomalytype: 'bumble' });
            return;
          }
        } catch (error) {
          console.error(`❌ Fetch error:`, error);
        }
      }
    }
    console.log(`❌ No working image found for anomaly ${anomalyId}`);
  };

  // You can test this in the browser console with:
  // window.testSpecificAnomaly = testSpecificAnomaly;

  // Check storage bucket connectivity
  const checkStorageConnectivity = async () => {
    try {
      console.log('🔍 Testing storage bucket connectivity...');
      
      // Try to list some files in the bucket to see what's available
      const { data, error } = await supabase.storage
        .from('bumble')
        .list('', { limit: 5 });
      
      if (error) {
        console.error('❌ Storage connectivity error:', error);
        return false;
      } else {
        console.log('✅ Storage bucket is accessible');
        console.log('📁 Available files in bucket:', data?.map(file => file.name).slice(0, 3));
        return true;
      }
    } catch (error) {
      console.error('❌ Storage connectivity check failed:', error);
      return false;
    }
  };

  // Fetch a random bumble anomaly from Supabase
  const fetchRandomBumbleAnomaly = async () => {
    setLoading(true);
    setBeeImageUrl(null);
    
    try {
      // First check storage connectivity
      const storageConnected = await checkStorageConnectivity();
      if (!storageConnected) {
        console.error('❌ Storage bucket is not accessible, skipping image loading');
        setBeeImageUrl(null);
        setLoading(false);
        return;
      }
      
      // First try to get a count to see how many anomalies we have
      const { count, error: countError } = await supabase
        .from('anomalies')
        .select('*', { count: 'exact', head: true })
        .eq('anomalytype', 'bumble');
      
      if (countError) {
        console.error('Error getting anomaly count:', countError);
      } else {
        console.log(`Found ${count || 0} bumble anomalies in database`);
      }

      // Simple fetch like the original working version
      const { data: anomalies, error } = await supabase
        .from('anomalies')
        .select('*')
        .eq('anomalytype', 'bumble')
        .order('id', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      if (anomalies && anomalies.length > 0) {
        // Pick a random anomaly
        const randomAnomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
        setCurrentAnomaly(randomAnomaly);
        
        console.log('Selected anomaly:', randomAnomaly.id);
        
        // Generate URL using external API
        const publicUrl = `https://api.starsailors.space/storage/v1/object/public/bumble/${randomAnomaly.id}.jpeg`;
        console.log('Generated URL:', publicUrl);
        setBeeImageUrl(publicUrl);
      } else {
        console.log('No bumble anomalies found');
        setBeeImageUrl(null);
      }
    } catch (error) {
      console.error('Error fetching random bumble anomaly:', error);
      setBeeImageUrl(null);
    } finally {
      setLoading(false);
    }
  };

  // Save classification to Supabase
  const saveClassification = async (beeType: string) => {
    if (!currentAnomaly || !session?.user?.id) {
      console.log('Cannot save classification: missing anomaly or user session', { 
        hasAnomaly: !!currentAnomaly, 
        hasSession: !!session?.user?.id 
      });
      return;
    }

    try {
      const classificationData = {
        author: session.user.id,
        anomaly: currentAnomaly.id,
        classificationtype: 'bumble',
        content: `Classified as: ${beeType}`,
        media: JSON.stringify([
          [beeImageUrl, `${currentAnomaly.id}.jpeg`],
          [currentAnomaly.id.toString(), 'id']
        ]),
        classificationConfiguration: JSON.stringify({
          beeType: beeType,
          beeIdentifier: beeIdentifier,
          classificationOptions: BEE_OPTIONS.map(option => option.label),
          selectedOption: BEE_OPTIONS.find(option => option.id === beeType)?.label,
          timestamp: new Date().toISOString(),
          anomalyId: currentAnomaly.id
        })
      };

      console.log('Saving classification:', {
        beeType,
        anomalyId: currentAnomaly.id,
        userId: userId
      });

      const { error } = await supabase
        .from('classifications')
        .insert([classificationData]);

      if (error) {
        console.error('Error saving classification:', error);
        // Don't throw here, just log the error so the user can still continue
      } else {
        console.log('Classification saved successfully');
        
        // Award XP for classification
        try {
          const xpEvent = await awardClassificationXP();
          console.log('🎉 Awarded XP:', xpEvent.amount, xpEvent.description);
          await refreshExperience(); // Refresh experience state
        } catch (xpError) {
          console.error('❌ Error awarding classification XP:', xpError);
        }
      }
    } catch (error) {
      console.error('Error saving classification:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      setSelectedBeeType(null);
      
      // Check storage connectivity first
      checkStorageConnectivity().then((connected) => {
        if (connected) {
          // Fetch a new random bee image when modal opens
          fetchRandomBumbleAnomaly();
        } else {
          console.error('❌ Storage not accessible, skipping image fetch');
          setLoading(false);
        }
      });

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
    }
  }, [visible, scaleAnim, fadeAnim]);

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

  const handleClassify = async () => {
    if (selectedBeeType) {
      // Save to Supabase first (this will also award XP)
      await saveClassification(selectedBeeType);
      console.log('🎉 Classification complete! +10 XP awarded');
      
      // Then call the original callback
      onClassify(selectedBeeType);
      handleClose();
    }
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
          {/* Wooden frame header */}
          <View style={styles.woodenFrame}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Image 
                  source={require('../../assets/Sprites/Bee.png')}
                  style={styles.beeSpriteTitle}
                  resizeMode="contain"
                />
                <Text style={styles.title}> Who&lsquo;s Visiting?</Text>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main content area with paper texture */}
          <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>
              Bee {beeIdentifier ? `${beeIdentifier} ` : ''}is visiting your garden! 
              {'\n'}Help identify this pollinator!
            </Text>

            {/* Show the actual bee image from Supabase */}
            <View style={styles.beeImageContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading bee image...</Text>
                  {currentAnomaly && (
                    <Text style={styles.debugText}>
                      Anomaly ID: {currentAnomaly.id}
                    </Text>
                  )}
                </View>
              ) : beeImageUrl ? (
                <Image
                  source={{ 
                    uri: beeImageUrl,
                  }}
                  style={styles.beeImage}
                  resizeMode="contain"
                  onError={(error) => {
                    console.log('❌ Image load error for URL:', beeImageUrl);
                    console.log('❌ Error details:', error.nativeEvent?.error || error);
                    // REMOVED: No more infinite retry loop
                  }}
                  onLoad={() => {
                    console.log('✅ Image loaded successfully:', beeImageUrl);
                  }}
                  onLoadStart={() => {
                    console.log('🔄 Started loading image:', beeImageUrl);
                  }}
                />
              ) : (
                <View style={styles.imageErrorContainer}>
                  <Text style={styles.imageErrorText}>
                    {currentAnomaly 
                      ? `Image not available for anomaly ${currentAnomaly.id}`
                      : 'No bee image available'
                    }
                  </Text>
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={fetchRandomBumbleAnomaly}
                  >
                    <Text style={styles.retryButtonText}>Try Another Image</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.optionsContainer}>
              {BEE_OPTIONS.map((option) => {
                const isSelected = selectedBeeType === option.id;

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => setSelectedBeeType(option.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      {option.imageUrl ? (
                        <View style={styles.optionImageContainer}>
                          <Image
                            source={{ uri: option.imageUrl }}
                            style={styles.optionImage}
                            resizeMode="cover"
                          />
                        </View>
                      ) : (
                        <View style={[styles.optionImageContainer, styles.optionImagePlaceholder]}>
                          <Text style={styles.optionImagePlaceholderText}>
                            {option.id === 'something-else' ? '🦋' : '✕'}
                          </Text>
                        </View>
                      )}
                      <View style={styles.optionTextContainer}>
                        <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                          {option.label}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Submit button with wooden style */}
            <TouchableOpacity
              style={[
                styles.submitButton, 
                !selectedBeeType && styles.submitButtonDisabled
              ]}
              onPress={handleClassify}
              disabled={!selectedBeeType}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {selectedBeeType ? '✓ Record Visitor' : 'Select a visitor type'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.85,
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#F5E6D3',
    borderRadius: 20,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  woodenFrame: {
    backgroundColor: '#8B4513',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#F5E6D3",
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beeSpriteTitle: {
    width: 48,
    height: 48,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#F5E6D3',
    fontWeight: 'bold',
  },
  contentArea: {
    padding: 20,
    backgroundColor: '#FFF8E7',
  },
  subtitle: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    fontWeight: '500',
  },
  beeImageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E5D4B1',
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
  beeImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: '#8B4513',
    fontStyle: 'italic',
  },
  imageErrorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  imageErrorText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  debugText: {
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5D4B1',
    overflow: 'hidden',
    position: 'relative',
  },
  optionCardSelected: {
    borderColor: '#8B4513',
    backgroundColor: '#F9F5E7',
  },
  optionContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  optionImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  optionImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  optionImagePlaceholderText: {
    fontSize: 24,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4A4A',
  },
  optionLabelSelected: {
    color: '#8B4513',
    fontWeight: '600',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#8B4513',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});