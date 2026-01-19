import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GrowthAlgorithmSectionProps {
  isDark: boolean;
}

export function GrowthAlgorithmSection({ isDark }: GrowthAlgorithmSectionProps) {
  return (
    <View style={[styles.section, isDark && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>🌱 Plant Growth Algorithm</Text>
      
      <View style={styles.algorithmInfo}>
        <Text style={[styles.algorithmText, isDark && styles.darkText]}>
          The growth rate system calculates optimal conditions for your plants based on real-time environmental data:
        </Text>
        
        <View style={styles.factorSection}>
          <Text style={[styles.factorTitle, isDark && styles.darkText]}>🌡️ Temperature Factor</Text>
          <Text style={[styles.factorDetails, isDark && styles.darkText]}>
            • Optimal: 18-25°C (100% efficiency){'\n'}
            • Good: 10-18°C or 25-30°C (50-100%){'\n'}
            • Poor: 5-10°C or 30-35°C (10-50%){'\n'}
            • Critical: Below 5°C or above 35°C (≤20%)
          </Text>
        </View>
        
        <View style={styles.factorSection}>
          <Text style={[styles.factorTitle, isDark && styles.darkText]}>💧 Humidity Factor</Text>
          <Text style={[styles.factorDetails, isDark && styles.darkText]}>
            • Optimal: 40-70% (100% efficiency){'\n'}
            • Moderate: 20-40% or 70-85% (50-100%){'\n'}
            • Poor: Below 20% or above 85% (≤70%)
          </Text>
        </View>
        
        <View style={styles.factorSection}>
          <Text style={[styles.factorTitle, isDark && styles.darkText]}>🪐 Planetary Factor</Text>
          <Text style={[styles.factorDetails, isDark && styles.darkText]}>
            • Earth: No penalty (100%){'\n'}
            • Other Planets: 90% growth penalty (10% efficiency){'\n'}
            • Reflects challenges of off-world cultivation
          </Text>
        </View>
        
        <View style={styles.formulaSection}>
          <Text style={[styles.formulaTitle, isDark && styles.darkText]}>📊 Final Calculation</Text>
          <Text style={[styles.formulaText, isDark && styles.darkText]}>
            Growth Rate = Base Rate × Temperature Factor × Humidity Factor × Planet Factor
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkSection: {
    backgroundColor: '#2d2d2d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  algorithmInfo: {
    marginTop: 10,
  },
  algorithmText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  factorSection: {
    marginBottom: 15,
  },
  factorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  factorDetails: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 10,
  },
  formulaSection: {
    marginTop: 10,
    padding: 15,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 5,
  },
  formulaText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  darkText: {
    color: '#fff',
  },
});
