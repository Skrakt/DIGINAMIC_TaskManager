# Task Manager

Application fullstack de gestion de taches construite avec Angular pour le frontend, NestJS pour le backend et MongoDB pour la database.

## Objectif du projet

Le projet a pour but de proposer une base propre pour une application de gestion de tâches avec :

- authentification JWT
- gestion des taches
- gestion des categories
- filtrage et recherche
- architecture frontend/backend separée

## Choix techniques

### Angular

Le frontend est developpe avec Angular pour bénéficier :

- d'une structure claire par composants
- d'un routing intégré
- d'un socle solide pour faire evoluer l'interface

Angular Material est utilise pour poser une base UI simple et cohérente.

### NestJS

Le backend repose sur NestJS afin de structurer l'API autour de :

- modules
- controllers
- services
- DTO de validation
- injection de dependances

Ce choix permet de garder un code maintenable et evolutif a mesure que l'application grandit.

### MongoDB + Mongoose

MongoDB a ete choisi pour sa souplesse et sa simplicite de mise en place sur un projet de taille moyenne.  
Mongoose permet de definir les schemas, les relations de reference et les regles de validation cote backend.

### JWT

L'authentification est geree via JWT pour proteger les routes backend et isoler les donnees par utilisateur.

## Architecture

Le projet est separe en deux applications :

- `app/` : frontend Angular
- `lib/` : backend NestJS

### Frontend

Structure principale :

- `app/src/app` : composants, routes et layout
- `app/src/styles.css` : base de styles globale
- `app/src/app/core` : services, guards, interceptors

Le frontend suit une logique simple :

- layout global avec header, contenu principal et footer
- composants standalone Angular
- base de style commune via variables CSS
- Angular Material pour les composants visuels

### Backend

Structure principale :

- `lib/src/auth` : authentification, JWT, guards, strategie
- `lib/src/users` : utilisateur et profil
- `lib/src/tasks` : CRUD des taches
- `lib/src/categories` : CRUD des categories
- `lib/src/common` : decorateurs et pipes reutilisables

Le backend suit une architecture NestJS classique :

- `Controller` : expose les routes HTTP
- `Service` : porte la logique metier
- `DTO` : valide les donnees entrantes
- `Schema` : decrit les documents MongoDB

## Modele de donnees

### User

Un utilisateur contient notamment :

- `name`
- `email`
- `password`
- `role`

### Category

Une categorie est rattachee a un utilisateur :

- `authorId`
- `name`
- `normalizedName`

### Task

Une tache est rattachee a un utilisateur et a une categorie :

- `authorId`
- `title`
- `description`
- `status`
- `priority`
- `categoryId`

## API principale

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users/me`

### Tasks

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Categories

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PATCH /api/categories/:id`
- `DELETE /api/categories/:id`

## Lancer le projet

### Prerequis

- Node.js
- npm
- Docker Desktop ou un serveur MongoDB local

### Installation

A la racine du projet :

```bash
npm install
```

Puis installer les dependances de chaque application :

```bash
cd app
npm install

cd ../lib
npm install
```

## Lancer en developpement

### Option 1 : avec Docker pour MongoDB

Depuis la racine :

```bash
docker compose up -d mongo
```

Puis lancer frontend et backend :

```bash
npm run dev
```

Applications disponibles :

- frontend : `http://localhost:4200`
- backend : `http://localhost:3000/api`
- mongo : `mongodb://localhost:27017`

### Option 2 : tout en Docker

Depuis la racine :

```bash
docker compose up --build
```

Applications disponibles :

- frontend : `http://localhost:4200`
- backend : `http://localhost:3000/api`

### Option 3 : lancement manuel

Backend :

```bash
cd lib
npm run start:dev
```

Frontend :

```bash
cd app
npm start
```

## Configuration du backend

Le backend utilise `lib/.env`.

Variables principales :

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:4200
MONGODB_URI=mongodb://mongo:27017/task-manager
JWT_SECRET=mon_secret
JWT_EXPIRES_IN=7d
```

Si MongoDB tourne en local hors Docker, utiliser par exemple :

```env
MONGODB_URI=mongodb://localhost:27017/task-manager
```

## Scripts utiles

Depuis la racine :

```bash
npm run dev
npm run build
```

Depuis `lib/` :

```bash
npm run start:dev
npm run test
npm run build
```

Depuis `app/` :

```bash
npm start
npm run build
ng test
```

## Etat actuel

Le projet pose deja :

- une base frontend Angular avec layout simple
- une base visuelle avec Angular Material
- une API NestJS connectee a MongoDB
- une authentification JWT minimale
- le CRUD des taches et des categories

Les prochaines etapes naturelles sont :

- brancher le frontend au backend
- ajouter les formulaires d'authentification
- afficher la liste des taches et categories
- construire le dashboard et les statistiques
