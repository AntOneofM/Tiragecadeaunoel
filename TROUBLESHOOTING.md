# 🔧 Dépannage - Variable d'environnement non prise en compte

## ❌ Symptômes :
- L'erreur `ERR_CONNECTION_REFUSED` persiste
- La console montre toujours `localhost:3001`
- La variable d'environnement est bien configurée mais ne fonctionne pas

## ✅ Solutions à vérifier :

### 1. **Sur VERCEL** - Vérifications importantes :

#### A. Nom de la variable
- ✅ Doit être exactement : `VITE_API_URL` (en MAJUSCULES, avec préfixe VITE_)
- ❌ Pas : `API_URL` ou `REACT_APP_API_URL`

#### B. Environnement de la variable
Sur Vercel, vous devez cocher les environnements où la variable est disponible :
- ✅ **Production**
- ✅ **Preview** (optionnel mais recommandé)
- ✅ **Development** (optionnel)

#### C. Redéploiement complet
Après avoir ajouté/modifié la variable :
1. Allez dans **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Cliquez sur **Redeploy**
4. ⚠️ Assurez-vous de cocher **"Use existing Build Cache"** → **DÉCOCHEZ** pour forcer un rebuild

#### D. Vérifier dans les logs de build
Dans Vercel, allez dans le déploiement → **Build Logs**
Cherchez si Vite a bien pris en compte la variable.

### 2. **Sur NETLIFY** :

#### A. Configuration
- **Key** : `VITE_API_URL`
- **Value** : `https://tiragecadeaunoel-production.up.railway.app`
- **Scopes** : Cochez **Production**, **Deploy previews**, **Branch deploys**

#### B. Redéploiement
- Allez dans **Deploys**
- Cliquez sur **Trigger deploy** → **Deploy site**

### 3. **Vérification dans la console du navigateur**

Ouvrez la console (F12) et vous devriez voir :
```
🔧 ===== CONFIGURATION API =====
🔧 VITE_API_URL depuis env: https://tiragecadeaunoel-production.up.railway.app
🔧 URL finale utilisée: https://tiragecadeaunoel-production.up.railway.app
```

Si vous voyez `undefined` ou `null` pour "VITE_API_URL depuis env", la variable n'est pas prise en compte.

### 4. **Forcer un nouveau build**

#### Vercel :
- **Settings** → **General** → **Build & Development Settings**
- Vérifiez que :
  - **Build Command** : `npm run build`
  - **Output Directory** : `dist`
- **Clear Build Cache** dans les settings
- Redéployez

#### Netlify :
- **Site settings** → **Build & deploy** → **Build settings**
- Cliquez sur **Clear cache and deploy site**

### 5. **Test direct du backend**

Ouvrez dans votre navigateur :
```
https://tiragecadeaunoel-production.up.railway.app/participants
```

Vous devriez voir du JSON. Si vous voyez une erreur 404 ou autre, le problème vient du backend Railway.

### 6. **Solution de contournement temporaire**

Si rien ne fonctionne, vous pouvez modifier directement `frontend/src/config.js` :

```javascript
export const API_URL = 'https://tiragecadeaunoel-production.up.railway.app'
```

⚠️ **Attention** : Cette solution hardcode l'URL. C'est une solution temporaire uniquement !

---

## 📞 Informations à me donner pour que je puisse aider :

1. Quelle plateforme utilisez-vous ? (Vercel / Netlify)
2. Que voyez-vous dans la console du navigateur ? (copiez les lignes qui commencent par 🔧)
3. Le backend répond-il quand vous testez l'URL directement dans le navigateur ?
4. Avez-vous redéployé SANS le cache de build ?

