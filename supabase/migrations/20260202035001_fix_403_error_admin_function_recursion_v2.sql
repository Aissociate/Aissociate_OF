/*
  # Fix 403 Error - Resolve Admin Function RLS Recursion

  1. Problem
    - The is_current_user_admin() function causes RLS recursion
    - When checking admin status, it queries profiles table which triggers RLS
    - RLS policies call is_current_user_admin() again, creating infinite loop
    - This causes 403 errors on login

  2. Solution
    - Replace the SQL function with a PL/pgSQL function
    - Use SECURITY DEFINER to properly bypass RLS
    - Set search_path explicitly for security

  3. Security
    - Function runs with definer privileges (bypasses RLS)
    - Only checks the current user's own is_admin field
    - Returns false if profile doesn't exist (safe default)
*/

-- Replace the function (no need to drop with CASCADE)
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  admin_status boolean;
BEGIN
  -- This query bypasses RLS because of SECURITY DEFINER
  SELECT is_admin INTO admin_status
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  -- Return false if no profile found
  RETURN COALESCE(admin_status, false);
EXCEPTION
  WHEN OTHERS THEN
    -- If any error occurs, return false (safe default)
    RETURN false;
END;
$$;

-- Ensure proper permissions
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO anon;

COMMENT ON FUNCTION public.is_current_user_admin IS 
'Safely checks if current user is admin. SECURITY DEFINER bypasses RLS to prevent recursion. Returns false on error or if profile not found.';
