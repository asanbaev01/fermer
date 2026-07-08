// components/modals/RegisterModal.jsx
import React, { useContext, useState } from 'react'
import { FaUser, FaEnvelope, FaLock, FaTimes, FaPhone, FaMapMarkerAlt, FaLeaf, FaTag, FaUsers, FaStore, FaTruck, FaBuilding, FaHandshake } from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './RegisterModal.css'

export default function RegisterModal() {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const {
    showRegister,
    setShowRegister,
    setShowLogin,
    handleRegister,
    showToastMessage,
    regions
  } = context

  const safeRegions = Array.isArray(regions) ? regions : [
    'Баткенская область',
    'Джалал-Абадская область',
    'Иссык-Кульская область',
    'Нарынская область',
    'Ошская область',
    'Таласская область',
    'Чуйская область'
  ]

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    region: '',
    farmName: '',
    avatar: '🌾',
    role: 'Фермер'
  })

  const roles = [
    { value: 'Фермер', label: 'Фермер', icon: <FaLeaf />, desc: 'Өзүмдүн продукциямды сатам' },
    { value: 'Сатып алуучу', label: 'Сатып алуучу', icon: <FaStore />, desc: 'Продукция сатып алам' },
    { value: 'Кооператив', label: 'Кооператив', icon: <FaUsers />, desc: 'Кооперативдин өкүлү' },
    { value: 'Экспорттоочу', label: 'Экспорттоочу', icon: <FaTruck />, desc: 'Продукцияны экспорттойм' },
    { value: 'Дистрибьютор', label: 'Дистрибьютор', icon: <FaBuilding />, desc: 'Оптом сатуу менен алектенем' },
    { value: 'Логистика', label: 'Логистика', icon: <FaTruck />, desc: 'Жеткирүү кызматы' },
    { value: 'Консультант', label: 'Консультант', icon: <FaHandshake />, desc: 'Айыл чарба кеңешчиси' }
  ]

  const avatars = ['🌾', '🍎', '🥕', '🐄', '🐔', '🐝', '🌻', '🍇', '🐑', '🐖', '🐓', '🌿']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarSelect = (avatar) => {
    setFormData(prev => ({ ...prev, avatar }))
  }

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.password.length < 6) {
      showToastMessage('Пароль должен быть не менее 6 символов', 'error')
      return
    }

    const users = JSON.parse(localStorage.getItem('agrobazar_users') || '[]')
    if (users.find(u => u.email === formData.email)) {
      showToastMessage('Пользователь с таким email уже существует', 'error')
      return
    }

    handleRegister(formData)
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      region: '',
      farmName: '',
      avatar: '🌾',
      role: 'Фермер'
    })
  }

  if (!showRegister) return null

  return (
    <div className="modal-overlay" onClick={() => setShowRegister(false)}>
      <div className="register-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="register-modal-header">
          <h2><FaUser /> Регистрация</h2>
          <button className="register-modal-close" onClick={() => setShowRegister(false)}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="register-input-group">
            <label><FaUser /> ФИО</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Иванов Иван Иванович"
              autoComplete="name"
            />
          </div>
          <div className="register-input-group">
            <label><FaEnvelope /> Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@mail.com"
              autoComplete="email"
            />
          </div>
          <div className="register-input-group">
            <label><FaLock /> Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Не менее 6 символов"
              autoComplete="new-password"
              minLength="6"
            />
          </div>
          <div className="register-input-group">
            <label><FaPhone /> Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+996 700 123 456"
              autoComplete="tel"
            />
          </div>
          <div className="register-input-group">
            <label><FaMapMarkerAlt /> Область</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            >
              <option value="">Выберите область</option>
              {safeRegions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="register-input-group">
            <label><FaTag /> Роль</label>
            <div className="register-role-grid">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  className={`register-role-item ${formData.role === role.value ? 'active' : ''}`}
                  onClick={() => handleRoleSelect(role.value)}
                >
                  <span className="register-role-icon">{role.icon}</span>
                  <span className="register-role-label">{role.label}</span>
                  <span className="register-role-desc">{role.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="register-input-group">
            <label><FaLeaf /> Название фермы/компании</label>
            <input
              type="text"
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              placeholder="Например: Золотая нива"
            />
          </div>
          <div className="register-input-group">
            <label><FaLeaf /> Аватар</label>
            <div className="register-avatar-grid">
              {avatars.map((avatar) => (
                <span
                  key={avatar}
                  className={`register-avatar-item ${formData.avatar === avatar ? 'active' : ''}`}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  {avatar}
                </span>
              ))}
            </div>
          </div>
          <button type="submit" className="register-submit-btn">
            <FaUser /> Зарегистрироваться
          </button>
        </form>
        <p className="register-footer-text">
          Уже есть аккаунт?{' '}
          <button
            type="button"
            className="register-switch-btn"
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