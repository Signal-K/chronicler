# 🚨 QUICK FIX: SDK Location Not Found Error

## The Problem
Local builds fail with: `SDK location not found`

## The Solution ✅

**Use cloud builds instead of local builds** - Remove the `--local` flag:

```bash
# ❌ This fails (local build)
eas build --platform android --local

# ✅ This works (cloud build)
eas build --platform android
```

## Quick Commands

### For Testing on Real Devices (Cloud)
```bash
# Android APK (recommended)
yarn build:android
# or
eas build --profile local --platform android

# iOS IPA
yarn build:ios  
# or
eas build --profile local --platform ios
```

### Interactive Build Menu
```bash
yarn build
# or
./build.sh
```

### For Production Release
```bash
yarn build:prod
# or
eas build --profile production --platform all
```

## Why Cloud Builds Are Better

| Cloud Builds | Local Builds |
|--------------|--------------|
| ✅ No SDK setup required | ❌ Requires full Android SDK |
| ✅ Faster (parallel resources) | ❌ Slower on first build |
| ✅ Consistent environment | ❌ Can break with updates |
| ✅ Works anywhere | ❌ Needs powerful machine |
| ✅ Better error logs | ❌ Complex troubleshooting |

## What Happens During Cloud Build

1. **Upload** (~30s) - Your code goes to EAS servers
2. **Install** (~2min) - Dependencies installed
3. **Build** (~8min) - APK/IPA created
4. **Download** (~30s) - Build artifact available

**Total time:** About 10-15 minutes for Android, 15-20 for iOS

## Build Locations

After build completes, find your APK/IPA:
- **Web Dashboard:** https://expo.dev/accounts/liamar/projects/bee-garden/builds
- **Auto-download:** EAS CLI will prompt you
- **Manual download:** Click link in terminal or dashboard

## Environment Used

All builds use **production Supabase**:
- URL: `https://hlufptwhzkpkkjztimzo.supabase.co`
- Configured in `eas.json` for each profile

## Still Want Local Builds?

If you really need local builds:

1. Ensure Android Studio is fully installed
2. Set environment variables in `~/.zshrc`:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
3. Reload shell: `source ~/.zshrc`
4. Try: `eas build --profile local --platform android --local`

**Note:** Even with proper setup, local builds can still fail due to path issues in the temporary build directory.
