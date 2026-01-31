/*
  # Fix RLS Infinite Recursion

  1. Changes
    - Drop existing policies that cause recursion
    - Create helper function to check admin status
    - Recreate policies using the helper function

  2. Security
    - Function uses security definer to bypass RLS during admin check
    - Maintains same security guarantees without recursion
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON applications;
DROP POLICY IF EXISTS "Admins can view all training progress" ON training_progress;
DROP POLICY IF EXISTS "Admins can update all training progress" ON training_progress;

-- Create helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$;

-- Recreate admin policies using the helper function

-- Profiles table policies
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Applications table policies
CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Training progress table policies
CREATE POLICY "Admins can view all training progress"
  ON training_progress FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all training progress"
  ON training_progress FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());