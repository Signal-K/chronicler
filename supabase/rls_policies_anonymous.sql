-- RLS Policies for Anonymous Users
-- These policies help distinguish between anonymous and permanent users

-- Example: Only permanent users can perform certain actions
-- Adjust table names and permissions based on your schema

-- Policy for classifications table (if it exists)
-- Allow anonymous users to view their own classifications
CREATE POLICY "Anonymous users can view their own classifications"
ON public.classifications
FOR SELECT
TO authenticated
USING (
  auth.uid() = author
);

-- Only permanent users can create classifications (optional - adjust as needed)
CREATE POLICY "Only permanent users can create classifications"
ON public.classifications
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt()->>'is_anonymous')::boolean IS FALSE
);

-- Allow anonymous users to update their profiles (for later conversion)
-- Adjust table name if you have a profiles table
-- CREATE POLICY "Users can update their own profile"
-- ON public.profiles
-- FOR UPDATE
-- TO authenticated
-- USING (auth.uid() = id);

-- Example: Shopping cart or game progress that both user types can access
-- CREATE POLICY "Authenticated users can manage their game data"
-- ON public.game_progress
-- FOR ALL
-- TO authenticated
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id);

-- Important Note:
-- Review and customize these policies based on your actual database schema
-- and application requirements. Anonymous users should have limited but
-- functional access to allow gameplay without signup.
