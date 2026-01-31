/*
  # Create profiles and applications tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `role` (text, fixer or closer)
      - `status` (text, applicant/framework_accepted/in_training/validated/active/rejected)
      - `experience` (text)
      - `availability` (text)
      - `motivation` (text)
      - `framework_accepted_at` (timestamptz)
      - `training_completed_at` (timestamptz)
      - `validated_at` (timestamptz)
      - `activated_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `applications`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `role_desired` (text, not null)
      - `experience` (text, not null)
      - `availability` (text, not null)
      - `motivation` (text, not null)
      - `ethical_framework_accepted` (boolean)
      - `status` (text, pending/accepted/rejected)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text CHECK (role IN ('fixer', 'closer')),
  status text DEFAULT 'applicant' CHECK (status IN ('applicant', 'framework_accepted', 'in_training', 'validated', 'active', 'rejected')),
  experience text,
  availability text,
  motivation text,
  framework_accepted_at timestamptz,
  training_completed_at timestamptz,
  validated_at timestamptz,
  activated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role_desired text NOT NULL CHECK (role_desired IN ('fixer', 'closer')),
  experience text NOT NULL,
  availability text NOT NULL,
  motivation text NOT NULL,
  ethical_framework_accepted boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Applications policies
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_applications_profile_id ON applications(profile_id);
