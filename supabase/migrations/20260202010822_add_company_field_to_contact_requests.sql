/*
  # Add Company Field to Contact Requests

  1. Changes
    - Add `company` (text, optional) field to `contact_requests` table
    - This allows clients to optionally specify their company name

  2. Notes
    - Field is optional (nullable) to maintain flexibility
    - No default value needed for optional field
*/

-- Add company field to contact_requests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_requests' AND column_name = 'company'
  ) THEN
    ALTER TABLE contact_requests ADD COLUMN company text;
  END IF;
END $$;
