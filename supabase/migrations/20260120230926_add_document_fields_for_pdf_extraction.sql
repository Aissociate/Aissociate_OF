/*
  # Ajout de champs pour l'extraction PDF

  1. Modifications
    - Ajouter `extracted_text` pour stocker le contenu extrait du PDF
    - Ajouter `uploaded_by` pour tracer qui a uploadé le document
  
  2. Notes
    - extracted_text sera utilisé pour l'IA et la recherche
    - uploaded_by référence auth.users
*/

-- Ajouter le champ extracted_text
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_originals' AND column_name = 'extracted_text'
  ) THEN
    ALTER TABLE document_originals ADD COLUMN extracted_text text;
  END IF;
END $$;

-- Ajouter le champ uploaded_by
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'document_originals' AND column_name = 'uploaded_by'
  ) THEN
    ALTER TABLE document_originals ADD COLUMN uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Créer un index pour la recherche full-text sur extracted_text
CREATE INDEX IF NOT EXISTS idx_document_originals_extracted_text ON document_originals USING gin(to_tsvector('french', extracted_text));