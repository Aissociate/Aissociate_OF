/*
  # Create related_contacts table

  1. New Tables
    - `related_contacts`
      - `id` (uuid, primary key)
      - `dossier_id` (uuid, foreign key to dossiers): The main dossier/client
      - `first_name` (text): Contact's first name
      - `last_name` (text): Contact's last name
      - `function` (text): Contact's role/function
      - `phone` (text): Contact phone number
      - `email` (text): Contact email
      - `relationship` (text): Relationship to main contact (colleague, partner, etc.)
      - `notes` (text): Additional notes about the contact
      - `status` (text): Contact status (à_contacter, contacté, prospect, client)
      - `created_at` (timestamptz): Creation timestamp
      - `created_by` (uuid, foreign key to profiles): Who created this contact

  2. Security
    - Enable RLS on `related_contacts` table
    - Add policy for authenticated users to read their related contacts
    - Add policy for authenticated users to create related contacts
    - Add policy for authenticated users to update their related contacts
    - Add policy for authenticated users to delete their related contacts
*/

CREATE TABLE IF NOT EXISTS related_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid REFERENCES dossiers(id) ON DELETE CASCADE NOT NULL,
  first_name text NOT NULL,
  last_name text DEFAULT '',
  function text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  relationship text DEFAULT '',
  notes text DEFAULT '',
  status text DEFAULT 'à_contacter',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

ALTER TABLE related_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view related contacts of their dossiers"
  ON related_contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dossiers
      WHERE dossiers.id = related_contacts.dossier_id
      AND (dossiers.fixer_id = auth.uid() OR dossiers.closer_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can create related contacts for their dossiers"
  ON related_contacts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dossiers
      WHERE dossiers.id = related_contacts.dossier_id
      AND (dossiers.fixer_id = auth.uid() OR dossiers.closer_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can update related contacts of their dossiers"
  ON related_contacts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dossiers
      WHERE dossiers.id = related_contacts.dossier_id
      AND (dossiers.fixer_id = auth.uid() OR dossiers.closer_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can delete related contacts of their dossiers"
  ON related_contacts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dossiers
      WHERE dossiers.id = related_contacts.dossier_id
      AND (dossiers.fixer_id = auth.uid() OR dossiers.closer_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_related_contacts_dossier_id ON related_contacts(dossier_id);
CREATE INDEX IF NOT EXISTS idx_related_contacts_created_by ON related_contacts(created_by);
