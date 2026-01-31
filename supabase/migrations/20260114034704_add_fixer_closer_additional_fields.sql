/*
  # Add additional fields for Fixer and Closer dossiers

  1. Changes to dossiers table
    
    ## Fixer Fields:
    - `call_duration_minutes` (integer): Duration of discussion in minutes
    - `cpf_amount` (numeric): Amount of CPF funding available
    - `complementary_funding_type` (text): Type of complementary funding (pole_emploi, opco, agefice, autre)
    - `complementary_funding_amount` (numeric): Amount of complementary funding
    
    ## Closer Fields:
    - `cart_value` (numeric): Initial cart value for the sale
    - `related_clients_count` (integer): Number of related clients/contacts
  
  2. Details
    - All fields are optional and can be null
    - Default values set to 0 for numeric fields where appropriate
    - complementary_funding_type allows for multiple funding sources
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'call_duration_minutes'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN call_duration_minutes integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'cpf_amount'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN cpf_amount numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'complementary_funding_type'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN complementary_funding_type text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'complementary_funding_amount'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN complementary_funding_amount numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'cart_value'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN cart_value numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'related_clients_count'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN related_clients_count integer DEFAULT 0;
  END IF;
END $$;
