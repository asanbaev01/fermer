// components/pages/OrderTrackingPage.jsx
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaBox, FaCheckCircle, FaClock, 
  FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaUser,
  FaPhone, FaEnvelope, FaSearch
} from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './OrderTrackingPage.css'

export default function OrderTrackingPage() {
  const navigate = useNavigate()
  const { orders, users, products, currentUser } = useContext(AppContext)
  const [searchOrder, setSearchOrder] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const getStatusStep = (status) => {
    const steps = ['pending', 'confirmed', 'preparing', 'shipping', 'delivered']
    return steps.indexOf(status) + 1
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pending': '⏳ Ожидает подтверждения',
      'confirmed': '✅ Подтвержден',
      'preparing': '📦 Готовится к отправке',
      'shipping': '🚚 В пути',
      'delivered': '📬 Доставлен'
    }
    return labels[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#fbbf24',
      'confirmed': '#34d399',
      'preparing': '#60a5fa',
      'shipping': '#f59e0b',
      'delivered': '#34d399'
    }
    return colors[status] || '#a8a29e'
  }

  const getUserOrders = () => {
    if (!currentUser) return orders
    return orders.filter(o => o.buyerId === currentUser.id || o.farmerId === currentUser.id)
  }

  const filteredOrders = getUserOrders().filter(o => {
    if (!searchOrder) return true
    const search = searchOrder.toLowerCase()
    return o.productName.toLowerCase().includes(search) || 
           o.buyerName.toLowerCase().includes(search) ||
           o.id.toString().includes(search)
  })

  const getOrderProgress = (order) => {
    const steps = ['pending', 'confirmed', 'preparing', 'shipping', 'delivered']
    const currentStep = steps.indexOf(order.status)
    return (currentStep / (steps.length - 1)) * 100
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
  }

  if (selectedOrder) {
    return (
      <div className="order-tracking-page">
        <div className="order-tracking-header">
          <button className="order-back-btn" onClick={() => setSelectedOrder(null)}>
            <FaArrowLeft /> Назад к списку
          </button>
          <h1><FaBox /> Заказ #{selectedOrder.id}</h1>
        </div>

        <div className="order-detail-container">
          <div className="order-info-card">
            <div className="order-info-row">
              <span><FaUser /> Покупатель:</span>
              <span>{selectedOrder.buyerName}</span>
            </div>
            <div className="order-info-row">
              <span><FaBox /> Товар:</span>
              <span>{selectedOrder.productName}</span>
            </div>
            <div className="order-info-row">
              <span><FaCalendarAlt /> Дата:</span>
              <span>{selectedOrder.createdAt}</span>
            </div>
            <div className="order-info-row">
              <span><FaMapMarkerAlt /> Адрес:</span>
              <span>{selectedOrder.address}</span>
            </div>
            <div className="order-info-row">
              <span><FaPhone /> Телефон:</span>
              <span>{selectedOrder.phone}</span>
            </div>
            <div className="order-info-row">
              <span>Количество:</span>
              <span>{selectedOrder.quantity}</span>
            </div>
            <div className="order-info-row">
              <span>Оплата:</span>
              <span>{selectedOrder.paymentMethod}</span>
            </div>
            <div className="order-info-row">
              <span>Статус:</span>
              <span className={`order-status-badge ${selectedOrder.status}`}>
                {getStatusLabel(selectedOrder.status)}
              </span>
            </div>
          </div>

          <div className="order-tracking-progress">
            <h3>Статус заказа</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getOrderProgress(selectedOrder)}%` }}
              />
            </div>
            <div className="progress-steps">
              <div className={`step ${getStatusStep(selectedOrder.status) >= 1 ? 'active' : ''}`}>
                <span className="step-icon">⏳</span>
                <span className="step-label">Ожидание</span>
              </div>
              <div className={`step ${getStatusStep(selectedOrder.status) >= 2 ? 'active' : ''}`}>
                <span className="step-icon">✅</span>
                <span className="step-label">Подтвержден</span>
              </div>
              <div className={`step ${getStatusStep(selectedOrder.status) >= 3 ? 'active' : ''}`}>
                <span className="step-icon">📦</span>
                <span className="step-label">Готовится</span>
              </div>
              <div className={`step ${getStatusStep(selectedOrder.status) >= 4 ? 'active' : ''}`}>
                <span className="step-icon">🚚</span>
                <span className="step-label">В пути</span>
              </div>
              <div className={`step ${getStatusStep(selectedOrder.status) >= 5 ? 'active' : ''}`}>
                <span className="step-icon">📬</span>
                <span className="step-label">Доставлен</span>
              </div>
            </div>
          </div>

          {selectedOrder.comment && (
            <div className="order-comment">
              <h3><FaEnvelope /> Комментарий</h3>
              <p>{selectedOrder.comment}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="order-tracking-page">
      <div className="order-tracking-header">
        <button className="order-back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Назад
        </button>
        <h1><FaBox /> Мои заказы</h1>
        <div className="order-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Поиск заказа..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
          />
        </div>
      </div>

      <div className="order-stats">
        <div className="stat-card">
          <div className="stat-icon"><FaBox /></div>
          <div className="stat-info">
            <h3>{filteredOrders.length}</h3>
            <p>Всего заказов</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaClock /></div>
          <div className="stat-info">
            <h3>{filteredOrders.filter(o => o.status === 'pending').length}</h3>
            <p>В ожидании</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaTruck /></div>
          <div className="stat-info">
            <h3>{filteredOrders.filter(o => o.status === 'shipping').length}</h3>
            <p>В пути</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-info">
            <h3>{filteredOrders.filter(o => o.status === 'delivered').length}</h3>
            <p>Доставлено</p>
          </div>
        </div>
      </div>

      <div className="order-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <FaBox className="empty-icon" />
            <h2>Заказов пока нет</h2>
            <p>Когда вы сделаете заказ, он появится здесь</p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              На главную
            </button>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div 
              key={order.id} 
              className="order-card"
              onClick={() => handleOrderClick(order)}
            >
              <div className="order-card-header">
                <div className="order-id">
                  <FaBox /> Заказ #{order.id}
                </div>
                <div className={`order-status-label ${order.status}`}>
                  {getStatusLabel(order.status)}
                </div>
              </div>
              <div className="order-card-body">
                <div className="order-product">
                  <span className="order-product-name">{order.productName}</span>
                  <span className="order-product-quantity">× {order.quantity}</span>
                </div>
                <div className="order-card-meta">
                  <span><FaUser /> {order.buyerName}</span>
                  <span><FaCalendarAlt /> {order.createdAt}</span>
                  <span><FaMapMarkerAlt /> {order.address}</span>
                </div>
              </div>
              <div className="order-card-footer">
                <div className="order-progress-mini">
                  <div 
                    className="progress-mini-fill" 
                    style={{ width: `${getOrderProgress(order)}%` }}
                  />
                </div>
                <button className="order-detail-btn">
                  Подробнее →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}