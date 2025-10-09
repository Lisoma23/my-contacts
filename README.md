# 📇 MY-CONTACTS

## 🚀 Description

**My-Contacts** est une application backend **Node.js** qui permet à des utilisateurs de **créer, consulter, modifier et supprimer des contacts** personnels.  
L’application utilise **Node.js, Express, MongoDB, Mongoose et JWT** pour le backend et **React** pour le frontend.  

Chaque utilisateur possède son propre compte et un **jeton JWT** pour sécuriser l’accès aux routes de gestion des contacts.

---

## ✨ Fonctionnalités principales

- 🔐 Inscription et connexion des utilisateurs avec **hashage des mots de passe**  
- 📇 Gestion sécurisée des contacts par utilisateur (JWT)  
- 📧 Validation des emails et numéros de téléphone  
- 🛠 API RESTful complète avec gestion des erreurs (400, 401, 403, 404, 409, 500)  

---

## 🧰 Stack

- **Backend :** Node.js, Express, MongoDB, Mongoose, JWT  
- **Frontend :** React (non inclus)  
- **Tests :** Jest, Supertest, MongoDB Memory Server  

---

## ⚙️ Installation


1. Cloner le dépôt :

```bash
git clone <URL_DU_DEPOT>
cd <NOM_DU_PROJET>
```

2. Installer les dépendances (dans client et server) :

```bash
npm install
```

3. Créer un fichier `.env` à la racine du dossier server avec les variables suivantes :

```env
MONGO_URI=<votre_URI_MongoDB>
JWT_SECRET=<votre_secret_JWT>
corsOrigin=<url_du_front>
```

4. Lancer le serveur :

```bash
npm start
```

Le serveur sera disponible sur `http://localhost:3000`.


5. Créer un fichier `.env` à la racine du dossier client avec les variables suivantes :

```env
VITE_SERVER_URL=<url_du_server>
```

6. Lancer le front en mode développement :

```bash
npm run dev
```

Le front sera disponible sur `http://localhost:5173`.

---

## 🛣 Routes API

### Users

| Méthode | Endpoint          | Description                                 | Codes / Erreurs possibles |
|---------|-----------------|---------------------------------------------|---------------------------|
| GET    | `/api/users` | Récupère la liste des utilisateurs                 | 200 → Liste retorunée, 500 → ServerError                                                 |

### Authentification

| Méthode | Endpoint          | Description                                 | Codes / Erreurs possibles |
|---------|-----------------|---------------------------------------------|---------------------------|
| POST    | `/auth/register` | Crée un nouvel utilisateur                  | 201 → User created, 400 → ValidationError, 403 → Email/Phone déjà utilisé, 500 → ServerError |
| POST    | `/auth/login`    | Authentifie un utilisateur et retourne un JWT | 200 → Token retourné, 400 → Email ou mot de passe manquant, 401 → Incorrect Login/Password, 500 → ServerError |

### Contacts (JWT requis)

| Méthode | Endpoint                   | Description                                      | Codes / Erreurs possibles |
|---------|----------------------------|-------------------------------------------------|---------------------------|
| GET     | `/contact/get`             | Récupère tous les contacts de l'utilisateur   | 200 → Contacts retournés, 401 → No token / Invalid Token, 404 → idUser invalid, 500 → ServerError |
| POST    | `/contact/add`             | Crée un nouveau contact                        | 201 → Contact created, 400 → ValidationError, 401 → No token / Invalid Token, 409 → Contact déjà existant, 500 → ServerError |
| PATCH   | `/contact/patch/:id`       | Met à jour un contact existant                 | 200 → Contact mis à jour, 304 → Contact non modifié, 401 → No token / Invalid Token, 403 → Unauthorized, 404 → Contact not found, 500 → ServerError |
| DELETE  | `/contact/delete/:id`      | Supprime un contact existant                   | 200 → Contact deleted, 401 → No token / Invalid Token, 403 → Unauthorized, 404 → Contact not found, 500 → ServerError |


---

## 🧪 Tests

L'application inclut des tests unitaires et d’intégration avec **Jest** et **Supertest**, ainsi qu'une base de données en mémoire avec **MongoDB Memory Server** pour éviter d’impacter la base de données réelle.

### Exécution des tests

Pour lancer les tests :

```bash
npm test
```
### Scénarios testés
#### Middleware requireAuth

- **401** : aucun token fourni → `No token provided.`
- **401** : token invalide → `Invalid Token`
- **401** : token valide mais ne contient pas de `userId` → `idUser Required`
- **200 / Next()** : token valide contenant `userId` → la requête continue

### Routes d’authentification

#### POST /auth/register :

- **201** : création réussie de l’utilisateur → `User created`
- **400** : `ValidationError` si champs manquants ou email/téléphone invalides → renvoie les erreurs spécifiques par champ
- **403** : email ou téléphone déjà utilisé → `Email or Phone already in use`
- **500** : erreur serveur → `Server error`

#### POST /auth/login :

- **200** : connexion réussie → renvoie le token JWT et le prénom de l’utilisateur (`token`, `userName`)
- **400** : email ou mot de passe manquant → `User email required` / `User password required`
- **401** : login ou mot de passe incorrect → `Incorrect Login/Password`
- **500** : erreur serveur → `Server error`


#### Routes de gestion des contacts (JWT requis)

#### POST /contact/add :

- **201** : contact créé avec succès → `Contact created`
- **400** : validationError si champs manquants ou numéro invalide → `errors` détaillées
- **401** : token manquant ou invalide → `No token provided.` / `Invalid Token`
- **409** : contact déjà existant → `Contact already exists`
- **500** : erreur serveur → `Server error`


#### GET /contact/get :

- **200** : retourne la liste des contacts de l’utilisateur → `message: [contacts]`
- **401** : token manquant ou invalide → `No token provided.` / `Invalid Token`
- **404** : idUser invalide → `idUser invalid`
- **500** : erreur serveur → `Server error`


#### PATCH /contact/patch/:id :

- **200** → contact mis à jour avec succès → retourne le contact mis à jour
- **304** → contact non modifié (mêmes valeurs)
- **401** → token manquant ou invalide → `No token provided.` / `Invalid Token`
- **403** → modification non autorisée (contact appartenant à un autre utilisateur) → `Unauthorized to edit this contact`
- **404** → contact introuvable → `Contact not found`
- **500** → erreur serveur → `Server error`


#### DELETE /contact/delete/:id :

- **200** → contact supprimé avec succès → `Contact deleted successfully`
- **401** → token manquant ou invalide → `No token provided.` / `Invalid Token`
- **403** → suppression non autorisée (contact appartenant à un autre utilisateur) → `Unauthorized to delete this contact`
- **404** → contact introuvable → `Contact not found`
- **500** → erreur serveur → `Server error`

    
### Résultats attendus

Après avoir lancé les tests avec `npm test`, vous devriez obtenir un retour similaire à l’image ci-dessous :

<img width="380" height="83" alt="Résultats des tests Jest et Supertest" src="https://github.com/user-attachments/assets/b3a5942c-b02f-4eb4-a213-68a42f8b4b0a" />



