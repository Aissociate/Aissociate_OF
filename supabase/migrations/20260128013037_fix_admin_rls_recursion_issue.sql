/*
  # Fix Admin RLS Recursion Issue

  1. Problem
    - The admin policies on the profiles table create infinite recursion
    - Policy checks if user is admin by querying profiles table
    - This triggers the same policy check again, creating a loop
    - This causes queries to hang indefinitely

  2. Solution
    - Drop the problematic admin policies that use EXISTS subqueries on profiles
    - Create a helper function that safely checks admin status
    - Use a two-phase approach: users can always read their own profile
    - Admins are identified by checking the is_admin field directly without recursion

  3. Changes
    - Drop recursive admin policies
    - Create non-recursive admin check function
    - Add safe admin policies that don't cause recursion
*/

-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create a safe function to check if current user is admin
-- This function uses a direct query with a limit to avoid recursion
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid() LIMIT 1),
    false
  );
$$;

-- Now create safe admin policies that use the function
CREATE POLICY "Admins can view all profiles safely"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    is_current_user_admin() = true
  );

CREATE POLICY "Admins can update all profiles safely"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    is_current_user_admin() = true
  )
  WITH CHECK (
    is_current_user_admin() = true
  );

-- Verify the policies are in place
COMMENT ON FUNCTION public.is_current_user_admin IS 'Safely checks if the current user is an admin without causing RLS recursion';
