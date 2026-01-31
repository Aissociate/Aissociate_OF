/*
  # Ajout du document programme pour les formations

  1. Modifications
    - Ajouter `program_document_id` à la table `trainings` pour référencer le PDF du programme
    - Ajouter un index pour les requêtes fréquentes
  
  2. Notes
    - Le document sera stocké dans `document_originals`
    - Il servira de pièce jointe dans les emails de convocation
*/

-- Ajouter le champ program_document_id à la table trainings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trainings' AND column_name = 'program_document_id'
  ) THEN
    ALTER TABLE trainings ADD COLUMN program_document_id uuid REFERENCES document_originals(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Créer un index pour optimiser les jointures
CREATE INDEX IF NOT EXISTS idx_trainings_program_document ON trainings(program_document_id);