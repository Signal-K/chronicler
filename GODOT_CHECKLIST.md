# ✅ Godot Integration Checklist

## Completed ✅
- [x] Install `@borndotcom/react-native-godot` package
- [x] Download prebuilt libgodot frameworks
- [x] Run CocoaPods install
- [x] Export Godot projects to `.pck` files
- [x] Implement `GodotView.tsx` with native integration
- [x] Create build script `ios/scripts/copy-godot-packs.sh`
- [x] Verify PCK files exist:
  - [x] `ios/GodotTest.pck` (16K)
  - [x] `ios/GodotTest2.pck` (16K)

## Next: Xcode Setup ⏭️
- [ ] Open `ios/beegarden.xcworkspace` in Xcode
- [ ] Add "Copy Godot PCK Files" run script phase:
  - [ ] Click beegarden project → TARGETS → beegarden
  - [ ] Build Phases tab
  - [ ] + button → New Run Script Phase
  - [ ] Paste: `"${SRCROOT}/scripts/copy-godot-packs.sh"`
  - [ ] Drag phase BEFORE "Compile Sources"
  - [ ] Rename to "Copy Godot PCK Files"

## Next: Build & Test 🧪
- [ ] Rebuild iOS app: `npx expo run:ios`
- [ ] Wait for build to complete (watch for PCK copy messages)
- [ ] Verify PCK in bundle:
  ```bash
  ls -la ~/Library/Developer/Xcode/DerivedData/beegarden-*/Build/Products/Debug-iphonesimulator/beegarden.app/*.pck
  ```
- [ ] Open app in simulator
- [ ] Tap 🎮 game controller icon
- [ ] Select "GodotTest" scene
- [ ] Confirm 3D scene renders (cube rotating)
- [ ] Go back, select "GodotTest2"
- [ ] Confirm 3D torus renders

## Troubleshooting 🔧

### If black view / "Cannot open resource pack" error:
1. Check PCK files exported: `ls -lh ios/*.pck`
2. Re-export if missing: `yarn godot:export:ios`
3. Verify build script added in Xcode Build Phases
4. Check Xcode build log for script output
5. Rebuild: `npx expo run:ios`

### If build script not running:
1. Verify executable: `ls -l ios/scripts/copy-godot-packs.sh`
   - Should show `-rwxr-xr-x`
2. Make executable: `chmod +x ios/scripts/copy-godot-packs.sh`
3. Clean build: Product → Clean Build Folder in Xcode
4. Rebuild

### If Godot instance fails to start:
1. Check Metro logs for `[libgodot]` messages
2. Look for native logs: `[beegarden.debug.dylib]`
3. Verify PCK filename matches in `GodotView.tsx` (should be "GodotTest.pck")
4. Check bundle directory detection in logs

## Resources 📚
- `ios/QUICK_START.md` - 3-minute setup guide
- `ios/GODOT_SETUP.md` - Detailed troubleshooting
- `components/godot/README.md` - Full integration docs
- [React Native Godot Repo](https://github.com/migeran/react-native-godot)
- [LibGodot Releases](https://github.com/migeran/libgodot/releases)

## Current Status 📊

**Package versions:**
- @borndotcom/react-native-godot: installed ✅
- Godot Engine: 4.5.stable ✅
- libgodot: 4.5.1.migeran.2 ✅

**Build artifacts:**
- iOS PCK files: ✅ present
- Android assets: (not yet tested)
- Native frameworks: ✅ downloaded

**Next milestone:** 🎯 Add Xcode build phase → rebuild → test scenes

---

_Last updated: 2025-11-11_
