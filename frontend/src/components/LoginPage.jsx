import { useState } from 'react'
import './LoginPage.css'
import { API_URL } from '../config'

const LoginPage = ({ onLogin }) => {
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    try {
      const url = `${API_URL}/auth/login`
      console.log('Tentative de connexion à:', url) // Debug
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link }),
      })

      console.log('Réponse du serveur:', response.status, response.statusText) // Debug

      if (!response.ok) {
        // Si la réponse n'est pas OK, essayer de lire le texte d'abord
        const text = await response.text()
        console.error('Erreur serveur:', text) // Debug
        try {
          const data = JSON.parse(text)
          setErrorMessage(data.error || `Erreur ${response.status}: ${response.statusText}`)
        } catch {
          setErrorMessage(`Erreur ${response.status}: Impossible de se connecter au serveur. Vérifiez l'URL du backend.`)
        }
        return
      }

      const data = await response.json()

      if (data.success) {
        onLogin(data.user)
      } else {
        setErrorMessage(data.error || 'Erreur de connexion')
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      setErrorMessage(`Erreur: ${error.message}. Vérifiez que l'URL du backend est correcte (${API_URL})`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="christmas-container">
      {/* Effet de neige */}
      <div className="snowflakes">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="snowflake" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}>❄</div>
        ))}
      </div>

      <div className="login-card">
        <div className="christmas-header">
          <div className="santa-hat">🎅</div>
          <h1 className="christmas-title">
            <span className="title-text">Tirage au Sort</span>
            <span className="title-ornament">🎄</span>
          </h1>
          <p className="christmas-subtitle">Cadeaux de Noël</p>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleLoginSubmit} className="christmas-form">
          <div className="input-group">
            <div className="input-icon">🔗</div>
            <input
              type="text"
              name="link"
              placeholder="Votre lien de connexion unique"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="christmas-input"
            />
          </div>

          <button
            type="submit"
            className={`christmas-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !link.trim()}
          >
            {isLoading ? (
              <>
                <span className="spinner">⏳</span>
                Connexion...
              </>
            ) : (
              <>
                <span>🎁</span>
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="christmas-footer">
          <p>✨ Prêt pour la magie de Noël ? ✨</p>
          <p className="link-info">💡 Utilisez votre lien personnel pour accéder au tirage</p>
        </div>
      </div>

      {/* Étoiles flottantes */}
      <div className="floating-stars">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`
          }}>⭐</div>
        ))}
      </div>
    </div>
  )
}

export default LoginPage