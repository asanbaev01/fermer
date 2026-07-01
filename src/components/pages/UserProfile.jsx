// components/pages/UserProfile.jsx
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaTag, FaBox, FaStar } from 'react-icons/fa'
import { MdAgriculture } from 'react-icons/md'
import { AppContext } from '../../context/AppContext'
import './UserProfile.css'

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { users, products, formatPrice, formatRating } = useContext(AppContext)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const found = users.find(u => u.id === parseInt(id))
    if (found) {
      setUser(found)
    } else {
      navigate('/')
    }
  }, [id, users, navigate])

  const getUserProducts = (userId) => products.filter(p => p.farmerId === userId)

  if (!user) return null

  return (
    <div className="user-profile-page">
      <button className="btn-back" onClick={() => navigate('/')}><FaArrowLeft /> Назад</button>
      <div className="profile-header">
        <div className="profile-cover">
          <span className="profile-cover-emoji">{user.avatar || '🌾'}</span>
        </div>
        <div className="profile-main">
          <div className="profile-avatar-large">{user.avatar || '🌾'}</div>
          <div className="profile-main-info">
            <h1>{user.fullName}</h1>
            <p className="profile-farm-name"><MdAgriculture /> {user.farmName}</p>
            <p className="profile-farm-type"><FaTag /> {user.farmType}</p>
            <p className="profile-location"><FaMapMarkerAlt /> {user.region}</p>
            <p className="profile-bio">{user.bio || 'Фермер'}</p>
            <div className="profile-contact">
              <span><FaPhone /> {user.phone}</span>
              <span><FaEnvelope /> {user.email || 'Не указан'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="products-grid">
        {getUserProducts(user.id).map(product => (
          <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="product-image">
              <span className="product-emoji">{product.image}</span>
            </div>
            <div className="product-body">
              <div className="product-header">
                <h3>{product.name}</h3>
                <span className="product-price">{formatPrice(product.price)} сом/{product.unit}</span>
              </div>
              <p className="product-description">{product.description.substring(0, 60)}...</p>
              <span className="product-category">{product.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}