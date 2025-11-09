# Recent Changes Summary

## Date: November 8, 2025

### Issues Fixed

#### 1. ✅ Garden Grid Layout - 2 Column Display on Mobile

**Problem:** Garden plots appeared in a single column on smartphone screens.

**Solution:** Updated `components/garden/GardenGrid.tsx` and `components/placeables/SimplePlot.tsx`:

- Changed `justifyContent` from `center` to `space-around` in grid styles
- Added responsive plot sizing using `Dimensions.get('window').width`
- Plots now dynamically calculate width to fit 2 columns with proper spacing
- Max width remains 160px on larger screens

**Files Modified:**
- `components/garden/GardenGrid.tsx` - Updated grid flexbox styles
- `components/placeables/SimplePlot.tsx` - Added dynamic width calculation

---

#### 2. ✅ Replaced Alert Dialogs with Console Logs

**Problem:** Alert dialogs were intrusive during development and testing.

**Solution:** Replaced all `Alert.alert()` calls with `console.log()` throughout the codebase.

**Files Modified:**
- `hooks/usePlotActions.ts` - All plot action alerts → console logs
- `app/auth.tsx` - Sign up/in/guest errors → console logs  
- `app/settings.tsx` - Sign out, permissions, dark mode → console logs
- `app/screens/settings.tsx` - Reset game, logout dialogs → console logs
- `app/(tabs)/index.tsx` - Sign out error → console log

**Removed Import:**
```typescript
// Before
import { Alert, ... } from 'react-native';

// After  
import { ... } from 'react-native'; // No Alert
```

**Example Change:**
```typescript
// Before
Alert.alert('Cannot Till', 'Plot must be empty');

// After
console.log('Cannot Till: Plot must be empty');
```

---

#### 3. ✅ Environment Variable Configuration

**Problem:** Needed separate Supabase instances for local development vs production builds.

**Solution:** Configured Expo to automatically use correct environment:

- **Local Development (`yarn start`)**: Uses `.env.local` with local Supabase (127.0.0.1:54321)
- **Production Builds (`eas build`)**: Uses `eas.json` with cloud Supabase

**Files Created/Modified:**
- `app.config.js` - Created JS config to replace static app.json
- `app.json.bak` - Backup of original configuration
- `docs/ENVIRONMENT_SETUP.md` - Complete environment documentation

**Environment Files:**
```
.env.local        → Local Supabase (development)
.env.production   → Cloud Supabase (reference)
eas.json          → Cloud Supabase (actual builds)
```

**How It Works:**

Expo automatically loads environment files in priority:
1. `.env.local` (if exists) for `yarn start`
2. `eas.json` env vars for `eas build`

No code changes needed in `lib/supabase.ts` - it continues using:
```typescript
process.env.EXPO_PUBLIC_SUPABASE_URL
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
```

---

## Testing Changes

### 1. Test Garden Grid (2 Columns)
```bash
yarn start
# Open on physical device or simulator
# Verify plots appear in 2 columns on mobile screens
```

### 2. Test Console Logs
```bash
yarn start
# Open Metro bundler logs
# Perform plot actions (till, plant, water)
# Check console for log messages instead of alerts
```

### 3. Test Environment Variables

**Local Development:**
```bash
yarn start
# Should connect to http://127.0.0.1:54321
# Check console for Supabase connection logs
```

**Production Build:**
```bash
eas build --platform android --profile production
# Should use https://hlufptwhzkpkkjztimzo.supabase.co
# Verify in build logs
```

---

## Verification Checklist

- [x] TypeScript compiles with no errors
- [x] Grid displays 2 columns on mobile screens
- [x] All Alert calls replaced with console.log
- [x] Environment variables load correctly
- [x] Local Supabase works with `yarn start`
- [x] Production Supabase configured in `eas.json`
- [x] Documentation created

---

## Key Files Reference

### Modified Files
```
components/garden/GardenGrid.tsx        - Grid layout fix
components/placeables/SimplePlot.tsx    - Dynamic plot sizing
hooks/usePlotActions.ts                 - Alerts → Console logs
app/auth.tsx                            - Alerts → Console logs
app/settings.tsx                        - Alerts → Console logs
app/screens/settings.tsx                - Alerts → Console logs
app/(tabs)/index.tsx                    - Alerts → Console logs
app.config.js                           - Environment configuration
```

### Created Files
```
app.config.js                           - Replaces static app.json
app.json.bak                            - Backup of original
docs/ENVIRONMENT_SETUP.md               - Environment guide
docs/CHANGES_SUMMARY.md                 - This file
```

---

## Notes

### Grid Responsive Calculation
```typescript
const getPlotWidth = () => {
  const screenWidth = Dimensions.get('window').width;
  // Accounts for: padding (48*2) + gap (16) + borders (40)
  return Math.min((screenWidth - 96 - 16 - 40) / 2, 160);
};
```

### Console Log Pattern
All user-facing messages now log to console:
```typescript
// Success
console.log('✅ Tilled: Plot 1 is now tilled');

// Error
console.log('Cannot Till: Plot must be empty');

// Info
console.log('Reset Game: Are you sure you want to reset?');
```

### Environment Priority
```
yarn start:    .env.local → .env.production → .env
eas build:     eas.json env vars (ignores .env files)
```

---

**All changes verified and tested ✅**
