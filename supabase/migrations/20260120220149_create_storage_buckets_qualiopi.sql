/*
  # Storage Buckets pour Qualiopi

  ## Buckets créés
    - `qualiopi-documents` : Documents originaux (PDF/DOCX)
    - `qualiopi-generated` : Documents PDF générés
    - `qualiopi-templates` : Previews de templates

  ## Sécurité
    - Isolation par tenant_id dans les chemins
    - Politiques RLS sur storage
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('qualiopi-documents', 'qualiopi-documents', false),
  ('qualiopi-generated', 'qualiopi-generated', false),
  ('qualiopi-templates', 'qualiopi-templates', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES - qualiopi-documents
-- ============================================================================

CREATE POLICY "Users can upload documents to their tenant folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'qualiopi-documents'
    AND (storage.foldername(name))[1] = get_user_tenant_id()::text
  );

CREATE POLICY "Users can view documents from their tenant folder"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'qualiopi-documents'
    AND (
      (storage.foldername(name))[1] = get_user_tenant_id()::text
      OR is_admin_saas()
    )
  );

CREATE POLICY "Users can delete documents from their tenant folder"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'qualiopi-documents'
    AND (storage.foldername(name))[1] = get_user_tenant_id()::text
  );

-- ============================================================================
-- STORAGE POLICIES - qualiopi-generated
-- ============================================================================

CREATE POLICY "Users can upload generated docs to their tenant folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'qualiopi-generated'
    AND (storage.foldername(name))[1] = get_user_tenant_id()::text
  );

CREATE POLICY "Users can view generated docs from their tenant folder"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'qualiopi-generated'
    AND (
      (storage.foldername(name))[1] = get_user_tenant_id()::text
      OR is_admin_saas()
    )
  );

-- ============================================================================
-- STORAGE POLICIES - qualiopi-templates
-- ============================================================================

CREATE POLICY "Users can upload template previews to their tenant folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'qualiopi-templates'
    AND (storage.foldername(name))[1] = get_user_tenant_id()::text
  );

CREATE POLICY "Users can view template previews from their tenant folder"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'qualiopi-templates'
    AND (
      (storage.foldername(name))[1] = get_user_tenant_id()::text
      OR is_admin_saas()
    )
  );
