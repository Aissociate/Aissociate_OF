/*
  # Add Financing Tracking Fields to Dossiers

  1. New Columns
    - `quote_sent` (boolean): Whether the quote has been sent
    - `quote_sent_date` (date): Date when the quote was sent
    - `quote_accepted` (boolean): Whether the quote has been accepted
    - `quote_accepted_date` (date): Date when the quote was accepted
    - `payment_requested` (boolean): Whether payment has been requested
    - `payment_requested_date` (date): Date when payment was requested
    - `payment_received` (boolean): Whether payment has been received
    - `payment_received_date` (date): Date when payment was received

  2. Details
    - All fields are optional and default to false/null
    - Used to track financing workflow for non-CPF financing modes
    - Dates help track the timeline of each step
*/

DO $$
BEGIN
  -- Add quote_sent column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'quote_sent'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN quote_sent boolean DEFAULT false;
  END IF;

  -- Add quote_sent_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'quote_sent_date'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN quote_sent_date date DEFAULT NULL;
  END IF;

  -- Add quote_accepted column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'quote_accepted'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN quote_accepted boolean DEFAULT false;
  END IF;

  -- Add quote_accepted_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'quote_accepted_date'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN quote_accepted_date date DEFAULT NULL;
  END IF;

  -- Add payment_requested column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'payment_requested'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN payment_requested boolean DEFAULT false;
  END IF;

  -- Add payment_requested_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'payment_requested_date'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN payment_requested_date date DEFAULT NULL;
  END IF;

  -- Add payment_received column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'payment_received'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN payment_received boolean DEFAULT false;
  END IF;

  -- Add payment_received_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'payment_received_date'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN payment_received_date date DEFAULT NULL;
  END IF;
END $$;
