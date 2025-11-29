# StudyPlanner - Documentation

## Vue d'ensemble

StudyPlanner est une application web de planification d'études qui combine la méthode Pomodoro avec un système de révision espacée (SM-2) pour aider les étudiants à organiser efficacement leur temps d'étude.

## Fonctionnalités principales

### 1. Planning hebdomadaire
- Visualisation de l'emploi du temps sur 7 jours
- Affichage des cours et activités personnelles
- Vue horaire de 7h à 21h

### 2. Gestion des cours et activités
- Ajout de cours fixes avec horaires
- Ajout d'activités personnelles (sport, loisirs)
- Distinction visuelle entre cours et activités
- Suppression des entrées

### 3. Gestion des matières
- Création de sujets/matières à étudier
- Temps estimé pour chaque matière
- Système de priorité (1 à 5)
- Suivi des révisions avec SM-2

### 4. Timer Pomodoro
- Sessions de 25, 35 ou 50 minutes
- Sélection de la matière à étudier
- Évaluation de la qualité (0-5) après chaque session
- Mise à jour automatique du planning de révision

### 5. Bibliothèque de cours
- Ajout de ressources PDF (cours, exercices, fiches)
- Organisation par matière
- Filtrage par type de document
- Liens directs vers les PDF

### 6. Historique et statistiques
- Temps total d'étude
- Nombre de sessions réalisées
- Qualité moyenne des sessions
- Statistiques par matière
- Liste des dernières sessions

## Technologies utilisées

- **Frontend**: React 18
- **Styling**: TailwindCSS
- **Icons**: Lucide
- **Storage**: localStorage (navigateur)
- **Algorithme**: SM-2 pour révision espacée

## Structure du projet

```
/
├── index.html              # Page d'accueil (redirection)
├── app.js                  # Application principale
├── planning.html           # Page planning
├── planning-app.js         # Logique planning
├── courses.html            # Page cours
├── courses-app.js          # Logique cours
├── subjects.html           # Page matières
├── subjects-app.js         # Logique matières
├── pomodoro.html           # Page Pomodoro
├── pomodoro-app.js         # Logique Pomodoro
├── history.html            # Page historique
├── history-app.js          # Logique historique
├── library.html            # Page bibliothèque
├── library-app.js          # Logique bibliothèque
├── components/
│   └── Navigation.js       # Barre de navigation
└── utils/
    ├── storage.js          # Gestion localStorage
    └── sm2.js              # Algorithme SM-2
```

## Algorithme SM-2

L'algorithme SuperMemo 2 (SM-2) est utilisé pour optimiser les révisions:
- Calcul de l'intervalle optimal entre révisions
- Ajustement basé sur la qualité de la révision (0-5)
- Facteur de facilité qui évolue avec chaque révision

## Stockage des données

Toutes les données sont stockées localement dans le navigateur:
- `courses`: Liste des cours et activités
- `subjects`: Liste des matières avec métadonnées SM-2
- `sessions`: Historique des sessions Pomodoro
- `library`: Ressources PDF et documents de cours

## Prochaines améliorations possibles

- Export/import des données
- Synchronisation cloud
- Notifications pour les sessions
- Génération automatique du planning
- Statistiques avancées avec graphiques
- Mode sombre
- Application mobile native