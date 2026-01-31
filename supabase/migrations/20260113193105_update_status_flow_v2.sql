/*
  # Update Status Flow v2

  1. Changes
    - Update profiles table to use new status values
    - New statuses: new_user, pending_quiz, pending_audio, active, rejected
    - Remove old statuses: applicant, framework_accepted, in_training, validated
    - Update existing profiles to map to new statuses

  2. Security
    - Existing RLS policies remain unchanged
*/

-- First, drop the old constraint
DO $$
BEGIN
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Update existing profiles to new status system
UPDATE profiles 
SET status = CASE 
  WHEN status = 'applicant' THEN 'new_user'
  WHEN status = 'framework_accepted' THEN 'pending_quiz'
  WHEN status = 'in_training' THEN 'pending_quiz'
  WHEN status = 'validated' THEN 'pending_audio'
  WHEN status = 'active' THEN 'active'
  WHEN status = 'rejected' THEN 'rejected'
  ELSE 'new_user'
END;

-- Now add new constraint with updated statuses
ALTER TABLE profiles ADD CONSTRAINT profiles_status_check 
  CHECK (status IN ('new_user', 'pending_quiz', 'pending_audio', 'active', 'rejected'));

-- Update default value for new users
ALTER TABLE profiles ALTER COLUMN status SET DEFAULT 'new_user';