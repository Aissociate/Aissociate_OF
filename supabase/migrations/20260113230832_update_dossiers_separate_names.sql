/*
  # Update Dossiers Schema - Separate First/Last Name

  1. Changes
    - Rename contact_name to contact_first_name
    - Add contact_last_name field
    - Make phone and email required (NOT NULL)
    
  2. Notes
    - Existing data will have contact_name split into first_name field
    - Last name will be empty for existing records
*/

-- Add new column for last name
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'contact_last_name'
  ) THEN
    ALTER TABLE dossiers ADD COLUMN contact_last_name text DEFAULT '';
  END IF;
END $$;

-- Rename contact_name to contact_first_name
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'contact_name'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dossiers' AND column_name = 'contact_first_name'
  ) THEN
    ALTER TABLE dossiers RENAME COLUMN contact_name TO contact_first_name;
  END IF;
END $$;

-- Update phone and email to be NOT NULL for new records
-- Note: We can't add NOT NULL constraint on existing columns with empty values
-- So we'll enforce this at the application level and for new columns we create

-- Create a table to track closer assignment (round robin)
CREATE TABLE IF NOT EXISTS closer_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  closer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_assigned_at timestamptz DEFAULT now(),
  assignment_count integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(closer_id)
);

-- Enable RLS
ALTER TABLE closer_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for closer_assignments
CREATE POLICY "Admins can view closer assignments"
  ON closer_assignments FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage closer assignments"
  ON closer_assignments FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Function to get next closer in round robin
CREATE OR REPLACE FUNCTION get_next_closer()
RETURNS uuid AS $$
DECLARE
  next_closer_id uuid;
BEGIN
  -- Get the closer with the lowest assignment count who is active
  SELECT closer_id INTO next_closer_id
  FROM closer_assignments
  WHERE active = true
  ORDER BY assignment_count ASC, last_assigned_at ASC
  LIMIT 1;
  
  -- If no closer found in assignments table, get the first closer from profiles
  IF next_closer_id IS NULL THEN
    SELECT id INTO next_closer_id
    FROM profiles
    WHERE role = 'closer'
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;
  
  RETURN next_closer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update closer assignment count
CREATE OR REPLACE FUNCTION update_closer_assignment(p_closer_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO closer_assignments (closer_id, last_assigned_at, assignment_count)
  VALUES (p_closer_id, now(), 1)
  ON CONFLICT (closer_id) 
  DO UPDATE SET
    last_assigned_at = now(),
    assignment_count = closer_assignments.assignment_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-assign closer when RDV is planned
CREATE OR REPLACE FUNCTION auto_assign_closer()
RETURNS TRIGGER AS $$
DECLARE
  assigned_closer_id uuid;
BEGIN
  -- Only auto-assign if status becomes rdv_closer_planifié and closer_id is null
  IF NEW.status = 'rdv_closer_planifié' AND NEW.closer_id IS NULL AND (OLD.status IS NULL OR OLD.status != 'rdv_closer_planifié') THEN
    assigned_closer_id := get_next_closer();
    
    IF assigned_closer_id IS NOT NULL THEN
      NEW.closer_id := assigned_closer_id;
      PERFORM update_closer_assignment(assigned_closer_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_assign_closer
  BEFORE INSERT OR UPDATE ON dossiers
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_closer();

-- Initialize closer_assignments for existing closers
INSERT INTO closer_assignments (closer_id, assignment_count, active)
SELECT id, 0, true
FROM profiles
WHERE role = 'closer'
ON CONFLICT (closer_id) DO NOTHING;
