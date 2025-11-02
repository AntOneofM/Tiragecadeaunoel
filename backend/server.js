import express from 'express'
import cors from 'cors'
import fs from 'fs'

const app = express()
// Configuration CORS plus permissive pour la production
app.use(cors({
  origin: '*', // Autorise toutes les origines (à restreindre en production si besoin)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
app.use(express.json())

const PARTICIPANTS = './data/participants.json'
const DRAWS = './data/draws.json'
const UNIQUE_LINKS = './data/unique-links.json'


// Initialiser les fichiers de données s'ils n'existent pas
if (!fs.existsSync(PARTICIPANTS)) {
  fs.writeFileSync(PARTICIPANTS, JSON.stringify([
    { name: 'Mamie', color: '#ff6b6b' },
    { name: 'Martine', color: '#4ecdc4' },
    { name: 'Philippe', color: '#45b7aa' },
    { name: 'Christelle', color: '#ffd700' },
    { name: 'Florence', color: '#ffed4e' },
    { name: 'Angelo', color: '#ff6b6b' },
    { name: 'Laura', color: '#4ecdc4' },
    { name: 'Charles', color: '#45b7aa' },
    { name: 'Antoine', color: '#ffd700' },
    { name: 'Antonin', color: '#ffed4e' },
    { name: 'Cécile', color: '#ff6b6b' },
    { name: 'Lucile', color: '#4ecdc4' },
    { name: 'Bastien', color: '#45b7aa' },
    { name: 'Nicolas', color: '#ffd700' }
  ], null, 2))
}

if (!fs.existsSync(DRAWS)) {
  fs.writeFileSync(DRAWS, JSON.stringify([], null, 2))
}

if (!fs.existsSync(UNIQUE_LINKS)) {
  fs.writeFileSync(UNIQUE_LINKS, JSON.stringify([
    { name: 'Mamie', link: 'mamy-2024', isAdmin: false },
    { name: 'Martine', link: 'martine-2024', isAdmin: false },
    { name: 'Philippe', link: 'philippe-2024', isAdmin: false },
    { name: 'Christelle', link: 'christelle-2024', isAdmin: false },
    { name: 'Florence', link: 'florence-2024', isAdmin: false },
    { name: 'Angelo', link: 'angelo-2024', isAdmin: false },
    { name: 'Laura', link: 'laura-2024', isAdmin: false },
    { name: 'Charles', link: 'charles-2024', isAdmin: false },
    { name: 'Antoine', link: 'antoine-2024', isAdmin: true },
    { name: 'Antonin', link: 'antonin-2024', isAdmin: false },
    { name: 'Cécile', link: 'cecile-2024', isAdmin: false },
    { name: 'Lucile', link: 'lucile-2024', isAdmin: false },
    { name: 'Bastien', link: 'bastien-2024', isAdmin: false },
    { name: 'Nicolas', link: 'nicolas-2024', isAdmin: false }
  ], null, 2))
}

// Obtenir tous les participants
app.get('/participants', (req, res) => {
  try {
    console.log('Lecture du fichier participants...')
    const fileContent = fs.readFileSync(PARTICIPANTS, 'utf8')
    console.log('Contenu du fichier:', fileContent)
    const participants = JSON.parse(fileContent)
    console.log('Participants parsés:', participants)
    res.json(participants)
  } catch (error) {
    console.error('Erreur lors de la lecture des participants:', error)
    res.status(500).json({ error: 'Erreur lors de la lecture des participants: ' + error.message })
  }
})

// Ajouter un participant
app.post('/participants', (req, res) => {
  try {
    const participants = JSON.parse(fs.readFileSync(PARTICIPANTS))
    const newParticipant = {
      name: req.body.name,
      color: req.body.color || `hsl(${Math.random() * 360}, 70%, 60%)`
    }
    
    if (participants.find(p => p.name === newParticipant.name)) {
      return res.status(400).json({ error: 'Ce participant existe déjà' })
    }
    
    participants.push(newParticipant)
    fs.writeFileSync(PARTICIPANTS, JSON.stringify(participants, null, 2))
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du participant' })
  }
})

// Modifier un participant
app.put('/participants/:name', (req, res) => {
  try {
    const participants = JSON.parse(fs.readFileSync(PARTICIPANTS))
    const index = participants.findIndex(p => p.name === req.params.name)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Participant non trouvé' })
    }
    
    participants[index].name = req.body.name
    fs.writeFileSync(PARTICIPANTS, JSON.stringify(participants, null, 2))
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la modification du participant' })
  }
})

// Supprimer un participant
app.delete('/participants/:name', (req, res) => {
  try {
    const participants = JSON.parse(fs.readFileSync(PARTICIPANTS))
    const filteredParticipants = participants.filter(p => p.name !== req.params.name)
    
    if (filteredParticipants.length === participants.length) {
      return res.status(404).json({ error: 'Participant non trouvé' })
    }
    
    fs.writeFileSync(PARTICIPANTS, JSON.stringify(filteredParticipants, null, 2))
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du participant' })
  }
})

// Obtenir tous les tirages
app.get('/draws', (req, res) => {
  try {
    const draws = JSON.parse(fs.readFileSync(DRAWS))
    res.json(draws)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des tirages' })
  }
})

// Ajouter un tirage
app.post('/draws', (req, res) => {
  try {
    const draws = JSON.parse(fs.readFileSync(DRAWS))
    
    // Vérifier si l'utilisateur a déjà tiré
    if (draws.find(d => d.user === req.body.user)) {
      return res.status(400).json({ error: 'Cet utilisateur a déjà tiré' })
    }
    
    // Vérifier si la personne tirée a déjà été tirée par quelqu'un d'autre
    if (draws.find(d => d.drawnPerson === req.body.drawnPerson)) {
      return res.status(400).json({ error: `${req.body.drawnPerson} a déjà été tiré(e) par quelqu'un d'autre` })
    }
    
    draws.push(req.body)
    fs.writeFileSync(DRAWS, JSON.stringify(draws, null, 2))
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du tirage' })
  }
})

// Supprimer tous les tirages
app.delete('/draws', (req, res) => {
  try {
    fs.writeFileSync(DRAWS, JSON.stringify([], null, 2))
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression des tirages' })
  }
})

// ===== ROUTES POUR L'AUTHENTIFICATION PAR LIEN UNIQUE =====

// Authentification par lien unique
app.post('/auth/login', (req, res) => {
  try {
    const { link } = req.body

    const uniqueLinks = JSON.parse(fs.readFileSync(UNIQUE_LINKS, 'utf8'))
    const userAuth = uniqueLinks.find(auth => auth.link === link)

    if (!userAuth) {
      return res.status(401).json({ error: 'Lien de connexion invalide' })
    }

    res.json({
      success: true,
      user: {
        name: userAuth.name,
        isAdmin: userAuth.isAdmin
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtenir tous les liens uniques (pour l'admin)
app.get('/auth/links', (req, res) => {
  try {
    const uniqueLinks = JSON.parse(fs.readFileSync(UNIQUE_LINKS, 'utf8'))
    res.json(uniqueLinks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend prêt sur le port ${PORT}`))
