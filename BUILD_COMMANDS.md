# Quick Build Commands Reference

## 🚀 Recommended: EAS Cloud Builds (No SDK Required)

### Production Builds (for App Store/Play Store)
```bash
# Android APK for testing
eas build --profile production --platform android

# iOS for TestFlight/App Store
eas build --profile production --platform ios

# Both platforms
eas build --profile production --platform all
```

### Local Testing Build (Cloud)
```bash
# Android for device testing
eas build --profile local --platform android

# iOS for device testing  
eas build --profile local --platform ios
```

**Benefits:**
- ✅ No Android SDK or Xcode required locally
- ✅ Consistent build environment
- ✅ Faster builds (parallel cloud resources)
- ✅ Build logs saved automatically
- ✅ Easy artifact download

---

## 🛠️ Local Builds (Requires Full SDK Setup)

**⚠️ Prerequisites:**
- Android Studio with SDK installed
- `ANDROID_HOME` environment variable set
- All required SDK components installed
- Minimum 10GB free disk space

### Setup for Local Builds

1. **Ensure Android SDK is properly configured:**
```bash
# Check ANDROID_HOME
echo $ANDROID_HOME

# Should output: /Users/scroobz/Library/Android/sdk
```

2. **Add to your shell profile (~/.zshrc or ~/.bash_profile):**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

3. **Reload shell:**
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

4. **Verify SDK components:**
```bash
sdkmanager --list_installed
```

### Run Local Builds
```bash
# Android local build
eas build --profile local --platform android --local

# iOS local build (requires Xcode)
eas build --profile local --platform ios --local
```

**Note:** Local builds can fail due to:
- Missing SDK components
- Path issues
- Version mismatches
- Temporary directory permissions

---

## 🎯 Current Issue Solution

Your Android SDK is installed but EAS local builds can't find it in the temporary build directory.

**Quick Fix: Use cloud builds instead:**
```bash
# This will work without any local SDK setup
eas build --profile local --platform android
```

The build will:
1. Upload your project to EAS servers
2. Build in a clean environment with all required tools
3. Download the APK when complete
4. Take about 10-15 minutes

**Or if you really need local builds:**

Create `android/local.properties`:
```bash
mkdir -p android
echo "sdk.dir=/Users/scroobz/Library/Android/sdk" > android/local.properties
```

But note: The `android/` folder gets regenerated each build, so this won't persist.

---

## 📱 Development Workflow

### For Testing (Simulator/Emulator)
```bash
# Uses local Supabase
yarn ios          # iOS Simulator
yarn android      # Android Emulator
```

### For Device Testing (Real Device)
```bash
# Uses production Supabase, built in cloud
eas build --profile local --platform android
eas build --profile local --platform ios
```

### For Production Release
```bash
# Uses production Supabase, optimized builds
eas build --profile production --platform all
```

---

## 🔄 Troubleshooting

### "SDK location not found"
→ Use cloud builds: `eas build --platform android` (remove `--local` flag)

### "Build taking too long"
→ Cloud builds are faster than local for first-time builds

### "Out of build minutes"
→ Check your EAS account quota at https://expo.dev/accounts/[username]/settings/billing

### "Wrong Supabase instance"
→ Check `eas.json` env variables for the profile you're using

---

## 💡 Pro Tips

1. **Always use cloud builds for production** - More reliable, better logs
2. **Use `--profile local` for device testing** - Same production config, faster iteration
3. **Use simulator/emulator for development** - Instant feedback, local Supabase
4. **Save build artifacts** - Download APK/IPA files for distribution

## 📚 Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Build Profiles](https://docs.expo.dev/build/eas-json/)
- [Local Builds Guide](https://docs.expo.dev/build-reference/local-builds/)
