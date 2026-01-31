/*
  # Create fixer KPI targets table

  1. New Tables
    - `fixer_kpi_targets`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, foreign key to profiles, nullable for default targets)
      - `call_duration_hours` (numeric, durée d'un appel en heures)
      - `calls_per_hour` (numeric, nombre d'appels par heure)
      - `calls_per_day` (numeric, nombre d'appels par jour)
      - `calls_per_week` (numeric, nombre d'appels par semaine)
      - `pickup_rate` (numeric, taux de décroché en %)
      - `rdv_rate` (numeric, taux de RDV en %)
      - `show_rate` (numeric, taux de show/noShow en %)
      - `prospects_per_call` (numeric, nombre de prospects par appel)
      - `monthly_prospects` (numeric, nombre de prospects mensuels)
      - `avg_lead_quality` (numeric, qualité moyenne des leads en %)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `fixer_kpi_targets` table
    - Admins can view, create, update, and delete all targets
    - Fixers can view their own targets
    - Default targets (profile_id = NULL) are viewable by all authenticated users

  3. Notes
    - This table stores customizable KPI targets for fixers
    - Each fixer can have personalized targets
    - A default row with profile_id = NULL stores the default targets
*/

CREATE TABLE IF NOT EXISTS fixer_kpi_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  call_duration_hours numeric DEFAULT 0.15,
  calls_per_hour numeric DEFAULT 10,
  calls_per_day numeric DEFAULT 40,
  calls_per_week numeric DEFAULT 200,
  pickup_rate numeric DEFAULT 50,
  rdv_rate numeric DEFAULT 12.5,
  show_rate numeric DEFAULT 11.25,
  prospects_per_call numeric DEFAULT 1.8,
  monthly_prospects numeric DEFAULT 81,
  avg_lead_quality numeric DEFAULT 75,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id)
);

ALTER TABLE fixer_kpi_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all KPI targets"
  ON fixer_kpi_targets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Fixers can view their own targets"
  ON fixer_kpi_targets
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid() OR profile_id IS NULL);

CREATE INDEX IF NOT EXISTS idx_fixer_kpi_targets_profile_id ON fixer_kpi_targets(profile_id);

INSERT INTO fixer_kpi_targets (
  profile_id,
  call_duration_hours,
  calls_per_hour,
  calls_per_day,
  calls_per_week,
  pickup_rate,
  rdv_rate,
  show_rate,
  prospects_per_call,
  monthly_prospects,
  avg_lead_quality
) VALUES (
  NULL,
  0.15,
  10,
  40,
  200,
  50,
  12.5,
  11.25,
  1.8,
  81,
  75
) ON CONFLICT (profile_id) DO NOTHING;
