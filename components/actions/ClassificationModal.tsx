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

export default function ClassificationModal({
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
          <View style={styles.header}>
            <Text style={styles.title}>🐝 Identify the Bee!</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {anomalyImageUrl && (
            <View style={styles.anomalyImageContainer}>
              <Image
                source={{ uri: anomalyImageUrl }}
                style={styles.anomalyImage}
                resizeMode="cover"
              />
              <Text style={styles.anomalyLabel}>Anomaly #{anomalyId}</Text>
            </View>
          )}

          <ScrollView style={styles.optionScroll} contentContainerStyle={styles.optionsContainer}>
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
                  {option.imageUrl ? (
                    <Image
                      source={{ uri: option.imageUrl }}
                      style={styles.optionImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.optionImagePlaceholder}>
                      <Text style={styles.optionImagePlaceholderText}>
                        {option.id === 'something-else' ? '🦋🐛' : '✕'}
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIndicatorText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, !selectedBeeType && styles.submitButtonDisabled]}
            onPress={handleClassify}
            disabled={!selectedBeeType}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {selectedBeeType ? '✓ Confirm Classification' : 'Select a bee type'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFD700",
    borderBottomWidth: 2,
    borderBottomColor: "#FFA500",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  anomalyImageContainer: {
    padding: 20,
    alignItems: "center",
  },
  anomalyImage: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.5,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  anomalyLabel: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  optionScroll: {
    flex: 1,
  },
  optionsContainer: {
    padding: 15,
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionCardSelected: {
    backgroundColor: "#FFF8DC",
    borderColor: "#FFD700",
  },
  optionImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  optionImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  optionImagePlaceholderText: {
    fontSize: 32,
  },
  optionLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: 600,
    color: "#333",
  },
  optionLabelSelected: {
    color: "#A4A017",
    fontWeight: "bold",
  },
  selectedIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ACAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIndicatorText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButton: {
    margin: 15,
    padding: 18,
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#CCC",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
});
