/*
  # Create CRM Received Emails (Inbox) Table

  Stores incoming emails received from prospects and contacts,
  enabling an inbox view for fixers and closers.

  1. New Tables
    - `crm_received_emails`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, FK to profiles) - the user who should see this email
      - `from_email` (text) - sender email address
      - `from_name` (text) - sender display name
      - `to_email` (text) - recipient address (our domain)
      - `subject` (text) - email subject
      - `body_html` (text) - HTML body content
      - `body_text` (text) - plain text fallback
      - `in_reply_to_email_id` (uuid, optional FK to crm_sent_emails) - links reply to original sent email
      - `resend_message_id` (text) - Resend inbound message ID
      - `is_read` (boolean) - read status
      - `company_id` (uuid, optional) - linked company
      - `contact_id` (uuid, optional) - linked contact
      - `received_at` (timestamptz) - when the email was received
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled
    - Users can only see their own received emails
    - Admins can see all received emails
    - Service role inserts via webhook

  3. Indexes
    - owner_id, from_email, is_read, received_at
*/

CREATE TABLE IF NOT EXISTS crm_received_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id),
  from_email text NOT NULL DEFAULT '',
  from_name text NOT NULL DEFAULT '',
  to_email text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  body_html text NOT NULL DEFAULT '',
  body_text text NOT NULL DEFAULT '',
  in_reply_to_email_id uuid REFERENCES crm_sent_emails(id),
  resend_message_id text DEFAULT '',
  is_read boolean NOT NULL DEFAULT false,
  company_id uuid,
  contact_id uuid,
  received_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE crm_received_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own received emails"
  ON crm_received_emails FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Admin can view all received emails"
  ON crm_received_emails FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Users can update own received emails"
  ON crm_received_emails FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_crm_received_emails_owner_id ON crm_received_emails(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_received_emails_from_email ON crm_received_emails(from_email);
CREATE INDEX IF NOT EXISTS idx_crm_received_emails_is_read ON crm_received_emails(is_read);
CREATE INDEX IF NOT EXISTS idx_crm_received_emails_received_at ON crm_received_emails(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_received_emails_in_reply_to ON crm_received_emails(in_reply_to_email_id);
