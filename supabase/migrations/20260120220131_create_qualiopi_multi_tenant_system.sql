/*
  # Système Multi-Tenant Qualiopi - Base de données complète

  ## 1. Tables principales
    - `tenants` : Organismes de formation (OF)
    - `users` : Utilisateurs avec rôles RBAC
    - `trainees` : Stagiaires
    - `trainings` : Formations
    - `sessions` : Sessions de formation
    - `session_trainees` : Relation many-to-many sessions/stagiaires

  ## 2. Système de documents et templates
    - `document_originals` : Documents uploadés (PDF/DOCX)
    - `templates` : Templates dynamiques (DRAFT/PUBLISHED)
    - `generated_documents` : Documents PDF générés

  ## 3. Système de questionnaires
    - `questionnaire_templates` : Templates de questionnaires (HOT/COLD)
    - `questionnaire_links` : Liens uniques par stagiaire
    - `questionnaire_responses` : Réponses aux questionnaires

  ## 4. Système d'emails
    - `email_templates` : Templates d'emails
    - `email_send_logs` : Logs d'envoi (avec bodySnapshot)

  ## 5. Système de tâches et audit
    - `tasks` : Tâches programmées (relances, etc.)
    - `audit_logs` : Journal d'audit immuable

  ## 6. Sécurité
    - RLS activé sur toutes les tables
    - Isolation stricte par tenant_id
    - Politiques par rôle (ADMIN_SAAS, ADMIN_OF, GESTIONNAIRE, FORMATEUR, STAGIAIRE)
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM (
  'ADMIN_SAAS',
  'ADMIN_OF',
  'GESTIONNAIRE',
  'FORMATEUR',
  'STAGIAIRE'
);

CREATE TYPE template_status AS ENUM ('DRAFT', 'PUBLISHED');
CREATE TYPE doc_type AS ENUM ('QUOTE', 'CONVENTION', 'CONVOCATION', 'ATTESTATION', 'QUESTIONNAIRE', 'EMAIL', 'OTHER');
CREATE TYPE session_modality AS ENUM ('PRESENTIEL', 'DISTANCIEL', 'HYBRIDE');
CREATE TYPE questionnaire_type AS ENUM ('HOT', 'COLD', 'CUSTOM');
CREATE TYPE email_purpose AS ENUM ('HOT_INVITE', 'COLD_INVITE', 'REMINDER', 'CONVOCATION', 'CUSTOM');
CREATE TYPE email_status AS ENUM ('PENDING', 'SENT', 'FAILED', 'BOUNCED');
CREATE TYPE task_type AS ENUM ('EMAIL_SEND', 'REMINDER', 'PDF_GENERATION', 'EXPORT');
CREATE TYPE task_status AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');
CREATE TYPE actor_type AS ENUM ('HUMAN', 'SYSTEM');

-- ============================================================================
-- TABLE: tenants (Organismes de Formation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  siret text,
  logo_url text,
  address text,
  phone text,
  email text,
  settings_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: users
-- ============================================================================

CREATE TABLE IF NOT EXISTS users_qualiopi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'STAGIAIRE',
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_qualiopi_tenant ON users_qualiopi(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_qualiopi_auth_user ON users_qualiopi(auth_user_id);

ALTER TABLE users_qualiopi ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: trainees (Stagiaires)
-- ============================================================================

CREATE TABLE IF NOT EXISTS trainees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users_qualiopi(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  meta_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trainees_tenant ON trainees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_trainees_email ON trainees(tenant_id, email);

ALTER TABLE trainees ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: trainings (Formations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration_days integer DEFAULT 0,
  version text DEFAULT '1.0',
  meta_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trainings_tenant ON trainings(tenant_id);

ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: sessions (Sessions de formation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  training_id uuid NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  modality session_modality DEFAULT 'PRESENTIEL',
  trainer_name text,
  location text,
  max_capacity integer,
  meta_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_tenant ON sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sessions_training ON sessions(training_id);
CREATE INDEX IF NOT EXISTS idx_sessions_dates ON sessions(start_date, end_date);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: session_trainees (Many-to-Many)
-- ============================================================================

CREATE TABLE IF NOT EXISTS session_trainees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  trainee_id uuid NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  status text DEFAULT 'ENROLLED',
  UNIQUE(session_id, trainee_id)
);

CREATE INDEX IF NOT EXISTS idx_session_trainees_session ON session_trainees(session_id);
CREATE INDEX IF NOT EXISTS idx_session_trainees_trainee ON session_trainees(trainee_id);

ALTER TABLE session_trainees ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: document_originals (Documents uploadés)
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_originals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  mime_type text,
  doc_type doc_type DEFAULT 'OTHER',
  uploaded_by uuid REFERENCES users_qualiopi(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_originals_tenant ON document_originals(tenant_id);

ALTER TABLE document_originals ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: templates (Templates dynamiques)
-- ============================================================================

CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  doc_type doc_type NOT NULL,
  status template_status DEFAULT 'DRAFT',
  version text DEFAULT '1.0',
  template_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  preview_html text,
  created_by uuid REFERENCES users_qualiopi(id) ON DELETE SET NULL,
  validated_by uuid REFERENCES users_qualiopi(id) ON DELETE SET NULL,
  validated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_templates_tenant ON templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: generated_documents (PDFs générés)
-- ============================================================================

CREATE TABLE IF NOT EXISTS generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_id uuid REFERENCES templates(id) ON DELETE SET NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  trainee_id uuid REFERENCES trainees(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_size bigint,
  generated_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generated_documents_tenant ON generated_documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_session ON generated_documents(session_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_trainee ON generated_documents(trainee_id);

ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: questionnaire_templates
-- ============================================================================

CREATE TABLE IF NOT EXISTS questionnaire_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  type questionnaire_type NOT NULL,
  status template_status DEFAULT 'DRAFT',
  version text DEFAULT '1.0',
  schema_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES users_qualiopi(id) ON DELETE SET NULL,
  validated_by uuid REFERENCES users_qualiopi(id) ON DELETE SET NULL,
  validated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questionnaire_templates_tenant ON questionnaire_templates(tenant_id);

ALTER TABLE questionnaire_templates ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: questionnaire_links (Liens uniques par stagiaire)
-- ============================================================================

CREATE TABLE IF NOT EXISTS questionnaire_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  questionnaire_template_id uuid NOT NULL REFERENCES questionnaire_templates(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  trainee_id uuid NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questionnaire_links_tenant ON questionnaire_links(tenant_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_links_token ON questionnaire_links(token);
CREATE INDEX IF NOT EXISTS idx_questionnaire_links_session ON questionnaire_links(session_id);

ALTER TABLE questionnaire_links ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: questionnaire_responses
-- ============================================================================

CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  questionnaire_link_id uuid NOT NULL REFERENCES questionnaire_links(id) ON DELETE CASCADE,
  answers_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_tenant ON questionnaire_responses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_link ON questionnaire_responses(questionnaire_link_id);

ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: email_templates
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  purpose email_purpose NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  status template_status DEFAULT 'DRAFT',
  version text DEFAULT '1.0',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_templates_tenant ON email_templates(tenant_id);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: email_send_logs (Logs d'envoi avec snapshot)
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_send_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  to_email text NOT NULL,
  subject text NOT NULL,
  body_snapshot text NOT NULL,
  provider_msg_id text,
  status email_status DEFAULT 'PENDING',
  error text,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  trainee_id uuid REFERENCES trainees(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_email_send_logs_tenant ON email_send_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_email_send_logs_session ON email_send_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_email_send_logs_status ON email_send_logs(status);

ALTER TABLE email_send_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: tasks (Tâches programmées)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type task_type NOT NULL,
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  status task_status DEFAULT 'PENDING',
  run_at timestamptz NOT NULL,
  executed_at timestamptz,
  error text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_tenant ON tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status_run_at ON tasks(status, run_at);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: audit_logs (Journal d'audit immuable)
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES users_qualiopi(id) ON DELETE SET NULL,
  actor_type actor_type NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - Helper function
-- ============================================================================

-- Function to check if user is admin_saas
CREATE OR REPLACE FUNCTION is_admin_saas()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users_qualiopi
    WHERE auth_user_id = auth.uid()
    AND role = 'ADMIN_SAAS'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT tenant_id FROM users_qualiopi
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has role in tenant
CREATE OR REPLACE FUNCTION user_has_role_in_tenant(required_roles user_role[])
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users_qualiopi
    WHERE auth_user_id = auth.uid()
    AND role = ANY(required_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES - tenants
-- ============================================================================

CREATE POLICY "Admin SAAS can view all tenants"
  ON tenants FOR SELECT
  TO authenticated
  USING (is_admin_saas());

CREATE POLICY "Users can view their own tenant"
  ON tenants FOR SELECT
  TO authenticated
  USING (id = get_user_tenant_id());

CREATE POLICY "Admin SAAS can manage tenants"
  ON tenants FOR ALL
  TO authenticated
  USING (is_admin_saas())
  WITH CHECK (is_admin_saas());

-- ============================================================================
-- RLS POLICIES - users_qualiopi
-- ============================================================================

CREATE POLICY "Users can view users in their tenant"
  ON users_qualiopi FOR SELECT
  TO authenticated
  USING (
    tenant_id = get_user_tenant_id()
    OR is_admin_saas()
  );

CREATE POLICY "Admin OF can manage users in their tenant"
  ON users_qualiopi FOR ALL
  TO authenticated
  USING (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role]))
    OR is_admin_saas()
  )
  WITH CHECK (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role]))
    OR is_admin_saas()
  );

-- ============================================================================
-- RLS POLICIES - Generic for tenant-scoped tables
-- ============================================================================

-- trainees
CREATE POLICY "Users can view trainees in their tenant"
  ON trainees FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

CREATE POLICY "Managers can manage trainees in their tenant"
  ON trainees FOR ALL
  TO authenticated
  USING (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  )
  WITH CHECK (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  );

-- trainings
CREATE POLICY "Users can view trainings in their tenant"
  ON trainings FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

CREATE POLICY "Managers can manage trainings in their tenant"
  ON trainings FOR ALL
  TO authenticated
  USING (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  )
  WITH CHECK (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  );

-- sessions
CREATE POLICY "Users can view sessions in their tenant"
  ON sessions FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

CREATE POLICY "Managers can manage sessions in their tenant"
  ON sessions FOR ALL
  TO authenticated
  USING (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  )
  WITH CHECK (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  );

-- session_trainees
CREATE POLICY "Users can view session_trainees in their tenant"
  ON session_trainees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = session_trainees.session_id
      AND (s.tenant_id = get_user_tenant_id() OR is_admin_saas())
    )
  );

CREATE POLICY "Managers can manage session_trainees in their tenant"
  ON session_trainees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = session_trainees.session_id
      AND (
        (s.tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
        OR is_admin_saas()
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = session_trainees.session_id
      AND (
        (s.tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
        OR is_admin_saas()
      )
    )
  );

-- document_originals
CREATE POLICY "Users can view documents in their tenant"
  ON document_originals FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

CREATE POLICY "Users can upload documents in their tenant"
  ON document_originals FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id() OR is_admin_saas());

-- templates
CREATE POLICY "Users can view templates in their tenant"
  ON templates FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

CREATE POLICY "Managers can manage templates in their tenant"
  ON templates FOR ALL
  TO authenticated
  USING (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  )
  WITH CHECK (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  );

-- generated_documents
CREATE POLICY "Users can view generated documents in their tenant"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

CREATE POLICY "Users can create generated documents in their tenant"
  ON generated_documents FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id() OR is_admin_saas());

-- questionnaire_templates
CREATE POLICY "Users can view questionnaire templates in their tenant"
  ON questionnaire_templates FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

CREATE POLICY "Managers can manage questionnaire templates in their tenant"
  ON questionnaire_templates FOR ALL
  TO authenticated
  USING (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  )
  WITH CHECK (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  );

-- questionnaire_links (Public access for token)
CREATE POLICY "Anyone can view questionnaire links with token"
  ON questionnaire_links FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can create questionnaire links in their tenant"
  ON questionnaire_links FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id() OR is_admin_saas());

-- questionnaire_responses (Public submission)
CREATE POLICY "Anyone can submit questionnaire responses"
  ON questionnaire_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view questionnaire responses in their tenant"
  ON questionnaire_responses FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

-- email_templates
CREATE POLICY "Users can view email templates in their tenant"
  ON email_templates FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

CREATE POLICY "Managers can manage email templates in their tenant"
  ON email_templates FOR ALL
  TO authenticated
  USING (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  )
  WITH CHECK (
    (tenant_id = get_user_tenant_id() AND user_has_role_in_tenant(ARRAY['ADMIN_OF'::user_role, 'GESTIONNAIRE'::user_role]))
    OR is_admin_saas()
  );

-- email_send_logs
CREATE POLICY "Users can view email logs in their tenant"
  ON email_send_logs FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

CREATE POLICY "System can create email logs"
  ON email_send_logs FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id() OR is_admin_saas());

-- tasks
CREATE POLICY "Users can view tasks in their tenant"
  ON tasks FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas());

CREATE POLICY "System can manage tasks in tenant"
  ON tasks FOR ALL
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas())
  WITH CHECK (tenant_id = get_user_tenant_id() OR is_admin_saas());

-- audit_logs (Read-only for users, append-only)
CREATE POLICY "Users can view audit logs in their tenant"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_admin_saas() OR tenant_id IS NULL);

CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
