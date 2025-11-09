
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React, { useState } from "react"
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Switch } from "../../components/ui/switch"
import { supabase } from '../../lib/supabase'

type SettingsProps = {
  onClose: () => void
  isExpanded: boolean
  onToggleExpand: () => void
  location: { lat: number; lon: number } | null
  setLocation: (location: { lat: number; lon: number } | null) => void
  setRealWeather: (weather: any) => void
  setNextRainTime: (time: number | null) => void
  onResetGame?: () => void
}

// Placeholder icons for React Native (replace with vector-icons or images as needed)
const Icon = ({ name, size = 24, color = "#000" }: { name: string; size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color, marginRight: 6 }}>{name}</Text>
)

export function Settings({
  onClose,
  isExpanded,
  onToggleExpand,
  location,
  setLocation,
  setRealWeather,
  setNextRainTime,
  onResetGame,
}: SettingsProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Function to request location and fetch weather
  const handleEnableLocation = async () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    try {
      // Use Expo Location API or similar for React Native
      // This is a placeholder for demonstration
      // Replace with expo-location or similar in production
      const latitude = 37.7749
      const longitude = -122.4194
      const newLocation = { lat: latitude, lon: longitude }
      setLocation(newLocation)
      // Fetch weather data from OpenWeatherMap API
      const apiKey = "demo"
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
      )
      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json()
        setRealWeather(weatherData)
        // Fetch forecast to determine next rain
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
        )
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json()
          const rainForecast = forecastData.list?.find((item: any) =>
            item.weather?.[0]?.main?.toLowerCase().includes("rain"),
          )
          if (rainForecast) {
            const rainTime = rainForecast.dt * 1000 // Convert to milliseconds
            setNextRainTime(rainTime)
          }
        }
      }
    } catch {
      setLocationError("Unable to access location. Please enable location permissions.")
    } finally {
      setIsLoadingLocation(false)
    }
  }

  // Function to reset all local game state
  const handleResetGame = async () => {
    console.log('🔴 handleResetGame called, onResetGame exists:', !!onResetGame);
    console.log('Reset Game: Are you sure you want to reset all game progress?');
    
    // Automatically proceed with reset
    try {
      console.log('🔴 Reset confirmed, starting...');
      // Clear all AsyncStorage keys
      console.log('🔴 Clearing AsyncStorage...');
      await AsyncStorage.multiRemove([
        'plotStates',
        'user_stats',
        'inventory'
      ]);
      console.log('🔴 AsyncStorage cleared');
      
      // Close the modal
      console.log('🔴 Closing modal...');
      onClose();
      
      // Notify parent to reset state
      console.log('🔴 Calling onResetGame...');
      if (onResetGame) {
        onResetGame();
        console.log('🔴 onResetGame called successfully');
      } else {
        console.log('🔴 WARNING: onResetGame is undefined!');
      }
      
      // Show success message
      console.log('Game Reset: Your game has been reset successfully!');
      console.log('🔴 Reset complete');
    } catch (error) {
      console.error('🔴 Error resetting game:', error);
      console.log('Error: Failed to reset game. Please try again.');
    }
  };

  // Function to logout
  const handleLogout = async () => {
    console.log('🔵 handleLogout called');
    console.log('Logout: Are you sure you want to logout?');
    
    // Automatically proceed with logout
    try {
      console.log('🔵 Calling supabase.auth.signOut()...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('🔵 Supabase signOut error:', error);
        throw error;
      }
      console.log('🔵 Supabase signOut successful');
      console.log('🔵 Closing modal...');
      onClose();
      console.log('🔵 Forcing redirect to /auth');
      setTimeout(() => {
        router.replace('/auth');
      }, 100);
      console.log('🔵 Logout complete');
    } catch (error) {
      console.error('🔵 Error logging out:', error);
      console.log('Error: Failed to logout. Please try again.');
    }
  };

  const content = (
    <View style={[styles.container, isExpanded && styles.expandedContainer]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onToggleExpand} style={styles.iconButton}>
            <Icon name={isExpanded ? "-" : "+"} size={20} color="#8a5c00" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <Icon name="X" size={22} color="#8a5c00" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Location access card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location & Weather</Text>
          <Text style={styles.cardDescription}>
            Enable location access to get real weather data and accurate rain predictions for water replenishment.
          </Text>
          <TouchableOpacity
            onPress={handleEnableLocation}
            disabled={isLoadingLocation || !!location}
            style={[styles.button, (isLoadingLocation || !!location) && styles.buttonDisabled]}
          >
            {isLoadingLocation ? (
              <>
                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Getting Location...</Text>
              </>
            ) : location ? (
              <>
                <Icon name="📍" size={16} />
                <Text style={styles.buttonText}>Location Enabled</Text>
              </>
            ) : (
              <>
                <Icon name="📍" size={16} />
                <Text style={styles.buttonText}>Enable Location Access</Text>
              </>
            )}
          </TouchableOpacity>
          {locationError && <Text style={styles.errorText}>{locationError}</Text>}
          {location && (
            <Text style={styles.successText}>
              Location: {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
            </Text>
          )}
        </View>

        {/* Audio card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Audio</Text>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Icon name="🔊" size={18} color="#92400E" />
              <Text style={styles.rowLabel}>Sound Effects</Text>
            </View>
            <Switch />
          </View>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Icon name="🎵" size={18} color="#92400E" />
              <Text style={styles.rowLabel}>Background Music</Text>
            </View>
            <Switch />
          </View>
        </View>

        {/* Notifications card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Icon name="🔔" size={18} color="#92400E" />
              <Text style={styles.rowLabel}>Crop Ready Alerts</Text>
            </View>
            <Switch />
          </View>
        </View>

        {/* Account & Data card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account & Data</Text>
          
          {/* DEBUG: Direct reset without confirmation */}
          <TouchableOpacity
            onPress={async () => {
              console.log('🟣 DIRECT RESET (no confirmation)')
              try {
                await AsyncStorage.multiRemove(['plotStates', 'user_stats', 'inventory'])
                console.log('🟣 AsyncStorage cleared')
                if (onResetGame) {
                  onResetGame()
                  console.log('🟣 onResetGame called')
                }
                onClose()
                console.log('Debug: Direct reset executed');
              } catch (error) {
                console.error('🟣 Error:', error)
              }
            }}
            style={[styles.button, { backgroundColor: '#9333EA' }]}
          >
            <Text style={styles.buttonText}>🧪 TEST: Direct Reset (No Confirm)</Text>
          </TouchableOpacity>
          
          {/* DEBUG: Direct logout without confirmation */}
          <TouchableOpacity
            onPress={async () => {
              console.log('🟣 DIRECT LOGOUT (no confirmation)')
              try {
                const { error } = await supabase.auth.signOut()
                console.log('🟣 Supabase signOut result:', error ? 'ERROR' : 'SUCCESS')
                if (error) console.error('🟣 Error:', error)
                onClose()
                // Force redirect to auth screen
                console.log('🟣 Forcing redirect to /auth')
                setTimeout(() => {
                  router.replace('/auth')
                }, 100)
              } catch (error) {
                console.error('🟣 Error:', error)
              }
            }}
            style={[styles.button, { backgroundColor: '#9333EA', marginTop: 8 }]}
          >
            <Text style={styles.buttonText}>🧪 TEST: Direct Logout (No Confirm)</Text>
          </TouchableOpacity>
          
          <Text style={styles.cardWarning}>
            ⚠️ DEBUG BUTTONS - These skip confirmation dialogs
          </Text>
          
          <View style={{ height: 16 }} />
          
          <TouchableOpacity
            onPress={() => {
              console.log('🟡 Reset button PRESSED')
              handleResetGame()
            }}
            style={[styles.button, styles.buttonDanger]}
          >
            <Icon name="🗑️" size={16} />
            <Text style={styles.buttonText}>Reset Game Progress</Text>
          </TouchableOpacity>
          <Text style={styles.cardWarning}>
            This will clear all plots, inventory, and statistics.
          </Text>
          
          <TouchableOpacity
            onPress={() => {
              console.log('🟡 Logout button PRESSED')
              handleLogout()
            }}
            style={[styles.button, styles.buttonSecondary]}
          >
            <Icon name="🚪" size={16} />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* About card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.cardDescription}>Garden Game v1.0</Text>
          <Text style={styles.cardSmall}>A relaxing farming experience</Text>
        </View>
      </ScrollView>
    </View>
  )

  if (isExpanded) {
    return (
      <Modal visible={true} animationType="slide" onRequestClose={onClose}>
        {content}
      </Modal>
    )
  }
  return content
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF3C7",
  },
  expandedContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FDE68A",
    borderBottomWidth: 2,
    borderBottomColor: "#92400E",
    padding: 16,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#92400E",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FDE68A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#92400E",
    fontSize: 18,
    marginBottom: 8,
  },
  cardDescription: {
    color: "#57534e",
    fontSize: 14,
    marginBottom: 8,
  },
  cardSmall: {
    color: "#78716c",
    fontSize: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#16A34A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  buttonDisabled: {
    backgroundColor: "#A7F3D0",
  },
  buttonDanger: {
    backgroundColor: "#DC2626",
    marginTop: 8,
  },
  buttonSecondary: {
    backgroundColor: "#78716c",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  cardWarning: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 4,
  },
  successText: {
    color: "#16a34a",
    fontSize: 12,
    marginTop: 4,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowLabel: {
    color: "#57534e",
    fontSize: 15,
  },
})