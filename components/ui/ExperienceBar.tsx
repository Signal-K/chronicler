import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ExperienceBarProps {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progress: number; // 0-1 ratio
  showDetails?: boolean;
  compact?: boolean;
}

export function ExperienceBar({ 
  level, 
  currentXP, 
  nextLevelXP, 
  progress, 
  showDetails = true,
  compact = false 
}: ExperienceBarProps) {
  const progressPercentage = Math.round(progress * 100);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <Text style={styles.compactLevel}>Lv.{level}</Text>
          <Text style={styles.compactProgress}>{progressPercentage}%</Text>
        </View>
        <View style={styles.compactBarContainer}>
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={[styles.compactBarFill, { width: `${progressPercentage}%` }]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with level and progress */}
      <View style={styles.header}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {level}</Text>
          <View style={styles.levelBadge}>
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.levelBadgeGradient}
            >
              <Text style={styles.levelBadgeText}>{level}</Text>
            </LinearGradient>
          </View>
        </View>
        {showDetails && (
          <Text style={styles.xpText}>
            {currentXP} / {nextLevelXP} XP
          </Text>
        )}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={['#f59e0b', '#d97706', '#b45309']}
            style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {/* Shine effect */}
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
              style={styles.progressBarShine}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </LinearGradient>
        </View>
        
        {/* Progress percentage overlay */}
        <View style={styles.progressOverlay}>
          <Text style={styles.progressText}>{progressPercentage}%</Text>
        </View>
      </View>

      {showDetails && (
        <Text style={styles.detailText}>
          {nextLevelXP - currentXP} XP to next level
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  levelBadgeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#92400e',
    borderRadius: 16,
  },
  levelBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  xpText: {
    fontSize: 12,
    color: '#78350f',
    fontWeight: '600',
  },
  progressBarContainer: {
    position: 'relative',
    width: '100%',
    height: 20,
    marginBottom: 4,
  },
  progressBarBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#92400e',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  progressBarShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#78350f',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  detailText: {
    fontSize: 10,
    color: '#78350f',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Compact styles
  compactContainer: {
    width: '100%',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  compactLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400e',
  },
  compactProgress: {
    fontSize: 10,
    color: '#78350f',
    fontWeight: '600',
  },
  compactBarContainer: {
    height: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#92400e',
    overflow: 'hidden',
  },
  compactBarFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
  },
});