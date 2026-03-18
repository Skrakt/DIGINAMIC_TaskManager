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

## Scripts utiles

Depuis la racine :

```bash
npm run dev
```

Depuis `lib/` :

```bash
npm run start:dev
npm run seed
```

Depuis `app/` :

```bash
npm start
ng test
```
