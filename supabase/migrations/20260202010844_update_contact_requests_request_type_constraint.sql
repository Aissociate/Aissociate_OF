/*
  # Update Request Type Constraint

  1. Changes
    - Remove the CHECK constraint on request_type to allow for specific formation titles
    - This provides flexibility to store actual formation names instead of generic categories

  2. Notes
    - The application layer will handle validation
    - Allows for more detailed tracking of which specific formation is requested
*/

-- Drop the existing constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'contact_requests' AND constraint_name LIKE '%request_type%'
  ) THEN
    ALTER TABLE contact_requests DROP CONSTRAINT IF EXISTS contact_requests_request_type_check;
  END IF;
END $$;
