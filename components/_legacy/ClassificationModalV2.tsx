import type { BeeOption, ClassificationModalProps } from '@/types/actions';
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
          <View style={styles.contentArea}>
            {anomalyImageUrl && (
              <View style={styles.imageFrame}>
                <View style={styles.polaroidFrame}>
                  <Image
                    source={{ uri: anomalyImageUrl }}
                    style={styles.anomalyImage}
                    resizeMode="cover"
                  />
                  <View style={styles.polaroidFooter}>
                    <Text style={styles.polaroidLabel}>Garden Visitor</Text>
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.instructionText}>
              Help identify this pollinator!
            </Text>

            <ScrollView 
              style={styles.optionScroll} 
              contentContainerStyle={styles.optionsContainer}
              showsVerticalScrollIndicator={false}
            >
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
            </ScrollView>

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
          </View>
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
    maxHeight: SCREEN_HEIGHT * 0.85,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF9E6",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  contentArea: {
    padding: 16,
    flex: 1,
  },
  imageFrame: {
    alignItems: "center",
    marginBottom: 12,
  },
  polaroidFrame: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  anomalyImage: {
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_WIDTH * 0.4,
    borderRadius: 2,
  },
  polaroidFooter: {
    marginTop: 8,
    alignItems: "center",
  },
  polaroidLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    fontStyle: "italic",
  },
  instructionText: {
    fontSize: 16,
    color: "#5D4E37",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  optionScroll: {
    flex: 1,
  },
  optionsContainer: {
    paddingVertical: 4,
    gap: 10,
  },
  optionCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#D4C4A8",
    overflow: "hidden",
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
    marginTop: 12,
    padding: 16,
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
