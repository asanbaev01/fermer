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
  const { products, currentUser, showToastMessage, addToCart, language } = useContext(AppContext)
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

  const translations = {
    ky: {
      title: 'Арзандатуулар жана акциялар',
      back: 'Артка',
      all: 'Бардык арзандатуулар',
      available: 'Жеткиликтүү',
      used: 'Колдонулган',
      total: 'Бардык арзандатуулар',
      availableCount: 'Жеткиликтүү',
      productsOnSale: 'Арзандатылган товарлар',
      noProducts: 'Арзандатылган товарлар жок',
      copy: 'Көчүрүү',
      copied: 'Көчүрүлдү',
      activate: 'Активациялоо',
      usedText: 'Колдонулган',
      discount: 'Арзандатуу',
      promo: 'Промокод',
      minOrder: 'Минималдуу заказ',
      days: 'күн',
      week: 'жума',
      month: 'ай',
      lastDay: 'Акыркы күн!',
      expired: 'Бүткөн',
      addToCart: 'Себетке'
    },
    ru: {
      title: 'Скидки и акции',
      back: 'Назад',
      all: 'Все скидки',
      available: 'Доступные',
      used: 'Использованные',
      total: 'Всего скидок',
      availableCount: 'Доступно',
      productsOnSale: 'Товары со скидкой',
      noProducts: 'Товаров со скидкой пока нет',
      copy: 'Копировать',
      copied: 'Скопирован',
      activate: 'Активировать',
      usedText: 'Использован',
      discount: 'Скидка',
      promo: 'Промокод',
      minOrder: 'Мин. заказ',
      days: 'дней',
      week: 'недель',
      month: 'месяцев',
      lastDay: 'Последний день!',
      expired: 'Истек',
      addToCart: 'В корзину'
    },
    en: {
      title: 'Discounts and Promotions',
      back: 'Back',
      all: 'All Discounts',
      available: 'Available',
      used: 'Used',
      total: 'Total Discounts',
      availableCount: 'Available',
      productsOnSale: 'Products on Sale',
      noProducts: 'No products on sale yet',
      copy: 'Copy',
      copied: 'Copied',
      activate: 'Activate',
      usedText: 'Used',
      discount: 'Discount',
      promo: 'Promo Code',
      minOrder: 'Min. Order',
      days: 'days',
      week: 'weeks',
      month: 'months',
      lastDay: 'Last day!',
      expired: 'Expired',
      addToCart: 'Add to Cart'
    }
  }

  const t = translations[language] || translations.ru

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
      description: {
        ky: 'Бардык товарларга 10% арзандатуу',
        ru: '10% скидка на все товары',
        en: '10% discount on all products'
      },
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
      description: {
        ky: 'Жашылчага 25% арзандатуу',
        ru: '25% скидка на овощи',
        en: '25% discount on vegetables'
      },
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
      description: {
        ky: 'Мөмөгө 15% арзандатуу',
        ru: '15% скидка на фрукты',
        en: '15% discount on fruits'
      },
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
      description: {
        ky: 'Балга 20% арзандатуу',
        ru: '20% скидка на мед',
        en: '20% discount on honey'
      },
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
      description: {
        ky: '3000 сомдон баштап 500 сом арзандатуу',
        ru: '500 сом скидка при заказе от 3000 сом',
        en: '500 som discount on orders over 3000 som'
      },
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
      description: {
        ky: 'Этке 30% арзандатуу',
        ru: '30% скидка на мясо',
        en: '30% discount on meat'
      },
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
      description: {
        ky: 'Сүт азыктарына 10% арзандатуу',
        ru: '10% скидка на молочные продукты',
        en: '10% discount on dairy products'
      },
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
      description: {
        ky: 'Жаңы колдонуучуларга 50 сом арзандатуу',
        ru: '50 сом скидка для новых пользователей',
        en: '50 som discount for new users'
      },
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
    showToastMessage(`${t.copy}: ${code}!`, 'success')
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
    if (days < 0) return t.expired
    if (days === 0) return t.lastDay
    if (days < 7) return `${days} ${t.days}`
    if (days < 30) return `${Math.floor(days / 7)} ${t.week}`
    return `${Math.floor(days / 30)} ${t.month}`
  }

  const getDescription = (promo) => {
    return promo.description[language] || promo.description.ru
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
          <FaArrowLeft /> {t.back}
        </button>
        <h1><FaTag /> {t.title}</h1>
      </div>

      <div className="promo-tabs">
        <button className={`promo-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          {t.all}
        </button>
        <button className={`promo-tab ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>
          <FaGift /> {t.available}
        </button>
        <button className={`promo-tab ${activeTab === 'used' ? 'active' : ''}`} onClick={() => setActiveTab('used')}>
          <FaCheck /> {t.used}
        </button>
      </div>

      <div className="promo-stats">
        <div className="promo-stat-card">
          <div className="promo-stat-icon"><FaTag /></div>
          <div className="promo-stat-info">
            <h3>{promoCodes.length}</h3>
            <p>{t.total}</p>
          </div>
        </div>
        <div className="promo-stat-card">
          <div className="promo-stat-icon"><FaGift /></div>
          <div className="promo-stat-info">
            <h3>{promoCodes.filter(d => !usedCodes.includes(d.code)).length}</h3>
            <p>{t.availableCount}</p>
          </div>
        </div>
        <div className="promo-stat-card">
          <div className="promo-stat-icon"><FaFire /></div>
          <div className="promo-stat-info">
            <h3>{products.filter(p => p.discount > 0).length}</h3>
            <p>{t.productsOnSale}</p>
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
              <span className="promo-badge">{t.discount}</span>
            </div>
            <div className="promo-card-body">
              <h3>{getDescription(promo)}</h3>
              <p className="promo-code-box">
                <span className="promo-code-label">{t.promo}:</span>
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
                <span>{t.minOrder}: {promo.minOrder} сом</span>
                {promo.category !== 'all' && <span className="promo-category-tag">{promo.category}</span>}
              </div>
              <button 
                className={`promo-activate-btn ${usedCodes.includes(promo.code) ? 'used' : ''}`}
                onClick={() => handleActivatePromo(promo.code)}
                disabled={usedCodes.includes(promo.code)}
              >
                {usedCodes.includes(promo.code) ? `✓ ${t.usedText}` : t.activate}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="promo-products-section">
        <h2><FaFire /> {t.productsOnSale}</h2>
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
                  <FaShoppingCart /> {t.addToCart}
                </button>
              </div>
            </div>
          ))}
          {saleProducts.length === 0 && (
            <div className="promo-empty-placeholder">
              <FaTag className="promo-empty-icon" />
              <p>{t.noProducts}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}