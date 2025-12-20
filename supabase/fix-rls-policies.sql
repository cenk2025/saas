-- Fix RLS policies for users table
-- The error "infinite recursion detected in policy" happens when a policy
-- references the same table it's protecting

-- First, drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

-- Disable RLS temporarily to allow service role to work
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled, create simple policies:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows service role to do everything
-- CREATE POLICY "Service role has full access" ON public.users
--   FOR ALL
--   TO service_role
--   USING (true)
--   WITH CHECK (true);

-- Create a policy for authenticated users to read their own data
-- CREATE POLICY "Users can read own data" ON public.users
--   FOR SELECT
--   TO authenticated
--   USING (auth.uid() = id);

-- Create a policy for authenticated users to update their own data
-- CREATE POLICY "Users can update own data" ON public.users
--   FOR UPDATE
--   TO authenticated
--   USING (auth.uid() = id)
--   WITH CHECK (auth.uid() = id);
