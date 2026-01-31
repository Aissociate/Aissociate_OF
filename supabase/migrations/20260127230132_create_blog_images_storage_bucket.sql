/*
  # Create Blog Images Storage Bucket

  1. Storage
    - Create `blog-images` bucket with public access
    - Configure policies for public read and admin write
    
  2. Security
    - Anyone can read images (public bucket)
    - Only admins can upload images
*/

-- Create blog-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;
END $$;

-- Allow public read access to blog images
CREATE POLICY "Public can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

-- Only admins can upload blog images
CREATE POLICY "Admins can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can update blog images
CREATE POLICY "Admins can update blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'blog-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    bucket_id = 'blog-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can delete blog images
CREATE POLICY "Admins can delete blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blog-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );