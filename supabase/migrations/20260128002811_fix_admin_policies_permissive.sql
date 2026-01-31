/*
  # Fix Admin Policies - Change to Permissive

  1. Changes
    - Drop RESTRICTIVE admin policies
    - Create PERMISSIVE admin policies instead
    - PERMISSIVE policies use OR logic: if ANY policy matches, access is granted
    - This allows admins to access everything while regular users can still access their own data

  2. Security
    - Maintains admin access control
    - Allows users to view/update their own profiles
    - Allows admins to view/update all profiles
*/

-- Drop restrictive admin policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create permissive admin policies
CREATE POLICY "Admins can view all profiles"
  ON profiles
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );
