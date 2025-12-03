import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../contexts/auth';

export default function InitialRoute() {
  const { session, loading } = useAuth();

  useEffect(() => {
    console.log('🔄 InitialRoute - loading:', loading, 'session:', !!session);
    if (!loading) {
      if (session) {
        console.log('➡️ Navigating to /home');
        router.replace('/home');
      } else {
        console.log('➡️ Navigating to /auth');
        router.replace('/auth');
      }
    }
  }, [session, loading]);

  // Show loading screen while determining authentication state
  console.log('🔄 Rendering InitialRoute loading screen');
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B35" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});