/*
  # Create CRM Companies, Contacts, and Phones tables

  1. New Tables
    - `crm_companies`
      - `id` (uuid, primary key)
      - `raison_social` (text, company name)
      - `activite` (text, business activity)
      - `adresse` (text, street address)
      - `city` (text, city name)
      - `postal_code` (text, postal code)
      - `description` (text, company description)
      - `commentaires` (text, comments/notes)
      - `imported_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `crm_contacts`
      - `id` (uuid, primary key)
      - `company_id` (uuid, references crm_companies)
      - `nom` (text, last name)
      - `prenom` (text, first name)
      - `email` (text, optional email)
      - `commentaires` (text, contact-level notes)
      - `created_at` (timestamptz)

    - `crm_phones`
      - `id` (uuid, primary key)
      - `contact_id` (uuid, references crm_contacts)
      - `phone_number` (text)
      - `label` (text, e.g. 'principal', 'mobile', 'bureau')
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all 3 tables
    - Admin-only policies for full CRUD
    - Authenticated users can read

  3. Indexes
    - Index on crm_companies.raison_social for search
    - Index on crm_contacts.company_id for joins
    - Index on crm_phones.contact_id for joins
*/

-- Companies table
CREATE TABLE IF NOT EXISTS crm_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raison_social text NOT NULL,
  activite text DEFAULT '',
  adresse text DEFAULT '',
  city text DEFAULT '',
  postal_code text DEFAULT '',
  description text DEFAULT '',
  commentaires text DEFAULT '',
  imported_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE crm_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage crm_companies"
  ON crm_companies
  FOR ALL
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

CREATE POLICY "Authenticated users can read crm_companies"
  ON crm_companies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_crm_companies_raison_social ON crm_companies(raison_social);
CREATE INDEX IF NOT EXISTS idx_crm_companies_city ON crm_companies(city);
CREATE INDEX IF NOT EXISTS idx_crm_companies_imported_by ON crm_companies(imported_by);

-- Contacts table
CREATE TABLE IF NOT EXISTS crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES crm_companies(id) ON DELETE CASCADE,
  nom text NOT NULL DEFAULT '',
  prenom text DEFAULT '',
  email text DEFAULT '',
  commentaires text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage crm_contacts"
  ON crm_contacts
  FOR ALL
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

CREATE POLICY "Authenticated users can read crm_contacts"
  ON crm_contacts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_crm_contacts_company_id ON crm_contacts(company_id);

-- Phones table
CREATE TABLE IF NOT EXISTS crm_phones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  phone_number text NOT NULL DEFAULT '',
  label text DEFAULT 'principal',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crm_phones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage crm_phones"
  ON crm_phones
  FOR ALL
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

CREATE POLICY "Authenticated users can read crm_phones"
  ON crm_phones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_crm_phones_contact_id ON crm_phones(contact_id);
