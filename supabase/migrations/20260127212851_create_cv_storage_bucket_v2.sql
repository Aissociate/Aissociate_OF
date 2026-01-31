/*
  # Create CV storage bucket
  
  1. New Buckets
    - `cvs` - Storage for candidate CV files
  
  2. Security
    - Authenticated users can upload their own CV
    - Admins can read all CVs
    - CVs are private and not publicly accessible
*/

-- Create CV storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own CV" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own CV" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own CV" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own CV" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all CVs" ON storage.objects;

-- Allow authenticated users to upload their own CV
CREATE POLICY "Users can upload their own CV"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own CV
CREATE POLICY "Users can read their own CV"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own CV
CREATE POLICY "Users can update their own CV"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own CV
CREATE POLICY "Users can delete their own CV"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to read all CVs
CREATE POLICY "Admins can read all CVs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cvs' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
