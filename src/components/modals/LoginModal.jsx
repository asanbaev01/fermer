// components/modals/LoginModal.jsx
import React, { useContext, useState } from 'react'
import { FaUser, FaLock, FaTimes, FaKey } from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './Modal.css'

export default function LoginModal() {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const {
    showLogin,
    setShowLogin,
    setShowRegister,
    setShowForgotPassword,
    handleLogin,
    showToastMessage
  } = context

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
          <h2><FaUser /> Войти</h2>
          <button className="modal-close" onClick={() => setShowLogin(false)}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaUser /> Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@mail.com"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label><FaLock /> Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-submit">
            <FaUser /> Войти
          </button>
        </form>
        <p className="modal-footer-text">
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setShowLogin(false)
              setShowForgotPassword(true)
            }}
          >
            <FaKey /> Забыли пароль?
          </button>
        </p>
        <p className="modal-footer-text">
          Нет аккаунта?{' '}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setShowLogin(false)
              setShowRegister(true)
            }}
          >
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  )
}