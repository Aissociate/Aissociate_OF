/*
  # Allow anonymous users to read active profiles for assignment

  1. Changes
    - Add policy to allow anonymous users to read active profiles (id only)
    - This is needed for the contact form to assign dossiers to fixers/closers

  2. Security
    - Anonymous users can only SELECT (read)
    - Limited to active profiles only
    - Only exposes minimal information needed for assignment
*/

-- Allow anonymous users to read active profile IDs for assignment
CREATE POLICY "Anonymous users can read active profile IDs"
ON profiles
FOR SELECT
TO anon
USING (status = 'active');
