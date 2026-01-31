/*
  # Fix Security Issues - Part 3: RLS for Dossiers and Related Tables

  ## Overview
  Optimizes RLS policies for dossiers and related tables

  ## Changes
  Updates RLS policies for dossiers, comments, related contacts, and KPI targets
*/

-- =====================================================
-- DOSSIERS
-- =====================================================

DROP POLICY IF EXISTS "Fixers can view their dossiers" ON dossiers;
CREATE POLICY "Fixers can view their dossiers"
  ON dossiers FOR SELECT
  TO authenticated
  USING (fixer_id = (select auth.uid()) OR closer_id = (select auth.uid()) OR (select is_admin()));

DROP POLICY IF EXISTS "Fixers can insert their dossiers" ON dossiers;
CREATE POLICY "Fixers can insert their dossiers"
  ON dossiers FOR INSERT
  TO authenticated
  WITH CHECK (fixer_id = (select auth.uid()));

DROP POLICY IF EXISTS "Fixers can update their dossiers" ON dossiers;
CREATE POLICY "Fixers can update their dossiers"
  ON dossiers FOR UPDATE
  TO authenticated
  USING (fixer_id = (select auth.uid()) OR closer_id = (select auth.uid()) OR (select is_admin()))
  WITH CHECK (fixer_id = (select auth.uid()) OR closer_id = (select auth.uid()) OR (select is_admin()));

-- =====================================================
-- DOSSIER_COMMENTS
-- =====================================================

DROP POLICY IF EXISTS "Users can view comments on their dossiers" ON dossier_comments;
CREATE POLICY "Users can view comments on their dossiers"
  ON dossier_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dossiers d 
      WHERE d.id = dossier_id 
      AND (d.fixer_id = (select auth.uid()) OR d.closer_id = (select auth.uid()) OR (select is_admin()))
    )
  );

DROP POLICY IF EXISTS "Users can create comments on their dossiers" ON dossier_comments;
CREATE POLICY "Users can create comments on their dossiers"
  ON dossier_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id = (select auth.uid()) 
    AND EXISTS (
      SELECT 1 FROM dossiers d 
      WHERE d.id = dossier_id 
      AND (d.fixer_id = (select auth.uid()) OR d.closer_id = (select auth.uid()) OR (select is_admin()))
    )
  );

DROP POLICY IF EXISTS "Users can update their own comments" ON dossier_comments;
CREATE POLICY "Users can update their own comments"
  ON dossier_comments FOR UPDATE
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

DROP POLICY IF EXISTS "Admins can delete any comment" ON dossier_comments;
CREATE POLICY "Admins can delete any comment"
  ON dossier_comments FOR DELETE
  TO authenticated
  USING ((select is_admin()));

-- =====================================================
-- RELATED_CONTACTS
-- =====================================================

DROP POLICY IF EXISTS "Users can view related contacts of their dossiers" ON related_contacts;
CREATE POLICY "Users can view related contacts of their dossiers"
  ON related_contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dossiers d 
      WHERE d.id = dossier_id 
      AND (d.fixer_id = (select auth.uid()) OR d.closer_id = (select auth.uid()) OR (select is_admin()))
    )
  );

DROP POLICY IF EXISTS "Users can create related contacts for their dossiers" ON related_contacts;
CREATE POLICY "Users can create related contacts for their dossiers"
  ON related_contacts FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM dossiers d 
      WHERE d.id = dossier_id 
      AND (d.fixer_id = (select auth.uid()) OR d.closer_id = (select auth.uid()) OR (select is_admin()))
    )
  );

DROP POLICY IF EXISTS "Users can update related contacts of their dossiers" ON related_contacts;
CREATE POLICY "Users can update related contacts of their dossiers"
  ON related_contacts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dossiers d 
      WHERE d.id = dossier_id 
      AND (d.fixer_id = (select auth.uid()) OR d.closer_id = (select auth.uid()) OR (select is_admin()))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dossiers d 
      WHERE d.id = dossier_id 
      AND (d.fixer_id = (select auth.uid()) OR d.closer_id = (select auth.uid()) OR (select is_admin()))
    )
  );

DROP POLICY IF EXISTS "Users can delete related contacts of their dossiers" ON related_contacts;
CREATE POLICY "Users can delete related contacts of their dossiers"
  ON related_contacts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dossiers d 
      WHERE d.id = dossier_id 
      AND (d.fixer_id = (select auth.uid()) OR d.closer_id = (select auth.uid()) OR (select is_admin()))
    )
  );

-- =====================================================
-- FIXER_KPI_TARGETS - Remove duplicates
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage all KPI targets" ON fixer_kpi_targets;
DROP POLICY IF EXISTS "Fixers can view their own targets" ON fixer_kpi_targets;

DROP POLICY IF EXISTS "Fixers can view fixer KPI targets" ON fixer_kpi_targets;
CREATE POLICY "Fixers can view fixer KPI targets"
  ON fixer_kpi_targets FOR SELECT
  TO authenticated
  USING ((select is_admin()) OR true);

-- =====================================================
-- CLOSER_KPI_TARGETS
-- =====================================================

DROP POLICY IF EXISTS "Closers can view closer KPI targets" ON closer_kpi_targets;
CREATE POLICY "Closers can view closer KPI targets"
  ON closer_kpi_targets FOR SELECT
  TO authenticated
  USING ((select is_admin()) OR true);