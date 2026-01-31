/*
  # Create Dossiers/Prospects System - New Architecture

  1. New Tables
    - `dossiers`
      - Identity fields: company, contact_name, contact_function, phone, email, sector, size
      - Attribution: fixer_id, closer_id
      - Pipeline: status, source, created_at, last_activity
      - Fixer data: initial_call_date, prospect_response, rdv_date, show_up, fixer_notes
      - Closer data: rdv_closer_date, decision, objections, lead_quality (1-10), next_step_date, next_step_action, closer_notes
      - Financial: formation_done, formation_end_date, expected_payment_date, paid, amount, dispute, dispute_reason
    
    - `objectives`
      - User objectives per month
      - Target type (clients_paid, show_up_rate, quality_score, closing_rate, etc.)
      
    - `bonuses`
      - Bonus tiers configuration (200/500/1000)
      - Conditions and requirements
      
    - `notifications`
      - System notifications for users
      - Types: rdv_reminder, rdv_missed, dossier_stuck, payment_pending, dispute_alert

  2. Security
    - Enable RLS on all tables
    - Fixers can only see/edit their dossiers
    - Closers can only see dossiers assigned to them
    - Admins can see and edit everything

  3. Important Notes
    - Main entity is now "dossier" (prospect file)
    - Payment triggers commissions/bonuses
    - Disputes freeze commissions
    - All KPIs calculated from this data
*/

-- Dossiers/Prospects table
CREATE TABLE IF NOT EXISTS dossiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  company text NOT NULL,
  contact_name text NOT NULL,
  contact_function text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  sector text DEFAULT '',
  size text DEFAULT '',
  
  -- Attribution
  fixer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  closer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Pipeline
  status text NOT NULL DEFAULT 'à_contacter',
  source text DEFAULT 'cold_call',
  created_at timestamptz DEFAULT now(),
  last_activity timestamptz DEFAULT now(),
  
  -- Fixer data
  initial_call_date date DEFAULT NULL,
  prospect_response boolean DEFAULT NULL,
  rdv_date timestamptz DEFAULT NULL,
  show_up boolean DEFAULT NULL,
  fixer_notes text DEFAULT '',
  
  -- Closer data
  rdv_closer_date timestamptz DEFAULT NULL,
  decision text DEFAULT NULL,
  objections text DEFAULT '',
  lead_quality integer DEFAULT NULL,
  next_step_date date DEFAULT NULL,
  next_step_action text DEFAULT '',
  closer_notes text DEFAULT '',
  
  -- Financial & Payment
  formation_done boolean DEFAULT false,
  formation_end_date date DEFAULT NULL,
  expected_payment_date date DEFAULT NULL,
  paid boolean DEFAULT false,
  amount numeric DEFAULT 1800,
  dispute boolean DEFAULT false,
  dispute_reason text DEFAULT '',
  
  updated_at timestamptz DEFAULT now()
);

-- Objectives table
CREATE TABLE IF NOT EXISTS objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  month text NOT NULL,
  year integer NOT NULL,
  
  -- Targets
  clients_paid_target integer DEFAULT 0,
  show_up_rate_target numeric DEFAULT 70,
  quality_score_target numeric DEFAULT 7,
  closing_rate_target numeric DEFAULT 25,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(profile_id, month, year)
);

-- Bonuses configuration table
CREATE TABLE IF NOT EXISTS bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Bonus tiers
  tier_1_clients integer DEFAULT 5,
  tier_1_amount numeric DEFAULT 200,
  tier_2_clients integer DEFAULT 10,
  tier_2_amount numeric DEFAULT 500,
  tier_3_clients integer DEFAULT 15,
  tier_3_amount numeric DEFAULT 1000,
  
  -- Conditions
  min_show_up_rate numeric DEFAULT 70,
  min_quality_score numeric DEFAULT 7,
  
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(profile_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  dossier_id uuid REFERENCES dossiers(id) ON DELETE CASCADE,
  
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dossiers
CREATE POLICY "Fixers can view their dossiers"
  ON dossiers FOR SELECT
  TO authenticated
  USING (auth.uid() = fixer_id OR auth.uid() = closer_id OR is_admin());

CREATE POLICY "Fixers can insert their dossiers"
  ON dossiers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = fixer_id);

CREATE POLICY "Fixers can update their dossiers"
  ON dossiers FOR UPDATE
  TO authenticated
  USING (auth.uid() = fixer_id OR auth.uid() = closer_id OR is_admin())
  WITH CHECK (auth.uid() = fixer_id OR auth.uid() = closer_id OR is_admin());

CREATE POLICY "Admins can delete dossiers"
  ON dossiers FOR DELETE
  TO authenticated
  USING (is_admin());

-- RLS Policies for objectives
CREATE POLICY "Users can view their objectives"
  ON objectives FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id OR is_admin());

CREATE POLICY "Admins can manage objectives"
  ON objectives FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for bonuses
CREATE POLICY "Users can view their bonuses"
  ON bonuses FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id OR is_admin());

CREATE POLICY "Admins can manage bonuses"
  ON bonuses FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id OR is_admin());

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete their notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = profile_id OR is_admin());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dossiers_fixer_id ON dossiers(fixer_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_closer_id ON dossiers(closer_id);
CREATE INDEX IF NOT EXISTS idx_dossiers_status ON dossiers(status);
CREATE INDEX IF NOT EXISTS idx_dossiers_paid ON dossiers(paid);
CREATE INDEX IF NOT EXISTS idx_dossiers_dispute ON dossiers(dispute);
CREATE INDEX IF NOT EXISTS idx_dossiers_last_activity ON dossiers(last_activity);

CREATE INDEX IF NOT EXISTS idx_objectives_profile_id ON objectives(profile_id);
CREATE INDEX IF NOT EXISTS idx_objectives_month_year ON objectives(month, year);

CREATE INDEX IF NOT EXISTS idx_notifications_profile_id ON notifications(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Function to auto-update last_activity on dossier changes
CREATE OR REPLACE FUNCTION update_dossier_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity = now();
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dossier_activity
  BEFORE UPDATE ON dossiers
  FOR EACH ROW
  EXECUTE FUNCTION update_dossier_last_activity();

-- Function to auto-calculate expected_payment_date when formation ends
CREATE OR REPLACE FUNCTION update_expected_payment_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.formation_end_date IS NOT NULL AND (OLD.formation_end_date IS NULL OR OLD.formation_end_date != NEW.formation_end_date) THEN
    NEW.expected_payment_date = NEW.formation_end_date + INTERVAL '30 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_payment_date
  BEFORE UPDATE ON dossiers
  FOR EACH ROW
  EXECUTE FUNCTION update_expected_payment_date();
