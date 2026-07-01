// components/modals/LoginModal.jsx
import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import './Modal.css'

export default function LoginModal() {
  const { 
    showLogin, 
    setShowLogin, 
    setShowRegister, 
    handleLogin, 
    showToastMessage 
  } = useContext(AppContext)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const users = JSON.parse(localStorage.getItem('agrobazar_users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      handleLogin(user)
      setEmail('')
      setPassword('')
    } else {
      showToastMessage('Неверный email или пароль', 'error')
    }
  }

  if (!showLogin) return null

  return (
    <div className="modal-overlay" onClick={() => setShowLogin(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Войти</h2>
          <button className="modal-close" onClick={() => setShowLogin(false)}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="example@mail.com"
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-submit">Войти</button>
        </form>
        <p className="modal-footer-text">
          Нет аккаунта?{' '}
          <button 
            className="link-btn" 
            onClick={() => { 
              setShowLogin(false)
              setShowRegister(true)
            }}
          >
            Регистрация
          </button>
        </p>
      </div>
    </div>
  )
}