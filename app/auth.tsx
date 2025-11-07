import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const signUp = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Please check your email for verification link');
    }
    setIsLoading(false);
  };

  const signIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/home');
    }
    setIsLoading(false);
  };

  const signInAsGuest = async () => {
    setIsLoading(true);
    try {
      // Generate a random guest email and password
      const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const guestEmail = `guest_${randomId}@beegarden.app`;
      const guestPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      console.log('🔵 Creating guest account:', guestEmail);
      
      // Try to sign up as guest
      const { error: signUpError } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
        options: {
          data: {
            is_guest: true,
            display_name: 'Guest User'
          }
        }
      });

      if (signUpError) {
        console.error('🔵 Guest signup error:', signUpError);
        
        // If anonymous auth is enabled, try that as fallback
        const { error: anonError } = await supabase.auth.signInAnonymously();
        if (anonError) {
          console.error('🔵 Anonymous signin error:', anonError);
          throw anonError;
        }
      }

      console.log('🔵 Guest account created successfully');
      router.replace('/home');
    } catch (error: any) {
      console.error('🔵 Error creating guest account:', error);
      Alert.alert('Error', error?.message || 'Failed to create guest account. Please try signing up with an email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (isSignUp) {
      signUp();
    } else {
      signIn();
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/splash.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.overlay}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🐝 Bumble</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>{isSignUp ? 'Sign up' : 'Sign in'}</Text>
              <Text style={styles.subtitle}>
                {isSignUp 
                  ? 'Create your account to save your discoveries'
                  : 'Welcome back! Sign into Star Sailors'
                }
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />

              <TextInput
                style={styles.input}
                placeholder={isSignUp ? "Create Password" : "Enter Password"}
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />

              <TouchableOpacity 
                style={[styles.primaryButton, isLoading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or sign up via</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
                  <Text style={styles.socialButtonText}>📧 Google</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.skipButton, isLoading && styles.disabledButton]}
                onPress={signInAsGuest}
                disabled={isLoading}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>

              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                  {isSignUp ? 'Already Play Star Sailors? ' : "Don't have an account? "}
                </Text>
                <TouchableOpacity 
                  onPress={() => setIsSignUp(!isSignUp)}
                  disabled={isLoading}
                >
                  <Text style={styles.footerLink}>
                    {isSignUp ? 'Login' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ecee00',
  },
  formContainer: {
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 20,
    padding: 30,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  primaryButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 25,
  },
  primaryButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#ccc',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  socialButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  socialButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#ccc',
    fontSize: 14,
  },
  footerLink: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});