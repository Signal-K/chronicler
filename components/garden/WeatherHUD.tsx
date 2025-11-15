import type { WeatherHUDProps } from '../../types/garden';
import React from 'react';
import { Text, View } from 'react-native';
import { weatherHUDStyles as styles } from '../../styles/garden/WeatherHUDStyles';

export default function WeatherHUD({ 
  weather, 
  weatherData, 
  userEmail, 
  currentPlanet, 
  calculateGrowthRate 
}: WeatherHUDProps) {
  return (
    <View style={styles.hud}>
      <View style={styles.hudContent}>
        <View style={styles.weatherInfo}>
          <Text style={styles.hudText}>🌤️ {weather}</Text>
          {weatherData && (
            <>
              <Text style={styles.hudSubtext}>💧 {weatherData.humidity}% humidity</Text>
              {(() => {
                const growthData = calculateGrowthRate(weatherData.temperature, weatherData.humidity, currentPlanet);
                return (
                  <Text style={styles.hudSubtext}>🌱 {growthData.rate}% growth ({growthData.description})</Text>
                );
              })()}
            </>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.hudText}>👤 {userEmail}</Text>
          <Text style={styles.hudSubtext}>🪐 {currentPlanet}</Text>
        </View>
      </View>
    </View>
  );
}