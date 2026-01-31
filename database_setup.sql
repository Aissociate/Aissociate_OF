-- =====================================================
-- AISSOCIATE ONBOARDING DATABASE SCHEMA
-- =====================================================
-- This SQL file creates the complete database schema
-- for the Aissociate commercial onboarding system.
--
-- Execute this in your Supabase SQL Editor to set up
-- all tables, policies, and indexes.
-- =====================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text CHECK (role IN ('fixer', 'closer')),
  status text DEFAULT 'applicant' CHECK (status IN ('applicant', 'framework_accepted', 'in_training', 'validated', 'active', 'rejected')),
  experience text,
  availability text,
  motivation text,
  framework_accepted_at timestamptz,
  training_completed_at timestamptz,
  validated_at timestamptz,
  activated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role_desired text NOT NULL CHECK (role_desired IN ('fixer', 'closer')),
  experience text NOT NULL,
  availability text NOT NULL,
  motivation text NOT NULL,
  ethical_framework_accepted boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create training_progress table
CREATE TABLE IF NOT EXISTS training_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  module_common_completed boolean DEFAULT false,
  module_role_completed boolean DEFAULT false,
  quiz_score integer DEFAULT 0,
  quiz_passed boolean DEFAULT false,
  test_call_url text,
  test_call_validated boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create kpis_fixer table
CREATE TABLE IF NOT EXISTS kpis_fixer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  contacts_per_day integer DEFAULT 0,
  appointments_booked integer DEFAULT 0,
  no_show_rate decimal(5,2) DEFAULT 0,
  qualified_appointments integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, date)
);

-- Create kpis_closer table
CREATE TABLE IF NOT EXISTS kpis_closer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  conversion_rate decimal(5,2) DEFAULT 0,
  average_cart decimal(10,2) DEFAULT 0,
  closing_delay_days integer DEFAULT 0,
  satisfaction_score decimal(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, date)
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('objection', 'script_improvement', 'general')),
  content text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'implemented')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis_fixer ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis_closer ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECURITY POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Applications policies
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Training progress policies
CREATE POLICY "Users can view own training progress"
  ON training_progress FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can update own training progress"
  ON training_progress FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can insert own training progress"
  ON training_progress FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- KPI Fixer policies
CREATE POLICY "Fixers can view own KPIs"
  ON kpis_fixer FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Fixers can insert own KPIs"
  ON kpis_fixer FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- KPI Closer policies
CREATE POLICY "Closers can view own KPIs"
  ON kpis_closer FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Closers can insert own KPIs"
  ON kpis_closer FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Feedback policies
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_applications_profile_id ON applications(profile_id);
CREATE INDEX IF NOT EXISTS idx_kpis_fixer_profile_date ON kpis_fixer(profile_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_kpis_closer_profile_date ON kpis_closer(profile_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_profile_id ON feedback(profile_id);

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
