/*
  # Add CV field to applications and update roles
  
  1. Changes
    - Add cv_url field to applications table to store uploaded CV paths
    - Add new role option for closer_marche_public
    
  2. Notes
    - CV files will be stored in a separate storage bucket
    - cv_url is optional (nullable) to maintain backward compatibility
*/

-- Add cv_url field to applications table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'cv_url'
  ) THEN
    ALTER TABLE applications ADD COLUMN cv_url text;
  END IF;
END $$;

-- Create index on cv_url for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_cv_url ON applications(cv_url);
