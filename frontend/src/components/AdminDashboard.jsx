import { useState, useEffect } from 'react'
import './AdminDashboard.css'
import { API_URL } from '../config'

const AdminDashboard = ({ user, onLogout }) => {
  const [participants, setParticipants] = useState([])
  const [draws, setDraws] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddParticipant, setShowAddParticipant] = useState(false)
  const [newParticipant, setNewParticipant] = useState('')
  const [editingParticipant, setEditingParticipant] = useState(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [participantsRes, drawsRes] = await Promise.all([
        fetch(`${API_URL}/participants`),
        fetch(`${API_URL}/draws`)
      ])
      
      const participantsData = await participantsRes.json()
      const drawsData = await drawsRes.json()
      
      setParticipants(participantsData)
      setDraws(drawsData)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addParticipant = async () => {
    if (!newParticipant.trim()) return
    
    try {
      const response = await fetch(`${API_URL}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newParticipant.trim(),
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        })
      })
      
      if (response.ok) {
        setNewParticipant('')
        setShowAddParticipant(false)
        loadData()
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
    }
  }

  const removeParticipant = async (participantName) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${participantName} ?`)) return
    
    try {
      const response = await fetch(`${API_URL}/participants/${participantName}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const startEdit = (participant) => {
    setEditingParticipant(participant)
    setEditName(participant.name)
  }

  const saveEdit = async () => {
    if (!editName.trim() || editName === editingParticipant.name) {
      setEditingParticipant(null)
      return
    }
    
    try {
      const response = await fetch(`${API_URL}/participants/${editingParticipant.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName.trim() })
      })
      
      if (response.ok) {
        setEditingParticipant(null)
        loadData()
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
    }
  }

  const cancelEdit = () => {
    setEditingParticipant(null)
    setEditName('')
  }

  const resetAllDraws = async () => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser tous les tirages ?')) return
    
    try {
      const response = await fetch(`${API_URL}/draws`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">
          <div className="spinner">⏳</div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  const participantsWithDraws = participants.map(participant => {
    const draw = draws.find(d => d.user === participant.name)
    return {
      ...participant,
      hasDrawn: !!draw,
      drawnPerson: draw?.drawnPerson || null,
      drawDate: draw?.timestamp || null
    }
  })

  const drawnCount = participantsWithDraws.filter(p => p.hasDrawn).length
  const totalCount = participants.length

  return (
    <div className="admin-container">
      {/* Effet de neige */}
      <div className="snowflakes">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="snowflake" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}>❄</div>
        ))}
      </div>

      <header className="admin-header">
        <h1>🎄 Tableau de Bord Admin 🎄</h1>
        <p>Bienvenue, {user.name} ! (Mode Administrateur)</p>
        <div className="header-actions">
          <button onClick={() => window.location.reload()} className="back-btn">
            🎪 Retour au tirage
          </button>
          <button onClick={() => setShowAddParticipant(true)} className="add-btn">
            ➕ Ajouter un participant
          </button>
          <button onClick={resetAllDraws} className="reset-btn">
            🔄 Réinitialiser tous les tirages
          </button>
          <button onClick={onLogout} className="logout-btn">Se déconnecter</button>
        </div>
      </header>

      <main className="admin-main">
        <div className="stats-cards">
          <div className="stat-card">
            <h3>👥 Participants</h3>
            <div className="stat-number">{totalCount}</div>
          </div>
          <div className="stat-card">
            <h3>🎲 Tirages effectués</h3>
            <div className="stat-number">{drawnCount}</div>
          </div>
          <div className="stat-card">
            <h3>⏳ En attente</h3>
            <div className="stat-number">{totalCount - drawnCount}</div>
          </div>
        </div>

        <div className="participants-section">
          <h2>📋 Liste des Participants</h2>
          
          {showAddParticipant && (
            <div className="add-participant-form">
              <input
                type="text"
                placeholder="Nom du participant"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                className="add-input"
                autoFocus
              />
              <button onClick={addParticipant} className="save-btn">✓</button>
              <button onClick={() => setShowAddParticipant(false)} className="cancel-btn">✕</button>
            </div>
          )}

          <div className="participants-list">
            {participantsWithDraws.map((participant) => (
              <div key={participant.name} className="participant-card">
                <div className="participant-info">
                  <div 
                    className="participant-avatar"
                    style={{ backgroundColor: participant.color }}
                  >
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="participant-details">
                    {editingParticipant?.name === participant.name ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="edit-input"
                          autoFocus
                        />
                        <button onClick={saveEdit} className="save-btn">✓</button>
                        <button onClick={cancelEdit} className="cancel-btn">✕</button>
                      </div>
                    ) : (
                      <>
                        <h4>{participant.name}</h4>
                        <div className="participant-status">
                          {participant.hasDrawn ? (
                            <span className="status-drawn">✅ A tiré</span>
                          ) : (
                            <span className="status-pending">⏳ En attente</span>
                          )}
                        </div>
                        {participant.drawDate && (
                          <div className="draw-date">
                            Le {new Date(participant.drawDate).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div className="participant-actions">
                  {editingParticipant?.name !== participant.name && (
                    <>
                      <button 
                        onClick={() => startEdit(participant)}
                        className="edit-btn"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => removeParticipant(participant.name)}
                        className="remove-btn"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {drawnCount > 0 && (
          <div className="draws-section">
            <h2>🎲 Tirages Effectués</h2>
            <div className="draws-list">
              {draws.map((draw, index) => (
                <div key={index} className="draw-card">
                  <div className="draw-info">
                    <span className="drawer">{draw.user}</span>
                    <span className="draw-arrow">→</span>
                    <span className="drawn">???</span>
                  </div>
                  <div className="draw-date">
                    {new Date(draw.timestamp).toLocaleString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
