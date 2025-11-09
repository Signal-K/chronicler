# Environment Configuration Guide

## Overview

This project uses different Supabase instances for local development and production builds:

- **Local Development (`yarn start`)**: Uses local Supabase instance
- **Production Builds (`eas build`)**: Uses cloud Supabase instance

## Environment Files

### `.env.local` (Local Development)
Used for `yarn start` / `expo start` commands.

```bash
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### `.env.production` (Production Reference)
Reference file for production values (actual values used in EAS are in `eas.json`).

```bash
EXPO_PUBLIC_SUPABASE_URL=https://hlufptwhzkpkkjztimzo.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### `eas.json` (EAS Build Configuration)
Contains production environment variables for `eas build` command.

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://hlufptwhzkpkkjztimzo.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJ..."
      }
    }
  }
}
```

## How It Works

### Local Development

When you run `yarn start`:
1. Expo automatically loads `.env.local` (if it exists)
2. Falls back to `.env.production` if `.env.local` doesn't exist
3. The app connects to local Supabase at `http://127.0.0.1:54321`

### Production Builds

When you run `eas build`:
1. EAS ignores `.env` files
2. Uses environment variables defined in `eas.json` under `build.production.env`
3. The app connects to cloud Supabase at `https://hlufptwhzkpkkjztimzo.supabase.co`

## File Priority

Expo loads environment files in this order (first found wins):

1. `.env.local` (local development, git-ignored)
2. `.env.production` (production reference)
3. `.env` (base defaults)

## Usage in Code

Environment variables are accessed via `process.env`:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

## Important Notes

### Environment Variable Naming

- **Must start with `EXPO_PUBLIC_`** to be accessible in the app
- Example: `EXPO_PUBLIC_SUPABASE_URL` ✅
- Example: `SUPABASE_URL` ❌ (won't work)

### Git Configuration

`.env.local` should be git-ignored (already in `.gitignore`):
```
.env.local
```

### Testing Different Environments

**Test with local Supabase:**
```bash
yarn start
# Opens Expo with local Supabase (127.0.0.1:54321)
```

**Build for production:**
```bash
eas build --platform android
# Uses cloud Supabase from eas.json
```

## Troubleshooting

### Environment variables not loading

1. **Restart Metro bundler** after changing `.env` files:
   ```bash
   # Kill the terminal, then:
   yarn start
   ```

2. **Clear Expo cache**:
   ```bash
   expo start -c
   ```

3. **Verify variable names** start with `EXPO_PUBLIC_`

### Wrong Supabase instance connecting

1. **Check which env file is loaded**:
   - Add `console.log(process.env.EXPO_PUBLIC_SUPABASE_URL)` in `lib/supabase.ts`
   
2. **For local dev**: Ensure `.env.local` exists and has local URL

3. **For EAS builds**: Check `eas.json` has correct production values

## Configuration Files

- `app.config.js` - Expo configuration (uses app.json values)
- `app.json.bak` - Backup of original static config
- `lib/supabase.ts` - Supabase client initialization
- `eas.json` - EAS build configuration with production env vars

## Next Steps

If you need to add more environments (staging, etc.):

1. Create `.env.staging` file
2. Add corresponding build profile in `eas.json`:
   ```json
   {
     "build": {
       "staging": {
         "env": {
           "EXPO_PUBLIC_SUPABASE_URL": "https://staging.supabase.co",
           "EXPO_PUBLIC_SUPABASE_ANON_KEY": "..."
         }
       }
     }
   }
   ```
3. Build with: `eas build --profile staging`

---

**Last Updated:** November 2025
**Environment Setup:** ✅ Complete
