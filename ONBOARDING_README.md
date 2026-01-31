# Système d'Onboarding Aissociate

## Vue d'ensemble

Ce projet intègre un système complet d'onboarding pour les commerciaux Aissociate (Fixers et Closers), depuis la candidature jusqu'au suivi de performance.

## Architecture

### Pages principales

1. **/** - Site vitrine de la formation IA (existant)
2. **/onboarding/rejoindre** - Landing page de recrutement
3. **/onboarding/candidature** - Formulaire de candidature
4. **/onboarding/cadre** - Acceptation du cadre éthique
5. **/onboarding/formation** - Espace de formation
6. **/onboarding/validation** - Quiz et validation
7. **/onboarding/activation** - Activation et accès outils
8. **/onboarding/dashboard** - Dashboard KPI
9. **/onboarding/amelioration** - Feedback et amélioration continue

### Fonctionnalités

- **Authentification** : Système complet avec Supabase Auth
- **Routes protégées** : Accès conditionné au statut de l'utilisateur
- **Progression guidée** : Parcours séquentiel obligatoire
- **Gestion des rôles** : Fixer ou Closer
- **KPI tracking** : Tableaux de bord spécifiques par rôle
- **Feedback** : Système d'amélioration continue

## Installation de la base de données

### Étape 1 : Accéder à Supabase

1. Connectez-vous à votre projet Supabase
2. Allez dans l'onglet "SQL Editor"

### Étape 2 : Exécuter le script

1. Ouvrez le fichier `database_setup.sql`
2. Copiez tout son contenu
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur "Run" pour exécuter

### Tables créées

- **profiles** : Profils des commerciaux
- **applications** : Candidatures
- **training_progress** : Progression de la formation
- **kpis_fixer** : KPI des Fixers
- **kpis_closer** : KPI des Closers
- **feedback** : Retours et suggestions

## Statuts utilisateur

1. **applicant** : Candidature en cours
2. **framework_accepted** : Cadre accepté
3. **in_training** : Formation en cours
4. **validated** : Validation réussie
5. **active** : Commercial actif
6. **rejected** : Candidature refusée

## Navigation

Le système redirige automatiquement les utilisateurs vers la bonne page selon leur statut :

- Pas connecté → Formulaire de candidature
- applicant → Page d'acceptation du cadre
- framework_accepted → Formation
- in_training → Validation
- validated → Activation
- active → Dashboard

## Développement

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build
```

## Variables d'environnement

Les variables Supabase sont déjà configurées dans `.env` :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Chaque utilisateur accède uniquement à ses propres données
- Authentification requise pour toutes les routes protégées
- Politiques de sécurité strictes

## Conformité Qualiopi

Le système couvre les indicateurs Qualiopi :

- **Indicateur 1-2** : Information claire
- **Indicateur 18** : Rôles et responsabilités
- **Indicateur 21-22** : Compétences intervenants
- **Indicateur 27** : Sous-traitance commerciale
- **Indicateur 32** : Amélioration continue

## Mode Admin

Le mode admin permet de naviguer dans toutes les pages restreintes sans données utilisateur. Ceci est utile pour les démonstrations et les tests.

### Activation

1. Cliquez **5 fois consécutivement** sur le logo Aissociate n'importe où dans l'application
2. Un badge "ADMIN" apparaît sur le logo
3. Un indicateur "MODE ADMIN" s'affiche dans la navigation

### Fonctionnalités en mode admin

- Accès à toutes les pages sans authentification
- Bypass des vérifications de statut
- Les pages affichent du contenu de démonstration
- Badge visuel pour identifier le mode actif

### Désactivation

Cliquez à nouveau 5 fois sur le logo pour désactiver le mode admin.

## Support

Pour toute question : contact@aissociate.re
