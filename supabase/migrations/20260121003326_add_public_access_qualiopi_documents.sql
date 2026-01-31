/*
  # Add public access to qualiopi-documents bucket

  1. Changes
    - Add SELECT policy for public/anon access to qualiopi-documents
    - This allows getPublicUrl() to work without authentication errors
    
  2. Security
    - Only SELECT access is granted
    - Files are still organized by tenant_id folders
    - Upload and delete remain authenticated and restricted
*/

-- Allow public/anonymous users to view documents in qualiopi-documents bucket
CREATE POLICY "Public can view qualiopi documents"
  ON storage.objects FOR SELECT
  TO public, anon
  USING (bucket_id = 'qualiopi-documents');

-- Also add for generated and templates buckets
CREATE POLICY "Public can view qualiopi generated docs"
  ON storage.objects FOR SELECT
  TO public, anon
  USING (bucket_id = 'qualiopi-generated');

CREATE POLICY "Public can view qualiopi templates"
  ON storage.objects FOR SELECT
  TO public, anon
  USING (bucket_id = 'qualiopi-templates');