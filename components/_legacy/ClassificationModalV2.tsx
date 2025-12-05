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
import type { BeeOption, ClassificationModalProps } from '../../types/actions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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

export default function ClassificationModalV2({
  visible,
  onClose,
  onClassify,
  anomalyId,
  anomalyImageUrl,
}: ClassificationModalProps) {
  const [selectedBeeType, setSelectedBeeType] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 4>(1);

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
            {anomalyImageUrl && (
              <View style={styles.imageFrame}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={zoomLevel > 1}
                  maximumZoomScale={4}
                  minimumZoomScale={1}
                  style={styles.imageScrollView}
                >
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={zoomLevel > 1}
                  >
                    <Image
                      source={{ uri: anomalyImageUrl }}
                      style={[
                        styles.anomalyImage,
                        {
                          transform: [{ scale: zoomLevel }],
                          transformOrigin: 'center',
                        }
                      ]}
                      resizeMode="cover"
                    />
                  </ScrollView>
                </ScrollView>
                
                {/* Zoom controls */}
                <View style={styles.zoomControls}>
                  <TouchableOpacity
                    style={[styles.zoomButton, zoomLevel === 1 && styles.zoomButtonDisabled]}
                    onPress={() => setZoomLevel(prev => Math.max(1, prev / 2) as 1 | 2 | 4)}
                    disabled={zoomLevel === 1}
                  >
                    <Text style={styles.zoomButtonText}>−</Text>
                  </TouchableOpacity>
                  <View style={styles.zoomIndicator}>
                    <Text style={styles.zoomIndicatorText}>{zoomLevel}×</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.zoomButton, zoomLevel === 4 && styles.zoomButtonDisabled]}
                    onPress={() => setZoomLevel(prev => Math.min(4, prev * 2) as 1 | 2 | 4)}
                    disabled={zoomLevel === 4}
                  >
                    <Text style={styles.zoomButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={styles.instructionText}>
              Help identify this pollinator!
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
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(40, 30, 20, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.92,
    maxHeight: SCREEN_HEIGHT * 0.75,
    backgroundColor: "#f4e8d8",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 6,
    borderColor: "#8B6F47",
  },
  woodenFrame: {
    backgroundColor: "#6B5444",
    borderBottomWidth: 3,
    borderBottomColor: "#4A3828",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
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
  zoomButtonText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
    lineHeight: 28,
  },
  imageScrollView: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.35,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#D4C4A8',
  },
  anomalyImage: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.35,
    borderRadius: 8,
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#6B8E23',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#556B2F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  zoomButtonDisabled: {
    backgroundColor: '#9CA3AF',
    borderColor: '#6B7280',
    opacity: 0.5,
  },
  zoomIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#8B6F47',
    minWidth: 60,
    alignItems: 'center',
  },
  zoomIndicatorText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A3828',
  },
  closeButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  contentArea: {
    padding: 12,
  },
  imageFrame: {
    alignItems: "center",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 15,
    color: "#5D4E37",
    textAlign: "center",
    marginBottom: 6,
    fontWeight: "600",
  },
  optionsContainer: {
    paddingVertical: 4,
  },
  optionCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#D4C4A8",
    overflow: "hidden",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: "#8B6F47",
    backgroundColor: "#FFF9E6",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  optionImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#E8DCC8",
  },
  optionImage: {
    width: "100%",
    height: "100%",
  },
  optionImagePlaceholder: {
    backgroundColor: "#F0E8D8",
    justifyContent: "center",
    alignItems: "center",
  },
  optionImagePlaceholderText: {
    fontSize: 32,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#4A3828",
  },
  optionLabelSelected: {
    color: "#2D5016",
    fontWeight: "700",
  },
  selectedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6B8E23",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedBadgeText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    marginTop: 8,
    padding: 14,
    backgroundColor: "#6B8E23",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#556B2F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "#B8B8A0",
    borderColor: "#A0A090",
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFF",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
