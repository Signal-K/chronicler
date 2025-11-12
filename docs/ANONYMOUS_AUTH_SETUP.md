# Supabase Anonymous Sign-Ins Setup Guide

## Enable Anonymous Sign-Ins in Dashboard

### Option 1: Via Authentication Settings
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Authentication** → **Providers**
4. Scroll to find **"Anonymous Sign-Ins"**
5. Toggle it **ON**
6. Click **Save**

### Option 2: Direct Link Format
```
https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/auth/providers
```

## Recommended Security Settings

### 1. Enable CAPTCHA Protection
To prevent abuse of anonymous sign-ins:

**Location**: Authentication → Settings → Security and Protection

**Options**:
- **Invisible CAPTCHA** (Google reCAPTCHA)
- **Cloudflare Turnstile** (recommended)

**Setup**:
1. Get API keys from your chosen provider
2. Add keys to Supabase dashboard
3. Enable for anonymous sign-ins

### 2. Configure Rate Limits
**Location**: Authentication → Rate Limits

**Default**: 30 requests/hour per IP for anonymous sign-ins
**Recommended**: Keep default or adjust based on your needs

## Database Configuration

### Row Level Security (RLS) Policies

Anonymous users use the `authenticated` role, so you need RLS policies to distinguish them.

**Check if user is anonymous**:
```sql
(auth.jwt()->>'is_anonymous')::boolean IS TRUE
```

**Example policies** are in `/supabase/rls_policies_anonymous.sql`

### Automatic Cleanup

Set up automatic cleanup of old anonymous users:

**Manual cleanup** (run in SQL Editor):
```sql
DELETE FROM auth.users
WHERE is_anonymous IS TRUE 
  AND created_at < NOW() - INTERVAL '30 days';
```

**Automated cleanup** (using pg_cron extension):
```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule weekly cleanup
SELECT cron.schedule(
  'cleanup-anonymous-users',
  '0 2 * * 0',  -- Every Sunday at 2 AM
  $$
  DELETE FROM auth.users
  WHERE is_anonymous IS TRUE 
    AND created_at < NOW() - INTERVAL '30 days';
  $$
);
```

## Testing

After enabling, test the anonymous sign-in:

```typescript
const { data, error } = await supabase.auth.signInAnonymously()

if (error) {
  console.error('Anonymous sign-in failed:', error.message)
} else {
  console.log('Anonymous user created:', data.user?.id)
  console.log('Is anonymous:', data.user?.is_anonymous) // Should be true
}
```

## Monitoring

### Dashboard Locations:
- **View anonymous users**: Authentication → Users (filter by anonymous)
- **Check sign-in attempts**: Authentication → Logs
- **Monitor rate limits**: Authentication → Rate Limits

### Identifying Anonymous Users:
- Look for users with `is_anonymous: true` in the users table
- No email or phone number
- Can still have metadata

## Converting Anonymous to Permanent Users

See the implementation in `/app/auth.tsx` - the `upgradeGuestAccount()` function handles this.

## Troubleshooting

### Error: "Anonymous sign-ins are disabled"
1. Check that you've saved the setting in the dashboard
2. Wait 1-2 minutes for changes to propagate
3. Clear your app cache and retry

### Users can't convert accounts
1. Ensure "Manual Linking" is enabled in Auth settings
2. Check that email/phone is verified before adding password

### Too many anonymous users
1. Enable CAPTCHA
2. Reduce rate limits
3. Run cleanup script more frequently

## Resources

- [Official Docs](https://supabase.com/docs/guides/auth/auth-anonymous)
- Local implementation: `/contexts/auth.tsx`
- Guest account upgrade: `/app/auth.tsx`
- Cleanup script: `/scripts/cleanup-guest-accounts.js`

---

*Last updated: November 12, 2025*
