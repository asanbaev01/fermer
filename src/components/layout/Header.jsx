// components/layout/Header.jsx
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaLeaf, FaSearch, FaBell, FaUser, FaPlus, FaSignOutAlt, 
  FaHeart, FaShoppingCart, FaTrophy, FaChartBar, FaBox, 
  FaComment, FaMapMarkerAlt, FaTag, FaNewspaper
} from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './Header.css'

export default function Header() {
  const {
    currentUser,
    setCurrentUser,
    searchTerm,
    setSearchTerm,
    showNotifications,
    setShowNotifications,
    notifications,
    setNotifications,
    setShowLogin,
    setShowRegister,
    setShowAddProduct,
    showToastMessage,
    favorites,
    cart
  } = useContext(AppContext)

  const navigate = useNavigate()

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('agrobazar_user')
    showToastMessage('Вы вышли из системы', 'info')
    setNotifications(prev => [
      {
        id: Date.now(),
        message: 'Вы вышли из системы',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ])
  }

  const unreadNotifications = notifications.filter(n => !n.read)

  const getTimeAgo = (date) => {
    const diff = new Date() - new Date(date)
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'сегодня'
    if (days === 1) return 'вчера'
    if (days < 7) return `${days} дня назад`
    if (days < 30) return `${Math.floor(days / 7)} недель назад`
    if (days < 365) return `${Math.floor(days / 30)} месяцев назад`
    return `${Math.floor(days / 365)} лет назад`
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section" onClick={() => navigate('/')}>
          <FaLeaf className="logo-icon" />
          <h1 className="logo-text">AgroBazar</h1>
        </div>

        <div className="header-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Товар, фермер, регион..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="header-actions">
          <button className="notif-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell />
            {unreadNotifications.length > 0 && (
              <span className="notif-badge">{unreadNotifications.length}</span>
            )}
          </button>

          <button className="header-icon-btn" onClick={() => navigate('/favorites')}>
            <FaHeart />
            {favorites && favorites.length > 0 && (
              <span className="header-badge">{favorites.length}</span>
            )}
          </button>

          <button className="header-icon-btn" onClick={() => navigate('/cart')}>
            <FaShoppingCart />
            {cart && cart.length > 0 && (
              <span className="header-badge">{cart.length}</span>
            )}
          </button>

          {currentUser ? (
            <div className="user-menu">
              <button className="nav-btn" onClick={() => navigate('/profile')}>
                <FaUser /> {currentUser.fullName}
              </button>
              <button className="nav-btn" onClick={() => navigate('/leaderboard')}>
                <FaTrophy /> Рейтинг
              </button>
              <button className="nav-btn" onClick={() => navigate('/analytics')}>
                <FaChartBar /> Статистика
              </button>
              <button className="nav-btn" onClick={() => navigate('/orders')}>
                <FaBox /> Заказы
              </button>
              <button className="nav-btn" onClick={() => navigate('/chat')}>
                <FaComment /> Чат
              </button>
              <button className="nav-btn" onClick={() => navigate('/map')}>
                <FaMapMarkerAlt /> Карта
              </button>
              <button className="nav-btn" onClick={() => navigate('/discounts')}>
                <FaTag /> Скидки
              </button>
              <button className="nav-btn" onClick={() => navigate('/blog')}>
                <FaNewspaper /> Блог
              </button>
              <button className="nav-btn" onClick={() => setShowAddProduct(true)}>
                <FaPlus />
              </button>
              <button className="nav-btn logout-btn" onClick={handleLogout}>
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-login" onClick={() => setShowLogin(true)}>
                <FaUser /> Войти
              </button>
              <button className="btn-register" onClick={() => setShowRegister(true)}>
                <FaLeaf /> Регистрация
              </button>
            </div>
          )}
        </div>
      </div>

      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notif-header">
            <h3><FaBell /> Уведомления</h3>
            {unreadNotifications.length > 0 && (
              <button
                className="mark-read-btn"
                onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
              >
                Прочитать все
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="empty-notif">Нет уведомлений</div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                onClick={() => setNotifications(
                  notifications.map(n => n.id === notif.id ? { ...n, read: true } : n)
                )}
              >
                <div className="notif-message">{notif.message}</div>
                <div className="notif-time">{getTimeAgo(notif.createdAt)}</div>
              </div>
            ))
          )}
        </div>
      )}
    </header>
  )
}