/*
  # Add product_type field to dossiers

  1. Changes
    - Add product_type column to dossiers table
    - Allows tracking which product is being sold (marche_public or formations_ia)
    - Default to formations_ia for backwards compatibility

  2. Security
    - No changes to RLS policies
*/

-- Add product_type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'product_type'
  ) THEN
    ALTER TABLE dossiers 
    ADD COLUMN product_type text DEFAULT 'formations_ia' CHECK (product_type IN ('marche_public', 'formations_ia'));
  END IF;
END $$;
