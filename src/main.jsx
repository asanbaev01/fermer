// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppProvider } from './context/AppContext'
import App from './App'
import './index.css'

// PWA регистрациясы
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration)
      })
      .catch((error) => {
        console.log('SW registration failed:', error)
      })
  })
}

// Орнотууну сунуштоо
let deferredPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  
  // Орнотуу баскычын көрсөтүү
  const installBtn = document.createElement('button')
  installBtn.id = 'pwa-install-btn'
  installBtn.textContent = '📱 Орнотуу'
  installBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 12px 24px;
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    color: #0c0a09;
    border: none;
    border-radius: 50px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
    display: none;
    font-family: 'Inter', sans-serif;
  `
  document.body.appendChild(installBtn)

  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      console.log('User choice:', result)
      deferredPrompt = null
      installBtn.style.display = 'none'
    }
  })

  // Орнотууну сунуштоо
  setTimeout(() => {
    installBtn.style.display = 'block'
    installBtn.style.animation = 'slideUp 0.5s ease-out'
  }, 3000)
})

window.addEventListener('appinstalled', () => {
  console.log('App installed!')
  const installBtn = document.getElementById('pwa-install-btn')
  if (installBtn) installBtn.style.display = 'none'
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
)