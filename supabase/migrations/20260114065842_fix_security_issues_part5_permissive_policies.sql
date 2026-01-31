/*
  # Fix Security Issues - Part 5: Fix Overly Permissive Policies

  ## Overview
  Fixes RLS policies that are overly permissive

  ## Changes
  - Restricts candidates table policy to anon role only
  - Removes "System can create notifications" policy (too permissive)
*/

-- =====================================================
-- Fix overly permissive policy on CANDIDATES
-- =====================================================

DROP POLICY IF EXISTS "Anyone can submit application" ON candidates;

CREATE POLICY "Anon can submit application"
  ON candidates FOR INSERT
  TO anon
  WITH CHECK (true);

-- =====================================================
-- Remove overly permissive notification policy
-- =====================================================

DROP POLICY IF EXISTS "System can create notifications" ON notifications;