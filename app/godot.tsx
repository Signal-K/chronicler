import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { GodotHostView } from '../components/godot/GodotHostView';

export default function GodotScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Godot Migration Preview</Text>
        <Text style={styles.subtitle}>
          Native uses embedded Godot when the bridge package is available. Web uses fallback instructions.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <GodotHostView packName="BeeGarden" projectPath="/BeeGarden" />
      </View>

      <Text style={styles.footer}>
        Platform: {Platform.OS}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    color: '#f9fafb',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#d1d5db',
    marginTop: 6,
    fontSize: 13,
  },
  backButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#065f46',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ecfdf5',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  footer: {
    color: '#9ca3af',
    padding: 12,
    textAlign: 'center',
    fontSize: 12,
  },
});
