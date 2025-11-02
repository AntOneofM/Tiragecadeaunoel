import { useState, useEffect } from 'react'
import ParticipantsManager from './ParticipantsManager'
import './DrawInterface.css'

const DrawInterface = ({ user, onLogout }) => {
  const [adultes, setAdultes] = useState([
    'Mamy', 'Martine', 'Philippe', 'Christelle', 'Florence', 'Angelo'
  ])
  const [enfants, setEnfants] = useState([
    'Laura', 'Charles', 'Antoine', 'Antonin', 'Cécile', 'Lucile', 'Bastien', 'Nicolas'
  ])
  
  const [relationsAdultes, setRelationsAdultes] = useState({
    'Philippe': ['Christelle'],
    'Christelle': ['Philippe'],
    'Florence': ['Angelo'],
    'Angelo': ['Florence']
  })
  
  const [relationsEnfants, setRelationsEnfants] = useState({
    'Laura': ['Charles', 'Antoine'],
    'Charles': ['Laura', 'Antoine'],
    'Antoine': ['Laura', 'Charles'],
    'Antonin': ['Lucile', 'Bastien', 'Cécile'],
    'Cécile': ['Antonin'],
    'Lucile': ['Antonin', 'Bastien', 'Nicolas'],
    'Nicolas': ['Lucile'],
    'Bastien': ['Antonin', 'Lucile']
  })

  const [tirageAdultes, setTirageAdultes] = useState({})
  const [tirageEnfants, setTirageEnfants] = useState({})
  const [isDrawing, setIsDrawing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showManager, setShowManager] = useState(false)

  // Normaliser les relations (ajouter l'auto-interdiction et la symétrie)
  const normaliserRelations = (participants, relations) => {
    const set = {}
    participants.forEach(p => {
      set[p] = [p] // auto-interdiction
    })
    
    Object.entries(relations).forEach(([a, bs]) => {
      bs.forEach(b => {
        if (!set[a].includes(b)) set[a].push(b)
        if (!set[b]) set[b] = [b]
        if (!set[b].includes(a)) set[b].push(a)
      })
    })
    
    participants.forEach(p => {
      if (!set[p]) set[p] = [p]
    })
    
    return set
  }

  // Algorithme de tirage au sort avec backtracking
  const tirageSecretSanta = (participants, relations) => {
    const n = participants.length
    if (n === 0) return {}

    const relationsNorm = normaliserRelations(participants, relations)
    
    // Préparer les listes de receveurs possibles
    const possibles = {}
    participants.forEach(p => {
      possibles[p] = participants.filter(r => !relationsNorm[p].includes(r))
      if (possibles[p].length === 0) {
        throw new Error(`Aucun receveur possible pour ${p}`)
      }
    })

    // Trier par nombre de choix (heuristique)
    const participantsTries = [...participants].sort((a, b) => 
      possibles[a].length - possibles[b].length
    )

    const assign = {}
    const utilise = {}
    participants.forEach(p => { utilise[p] = false })

    const backtrack = (i) => {
      if (i === participantsTries.length) return true

      const donneur = participantsTries[i]
      const candidats = [...possibles[donneur]]
      
      // Mélanger pour la randomisation
      for (let j = candidats.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1))
        ;[candidats[j], candidats[k]] = [candidats[k], candidats[j]]
      }

      for (const receveur of candidats) {
        if (!utilise[receveur]) {
          assign[donneur] = receveur
          utilise[receveur] = true

          if (backtrack(i + 1)) {
            return true
          }

          delete assign[donneur]
          utilise[receveur] = false
        }
      }
      return false
    }

    if (!backtrack(0)) {
      throw new Error('Impossible de trouver un tirage valide')
    }

    return assign
  }

  const effectuerTirage = async () => {
    setIsDrawing(true)
    setShowResults(false)
    
    try {
      // Simulation d'un délai pour l'effet dramatique
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const tirageA = tirageSecretSanta(adultes, relationsAdultes)
      const tirageE = tirageSecretSanta(enfants, relationsEnfants)
      
      setTirageAdultes(tirageA)
      setTirageEnfants(tirageE)
      setShowResults(true)
    } catch (error) {
      alert(`Erreur lors du tirage: ${error.message}`)
    } finally {
      setIsDrawing(false)
    }
  }

  const reinitialiserTirage = () => {
    setTirageAdultes({})
    setTirageEnfants({})
    setShowResults(false)
  }

  return (
    <div className="draw-container">
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

      <header className="draw-header">
        <h1>🎄 Tirage au Sort des Cadeaux 🎄</h1>
        <p>Bienvenue, {user.name} !</p>
        <div className="header-actions">
          <button onClick={() => setShowManager(true)} className="manage-btn">
            ⚙️ Gérer les participants
          </button>
          <button onClick={onLogout} className="logout-btn">Se déconnecter</button>
        </div>
      </header>

      <main className="draw-main">
        {!showResults ? (
          <div className="draw-section">
            <div className="participants-info">
              <div className="group-info">
                <h3>👨‍👩‍👧‍👦 Adultes ({adultes.length})</h3>
                <div className="participants-list">
                  {adultes.map(name => (
                    <span key={name} className="participant-tag adult">{name}</span>
                  ))}
                </div>
              </div>
              
              <div className="group-info">
                <h3>👶 Enfants ({enfants.length})</h3>
                <div className="participants-list">
                  {enfants.map(name => (
                    <span key={name} className="participant-tag child">{name}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="draw-actions">
              <button 
                onClick={effectuerTirage}
                disabled={isDrawing}
                className={`draw-button ${isDrawing ? 'drawing' : ''}`}
              >
                {isDrawing ? (
                  <>
                    <span className="spinner">🎲</span>
                    Tirage en cours...
                  </>
                ) : (
                  <>
                    <span>🎁</span>
                    Effectuer le tirage
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="results-section">
            <div className="results-header">
              <h2>✨ Résultats du Tirage ✨</h2>
              <button onClick={reinitialiserTirage} className="reset-button">
                🔄 Nouveau tirage
              </button>
            </div>

            <div className="results-content">
              <div className="results-group">
                <h3>👨‍👩‍👧‍👦 Adultes</h3>
                <div className="results-list">
                  {Object.entries(tirageAdultes).map(([donneur, receveur]) => (
                    <div key={donneur} className="result-item adult">
                      <span className="donneur">{donneur}</span>
                      <span className="arrow">→</span>
                      <span className="receveur">{receveur}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="results-group">
                <h3>👶 Enfants</h3>
                <div className="results-list">
                  {Object.entries(tirageEnfants).map(([donneur, receveur]) => (
                    <div key={donneur} className="result-item child">
                      <span className="donneur">{donneur}</span>
                      <span className="arrow">→</span>
                      <span className="receveur">{receveur}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="results-footer">
              <p>🎉 Bonne fête de Noël à tous ! 🎉</p>
            </div>
          </div>
        )}
      </main>

      {showManager && (
        <ParticipantsManager
          adultes={adultes}
          enfants={enfants}
          relationsAdultes={relationsAdultes}
          relationsEnfants={relationsEnfants}
          onUpdateAdultes={setAdultes}
          onUpdateEnfants={setEnfants}
          onUpdateRelationsAdultes={setRelationsAdultes}
          onUpdateRelationsEnfants={setRelationsEnfants}
          onClose={() => setShowManager(false)}
        />
      )}
    </div>
  )
}

export default DrawInterface
