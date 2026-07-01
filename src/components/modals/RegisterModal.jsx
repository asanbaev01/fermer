// components/modals/RegisterModal.jsx
import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import './Modal.css'

export default function RegisterModal() {
  const { 
    showRegister, 
    setShowRegister, 
    setShowLogin, 
    handleRegister, 
    showToastMessage 
  } = useContext(AppContext)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    region: '',
    username: '',
    role: 'Фермер'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const users = JSON.parse(localStorage.getItem('agrobazar_users') || '[]')
    if (users.find(u => u.email === formData.email)) {
      showToastMessage('Этот email уже зарегистрирован', 'error')
      return
    }

    handleRegister(formData)
    
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      region: '',
      username: '',
      role: 'Фермер'
    })
  }

  if (!showRegister) return null

  return (
    <div className="modal-overlay" onClick={() => setShowRegister(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Регистрация</h2>
          <button className="modal-close" onClick={() => setShowRegister(false)}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Полное имя</label>
            <input 
              name="fullName"
              type="text" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
              placeholder="Иван Иванов"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              name="email"
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="example@mail.com"
            />
          </div>
          <div className="form-group">
            <label>Логин (username)</label>
            <input 
              name="username"
              type="text" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              placeholder="ivan_agro"
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input 
              name="password"
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••"
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input 
              name="phone"
              type="tel" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+996 700 123 456"
            />
          </div>
          <div className="form-group">
            <label>Регион</label>
            <select 
              name="region"
              value={formData.region} 
              onChange={handleChange}
              required
            >
              <option value="">Выберите регион</option>
              <option value="Чуйская область">Чуйская область</option>
              <option value="Иссык-Кульская область">Иссык-Кульская область</option>
              <option value="Нарынская область">Нарынская область</option>
              <option value="Таласская область">Таласская область</option>
              <option value="Ошская область">Ошская область</option>
              <option value="Баткенская область">Баткенская область</option>
              <option value="Джалал-Абадская область">Джалал-Абадская область</option>
            </select>
          </div>
          <div className="form-group">
            <label>Роль</label>
            <select 
              name="role"
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="Фермер">Фермер</option>
              <option value="Сатып алуучу">Сатып алуучу</option>
            </select>
          </div>
          <button type="submit" className="btn-submit">Зарегистрироваться</button>
        </form>
        <p className="modal-footer-text">
          Уже есть аккаунт?{' '}
          <button 
            className="link-btn" 
            onClick={() => { 
              setShowRegister(false)
              setShowLogin(true)
            }}
          >
            Войти
          </button>
        </p>
      </div>
    </div>
  )
}