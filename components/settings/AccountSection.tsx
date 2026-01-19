import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AccountSectionProps {
  userEmail: string;
  isGuest: boolean;
  isLoading: boolean;
  onSignOut: () => void;
  onConnectAccount: () => void;
  isDark: boolean;
}

export function AccountSection({
  userEmail,
  isGuest,
  isLoading,
  onSignOut,
  onConnectAccount,
  isDark,
}: AccountSectionProps) {
  return (
    <View style={[styles.section, isDark && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Account</Text>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, isDark && styles.darkText]}>User</Text>
          <Text style={[styles.settingValue, isDark && styles.darkText]}>{userEmail}</Text>
          <Text style={[styles.settingSubtext, isDark && styles.darkText]}>
            {isGuest ? 'Guest Account' : 'Full Account'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.actionButton, 
          isGuest ? styles.connectButton : styles.signOutButton,
          isLoading && styles.disabledButton
        ]}
        onPress={isGuest ? onConnectAccount : onSignOut}
        disabled={isLoading}
      >
        <Text style={styles.actionButtonText}>
          {isLoading ? 'Loading...' : (isGuest ? 'Connect Account' : 'Sign Out')}
        </Text>
      </TouchableOpacity>
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
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#999',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  connectButton: {
    backgroundColor: '#4CAF50',
  },
  signOutButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
});
