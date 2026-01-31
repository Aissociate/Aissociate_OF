/*
  # Create prospects table for CSV imports

  1. New Tables
    - `prospects`
      - `id` (uuid, primary key)
      - `first_name` (text) - Prénom du prospect
      - `last_name` (text) - Nom du prospect
      - `email` (text) - Email du prospect
      - `phone` (text) - Téléphone du prospect
      - `comment` (text, nullable) - Commentaire sur le prospect
      - `imported_by` (uuid, foreign key) - ID de l'admin qui a importé
      - `created_at` (timestamptz) - Date d'import
      - `updated_at` (timestamptz) - Date de mise à jour
  
  2. Security
    - Enable RLS on `prospects` table
    - Add policy for admins to insert prospects
    - Add policy for admins to read all prospects
    - Add policy for admins to update prospects
    - Add policy for admins to delete prospects
*/

CREATE TABLE IF NOT EXISTS prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  comment text,
  imported_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can insert prospects"
  ON prospects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can read all prospects"
  ON prospects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update prospects"
  ON prospects FOR UPDATE
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

CREATE POLICY "Admins can delete prospects"
  ON prospects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );