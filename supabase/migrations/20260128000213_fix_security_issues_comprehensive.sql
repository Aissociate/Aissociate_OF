/*
  # Comprehensive Security Fixes

  ## Changes Made

  ### 1. Add Missing Indexes for Foreign Keys
  Adding indexes to improve query performance on foreign key columns:
  - audit_logs.tenant_id
  - blog_articles.category_id
  - closer_kpi_targets.updated_by
  - closer_leads.profile_id
  - document_originals.tenant_id
  - dossier_comments.profile_id
  - email_send_logs.session_id, tenant_id
  - email_templates.tenant_id
  - feedback.profile_id
  - fixer_contacts.profile_id
  - generated_documents.session_id, tenant_id, trainee_id
  - improvement_feedback.profile_id
  - notifications.dossier_id, profile_id
  - prospects.imported_by
  - questionnaire_links.session_id, tenant_id
  - questionnaire_responses.questionnaire_link_id, tenant_id
  - questionnaire_templates.tenant_id
  - related_contacts.created_by
  - session_trainees.trainee_id
  - sessions.tenant_id
  - tasks.tenant_id
  - templates.tenant_id
  - trainees.tenant_id
  - trainings.program_document_id, tenant_id
  - users_qualiopi.tenant_id
  - validation_attempts.profile_id

  ### 2. Drop Unused Indexes
  Removing indexes that are not being used to reduce storage and write overhead:
  - idx_audit_logs_actor_user_id
  - idx_blog_articles_created_by
  - idx_document_originals_uploaded_by
  - idx_email_send_logs_trainee_id
  - idx_generated_documents_template_id
  - idx_questionnaire_links_questionnaire_template_id
  - idx_questionnaire_links_trainee_id
  - idx_questionnaire_templates_created_by
  - idx_questionnaire_templates_validated_by
  - idx_templates_created_by
  - idx_templates_validated_by
  - idx_trainees_user_id

  ### 3. Fix RLS Policies That Are Always True
  Restricting overly permissive policies:
  - audit_logs: Restrict system log creation to service role only
  - candidates: Keep as-is for public form submission
  - function_logs: Keep as-is for edge function logging
  - questionnaire_responses: Keep as-is for public questionnaire submission

  ### 4. Fix Function Search Path Mutability
  Making the user_has_role_in_tenant function security definer with immutable search path

  ## Security Notes
  - Multiple permissive policies are intentional (admin + user access patterns)
  - Some "always true" policies are necessary for public forms and logging
  - Configuration issues (Auth DB connections, password protection) must be fixed in Supabase dashboard
*/

-- ============================================================================
-- 1. ADD MISSING INDEXES FOR FOREIGN KEYS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category_id ON blog_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_closer_kpi_targets_updated_by ON closer_kpi_targets(updated_by);
CREATE INDEX IF NOT EXISTS idx_closer_leads_profile_id ON closer_leads(profile_id);
CREATE INDEX IF NOT EXISTS idx_document_originals_tenant_id ON document_originals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dossier_comments_profile_id ON dossier_comments(profile_id);
CREATE INDEX IF NOT EXISTS idx_email_send_logs_session_id ON email_send_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_email_send_logs_tenant_id ON email_send_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_tenant_id ON email_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_feedback_profile_id ON feedback(profile_id);
CREATE INDEX IF NOT EXISTS idx_fixer_contacts_profile_id ON fixer_contacts(profile_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_session_id ON generated_documents(session_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_tenant_id ON generated_documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_trainee_id ON generated_documents(trainee_id);
CREATE INDEX IF NOT EXISTS idx_improvement_feedback_profile_id ON improvement_feedback(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_dossier_id ON notifications(dossier_id);
CREATE INDEX IF NOT EXISTS idx_notifications_profile_id ON notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_prospects_imported_by ON prospects(imported_by);
CREATE INDEX IF NOT EXISTS idx_questionnaire_links_session_id ON questionnaire_links(session_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_links_tenant_id ON questionnaire_links(tenant_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_link_id ON questionnaire_responses(questionnaire_link_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_tenant_id ON questionnaire_responses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_templates_tenant_id ON questionnaire_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_related_contacts_created_by ON related_contacts(created_by);
CREATE INDEX IF NOT EXISTS idx_session_trainees_trainee_id ON session_trainees(trainee_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tenant_id ON sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_templates_tenant_id ON templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_trainees_tenant_id ON trainees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_trainings_program_document_id ON trainings(program_document_id);
CREATE INDEX IF NOT EXISTS idx_trainings_tenant_id ON trainings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_qualiopi_tenant_id ON users_qualiopi(tenant_id);
CREATE INDEX IF NOT EXISTS idx_validation_attempts_profile_id ON validation_attempts(profile_id);

-- ============================================================================
-- 2. DROP UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_audit_logs_actor_user_id;
DROP INDEX IF EXISTS idx_blog_articles_created_by;
DROP INDEX IF EXISTS idx_document_originals_uploaded_by;
DROP INDEX IF EXISTS idx_email_send_logs_trainee_id;
DROP INDEX IF EXISTS idx_generated_documents_template_id;
DROP INDEX IF EXISTS idx_questionnaire_links_questionnaire_template_id;
DROP INDEX IF EXISTS idx_questionnaire_links_trainee_id;
DROP INDEX IF EXISTS idx_questionnaire_templates_created_by;
DROP INDEX IF EXISTS idx_questionnaire_templates_validated_by;
DROP INDEX IF EXISTS idx_templates_created_by;
DROP INDEX IF EXISTS idx_templates_validated_by;
DROP INDEX IF EXISTS idx_trainees_user_id;

-- ============================================================================
-- 3. FIX RLS POLICIES THAT ARE ALWAYS TRUE
-- ============================================================================

-- Fix audit_logs: Restrict to service role only
DROP POLICY IF EXISTS "System can create audit logs" ON audit_logs;

CREATE POLICY "Service role can create audit logs"
  ON audit_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Note: candidates, function_logs, and questionnaire_responses policies are intentionally
-- permissive as they need to accept anonymous submissions from public forms

-- ============================================================================
-- 4. FIX FUNCTION SEARCH PATH MUTABILITY
-- ============================================================================

-- Drop and recreate the function with proper search path configuration
DROP FUNCTION IF EXISTS user_has_role_in_tenant(uuid, text, uuid);

CREATE OR REPLACE FUNCTION user_has_role_in_tenant(
  p_user_id uuid,
  p_role text,
  p_tenant_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users_qualiopi
    WHERE user_id = p_user_id
    AND role = p_role
    AND tenant_id = p_tenant_id
  );
END;
$$;