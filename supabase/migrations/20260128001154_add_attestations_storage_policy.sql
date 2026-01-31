/*
  # Add attestations storage policy

  1. Changes
    - Add policy to allow authenticated users to upload attestations CPF
    - Add policy to allow public read of attestations

  2. Security
    - Authenticated users can upload files to attestations folder
    - Files can be publicly read for sharing
*/

-- Allow authenticated users to upload attestations
CREATE POLICY "Users can upload attestations CPF"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = 'attestations'
);

-- Allow authenticated users to read attestations
CREATE POLICY "Users can read attestations"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = 'attestations'
);

-- Allow public access to attestations folder
UPDATE storage.buckets
SET public = true
WHERE id = 'cvs';
