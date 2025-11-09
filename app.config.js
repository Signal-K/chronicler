// Expo configuration with environment variable support
// 
// Environment loading behavior:
// - Local development (`yarn start`): Automatically loads from .env.local if it exists
// - EAS builds (`eas build`): Uses environment variables from eas.json
//
// Expo automatically loads .env files in this priority order:
// 1. .env.local (local development only, not committed)
// 2. .env.production (production builds)
// 3. .env (base defaults)

module.exports = {
  expo: {
    name: "bee-garden",
    slug: "bee-garden",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "beegarden",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.liamar.beegarden",
      versionCode: 1,
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ],
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "b023fdbd-4786-435d-aa7c-329d63ed87e2"
      }
    }
  }
};
