# Guide de Déploiement - Tirage au Sort de Noël 🎄

Ce guide vous explique comment déployer votre application frontend et backend.

## 📋 Prérequis

- Compte GitHub
- Compte sur une plateforme de déploiement (Vercel/Netlify pour le frontend, Railway/Render pour le backend)

## 🚀 Option 1 : Déploiement sur Vercel (Recommandé)

### Frontend sur Vercel (Gratuit)

1. **Préparer le projet**
   ```bash
   cd frontend
   npm run build
   ```

2. **Déployer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez votre compte GitHub
   - Importez votre repository
   - Configurez :
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   
3. **Variables d'environnement**
   - Dans Vercel, allez dans Settings > Environment Variables
   - Ajoutez : `VITE_API_URL` avec l'URL de votre backend déployé
     - Exemple : `https://votre-backend.railway.app` ou `https://votre-backend.onrender.com`

### Backend sur Railway (Gratuit avec limitations)

1. **Créer un compte sur Railway**
   - Allez sur [railway.app](https://railway.app)
   - Connectez avec GitHub

2. **Nouveau projet**
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository
   - Sélectionnez le dossier `backend`

3. **Configuration**
   - Railway détecte automatiquement Node.js
   - Le port sera géré automatiquement par Railway (variable `PORT`)

4. **Variables d'environnement**
   - Railway génère automatiquement une URL publique
   - Notez cette URL pour la configurer dans Vercel

5. **Persistance des données**
   - Les fichiers JSON dans `backend/data/` seront perdus au redémarrage
   - Pour une solution permanente, considérez une base de données (MongoDB, PostgreSQL)

## 🚀 Option 2 : Déploiement sur Netlify + Render

### Frontend sur Netlify

1. **Préparer le projet**
   ```bash
   cd frontend
   npm run build
   ```

2. **Déployer**
   - Allez sur [netlify.com](https://netlify.com)
   - Drag & drop le dossier `frontend/dist`
   - OU connectez GitHub et configurez :
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`

3. **Variables d'environnement**
   - Site settings > Build & deploy > Environment variables
   - Ajoutez : `VITE_API_URL` = URL de votre backend

### Backend sur Render

1. **Créer un compte sur Render**
   - Allez sur [render.com](https://render.com)
   - Connectez avec GitHub

2. **Nouveau Web Service**
   - Cliquez sur "New" > "Web Service"
   - Connectez votre repository
   - Configurez :
     - **Name**: `cadeaux-noel-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Variables d'environnement**
   - Render génère une URL automatiquement
   - Notez cette URL pour Netlify

## 📝 Configuration locale pour tester

Créez un fichier `frontend/.env.local` :
```
VITE_API_URL=http://localhost:3001
```

## 🔧 Configuration après déploiement

1. **Obtenez l'URL de votre backend déployé**
   - Railway/Render vous donnera une URL comme : `https://votre-app.railway.app`

2. **Mettez à jour les variables d'environnement du frontend**
   - Dans Vercel/Netlify, ajoutez : `VITE_API_URL=https://votre-app.railway.app`

3. **Redéployez le frontend**
   - Vercel/Netlify redéploie automatiquement quand vous poussez sur GitHub
   - OU déclenchez un redéploiement manuel

## ⚠️ Notes importantes

1. **Port du backend**
   - Le backend doit utiliser la variable `PORT` fournie par la plateforme
   - Modifiez `server.js` pour utiliser `process.env.PORT || 3001`

2. **CORS**
   - Assurez-vous que le backend autorise les requêtes depuis votre frontend déployé
   - Mettez à jour la configuration CORS si nécessaire

3. **Données persistantes**
   - Les fichiers JSON seront réinitialisés à chaque redéploiement
   - Pour la production, utilisez une vraie base de données

4. **Sécurité**
   - Ne commitez JAMAIS les fichiers `.env` avec des secrets
   - Utilisez les variables d'environnement de la plateforme

## 🔄 Mise à jour du backend pour la production

Modifiez `backend/server.js` pour utiliser le port de la plateforme :

```javascript
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend prêt sur le port ${PORT}`))
```

## 📦 Alternative : Déploiement complet sur un VPS

Si vous avez un VPS (DigitalOcean, Hetzner, etc.) :

1. **Installer Node.js et npm**
2. **Cloner votre repository**
3. **Installer les dépendances** (frontend et backend)
4. **Utiliser PM2** pour gérer les processus Node.js
5. **Configurer Nginx** comme reverse proxy
6. **Configurer un domaine** et SSL avec Let's Encrypt

---

Bon déploiement ! 🎉

