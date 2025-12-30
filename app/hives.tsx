import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HivesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐝 Hives Page</Text>
      <Text style={styles.subtitle}>This is a placeholder for your hives screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#57534e',
  },
});
