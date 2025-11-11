import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

// We'll try to require the native module at runtime so this file works in JS-only environments
let RTNGodot: any = null;
let RTNGodotView: any = null;
let runOnGodotThread: any = null;
try {
  // Dynamic require for optional native module - if not installed, we fall back to placeholder
  // @ts-ignore
  const godot = require('@borndotcom/react-native-godot');
  RTNGodot = godot.RTNGodot;
  RTNGodotView = godot.RTNGodotView;
  runOnGodotThread = godot.runOnGodotThread;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (_e) {
  // native module not installed — keep placeholders
}

interface GodotViewProps {
  sceneName: 'test1' | 'test2';
}

export function GodotView({ sceneName }: GodotViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasNative = !!RTNGodotView && !!RTNGodot && !!runOnGodotThread;

  useEffect(() => {
    initializeGodot();

    return () => {
      // Cleanup: destroy Godot instance when component unmounts
      cleanupGodot();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneName]);

  const initializeGodot = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!hasNative) {
        // Native module not available — skip initialization but keep UX consistent
        setTimeout(() => setIsLoading(false), 600);
        return;
      }

      // initialize a Godot instance on the native side
      const packName = sceneName === 'test1' ? 'GodotTest' : 'GodotTest2';

      // For Android the exporter unzips into assets/<packName>/
      // For iOS the PCK must be in the main bundle with absolute path
      const args: string[] = ['--verbose'];
      if (Platform.OS === 'android') {
        args.push('--path', `/${packName}`);
      } else {
        // iOS: Use FileSystem.bundleDirectory to get the full path to the PCK file
        args.push('--main-pack', FileSystem.bundleDirectory + `${packName}.pck`);
      }

      console.log('Godot args:', args);

      // Enable some sensible defaults for embedded rendering
      args.push('--rendering-driver', 'opengl3');
      args.push('--rendering-method', 'gl_compatibility');
      args.push('--display-driver', 'embedded');

      console.log('Full Godot createInstance args:', args);

      // run creation on the godot thread using the provided helper
      try {
        runOnGodotThread(() => {
          'worklet';
          // @ts-ignore - RTNGodot is provided by the native package
          RTNGodot.createInstance(args);
        });

        // small delay while the native instance spins up
        setTimeout(() => setIsLoading(false), 400);
      } catch (e) {
        console.error('Error creating native Godot instance:', e);
        setError('Failed to initialize native Godot engine');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Failed to initialize Godot:', err);
      setError('Failed to load Godot scene');
      setIsLoading(false);
    }
  };

  const cleanupGodot = () => {
    if (!hasNative) return;
    try {
      runOnGodotThread(() => {
        'worklet';
        RTNGodot.destroyInstance();
      });
    } catch (e) {
      console.warn('Failed to destroy Godot instance:', e);
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Please ensure @borndotcom/react-native-godot is installed and linked
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading Godot Scene...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* If native module is available render the native Godot view, otherwise show placeholder */}
      {hasNative && RTNGodotView ? (
        // @ts-ignore - RTNGodotView is the native view component
        <RTNGodotView style={styles.godotView} />
      ) : null}

      {!hasNative && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>
            {sceneName === 'test1' ? '🧊' : '🍩'}
          </Text>
          <Text style={styles.placeholderTitle}>
            {sceneName === 'test1' ? 'Godot Test 1' : 'Godot Test 2'}
          </Text>
          <Text style={styles.placeholderText}>Godot scene will appear here</Text>
          <Text style={styles.placeholderSubtext}>
            Install @borndotcom/react-native-godot and run pod install (iOS) / rebuild (Android)
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  godotView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
});
