/*
  # Set default next_step_date for dossiers

  1. Changes
    - Set default value for next_step_date column to CURRENT_DATE
    - Update existing dossiers without next_step_date to use created_at date
  
  2. Notes
    - This ensures all dossiers have a next_step_date by default
    - Existing dossiers will have next_step_date set to their creation date
*/

-- Update existing dossiers without next_step_date to use their creation date
UPDATE dossiers
SET next_step_date = DATE(created_at)
WHERE next_step_date IS NULL;

-- Set default value for future inserts
ALTER TABLE dossiers
ALTER COLUMN next_step_date SET DEFAULT CURRENT_DATE;