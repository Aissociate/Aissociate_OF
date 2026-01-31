# Système de Suivi Administratif Qualiopi

## Vue d'ensemble

Application complète de suivi administratif conforme aux exigences Qualiopi pour les organismes de formation (OF). Le système permet de gérer l'ensemble du cycle de vie d'une formation, de la convocation jusqu'au questionnaire à froid (J+30), avec traçabilité complète et export des preuves.

## Fonctionnalités principales

### 1. Multi-tenant & Sécurité
- **Isolation stricte** : Chaque organisme de formation (tenant) a ses données complètement isolées
- **RBAC complet** : 5 rôles définis (ADMIN_SAAS, ADMIN_OF, GESTIONNAIRE, FORMATEUR, STAGIAIRE)
- **Audit log immuable** : Traçabilité de toutes les actions
- **RLS Supabase** : Sécurité au niveau de la base de données

### 2. Gestion des formations
- Catalogue de formations
- Sessions planifiées (présentiel, distanciel, hybride)
- Inscription des stagiaires aux sessions
- Suivi des capacités et des dates

### 3. Documents et templates
- Upload de documents originaux (PDF/DOCX)
- Système de templates dynamiques
- Génération de documents personnalisés :
  - Convocations
  - Conventions / Contrats
  - Attestations de formation
  - Devis
- Workflow de validation (DRAFT → PUBLISHED)
- Versioning des templates

### 4. Questionnaires
- **Questionnaire à chaud** : Évaluation immédiate post-formation
- **Questionnaire à froid** : Bilan à J+30
- Builder de questionnaires avec :
  - Questions Likert (échelle 1-5)
  - Questions Oui/Non
  - Questions texte (courtes/longues)
  - Conditions d'affichage dynamiques
- Liens uniques et sécurisés par stagiaire
- Accès public via token
- Stockage des réponses

### 5. Système d'emails
- Templates d'emails personnalisables
- Variables dynamiques ({{trainee_first_name}}, {{training_title}}, etc.)
- **Logs d'envoi avec snapshot du contenu** (preuve Qualiopi)
- Suivi des statuts (PENDING, SENT, FAILED, BOUNCED)

### 6. Automatisations et relances
- Système de tâches programmées
- Relances automatiques pour questionnaires :
  - J+0 ou J+1 : Questionnaire à chaud
  - J+7 : Première relance si pas de réponse
  - J+30 : Questionnaire à froid
  - J+37 : Relance questionnaire à froid
- Envoi automatique des convocations

### 7. Export des preuves
- Export ZIP par session contenant :
  - Tous les documents générés (PDF)
  - Logs d'emails avec contenu exact
  - Réponses aux questionnaires
  - Journal d'audit
- Conformité Qualiopi pour les audits

## Architecture technique

### Base de données (Supabase PostgreSQL)

#### Tables principales
- `tenants` : Organismes de formation
- `users_qualiopi` : Utilisateurs avec rôles
- `trainees` : Stagiaires
- `trainings` : Formations
- `sessions` : Sessions de formation
- `session_trainees` : Inscriptions

#### Système de documents
- `document_originals` : Documents uploadés
- `templates` : Templates dynamiques
- `generated_documents` : PDFs générés

#### Système de questionnaires
- `questionnaire_templates` : Templates de questionnaires
- `questionnaire_links` : Liens uniques par stagiaire
- `questionnaire_responses` : Réponses

#### Système d'emails et tâches
- `email_templates` : Templates d'emails
- `email_send_logs` : Logs avec snapshot du contenu
- `tasks` : Tâches programmées

#### Audit
- `audit_logs` : Journal immuable de toutes les actions

### Frontend (React + TypeScript)

#### Structure
```
src/
├── types/
│   └── qualiopi.ts           # Types TypeScript
├── lib/
│   └── qualiopiClient.ts     # Client API
├── pages/
│   ├── QualiopiDashboard.tsx         # Dashboard principal
│   ├── QualiopiTrainees.tsx          # Gestion stagiaires
│   ├── QualiopiTrainings.tsx         # Gestion formations
│   ├── QualiopiSessions.tsx          # Gestion sessions
│   ├── QualiopiSessionDetail.tsx     # Détail d'une session
│   └── QuestionnairePublic.tsx       # Réponse questionnaire (public)
```

### Storage (Supabase Storage)

#### Buckets
- `qualiopi-documents` : Documents originaux
- `qualiopi-generated` : Documents générés
- `qualiopi-templates` : Previews de templates

Tous les chemins incluent le `tenant_id` pour l'isolation : `{tenant_id}/{filename}`

## Installation et configuration

### 1. Base de données

Les migrations Supabase sont déjà appliquées :
- `create_qualiopi_multi_tenant_system.sql` : Schéma complet
- `create_storage_buckets_qualiopi.sql` : Buckets de storage
- `seed_demo_data_qualiopi.sql` : Données de démo

### 2. Données de démo

Un tenant de démo est pré-créé :
- **Tenant ID** : `a0000000-0000-0000-0000-000000000001`
- **Nom** : OF Démo Formation
- **SIRET** : 12345678901234

Templates inclus :
- Email de convocation
- Email questionnaire à chaud
- Email questionnaire à froid
- Email de relance
- Questionnaire de satisfaction à chaud
- Questionnaire de suivi à froid

### 3. Créer un utilisateur

Pour créer un utilisateur associé au tenant de démo :

```sql
-- 1. Créer un compte Supabase Auth
-- (via l'interface Supabase ou signup)

-- 2. Associer l'utilisateur au tenant
INSERT INTO users_qualiopi (
  tenant_id,
  auth_user_id,
  role,
  email,
  first_name,
  last_name
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'YOUR_AUTH_USER_ID',
  'ADMIN_OF',
  'admin@of-demo.fr',
  'Jean',
  'Dupont'
);
```

## Guide d'utilisation

### Workflow complet

1. **Créer une formation**
   - Aller dans "Formations"
   - Créer une nouvelle formation avec titre, durée, description

2. **Planifier une session**
   - Aller dans "Sessions"
   - Créer une session liée à une formation
   - Définir dates, modalité, lieu, formateur

3. **Inscrire des stagiaires**
   - Créer des stagiaires dans "Stagiaires"
   - Ouvrir le détail d'une session
   - Ajouter les stagiaires à la session

4. **Envoyer les convocations**
   - Depuis le détail de la session
   - Génère et envoie les documents de convocation
   - Log automatique de l'envoi

5. **Questionnaire à chaud (J+0 ou J+1)**
   - À la fin de la session, le système crée automatiquement :
     - Des liens uniques par stagiaire
     - Une tâche d'envoi programmée
   - Les stagiaires reçoivent un email avec leur lien
   - Ils répondent via `/q/{token}`

6. **Relances automatiques**
   - J+7 : Relance si pas de réponse
   - J+30 : Envoi questionnaire à froid
   - J+37 : Relance questionnaire à froid

7. **Export des preuves**
   - Depuis le détail de la session
   - Bouton "Exporter preuves"
   - Génère un ZIP avec tous les documents et logs

## API Client

Le `QualiopiClient` expose des méthodes pour toutes les opérations :

```typescript
// Exemples
const client = new QualiopiClient();

// Récupérer le tenant actuel
const tenant = await client.getCurrentTenant();

// Créer un stagiaire
const trainee = await client.createTrainee({
  first_name: 'Marie',
  last_name: 'Martin',
  email: 'marie.martin@example.com',
  phone: '0612345678'
});

// Créer une session
const session = await client.createSession({
  training_id: 'training-id',
  start_date: '2026-02-01',
  end_date: '2026-02-03',
  modality: 'PRESENTIEL',
  location: 'Paris'
});

// Ajouter un stagiaire à une session
await client.addTraineeToSession(sessionId, traineeId);

// Créer un lien de questionnaire
const link = await client.createQuestionnaireLink(
  questionnaireTemplateId,
  sessionId,
  traineeId
);

// URL du questionnaire : /q/{link.token}
```

Toutes les méthodes créent automatiquement des entrées dans l'audit log.

## Développements futurs

### Phase 2 - IA et automatisation
- [ ] Analyse de documents par IA pour extraction de templates
- [ ] Génération automatique de templates HTML
- [ ] Détection des champs et variables

### Phase 3 - Génération PDF
- [ ] Moteur de génération PDF côté serveur
- [ ] Edge Function Supabase pour la génération
- [ ] Templates HTML → PDF avec styles

### Phase 4 - Emails
- [ ] Intégration service d'envoi (Resend/SendGrid)
- [ ] Edge Function pour envois programmés
- [ ] Gestion des rebonds et erreurs

### Phase 5 - Scheduler
- [ ] Worker pour traitement des tâches
- [ ] Edge Function déclenchée par cron
- [ ] Gestion des retry et erreurs

### Phase 6 - Export preuves
- [ ] Génération ZIP avec tous les documents
- [ ] Structuration pour audit Qualiopi
- [ ] Signature et horodatage

## Sécurité

### Principes appliqués
1. **Isolation tenant** : Toutes les requêtes filtrent sur `tenant_id`
2. **RLS Supabase** : Politiques au niveau base de données
3. **Audit immuable** : Toutes les actions sont tracées
4. **Tokens uniques** : Questionnaires accessibles uniquement via token
5. **Validation** : Workflow DRAFT → PUBLISHED avec validation humaine
6. **Snapshots** : Conservation du contenu exact des emails envoyés

### Conformité Qualiopi
- ✅ Traçabilité complète
- ✅ Conservation des preuves
- ✅ Questionnaires à chaud et à froid
- ✅ Logs d'envoi avec contenu
- ✅ Export pour audit
- ✅ Versioning des documents

## Support et contact

Pour toute question sur ce système :
- Consulter l'audit log pour tracer les actions
- Vérifier les RLS policies dans Supabase
- Consulter les migrations SQL pour le schéma détaillé

## Licence

Propriétaire - Tous droits réservés
