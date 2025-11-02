import { useState, useEffect } from 'react'
import CustomWheel from './CustomWheel'
import PersonCard from './PersonCard'
import AdminDashboard from './AdminDashboard'
import './WheelDraw.css'
import { API_URL } from '../config'

const WheelDraw = ({ user, onLogout }) => {
  const [participants, setParticipants] = useState([])
  const [existingDraws, setExistingDraws] = useState([])
  const [userDraw, setUserDraw] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)

  // Groupes et relations selon votre code PHP
  const adultes = ['Mamie', 'Martine', 'Philippe', 'Christelle', 'Florence', 'Angelo']
  const enfants = ['Laura', 'Charles', 'Antoine', 'Antonin', 'Cécile', 'Lucile', 'Bastien', 'Nicolas']
  
  const relationsAdultes = {
    'Philippe': ['Christelle'],
    'Christelle': ['Philippe'],
    'Florence': ['Angelo'],
    'Angelo': ['Florence']
  }
  
  const relationsEnfants = {
    'Laura': ['Charles', 'Antoine'],
    'Charles': ['Laura', 'Antoine'],
    'Antoine': ['Laura', 'Charles'],
    'Antonin': ['Lucile', 'Bastien', 'Cécile'],
    'Cécile': ['Antonin'],
    'Lucile': ['Antonin', 'Bastien', 'Nicolas'],
    'Nicolas': ['Lucile'],
    'Bastien': ['Antonin', 'Lucile']
  }

  // Fonction pour normaliser les noms (gérer les problèmes d'encodage)
  const normalizeName = (name) => {
    return name.replace(/Ã©/g, 'é').replace(/Ã /g, 'à').replace(/Ã¨/g, 'è')
  }

  // Fonction pour obtenir les participants du groupe (pour l'affichage de la roue)
  const getGroupParticipants = () => {
    const currentUser = user.name
    const normalizedName = normalizeName(currentUser)
    
    // Déterminer le groupe de l'utilisateur
    const isAdult = adultes.includes(normalizedName)
    const isChild = enfants.includes(normalizedName)
    
    // Obtenir les relations interdites pour cet utilisateur
    const relations = isAdult ? relationsAdultes : (isChild ? relationsEnfants : {})
    const forbiddenNames = relations[normalizedName] || []
    
    // Obtenir la liste des personnes déjà tirées par d'autres
    const alreadyDrawn = existingDraws.map(d => normalizeName(d.drawnPerson))
    
    let availableParticipants = []
    
    if (!isAdult && !isChild) {
      // Si l'utilisateur n'est dans aucun groupe, il voit tout le monde sauf lui et ceux déjà tirés
      availableParticipants = participants.filter(p => {
        const normalizedParticipantName = normalizeName(p.name)
        return normalizedParticipantName !== currentUser && 
               !alreadyDrawn.includes(normalizedParticipantName)
      })
    } else {
      // Récupérer le groupe de l'utilisateur
      const currentGroup = isAdult ? adultes : enfants
      
      // Filtrer : même groupe, pas l'utilisateur lui-même, pas dans les relations interdites, et pas déjà tiré
      availableParticipants = participants.filter(p => {
        const normalizedParticipantName = normalizeName(p.name)
        return currentGroup.includes(normalizedParticipantName) && 
               normalizedParticipantName !== currentUser &&
               !forbiddenNames.includes(normalizedParticipantName) &&
               !alreadyDrawn.includes(normalizedParticipantName)
      })
    }
    
    return availableParticipants
  }


  // Charger les participants et le tirage de l'utilisateur
  useEffect(() => {
    loadData()
  }, [])


  const loadData = async () => {
    try {
      // Charger les participants depuis le backend
      const participantsResponse = await fetch(`${API_URL}/participants`)
      const participantsData = await participantsResponse.json()
      setParticipants(participantsData)

      // Charger tous les tirages pour savoir qui a déjà été tiré
      const drawsResponse = await fetch(`${API_URL}/draws`)
      const drawsData = await drawsResponse.json()
      setExistingDraws(drawsData)
      
      // Vérifier si l'utilisateur a déjà tiré
      const userDrawData = drawsData.find(draw => draw.user === user.name)
      
      if (userDrawData) {
        setUserDraw(userDrawData)
        setShowResult(true)
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWheelStop = async (winner) => {
    if (userDraw) return

    setIsSpinning(false)
    setShowResult(false)

    // Normaliser le nom du gagnant pour l'affichage
    const normalizedWinner = normalizeName(winner)

    // Vérifier les restrictions avant de sauvegarder
    const normalizedCurrentUser = normalizeName(user.name)
    const isAdult = adultes.includes(normalizedCurrentUser)
    const isChild = enfants.includes(normalizedCurrentUser)
    
    if (isAdult || isChild) {
      const relations = isAdult ? relationsAdultes : relationsEnfants
      const forbiddenNames = relations[normalizedCurrentUser] || []
      
      if (forbiddenNames.includes(normalizedWinner)) {
        alert(`❌ Erreur : ${user.name} ne peut pas tirer ${normalizedWinner} selon les règles du tirage. Veuillez réessayer.`)
        return
      }
    }
    
    // Vérifier si cette personne a déjà été tirée par quelqu'un d'autre
    const alreadyDrawn = existingDraws.find(d => {
      const drawnPerson = normalizeName(d.drawnPerson)
      return drawnPerson === normalizedWinner
    })
    
    if (alreadyDrawn) {
      alert(`❌ Erreur : ${normalizedWinner} a déjà été tiré(e) par ${alreadyDrawn.user}. Veuillez réessayer.`)
      return
    }

    // Sauvegarder le tirage si les règles sont respectées
    try {
      const response = await fetch(`${API_URL}/draws`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user.name,
          drawnPerson: normalizedWinner,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        const drawData = {
          user: user.name,
          drawnPerson: normalizedWinner,
          timestamp: new Date().toISOString()
        }
        setUserDraw(drawData)
        // Mettre à jour la liste des tirages pour exclure cette personne des prochains tirages
        setExistingDraws([...existingDraws, drawData])
        setShowResult(true)
      } else {
        const errorData = await response.json()
        alert(`❌ Erreur : ${errorData.error || 'Impossible de sauvegarder le tirage'}`)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="wheel-container">
        <div className="loading-spinner">
          <div className="spinner">⏳</div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  // Si Antoine veut accéder à l'admin
  if (showAdmin) {
    return <AdminDashboard user={user} onLogout={onLogout} />
  }

  return (
    <div className="wheel-container">
      {/* Effet de neige */}
      <div className="snowflakes">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="snowflake" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}>❄</div>
        ))}
      </div>

      <header className="wheel-header">
        <h1>🎄 Roue de la Chance 🎄</h1>
        <p>Bienvenue, {user.name} !</p>
        {user.name === 'Antoine' && (
          <p className="admin-welcome">👑 Mode Administrateur</p>
        )}
        <div className="header-actions">
          {user.isAdmin && (
            <button onClick={() => setShowAdmin(true)} className="admin-btn">
              ⚙️ Admin
            </button>
          )}
          <button onClick={onLogout} className="logout-btn">Se déconnecter</button>
        </div>
      </header>

      <main className="wheel-main">
        {!showResult ? (
          <div className="wheel-section">
            <div className="wheel-info">
              <h2>🎁 Tirage au Sort des Cadeaux</h2>
              <p>Cliquez sur la roue pour découvrir qui vous devez offrir un cadeau !</p>
              <p className="participants-count">
                {getGroupParticipants().length} participant{getGroupParticipants().length > 1 ? 's' : ''} dans votre groupe
              </p>
              <p className="group-info">
                {adultes.includes(user.name) ? '👨‍👩‍👧‍👦 Groupe Adultes' : enfants.includes(user.name) ? '👶 Groupe Enfants' : '🎄 Tous les groupes'}
              </p>
              <p className="drawn-info">
                ❓ Mystère total ! La roue révélera qui vous devez offrir un cadeau !
              </p>
            </div>

            <div className="wheel-section-content">
              <CustomWheel
                key={`wheel-${user.name}-${participants.length}`}
                segments={getGroupParticipants().map(p => normalizeName(p.name))}
                colors={getGroupParticipants().map(p => p.color)}
                onFinished={handleWheelStop}
                disabled={!!userDraw}
              />
              
              {!userDraw && (
                <div className="wheel-instructions">
                  <p>🎯 Cliquez sur le bouton au centre de la roue pour découvrir le mystère !</p>
                  <p>🎁 Peu importe le résultat, la magie de Noël révélera qui vous devez offrir un cadeau !</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <PersonCard 
            person={userDraw.drawnPerson} 
            onBack={() => setShowResult(false)} 
          />
        )}
      </main>
    </div>
  )
}

export default WheelDraw
