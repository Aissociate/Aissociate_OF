# Configuration de l'analyse IA des documents de formation

## Vue d'ensemble

Le système utilise l'IA pour extraire automatiquement les informations depuis les PDF de programmes de formation.

## Fonctionnalités

Lors de l'upload d'un PDF, l'IA extrait automatiquement:

- **Titre** de la formation
- **Description** complète (objectifs, compétences, public cible)
- **Durée** en jours (conversion automatique depuis heures → jours)
- **Métadonnées structurées**:
  - Objectifs pédagogiques
  - Prérequis
  - Public cible
  - Programme détaillé avec modules
  - Modalités d'évaluation
  - Nom du formateur

## Configuration requise

### 1. Clé API OpenRouter

Obtenez une clé API sur [https://openrouter.ai/](https://openrouter.ai/)

### 2. Ajoutez la variable d'environnement

Dans les paramètres de Bolt, ajoutez:

```
OPENROUTER_API_KEY=sk-or-v1-...
```

## Utilisation

### Créer une nouvelle formation

1. Cliquez sur **"Nouvelle formation"**
2. **Uploadez d'abord le PDF** du programme
3. Les champs titre et durée deviennent optionnels
4. Cliquez sur **"Créer"**
5. L'IA analyse le PDF et remplit automatiquement tous les champs

### Ajouter un PDF à une formation existante

1. Cliquez sur **"Ajouter PDF"** sur une formation
2. Sélectionnez le fichier PDF
3. Cliquez sur **"Uploader"**
4. Les informations sont mises à jour automatiquement

## Modèle IA utilisé

- **Modèle**: Google Gemini 2.0 Flash (gratuit via OpenRouter)
- **Contexte**: Jusqu'à 25 000 caractères du PDF
- **Température**: 0.2 (précision maximale)

## Notes importantes

- Si aucune clé API n'est configurée, seul le texte brut sera extrait
- L'extraction IA se fait de manière asynchrone après la création
- Les champs peuvent être modifiés manuellement après l'extraction
