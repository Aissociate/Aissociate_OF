/*
  # Create dossier comments table

  1. New Tables
    - `dossier_comments`
      - `id` (uuid, primary key)
      - `dossier_id` (uuid, foreign key to dossiers)
      - `profile_id` (uuid, foreign key to profiles)
      - `comment` (text, the comment content)
      - `created_at` (timestamptz, when the comment was created)
      - `updated_at` (timestamptz, when the comment was last updated)

  2. Security
    - Enable RLS on `dossier_comments` table
    - Authenticated users can create comments on dossiers they have access to
    - Users can view comments on dossiers they have access to
    - Admins can view, create, update, and delete all comments

  3. Notes
    - This table stores all comments made on dossiers by fixers, closers, and admins
    - Each comment is linked to a dossier and the user who created it
    - Comments are displayed in chat bubble format with author identification
*/

CREATE TABLE IF NOT EXISTS dossier_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES dossiers(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dossier_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on their dossiers"
  ON dossier_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dossiers
      WHERE dossiers.id = dossier_comments.dossier_id
      AND (
        dossiers.fixer_id = auth.uid()
        OR dossiers.closer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.is_admin = true
        )
      )
    )
  );

CREATE POLICY "Users can create comments on their dossiers"
  ON dossier_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dossiers
      WHERE dossiers.id = dossier_comments.dossier_id
      AND (
        dossiers.fixer_id = auth.uid()
        OR dossiers.closer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.is_admin = true
        )
      )
    )
    AND profile_id = auth.uid()
  );

CREATE POLICY "Users can update their own comments"
  ON dossier_comments
  FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Admins can delete any comment"
  ON dossier_comments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_dossier_comments_dossier_id ON dossier_comments(dossier_id);
CREATE INDEX IF NOT EXISTS idx_dossier_comments_profile_id ON dossier_comments(profile_id);
CREATE INDEX IF NOT EXISTS idx_dossier_comments_created_at ON dossier_comments(created_at DESC);
