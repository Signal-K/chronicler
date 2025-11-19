import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GardenBottomBar } from '../components/garden/GardenBottomBar';
import { SimpleToolbar } from '../components/garden/SimpleToolbar';
import { GodotView } from '../components/godot';
import { GameHeader } from '../components/ui/GameHeader';

export default function GodotScreen() {
  const router = useRouter();
  const [selectedScene, setSelectedScene] = useState<'test1' | 'test2' | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <GameHeader 
        coins={0} 
        water={0} 
        maxWater={100}
        weather="sunny"
        onHarvestClick={() => {}}
        onShovelClick={() => {}}
        canHarvest={false}
        canShovel={false} 
        isHarvestSelected={false}
        isShovelSelected={false}
      />
      
      {/* Background gradient */}
      <LinearGradient 
        colors={['#1e293b', '#0f172a', '#020617']} 
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sceneContainer}>
          <Text style={styles.title}>🎮 Godot Scenes</Text>
          <Text style={styles.subtitle}>Choose a scene to play</Text>

          {!selectedScene ? (
            <View style={styles.sceneGrid}>
              {/* GodotTest Scene 1 */}
              <TouchableOpacity
                style={styles.sceneCard}
                onPress={() => setSelectedScene('test1')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#3b82f6', '#2563eb']}
                  style={styles.sceneCardGradient}
                >
                  <Text style={styles.sceneIcon}>🧊</Text>
                  <Text style={styles.sceneTitle}>Godot Test 1</Text>
                  <Text style={styles.sceneDescription}>3D Cube Scene</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* GodotTest Scene 2 */}
              <TouchableOpacity
                style={styles.sceneCard}
                onPress={() => setSelectedScene('test2')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#7c3aed']}
                  style={styles.sceneCardGradient}
                >
                  <Text style={styles.sceneIcon}>🍩</Text>
                  <Text style={styles.sceneTitle}>Godot Test 2</Text>
                  <Text style={styles.sceneDescription}>3D Torus Scene</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.viewerContainer}>
              {/* Back button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedScene(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.backButtonText}>← Back to Scenes</Text>
              </TouchableOpacity>

              {/* Godot View */}
              <View style={styles.godotViewContainer}>
                <GodotView sceneName={selectedScene} />
              </View>

              <Text style={styles.viewerInfo}>
                {selectedScene === 'test1' ? '🧊 3D Cube Scene' : '🍩 3D Torus Scene'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Toolbar with navigation */}
      <SimpleToolbar 
        selectedTool={null}
        onToolSelect={() => {}}
        onPlantSelect={() => {}}
        canTill={false}
        canPlant={false}
        canWater={false}
        canShovel={false}
        seedInventory={{}}
        currentRoute="godot"
        onNavigate={(route) => router.push(route as any)}
      />
      <GardenBottomBar 
        onOpenAlmanac={() => router.push('/home')}
        onOpenInventory={() => router.push('/home')}
        onOpenShop={() => router.push('/home')}
        onOpenSettings={() => router.push('/home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sceneContainer: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 32,
    textAlign: 'center',
  },
  sceneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    width: '100%',
  },
  sceneCard: {
    width: 160,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#1e293b',
  },
  sceneCardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  sceneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  sceneDescription: {
    fontSize: 12,
    color: '#e2e8f0',
    textAlign: 'center',
  },
  viewerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#475569',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  godotViewContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#1e293b',
  },
  viewerInfo: {
    marginTop: 16,
    fontSize: 18,
    color: '#cbd5e1',
    textAlign: 'center',
  },
});
