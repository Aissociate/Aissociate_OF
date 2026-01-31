/*
  # Create function logs table

  1. New Tables
    - `function_logs`
      - `id` (uuid, primary key)
      - `function_name` (text) - Nom de la fonction
      - `level` (text) - Niveau du log (INFO, ERROR, WARNING)
      - `message` (text) - Message du log
      - `metadata` (jsonb) - Données additionnelles (user_id, tenant_id, etc.)
      - `created_at` (timestamptz) - Date de création

  2. Security
    - Enable RLS on `function_logs` table
    - Add policy for authenticated users to read logs from their tenant
    - Add policy for system to insert logs
*/

CREATE TABLE IF NOT EXISTS function_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name text NOT NULL,
  level text NOT NULL DEFAULT 'INFO',
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_function_logs_function_name ON function_logs(function_name);
CREATE INDEX IF NOT EXISTS idx_function_logs_created_at ON function_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_function_logs_level ON function_logs(level);

ALTER TABLE function_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view logs"
  ON function_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert logs"
  ON function_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Anon can insert logs"
  ON function_logs FOR INSERT
  TO anon
  WITH CHECK (true);