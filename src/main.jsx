import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize Capacitor Updater for OTA updates (only on native platforms)
import { Capacitor } from '@capacitor/core'

async function initCapacitor() {
  if (Capacitor.isNativePlatform()) {
    const { initUpdater } = await import('./services/updater.js')
    await initUpdater()
  }
}

// Initialize the app
initCapacitor().catch(console.error)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
