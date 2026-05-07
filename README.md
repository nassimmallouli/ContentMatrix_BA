# 📊 Content Matrix — Karray Group

Application full-stack de gestion de contenu : grille **Type × Domaine** avec stockage cloud via Supabase.

## Stack

- **Frontend** : React 18 + Vite
- **Backend** : Node.js + Express
- **Base de données** : Supabase (PostgreSQL)
- **Stockage fichiers** : Supabase Storage

---

## ⚡ Setup rapide

### 1. Supabase

### 2. Serveur (Node.js)

```bash
cd server
cp .env.example .env
# Remplis .env avec tes clés Supabase
npm install
npm run dev
# → http://localhost:4000
```

### 3. Client (React)

```bash
cd client
npm install
npm run dev
# → http://localhost:3000
```

### Ou tout en une commande (depuis la racine)

```bash
npm install
npm run install:all
npm run dev
```

---

## Variables d'environnement (`server/.env`)

```env
PORT=4000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOi...   # service_role key
SUPABASE_BUCKET=content-matrix
```

---

## Fonctionnalités

| Feature | Description |
|---|---|
| 🗂 Matrice Type × Domaine | Vue grille avec heatmap de densité |
| 📋 Vue Liste | Tableau filtrable et triable |
| 🖼 Vue Galerie | Grille de cartes avec aperçu |
| ➕ Formulaire création | Texte / URL / Fichier (upload Supabase) |
| 🖱 Drag & Drop | Dépose un fichier dans une cellule → upload auto |
| 🌐 Drop global | Dépose n'importe où → sélecteur de domaine |
| 🔍 Recherche + filtres | Par type, domaine, statut, texte libre |
| 📤 Export / Import | JSON pour backup ou migration |
| ♻️ Duplication | Clone rapide d'une fiche |
| ☁️ Cloud sync | Supabase temps réel |

## Types de contenu

- 🌐 HTML — Pages web, landing pages, newsletters
- 🎞 GIF — Animations courtes
- 🖼 Affiche — Visuels fixes, posts social
- ▶ Vidéo — Clips, tutos, replays
- 📝 Texte — Articles, scripts, posts

## Domaines

| Groupe | Domaines |
|---|---|
| Métier | ISO, Gestion Projet, Transformation |
| IT | Cybersécurité, Développement, Data, Applications |

---

## Architecture

```
content-matrix/
├── server/
│   ├── src/index.js       # Express API (CRUD + upload)
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── App.jsx         # Composant principal
│   │   ├── components/     # UI components
│   │   ├── hooks/          # useDocuments, useToast
│   │   └── lib/            # config, api client
│   └── vite.config.js
└── supabase-setup.sql      # Script SQL à exécuter
```
