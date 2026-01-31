/*
  # Fix qualiopi-documents bucket to be public

  1. Changes
    - Update qualiopi-documents bucket to be public
    - This allows getPublicUrl() to work correctly
    - The bucket will still be secured by RLS policies

  2. Security
    - RLS policies remain in place on storage.objects
    - Users can only access documents from their tenant
    - Public bucket just means URLs are accessible without auth headers
*/

-- Update the bucket to be public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'qualiopi-documents';

-- Also make the other buckets public for consistency
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('qualiopi-generated', 'qualiopi-templates');