import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import { Planet, usePlanets } from '../hooks/usePlanets';

// Earth as the default planet
const earthPlanet: Planet = {
  id: 0,
  name: "Earth",
  type: "Home World",
  radius: 1.0,
  mass: 1.0,
  temperature: 288,
  gravity: 9.8,
  orbitalPeriod: 365,
  color: "#4A90E2",
  secondaryColor: "#7CB342",
  discovered: true,
  hasLife: true,
};

function PlanetIcon({ planet, size = 60 }: { planet: Planet; size?: number }) {
  const iconSize = size;
  
  // Different planet visual styles based on type and characteristics
  if (planet.hasLife && planet.color.includes('#4A90E2')) {
    // Ocean world with continents
    return (
      <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={planet.color} />
            <Stop offset="100%" stopColor="#2980B9" />
          </LinearGradient>
        </Defs>
        <Circle cx="50" cy="50" r="45" fill="url(#oceanGrad)" />
        <Path d="M20,30 Q35,25 45,35 Q55,45 40,50 Q25,45 20,30" fill={planet.secondaryColor} />
        <Path d="M60,20 Q75,25 80,40 Q70,50 60,45 Q55,35 60,20" fill={planet.secondaryColor} />
        <Path d="M25,65 Q40,60 50,70 Q35,80 25,65" fill={planet.secondaryColor} />
        <Circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      </Svg>
    );
  }
  
  if (planet.hasLife && planet.color.includes('#27AE60')) {
    // Lush forest world
    return (
      <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="forestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={planet.color} />
            <Stop offset="100%" stopColor="#1E8449" />
          </LinearGradient>
        </Defs>
        <Circle cx="50" cy="50" r="45" fill="url(#forestGrad)" />
        <Circle cx="30" cy="25" r="8" fill="#2E7D32" />
        <Circle cx="70" cy="35" r="6" fill="#388E3C" />
        <Circle cx="25" cy="60" r="7" fill="#43A047" />
        <Circle cx="75" cy="65" r="9" fill="#4CAF50" />
        <Circle cx="50" cy="75" r="5" fill="#66BB6A" />
        <Circle cx="60" cy="20" r="4" fill="#81C784" />
        <Circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      </Svg>
    );
  }
  
  if (planet.color.includes('#E74C3C')) {
    // Desert/Mars-like world
    return (
      <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="desertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={planet.color} />
            <Stop offset="100%" stopColor="#C0392B" />
          </LinearGradient>
        </Defs>
        <Circle cx="50" cy="50" r="45" fill="url(#desertGrad)" />
        <Ellipse cx="35" cy="40" rx="12" ry="6" fill="#D35400" />
        <Ellipse cx="65" cy="60" rx="15" ry="8" fill="#E67E22" />
        <Circle cx="25" cy="70" r="8" fill="#F39C12" />
        <Circle cx="75" cy="30" r="6" fill="#FF8A65" />
        <Circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      </Svg>
    );
  }
  
  if (planet.color.includes('#9B59B6')) {
    // Crystalline/exotic world
    return (
      <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={planet.color} />
            <Stop offset="100%" stopColor="#8E44AD" />
          </LinearGradient>
        </Defs>
        <Circle cx="50" cy="50" r="45" fill="url(#crystalGrad)" />
        <Path d="M30,25 L40,35 L35,45 L25,40 Z" fill="#AB47BC" />
        <Path d="M65,30 L75,25 L80,40 L70,45 Z" fill="#CE93D8" />
        <Path d="M25,65 L35,70 L30,80 L20,75 Z" fill="#E1BEE7" />
        <Path d="M70,60 L80,65 L75,75 L65,70 Z" fill="#F3E5F5" />
        <Circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      </Svg>
    );
  }
  
  if (planet.color.includes('#F39C12')) {
    // Ice world
    return (
      <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E8F5E8" />
            <Stop offset="50%" stopColor={planet.color} />
            <Stop offset="100%" stopColor="#D68910" />
          </LinearGradient>
        </Defs>
        <Circle cx="50" cy="50" r="45" fill="url(#iceGrad)" />
        <Path d="M30,20 Q40,25 35,35 Q25,30 30,20" fill="rgba(255,255,255,0.6)" />
        <Path d="M70,25 Q80,30 75,40 Q65,35 70,25" fill="rgba(255,255,255,0.5)" />
        <Path d="M20,60 Q30,65 25,75 Q15,70 20,60" fill="rgba(255,255,255,0.7)" />
        <Path d="M75,65 Q85,70 80,80 Q70,75 75,65" fill="rgba(255,255,255,0.4)" />
        <Circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      </Svg>
    );
  }
  
  // Default rocky planet
  return (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="rockyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={planet.color} />
          <Stop offset="100%" stopColor={planet.secondaryColor || "#95A5A6"} />
        </LinearGradient>
      </Defs>
      <Circle cx="50" cy="50" r="45" fill="url(#rockyGrad)" />
      <Circle cx="35" cy="35" r="8" fill="rgba(0,0,0,0.2)" />
      <Circle cx="65" cy="25" r="5" fill="rgba(0,0,0,0.15)" />
      <Circle cx="25" cy="65" r="6" fill="rgba(0,0,0,0.1)" />
      <Circle cx="70" cy="70" r="7" fill="rgba(0,0,0,0.2)" />
      <Circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
    </Svg>
  );
}

export default function PlanetsScreen() {
  const { planets, loading, error } = usePlanets();
  
  const handlePlanetSelect = (planet: Planet) => {
    // Navigate to garden view with planet context
    router.push({
      pathname: '/home',
      params: { planetId: planet.id, planetName: planet.name }
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading planetary catalog...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load planets: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planetary Catalog</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Earth Section - Always at top */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>� Home World</Text>
          <Text style={styles.sectionSubtitle}>Your starting planet</Text>
          
          <TouchableOpacity
            style={[styles.planetCard, styles.earthCard]}
            onPress={() => handlePlanetSelect(earthPlanet)}
          >
            <View style={styles.planetIconContainer}>
              <PlanetIcon planet={earthPlanet} size={80} />
              <View style={styles.lifeBadge}>
                <Text style={styles.lifeBadgeText}>🌱</Text>
              </View>
            </View>
            
            <View style={styles.planetInfo}>
              <Text style={styles.planetName}>{earthPlanet.name}</Text>
              <Text style={styles.planetType}>{earthPlanet.type}</Text>
              
              <View style={styles.planetStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Radius</Text>
                  <Text style={styles.statValue}>{earthPlanet.radius}🌍</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Gravity</Text>
                  <Text style={styles.statValue}>{earthPlanet.gravity.toFixed(1)} m/s²</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Period</Text>
                  <Text style={styles.statValue}>{earthPlanet.orbitalPeriod}d</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.chevron}>
              <Text style={styles.chevronText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Discovered Planets Section */}
        {planets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌍 Discovered Worlds ({planets.length})</Text>
            <Text style={styles.sectionSubtitle}>Ready for cultivation</Text>
            
            {planets.map((planet) => (
              <TouchableOpacity
                key={planet.id}
                style={[styles.planetCard, styles.discoveredCard]}
                onPress={() => handlePlanetSelect(planet)}
              >
                <View style={styles.planetIconContainer}>
                  <PlanetIcon planet={planet} size={80} />
                  {planet.hasLife && (
                    <View style={styles.lifeBadge}>
                      <Text style={styles.lifeBadgeText}>🌱</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.planetInfo}>
                  <Text style={styles.planetName}>{planet.name}</Text>
                  <Text style={styles.planetType}>{planet.type}</Text>
                  
                  <View style={styles.planetStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Radius</Text>
                      <Text style={styles.statValue}>{planet.radius.toFixed(1)}🌍</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Gravity</Text>
                      <Text style={styles.statValue}>{planet.gravity.toFixed(1)} m/s²</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Period</Text>
                      <Text style={styles.statValue}>{planet.orbitalPeriod.toFixed(0)}d</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.chevron}>
                  <Text style={styles.chevronText}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty state */}
        {planets.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔭</Text>
            <Text style={styles.emptyTitle}>No Planets Discovered Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start by classifying anomalies to discover new worlds
            </Text>
          </View>
        )}

        {/* Footer spacer */}
        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginBottom: 20,
  },
  planetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  earthCard: {
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    borderColor: 'rgba(74, 144, 226, 0.4)',
    borderWidth: 2,
  },
  discoveredCard: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  planetIconContainer: {
    position: 'relative',
    marginRight: 15,
  },
  lifeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#27AE60',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lifeBadgeText: {
    fontSize: 12,
  },
  planetInfo: {
    flex: 1,
  },
  planetName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  planetType: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 15,
  },
  planetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  chevron: {
    marginLeft: 10,
  },
  chevronText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 24,
    fontWeight: '300',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footerSpacer: {
    height: 50,
  },
});