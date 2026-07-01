// components/common/Toast.jsx
import React, { useEffect, useState } from 'react'
import './Toast.css'

export default function Toast({ message, type, onClose }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onClose, 400)
    }, 2800)

    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }

  return (
    <div className={`toast-compact ${type} ${isExiting ? 'exit' : ''}`}>
      <span className="toast-compact-icon">{icons[type] || 'ℹ️'}</span>
      <span className="toast-compact-message">{message}</span>
      <button className="toast-compact-close" onClick={() => {
        setIsExiting(true)
        setTimeout(onClose, 400)
      }}>✕</button>
    </div>
  )
}