import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export function ExpandContent() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderIcon}>🏡</Text>
        <Text style={styles.placeholderTitle}>Expand Your Farm</Text>
        <Text style={styles.placeholderText}>
          Unlock new farm plots and expand your gardening empire!
        </Text>
        <Text style={styles.placeholderSubtext}>
          Coming soon...
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  placeholder: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#92400e',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#78350f',
    textAlign: 'center',
    marginBottom: 8,
    maxWidth: 300,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#a8a29e',
    fontStyle: 'italic',
  },
});
