/*
  # Add rappel category to dossiers table

  1. Changes
    - Add `is_rappel` boolean column to `dossiers` table
    - Add `rappel_date` timestamptz column to track when the rappel should happen
    - Add `rappel_notes` text column for rappel-specific notes
  
  2. Purpose
    - Allow closers to categorize dossiers as rappels
    - Track when to follow up with rappel clients
    - Store specific notes about the rappel context
*/

DO $$
BEGIN
  -- Add is_rappel column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dossiers' AND column_name = 'is_rappel'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN is_rappel boolean DEFAULT false;
  END IF;

  -- Add rappel_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dossiers' AND column_name = 'rappel_date'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN rappel_date timestamptz DEFAULT NULL;
  END IF;

  -- Add rappel_notes column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dossiers' AND column_name = 'rappel_notes'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN rappel_notes text DEFAULT '';
  END IF;
END $$;