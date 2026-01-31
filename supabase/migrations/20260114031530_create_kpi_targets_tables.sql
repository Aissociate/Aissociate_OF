/*
  # Create KPI Targets Tables for Fixers and Closers

  1. New Tables
    - `fixer_kpi_targets`
      - `id` (uuid, primary key)
      - `call_duration_minutes` (numeric) - Durée d'un appel en minutes
      - `calls_per_hour` (numeric) - Nombre d'appels par heure
      - `calls_per_day` (numeric) - Nombre d'appels par jour
      - `calls_per_week` (numeric) - Nombre d'appels par semaine
      - `pickup_rate` (numeric) - Taux de décroché (%)
      - `appointment_rate` (numeric) - Taux de RDV (%)
      - `show_rate` (numeric) - Taux de show/noShow (%)
      - `prospects_per_call` (numeric) - Nombre de prospects par appel
      - `monthly_prospects` (numeric) - Nombre de prospects mensuels
      - `lead_quality_avg` (numeric) - Qualité moyenne des leads (0-10)
      - `updated_by` (uuid, foreign key) - Admin qui a mis à jour
      - `updated_at` (timestamptz) - Date de mise à jour

    - `closer_kpi_targets`
      - `id` (uuid, primary key)
      - `closing_rate` (numeric) - Taux de closing (%)
      - `appointment_duration_minutes` (numeric) - Durée d'un RDV en minutes
      - `appointments_per_hour` (numeric) - Nombre de RDV par heure
      - `followup_calls` (numeric) - Nombre de rappels pour suivi
      - `appointments_per_day` (numeric) - Nombre de RDV par jour
      - `clients_per_day` (numeric) - Nombre de clients par jour
      - `clients_per_month` (numeric) - Nombre de clients par mois
      - `closers_needed` (numeric) - Nombre de closers nécessaires
      - `updated_by` (uuid, foreign key) - Admin qui a mis à jour
      - `updated_at` (timestamptz) - Date de mise à jour

  2. Security
    - Enable RLS on both tables
    - Add policies for admins to manage targets
    - Add policies for fixers/closers to read their targets
  
  3. Initial Data
    - Insert default values for both tables
*/

CREATE TABLE IF NOT EXISTS fixer_kpi_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_duration_minutes numeric DEFAULT 5,
  calls_per_hour numeric DEFAULT 10,
  calls_per_day numeric DEFAULT 80,
  calls_per_week numeric DEFAULT 400,
  pickup_rate numeric DEFAULT 30,
  appointment_rate numeric DEFAULT 15,
  show_rate numeric DEFAULT 70,
  prospects_per_call numeric DEFAULT 1,
  monthly_prospects numeric DEFAULT 1600,
  lead_quality_avg numeric DEFAULT 7,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS closer_kpi_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  closing_rate numeric DEFAULT 25,
  appointment_duration_minutes numeric DEFAULT 45,
  appointments_per_hour numeric DEFAULT 1,
  followup_calls numeric DEFAULT 3,
  appointments_per_day numeric DEFAULT 8,
  clients_per_day numeric DEFAULT 2,
  clients_per_month numeric DEFAULT 40,
  closers_needed numeric DEFAULT 5,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fixer_kpi_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE closer_kpi_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage fixer KPI targets"
  ON fixer_kpi_targets FOR ALL
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

CREATE POLICY "Fixers can view fixer KPI targets"
  ON fixer_kpi_targets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'fixer'
    )
  );

CREATE POLICY "Admins can manage closer KPI targets"
  ON closer_kpi_targets FOR ALL
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

CREATE POLICY "Closers can view closer KPI targets"
  ON closer_kpi_targets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'closer'
    )
  );

INSERT INTO fixer_kpi_targets (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO closer_kpi_targets (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;