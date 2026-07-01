// components/pages/ProfilePage.jsx
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaEdit, FaUser, FaBox, FaShoppingBag, FaHeart,
  FaComment, FaStar, FaMapMarkerAlt, FaTag,
  FaPhone, FaEnvelope, FaTrophy, FaGraduationCap,
  FaLink, FaCalendarAlt, FaClipboardList, FaClock,
  FaTrash, FaPlus, FaLeaf, FaArrowRight
} from 'react-icons/fa'
import { MdAgriculture } from 'react-icons/md'
import { AppContext } from '../../context/AppContext'
import './ProfilePage.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const {
    currentUser, products, orders, favorites, comments,
    activeTab, setActiveTab,
    setShowEditProfile, setShowAddProduct,
    handleDeleteProduct, toggleFavorite,
    formatPrice, formatRating, getTimeAgo
  } = useContext(AppContext)

  const userProducts = products.filter(p => p.farmerId === currentUser?.id)
  const userOrders = orders.filter(o => o.buyerId === currentUser?.id || o.farmerId === currentUser?.id)
  const userFavorites = products.filter(p => favorites.includes(p.id))

  if (!currentUser) {
    navigate('/')
    return null
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover">
          <span className="profile-cover-emoji">{currentUser.avatar || '🌾'}</span>
          <button className="btn-edit-profile" onClick={() => setShowEditProfile(true)}>
            <FaEdit /> Редактировать
          </button>
        </div>
        <div className="profile-main">
          <div className="profile-avatar-large">{currentUser.avatar || '🌾'}</div>
          <div className="profile-main-info">
            <h1>{currentUser.fullName}</h1>
            <p className="profile-farm-name"><MdAgriculture /> {currentUser.farmName}</p>
            <p className="profile-farm-type"><FaTag /> {currentUser.farmType}</p>
            <p className="profile-location"><FaMapMarkerAlt /> {currentUser.region}</p>
            <div className="profile-main-stats">
              <span><FaStar /> {formatRating(currentUser.rating || 0)}</span>
              <span><FaBox /> {userProducts.length} товаров</span>
              <span><FaClipboardList /> {userOrders.length} заказов</span>
              <span><FaHeart /> {favorites.length} избранных</span>
              <span><FaTrophy /> {currentUser.experience || 'Опыт не указан'}</span>
            </div>
            <p className="profile-bio">{currentUser.bio || 'Расскажите о себе'}</p>
            <div className="profile-contact">
              <span><FaPhone /> {currentUser.phone}</span>
              <span><FaEnvelope /> {currentUser.email || 'Не указан'}</span>
              <span><FaGraduationCap /> {currentUser.education || 'Образование не указано'}</span>
              <span><FaCalendarAlt /> Зарегистрирован: {currentUser.createdAt}</span>
              {currentUser.website && (
                <span><FaLink /> <a href={currentUser.website} target="_blank" rel="noopener noreferrer">{currentUser.website}</a></span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button className={`profile-tab-btn ${activeTab === 'my-products' ? 'active' : ''}`} onClick={() => setActiveTab('my-products')}>
          <FaBox /> Мои товары ({userProducts.length})
        </button>
        <button className={`profile-tab-btn ${activeTab === 'my-orders' ? 'active' : ''}`} onClick={() => setActiveTab('my-orders')}>
          <FaShoppingBag /> Мои заказы ({userOrders.length})
        </button>
        <button className={`profile-tab-btn ${activeTab === 'my-favorites' ? 'active' : ''}`} onClick={() => setActiveTab('my-favorites')}>
          <FaHeart /> Избранное ({favorites.length})
        </button>
        <button className={`profile-tab-btn ${activeTab === 'my-reviews' ? 'active' : ''}`} onClick={() => setActiveTab('my-reviews')}>
          <FaComment /> Отзывы
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'my-products' && (
          <div className="products-grid">
            {userProducts.map(product => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="product-image">
                  <span className="product-emoji">{product.image}</span>
                  {product.organic && <span className="organic-badge"><FaLeaf /> Organic</span>}
                </div>
                <div className="product-body">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span className="product-price">{formatPrice(product.price)} сом/{product.unit}</span>
                  </div>
                  <div className="product-meta">
                    <span className="meta-item"><FaMapMarkerAlt /> {product.region}</span>
                    <span className="meta-item"><FaBox /> {product.quantity} {product.unit}</span>
                    <span className="meta-item"><FaStar /> {formatRating(product.rating || 0)}</span>
                  </div>
                  <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id) }}>
                    <FaTrash /> Удалить
                  </button>
                </div>
              </div>
            ))}
            {userProducts.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaBox />
                  <span className="empty-state-sparkle">✨</span>
                </div>
                <p className="empty-state-title">У вас пока нет товаров</p>
                <p className="empty-state-subtitle">Начните продавать свои продукты прямо сейчас!</p>
                <button className="btn-add-first" onClick={() => setShowAddProduct(true)}>
                  <FaPlus />
                  <span>Добавить первый товар</span>
                  <FaArrowRight className="btn-arrow" />
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-orders' && (
          <div className="orders-grid">
            {userOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h4>{order.productName}</h4>
                  <span className={`order-status ${order.status}`}>
                    {order.status === 'pending' ? '⏳ Ожидает' : order.status === 'confirmed' ? '✅ Подтвержден' : '❌ Отменен'}
                  </span>
                </div>
                <div className="order-body">
                  <p><FaBox /> Количество: {order.quantity}</p>
                  <p><FaMapMarkerAlt /> Адрес: {order.address}</p>
                  <p><FaCalendarAlt /> Дата доставки: {order.deliveryDate}</p>
                  <p><FaTag /> Оплата: {order.paymentMethod}</p>
                  <p><FaComment /> Комментарий: {order.comment || 'Нет'}</p>
                </div>
                <div className="order-footer">
                  <span className="meta-item"><FaUser /> {order.buyerName}</span>
                  <span className="meta-item"><FaClock /> {getTimeAgo(order.createdAt)}</span>
                </div>
              </div>
            ))}
            {userOrders.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaShoppingBag />
                </div>
                <p className="empty-state-title">У вас пока нет заказов</p>
                <p className="empty-state-subtitle">Когда появятся заказы, они будут здесь</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-favorites' && (
          <div className="products-grid">
            {userFavorites.map(product => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="product-image">
                  <span className="product-emoji">{product.image}</span>
                </div>
                <div className="product-body">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span className="product-price">{formatPrice(product.price)} сом/{product.unit}</span>
                  </div>
                  <button className="btn-favorite active" onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }}>
                    <FaHeart /> Удалить
                  </button>
                </div>
              </div>
            ))}
            {userFavorites.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaHeart />
                </div>
                <p className="empty-state-title">Нет избранных товаров</p>
                <p className="empty-state-subtitle">Добавляйте товары в избранное, чтобы не потерять их</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-reviews' && (
          <div className="reviews-section">
            <h3><FaComment /> Мои отзывы</h3>
            {Object.values(comments).flat().filter(c => c.userId === currentUser.id).length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaComment />
                </div>
                <p className="empty-state-title">У вас пока нет отзывов</p>
                <p className="empty-state-subtitle">Поделитесь своим мнением о товарах</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}