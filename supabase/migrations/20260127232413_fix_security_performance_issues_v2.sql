/*
  # Fix Security and Performance Issues

  1. Missing Indexes for Foreign Keys
    - Add indexes on all foreign key columns that are missing them
    - Improves query performance for JOIN operations
    
  2. RLS Policy Optimization
    - Update RLS policies to use (select auth.uid()) instead of auth.uid()
    - Prevents re-evaluation of auth function for each row
    
  3. Remove Unused Indexes
    - Drop indexes that are not being used to reduce storage and maintenance overhead
    
  4. Fix Function Search Path
    - Set explicit search_path for functions to prevent security issues
*/

-- =====================================================
-- PART 1: Add Missing Indexes for Foreign Keys
-- =====================================================

-- audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON public.audit_logs(actor_user_id);

-- blog_articles
CREATE INDEX IF NOT EXISTS idx_blog_articles_created_by ON public.blog_articles(created_by);

-- document_originals
CREATE INDEX IF NOT EXISTS idx_document_originals_uploaded_by ON public.document_originals(uploaded_by);

-- email_send_logs
CREATE INDEX IF NOT EXISTS idx_email_send_logs_trainee_id ON public.email_send_logs(trainee_id);

-- generated_documents
CREATE INDEX IF NOT EXISTS idx_generated_documents_template_id ON public.generated_documents(template_id);

-- questionnaire_links
CREATE INDEX IF NOT EXISTS idx_questionnaire_links_questionnaire_template_id ON public.questionnaire_links(questionnaire_template_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_links_trainee_id ON public.questionnaire_links(trainee_id);

-- questionnaire_templates
CREATE INDEX IF NOT EXISTS idx_questionnaire_templates_created_by ON public.questionnaire_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_questionnaire_templates_validated_by ON public.questionnaire_templates(validated_by);

-- templates
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);
CREATE INDEX IF NOT EXISTS idx_templates_validated_by ON public.templates(validated_by);

-- trainees
CREATE INDEX IF NOT EXISTS idx_trainees_user_id ON public.trainees(user_id);

-- =====================================================
-- PART 2: Optimize RLS Policies (Auth Function Calls)
-- =====================================================

-- candidates table
DROP POLICY IF EXISTS "Users can view their own application" ON public.candidates;
CREATE POLICY "Users can view their own application"
  ON public.candidates FOR SELECT
  TO authenticated
  USING (
    email = (
      SELECT users.email FROM auth.users
      WHERE users.id = (select auth.uid())
    )::text
  );

-- fixer_kpi_targets table
DROP POLICY IF EXISTS "Admins can manage fixer KPI targets" ON public.fixer_kpi_targets;
CREATE POLICY "Admins can manage fixer KPI targets"
  ON public.fixer_kpi_targets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- closer_kpi_targets table
DROP POLICY IF EXISTS "Admins can manage closer KPI targets" ON public.closer_kpi_targets;
CREATE POLICY "Admins can manage closer KPI targets"
  ON public.closer_kpi_targets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- blog_categories policies
DROP POLICY IF EXISTS "Admins can delete categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.blog_categories;

CREATE POLICY "Admins can delete categories"
  ON public.blog_categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert categories"
  ON public.blog_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Admins can update categories"
  ON public.blog_categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- blog_articles policies
DROP POLICY IF EXISTS "Admins can delete articles" ON public.blog_articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON public.blog_articles;
DROP POLICY IF EXISTS "Admins can read all articles" ON public.blog_articles;
DROP POLICY IF EXISTS "Admins can update articles" ON public.blog_articles;

CREATE POLICY "Admins can delete articles"
  ON public.blog_articles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert articles"
  ON public.blog_articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Admins can read all articles"
  ON public.blog_articles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Admins can update articles"
  ON public.blog_articles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- =====================================================
-- PART 3: Remove Unused Indexes
-- =====================================================

DROP INDEX IF EXISTS public.idx_closer_kpi_targets_updated_by;
DROP INDEX IF EXISTS public.idx_notifications_dossier_id;
DROP INDEX IF EXISTS public.idx_prospects_imported_by;
DROP INDEX IF EXISTS public.idx_candidates_email;
DROP INDEX IF EXISTS public.idx_candidates_status;
DROP INDEX IF EXISTS public.idx_commercial_profiles_user_id;
DROP INDEX IF EXISTS public.idx_commercial_profiles_status;
DROP INDEX IF EXISTS public.idx_validation_attempts_profile;
DROP INDEX IF EXISTS public.idx_improvement_feedback_profile;
DROP INDEX IF EXISTS public.idx_generated_documents_tenant;
DROP INDEX IF EXISTS public.idx_generated_documents_session;
DROP INDEX IF EXISTS public.idx_generated_documents_trainee;
DROP INDEX IF EXISTS public.idx_questionnaire_templates_tenant;
DROP INDEX IF EXISTS public.idx_profiles_status;
DROP INDEX IF EXISTS public.idx_profiles_role;
DROP INDEX IF EXISTS public.idx_fixer_contacts_profile_id;
DROP INDEX IF EXISTS public.idx_fixer_contacts_status;
DROP INDEX IF EXISTS public.idx_fixer_contacts_next_action_date;
DROP INDEX IF EXISTS public.idx_closer_leads_profile_id;
DROP INDEX IF EXISTS public.idx_closer_leads_status;
DROP INDEX IF EXISTS public.idx_closer_leads_expected_close_date;
DROP INDEX IF EXISTS public.idx_feedback_profile_id;
DROP INDEX IF EXISTS public.idx_dossiers_paid;
DROP INDEX IF EXISTS public.idx_dossiers_dispute;
DROP INDEX IF EXISTS public.idx_dossiers_last_activity;
DROP INDEX IF EXISTS public.idx_objectives_profile_id;
DROP INDEX IF EXISTS public.idx_objectives_month_year;
DROP INDEX IF EXISTS public.idx_notifications_profile_id;
DROP INDEX IF EXISTS public.idx_notifications_read;
DROP INDEX IF EXISTS public.idx_users_qualiopi_tenant;
DROP INDEX IF EXISTS public.idx_related_contacts_created_by;
DROP INDEX IF EXISTS public.idx_trainings_tenant;
DROP INDEX IF EXISTS public.idx_trainees_tenant;
DROP INDEX IF EXISTS public.idx_trainees_email;
DROP INDEX IF EXISTS public.idx_sessions_tenant;
DROP INDEX IF EXISTS public.idx_profiles_is_admin;
DROP INDEX IF EXISTS public.idx_dossier_comments_profile_id;
DROP INDEX IF EXISTS public.idx_dossier_comments_created_at;
DROP INDEX IF EXISTS public.idx_session_trainees_session;
DROP INDEX IF EXISTS public.idx_session_trainees_trainee;
DROP INDEX IF EXISTS public.idx_document_originals_tenant;
DROP INDEX IF EXISTS public.idx_templates_tenant;
DROP INDEX IF EXISTS public.idx_templates_status;
DROP INDEX IF EXISTS public.idx_questionnaire_links_tenant;
DROP INDEX IF EXISTS public.idx_questionnaire_links_token;
DROP INDEX IF EXISTS public.idx_questionnaire_links_session;
DROP INDEX IF EXISTS public.idx_questionnaire_responses_tenant;
DROP INDEX IF EXISTS public.idx_questionnaire_responses_link;
DROP INDEX IF EXISTS public.idx_email_templates_tenant;
DROP INDEX IF EXISTS public.idx_email_send_logs_tenant;
DROP INDEX IF EXISTS public.idx_email_send_logs_session;
DROP INDEX IF EXISTS public.idx_email_send_logs_status;
DROP INDEX IF EXISTS public.idx_tasks_tenant;
DROP INDEX IF EXISTS public.idx_tasks_status_run_at;
DROP INDEX IF EXISTS public.idx_audit_logs_tenant;
DROP INDEX IF EXISTS public.idx_audit_logs_entity;
DROP INDEX IF EXISTS public.idx_audit_logs_created_at;
DROP INDEX IF EXISTS public.idx_trainings_program_document;
DROP INDEX IF EXISTS public.idx_document_originals_extracted_text;
DROP INDEX IF EXISTS public.idx_applications_cv_url;
DROP INDEX IF EXISTS public.idx_blog_articles_slug;
DROP INDEX IF EXISTS public.idx_blog_articles_category;
DROP INDEX IF EXISTS public.idx_blog_categories_slug;

-- =====================================================
-- PART 4: Fix Function Search Path
-- =====================================================

-- Recreate functions with explicit search_path
CREATE OR REPLACE FUNCTION public.is_admin_saas()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin_saas = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT tenant_id FROM public.users_qualiopi
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.user_has_role_in_tenant(check_role text, check_tenant_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users_qualiopi
    WHERE user_id = auth.uid()
    AND tenant_id = check_tenant_id
    AND role = check_role
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;