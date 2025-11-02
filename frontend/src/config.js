// Configuration de l'URL de l'API
const envApiUrl = import.meta.env.VITE_API_URL
const defaultUrl = 'http://localhost:3001'

// Nettoyer l'URL : enlever les slashes à la fin
const cleanUrl = (url) => {
  if (!url) return url
  return url.replace(/\/+$/, '') // Enlève tous les slashes à la fin
}

export const API_URL = cleanUrl(envApiUrl) || defaultUrl

// Debug - afficher toutes les infos
console.log('🔧 ===== CONFIGURATION API =====')
console.log('🔧 VITE_API_URL depuis env:', envApiUrl)
console.log('🔧 URL par défaut:', defaultUrl)
console.log('🔧 URL finale utilisée:', API_URL)
console.log('🔧 Mode:', import.meta.env.MODE)
console.log('🔧 =============================')

// Afficher une alerte si on utilise localhost en production
if (!envApiUrl && import.meta.env.MODE === 'production') {
  console.error('⚠️ ATTENTION: VITE_API_URL n\'est pas définie en production!')
  console.error('⚠️ Le frontend utilise localhost:3001 au lieu du backend Railway!')
}

