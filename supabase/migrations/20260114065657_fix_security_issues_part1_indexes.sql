/*
  # Fix Security Issues - Part 1: Indexes and Functions

  ## Overview
  Addresses critical security and performance issues:
  - Adds missing indexes on foreign keys
  - Secures function search paths

  ## Changes

  ### 1. Missing Indexes on Foreign Keys
  - `closer_kpi_targets.updated_by`
  - `notifications.dossier_id`
  - `prospects.imported_by`

  ### 2. Function Security
  - Secure function search paths for all public functions
*/

-- =====================================================
-- 1. ADD MISSING INDEXES ON FOREIGN KEYS
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_closer_kpi_targets_updated_by') THEN
    CREATE INDEX idx_closer_kpi_targets_updated_by ON closer_kpi_targets(updated_by);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_dossier_id') THEN
    CREATE INDEX idx_notifications_dossier_id ON notifications(dossier_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_prospects_imported_by') THEN
    CREATE INDEX idx_prospects_imported_by ON prospects(imported_by);
  END IF;
END $$;

-- =====================================================
-- 2. FIX FUNCTION SEARCH PATHS (Security)
-- =====================================================

ALTER FUNCTION get_next_closer() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION update_closer_assignment(uuid) SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION auto_assign_closer() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION update_dossier_last_activity() SECURITY DEFINER SET search_path = public, pg_temp;
ALTER FUNCTION update_expected_payment_date() SECURITY DEFINER SET search_path = public, pg_temp;