/*
  # Fix Security Issues - Part 2: RLS Policy Optimization

  ## Overview
  Optimizes RLS policies by wrapping auth functions with SELECT for better performance

  ## Changes
  All RLS policies using `auth.uid()` or `is_admin()` are updated to use 
  `(select auth.uid())` or `(select is_admin())` for better query performance at scale.

  ## Security Notes
  - All changes maintain existing access patterns while improving performance
  - No data loss or access changes for legitimate users
*/

-- =====================================================
-- PROFILES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- =====================================================
-- APPLICATIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own applications" ON applications;
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Users can create own applications" ON applications;
CREATE POLICY "Users can create own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = profile_id);

-- =====================================================
-- TRAINING_PROGRESS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own training progress" ON training_progress;
CREATE POLICY "Users can view own training progress"
  ON training_progress FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Users can update own training progress" ON training_progress;
CREATE POLICY "Users can update own training progress"
  ON training_progress FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = profile_id)
  WITH CHECK ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Users can insert own training progress" ON training_progress;
CREATE POLICY "Users can insert own training progress"
  ON training_progress FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = profile_id);

-- =====================================================
-- FEEDBACK
-- =====================================================

DROP POLICY IF EXISTS "Users can view own feedback" ON feedback;
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Users can create feedback" ON feedback;
CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = profile_id);

-- =====================================================
-- KPIS_FIXER
-- =====================================================

DROP POLICY IF EXISTS "Fixers can view own KPIs" ON kpis_fixer;
CREATE POLICY "Fixers can view own KPIs"
  ON kpis_fixer FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Fixers can insert own KPIs" ON kpis_fixer;
CREATE POLICY "Fixers can insert own KPIs"
  ON kpis_fixer FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = profile_id);

-- =====================================================
-- KPIS_CLOSER
-- =====================================================

DROP POLICY IF EXISTS "Closers can view own KPIs" ON kpis_closer;
CREATE POLICY "Closers can view own KPIs"
  ON kpis_closer FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Closers can insert own KPIs" ON kpis_closer;
CREATE POLICY "Closers can insert own KPIs"
  ON kpis_closer FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = profile_id);

-- =====================================================
-- FIXER_CONTACTS
-- =====================================================

DROP POLICY IF EXISTS "Fixers can view own contacts" ON fixer_contacts;
CREATE POLICY "Fixers can view own contacts"
  ON fixer_contacts FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Fixers can insert own contacts" ON fixer_contacts;
CREATE POLICY "Fixers can insert own contacts"
  ON fixer_contacts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Fixers can update own contacts" ON fixer_contacts;
CREATE POLICY "Fixers can update own contacts"
  ON fixer_contacts FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = profile_id)
  WITH CHECK ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Fixers can delete own contacts" ON fixer_contacts;
CREATE POLICY "Fixers can delete own contacts"
  ON fixer_contacts FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = profile_id);

-- =====================================================
-- CLOSER_LEADS
-- =====================================================

DROP POLICY IF EXISTS "Closers can view own leads" ON closer_leads;
CREATE POLICY "Closers can view own leads"
  ON closer_leads FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Closers can insert own leads" ON closer_leads;
CREATE POLICY "Closers can insert own leads"
  ON closer_leads FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Closers can update own leads" ON closer_leads;
CREATE POLICY "Closers can update own leads"
  ON closer_leads FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = profile_id)
  WITH CHECK ((select auth.uid()) = profile_id);

DROP POLICY IF EXISTS "Closers can delete own leads" ON closer_leads;
CREATE POLICY "Closers can delete own leads"
  ON closer_leads FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = profile_id);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (profile_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their notifications" ON notifications;
CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their notifications" ON notifications;
CREATE POLICY "Users can delete their notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (profile_id = (select auth.uid()));

-- =====================================================
-- OBJECTIVES
-- =====================================================

DROP POLICY IF EXISTS "Users can view their objectives" ON objectives;
CREATE POLICY "Users can view their objectives"
  ON objectives FOR SELECT
  TO authenticated
  USING (profile_id = (select auth.uid()) OR (select is_admin()));

-- =====================================================
-- BONUSES
-- =====================================================

DROP POLICY IF EXISTS "Users can view their bonuses" ON bonuses;
CREATE POLICY "Users can view their bonuses"
  ON bonuses FOR SELECT
  TO authenticated
  USING (profile_id = (select auth.uid()) OR (select is_admin()));

-- =====================================================
-- PROSPECTS
-- =====================================================

DROP POLICY IF EXISTS "Admins can insert prospects" ON prospects;
CREATE POLICY "Admins can insert prospects"
  ON prospects FOR INSERT
  TO authenticated
  WITH CHECK ((select is_admin()));

DROP POLICY IF EXISTS "Admins can read all prospects" ON prospects;
CREATE POLICY "Admins can read all prospects"
  ON prospects FOR SELECT
  TO authenticated
  USING ((select is_admin()));

DROP POLICY IF EXISTS "Admins can update prospects" ON prospects;
CREATE POLICY "Admins can update prospects"
  ON prospects FOR UPDATE
  TO authenticated
  USING ((select is_admin()))
  WITH CHECK ((select is_admin()));

DROP POLICY IF EXISTS "Admins can delete prospects" ON prospects;
CREATE POLICY "Admins can delete prospects"
  ON prospects FOR DELETE
  TO authenticated
  USING ((select is_admin()));