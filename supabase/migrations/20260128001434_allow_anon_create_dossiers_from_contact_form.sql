/*
  # Allow anonymous users to create dossiers from contact form

  1. Changes
    - Add policy to allow anonymous users to insert dossiers from the public contact form
    - Restricted to dossiers with source='inbound'

  2. Security
    - Anonymous users can only create dossiers (INSERT)
    - Cannot read, update, or delete dossiers
    - Must have source='inbound' to identify them as coming from public form
    - Must have either fixer_id or closer_id assigned (validated by admins)
*/

-- Allow anonymous users to create dossiers from contact form
CREATE POLICY "Anonymous users can create inbound dossiers"
ON dossiers
FOR INSERT
TO anon
WITH CHECK (
  source = 'inbound' AND
  (fixer_id IS NOT NULL OR closer_id IS NOT NULL)
);
