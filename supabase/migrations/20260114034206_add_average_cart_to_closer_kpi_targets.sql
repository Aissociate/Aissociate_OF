/*
  # Add average cart to closer KPI targets

  1. Changes
    - Add `average_cart` column to `closer_kpi_targets` table with default value of 1800€
  
  2. Details
    - Column type: numeric
    - Default value: 1800
    - This represents the average revenue per client for closers
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'closer_kpi_targets' AND column_name = 'average_cart'
  ) THEN
    ALTER TABLE closer_kpi_targets ADD COLUMN average_cart numeric DEFAULT 1800;
  END IF;
END $$;
