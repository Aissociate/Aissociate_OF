# Fonctionnalité : Upload de PDF pour les formations

## Vue d'ensemble

Cette fonctionnalité permet d'uploader un document PDF de programme de formation pour chaque formation dans le catalogue. Le contenu du PDF est automatiquement extrait par IA et stocké en base de données pour être utilisé dans les emails de convocation et autres communications.

## Composants ajoutés

### 1. Base de données

**Nouvelle colonne dans `trainings`:**
- `program_document_id` (uuid) : Référence vers le document PDF uploadé

**Nouvelles colonnes dans `document_originals`:**
- `extracted_text` (text) : Contenu extrait du PDF par l'IA
- `uploaded_by` (uuid) : Référence vers l'utilisateur qui a uploadé le document

**Index créés:**
- Index sur `trainings.program_document_id` pour les jointures
- Index full-text (GIN) sur `document_originals.extracted_text` pour la recherche

### 2. Edge Function

**Fonction:** `upload-training-document`

**Fonctionnalités:**
- Upload sécurisé de fichiers PDF uniquement
- Vérification de l'authentification et des permissions
- Extraction automatique du contenu du PDF
- Stockage dans Supabase Storage (bucket `qualiopi-documents`)
- Enregistrement des métadonnées en base de données
- Association automatique avec la formation

**Endpoint:**
```
POST /functions/v1/upload-training-document
```

**Paramètres (FormData):**
- `file` : Le fichier PDF
- `trainingId` : ID de la formation (optionnel)

**Réponse:**
```json
{
  "success": true,
  "document": {
    "id": "...",
    "filename": "programme.pdf",
    "file_url": "...",
    "extracted_text": "..."
  },
  "message": "Document uploaded successfully"
}
```

### 3. Interface utilisateur

**Page:** `QualiopiTrainings.tsx`

**Nouvelles fonctionnalités:**

**A. Lors de la création d'une nouvelle formation:**
- Champ d'upload intégré dans le formulaire de création
- Zone de drag-and-drop avec bordure en pointillés
- Validation automatique (PDF uniquement)
- Affichage du nom du fichier sélectionné
- Upload automatique après la création de la formation

**B. Pour les formations existantes:**
- Bouton "Ajouter PDF" sur chaque carte de formation
- Indicateur visuel (badge vert) pour les formations ayant un PDF
- Modale d'upload avec drag-and-drop
- Bouton "Voir PDF" pour visualiser le document uploadé
- Possibilité de remplacer un PDF existant
- Indicateur de progression pendant l'upload

**États visuels:**
- Formation sans PDF : Bouton bleu "Ajouter PDF"
- Formation avec PDF : Badge vert + Bouton "Voir PDF" + Icône pour remplacer
- Upload en cours : Spinner + texte "Upload en cours..."

## Extraction du contenu PDF

L'extraction du PDF se fait côté serveur dans l'Edge Function. Le processus :

1. **Lecture du fichier binaire** : Le PDF est lu en tant que Uint8Array
2. **Extraction basique** :
   - Recherche des streams de contenu dans le PDF
   - Extraction du texte entre parenthèses
   - Nettoyage des caractères spéciaux
3. **Limitation** : Le texte est tronqué à 50 000 caractères
4. **Stockage** : Le texte extrait est enregistré dans `extracted_text`

### Amélioration future possible

Pour une extraction plus précise, vous pouvez intégrer une bibliothèque comme `pdf-parse` ou utiliser une API d'extraction PDF plus avancée.

## Utilisation dans les emails

Le contenu extrait (`extracted_text`) peut être utilisé pour :
- Personnaliser les emails de convocation avec des extraits du programme
- Alimenter un système de recherche full-text
- Générer des résumés automatiques
- Analyser les programmes avec l'IA pour des suggestions

## Sécurité

### Permissions
- Seuls les utilisateurs authentifiés peuvent uploader
- Les documents sont isolés par `tenant_id`
- Les politiques RLS garantissent l'accès sécurisé

### Validation
- Seuls les fichiers PDF sont acceptés
- Vérification du type MIME
- Limite de taille gérée par Supabase Storage

### Stockage
- Les fichiers sont stockés dans le bucket `qualiopi-documents`
- Organisation par tenant : `{tenant_id}/{timestamp}_{filename}`
- URLs publiques générées automatiquement

## Intégration avec les emails

Exemple d'utilisation dans un template d'email :

```typescript
const training = await qualiopiClient.getTraining(trainingId);

if (training.program_document) {
  // Ajouter le PDF en pièce jointe
  const attachmentUrl = training.program_document.file_url;

  // Utiliser le contenu extrait pour personnaliser l'email
  const programSummary = training.program_document.extracted_text?.substring(0, 500);

  emailBody += `
    <p>Programme de la formation :</p>
    <p>${programSummary}...</p>
    <a href="${attachmentUrl}">Télécharger le programme complet (PDF)</a>
  `;
}
```

## Tests manuels

### Test 1: Upload lors de la création
1. Cliquer sur "Nouvelle formation"
2. Remplir les informations (titre, description, durée, version)
3. Cliquer sur la zone d'upload et sélectionner un PDF
4. Vérifier que le nom du fichier s'affiche
5. Cliquer sur "Créer"
6. Vérifier que la formation apparaît avec le badge vert "PDF"
7. Cliquer sur "Voir PDF" pour vérifier le lien

### Test 2: Upload pour une formation existante
1. Sur une formation sans PDF, cliquer sur "Ajouter PDF"
2. Sélectionner un fichier PDF de programme
3. Cliquer sur "Uploader"
4. Vérifier l'upload et l'apparition du badge
5. Cliquer sur "Voir PDF" pour vérifier le lien

### Test 3: Vérification en base de données
1. Vérifier que `extracted_text` contient le contenu du PDF
2. Vérifier que `program_document_id` est bien renseigné dans la table `trainings`
3. Vérifier que le fichier existe dans le bucket Storage

## Points d'attention

- L'extraction PDF basique peut ne pas capturer tous les contenus complexes (tableaux, images, etc.)
- Les PDF protégés par mot de passe ne pourront pas être extraits
- La taille maximale des fichiers est définie par Supabase Storage (par défaut 50MB)
- L'index full-text sur `extracted_text` améliore les performances de recherche mais augmente l'utilisation de stockage
