import { useState } from 'react'
import './ParticipantsManager.css'

const ParticipantsManager = ({ 
  adultes, 
  enfants, 
  relationsAdultes, 
  relationsEnfants,
  onUpdateAdultes, 
  onUpdateEnfants,
  onUpdateRelationsAdultes,
  onUpdateRelationsEnfants,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('adultes')
  const [newParticipant, setNewParticipant] = useState('')
  const [editingParticipant, setEditingParticipant] = useState(null)
  const [editingName, setEditingName] = useState('')

  const addParticipant = () => {
    if (!newParticipant.trim()) return
    
    const name = newParticipant.trim()
    if (activeTab === 'adultes') {
      if (!adultes.includes(name)) {
        onUpdateAdultes([...adultes, name])
      }
    } else {
      if (!enfants.includes(name)) {
        onUpdateEnfants([...enfants, name])
      }
    }
    setNewParticipant('')
  }

  const removeParticipant = (name) => {
    if (activeTab === 'adultes') {
      onUpdateAdultes(adultes.filter(p => p !== name))
      // Supprimer aussi les relations
      const newRelations = { ...relationsAdultes }
      delete newRelations[name]
      Object.keys(newRelations).forEach(key => {
        newRelations[key] = newRelations[key].filter(p => p !== name)
      })
      onUpdateRelationsAdultes(newRelations)
    } else {
      onUpdateEnfants(enfants.filter(p => p !== name))
      // Supprimer aussi les relations
      const newRelations = { ...relationsEnfants }
      delete newRelations[name]
      Object.keys(newRelations).forEach(key => {
        newRelations[key] = newRelations[key].filter(p => p !== name)
      })
      onUpdateRelationsEnfants(newRelations)
    }
  }

  const startEdit = (name) => {
    setEditingParticipant(name)
    setEditingName(name)
  }

  const saveEdit = () => {
    if (!editingName.trim() || editingName === editingParticipant) {
      setEditingParticipant(null)
      return
    }

    const newName = editingName.trim()
    if (activeTab === 'adultes') {
      if (!adultes.includes(newName)) {
        const newList = adultes.map(p => p === editingParticipant ? newName : p)
        onUpdateAdultes(newList)
        
        // Mettre à jour les relations
        const newRelations = { ...relationsAdultes }
        if (newRelations[editingParticipant]) {
          newRelations[newName] = newRelations[editingParticipant]
          delete newRelations[editingParticipant]
        }
        Object.keys(newRelations).forEach(key => {
          newRelations[key] = newRelations[key].map(p => p === editingParticipant ? newName : p)
        })
        onUpdateRelationsAdultes(newRelations)
      }
    } else {
      if (!enfants.includes(newName)) {
        const newList = enfants.map(p => p === editingParticipant ? newName : p)
        onUpdateEnfants(newList)
        
        // Mettre à jour les relations
        const newRelations = { ...relationsEnfants }
        if (newRelations[editingParticipant]) {
          newRelations[newName] = newRelations[editingParticipant]
          delete newRelations[editingParticipant]
        }
        Object.keys(newRelations).forEach(key => {
          newRelations[key] = newRelations[key].map(p => p === editingParticipant ? newName : p)
        })
        onUpdateRelationsEnfants(newRelations)
      }
    }
    
    setEditingParticipant(null)
  }

  const cancelEdit = () => {
    setEditingParticipant(null)
    setEditingName('')
  }

  const toggleRelation = (person1, person2) => {
    if (activeTab === 'adultes') {
      const newRelations = { ...relationsAdultes }
      if (!newRelations[person1]) newRelations[person1] = []
      
      if (newRelations[person1].includes(person2)) {
        newRelations[person1] = newRelations[person1].filter(p => p !== person2)
        if (newRelations[person2]) {
          newRelations[person2] = newRelations[person2].filter(p => p !== person1)
        }
      } else {
        newRelations[person1].push(person2)
        if (!newRelations[person2]) newRelations[person2] = []
        if (!newRelations[person2].includes(person1)) {
          newRelations[person2].push(person1)
        }
      }
      onUpdateRelationsAdultes(newRelations)
    } else {
      const newRelations = { ...relationsEnfants }
      if (!newRelations[person1]) newRelations[person1] = []
      
      if (newRelations[person1].includes(person2)) {
        newRelations[person1] = newRelations[person1].filter(p => p !== person2)
        if (newRelations[person2]) {
          newRelations[person2] = newRelations[person2].filter(p => p !== person1)
        }
      } else {
        newRelations[person1].push(person2)
        if (!newRelations[person2]) newRelations[person2] = []
        if (!newRelations[person2].includes(person1)) {
          newRelations[person2].push(person1)
        }
      }
      onUpdateRelationsEnfants(newRelations)
    }
  }

  const currentList = activeTab === 'adultes' ? adultes : enfants
  const currentRelations = activeTab === 'adultes' ? relationsAdultes : relationsEnfants

  return (
    <div className="participants-manager-overlay">
      <div className="participants-manager">
        <div className="manager-header">
          <h2>🎄 Gestion des Participants 🎄</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="manager-tabs">
          <button 
            className={`tab ${activeTab === 'adultes' ? 'active' : ''}`}
            onClick={() => setActiveTab('adultes')}
          >
            👨‍👩‍👧‍👦 Adultes ({adultes.length})
          </button>
          <button 
            className={`tab ${activeTab === 'enfants' ? 'active' : ''}`}
            onClick={() => setActiveTab('enfants')}
          >
            👶 Enfants ({enfants.length})
          </button>
        </div>

        <div className="manager-content">
          <div className="add-participant">
            <input
              type="text"
              placeholder={`Ajouter un ${activeTab === 'adultes' ? 'adulte' : 'enfant'}`}
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
              className="add-input"
            />
            <button onClick={addParticipant} className="add-btn">
              ➕
            </button>
          </div>

          <div className="participants-list">
            {currentList.map((participant, index) => (
              <div key={participant} className="participant-item">
                {editingParticipant === participant ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      className="edit-input"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="save-btn">✓</button>
                    <button onClick={cancelEdit} className="cancel-btn">✕</button>
                  </div>
                ) : (
                  <>
                    <span className="participant-name">{participant}</span>
                    <div className="participant-actions">
                      <button 
                        onClick={() => startEdit(participant)}
                        className="edit-btn"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => removeParticipant(participant)}
                        className="remove-btn"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {currentList.length > 1 && (
            <div className="relations-section">
              <h3>Relations (qui ne peuvent pas se tirer entre eux)</h3>
              <div className="relations-grid">
                {currentList.map((person1, i) => (
                  <div key={person1} className="relation-row">
                    <span className="relation-person">{person1}</span>
                    <div className="relation-buttons">
                      {currentList.map((person2, j) => {
                        if (i >= j) return null
                        const hasRelation = currentRelations[person1]?.includes(person2) || false
                        return (
                          <button
                            key={person2}
                            className={`relation-btn ${hasRelation ? 'active' : ''}`}
                            onClick={() => toggleRelation(person1, person2)}
                            title={`${hasRelation ? 'Supprimer' : 'Ajouter'} la relation`}
                          >
                            {person2}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ParticipantsManager
