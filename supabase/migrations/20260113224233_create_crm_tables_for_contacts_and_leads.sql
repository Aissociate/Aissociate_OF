/*
  # Create CRM Tables for Fixers and Closers

  1. New Tables
    - `fixer_contacts`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles) - The fixer who owns this contact
      - `name` (text) - Contact name
      - `phone` (text) - Contact phone number
      - `email` (text) - Contact email
      - `status` (text) - Contact status (à_appeler, en_cours, rdv_fixé, non_intéressé, rappel_ultérieur)
      - `notes` (text) - Notes about the contact
      - `last_contact_date` (date) - Last time contacted
      - `next_action_date` (date) - When to follow up
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `closer_leads`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles) - The closer who owns this lead
      - `name` (text) - Lead name
      - `phone` (text) - Lead phone number
      - `email` (text) - Lead email
      - `company` (text) - Company name
      - `status` (text) - Lead status (nouveau, contacté, négociation, gagné, perdu)
      - `estimated_value` (numeric) - Estimated deal value
      - `closing_probability` (integer) - Probability of closing (0-100%)
      - `notes` (text) - Notes about the lead
      - `last_contact_date` (date) - Last time contacted
      - `expected_close_date` (date) - Expected closing date
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can only see and manage their own contacts/leads
    - Admins can view all contacts/leads
*/

-- Create fixer_contacts table
CREATE TABLE IF NOT EXISTS fixer_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  status text NOT NULL DEFAULT 'à_appeler',
  notes text DEFAULT '',
  last_contact_date date DEFAULT CURRENT_DATE,
  next_action_date date DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create closer_leads table
CREATE TABLE IF NOT EXISTS closer_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  company text DEFAULT '',
  status text NOT NULL DEFAULT 'nouveau',
  estimated_value numeric DEFAULT 0,
  closing_probability integer DEFAULT 50,
  notes text DEFAULT '',
  last_contact_date date DEFAULT CURRENT_DATE,
  expected_close_date date DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE fixer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE closer_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fixer_contacts
CREATE POLICY "Fixers can view own contacts"
  ON fixer_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id OR is_admin());

CREATE POLICY "Fixers can insert own contacts"
  ON fixer_contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Fixers can update own contacts"
  ON fixer_contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id OR is_admin())
  WITH CHECK (auth.uid() = profile_id OR is_admin());

CREATE POLICY "Fixers can delete own contacts"
  ON fixer_contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = profile_id OR is_admin());

-- RLS Policies for closer_leads
CREATE POLICY "Closers can view own leads"
  ON closer_leads FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id OR is_admin());

CREATE POLICY "Closers can insert own leads"
  ON closer_leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Closers can update own leads"
  ON closer_leads FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id OR is_admin())
  WITH CHECK (auth.uid() = profile_id OR is_admin());

CREATE POLICY "Closers can delete own leads"
  ON closer_leads FOR DELETE
  TO authenticated
  USING (auth.uid() = profile_id OR is_admin());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fixer_contacts_profile_id ON fixer_contacts(profile_id);
CREATE INDEX IF NOT EXISTS idx_fixer_contacts_status ON fixer_contacts(status);
CREATE INDEX IF NOT EXISTS idx_fixer_contacts_next_action_date ON fixer_contacts(next_action_date);

CREATE INDEX IF NOT EXISTS idx_closer_leads_profile_id ON closer_leads(profile_id);
CREATE INDEX IF NOT EXISTS idx_closer_leads_status ON closer_leads(status);
CREATE INDEX IF NOT EXISTS idx_closer_leads_expected_close_date ON closer_leads(expected_close_date);
