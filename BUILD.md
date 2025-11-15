# Build Configuration Guide

## Environment Setup

This project uses different Supabase configurations for local development vs production builds:

### Local Development (Simulator/Emulator)

When running `yarn ios` or `yarn start`, the app uses **local Supabase**:

```bash
# Start local Supabase first
supabase start

# Configuration loaded from .env.local
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### Production/Test Builds

When building for real devices or distribution, the app uses **production Supabase**:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://hlufptwhzkpkkjztimzo.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsdWZwdHdoemtwa2tqenRpbXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyOTk3NTUsImV4cCI6MjAzMTg3NTc1NX0.v_NDVWjIU_lJQSPbJ_Y6GkW3axrQWKXfXVsBEAbFv_I
```

## Build Commands

### ⚠️ Important: Local vs Cloud Builds

**Local builds** (`--local` flag) require:
- Full Android SDK installation and configuration
- Xcode and command line tools (for iOS)
- 10GB+ free disk space
- Can fail due to SDK path issues

**Cloud builds** (recommended):
- No local SDK required
- Faster and more reliable
- Consistent build environment
- Just remove the `--local` flag

### Cloud Builds (Recommended - for testing on real devices)

Build iOS and Android in the cloud with production Supabase:

```bash
# Build both platforms
eas build --profile local --platform all

# Build iOS only
eas build --profile local --platform ios

# Build Android only  
eas build --profile local --platform android
```

### Production Builds (for App Store/Play Store)

```bash
# Build both platforms for production
eas build --profile production --platform all

# Build iOS for App Store
eas build --profile production --platform ios

# Build Android for Play Store
eas build --profile production --platform android
```

## Configuration Files

### `app.config.js`
- Contains iOS bundle identifier: `com.liamar.beegarden`
- Contains Android package name: `com.liamar.beegarden`
- EAS project ID: `b023fdbd-4786-435d-aa7c-329d63ed87e2`

### `eas.json`
- **development**: Development client builds with local distribution
- **preview**: Internal preview builds
- **local**: Local builds with production Supabase (for device testing)
- **production**: Production builds with auto-increment and production Supabase

### `.env.local` (not committed)
- Local Supabase credentials for simulator/emulator
- Automatically loaded during `expo start`

### `.env.production` (committed)
- Production Supabase credentials
- Used as fallback for builds

## Troubleshooting

### Error: "ios.bundleIdentifier" is not defined
✅ **Fixed** - Bundle identifier is now in `app.config.js`

### Local development connecting to production Supabase
Make sure:
1. Local Supabase is running: `supabase start`
2. `.env.local` exists with local credentials
3. Restart Expo dev server: `yarn start`

### Build using wrong Supabase instance
- Local builds should use `--profile local`
- Production builds should use `--profile production`
- Check `eas.json` env variables match your intent

## Quick Reference

| Command | Profile | Supabase | Use Case |
|---------|---------|----------|----------|
| `yarn ios` | N/A | Local | Simulator testing |
| `eas build --profile local` | local | Production | Device testing (cloud build) |
| `eas build --profile local --local` | local | Production | Device testing (local build, requires SDK) |
| `eas build --profile production` | production | Production | Store submission |

## 🚨 Current Error Fix

If you see `SDK location not found` error, it means local builds can't find your Android SDK.

**Solution: Use cloud builds instead:**

```bash
# Remove the --local flag to use cloud builds
eas build --profile local --platform android

# This will:
# ✅ Upload your project to EAS
# ✅ Build in a clean environment  
# ✅ Use production Supabase
# ✅ Download APK when done (~10-15 min)
```

**Why this happens:**
- Local builds create a temporary directory
- Android SDK path gets lost in the temporary build environment
- Cloud builds have everything pre-configured
