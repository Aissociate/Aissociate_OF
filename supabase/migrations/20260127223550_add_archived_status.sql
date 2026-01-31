/*
  # Add archived status to profiles

  1. Changes
    - Add 'archived' status to the profiles status constraint
    - Allows admins to archive candidates without deleting them

  2. Security
    - No changes to RLS policies
*/

-- Drop the existing constraint
DO $$
BEGIN
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add new constraint with archived status
ALTER TABLE profiles ADD CONSTRAINT profiles_status_check
  CHECK (status IN ('new_user', 'pending_quiz', 'pending_audio', 'active', 'rejected', 'archived'));
