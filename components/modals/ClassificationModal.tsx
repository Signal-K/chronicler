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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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
}

export default function ClassificationModal({
  visible,
  onClose,
  onClassify,
  beeIdentifier,
}: ClassificationModalProps) {
  const [selectedBeeType, setSelectedBeeType] = useState<string | null>(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      setSelectedBeeType(null);

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

  const handleClassify = () => {
    if (selectedBeeType) {
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
              <Text style={styles.title}>🐝 Who&apos;s Visiting?</Text>
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