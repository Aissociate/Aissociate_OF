/*
  Script de configuration rapide pour tester le système Qualiopi

  ÉTAPES:
  1. Créer un compte via l'interface Supabase Auth ou via signup
  2. Récupérer l'ID utilisateur (auth.uid())
  3. Exécuter ce script en remplaçant YOUR_AUTH_USER_ID
  4. Se connecter et accéder à /qualiopi
*/

-- Associer votre compte auth au tenant de démo
INSERT INTO users_qualiopi (
  tenant_id,
  auth_user_id,
  role,
  email,
  first_name,
  last_name
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'YOUR_AUTH_USER_ID',  -- Remplacer par votre auth.uid()
  'ADMIN_OF',
  'admin@of-demo.fr',
  'Admin',
  'Qualiopi'
)
ON CONFLICT (auth_user_id) DO UPDATE
SET tenant_id = EXCLUDED.tenant_id,
    role = EXCLUDED.role;

-- Créer quelques stagiaires de test
INSERT INTO trainees (tenant_id, first_name, last_name, email, phone, meta_json)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Sophie', 'Martin', 'sophie.martin@example.com', '0612345678', '{}'),
  ('a0000000-0000-0000-0000-000000000001', 'Pierre', 'Dubois', 'pierre.dubois@example.com', '0623456789', '{}'),
  ('a0000000-0000-0000-0000-000000000001', 'Marie', 'Bernard', 'marie.bernard@example.com', '0634567890', '{}')
ON CONFLICT DO NOTHING;

-- Créer une formation de test
INSERT INTO trainings (tenant_id, title, description, duration_days, version, meta_json)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Formation Closer CPF',
  'Formation complète au métier de Closer spécialisé CPF. Apprenez les techniques de closing, le cadre légal Qualiopi, et les scripts de vente efficaces.',
  3,
  '1.0',
  '{}'
)
ON CONFLICT DO NOTHING;

-- Vérifier les données
SELECT 'Utilisateurs Qualiopi' as table_name, count(*) as count FROM users_qualiopi WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Stagiaires', count(*) FROM trainees WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Formations', count(*) FROM trainings WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Email Templates', count(*) FROM email_templates WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'Questionnaire Templates', count(*) FROM questionnaire_templates WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001';

/*
  TESTER LE SYSTÈME:

  1. Connexion:
     - Se connecter avec le compte créé
     - Accéder à /qualiopi

  2. Créer une session:
     - Aller dans "Sessions"
     - Créer une nouvelle session
     - Sélectionner la formation
     - Définir les dates

  3. Ajouter des stagiaires:
     - Ouvrir le détail de la session
     - Ajouter les stagiaires de test

  4. Tester les questionnaires:
     - Créer un lien de questionnaire
     - Accéder via /q/{token}
     - Soumettre une réponse

  5. Vérifier l'audit:
     SELECT * FROM audit_logs
     WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
     ORDER BY created_at DESC
     LIMIT 20;
*/
