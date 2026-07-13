// components/common/InstallPrompt.jsx
import React, { useState, useEffect } from 'react'
import { FaDownload, FaTimes } from 'react-icons/fa'
import './InstallPrompt.css'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setShowPrompt(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === 'accepted') {
        setShowPrompt(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa_install_dismissed', 'true')
  }

  if (!showPrompt || localStorage.getItem('pwa_install_dismissed') === 'true') {
    return null
  }

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-icon">
          <FaDownload />
        </div>
        <div className="install-text">
          <h3>📱 Орнотуу</h3>
          <p>AgroBazarды телефонуңузга орнотуңуз</p>
        </div>
        <div className="install-actions">
          <button className="install-btn" onClick={handleInstall}>
            Орнотуу
          </button>
          <button className="install-dismiss" onClick={handleDismiss}>
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  )
}