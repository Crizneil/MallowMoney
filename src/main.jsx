import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Register PWA Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('May bagong updates ang MallowMoney! I-refresh natin?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('Handa na ang MallowMoney gamitin kahit walang internet!');
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
