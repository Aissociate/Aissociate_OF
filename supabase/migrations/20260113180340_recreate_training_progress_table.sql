/*
  # Recreate training_progress table with correct structure

  1. Changes
    - Drop existing training_progress table that references commercial_profiles
    - Create new training_progress table that references profiles
    - Use correct column structure matching the application code
    - Add RLS policies
*/

-- Drop existing training_progress table and its policies
DROP TABLE IF EXISTS training_progress CASCADE;

-- Create training_progress table with correct structure
CREATE TABLE training_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  module_common_completed boolean DEFAULT false,
  module_role_completed boolean DEFAULT false,
  quiz_score integer DEFAULT 0,
  quiz_passed boolean DEFAULT false,
  test_call_url text,
  test_call_validated boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;

-- Training progress policies
CREATE POLICY "Users can view own training progress"
  ON training_progress FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can update own training progress"
  ON training_progress FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can insert own training progress"
  ON training_progress FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());
