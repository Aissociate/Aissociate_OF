/*
  # Create Contact Requests Table

  1. New Tables
    - `contact_requests`
      - `id` (uuid, primary key)
      - `first_name` (text) - Prénom du contact
      - `last_name` (text) - Nom du contact
      - `email` (text) - Email du contact
      - `phone` (text) - Téléphone du contact
      - `request_type` (text) - Type de demande: 'formation_cpf', 'formation_opco', 'assistance', 'development'
      - `message` (text) - Message libre du client
      - `status` (text) - Statut de la demande: 'new', 'processing', 'contacted', 'converted', 'archived'
      - `assigned_to` (uuid) - ID du commercial assigné (référence profiles)
      - `source` (text) - Source de la demande (ex: 'guideIA2026', 'homepage', 'contact_page')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `contact_requests` table
    - Allow anonymous users to insert (capture de leads)
    - Allow authenticated users to read their assigned requests
    - Allow admins to read and update all requests

  3. Indexes
    - Index on email for quick lookup
    - Index on status for filtering
    - Index on assigned_to for commercial dashboard
*/

-- Create contact_requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  request_type text NOT NULL CHECK (request_type IN ('formation_cpf', 'formation_opco', 'assistance', 'development')),
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processing', 'contacted', 'converted', 'archived')),
  assigned_to uuid REFERENCES profiles(id),
  source text DEFAULT 'unknown',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (capture de leads)
CREATE POLICY "Anonymous users can create contact requests"
  ON contact_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read their assigned requests
CREATE POLICY "Users can read assigned requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());

-- Allow admins to read all requests
CREATE POLICY "Admins can read all contact requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow admins to update all requests
CREATE POLICY "Admins can update all contact requests"
  ON contact_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_requests_email ON contact_requests(email);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_assigned_to ON contact_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_requests_updated_at();
