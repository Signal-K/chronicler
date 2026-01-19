import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PermissionsSectionProps {
  locationPermission: string;
  onRequestLocationPermission: () => void;
  isDark: boolean;
}

export function PermissionsSection({
  locationPermission,
  onRequestLocationPermission,
  isDark,
}: PermissionsSectionProps) {
  const getPermissionStatusText = () => {
    switch (locationPermission) {
      case 'granted':
        return 'Granted ✅';
      case 'denied':
        return 'Denied ❌';
      case 'undetermined':
        return 'Not requested';
      default:
        return 'Unknown';
    }
  };

  const getPermissionStatusColor = () => {
    switch (locationPermission) {
      case 'granted':
        return '#4CAF50';
      case 'denied':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  return (
    <View style={[styles.section, isDark && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Permissions</Text>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, isDark && styles.darkText]}>Location</Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            Required for weather features
          </Text>
          <Text style={[styles.permissionStatus, { color: getPermissionStatusColor() }]}>
            Status: {getPermissionStatusText()}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={onRequestLocationPermission}
        >
          <Text style={styles.permissionButtonText}>
            {locationPermission === 'granted' ? 'Granted' : 'Request'}
          </Text>
        </TouchableOpacity>
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#999',
  },
  permissionStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
});
