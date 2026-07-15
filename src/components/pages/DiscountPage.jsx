import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaTag, FaGift, FaClock, FaCopy, FaCheck, 
  FaFire, FaShoppingCart, FaStar, FaUser, FaMapMarkerAlt,
  FaCalendarAlt, FaPercent, FaTshirt, FaLeaf, FaAppleAlt,
  FaCarrot, FaSeedling, FaGem, FaMedal, FaTrophy, FaAward,
  FaCertificate, FaRocket, FaMagic, FaBolt, FaCrown, FaHeart,
  FaSearch, FaTimes, FaTh, FaList, FaShare
} from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './DiscountPage.css'

export default function DiscountPage() {
  const navigate = useNavigate()
  const { products, currentUser, showToastMessage, addToCart, language, formatPrice } = useContext(AppContext)
  const [copiedCode, setCopiedCode] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [usedCodes, setUsedCodes] = useState([])
  const [selectedPromo, setSelectedPromo] = useState(null)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [animatingCards, setAnimatingCards] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [activeFilter, setActiveFilter] = useState('all')
  const [countdowns, setCountdowns] = useState({})
  const [particles, setParticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const promoRefs = useRef({})

  useEffect(() => {
    const saved = localStorage.getItem('agrobazar_used_codes')
    if (saved) {
      try {
        setUsedCodes(JSON.parse(saved))
      } catch (e) {
        localStorage.removeItem('agrobazar_used_codes')
      }
    }
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('agrobazar_used_codes', JSON.stringify(usedCodes))
  }, [usedCodes])

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {}
      promoCodes.forEach(p => {
        const diff = new Date(p.expires) - new Date()
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          newCountdowns[p.id] = { days, hours, minutes, seconds }
        }
      })
      setCountdowns(newCountdowns)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const translations = {
    ky: {
      title: 'Арзандатуулар жана акциялар',
      back: 'Артка',
      all: 'Бардык',
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
      minOrder: 'Мин. заказ',
      days: 'күн',
      day: 'күн',
      week: 'жума',
      month: 'ай',
      lastDay: 'Акыркы күн!',
      expired: 'Бүткөн',
      addToCart: 'Себетке',
      search: 'Издөө...',
      sortNewest: 'Жаңы',
      sortPopular: 'Популярдуу',
      sortDiscount: 'Эң чоң арзандатуу',
      filterAll: 'Бардык категориялар',
      filterFood: 'Азык-түлүк',
      filterDrink: 'Сусун',
      filterOther: 'Башка',
      viewGrid: 'Тор',
      viewList: 'Тизме',
      share: 'Бөлүшүү',
      details: 'Толук маалымат',
      codeCopied: 'Код көчүрүлдү!',
      codeActivated: 'Код ийгиликтүү активацияланды! 🎉',
      alreadyUsed: 'Бул код буга чейин колдонулган',
      loginRequired: 'Кирүү керек',
      promoApplied: 'Арзандатуу колдонулду',
      limited: 'Чектелүү убакыт',
      exclusive: 'Эксклюзивдүү',
      hot: 'Ысык сунуш'
    },
    ru: {
      title: 'Скидки и акции',
      back: 'Назад',
      all: 'Все',
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
      day: 'день',
      week: 'недель',
      month: 'месяцев',
      lastDay: 'Последний день!',
      expired: 'Истек',
      addToCart: 'В корзину',
      search: 'Поиск...',
      sortNewest: 'Новые',
      sortPopular: 'Популярные',
      sortDiscount: 'Макс. скидка',
      filterAll: 'Все категории',
      filterFood: 'Продукты',
      filterDrink: 'Напитки',
      filterOther: 'Другое',
      viewGrid: 'Сетка',
      viewList: 'Список',
      share: 'Поделиться',
      details: 'Подробнее',
      codeCopied: 'Код скопирован!',
      codeActivated: 'Код успешно активирован! 🎉',
      alreadyUsed: 'Этот код уже использован',
      loginRequired: 'Войдите в систему',
      promoApplied: 'Скидка применена',
      limited: 'Ограниченное время',
      exclusive: 'Эксклюзивное',
      hot: 'Горячее предложение'
    },
    en: {
      title: 'Discounts and Promotions',
      back: 'Back',
      all: 'All',
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
      day: 'day',
      week: 'weeks',
      month: 'months',
      lastDay: 'Last day!',
      expired: 'Expired',
      addToCart: 'Add to Cart',
      search: 'Search...',
      sortNewest: 'Newest',
      sortPopular: 'Popular',
      sortDiscount: 'Biggest Discount',
      filterAll: 'All Categories',
      filterFood: 'Food',
      filterDrink: 'Drinks',
      filterOther: 'Other',
      viewGrid: 'Grid',
      viewList: 'List',
      share: 'Share',
      details: 'Details',
      codeCopied: 'Code copied!',
      codeActivated: 'Code activated successfully! 🎉',
      alreadyUsed: 'This code has been used',
      loginRequired: 'Login required',
      promoApplied: 'Discount applied',
      limited: 'Limited time',
      exclusive: 'Exclusive',
      hot: 'Hot offer'
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
      categoryType: 'food',
      minOrder: 500,
      maxDiscount: 1000,
      expires: '2026-12-31',
      description: {
        ky: 'Бардык товарларга 10% арзандатуу',
        ru: '10% скидка на все товары',
        en: '10% discount on all products'
      },
      icon: '🌾',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.08)',
      isHot: false,
      isExclusive: false,
      uses: 1542,
      rating: 4.8
    },
    {
      id: 2,
      code: 'SUMMER25',
      discount: 25,
      type: 'percent',
      category: 'Жашылча',
      categoryType: 'food',
      minOrder: 1000,
      maxDiscount: 2000,
      expires: '2026-08-31',
      description: {
        ky: 'Жашылчага 25% арзандатуу',
        ru: '25% скидка на овощи',
        en: '25% discount on vegetables'
      },
      icon: '🥬',
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.08)',
      isHot: true,
      isExclusive: false,
      uses: 876,
      rating: 4.9
    },
    {
      id: 3,
      code: 'FRUIT15',
      discount: 15,
      type: 'percent',
      category: 'Мөмө',
      categoryType: 'food',
      minOrder: 300,
      maxDiscount: 800,
      expires: '2026-09-30',
      description: {
        ky: 'Мөмөгө 15% арзандатуу',
        ru: '15% скидка на фрукты',
        en: '15% discount on fruits'
      },
      icon: '🍎',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.08)',
      isHot: false,
      isExclusive: false,
      uses: 2341,
      rating: 4.7
    },
    {
      id: 4,
      code: 'HONEY20',
      discount: 20,
      type: 'percent',
      category: 'Бал',
      categoryType: 'food',
      minOrder: 200,
      maxDiscount: 500,
      expires: '2026-12-31',
      description: {
        ky: 'Балга 20% арзандатуу',
        ru: '20% скидка на мед',
        en: '20% discount on honey'
      },
      icon: '🍯',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.08)',
      isHot: false,
      isExclusive: true,
      uses: 432,
      rating: 4.9
    },
    {
      id: 5,
      code: 'BIGSALE',
      discount: 500,
      type: 'fixed',
      category: 'all',
      categoryType: 'other',
      minOrder: 3000,
      maxDiscount: 500,
      expires: '2026-07-31',
      description: {
        ky: '3000 сомдон баштап 500 сом арзандатуу',
        ru: '500 сом скидка при заказе от 3000 сом',
        en: '500 som discount on orders over 3000 som'
      },
      icon: '💎',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.08)',
      isHot: true,
      isExclusive: false,
      uses: 324,
      rating: 4.6
    },
    {
      id: 6,
      code: 'MEAT30',
      discount: 30,
      type: 'percent',
      category: 'Эт',
      categoryType: 'food',
      minOrder: 1500,
      maxDiscount: 3000,
      expires: '2026-10-31',
      description: {
        ky: 'Этке 30% арзандатуу',
        ru: '30% скидка на мясо',
        en: '30% discount on meat'
      },
      icon: '🥩',
      color: '#dc2626',
      bgColor: 'rgba(220, 38, 38, 0.08)',
      isHot: true,
      isExclusive: true,
      uses: 654,
      rating: 4.8
    },
    {
      id: 7,
      code: 'MILK10',
      discount: 10,
      type: 'percent',
      category: 'Сүт',
      categoryType: 'food',
      minOrder: 200,
      maxDiscount: 300,
      expires: '2026-12-31',
      description: {
        ky: 'Сүт азыктарына 10% арзандатуу',
        ru: '10% скидка на молочные продукты',
        en: '10% discount on dairy products'
      },
      icon: '🥛',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.08)',
      isHot: false,
      isExclusive: false,
      uses: 987,
      rating: 4.5
    },
    {
      id: 8,
      code: 'NEWUSER50',
      discount: 50,
      type: 'fixed',
      category: 'all',
      categoryType: 'other',
      minOrder: 500,
      maxDiscount: 50,
      expires: '2026-12-31',
      description: {
        ky: 'Жаңы колдонуучуларга 50 сом арзандатуу',
        ru: '50 сом скидка для новых пользователей',
        en: '50 som discount for new users'
      },
      icon: '🎁',
      color: '#f472b6',
      bgColor: 'rgba(244, 114, 182, 0.08)',
      isHot: false,
      isExclusive: false,
      uses: 5432,
      rating: 4.9
    },
    {
      id: 9,
      code: 'VIP20',
      discount: 20,
      type: 'percent',
      category: 'all',
      categoryType: 'other',
      minOrder: 5000,
      maxDiscount: 5000,
      expires: '2026-06-30',
      description: {
        ky: 'VIP кардарларга 20% арзандатуу',
        ru: '20% скидка для VIP клиентов',
        en: '20% discount for VIP customers'
      },
      icon: '👑',
      color: '#fbbf24',
      bgColor: 'rgba(251, 191, 36, 0.08)',
      isHot: true,
      isExclusive: true,
      uses: 123,
      rating: 5.0
    },
    {
      id: 10,
      code: 'WEEKEND30',
      discount: 30,
      type: 'percent',
      category: 'all',
      categoryType: 'food',
      minOrder: 500,
      maxDiscount: 1500,
      expires: '2026-07-20',
      description: {
        ky: 'Дем алыш күндөрү 30% арзандатуу',
        ru: '30% скидка по выходным',
        en: '30% discount on weekends'
      },
      icon: '🎉',
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.08)',
      isHot: true,
      isExclusive: false,
      uses: 765,
      rating: 4.7
    }
  ]

  const getSaleProducts = () => {
    let filtered = products.filter(p => p.discount && p.discount > 0)
    if (activeTab === 'available') return filtered
    if (activeTab === 'used') return []
    return filtered
  }

  const getFilteredPromoCodes = () => {
    let filtered = promoCodes
    if (activeTab === 'available') {
      filtered = filtered.filter(d => !usedCodes.includes(d.code))
    } else if (activeTab === 'used') {
      filtered = filtered.filter(d => usedCodes.includes(d.code))
    }
    if (activeFilter !== 'all') {
      filtered = filtered.filter(d => d.categoryType === activeFilter)
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(d => 
        d.code.toLowerCase().includes(term) ||
        d.description[language]?.toLowerCase().includes(term) ||
        d.category?.toLowerCase().includes(term)
      )
    }
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.uses - a.uses)
    } else if (sortBy === 'discount') {
      filtered = [...filtered].sort((a, b) => b.discount - a.discount)
    }
    return filtered
  }

  const handleCopyPromo = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    showToastMessage(`${t.codeCopied} ${code}!`, 'success')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleActivatePromo = (code) => {
    if (!currentUser) {
      showToastMessage(t.loginRequired, 'error')
      return
    }
    if (usedCodes.includes(code)) {
      showToastMessage(t.alreadyUsed, 'error')
      return
    }
    setUsedCodes([...usedCodes, code])
    showToastMessage(t.codeActivated, 'success')
    createParticles()
  }

  const createParticles = () => {
    const newParticles = []
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 5,
        color: ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 5)],
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 0.5
      })
    }
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 3000)
  }

  const handleShare = (promo) => {
    const text = `${promo.description[language] || promo.description.ru}\nКод: ${promo.code}\n${t.discount}: ${promo.type === 'percent' ? promo.discount + '%' : promo.discount + ' сом'}`
    if (navigator.share) {
      navigator.share({ title: 'AgroBazar арзандатуу', text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      showToastMessage(t.codeCopied, 'success')
    }
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

  const getCategoryIcon = (category) => {
    const icons = {
      'Жашылча': <FaCarrot />,
      'Мөмө': <FaAppleAlt />,
      'Эт': <FaTshirt />,
      'Сүт': <FaSeedling />,
      'Бал': <FaLeaf />,
      'all': <FaTag />
    }
    return icons[category] || <FaTag />
  }

  const getCategoryLabel = (category) => {
    const labels = {
      'Жашылча': 'Овощи',
      'Мөмө': 'Фрукты',
      'Эт': 'Мясо',
      'Сүт': 'Молоко',
      'Бал': 'Мед',
      'all': 'Все'
    }
    return labels[category] || category
  }

  const formatCountdown = (countdown) => {
    if (!countdown) return ''
    const { days, hours, minutes, seconds } = countdown
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    return `${minutes}m ${seconds}s`
  }

  const saleProducts = getSaleProducts()
  const filteredPromoCodes = getFilteredPromoCodes()
  const hasActivePromos = filteredPromoCodes.some(p => !usedCodes.includes(p.code))

  if (isLoading) {
    return (
      <div className="promo-page">
        <div className="promo-loading">
          <div className="promo-loader">
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
            <div className="loader-ring"></div>
          </div>
          <p>Жүктөлүүдө...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="promo-page">
      <div className="promo-header">
        <button className="promo-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> {t.back}
        </button>
        <h1><FaTag className="header-icon" /> {t.title}</h1>
        <div className="header-right">
          <span className="promo-badge-count">{promoCodes.length}</span>
        </div>
      </div>

      <div className="promo-tabs-wrapper">
        <div className="promo-tabs">
          <button 
            className={`promo-tab ${activeTab === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveTab('all')}
          >
            <FaTag /> {t.all}
          </button>
          <button 
            className={`promo-tab ${activeTab === 'available' ? 'active' : ''}`} 
            onClick={() => setActiveTab('available')}
          >
            <FaGift /> {t.available}
            {hasActivePromos && <span className="tab-badge">{filteredPromoCodes.filter(p => !usedCodes.includes(p.code)).length}</span>}
          </button>
          <button 
            className={`promo-tab ${activeTab === 'used' ? 'active' : ''}`} 
            onClick={() => setActiveTab('used')}
          >
            <FaCheck /> {t.used}
          </button>
        </div>
      </div>

      <div className="promo-controls">
        <div className="promo-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="promo-search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>
              <FaTimes />
            </button>
          )}
        </div>
        <div className="promo-controls-right">
          <select className="promo-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">{t.sortNewest}</option>
            <option value="popular">{t.sortPopular}</option>
            <option value="discount">{t.sortDiscount}</option>
          </select>
          <select className="promo-filter" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
            <option value="all">{t.filterAll}</option>
            <option value="food">{t.filterFood}</option>
            <option value="drink">{t.filterDrink}</option>
            <option value="other">{t.filterOther}</option>
          </select>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FaTh />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      <div className="promo-stats">
        <div className="promo-stat-card" style={{ animationDelay: '0.1s' }}>
          <div className="promo-stat-icon"><FaTag /></div>
          <div className="promo-stat-info">
            <h3>{promoCodes.length}</h3>
            <p>{t.total}</p>
          </div>
        </div>
        <div className="promo-stat-card" style={{ animationDelay: '0.2s' }}>
          <div className="promo-stat-icon"><FaGift /></div>
          <div className="promo-stat-info">
            <h3>{promoCodes.filter(d => !usedCodes.includes(d.code)).length}</h3>
            <p>{t.availableCount}</p>
          </div>
        </div>
        <div className="promo-stat-card" style={{ animationDelay: '0.3s' }}>
          <div className="promo-stat-icon"><FaFire /></div>
          <div className="promo-stat-info">
            <h3>{products.filter(p => p.discount > 0).length}</h3>
            <p>{t.productsOnSale}</p>
          </div>
        </div>
        <div className="promo-stat-card" style={{ animationDelay: '0.4s' }}>
          <div className="promo-stat-icon"><FaStar /></div>
          <div className="promo-stat-info">
            <h3>{usedCodes.length}</h3>
            <p>{t.used}</p>
          </div>
        </div>
      </div>

      <div className={`promo-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
        {filteredPromoCodes.map((promo, index) => {
          const isUsed = usedCodes.includes(promo.code)
          const countdown = countdowns[promo.id]
          const isExpired = new Date(promo.expires) < new Date()
          
          return (
            <div 
              key={promo.id}
              ref={el => promoRefs.current[promo.id] = el}
              className={`promo-card ${isUsed ? 'used' : ''} ${isExpired ? 'expired' : ''} ${promo.isHot ? 'hot' : ''} ${promo.isExclusive ? 'exclusive' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onMouseEnter={() => setHoveredCard(promo.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="promo-card-head" style={{ 
                background: `linear-gradient(135deg, ${promo.color}20, ${promo.color}08)`,
                borderBottom: `2px solid ${promo.color}30`
              }}>
                <span className="promo-icon">{promo.icon}</span>
                <div className="promo-value-wrapper">
                  <span className="promo-value">
                    {promo.type === 'percent' ? `${promo.discount}%` : `${promo.discount} сом`}
                  </span>
                  {promo.isHot && <span className="promo-hot-badge"><FaFire /> {t.hot}</span>}
                  {promo.isExclusive && <span className="promo-exclusive-badge"><FaCrown /> {t.exclusive}</span>}
                </div>
                <span className="promo-badge">{t.discount}</span>
              </div>
              
              <div className="promo-card-body">
                <div className="promo-category-tag-wrapper">
                  {getCategoryIcon(promo.category)}
                  <span>{getCategoryLabel(promo.category)}</span>
                </div>
                
                <h3>{getDescription(promo)}</h3>
                
                <div className="promo-code-box">
                  <span className="promo-code-label">{t.promo}:</span>
                  <span className="promo-code-value">{promo.code}</span>
                  <button 
                    className={`promo-copy-btn ${copiedCode === promo.code ? 'copied' : ''}`}
                    onClick={() => handleCopyPromo(promo.code)}
                  >
                    {copiedCode === promo.code ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
                
                <div className="promo-details">
                  <span><FaClock /> 
                    {isExpired ? t.expired : 
                      countdown ? formatCountdown(countdown) : getRemainingTime(promo.expires)
                    }
                  </span>
                  <span>{t.minOrder}: {promo.minOrder} сом</span>
                  <span className="promo-rating">
                    <FaStar /> {promo.rating}
                  </span>
                </div>
                
                <div className="promo-actions">
                  <button 
                    className={`promo-activate-btn ${isUsed ? 'used' : ''}`}
                    onClick={() => handleActivatePromo(promo.code)}
                    disabled={isUsed || isExpired}
                  >
                    {isUsed ? <><FaCheck /> {t.usedText}</> : 
                     isExpired ? t.expired : 
                     <><FaMagic /> {t.activate}</>}
                  </button>
                  <button 
                    className="promo-share-btn"
                    onClick={() => handleShare(promo)}
                  >
                    <FaShare />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {filteredPromoCodes.length === 0 && (
          <div className="promo-empty">
            <FaGift className="promo-empty-icon" />
            <h3>{t.noProducts}</h3>
            <p>Жаңы арзандатуулар күтүңүз</p>
          </div>
        )}
      </div>

      {particles.length > 0 && (
        <div className="particles-container">
          {particles.map(p => (
            <div 
              key={p.id}
              className="particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
        </div>
      )}

      {showPromoModal && selectedPromo && (
        <div className="promo-modal" onClick={() => setShowPromoModal(false)}>
          <div className="promo-modal-content" onClick={e => e.stopPropagation()}>
            <button className="promo-modal-close" onClick={() => setShowPromoModal(false)}>
              <FaTimes />
            </button>
            <div className="promo-modal-head" style={{ backgroundColor: selectedPromo.color + '20' }}>
              <span className="promo-modal-icon">{selectedPromo.icon}</span>
              <h2>{getDescription(selectedPromo)}</h2>
            </div>
            <div className="promo-modal-body">
              <div className="promo-modal-detail">
                <span className="label">{t.promo}</span>
                <span className="value code">{selectedPromo.code}</span>
              </div>
              <div className="promo-modal-detail">
                <span className="label">{t.discount}</span>
                <span className="value">{selectedPromo.type === 'percent' ? `${selectedPromo.discount}%` : `${selectedPromo.discount} сом`}</span>
              </div>
              <div className="promo-modal-detail">
                <span className="label">{t.minOrder}</span>
                <span className="value">{selectedPromo.minOrder} сом</span>
              </div>
              <div className="promo-modal-detail">
                <span className="label">Категория</span>
                <span className="value">{getCategoryLabel(selectedPromo.category)}</span>
              </div>
              <div className="promo-modal-detail">
                <span className="label">Бүтөт</span>
                <span className="value">{new Date(selectedPromo.expires).toLocaleDateString()}</span>
              </div>
              <button 
                className={`promo-modal-activate ${usedCodes.includes(selectedPromo.code) ? 'used' : ''}`}
                onClick={() => {
                  handleActivatePromo(selectedPromo.code)
                  setShowPromoModal(false)
                }}
                disabled={usedCodes.includes(selectedPromo.code)}
              >
                {usedCodes.includes(selectedPromo.code) ? <><FaCheck /> {t.usedText}</> : t.activate}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}