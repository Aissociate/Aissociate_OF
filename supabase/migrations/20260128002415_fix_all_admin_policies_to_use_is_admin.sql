/*
  # Fix All Admin Policies to Use is_admin Field

  1. Changes
    - Drop all policies that check role = 'admin'
    - Recreate them to check is_admin = true instead
    - This allows users with is_admin = true to access admin features

  2. Security
    - Maintains all existing security restrictions
    - Only changes the admin check from role field to is_admin boolean field
*/

-- Applications table
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
CREATE POLICY "Admins can view all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Blog articles
DROP POLICY IF EXISTS "Admins can read all articles" ON blog_articles;
CREATE POLICY "Admins can read all articles"
  ON blog_articles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Bonuses
DROP POLICY IF EXISTS "Admins can manage bonuses" ON bonuses;
CREATE POLICY "Admins can manage bonuses"
  ON bonuses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Closer assignments
DROP POLICY IF EXISTS "Admins can manage closer assignments" ON closer_assignments;
CREATE POLICY "Admins can manage closer assignments"
  ON closer_assignments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Closer KPI targets
DROP POLICY IF EXISTS "Admins can manage closer KPI targets" ON closer_kpi_targets;
CREATE POLICY "Admins can manage closer KPI targets"
  ON closer_kpi_targets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Feedback
DROP POLICY IF EXISTS "Admins can view all feedback" ON feedback;
CREATE POLICY "Admins can view all feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Fixer KPI targets
DROP POLICY IF EXISTS "Admins can manage fixer KPI targets" ON fixer_kpi_targets;
CREATE POLICY "Admins can manage fixer KPI targets"
  ON fixer_kpi_targets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- KPIs Closer
DROP POLICY IF EXISTS "Admins can view all closer KPIs" ON kpis_closer;
CREATE POLICY "Admins can view all closer KPIs"
  ON kpis_closer
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- KPIs Fixer
DROP POLICY IF EXISTS "Admins can view all fixer KPIs" ON kpis_fixer;
CREATE POLICY "Admins can view all fixer KPIs"
  ON kpis_fixer
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Objectives
DROP POLICY IF EXISTS "Admins can manage objectives" ON objectives;
CREATE POLICY "Admins can manage objectives"
  ON objectives
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Training progress
DROP POLICY IF EXISTS "Admins can view all training progress" ON training_progress;
DROP POLICY IF EXISTS "Admins can update all training progress" ON training_progress;

CREATE POLICY "Admins can view all training progress"
  ON training_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update all training progress"
  ON training_progress
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
