# Godot Integration Setup

This folder contains components for integrating Godot Engine scenes into the React Native app.

## Current Status

✅ **Integration Complete** - The native Godot module is installed and configured!

### What's Working
- ✅ Native Godot module installed (`@borndotcom/react-native-godot`)
- ✅ Prebuilt libgodot frameworks downloaded
- ✅ Godot PCK files exported (`GodotTest.pck`, `GodotTest2.pck`)
- ✅ GodotView component with runtime detection
- ✅ UI for scene selection

### Next Steps
1. Add the build script to Xcode to bundle PCK files (see iOS Setup below)
2. Rebuild the app and test Godot scenes

## Installation Steps

### 1. ✅ Install React Native Godot

```bash
yarn add @borndotcom/react-native-godot
```

### 2. ✅ Download LibGodot Prebuilt Libraries

```bash
yarn godot:download-prebuilt
```

Or manually:
```bash
node ./node_modules/@borndotcom/react-native-godot/scripts/download-prebuilt.js
```

### 3. ✅ Export Godot Projects

The Godot scenes have already been set up in `/project` and `/project2`. To export them:

```bash
# Export all scenes for both platforms
yarn godot:export:all

# Or export individually
yarn godot:export:ios
yarn godot:export:android
```

### 4. ✅ Enable Native Godot Code

The native integration code is already enabled in:
- ✅ `/components/godot/GodotView.tsx` - Runtime detection and native view rendering

### 5. iOS Setup (Additional Steps)

#### A. Install CocoaPods dependencies

```bash
cd ios
pod install
cd ..
```

#### B. Add PCK files to Xcode project

The PCK files need to be bundled into your iOS app. You have two options:

**Option 1: Automatic (Recommended) - Build Script**

1. Open `ios/beegarden.xcworkspace` in Xcode
2. Select the `beegarden` project in the navigator
3. Select the `beegarden` target
4. Go to **Build Phases** tab
5. Click the **+** button and select **New Run Script Phase**
6. Drag the new phase to appear **before** "Compile Sources"
7. In the script text area, enter:
   ```bash
   "${SRCROOT}/scripts/copy-godot-packs.sh"
   ```
8. Name it "Copy Godot PCK Files" (click the phase header)
9. Check "Based on dependency analysis" (optional, for faster incremental builds)

**Option 2: Manual - Add to Bundle Resources**

1. Open `ios/beegarden.xcworkspace` in Xcode
2. In Finder, locate `ios/GodotTest.pck` and `ios/GodotTest2.pck`
3. Drag both `.pck` files into the Xcode project navigator
4. In the dialog:
   - ✅ Check "Copy items if needed"
   - ✅ Check the `beegarden` target
5. Verify in **Build Phases → Copy Bundle Resources** that both PCK files appear

#### C. Build the development client

```bash
npx expo run:ios
```

After the build completes, verify the PCK files are in the app bundle:

```bash
# Check the installed app (replace DerivedData path with yours)
ls -la ~/Library/Developer/Xcode/DerivedData/beegarden-*/Build/Products/Debug-iphonesimulator/beegarden.app/*.pck
```

You should see both `GodotTest.pck` and `GodotTest2.pck`.

### 6. Android Setup

The Android configuration should work automatically after running `yarn android`.

## Available Godot Scenes

1. **GodotTest (Scene 1)** - 🧊 3D Cube Scene
   - Location: `/project/`
   - Export: `GodotTest.pck` (iOS) / `GodotTest/` folder (Android)

2. **GodotTest2 (Scene 2)** - 🍩 3D Torus Scene
   - Location: `/project2/`
   - Export: `GodotTest2.pck` (iOS) / `GodotTest2/` folder (Android)

## Navigation

Access the Godot scenes page by:
1. Tapping the 🎮 game controller icon in the bottom navigation bar
2. Or navigating to `/godot` route programmatically

## Features

- ✅ Scene selection UI with cards
- ✅ Loading states and error handling
- ✅ Smooth navigation between scenes
- ✅ Integration with app navigation system
- 🚧 Actual Godot rendering (pending library installation)

## Troubleshooting

### If scenes don't load

1. Verify exports exist:
   ```bash
   ls -lh ios/*.pck
   ls -ld android/app/src/main/assets/GodotTest*
   ```

2. Re-export Godot projects:
   ```bash
   yarn godot:export:all
   ```

3. Check Godot version matches LibGodot version (4.5 stable)

### Platform-Specific Issues

**iOS:**
- Pack files (.pck) must be in `ios/` folder
- Bundle directory is automatically detected

**Android:**
- Scene folders must be in `android/app/src/main/assets/`
- Files are unpacked from zip during export

## Documentation

- [React Native Godot GitHub](https://github.com/migeran/react-native-godot)
- [LibGodot Documentation](https://github.com/migeran/libgodot)
- [Godot Engine Docs](https://docs.godotengine.org/)

## Support

For issues with:
- **Godot scenes**: Check `/project/` and `/project2/` folders
- **Export scripts**: See `/export_godot.sh` and wrapper scripts
- **React Native integration**: See this folder's components
