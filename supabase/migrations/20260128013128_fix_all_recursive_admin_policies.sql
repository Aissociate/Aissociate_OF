/*
  # Fix All Recursive Admin Policies

  1. Problem
    - 24+ policies across multiple tables use EXISTS subqueries on profiles table
    - Each one causes potential recursion and performance issues
    - These policies check admin status by querying profiles during RLS evaluation

  2. Solution
    - Replace ALL recursive policies with calls to is_current_user_admin() function
    - This function uses SECURITY DEFINER to bypass RLS during the check
    - Eliminates all recursion while maintaining security

  3. Tables affected
    - applications, blog_articles, blog_categories, bonuses
    - closer_assignments, closer_kpi_targets, feedback, fixer_kpi_targets
    - kpis_closer, kpis_fixer, objectives, training_progress
    - storage.objects (blog-images and cvs buckets)
*/

-- ===== APPLICATIONS =====
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (is_current_user_admin() = true);

-- ===== BLOG_ARTICLES =====
DROP POLICY IF EXISTS "Admins can delete articles" ON blog_articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON blog_articles;
DROP POLICY IF EXISTS "Admins can read all articles" ON blog_articles;
DROP POLICY IF EXISTS "Admins can update articles" ON blog_articles;

CREATE POLICY "Admins can delete articles"
  ON blog_articles FOR DELETE
  TO authenticated
  USING (is_current_user_admin() = true);

CREATE POLICY "Admins can insert articles"
  ON blog_articles FOR INSERT
  TO authenticated
  WITH CHECK (is_current_user_admin() = true);

CREATE POLICY "Admins can read all articles"
  ON blog_articles FOR SELECT
  TO authenticated
  USING (is_current_user_admin() = true);

CREATE POLICY "Admins can update articles"
  ON blog_articles FOR UPDATE
  TO authenticated
  USING (is_current_user_admin() = true)
  WITH CHECK (is_current_user_admin() = true);

-- ===== BLOG_CATEGORIES =====
DROP POLICY IF EXISTS "Admins can delete categories" ON blog_categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON blog_categories;
DROP POLICY IF EXISTS "Admins can update categories" ON blog_categories;

CREATE POLICY "Admins can delete categories"
  ON blog_categories FOR DELETE
  TO authenticated
  USING (is_current_user_admin() = true);

CREATE POLICY "Admins can insert categories"
  ON blog_categories FOR INSERT
  TO authenticated
  WITH CHECK (is_current_user_admin() = true);

CREATE POLICY "Admins can update categories"
  ON blog_categories FOR UPDATE
  TO authenticated
  USING (is_current_user_admin() = true)
  WITH CHECK (is_current_user_admin() = true);

-- ===== BONUSES =====
DROP POLICY IF EXISTS "Admins can manage bonuses" ON bonuses;
CREATE POLICY "Admins can manage bonuses"
  ON bonuses FOR ALL
  TO authenticated
  USING (is_current_user_admin() = true);

-- ===== CLOSER_ASSIGNMENTS =====
DROP POLICY IF EXISTS "Admins can manage closer assignments" ON closer_assignments;
CREATE POLICY "Admins can manage closer assignments"
  ON closer_assignments FOR ALL
  TO authenticated
  USING (is_current_user_admin() = true);

-- ===== CLOSER_KPI_TARGETS =====
DROP POLICY IF EXISTS "Admins can manage closer KPI targets" ON closer_kpi_targets;
CREATE POLICY "Admins can manage closer KPI targets"
  ON closer_kpi_targets FOR ALL
  TO authenticated
  USING (is_current_user_admin() = true);

-- ===== FEEDBACK =====
DROP POLICY IF EXISTS "Admins can view all feedback" ON feedback;
CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (is_current_user_admin() = true);

-- ===== FIXER_KPI_TARGETS =====
DROP POLICY IF EXISTS "Admins can manage fixer KPI targets" ON fixer_kpi_targets;
CREATE POLICY "Admins can manage fixer KPI targets"
  ON fixer_kpi_targets FOR ALL
  TO authenticated
  USING (is_current_user_admin() = true);

-- ===== KPIS_CLOSER =====
DROP POLICY IF EXISTS "Admins can insert closer KPIs" ON kpis_closer;
DROP POLICY IF EXISTS "Admins can view all closer KPIs" ON kpis_closer;

CREATE POLICY "Admins can insert closer KPIs"
  ON kpis_closer FOR INSERT
  TO authenticated
  WITH CHECK (is_current_user_admin() = true);

CREATE POLICY "Admins can view all closer KPIs"
  ON kpis_closer FOR SELECT
  TO authenticated
  USING (is_current_user_admin() = true);

-- ===== KPIS_FIXER =====
DROP POLICY IF EXISTS "Admins can insert fixer KPIs" ON kpis_fixer;
DROP POLICY IF EXISTS "Admins can view all fixer KPIs" ON kpis_fixer;

CREATE POLICY "Admins can insert fixer KPIs"
  ON kpis_fixer FOR INSERT
  TO authenticated
  WITH CHECK (is_current_user_admin() = true);

CREATE POLICY "Admins can view all fixer KPIs"
  ON kpis_fixer FOR SELECT
  TO authenticated
  USING (is_current_user_admin() = true);

-- ===== OBJECTIVES =====
DROP POLICY IF EXISTS "Admins can manage objectives" ON objectives;
CREATE POLICY "Admins can manage objectives"
  ON objectives FOR ALL
  TO authenticated
  USING (is_current_user_admin() = true);

-- ===== TRAINING_PROGRESS =====
DROP POLICY IF EXISTS "Admins can update all training progress" ON training_progress;
DROP POLICY IF EXISTS "Admins can view all training progress" ON training_progress;

CREATE POLICY "Admins can update all training progress"
  ON training_progress FOR UPDATE
  TO authenticated
  USING (is_current_user_admin() = true);

CREATE POLICY "Admins can view all training progress"
  ON training_progress FOR SELECT
  TO authenticated
  USING (is_current_user_admin() = true);

-- ===== STORAGE.OBJECTS (blog-images) =====
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;

CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'blog-images' AND 
    is_current_user_admin() = true
  );

CREATE POLICY "Admins can update blog images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'blog-images' AND 
    is_current_user_admin() = true
  )
  WITH CHECK (
    bucket_id = 'blog-images' AND 
    is_current_user_admin() = true
  );

CREATE POLICY "Admins can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images' AND 
    is_current_user_admin() = true
  );

-- ===== STORAGE.OBJECTS (cvs) =====
DROP POLICY IF EXISTS "Admins can read all CVs" ON storage.objects;

CREATE POLICY "Admins can read all CVs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'cvs' AND 
    is_current_user_admin() = true
  );

-- Add comment for documentation
COMMENT ON FUNCTION public.is_current_user_admin IS 'SECURITY DEFINER function that safely checks admin status without RLS recursion. Used by all admin policies.';
