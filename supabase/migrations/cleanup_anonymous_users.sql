-- Cleanup script for anonymous users
-- Run this periodically to remove old anonymous accounts
-- Deletes anonymous users created more than 30 days ago

BEGIN;

DELETE FROM auth.users
WHERE is_anonymous IS TRUE 
  AND created_at < NOW() - INTERVAL '30 days';

COMMIT;

-- To run this manually in your Supabase SQL Editor:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Create a new query
-- 4. Paste and execute this script

-- You can also schedule this to run automatically using pg_cron
-- See: https://supabase.com/docs/guides/database/extensions/pg_cron
