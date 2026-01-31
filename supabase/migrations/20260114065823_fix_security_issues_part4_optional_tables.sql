/*
  # Fix Security Issues - Part 4: Optional Tables

  ## Overview
  Updates RLS policies for tables that may or may not exist

  ## Changes
  Updates RLS policies for commercial_profiles, validation_attempts, and improvement_feedback
*/

-- =====================================================
-- COMMERCIAL_PROFILES (if exists)
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'commercial_profiles' AND policyname = 'Users can view own profile') THEN
    DROP POLICY "Users can view own profile" ON commercial_profiles;
    CREATE POLICY "Users can view own profile"
      ON commercial_profiles FOR SELECT
      TO authenticated
      USING (user_id = (select auth.uid()));
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'commercial_profiles' AND policyname = 'Users can update own profile') THEN
    DROP POLICY "Users can update own profile" ON commercial_profiles;
    CREATE POLICY "Users can update own profile"
      ON commercial_profiles FOR UPDATE
      TO authenticated
      USING (user_id = (select auth.uid()))
      WITH CHECK (user_id = (select auth.uid()));
  END IF;
END $$;

-- =====================================================
-- VALIDATION_ATTEMPTS (if exists)
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'validation_attempts' AND policyname = 'Users can view own validation attempts') THEN
    DROP POLICY "Users can view own validation attempts" ON validation_attempts;
    CREATE POLICY "Users can view own validation attempts"
      ON validation_attempts FOR SELECT
      TO authenticated
      USING (profile_id = (select auth.uid()));
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'validation_attempts' AND policyname = 'Users can submit validation attempts') THEN
    DROP POLICY "Users can submit validation attempts" ON validation_attempts;
    CREATE POLICY "Users can submit validation attempts"
      ON validation_attempts FOR INSERT
      TO authenticated
      WITH CHECK (profile_id = (select auth.uid()));
  END IF;
END $$;

-- =====================================================
-- IMPROVEMENT_FEEDBACK (if exists)
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'improvement_feedback' AND policyname = 'Users can view own feedback') THEN
    DROP POLICY "Users can view own feedback" ON improvement_feedback;
    CREATE POLICY "Users can view own feedback"
      ON improvement_feedback FOR SELECT
      TO authenticated
      USING (profile_id = (select auth.uid()));
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'improvement_feedback' AND policyname = 'Users can submit feedback') THEN
    DROP POLICY "Users can submit feedback" ON improvement_feedback;
    CREATE POLICY "Users can submit feedback"
      ON improvement_feedback FOR INSERT
      TO authenticated
      WITH CHECK (profile_id = (select auth.uid()));
  END IF;
END $$;