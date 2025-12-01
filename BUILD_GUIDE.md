# Build & Development Guide

## Quick Start

### Development (Simulator/Emulator)
```bash
yarn ios          # iOS Simulator
yarn android      # Android Emulator
yarn start        # Expo dev server
```

### Building for Real Devices
```bash
# Android APK
yarn build:android
# or
eas build --profile local --platform android

# iOS IPA
yarn build:ios
# or
eas build --profile local --platform ios
```

### Production Builds
```bash
yarn build:prod
# or
eas build --profile production --platform all
```

---

## Environment Configuration

### Local Development (Simulator/Emulator)
Uses **local Supabase**:
```bash
# Start local Supabase first
supabase start

# Configuration from .env.local
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Production/Test Builds
Uses **production Supabase**:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://hlufptwhzkpkkjztimzo.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## 🚨 Common Issues & Solutions

### Error: "SDK location not found"

**Problem:** Local builds can't find Android SDK.

**Solution:** Use cloud builds instead (remove `--local` flag):

```bash
# ❌ This fails (local build)
eas build --platform android --local

# ✅ This works (cloud build)
eas build --platform android
```

**Why cloud builds are better:**
- ✅ No SDK setup required
- ✅ Faster with parallel resources
- ✅ Consistent environment
- ✅ Works anywhere
- ✅ Better error logs

### Local Development Connecting to Production Supabase

Make sure:
1. Local Supabase is running: `supabase start`
2. `.env.local` exists with local credentials
3. Restart dev server: `yarn start`

### Build Using Wrong Supabase

- Local device testing: use `--profile local`
- Production release: use `--profile production`
- Check `eas.json` env variables

---

## Build Profiles

| Command | Profile | Supabase | Use Case |
|---------|---------|----------|----------|
| `yarn ios` | N/A | Local | Simulator testing |
| `yarn start` | N/A | Local | Development server |
| `eas build --profile local` | local | Production | Device testing (cloud) |
| `eas build --profile local --local` | local | Production | Device testing (local, requires SDK) |
| `eas build --profile production` | production | Production | Store submission |

---

## Cloud Build Process

When you run a cloud build:

1. **Upload** (~30s) - Code uploads to EAS servers
2. **Install** (~2min) - Dependencies installed
3. **Build** (~8min) - APK/IPA created
4. **Download** (~30s) - Build artifact available

**Total time:** 10-15 minutes for Android, 15-20 for iOS

### Finding Your Builds
- **Web Dashboard:** https://expo.dev/accounts/liamar/projects/bee-garden/builds
- **Auto-download:** EAS CLI prompts you
- **Manual:** Click link in terminal

---

## Local Builds (Advanced)

**⚠️ Only if cloud builds won't work for you**

### Prerequisites
- Android Studio with SDK installed
- `ANDROID_HOME` environment variable set
- Minimum 10GB free disk space
- All required SDK components

### Setup

1. **Configure environment (~/.zshrc):**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

2. **Reload shell:**
```bash
source ~/.zshrc
```

3. **Verify SDK:**
```bash
echo $ANDROID_HOME
sdkmanager --list_installed
```

4. **Build:**
```bash
eas build --profile local --platform android --local
```

**Note:** Local builds can fail due to path issues, missing components, or version mismatches. Cloud builds are more reliable.

---

## Configuration Files

### `app.config.js`
- iOS bundle ID: `com.liamar.beegarden`
- Android package: `com.liamar.beegarden`
- EAS project ID: `b023fdbd-4786-435d-aa7c-329d63ed87e2`

### `eas.json`
Build profiles:
- **development**: Dev client with local distribution
- **preview**: Internal preview builds
- **local**: Device testing with production Supabase
- **production**: Store submission builds

### `.env.local` (not committed)
- Local Supabase credentials
- Used for simulator/emulator

### `.env.production` (committed)
- Production Supabase credentials
- Used for all builds

---

## Godot Integration

### Export Godot Projects
```bash
# All platforms
yarn godot:export:all

# iOS only
yarn godot:export:ios

# Android only
yarn godot:export:android
```

See `GODOT_CHECKLIST.md` and `docs/GODOT_INTEGRATION.md` for setup details.

---

## Troubleshooting

### Build Script Issues
```bash
# Make script executable
chmod +x ios/scripts/copy-godot-packs.sh

# Verify
ls -l ios/scripts/copy-godot-packs.sh
```

### Clean Builds
```bash
# iOS
cd ios && rm -rf build && cd ..
npx expo run:ios

# Android
cd android && ./gradlew clean && cd ..
npx expo run:android
```

### EAS Build Issues
```bash
# Clear EAS cache
eas build --clear-cache

# Check build status
eas build:list

# View build logs
eas build:view [build-id]
```

---

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Build Profiles](https://docs.expo.dev/build/eas-json/)
- [Local Builds Guide](https://docs.expo.dev/build-reference/local-builds/)
- [Expo Development](https://docs.expo.dev/develop/development-builds/introduction/)

---

**Last Updated:** November 2025
