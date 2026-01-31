# Configuration de l'API OpenRouter pour l'extraction PDF

## Problème

L'erreur "⚠️ Aucune métadonnée extraite (clé API OpenRouter non configurée)" apparaît car la clé API OpenRouter n'est **PAS** configurée correctement dans les secrets de votre Edge Function Supabase.

## Important

La clé API dans le fichier `.env` local **N'EST PAS** utilisée par les Edge Functions. Les Edge Functions Supabase tournent sur les serveurs de Supabase et nécessitent que les secrets soient configurés dans le Dashboard Supabase.

## Solution - Configurer les secrets Supabase

### Étape 1 : Obtenir une clé API OpenRouter

1. Allez sur https://openrouter.ai/keys
2. Créez un compte ou connectez-vous
3. Créez une nouvelle clé API
4. Copiez la clé (elle commence par `sk-or-`)

### Étape 2 : Configurer le secret dans Supabase

1. Allez sur votre Dashboard Supabase : https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **Edge Functions**
4. Cliquez sur l'onglet **Secrets**
5. Cliquez sur **Add New Secret**
6. Remplissez les champs :
   - **Secret Name** : `OPENROUTER_API_KEY`
   - **Secret Value** : Collez votre clé API (exemple : `sk-or-v1-xxxxx...`)
7. Cliquez sur **Save**

### Étape 3 : Redéployer la Edge Function (si nécessaire)

Si la fonction était déjà déployée, vous devrez peut-être la redéployer pour qu'elle prenne en compte le nouveau secret :

1. Dans le Dashboard Supabase, allez dans **Edge Functions**
2. Trouvez la fonction `upload-training-document`
3. Cliquez sur **Redeploy** (ou déployez-la à nouveau depuis votre code)

### Étape 4 : Vérifier la configuration

Utilisez la page de diagnostic intégrée pour vérifier que tout fonctionne :

1. Connectez-vous à votre application
2. Allez dans **Qualiopi Dashboard**
3. Cliquez sur **Configuration API**
4. Cliquez sur **Lancer la vérification**

Cette page analysera les logs de votre Edge Function et vous dira si la clé API est correctement configurée.

## Dépannage

### Le message d'erreur persiste

Si le message persiste après avoir configuré le secret :

1. Vérifiez que le nom du secret est exactement `OPENROUTER_API_KEY` (sensible à la casse)
2. Vérifiez que la clé API commence bien par `sk-or-`
3. Attendez quelques minutes pour que le secret soit propagé
4. Redéployez la Edge Function si nécessaire

### Vérifier les logs

Vous pouvez consulter les logs détaillés :

1. Allez dans **Qualiopi Dashboard** > **Logs**
2. Recherchez les messages contenant "OPENROUTER_API_KEY"
3. Vous devriez voir soit :
   - "Calling OpenRouter API for structured extraction" (succès)
   - "OPENROUTER_API_KEY not configured" (échec)

## Architecture

```
┌─────────────────┐
│  Frontend (.env)│  ← Clé API LOCAL (non utilisée par Edge Functions)
└─────────────────┘

┌─────────────────────────────────────────────┐
│  Supabase Edge Function                      │
│  ┌────────────────────────────────────────┐ │
│  │  Secrets (Dashboard Supabase)          │ │  ← Clé API UTILISÉE ici
│  │  - OPENROUTER_API_KEY = sk-or-xxx...   │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  upload-training-document                    │
│  ↓                                           │
│  OpenRouter API (avec la clé des secrets)   │
└─────────────────────────────────────────────┘
```

## Résumé

1. La clé dans `.env` local ≠ clé utilisée par Edge Functions
2. Configurez `OPENROUTER_API_KEY` dans Dashboard Supabase > Edge Functions > Secrets
3. Utilisez la page de diagnostic pour vérifier
4. L'extraction IA fonctionnera automatiquement une fois configurée
