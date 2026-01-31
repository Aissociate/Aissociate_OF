/*
  # Create feedback table

  1. New Table
    - `feedback`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `feedback_type` (text, objection/script_improvement/general)
      - `content` (text, not null)
      - `status` (text, new/reviewed/implemented)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Users can view and create their own feedback
*/

-- Create feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('objection', 'script_improvement', 'general')),
  content text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'implemented')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own feedback" ON feedback;
  DROP POLICY IF EXISTS "Users can create feedback" ON feedback;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Feedback policies
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Index
CREATE INDEX IF NOT EXISTS idx_feedback_profile_id ON feedback(profile_id);
