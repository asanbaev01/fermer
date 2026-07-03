// components/modals/ForgotPasswordModal.jsx
import React, { useContext, useState } from 'react'
import { FaTimes, FaEnvelope, FaLock, FaKey, FaCheckCircle } from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './Modal.css'

export default function ForgotPasswordModal() {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const {
    showForgotPassword,
    setShowForgotPassword,
    setShowLogin,
    showToastMessage,
    forgotPasswordData,
    setForgotPasswordData,
    handleForgotPassword,
    handleVerifyCode,
    handleResetPassword
  } = context

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!showForgotPassword) return null

  const handleSendCode = (e) => {
    e.preventDefault()
    setIsLoading(true)
    const result = handleForgotPassword(email)
    if (result) {
      setForgotPasswordData({ ...forgotPasswordData, email, step: 2 })
    }
    setIsLoading(false)
  }

  const handleVerify = (e) => {
    e.preventDefault()
    const result = handleVerifyCode(code)
    if (result) {
      setCode('')
    }
  }

  const handleReset = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showToastMessage('Пароли не совпадают', 'error')
      return
    }
    if (newPassword.length < 6) {
      showToastMessage('Пароль должен быть не менее 6 символов', 'error')
      return
    }
    handleResetPassword(email, newPassword)
  }

  const handleClose = () => {
    setShowForgotPassword(false)
    setForgotPasswordData({ step: 1, email: '', code: '', verified: false })
    setEmail('')
    setCode('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FaLock /> Восстановление пароля</h2>
          <button className="modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {forgotPasswordData.step === 1 && (
          <form onSubmit={handleSendCode}>
            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input
                type="email"
                placeholder="Введите ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p style={{ color: '#a0a0a0', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                На указанный email будет отправлен код подтверждения
              </p>
            </div>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              <FaKey /> {isLoading ? 'Отправка...' : 'Отправить код'}
            </button>
            <p className="modal-footer-text">
              Вспомнили пароль?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setShowForgotPassword(false)
                  setShowLogin(true)
                }}
              >
                Войти
              </button>
            </p>
          </form>
        )}

        {forgotPasswordData.step === 2 && (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label><FaKey /> Код подтверждения</label>
              <input
                type="text"
                placeholder="Введите код из письма"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength="6"
              />
              <p style={{ color: '#a0a0a0', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                Код отправлен на {forgotPasswordData.email || email}
              </p>
            </div>
            <button type="submit" className="btn-submit">
              <FaCheckCircle /> Подтвердить код
            </button>
            <button
              type="button"
              className="btn-resend"
              onClick={() => {
                handleForgotPassword(forgotPasswordData.email || email)
                showToastMessage(`Новый код отправлен на ${forgotPasswordData.email || email}`, 'success')
              }}
            >
              Отправить код повторно
            </button>
          </form>
        )}

        {forgotPasswordData.step === 3 && (
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label><FaLock /> Новый пароль</label>
              <input
                type="password"
                placeholder="Введите новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label><FaLock /> Подтвердите пароль</label>
              <input
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">
              <FaLock /> Сменить пароль
            </button>
          </form>
        )}
      </div>
    </div>
  )
}