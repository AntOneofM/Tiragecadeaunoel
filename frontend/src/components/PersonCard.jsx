import { useState, useEffect } from 'react'
import './PersonCard.css'

const PersonCard = ({ person, onBack }) => {
  const [isGiftOpen, setIsGiftOpen] = useState(false)
  const [showName, setShowName] = useState(false)

  useEffect(() => {
    // Délai pour l'ouverture du cadeau
    const openGiftTimer = setTimeout(() => {
      setIsGiftOpen(true)
    }, 1000)

    // Délai pour afficher le nom
    const showNameTimer = setTimeout(() => {
      setShowName(true)
    }, 2000)

    return () => {
      clearTimeout(openGiftTimer)
      clearTimeout(showNameTimer)
    }
  }, [])

  return (
    <div className="person-card-container">
      <div className="gift-reveal-container">
        <div className={`gift-box ${isGiftOpen ? 'open' : ''}`}>
          <div className="gift-lid">
            <div className="gift-bow">🎀</div>
          </div>
          <div className="gift-body">
            <div className="gift-pattern">🎁</div>
          </div>
        </div>
        
        {showName && (
          <div className="name-reveal">
            <div className="reveal-sparkles">
              <span className="sparkle sparkle-1">✨</span>
              <span className="sparkle sparkle-2">⭐</span>
              <span className="sparkle sparkle-3">✨</span>
              <span className="sparkle sparkle-4">⭐</span>
            </div>
            <div className="reveal-message">
              <p>🎉 Félicitations ! Vous devez offrir un cadeau à :</p>
            </div>
            <h2 className="revealed-name">{person}</h2>
          </div>
        )}
      </div>

      <div className="secret-reminder">
        <p>🤫 Chut... C'est un secret ! Ne le dites à personne !</p>
      </div>
    </div>
  )
}

export default PersonCard