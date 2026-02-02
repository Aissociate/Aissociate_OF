# Solution pour l'erreur 403

## Diagnostic du problème

L'erreur 403 (Forbidden) survient généralement après un transfert du site vers un autre serveur, car des sessions d'authentification invalides restent en cache dans le navigateur.

## Solutions

### Solution 1: Utiliser la page de diagnostic (Recommandé)

1. Accédez à la page de diagnostic: `https://votre-site.com/diagnostic`
2. La page va analyser:
   - La connexion à Supabase
   - L'état de votre session
   - L'accès aux profils
3. Cliquez sur "Nettoyer toutes les sessions"
4. Retournez à la page d'accueil

### Solution 2: Nettoyer manuellement le cache

Si la page de diagnostic n'est pas accessible:

1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet "Application" (Chrome) ou "Storage" (Firefox)
3. Cliquez sur "Local Storage" et "Session Storage"
4. Supprimez toutes les entrées liées à Supabase
5. Rechargez la page (Ctrl+F5)

### Solution 3: Vider tout le cache du navigateur

1. Chrome: `Ctrl+Shift+Delete`
2. Firefox: `Ctrl+Shift+Delete`
3. Cochez "Cookies et données de sites" et "Images et fichiers en cache"
4. Cliquez sur "Effacer les données"
5. Rechargez la page

## Prévention

Pour éviter ce problème à l'avenir:

1. **Avant un transfert de serveur**: Déconnectez tous les utilisateurs
2. **Après un transfert**: Communiquez aux utilisateurs qu'ils doivent se reconnecter
3. **Pour les développeurs**: Utilisez toujours la même URL Supabase dans le fichier `.env`

## Détails techniques

L'erreur 403 après un transfert est causée par:

- Des tokens JWT invalides en cache
- Des sessions Supabase qui pointent vers l'ancien environnement
- Des politiques RLS (Row Level Security) qui rejettent les anciennes sessions

Les correctifs appliqués dans le code:

1. **AuthContext amélioré** (`src/contexts/AuthContext.tsx`):
   - Détection automatique des erreurs 403
   - Déconnexion automatique en cas de session invalide
   - Meilleure gestion des erreurs

2. **Page de diagnostic** (`/diagnostic`):
   - Test de connexion Supabase
   - Vérification de l'état de session
   - Nettoyage complet des sessions en un clic

## Support

Si le problème persiste après avoir essayé toutes ces solutions:

1. Vérifiez que les variables d'environnement dans `.env` sont correctes:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Vérifiez que les migrations Supabase sont à jour:
   - Notamment la migration `20260202035001_fix_403_error_admin_function_recursion_v2.sql`

3. Consultez les logs de la console navigateur (F12) pour plus de détails
