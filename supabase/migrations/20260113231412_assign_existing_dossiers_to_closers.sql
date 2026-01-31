/*
  # Assign Existing Dossiers to Closers

  1. Purpose
    - Assign all existing dossiers with status >= 'rdv_closer_planifié' to closers
    - Use round robin system to distribute fairly
    
  2. Process
    - Find all dossiers with closer_id = NULL and status >= 'rdv_closer_planifié'
    - Assign them using the round robin function
    
  3. Notes
    - This is a one-time data migration for existing records
    - Future assignments will be handled by the trigger
*/

-- Assign existing dossiers to closers using round robin
DO $$
DECLARE
  dossier_record RECORD;
  assigned_closer_id uuid;
BEGIN
  -- Loop through all unassigned dossiers that should have a closer
  FOR dossier_record IN
    SELECT id, status
    FROM dossiers
    WHERE closer_id IS NULL
    AND status IN (
      'rdv_closer_planifié',
      'rdv_closer_tenu',
      'décision_oui',
      'décision_non',
      'formation_planifiée',
      'formation_réalisée',
      'attente_encaissement',
      'encaissé',
      'litige'
    )
  LOOP
    -- Get next closer in round robin
    assigned_closer_id := get_next_closer();
    
    -- If we found a closer, assign it
    IF assigned_closer_id IS NOT NULL THEN
      UPDATE dossiers
      SET closer_id = assigned_closer_id
      WHERE id = dossier_record.id;
      
      -- Update assignment count
      PERFORM update_closer_assignment(assigned_closer_id);
    END IF;
  END LOOP;
END $$;
