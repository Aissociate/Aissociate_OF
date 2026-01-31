-- Script pour supprimer l'ancien compte et permettre d'en créer un nouveau
-- ATTENTION : Cela supprimera définitivement l'ancien compte

-- Étape 1 : Supprimer le lien Qualiopi
DELETE FROM users_qualiopi WHERE auth_user_id = '59495a50-7cab-4be0-af3f-463f3ec81506';

-- Étape 2 : Supprimer le compte Auth
DELETE FROM auth.users WHERE id = '59495a50-7cab-4be0-af3f-463f3ec81506';

-- Étape 3 : Vous pouvez maintenant créer un nouveau compte via l'interface de signup
-- avec l'email contact@aissociate.re

-- Étape 4 : Après avoir créé le nouveau compte, récupérez le nouvel ID et exécutez :
-- (Remplacez NEW_AUTH_USER_ID par le nouveau ID)

/*
INSERT INTO users_qualiopi (
  tenant_id,
  auth_user_id,
  role,
  email,
  first_name,
  last_name
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'NEW_AUTH_USER_ID',
  'ADMIN_OF',
  'contact@aissociate.re',
  'Admin',
  'Aissociate'
);
*/
