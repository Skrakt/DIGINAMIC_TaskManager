# Task Manager

Application fullstack de gestion de taches.

- Frontend: Angular (`app/`)
- Backend: NestJS (`lib/`)
- Base de donnees: MongoDB

## Prerequis

- Node.js
- npm
- Docker (recommande pour MongoDB)

## Installation

Depuis la racine:

```bash
npm install
cd app
npm install
cd ../lib
npm install
```

## Demarrage rapide

1. Demarrer MongoDB:

```bash
docker compose up -d mongo
```

2. Lancer frontend + backend (depuis la racine):

```bash
npm run dev
```

3. URLs:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000/api`

## Configuration du backend

Le backend utilise `lib/.env`

Variables principales :

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:4200
MONGODB_URI=mongodb://mongo:27017/task-manager
JWT_SECRET=mon_secret
JWT_EXPIRES_IN=7d
```

Variables optionnelles pour le seed initial :

```env
SEED_ADMIN_NAME=Admin
SEED_ADMIN_EMAIL=admin@taskmanager.local
SEED_ADMIN_PASSWORD=Admin1234!
```

Si MongoDB tourne en local hors Docker, il faut utiliser par exemple :

```env
MONGODB_URI=mongodb://localhost:27017/task-manager
```

## Initialisation Railway

Initialisation simple sans configuration custom dans le repo:

- Connecter le repo GitHub dans Railway
- Laisser Railway detecter build/start automatiquement
- Definir uniquement les variables d'environnement necessaires

Variables Railway minimales:

```env
MONGODB_URI=<url mongo railway ou externe>
JWT_SECRET=<secret fort>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://<votre-domaine-railway>
```

`PORT` est injecte automatiquement par Railway.

## Scripts utiles

Depuis la racine :

```bash
npm run dev
```

Depuis `lib/` :

```bash
npm run start:dev
npm run build
npm run start:prod
npm run seed
```

Depuis `app/` :

```bash
npm start
npm run build
ng test
```
