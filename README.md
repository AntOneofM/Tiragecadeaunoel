# 🎄 Tirage au Sort des Cadeaux de Noël

Application web pour organiser un tirage au sort secret pour les cadeaux de Noël en famille.

## 🚀 Fonctionnalités

- 🔐 Connexion par lien unique pour chaque participant
- 🎡 Roue de la chance interactive pour le tirage
- 👥 Gestion des participants et des restrictions
- 📊 Tableau de bord administrateur
- 🎨 Interface festive avec effets de neige

## 📋 Structure du projet

```
cadeaux_noelv2/
├── backend/          # API Express.js
│   ├── server.js
│   ├── data/        # Fichiers JSON (participants, tirages, etc.)
│   └── package.json
└── frontend/         # Application React + Vite
    ├── src/
    │   ├── components/
    │   └── config.js # Configuration API
    └── package.json
```

## 🛠️ Installation locale

### Prérequis
- Node.js 18+ et npm

### Backend
```bash
cd backend
npm install
npm start
```
Le serveur démarre sur `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
L'application démarre sur `http://localhost:5173`

## 📖 Guide de déploiement

Consultez le fichier [DEPLOY.md](./DEPLOY.md) pour les instructions complètes de déploiement.

## 🔧 Configuration

### Variables d'environnement

**Frontend** (`frontend/.env` ou `.env.local`):
```
VITE_API_URL=http://localhost:3001
```

Pour la production, utilisez l'URL de votre backend déployé.

### Restrictions de tirage

Les restrictions sont définies dans :
- `frontend/src/components/WheelDraw.jsx` (lignes 19-35)
- `frontend/src/components/DrawInterface.jsx` (lignes 13-29)

## 📝 Notes

- Les données sont stockées dans des fichiers JSON (backend/data/)
- Pour la production, envisagez d'utiliser une base de données
- Le backend doit être configuré pour utiliser `process.env.PORT` en production

## 🎯 Déploiement rapide

### Option recommandée :
1. **Backend** : Railway.app (gratuit)
2. **Frontend** : Vercel.com (gratuit)

Voir [DEPLOY.md](./DEPLOY.md) pour les détails.

---

Bon Noël ! 🎅🎄

