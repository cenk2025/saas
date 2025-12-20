-- Delete the existing user (if any) and recreate with proper password
-- This script should be run in Supabase SQL Editor

-- First, delete from our custom users table
DELETE FROM public.users WHERE email = 'cenk@voon.fi';

-- Note: We cannot directly set passwords in auth.users via SQL for security reasons
-- Instead, we need to use Supabase Auth Admin API or create user via dashboard

-- After running this, go to Supabase Dashboard > Authentication > Users
-- Click "Add user" and create user with:
-- Email: cenk@voon.fi
-- Password: Cenk2025!
-- Auto Confirm User: YES (check this box)
