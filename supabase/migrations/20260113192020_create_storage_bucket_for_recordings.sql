/*
  # Create Storage Bucket for Audio Recordings

  1. New Storage Buckets
    - `recordings` - Stores audio recordings from test calls
      - Public access enabled for easy playback
      - 50MB file size limit
      - Allowed MIME types: audio/webm, audio/mpeg, audio/wav

  2. Security
    - Authenticated users can upload files
    - Files can be publicly accessed for playback
    - Users can only delete their own files
*/

-- Create the recordings bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recordings',
  'recordings',
  true,
  52428800,
  ARRAY['audio/webm', 'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload recordings
CREATE POLICY "Authenticated users can upload recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recordings');

-- Allow public access to view/download recordings
CREATE POLICY "Public access to recordings"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'recordings');

-- Allow users to delete their own recordings
CREATE POLICY "Users can delete own recordings"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);