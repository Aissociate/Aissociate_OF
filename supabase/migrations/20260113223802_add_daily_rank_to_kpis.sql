/*
  # Add Daily Rank to KPI Tables

  1. Changes
    - Add `daily_rank` column to kpis_fixer table
    - Add `daily_rank` column to kpis_closer table
    - Set default value to NULL (rank will be calculated and updated separately)

  2. Notes
    - daily_rank represents the commercial's ranking for that specific date
    - Lower numbers = better performance (1st, 2nd, 3rd, etc.)
    - Rank can be calculated based on key performance metrics
*/

-- Add daily_rank column to kpis_fixer table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'kpis_fixer' AND column_name = 'daily_rank'
  ) THEN
    ALTER TABLE kpis_fixer ADD COLUMN daily_rank INTEGER DEFAULT NULL;
  END IF;
END $$;

-- Add daily_rank column to kpis_closer table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'kpis_closer' AND column_name = 'daily_rank'
  ) THEN
    ALTER TABLE kpis_closer ADD COLUMN daily_rank INTEGER DEFAULT NULL;
  END IF;
END $$;
