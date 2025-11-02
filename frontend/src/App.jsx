import { useState } from 'react'
import LoginPage from './components/LoginPage'
import WheelDraw from './components/WheelDraw'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    console.log('Utilisateur connecté:', userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Tout le monde va sur l'interface de roue, mais Antoine aura un bouton admin
  return <WheelDraw user={user} onLogout={handleLogout} />
}

export default App
