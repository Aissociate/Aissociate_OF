# Réinitialisation du mot de passe pour contact@aissociate.re

Votre compte existe dans Supabase mais vous avez perdu le mot de passe. Voici les solutions :

## Solution 1 : Réinitialiser via Supabase Dashboard (RECOMMANDÉ)

1. Aller dans le Dashboard Supabase : https://supabase.com/dashboard
2. Sélectionner votre projet
3. Aller dans **Authentication** > **Users**
4. Trouver l'utilisateur `contact@aissociate.re`
5. Cliquer sur les 3 points (...) à droite
6. Cliquer sur **Send Password Recovery**
7. Vérifier votre boîte email et suivre le lien de réinitialisation

## Solution 2 : Utiliser la page de réinitialisation de l'app

1. Aller sur la page de login de votre application
2. Cliquer sur "Mot de passe oublié ?" (si disponible)
3. Entrer votre email : contact@aissociate.re
4. Vérifier votre boîte email

## Solution 3 : Changer directement le mot de passe (Développement uniquement)

Si vous êtes en environnement de développement local, vous pouvez exécuter ce script :

```sql
-- ATTENTION : Cette méthode ne fonctionne qu'en développement
-- En production, utilisez toujours la méthode de réinitialisation par email

-- Option A : Via l'API Admin de Supabase (recommandé)
-- Exécuter dans un script Node.js ou via l'API
```

## Solution 4 : Créer un nouveau compte (Derniers recours)

Si aucune des solutions ci-dessus ne fonctionne, vous pouvez :

1. Supprimer l'ancien compte :
```sql
DELETE FROM auth.users WHERE email = 'contact@aissociate.re';
```

2. Créer un nouveau compte via l'interface de signup de l'application

## Associer votre compte au système Qualiopi

Une fois connecté, exécutez ce script pour lier votre compte au système Qualiopi :

```sql
-- Associer votre compte au tenant de démo
INSERT INTO users_qualiopi (
  tenant_id,
  auth_user_id,
  role,
  email,
  first_name,
  last_name
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '59495a50-7cab-4be0-af3f-463f3ec81506',  -- Votre auth_user_id
  'ADMIN_OF',
  'contact@aissociate.re',
  'Admin',
  'Aissociate'
)
ON CONFLICT (auth_user_id) DO UPDATE
SET tenant_id = EXCLUDED.tenant_id,
    role = EXCLUDED.role;
```

## Après la réinitialisation

1. Connectez-vous avec votre nouveau mot de passe
2. Accédez à `/qualiopi` pour voir le dashboard Qualiopi
3. Vous aurez accès à toutes les fonctionnalités avec le rôle ADMIN_OF

## Besoin d'aide ?

Si vous rencontrez des problèmes, vérifiez :
- Les logs de Supabase dans le Dashboard
- La configuration des emails dans Supabase (Authentication > Email Templates)
- Que vous utilisez le bon URL de projet Supabase
