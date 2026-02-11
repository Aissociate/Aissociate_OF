/*
  # Create CRM Email System

  Email management for fixers and closers with Resend integration and tracking.

  1. New Tables
    - `crm_email_templates`
      - `id` (uuid, primary key)
      - `created_by` (uuid, FK to profiles) - template owner
      - `name` (text) - template name
      - `subject` (text) - email subject
      - `body_html` (text) - HTML body
      - `body_text` (text) - plain text fallback
      - `category` (text) - fixer/closer/general
      - `is_shared` (boolean) - shared with same-role users
      - `created_at` / `updated_at` (timestamptz)

    - `crm_sent_emails`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, FK to profiles) - who sent it
      - `template_id` (uuid, optional FK) - source template
      - `from_email` / `from_name` (text) - sender display
      - `to_email` / `to_name` (text) - recipient
      - `subject` / `body_html` / `body_text` (text) - content
      - `status` (text) - queued/sent/delivered/bounced/failed
      - `resend_id` (text) - Resend API message ID
      - `opened_at` / `open_count` - open tracking
      - `clicked_at` / `click_count` - click tracking
      - `company_id` / `contact_id` (uuid, optional FKs)
      - `error_message` (text)

    - `crm_email_tracking_events`
      - `id` (uuid, primary key)
      - `email_id` (uuid, FK to crm_sent_emails)
      - `event_type` (text) - open/click
      - `metadata` (jsonb) - details
      - `created_at` (timestamptz)

  2. Security
    - RLS on all tables
    - Users see only own emails and templates
    - Shared templates visible to same-role users
    - Admins see all sent emails

  3. Indexes
    - Sender, status, date, tracking lookups
*/

CREATE TABLE IF NOT EXISTS crm_email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES profiles(id),
  name text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  body_html text NOT NULL DEFAULT '',
  body_text text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  is_shared boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE crm_email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own crm email templates"
  ON crm_email_templates FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can view shared crm email templates for same role"
  ON crm_email_templates FOR SELECT
  TO authenticated
  USING (
    is_shared = true
    AND category IN (
      SELECT COALESCE(role, 'general') FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own crm email templates"
  ON crm_email_templates FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own crm email templates"
  ON crm_email_templates FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own crm email templates"
  ON crm_email_templates FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

CREATE TABLE IF NOT EXISTS crm_sent_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id),
  template_id uuid REFERENCES crm_email_templates(id),
  from_email text NOT NULL DEFAULT '',
  from_name text NOT NULL DEFAULT '',
  to_email text NOT NULL DEFAULT '',
  to_name text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  body_html text NOT NULL DEFAULT '',
  body_text text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'queued',
  resend_id text DEFAULT '',
  opened_at timestamptz,
  open_count integer NOT NULL DEFAULT 0,
  clicked_at timestamptz,
  click_count integer NOT NULL DEFAULT 0,
  company_id uuid,
  contact_id uuid,
  error_message text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE crm_sent_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own crm sent emails"
  ON crm_sent_emails FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid());

CREATE POLICY "Admin can view all crm sent emails"
  ON crm_sent_emails FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Users can insert own crm sent emails"
  ON crm_sent_emails FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own crm sent emails"
  ON crm_sent_emails FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

CREATE TABLE IF NOT EXISTS crm_email_tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id uuid NOT NULL REFERENCES crm_sent_emails(id),
  event_type text NOT NULL DEFAULT 'open',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE crm_email_tracking_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tracking for own crm emails"
  ON crm_email_tracking_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM crm_sent_emails
      WHERE crm_sent_emails.id = crm_email_tracking_events.email_id
      AND crm_sent_emails.sender_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all crm tracking events"
  ON crm_email_tracking_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE INDEX IF NOT EXISTS idx_crm_email_templates_created_by ON crm_email_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_crm_email_templates_category ON crm_email_templates(category);
CREATE INDEX IF NOT EXISTS idx_crm_sent_emails_sender_id ON crm_sent_emails(sender_id);
CREATE INDEX IF NOT EXISTS idx_crm_sent_emails_status ON crm_sent_emails(status);
CREATE INDEX IF NOT EXISTS idx_crm_sent_emails_created_at ON crm_sent_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_sent_emails_to_email ON crm_sent_emails(to_email);
CREATE INDEX IF NOT EXISTS idx_crm_email_tracking_email_id ON crm_email_tracking_events(email_id);
