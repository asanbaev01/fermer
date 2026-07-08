// components/pages/DiscountPage.jsx
import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaTag, FaGift, FaClock, 
  FaCopy, FaCheck, FaFire, FaShoppingCart
} from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './DiscountPage.css'

export default function DiscountPage() {
  const navigate = useNavigate()
  const { products, currentUser, showToastMessage, addToCart } = useContext(AppContext)
  const [copiedCode, setCopiedCode] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [usedCodes, setUsedCodes] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('agrobazar_used_codes')
    if (saved) {
      try {
        setUsedCodes(JSON.parse(saved))
      } catch (e) {
        localStorage.removeItem('agrobazar_used_codes')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('agrobazar_used_codes', JSON.stringify(usedCodes))
  }, [usedCodes])

  const promoCodes = [
    {
      id: 1,
      code: 'AGRO10',
      discount: 10,
      type: 'percent',
      category: 'all',
      minOrder: 500,
      maxDiscount: 1000,
      expires: '2026-12-31',
      description: '10% скидка на все товары',
      icon: '🔥',
      color: '#ef4444'
    },
    {
      id: 2,
      code: 'SUMMER25',
      discount: 25,
      type: 'percent',
      category: 'Жашылча',
      minOrder: 1000,
      maxDiscount: 2000,
      expires: '2026-08-31',
      description: '25% скидка на овощи',
      icon: '🌿',
      color: '#22c55e'
    },
    {
      id: 3,
      code: 'FRUIT15',
      discount: 15,
      type: 'percent',
      category: 'Мөмө',
      minOrder: 300,
      maxDiscount: 800,
      expires: '2026-09-30',
      description: '15% скидка на фрукты',
      icon: '🍎',
      color: '#ef4444'
    },
    {
      id: 4,
      code: 'HONEY20',
      discount: 20,
      type: 'percent',
      category: 'Бал',
      minOrder: 200,
      maxDiscount: 500,
      expires: '2026-12-31',
      description: '20% скидка на мед',
      icon: '🍯',
      color: '#f59e0b'
    },
    {
      id: 5,
      code: 'BIGSALE',
      discount: 500,
      type: 'fixed',
      category: 'all',
      minOrder: 3000,
      maxDiscount: 500,
      expires: '2026-07-31',
      description: '500 сом скидка при заказе от 3000 сом',
      icon: '💎',
      color: '#8b5cf6'
    },
    {
      id: 6,
      code: 'MEAT30',
      discount: 30,
      type: 'percent',
      category: 'Эт',
      minOrder: 1500,
      maxDiscount: 3000,
      expires: '2026-10-31',
      description: '30% скидка на мясо',
      icon: '🥩',
      color: '#dc2626'
    },
    {
      id: 7,
      code: 'MILK10',
      discount: 10,
      type: 'percent',
      category: 'Сүт',
      minOrder: 200,
      maxDiscount: 300,
      expires: '2026-12-31',
      description: '10% скидка на молочные продукты',
      icon: '🥛',
      color: '#3b82f6'
    },
    {
      id: 8,
      code: 'NEWUSER50',
      discount: 50,
      type: 'fixed',
      category: 'all',
      minOrder: 500,
      maxDiscount: 50,
      expires: '2026-12-31',
      description: '50 сом скидка для новых пользователей',
      icon: '🎁',
      color: '#f472b6'
    }
  ]

  const getSaleProducts = () => {
    if (activeTab === 'all') return products
    return products.filter(p => p.discount > 0)
  }

  const getFilteredPromoCodes = () => {
    if (activeTab === 'all') return promoCodes
    if (activeTab === 'available') return promoCodes.filter(d => !usedCodes.includes(d.code))
    if (activeTab === 'used') return promoCodes.filter(d => usedCodes.includes(d.code))
    return promoCodes
  }

  const handleCopyPromo = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    showToastMessage(`Код ${code} скопирован!`, 'success')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleActivatePromo = (code) => {
    if (!currentUser) {
      showToastMessage('Войдите в систему, чтобы использовать код', 'error')
      return
    }
    if (usedCodes.includes(code)) {
      showToastMessage('Этот код уже использован', 'error')
      return
    }
    setUsedCodes([...usedCodes, code])
    showToastMessage(`Код ${code} успешно активирован! 🎉`, 'success')
  }

  const calcDiscountPrice = (price, discount) => {
    if (!discount || discount === 0) return price
    return Math.round((price * (100 - discount)) / 100 * 10) / 10
  }

  const getRemainingTime = (expires) => {
    const diff = new Date(expires) - new Date()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Истек'
    if (days === 0) return 'Последний день!'
    if (days < 7) return `${days} дней`
    if (days < 30) return `${Math.floor(days / 7)} недель`
    return `${Math.floor(days / 30)} месяцев`
  }

  const saleProducts = getSaleProducts()
  const filteredPromoCodes = getFilteredPromoCodes()

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0'
    return Number(price).toFixed(1)
  }

  return (
    <div className="promo-page">
      <div className="promo-header">
        <button className="promo-back" onClick={() => navigate('/')}>
          <FaArrowLeft /> Назад
        </button>
        <h1><FaTag /> Скидки и акции</h1>
      </div>

      <div className="promo-tabs">
        <button className={`promo-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          Все скидки
        </button>
        <button className={`promo-tab ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>
          <FaGift /> Доступные
        </button>
        <button className={`promo-tab ${activeTab === 'used' ? 'active' : ''}`} onClick={() => setActiveTab('used')}>
          <FaCheck /> Использованные
        </button>
      </div>

      <div className="promo-stats">
        <div className="promo-stat-card">
          <div className="promo-stat-icon"><FaTag /></div>
          <div className="promo-stat-info">
            <h3>{promoCodes.length}</h3>
            <p>Всего скидок</p>
          </div>
        </div>
        <div className="promo-stat-card">
          <div className="promo-stat-icon"><FaGift /></div>
          <div className="promo-stat-info">
            <h3>{promoCodes.filter(d => !usedCodes.includes(d.code)).length}</h3>
            <p>Доступно</p>
          </div>
        </div>
        <div className="promo-stat-card">
          <div className="promo-stat-icon"><FaFire /></div>
          <div className="promo-stat-info">
            <h3>{products.filter(p => p.discount > 0).length}</h3>
            <p>Товаров со скидкой</p>
          </div>
        </div>
      </div>

      <div className="promo-grid">
        {filteredPromoCodes.map(promo => (
          <div key={promo.id} className="promo-card">
            <div className="promo-card-head" style={{ background: promo.color }}>
              <span className="promo-icon">{promo.icon}</span>
              <span className="promo-value">
                {promo.type === 'percent' ? `${promo.discount}%` : `${promo.discount} сом`}
              </span>
              <span className="promo-badge">Скидка</span>
            </div>
            <div className="promo-card-body">
              <h3>{promo.description}</h3>
              <p className="promo-code-box">
                <span className="promo-code-label">Промокод:</span>
                <span className="promo-code-value">{promo.code}</span>
                <button 
                  className="promo-copy-btn"
                  onClick={() => handleCopyPromo(promo.code)}
                >
                  {copiedCode === promo.code ? <FaCheck /> : <FaCopy />}
                </button>
              </p>
              <div className="promo-details">
                <span><FaClock /> {getRemainingTime(promo.expires)}</span>
                <span>Мин. заказ: {promo.minOrder} сом</span>
                {promo.category !== 'all' && <span className="promo-category-tag">{promo.category}</span>}
              </div>
              <button 
                className={`promo-activate-btn ${usedCodes.includes(promo.code) ? 'used' : ''}`}
                onClick={() => handleActivatePromo(promo.code)}
                disabled={usedCodes.includes(promo.code)}
              >
                {usedCodes.includes(promo.code) ? '✓ Использован' : 'Активировать'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="promo-products-section">
        <h2><FaFire /> Товары со скидкой</h2>
        <div className="promo-products-grid">
          {saleProducts.map(product => (
            <div key={product.id} className="promo-product-card" onClick={() => navigate(`/product/${product.id}`)}>
              <div className="promo-product-image">
                <span className="promo-product-emoji">{product.image}</span>
                {product.discount > 0 && (
                  <span className="promo-product-discount-badge">-{product.discount}%</span>
                )}
              </div>
              <div className="promo-product-info">
                <h3>{product.name}</h3>
                <div className="promo-product-pricing">
                  <span className="promo-old-price">{formatPrice(product.price)} сом</span>
                  <span className="promo-new-price">{formatPrice(calcDiscountPrice(product.price, product.discount))} сом</span>
                </div>
                <button className="promo-add-cart-btn" onClick={(e) => {
                  e.stopPropagation()
                  addToCart(product.id)
                }}>
                  <FaShoppingCart /> В корзину
                </button>
              </div>
            </div>
          ))}
          {saleProducts.length === 0 && (
            <div className="promo-empty-placeholder">
              <FaTag className="promo-empty-icon" />
              <p>Товаров со скидкой пока нет</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}