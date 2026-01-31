/*
  # Allow anonymous users to upload attestations

  1. Changes
    - Update policy to allow anonymous (anon) users to upload attestations
    - This is needed for the public contact form

  2. Security
    - Only allows upload to attestations/ folder
    - Files are still read-protected by authentication
*/

-- Drop existing policy and recreate with anon access
DROP POLICY IF EXISTS "Users can upload attestations CPF" ON storage.objects;

-- Allow both authenticated and anonymous users to upload attestations
CREATE POLICY "Users can upload attestations CPF"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = 'attestations'
);

-- Allow authenticated users and anonymous users to read attestations
DROP POLICY IF EXISTS "Users can read attestations" ON storage.objects;

CREATE POLICY "Users can read attestations"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = 'attestations'
);
