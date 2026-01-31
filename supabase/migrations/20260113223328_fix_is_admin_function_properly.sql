/*
  # Fix is_admin Function Properly

  1. Changes
    - Drop all policies that depend on is_admin()
    - Recreate is_admin function with proper RLS bypass using SQL language
    - Recreate all admin policies

  2. Security
    - Uses SECURITY DEFINER to run with elevated privileges
    - Function reads directly from profiles table without RLS recursion
*/

-- Drop all policies that depend on is_admin()
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON applications;
DROP POLICY IF EXISTS "Admins can view all training progress" ON training_progress;
DROP POLICY IF EXISTS "Admins can update all training progress" ON training_progress;
DROP POLICY IF EXISTS "Admins can view all fixer KPIs" ON kpis_fixer;
DROP POLICY IF EXISTS "Admins can insert fixer KPIs" ON kpis_fixer;
DROP POLICY IF EXISTS "Admins can update fixer KPIs" ON kpis_fixer;
DROP POLICY IF EXISTS "Admins can view all closer KPIs" ON kpis_closer;
DROP POLICY IF EXISTS "Admins can insert closer KPIs" ON kpis_closer;
DROP POLICY IF EXISTS "Admins can update closer KPIs" ON kpis_closer;
DROP POLICY IF EXISTS "Admins can view all feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can update all feedback" ON feedback;

-- Drop and recreate the is_admin function using SQL language to avoid recursion
DROP FUNCTION IF EXISTS is_admin() CASCADE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid() LIMIT 1),
    false
  );
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon;

-- Recreate all admin policies

-- Profiles table
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Applications table
CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Training progress table
CREATE POLICY "Admins can view all training progress"
  ON training_progress FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all training progress"
  ON training_progress FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- KPI Fixer table
CREATE POLICY "Admins can view all fixer KPIs"
  ON kpis_fixer FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert fixer KPIs"
  ON kpis_fixer FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update fixer KPIs"
  ON kpis_fixer FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- KPI Closer table
CREATE POLICY "Admins can view all closer KPIs"
  ON kpis_closer FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert closer KPIs"
  ON kpis_closer FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update closer KPIs"
  ON kpis_closer FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Feedback table
CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
