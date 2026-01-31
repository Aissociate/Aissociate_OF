/*
  # Add Financing Fields to Dossiers Table

  1. New Columns
    - `financing_mode` (text): Primary financing mode selected by closer (CPF, OPCO, Pôle Emploi, Employeur, Personnel, Autre)
    - `personal_funding_amount` (numeric): Amount of personal funding if applicable

  2. Details
    - Both fields are optional and can be null
    - financing_mode helps track the main financing strategy
    - personal_funding_amount tracks any out-of-pocket contribution
    - These fields complement existing cpf_amount and complementary_funding fields
*/

DO $$
BEGIN
  -- Add financing_mode column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'financing_mode'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN financing_mode text DEFAULT '';
  END IF;

  -- Add personal_funding_amount column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'personal_funding_amount'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN personal_funding_amount numeric DEFAULT 0;
  END IF;
END $$;
