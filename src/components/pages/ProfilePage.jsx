// components/pages/ProfilePage.jsx
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaEdit, FaBox, FaShoppingBag, FaHeart,
  FaComment, FaStar, FaMapMarkerAlt, FaTag,
  FaPhone, FaEnvelope, FaTrophy, FaGraduationCap,
  FaCalendarAlt, FaClock, FaTrash, FaPlus, FaLeaf, FaCheckCircle,
  FaCamera, FaLink, FaWhatsapp, FaTelegram, FaGlobe
} from 'react-icons/fa'
import { MdAgriculture } from 'react-icons/md'
import { AppContext } from '../../context/AppContext'
import EditProfileModal from '../modals/EditProfileModal'
import './ProfilePage.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const context = useContext(AppContext)

  if (!context) {
    return (
      <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
        Контекст табылган жок
      </div>
    )
  }

  const {
    currentUser,
    products,
    orders,
    favorites,
    comments,
    activeTab,
    setActiveTab,
    setShowEditProfile,
    setShowAddProduct,
    showEditProfile,
    handleDeleteProduct,
    toggleFavorite,
    formatPrice,
    formatRating,
    getTimeAgo,
    calculateTotalSales
  } = context

  useEffect(() => {
    if (!currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  if (!currentUser) {
    return (
      <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
        Жүктөлүүдө...
      </div>
    )
  }

  const userProducts = products.filter(p => p.farmerId === currentUser.id)
  const userOrders = orders.filter(o => o.buyerId === currentUser.id || o.farmerId === currentUser.id)
  const userFavorites = products.filter(p => favorites.includes(p.id))
  const userComments = Object.values(comments).flat().filter(c => c.userId === currentUser.id)
  const totalSales = calculateTotalSales ? calculateTotalSales(currentUser.id) : 0

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-cover-content">
            <div className="profile-avatar-wrapper">
              <span className="profile-cover-emoji">{currentUser.avatar || '🌾'}</span>
              <button className="avatar-edit-btn" onClick={() => setShowEditProfile(true)}>
                <FaCamera />
              </button>
            </div>
            <div className="profile-cover-info">
              <h1>{currentUser.fullName || 'Пользователь'}</h1>
              <p><MdAgriculture /> {currentUser.farmName || 'Ферма жок'}</p>
              <p className="profile-cover-location">
                <FaMapMarkerAlt /> {currentUser.region || 'Регион көрсөтүлгөн эмес'}
              </p>
              {currentUser.verified && (
                <span className="verified-badge"><FaCheckCircle /> Текшерилген</span>
              )}
            </div>
          </div>
          <div className="profile-cover-actions">
            <button className="btn-edit-profile" onClick={() => setShowEditProfile(true)}>
              <FaEdit /> Редактировать
            </button>
            <button className="btn-share-profile" onClick={() => navigator.clipboard.writeText(window.location.href)}>
              <FaLink /> Поделиться
            </button>
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="stat-item">
            <span className="stat-value">{userProducts.length}</span>
            <span className="stat-label"><FaBox /> Товаров</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userOrders.length}</span>
            <span className="stat-label"><FaShoppingBag /> Заказов</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{favorites.length}</span>
            <span className="stat-label"><FaHeart /> Избранных</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalSales}</span>
            <span className="stat-label"><FaTrophy /> Продаж</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{formatRating(currentUser.rating || 0)}</span>
            <span className="stat-label"><FaStar /> Рейтинг</span>
          </div>
        </div>

        <div className="profile-info-section">
          <div className="profile-info-item">
            <FaPhone className="info-icon" />
            <span>{currentUser.phone || 'Телефон жок'}</span>
          </div>
          <div className="profile-info-item">
            <FaEnvelope className="info-icon" />
            <span>{currentUser.email || 'Email жок'}</span>
          </div>
          <div className="profile-info-item">
            <FaTag className="info-icon" />
            <span>{currentUser.farmType || 'Тип жок'}</span>
          </div>
          <div className="profile-info-item">
            <FaGraduationCap className="info-icon" />
            <span>{currentUser.education || 'Билим жок'}</span>
          </div>
          <div className="profile-info-item">
            <FaCalendarAlt className="info-icon" />
            <span>Катталган: {currentUser.createdAt || 'Белгисиз'}</span>
          </div>
          {currentUser.website && (
            <div className="profile-info-item">
              <FaGlobe className="info-icon" />
              <a href={currentUser.website} target="_blank" rel="noopener noreferrer">{currentUser.website}</a>
            </div>
          )}
          <div className="profile-info-item social-icons">
            <FaWhatsapp className="social-icon" />
            <FaTelegram className="social-icon" />
          </div>
        </div>

        <div className="profile-bio-section">
          <h3><FaComment /> О себе</h3>
          <p>{currentUser.bio || 'Фермер жөнүндө маалымат жок'}</p>
          {currentUser.experience && (
            <p className="profile-experience"><FaTrophy /> Опыт: {currentUser.experience}</p>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab-btn ${activeTab === 'my-products' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-products')}
        >
          <FaBox /> Мои товары ({userProducts.length})
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'my-orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-orders')}
        >
          <FaShoppingBag /> Заказы ({userOrders.length})
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'my-favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-favorites')}
        >
          <FaHeart /> Избранное ({favorites.length})
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'my-reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-reviews')}
        >
          <FaComment /> Отзывы ({userComments.length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'my-products' && (
          <div className="products-grid">
            {userProducts.length > 0 ? (
              userProducts.map(product => (
                <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="product-image">
                    <span className="product-emoji">{product.image || '🌾'}</span>
                    {product.organic && <span className="organic-badge"><FaLeaf /> Organic</span>}
                    {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}
                  </div>
                  <div className="product-body">
                    <div className="product-header">
                      <h3>{product.name}</h3>
                      <span className="product-price">{formatPrice(product.price)} сом/{product.unit || 'кг'}</span>
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
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><FaBox /></span>
                <p>У вас пока нет товаров</p>
                <button className="btn-primary" onClick={() => setShowAddProduct(true)}>
                  <FaPlus /> Добавить товар
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-orders' && (
          <div className="orders-grid">
            {userOrders.length > 0 ? (
              userOrders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <h4>{order.productName}</h4>
                    <span className={`order-status ${order.status}`}>
                      {order.status === 'pending' ? '⏳ Ожидает' :
                        order.status === 'confirmed' ? '✅ Подтвержден' :
                          order.status === 'delivered' ? '📦 Доставлен' : '❌ Отменен'}
                    </span>
                  </div>
                  <div className="order-body">
                    <p><FaBox /> Количество: {order.quantity}</p>
                    <p><FaMapMarkerAlt /> Адрес: {order.address}</p>
                    <p><FaCalendarAlt /> Доставка: {order.deliveryDate}</p>
                    <p><FaTag /> Оплата: {order.paymentMethod}</p>
                    {order.comment && <p><FaComment /> {order.comment}</p>}
                  </div>
                  <div className="order-footer">
                    <span className="meta-item"><FaUser /> {order.buyerName}</span>
                    <span className="meta-item"><FaClock /> {getTimeAgo(order.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><FaShoppingBag /></span>
                <p>Заказов пока нет</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-favorites' && (
          <div className="products-grid">
            {userFavorites.length > 0 ? (
              userFavorites.map(product => (
                <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="product-image">
                    <span className="product-emoji">{product.image || '🌾'}</span>
                    <span className="product-favorite-badge"><FaHeart /></span>
                  </div>
                  <div className="product-body">
                    <div className="product-header">
                      <h3>{product.name}</h3>
                      <span className="product-price">{formatPrice(product.price)} сом/{product.unit || 'кг'}</span>
                    </div>
                    <button className="btn-favorite active" onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }}>
                      <FaHeart /> Удалить
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><FaHeart /></span>
                <p>Нет избранных товаров</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-reviews' && (
          <div className="reviews-section">
            <h3><FaComment /> Мои отзывы</h3>
            {userComments.length > 0 ? (
              userComments.map((comment, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header">
                    <span className="review-rating">{'⭐'.repeat(Math.round(comment.rating || 0))}</span>
                    <span className="review-date"><FaCalendarAlt /> {comment.date}</span>
                  </div>
                  <p className="review-text">{comment.text}</p>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><FaComment /></span>
                <p>У вас пока нет отзывов</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showEditProfile && <EditProfileModal />}
    </div>
  )
}