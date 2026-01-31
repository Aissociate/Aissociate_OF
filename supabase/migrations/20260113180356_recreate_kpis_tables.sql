/*
  # Recreate KPI tables with correct structure

  1. Changes
    - Drop existing kpis_fixer and kpis_closer tables that reference commercial_profiles
    - Create new tables that reference profiles
    - Use correct column names matching the application code
    - Add RLS policies
*/

-- Drop existing tables
DROP TABLE IF EXISTS kpis_fixer CASCADE;
DROP TABLE IF EXISTS kpis_closer CASCADE;

-- Create kpis_fixer table
CREATE TABLE kpis_fixer (
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
CREATE TABLE kpis_closer (
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

-- Enable RLS
ALTER TABLE kpis_fixer ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis_closer ENABLE ROW LEVEL SECURITY;

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

-- Indexes
CREATE INDEX idx_kpis_fixer_profile_date ON kpis_fixer(profile_id, date DESC);
CREATE INDEX idx_kpis_closer_profile_date ON kpis_closer(profile_id, date DESC);
