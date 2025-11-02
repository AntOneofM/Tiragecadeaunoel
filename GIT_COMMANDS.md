# Commandes Git pour déployer sur GitHub

Exécutez ces commandes dans l'ordre dans votre terminal PowerShell :

## 1. Initialiser le repository (déjà fait)
```powershell
git init
```

## 2. Ajouter tous les fichiers
```powershell
git add .
```

## 3. Créer le premier commit
```powershell
git commit -m "Initial commit - Application de tirage au sort de Noël"
```

## 4. Ajouter le remote GitHub
```powershell
git remote add origin https://github.com/AntOneofM/Tirage_cadeau_noel.git
```

## 5. Vérifier le remote
```powershell
git remote -v
```

## 6. Pousser sur GitHub (branche main)
```powershell
git branch -M main
git push -u origin main
```

---

## Si vous avez déjà un repository existant sur GitHub et que vous voulez forcer :

```powershell
git push -u origin main --force
```

⚠️ Attention : `--force` écrase tout ce qui existe sur GitHub. Utilisez-le seulement si vous êtes sûr !

