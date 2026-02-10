/*
  # Add fixer assignment fields to crm_companies

  1. Modified Tables
    - `crm_companies`
      - `assigned_to` (uuid, FK to profiles, nullable) - the fixer this company is assigned to
      - `dispatch_status` (text) - 'unassigned', 'assigned', 'in_progress', 'completed'
      - `assigned_at` (timestamptz, nullable) - when the assignment was made

  2. Security
    - RLS policies updated to allow fixers to read their assigned companies
    - RLS policies for crm_contacts and crm_phones also updated for fixers

  3. Indexes
    - Index on assigned_to for efficient fixer lookups
    - Index on dispatch_status for filtering
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crm_companies' AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE crm_companies ADD COLUMN assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crm_companies' AND column_name = 'dispatch_status'
  ) THEN
    ALTER TABLE crm_companies ADD COLUMN dispatch_status text NOT NULL DEFAULT 'unassigned'
      CHECK (dispatch_status IN ('unassigned', 'assigned', 'in_progress', 'completed'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'crm_companies' AND column_name = 'assigned_at'
  ) THEN
    ALTER TABLE crm_companies ADD COLUMN assigned_at timestamptz;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_crm_companies_assigned_to ON crm_companies(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_companies_dispatch_status ON crm_companies(dispatch_status);

CREATE POLICY "Fixers can read their assigned companies"
  ON crm_companies
  FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());

CREATE POLICY "Fixers can update their assigned companies"
  ON crm_companies
  FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());

CREATE POLICY "Fixers can read contacts of their assigned companies"
  ON crm_contacts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM crm_companies
      WHERE crm_companies.id = crm_contacts.company_id
      AND crm_companies.assigned_to = auth.uid()
    )
  );

CREATE POLICY "Fixers can read phones of their assigned company contacts"
  ON crm_phones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM crm_contacts
      JOIN crm_companies ON crm_companies.id = crm_contacts.company_id
      WHERE crm_contacts.id = crm_phones.contact_id
      AND crm_companies.assigned_to = auth.uid()
    )
  );
