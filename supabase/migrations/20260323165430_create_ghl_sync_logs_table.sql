/*
  # Create GoHighLevel sync logs table

  1. New Tables
    - `ghl_sync_logs`
      - `id` (uuid, primary key)
      - `source_table` (text) - 'dossiers' or 'contact_requests'
      - `source_id` (uuid) - ID of the dossier or contact_request
      - `ghl_contact_id` (text) - GoHighLevel contact ID returned after sync
      - `ghl_location_id` (text) - GoHighLevel location/sub-account ID
      - `sync_status` (text) - 'pending', 'success', 'error'
      - `error_message` (text) - Error details if sync failed
      - `payload_sent` (jsonb) - Data sent to GHL API
      - `response_received` (jsonb) - Response from GHL API
      - `synced_at` (timestamptz) - When sync was performed
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `ghl_sync_logs` table
    - Only admins can read/write sync logs

  3. Notes
    - Tracks all sync attempts to GoHighLevel
    - Helps debug failed syncs and avoid duplicate pushes
*/

CREATE TABLE IF NOT EXISTS ghl_sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table text NOT NULL DEFAULT '',
  source_id uuid NOT NULL,
  ghl_contact_id text DEFAULT '',
  ghl_location_id text DEFAULT '',
  sync_status text NOT NULL DEFAULT 'pending',
  error_message text DEFAULT '',
  payload_sent jsonb DEFAULT '{}'::jsonb,
  response_received jsonb DEFAULT '{}'::jsonb,
  synced_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ghl_sync_logs_source ON ghl_sync_logs(source_table, source_id);
CREATE INDEX IF NOT EXISTS idx_ghl_sync_logs_status ON ghl_sync_logs(sync_status);

ALTER TABLE ghl_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read ghl_sync_logs"
  ON ghl_sync_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert ghl_sync_logs"
  ON ghl_sync_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update ghl_sync_logs"
  ON ghl_sync_logs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
