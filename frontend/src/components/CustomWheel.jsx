import { useState, useEffect, useRef } from 'react'
import './CustomWheel.css'

const CustomWheel = ({ segments, colors, onFinished, disabled = false }) => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentSegment, setCurrentSegment] = useState(0)
  const wheelRef = useRef(null)

  const segmentAngle = 360 / segments.length

  // Debug
  console.log('CustomWheel - segments:', segments)

  // Fonction pour jouer les sons
  const playSpinSound = () => {
    // Créer un contexte audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Son de roue qui tourne (bruit blanc modulé)
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Fréquence qui descend progressivement
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 4)
    
    // Volume qui diminue
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 4)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 4)
  }

  const playWinSound = () => {
    // Son de victoire (accord majeur)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    const frequencies = [523.25, 659.25, 783.99] // Do, Mi, Sol
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.1)
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + index * 0.1 + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 1)
      
      oscillator.start(audioContext.currentTime + index * 0.1)
      oscillator.stop(audioContext.currentTime + index * 0.1 + 1)
    })
  }

  const spin = () => {
    if (isSpinning || disabled) return

    setIsSpinning(true)
    
    // Son de démarrage
    playSpinSound()
    
    // Rotation aléatoire (8-12 tours + angle aléatoire)
    const randomSpins = 8 + Math.random() * 4
    const randomAngle = Math.random() * 360
    const totalRotation = rotation + (randomSpins * 360) + randomAngle
    
    setRotation(totalRotation)
    
    // Calculer le segment gagnant avec plus de précision
    const normalizedAngle = ((360 - (totalRotation % 360)) % 360)
    const winningSegment = Math.floor(normalizedAngle / segmentAngle)
    const actualWinningSegment = (segments.length - winningSegment) % segments.length
    
    setCurrentSegment(actualWinningSegment)
    
    // Attendre la fin de l'animation
    setTimeout(() => {
      setIsSpinning(false)
      // Son de victoire
      playWinSound()
      if (onFinished && segments[actualWinningSegment]) {
        onFinished(segments[actualWinningSegment])
      }
    }, 4000) // Durée de l'animation
  }

  return (
    <div className="custom-wheel-container">
      <div className="wheel-wrapper">
        {/* Décoration de Noël autour de la roue */}
        <div className="christmas-decoration">
          <div className="ornament ornament-1">🎄</div>
          <div className="ornament ornament-2">🎁</div>
          <div className="ornament ornament-3">⭐</div>
          <div className="ornament ornament-4">❄️</div>
        </div>

        <div 
          className="wheel"
          ref={wheelRef}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
          }}
        >
          {segments.map((segment, index) => {
            return (
              <div
                key={index}
                className="wheel-segment"
                style={{
                  transform: `rotate(${index * segmentAngle}deg)`,
                  backgroundColor: colors[index] || `hsl(${index * 360 / segments.length}, 70%, 60%)`
                }}
              >
                <div className="segment-content">
                  <span className="segment-text">
                    ?
                  </span>
                </div>
              </div>
            )
          })}
          
          {/* Centre de la roue avec motif de Noël */}
          <div className="wheel-center">
            <div className="center-pattern"></div>
          </div>
        </div>
        
        <div className="wheel-pointer">
          <div className="pointer-arrow"></div>
        </div>
        
        <button 
          className={`wheel-button ${isSpinning ? 'spinning' : ''}`}
          onClick={spin}
          disabled={isSpinning || disabled}
        >
          <span className="button-text">
            {isSpinning ? 'TOURNE...' : 'TOURNER'}
          </span>
        </button>
      </div>
    </div>
  )
}

export default CustomWheel
