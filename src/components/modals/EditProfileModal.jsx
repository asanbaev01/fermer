// components/modals/EditProfileModal.jsx
import React, { useContext, useEffect, useState } from 'react'
import { FaEdit, FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaTag, FaTimes, FaComment, FaLeaf, FaGlobe, FaGraduationCap } from 'react-icons/fa'
import { MdAgriculture } from 'react-icons/md'
import { AppContext } from '../../context/AppContext'
import './EditProfileModal.css'

export default function EditProfileModal() {
  const context = useContext(AppContext)

  if (!context) {
    console.error('EditProfileModal: AppContext табылган жок!')
    return (
      <div className="modal-overlay">
        <div style={{ background: '#1c1917', padding: '2rem', borderRadius: '16px', color: 'white' }}>
          Контекст табылган жок
        </div>
      </div>
    )
  }

  const {
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    setShowEditProfile,
    showToastMessage,
    regions,
    farmTypes
  } = context

  // 🔥 Коопсуздук: эгер regions же farmTypes массив эмес болсо, бош массив кой
  const safeRegions = Array.isArray(regions) ? regions : []
  const safeFarmTypes = Array.isArray(farmTypes) ? farmTypes : []

  console.log('EditProfileModal: currentUser =', currentUser)
  console.log('EditProfileModal: regions =', safeRegions)
  console.log('EditProfileModal: farmTypes =', safeFarmTypes)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    region: '',
    district: '',
    email: '',
    website: '',
    farmName: '',
    farmType: '',
    education: '',
    experience: '',
    bio: '',
    avatar: '🌾'
  })

  const avatars = ['🌾', '🍎', '🥕', '🐄', '🐔', '🐝', '🌻', '🍇', '🐑', '🐖', '🐓', '🌿']

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        region: currentUser.region || '',
        district: currentUser.district || '',
        email: currentUser.email || '',
        website: currentUser.website || '',
        farmName: currentUser.farmName || '',
        farmType: currentUser.farmType || '',
        education: currentUser.education || '',
        experience: currentUser.experience || '',
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || '🌾'
      })
    }
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarSelect = (avatar) => {
    setFormData(prev => ({ ...prev, avatar }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!currentUser) {
      showToastMessage('Ошибка: пользователь не найден', 'error')
      return
    }

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          ...formData,
          avatar: formData.avatar || '🌾'
        }
      }
      return u
    })

    setUsers(updatedUsers)
    setCurrentUser({
      ...currentUser,
      ...formData,
      avatar: formData.avatar || '🌾'
    })
    setShowEditProfile(false)
    showToastMessage('Профиль обновлен! ✅', 'success')
  }

  if (!currentUser) {
    return (
      <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
        <div className="edit-profile-modal">
          <div className="modal-header">
            <h2><FaEdit /> Редактировать профиль</h2>
            <button className="modal-close" onClick={() => setShowEditProfile(false)}><FaTimes /></button>
          </div>
          <p style={{ color: '#fafaf9', textAlign: 'center', padding: '2rem' }}>
            ⏳ Загрузка данных пользователя...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
      <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FaEdit /> Редактировать профиль</h2>
          <button className="modal-close" onClick={() => setShowEditProfile(false)}><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label><FaUser /> ФИО</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label><FaPhone /> Телефон</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label><FaMapMarkerAlt /> Область</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
              >
                <option value="">Выберите область</option>
                {safeRegions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label><FaMapMarkerAlt /> Район</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Например: Аламединский"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
              />
            </div>
            <div className="form-group">
              <label><FaGlobe /> Сайт</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label><MdAgriculture /> Ферма</label>
              <input
                type="text"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                placeholder="Название фермы"
              />
            </div>
            <div className="form-group">
              <label><FaTag /> Тип фермы</label>
              <select
                name="farmType"
                value={formData.farmType}
                onChange={handleChange}
              >
                <option value="">Выберите тип</option>
                {safeFarmTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label><FaGraduationCap /> Образование</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Ваше образование"
              />
            </div>
            <div className="form-group">
              <label><FaTag /> Опыт</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Например: 5 лет"
              />
            </div>
          </div>
          <div className="form-group">
            <label><FaComment /> О себе</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Расскажите о себе..."
            />
          </div>
          <div className="form-group">
            <label><FaLeaf /> Аватар</label>
            <div className="avatar-selector">
              {avatars.map(avatar => (
                <span
                  key={avatar}
                  className={`avatar-option ${formData.avatar === avatar ? 'active' : ''}`}
                  onClick={() => handleAvatarSelect(avatar)}
                >
                  {avatar}
                </span>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-submit">
            <FaEdit /> Сохранить изменения
          </button>
        </form>
      </div>
    </div>
  )
}