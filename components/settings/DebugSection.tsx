import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DebugSectionProps {
  plotStates: {[key: number]: {watered: boolean, planted: boolean, wateredAt?: number}};
  onRefresh: () => void;
  onClearHoney: () => void;
  isDark: boolean;
}

export function DebugSection({ plotStates, onRefresh, onClearHoney, isDark }: DebugSectionProps) {
  const formatTimeRemaining = (wateredAt: number) => {
    const now = Date.now();
    const elapsed = now - wateredAt;
    const twentyMinutes = 20 * 60 * 1000;
    const remaining = twentyMinutes - elapsed;
    
    if (remaining <= 0) {
      return 'Expired';
    }
    
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.section, isDark && styles.darkSection]}>
      <View style={styles.debugHeader}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>🐛 Debug Tools</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.refreshButton, isDark && styles.darkRefreshButton]}
            onPress={onRefresh}
          >
            <Text style={[styles.refreshText, isDark && styles.darkText]}>🔄 Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.clearHoneyButton, isDark && styles.darkClearHoneyButton]}
            onPress={onClearHoney}
          >
            <Text style={[styles.clearHoneyText, isDark && styles.darkText]}>🍯 Clear Honey</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.debugGrid}>
        {[0, 1, 2, 3, 4, 5].map(plotId => (
          <View key={plotId} style={[styles.debugPlot, isDark && styles.darkDebugPlot]}>
            <Text style={[styles.debugPlotTitle, isDark && styles.darkText]}>
              Plot {plotId + 1}
            </Text>
            <Text style={[styles.debugText, isDark && styles.darkText]}>
              💧 Watered: {plotStates[plotId]?.watered ? '✅' : '❌'}
            </Text>
            <Text style={[styles.debugText, isDark && styles.darkText]}>
              🌱 Planted: {plotStates[plotId]?.planted ? '✅' : '❌'}
            </Text>
            {plotStates[plotId]?.watered && plotStates[plotId]?.wateredAt && (
              <Text style={[styles.debugText, isDark && styles.darkText]}>
                ⏱️ Timer: {formatTimeRemaining(plotStates[plotId].wateredAt!)}
              </Text>
            )}
          </View>
        ))}
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
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  refreshButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  darkRefreshButton: {
    backgroundColor: '#5BA2F2',
  },
  clearHoneyButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  darkClearHoneyButton: {
    backgroundColor: '#FF8E8E',
  },
  refreshText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  clearHoneyText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  debugGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  debugPlot: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  darkDebugPlot: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  debugPlotTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  darkText: {
    color: '#fff',
  },
});
