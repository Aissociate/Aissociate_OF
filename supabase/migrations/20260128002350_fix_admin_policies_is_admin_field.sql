/*
  # Fix Admin Policies to Use is_admin Field

  1. Changes
    - Drop existing RESTRICTIVE admin policies that check role = 'admin'
    - Create new RESTRICTIVE admin policies that check is_admin = true
    - This allows users with is_admin = true to access admin features regardless of their role field

  2. Security
    - Maintains restrictive policies for admin access
    - Properly checks the is_admin boolean field instead of role text field
*/

-- Drop old admin policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create new admin policies using is_admin field
CREATE POLICY "Admins can view all profiles"
  ON profiles
  AS RESTRICTIVE
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
  AS RESTRICTIVE
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );
