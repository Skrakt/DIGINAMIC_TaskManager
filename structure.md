# Structure du projet

## Description du projet

Task Manager est une application fullstack construite avec Angular pour le frontend, Node.js / Express pour le backend, et MongoDB pour la base de données. L’authentification est gérée avec JWT et la persistance des données avec Mongoose.

## Sommaire

- [Structure du projet](#structure-du-projet)
  - [Description du projet](#description-du-projet)
  - [Sommaire](#sommaire)
  - [1 - Besoins utilisateurs](#1---besoins-utilisateurs)
  - [2 - Choix des techno](#2---choix-des-techno)
    - [2.1 - Mysql ou MongoDB ?](#21---mysql-ou-mongodb-)
    - [2.2 Pourquoi Angular ?](#22-pourquoi-angular-)
    - [2.3 Pourquoi NestJS ?](#23-pourquoi-nestjs-)
  - [3 - Schéma de document MongoDB](#3---schéma-de-document-mongodb)
    - [3.1 - La collection "users"](#31---la-collection-users)
    - [3.2 - La collection "tasks"](#32---la-collection-tasks)
  - [4 - Stack complète](#4---stack-complète)
    - [4.1 - Frontend](#41---frontend)
    - [4.2 - Backend](#42---backend)
    - [4.3 - Securité](#43---securité)
    - [4.4 - Outils de développement](#44---outils-de-développement)
  - [5 - Routing](#5---routing)
    - [5.1 - User](#51---user)
    - [5.2 - Tâches](#52---tâches)
  - [6 - Arborescence](#6---arborescence)
    - [6.1 Frontend](#61-frontend)
    - [6.2 Backend](#62-backend)


## 1 - Besoins utilisateurs

- inscription utilisateur
- connexion utilisateur
- déconnexion
- gestion du profil
- création de tâches
- modification de tâches
- suppression de tâches
- ajout de catégories aux tâches
- ajout de status aux tâches
- marquer une tâche comme terminée
- filtrer les tâches
- rechercher les tâches
- consulter le tableau des statistiques

## 2 - Choix des techno

### 2.1 - Mysql ou MongoDB ?

Pour la base de données de ce projet, j’ai choisi d’utiliser **MongoDB**. N’ayant encore jamais utilisé cette technologie dans un projet, cela me permet également de découvrir et d’apprendre le fonctionnement d’une base de données **NoSQL**.

Même si MongoDB peut être moins performant que MySQL dans certains cas, il reste largement suffisant pour une application de gestion de tâches de taille modérée.

MongoDB présente aussi l’avantage d’être **flexible, rapide à mettre en place et simple à maintenir**, ce qui correspond bien à un objectif de prototypage rapide. Sa structure basée sur des **documents JSON** s’intègre naturellement avec JavaScript et TypeScript, ce qui rend la manipulation des données plus intuitive dans une application Node.js.

### 2.2 Pourquoi Angular ?

Pour le développement du frontend, j’ai choisi d’utiliser **Angular**. Ce framework permet de construire des applications web structurées et maintenables grâce à son architecture basée sur **composants, services et modules**.

Angular intègre également de nombreux outils utiles comme le **routing**, la **gestion des formulaires**, les **requêtes HTTP** et une forte intégration avec **TypeScript**, ce qui améliore la lisibilité et la fiabilité du code.

Ce choix me permet de développer une interface utilisateur claire et organisée, tout en appliquant des bonnes pratiques pour la construction d’applications frontend modernes.

### 2.3 Pourquoi NestJS ? 

Pour le développement du backend de cette application, j’ai choisi d’utiliser **NestJS**. Ce framework repose sur **Node.js et Express**, mais propose une architecture beaucoup plus structurée et adaptée aux applications de taille moyenne ou importante.

NestJS organise naturellement le code en **modules, contrôleurs et services**, ce qui permet de mieux séparer les responsabilités et de maintenir une structure claire et évolutive.

Il offre également plusieurs fonctionnalités utiles comme **l’injection de dépendances**, la **validation des données avec les DTO**, ainsi qu’une **intégration simple avec MongoDB, Mongoose et JWT** pour l’authentification.

Ce choix me permet donc de construire une API plus propre, maintenable et évolutive, tout en appliquant de bonnes pratiques d’architecture backend.

## 3 - Schéma de document MongoDB

### 3.1 - La collection "users"

``` json
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: String
}
```

### 3.2 - La collection "tasks"

``` json
{
  _id: ObjectId,
  authorId: ObjectId,
  title: String,
  description: String,
  status: String,
  priority: String,
  category: String,
}
```

## 4 - Stack complète

### 4.1 - Frontend

- Angular (Forms, HttpClient, Material, Router)
- TypeScript
- RxJS

### 4.2 - Backend

- Node.js
- Nest.js
- Mongoose
- express-validator
- MongoDB

### 4.3 - Securité

- bcryptsjs => hash des mots de passe
- jsonwebtoken (JWT) => authentification
- dotenv => gestion des variables environnement

### 4.4 - Outils de développement

- Postman
- Git

## 5 - Routing

### 5.1 - User

```
POST /api/auth/register
POST /api/auth/login
```

### 5.2 - Tâches

 ```
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

## 6 - Arborescence 

Pour ce projet, l'application sera séparée en deux parties :

- 'frontend' pour le frontend Angular
- 'backend' pour le backend Nest.js

### 6.1 Frontend

Arborescence principale frontend angular :

```
app/
```

- *src*
  - *app*
    - *core*
      - *services*
        - **auth.service.ts**
        - **task.service.ts**
      - *guards*
        - **auth.guards.ts**
      - *interceptors*
        - **auth.interceptors.ts**
    - *features*
      - *auth*
        - *login*
          - **login.component.ts**
          - **login.component.html**
          - **login.component.css**
        - *register*
          - **register.component.ts**
          - **register.component.html**
          - **register.component.css**
      - *profile*
        - **profile.component.ts**
        - **profile.component.html**
        - **profile.component.css**
      - *tasks*
        - *task_list*
          - **task_list.component.ts**
          - **task_list.component.html**
          - **task_list.component.css**
        - *task_form*
          - **task_form.component.ts**
          - **task_form.component.html**
          - **task_form.component.css**
        - *task_item*
          - **task_item.component.ts**
          - **task_item.component.html**
          - **task_item.component.css**
        - *task_search*
          - **task_search.component.ts**
          - **task_search.component.html**
          - **task_search.component.css**
      - *dashboard*
        - **dashboard.component.ts**
        - **dashboard.component.html**
        - **dashboard.component.css**
    - *shared*
      - *components*
        - *navbar*
          - **navbar.component.ts**
          - **navbar.component.html**
          - **navbar.component.css**
        - *sidebar*
          - **sidebar.component.ts**
          - **sidebar.component.html**
          - **sidebar.component.css**
        - *loader*
          - **loader.component.ts**
          - **loader.component.html**
          - **loader.component.css**
        - *confirm_dialog*
          - **confirm_dialog.component.ts**
          - **confirm_dialog.component.html**
          - **confirm_dialog.component.css**
      - *models*
        - **user.model.ts**
        - **task.model.ts**
        - **stats.model.ts**
  - *assets*
  - *envrionnement*
    - **environment.ts**
    - **environment.development.ts**
  - **index.html**
  - **main.ts**
  - **styles.css**
- **angular.json**
- **package.json**
- **tsconfig.json**
- **README.md**

--- 

### 6.2 Backend

Arborescence principale backend nest :

```
lib/
```

- *src* 
  - *auth*
    - *dto*
      - **login.dto.ts**
      - **register.dto.ts**
    - *guards*
      - **jwt_auth.guard.ts**
    - *strategies*
      - **jwt.strategy.ts**
    - **auth.controller.ts**
    - **auth.service.ts**
    - **auth.module.ts**
  - *users*
    - *dto*
      - **update_user.dto.ts**
    - *schemas*
      - **user.schema.ts**
    - **users.controller.ts**
    - **users.service.ts**
    - **users.module.ts**
  - *tasks*
    - *dto*
      - **create_task.dto.ts**
      - **update_task.dto.ts**
      - **query_task.dto.ts**
    - *schemas*
      - **task.schema.ts**
    - **tasks.controller.ts**
    - **tasks.service.ts**
    - **tasks.module.ts**
  - *stats*
    - **stats.controller.ts**
    - **stats.service.ts**
    - **stats.module.ts**
  - *common*
    - *decorators*
      - **current_user.decorator.ts**
    - *filters*
      - **http_exception.filter.ts**
    - *interceptors*
      - **response.interceptors.ts**
      - **logging.interceptors.ts**
    - *pipes*
      - **mongo-id.pipe.ts**
  - *config*
    - *configuration.ts*
  - **app.module.ts**
  - **main.ts**
- **.env**
- **package.json**
- **nest-cli.json**
- **tsconfig.build.json**
- **tsconfig.json**
- **README.md**

