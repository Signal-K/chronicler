import * as FileSystem from 'expo-file-system/legacy';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface GodotHostViewProps {
  packName: string;
  projectPath: string;
}

function loadGodotBridge(): any {
  try {
    const moduleName = ['@borndotcom', 'react-native-godot'].join('/');
    const runtimeRequire = Function('return require')() as (name: string) => any;
    return runtimeRequire(moduleName);
  } catch {
    return null;
  }
}

export function GodotHostView({ packName, projectPath }: GodotHostViewProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [webExportReady, setWebExportReady] = useState<boolean | null>(null);
  const godotBridge = useMemo(() => loadGodotBridge(), []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    let mounted = true;
    fetch('/godot/index.html', { cache: 'no-store' })
      .then((response) => {
        if (!mounted) return;
        setWebExportReady(response.ok);
      })
      .catch(() => {
        if (!mounted) return;
        setWebExportReady(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    if (!godotBridge) {
      setErrorMessage('Godot bridge package is not installed yet.');
      return;
    }

    const { RTNGodot, runOnGodotThread } = godotBridge;

    if (RTNGodot.getInstance?.()) {
      return;
    }

    runOnGodotThread(() => {
      'worklet';

      if (Platform.OS === 'android') {
        RTNGodot.createInstance([
          '--verbose',
          '--path',
          projectPath,
          '--display-driver',
          'embedded',
          '--rendering-driver',
          'opengl3',
          '--rendering-method',
          'gl_compatibility',
        ]);
      } else {
        RTNGodot.createInstance([
          '--verbose',
          '--main-pack',
          String(FileSystem.bundleDirectory) + packName + '.pck',
          '--display-driver',
          'embedded',
          '--rendering-driver',
          'opengl3',
          '--rendering-method',
          'gl_compatibility',
        ]);
      }
    });

    return () => {
      runOnGodotThread(() => {
        'worklet';
        RTNGodot.destroyInstance();
      });
    };
  }, [godotBridge, packName, projectPath]);

  if (Platform.OS === 'web') {
    if (webExportReady === null) {
      return (
        <View style={styles.messageShell}>
          <Text style={styles.messageTitle}>Loading Godot Web Build...</Text>
          <Text style={styles.messageText}>Checking `/godot/index.html`</Text>
        </View>
      );
    }

    if (webExportReady) {
      const IFrame = 'iframe' as any;
      return (
        <View style={styles.webHostShell}>
          <IFrame
            title="Bee Garden Godot Web Build"
            src="/godot/index.html"
            style={styles.webIframe}
            allow="autoplay; fullscreen"
          />
        </View>
      );
    }

    return (
      <View style={styles.messageShell}>
        <Text style={styles.messageTitle}>Godot Web Build Missing</Text>
        <Text style={styles.messageText}>
          Export the Godot project for Web and place the output in `public/godot/`.
        </Text>
      </View>
    );
  }

  if (!godotBridge || errorMessage) {
    return (
      <View style={styles.messageShell}>
        <Text style={styles.messageTitle}>Godot Bridge Missing</Text>
        <Text style={styles.messageText}>{errorMessage ?? 'Unable to initialize Godot bridge.'}</Text>
      </View>
    );
  }

  const RTNGodotView = godotBridge.RTNGodotView;
  return <RTNGodotView style={StyleSheet.absoluteFillObject} />;
}

const styles = StyleSheet.create({
  messageShell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0f172a',
  },
  messageTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  messageText: {
    color: '#cbd5e1',
    textAlign: 'center',
    maxWidth: 460,
    lineHeight: 20,
  },
  webHostShell: {
    flex: 1,
    backgroundColor: '#000',
  },
  webIframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: '#000',
  },
});
