import React, { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBox, FaClipboardList, FaUsers, FaGlobe, FaTag, FaShoppingBag,
  FaHeart, FaUser, FaMapMarkerAlt, FaStar, FaTruck, FaCalendarAlt,
  FaPhone, FaComment, FaPlus, FaLeaf, FaSearch, FaTrash, FaClock,
  FaTrophy, FaArrowRight, FaEye, FaFire, FaGift, FaMedal, FaHandshake,
  FaShieldAlt, FaAward, FaHeadset, FaQuoteLeft, FaQuoteRight,
  FaGem, FaRocket, FaCertificate, FaCloudSun, FaWater, FaTree,
  FaSun, FaRegClock, FaThumbsUp, FaCheckCircle, FaSmile,
  FaWhatsapp, FaInstagram, FaYoutube, FaFacebook, FaAppleAlt,
  FaCarrot, FaSeedling, FaFish, FaEgg, FaWineBottle
} from 'react-icons/fa'
import { BsFillHeartFill, BsFillStarFill, BsFillClockFill } from 'react-icons/bs'
import { IoIosArrowDown, IoIosArrowUp, IoIosTrendingUp } from 'react-icons/io'
import { AppContext } from '../../context/AppContext'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const {
    currentUser, products, requests, orders, favorites, users,
    selectedRegion, setSelectedRegion, searchTerm,
    selectedCategory, setSelectedCategory,
    priceFilter, setPriceFilter, sortBy, setSortBy,
    ratingFilter, setRatingFilter,
    showFilters, setShowFilters,
    activeTab, setActiveTab,
    setShowAddProduct,
    toggleFavorite, handleDeleteRequest,
    getTimeAgo, getCategoryEmoji, getRegionColor, getUrgencyEmoji,
    formatPrice, formatRating, categories
  } = useContext(AppContext)

  const [showAllProducts, setShowAllProducts] = useState(false)
  const [showAllRegions, setShowAllRegions] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animatedStats, setAnimatedStats] = useState(false)
  const [progress, setProgress] = useState(0)
  const statsRef = useRef(null)
  const slideInterval = useRef(null)
  const progressInterval = useRef(null)

  const regions = [
    'Баткенская область', 'Джалал-Абадская область',
    'Иссык-Кульская область', 'Нарынская область',
    'Ошская область', 'Таласская область', 'Чуйская область'
  ]

  const heroBanners = [
    { 
      icon: '🌾', 
      title: 'Фермерлерден түз', 
      desc: 'Эң сапаттуу азыктар', 
      tag: 'Таза продукция',
      color: '#f59e0b' 
    },
    { 
      icon: '🍎', 
      title: 'Таза продуктылар', 
      desc: 'Экологиялык таза', 
      tag: 'Органикалык',
      color: '#22c55e' 
    },
    { 
      icon: '🚜', 
      title: 'Тез жеткирүү', 
      desc: 'Бүт Кыргызстан боюнча', 
      tag: '24/7',
      color: '#3b82f6' 
    },
    { 
      icon: '💰', 
      title: 'Эң жакшы баалар', 
      desc: 'Түз баада, делдагы жок', 
      tag: 'Үнөмдүү',
      color: '#ec4899' 
    }
  ]

  const mainCategories = [
    { name: 'Жашылча', icon: <FaCarrot />, color: '#22c55e', count: products.filter(p => p.category === 'Жашылча').length },
    { name: 'Мөмө', icon: <FaAppleAlt />, color: '#ef4444', count: products.filter(p => p.category === 'Мөмө').length },
    { name: 'Дан', icon: <FaSeedling />, color: '#f59e0b', count: products.filter(p => p.category === 'Дан').length },
    { name: 'Сүт', icon: <FaEgg />, color: '#3b82f6', count: products.filter(p => p.category === 'Сүт').length },
    { name: 'Эт', icon: <FaFish />, color: '#dc2626', count: products.filter(p => p.category === 'Эт').length },
    { name: 'Бал', icon: <FaWineBottle />, color: '#fbbf24', count: products.filter(p => p.category === 'Бал').length }
  ]

  const filteredProducts = products
    .filter(p => selectedRegion === 'all' || p.region === selectedRegion)
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return p.name.toLowerCase().includes(search) || 
             p.farmer.toLowerCase().includes(search) || 
             p.description.toLowerCase().includes(search)
    })
    .filter(p => {
      if (!priceFilter.min && !priceFilter.max) return true
      const price = p.price
      if (priceFilter.min && price < parseFloat(priceFilter.min)) return false
      if (priceFilter.max && price > parseFloat(priceFilter.max)) return false
      return true
    })
    .filter(p => p.rating >= ratingFilter)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0)
      return 0
    })

  const filteredRequests = requests
    .filter(r => selectedRegion === 'all' || r.region === selectedRegion)
    .filter(r => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return r.title.toLowerCase().includes(search) || r.client.toLowerCase().includes(search)
    })

  const userProducts = products.filter(p => p.farmerId === currentUser?.id)
  const userOrders = orders.filter(o => o.buyerId === currentUser?.id || o.farmerId === currentUser?.id)
  const userFavorites = products.filter(p => favorites.includes(p.id))

  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 8)
  const displayRegions = showAllRegions ? regions : regions.slice(0, 5)
  const displayCategories = showAllCategories ? categories : categories?.slice(0, 10)

  const topRatedProducts = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4)
  const newProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)

  const heroStats = [
    { icon: <FaBox />, value: products.length, label: 'Товарлар', color: '#f59e0b' },
    { icon: <FaUsers />, value: users.length, label: 'Колдонуучулар', color: '#3b82f6' },
    { icon: <FaClipboardList />, value: requests.length, label: 'Сатып алуу', color: '#ec4899' },
    { icon: <FaGlobe />, value: regions.length, label: 'Областтар', color: '#22c55e' },
    { icon: <FaTag />, value: categories ? categories.length : 0, label: 'Категориялар', color: '#8b5cf6' },
    { icon: <FaHandshake />, value: orders.length, label: 'Бүтүмдөр', color: '#f472b6' }
  ]

  useEffect(() => {
    let progressValue = 0
    const slideDuration = 4000
    const intervalStep = 50
    
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroBanners.length)
      progressValue = 0
    }, slideDuration)

    progressInterval.current = setInterval(() => {
      progressValue += (intervalStep / slideDuration) * 100
      if (progressValue >= 100) {
        progressValue = 0
      }
      setProgress(progressValue)
    }, intervalStep)

    return () => {
      clearInterval(slideInterval.current)
      clearInterval(progressInterval.current)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimatedStats(true)
        }
      },
      { threshold: 0.2 }
    )
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const handleSlideClick = (index) => {
    setCurrentSlide(index)
    clearInterval(slideInterval.current)
    clearInterval(progressInterval.current)
    
    let progressValue = 0
    const slideDuration = 4000
    const intervalStep = 50
    
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroBanners.length)
      progressValue = 0
    }, slideDuration)

    progressInterval.current = setInterval(() => {
      progressValue += (intervalStep / slideDuration) * 100
      if (progressValue >= 100) {
        progressValue = 0
      }
      setProgress(progressValue)
    }, intervalStep)
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-banner-container">
          <div className="hero-banner-wrapper">
            {heroBanners.map((banner, index) => (
              <div
                key={index}
                className={`hero-banner-card ${index === currentSlide ? 'active' : ''}`}
                style={{ 
                  backgroundColor: banner.color + '08',
                  borderColor: banner.color + '30'
                }}
              >
                <div className="hero-banner-card-content">
                  <div className="hero-banner-card-icon" style={{ color: banner.color }}>
                    {banner.icon}
                  </div>
                  <div className="hero-banner-card-text">
                    <h3 style={{ color: banner.color }}>{banner.title}</h3>
                    <p>{banner.desc}</p>
                    <span className="hero-banner-card-tag" style={{ 
                      background: banner.color + '15', 
                      color: banner.color 
                    }}>
                      {banner.tag}
                    </span>
                  </div>
                  <div className="hero-banner-card-number">
                    <span>0{index + 1}</span>
                    <span>/ 0{heroBanners.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hero-banner-controls">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                className={`hero-banner-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => handleSlideClick(index)}
                style={{ 
                  background: index === currentSlide ? heroBanners[index].color : 'rgba(255,255,255,0.06)'
                }}
              />
            ))}
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge"><FaLeaf /> Кыргызстандын айыл чарба маркетплейси</span>
            <h1>AgroBazar</h1>
            <p className="hero-subtitle">Айыл чарба продуктыларын сатуу жана сатып алуу</p>
            <p className="hero-description">
              Фермерлерден түз, таза жана сапаттуу азыктарды табыңыз. 
              Биздин платформада 1000+ фермер жана 5000+ продукция
            </p>
            <div className="hero-buttons">
              <button className="hero-btn-primary" onClick={() => document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Товарларды көрүү <FaArrowRight />
              </button>
              {!currentUser ? (
                <button className="hero-btn-secondary" onClick={() => navigate('/login')}>
                  Кирүү
                </button>
              ) : (
                <button className="hero-btn-secondary" onClick={() => setShowAddProduct(true)}>
                  <FaPlus /> Товар кошуу
                </button>
              )}
            </div>
          </div>

          <div className="hero-stats" ref={statsRef}>
            {heroStats.map((stat, index) => (
              <div
                key={index}
                className={`hero-stat ${animatedStats ? 'animated' : ''}`}
                style={{ animationDelay: `${index * 0.08}s`, borderColor: stat.color + '30' }}
              >
                <span className="hero-stat-icon" style={{ background: stat.color + '15', color: stat.color }}>
                  {stat.icon}
                </span>
                <div>
                  <h3 className="stat-value" style={{ color: stat.color }}>
                    {animatedStats ? stat.value : '0'}
                  </h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="quick-action-btn" onClick={() => navigate('/discounts')}>
          <FaFire /> Арзандатуулар
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/leaderboard')}>
          <FaMedal /> Рейтинг
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/favorites')}>
          <FaHeart /> Избранное
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/cart')}>
          <FaShoppingBag /> Корзина
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/analytics')}>
          <IoIosTrendingUp /> Статистика
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/map')}>
          <FaMapMarkerAlt /> Карта
        </button>
      </div>

      {currentUser && (
        <div className="user-profile-bar">
          <div className="profile-info">
            <span className="profile-avatar">{currentUser.avatar || '🌾'}</span>
            <div className="profile-details">
              <span className="profile-name"><FaUser /> {currentUser.fullName}</span>
              <span className="profile-farm"><FaLeaf /> {currentUser.farmName}</span>
              <span className="profile-region"><FaMapMarkerAlt /> {currentUser.region}</span>
              <span className="profile-exp">
                <FaStar style={{ color: '#fbbf24' }} /> {formatRating(currentUser.rating || 0)}
                <FaTrophy style={{ color: '#f59e0b' }} /> {currentUser.experience || 'Опыт не указан'}
              </span>
            </div>
            <div className="profile-stats">
              <span className="profile-stat-item"><FaBox /> {userProducts.length}</span>
              <span className="profile-stat-item"><FaStar style={{ color: '#fbbf24' }} /> {formatRating(currentUser.rating || 0)}</span>
              <span className="profile-stat-item"><FaHeart style={{ color: '#dc2626' }} /> {favorites.length}</span>
              <span className="profile-stat-item"><FaShoppingBag /> {userOrders.length}</span>
            </div>
          </div>
        </div>
      )}

      <div className="categories-hero">
        <div className="categories-hero-header">
          <h2><FaTag /> Категориялар</h2>
          <span className="categories-count">{mainCategories.length} категория</span>
        </div>
        <div className="categories-hero-container">
          {mainCategories.map((cat, index) => (
            <button
              key={cat.name}
              className="category-hero-btn"
              onClick={() => setSelectedCategory(cat.name)}
              style={{ animationDelay: `${index * 0.05}s`, borderColor: cat.color + '40' }}
            >
              <span className="category-hero-icon" style={{ color: cat.color }}>{cat.icon}</span>
              <span className="category-hero-name">{cat.name}</span>
              <span className="category-hero-count" style={{ background: cat.color + '20', color: cat.color }}>{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="regions-bar">
        <div className="regions-header">
          <span><FaGlobe /> Региондор</span>
        </div>
        <div className="regions-container">
          <button className={`region-btn ${selectedRegion === 'all' ? 'active' : ''}`} onClick={() => setSelectedRegion('all')}>
            <FaGlobe /> Баардык региондор <span className="region-count">{products.length}</span>
          </button>
          {displayRegions.map(region => (
            <button key={region} className={`region-btn ${selectedRegion === region ? 'active' : ''}`} onClick={() => setSelectedRegion(region)}>
              <span className="region-dot" style={{ background: getRegionColor(region) }}></span>
              {region} <span className="region-count">{products.filter(p => p.region === region).length}</span>
            </button>
          ))}
          {regions.length > 5 && (
            <button className="region-btn show-more" onClick={() => setShowAllRegions(!showAllRegions)}>
              {showAllRegions ? 'Азыраак' : 'Дагы...'}
            </button>
          )}
        </div>
      </div>

      <div className="categories-bar">
        <div className="categories-header">
          <span><FaTag /> Категориялар</span>
        </div>
        <div className="categories-container">
          <button className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>
            <FaTag /> Бардык категориялар
          </button>
          {displayCategories?.map(category => (
            <button key={category} className={`category-btn ${selectedCategory === category ? 'active' : ''}`} onClick={() => setSelectedCategory(category)}>
              {getCategoryEmoji(category)} {category}
              <span className="category-count">{products.filter(p => p.category === category).length}</span>
            </button>
          ))}
          {categories?.length > 10 && (
            <button className="category-btn show-more" onClick={() => setShowAllCategories(!showAllCategories)}>
              {showAllCategories ? 'Азыраак' : 'Дагы...'}
            </button>
          )}
        </div>
      </div>

      <div className="filter-sort-bar">
        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? <IoIosArrowUp /> : <IoIosArrowDown />} {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </button>
        {showFilters && (
          <div className="filters">
            <div className="filter-group">
              <label><FaTag /> Баасы от</label>
              <input type="number" value={priceFilter.min} onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})} placeholder="0" />
            </div>
            <div className="filter-group">
              <label><FaTag /> Баасы до</label>
              <input type="number" value={priceFilter.max} onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})} placeholder="10000" />
            </div>
            <div className="filter-group">
              <label><FaStar /> Рейтинг</label>
              <select value={ratingFilter} onChange={(e) => setRatingFilter(parseFloat(e.target.value))}>
                <option value={0}>Баары</option>
                <option value={4}>4+ ⭐</option>
                <option value={4.5}>4.5+ ⭐</option>
                <option value={4.8}>4.8+ ⭐</option>
              </select>
            </div>
            <div className="filter-group">
              <label><IoIosTrendingUp /> Сортировка</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Жаңы</option>
                <option value="price_asc">Баасы ↑</option>
                <option value="price_desc">Баасы ↓</option>
                <option value="rating">Рейтинг</option>
                <option value="views">Көрүүлөр</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          <FaShoppingBag /> Товарлар <span className="tab-count">{filteredProducts.length}</span>
        </button>
        <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
          <FaClipboardList /> Сатып алуу <span className="tab-count">{filteredRequests.length}</span>
        </button>
        {currentUser && (
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <FaShoppingBag /> Заказдар <span className="tab-count">{userOrders.length}</span>
          </button>
        )}
        {currentUser && (
          <button className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
            <FaHeart /> Избранное <span className="tab-count">{favorites.length}</span>
          </button>
        )}
      </div>

      <div className="stats-section">
        {heroStats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.08}s` }}>
            <div className="stat-icon" style={{ color: stat.color, background: stat.color + '10' }}>{stat.icon}</div>
            <div className="stat-info"><h3>{stat.value}</h3><p>{stat.label}</p></div>
          </div>
        ))}
      </div>

      {activeTab === 'products' && (
        <div className="products-section">
          <div className="section-header">
            <h2><FaShoppingBag /> Товарлар</h2>
            <span className="section-count">{filteredProducts.length} товар</span>
          </div>
          <div className="products-grid">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`product-card ${favorites.includes(product.id) ? 'favorited' : ''}`}
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="product-image">
                    <span className="product-emoji">{product.image}</span>
                    {favorites.includes(product.id) && <span className="product-favorite-badge"><BsFillHeartFill /></span>}
                    {product.organic && <span className="organic-badge-small"><FaLeaf /></span>}
                    {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}
                    {product.isNew && <span className="new-badge">Жаңы</span>}
                  </div>
                  <div className="product-body">
                    <div className="product-header">
                      <h3>{product.name}</h3>
                      <span className="product-price">
                        {product.discount > 0 ? (
                          <>
                            <span className="old-price">{formatPrice(product.price)}</span>
                            <span className="new-price">{formatPrice(product.price * (1 - product.discount / 100))}</span>
                          </>
                        ) : (
                          <span>{formatPrice(product.price)} сом</span>
                        )}
                      </span>
                    </div>
                    <p className="product-description">{product.description.substring(0, 60)}...</p>
                    <div className="product-meta">
                      <span className="meta-item"><FaUser /> {product.farmer}</span>
                      <span className="meta-item"><FaMapMarkerAlt /> {product.region}</span>
                      <span className="meta-item"><FaStar style={{ color: '#fbbf24' }} /> {formatRating(product.rating || 0)}</span>
                      <span className="meta-item"><FaEye /> {product.views || 0}</span>
                    </div>
                    <div className="product-tags">
                      <span className="product-category">{product.category}</span>
                      <span className="product-date"><FaCalendarAlt /> {getTimeAgo(product.createdAt)}</span>
                      {product.organic && <span className="product-tag-organic"><FaLeaf /> Organic</span>}
                    </div>
                    <div className="product-actions">
                      <button 
                        className={`product-fav-btn ${favorites.includes(product.id) ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }}
                      >
                        <FaHeart />
                      </button>
                      <button className="product-view-btn" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`) }}>
                        <FaEye /> Көрүү
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><FaSearch /></span>
                <p>Товарлар табылган жок</p>
                <button className="btn-primary" onClick={() => setShowAddProduct(true)}>
                  <FaPlus /> Биринчи товарды кошуу
                </button>
              </div>
            )}
          </div>
          {filteredProducts.length > 8 && (
            <div className="show-more-container">
              <button className="show-more-btn" onClick={() => setShowAllProducts(!showAllProducts)}>
                {showAllProducts ? (
                  <>Азыраак көрсөтүү <IoIosArrowUp /></>
                ) : (
                  <>Посмотреть товар ({filteredProducts.length - 8}) <FaArrowRight /></>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="requests-section">
          <div className="section-header">
            <h2><FaClipboardList /> Сатып алуу жарыялары</h2>
            <span className="section-count">{filteredRequests.length} жарыя</span>
          </div>
          <div className="requests-grid">
            {filteredRequests.length > 0 ? (
              filteredRequests.slice(0, 6).map((request, index) => (
                <div key={request.id} className="request-card" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="request-header">
                    <div className="request-title">
                      <span className="request-urgency">{getUrgencyEmoji(request.urgency)}</span>
                      <h4>{request.title}</h4>
                    </div>
                    <span className="request-region"><FaMapMarkerAlt /> {request.region}</span>
                  </div>
                  <p className="request-description">{request.description}</p>
                  <div className="request-meta">
                    <span className="meta-item"><FaUser /> {request.client}</span>
                    <span className="meta-item"><FaPhone /> {request.phone}</span>
                    <span className="meta-item"><FaBox /> {request.quantity || 'Нет'}</span>
                    <span className="request-category">{request.category}</span>
                  </div>
                  {currentUser && currentUser.id === request.clientId && (
                    <button className="btn-delete" onClick={() => handleDeleteRequest(request.id)}><FaTrash /> Удалить</button>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon"><FaClipboardList /></span>
                <p>Сатып алуу жарыялары табылган жок</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && currentUser && (
        <div className="orders-section">
          <div className="section-header">
            <h2><FaShoppingBag /> Заказдар</h2>
            <span className="section-count">{userOrders.length} заказ</span>
          </div>
          <div className="orders-grid">
            {userOrders.length > 0 ? (
              userOrders.slice(0, 6).map((order, index) => (
                <div key={order.id} className="order-card" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="order-header">
                    <h4>{order.productName}</h4>
                    <span className={`order-status ${order.status}`}>
                      {order.status === 'pending' ? '⏳ Ожидает' : order.status === 'confirmed' ? '✅ Подтвержден' : '❌ Отменен'}
                    </span>
                  </div>
                  <div className="order-body">
                    <p><FaBox /> Количество: {order.quantity}</p>
                    <p><FaMapMarkerAlt /> Адрес: {order.address}</p>
                    <p><FaCalendarAlt /> Доставка: {order.deliveryDate}</p>
                    <p><FaTag /> Оплата: {order.paymentMethod}</p>
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
                <p>Заказдар жок</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'favorites' && currentUser && (
        <div className="favorites-section">
          <div className="section-header">
            <h2><FaHeart /> Избранное</h2>
            <span className="section-count">{userFavorites.length} товар</span>
          </div>
          <div className="products-grid">
            {userFavorites.length > 0 ? (
              userFavorites.slice(0, 8).map((product, index) => (
                <div key={product.id} className="product-card favorited" onClick={() => navigate(`/product/${product.id}`)} style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="product-image">
                    <span className="product-emoji">{product.image}</span>
                    <span className="product-favorite-badge"><BsFillHeartFill /></span>
                  </div>
                  <div className="product-body">
                    <div className="product-header">
                      <h3>{product.name}</h3>
                      <span className="product-price">{formatPrice(product.price)} сом</span>
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
                <p>Избранные товары жок</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="top-products-section">
        <div className="section-header">
          <h2><FaStar style={{ color: '#fbbf24' }} /> Эң жогорку рейтинг</h2>
          <span className="section-count">ТОП 4</span>
        </div>
        <div className="top-products-grid">
          {topRatedProducts.map((product, index) => (
            <div
              key={product.id}
              className="top-product-card"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="top-rank">{index + 1}</span>
              <span className="top-product-emoji">{product.image}</span>
              <div className="top-product-info">
                <h4>{product.name}</h4>
                <span className="top-product-rating">
                  <FaStar style={{ color: '#fbbf24' }} /> {formatRating(product.rating || 0)}
                </span>
                <span className="top-product-price">{formatPrice(product.price)} сом</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="new-products-section">
        <div className="section-header">
          <h2><FaRegClock /> Жаңы товарлар</h2>
          <span className="section-count">Акыркы кошулган</span>
        </div>
        <div className="new-products-grid">
          {newProducts.map((product, index) => (
            <div
              key={product.id}
              className="new-product-card"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="new-product-emoji">{product.image}</span>
              <div className="new-product-info">
                <h4>{product.name}</h4>
                <span className="new-product-price">{formatPrice(product.price)} сом</span>
                <span className="new-product-time"><FaClock /> {getTimeAgo(product.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <div className="features-header">
          <h2><FaAward /> Эмне үчүн AgroBazar?</h2>
          <p>Биздин артыкчылыктарыбыз</p>
        </div>
        <div className="features-container">
          <div className="feature-card">
            <span className="feature-icon"><FaShieldAlt /></span>
            <h4>Сапаттуу продукция</h4>
            <p>Текшерилген фермерлерден түз</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaTruck /></span>
            <h4>Тез жеткирүү</h4>
            <p>Бүт Кыргызстан боюнча</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaAward /></span>
            <h4>Эң жакшы баалар</h4>
            <p>Түз баада, делдагы жок</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaHeadset /></span>
            <h4>24/7 Колдоо</h4>
            <p>Каалаган убакта жардам</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaGem /></span>
            <h4>Премиум товарлар</h4>
            <p>Эң мыкты фермерлерден</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaRocket /></span>
            <h4>Тез сатуу</h4>
            <p>Бир нече мүнөттө сатыңыз</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaCertificate /></span>
            <h4>Сертификатталган</h4>
            <p>Сапат сертификаттары бар</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaCloudSun /></span>
            <h4>Экологиялык таза</h4>
            <p>Химиялык кошулмалар жок</p>
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <div className="testimonials-header">
          <h2><FaQuoteLeft /> Колдонуучулар эмне дейт?</h2>
          <p>Биздин платформа жөнүндө пикирлер</p>
        </div>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-stars"><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /></div>
            <p>"AgroBazar аркылуу продукциямды тез саттым. Супер сервис!"</p>
            <div className="testimonial-author">
              <span className="testimonial-avatar">👨‍🌾</span>
              <div>
                <strong>Бектур Асанов</strong>
                <span>Фермер, Ош</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars"><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /></div>
            <p>"Сапаттуу продуктылар, тез жеткирүү. Сунуштайм!"</p>
            <div className="testimonial-author">
              <span className="testimonial-avatar">👩‍🌾</span>
              <div>
                <strong>Айнура К.</strong>
                <span>Сатып алуучу, Бишкек</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars"><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /></div>
            <p>"Эң мыкты айыл чарба маркетплейси. Рахмат!"</p>
            <div className="testimonial-author">
              <span className="testimonial-avatar">👨‍🌾</span>
              <div>
                <strong>Нурлан Т.</strong>
                <span>Фермер, Чүй</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars"><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /><BsFillStarFill /></div>
            <p>"Достум сунуштады, азыр мен дагы колдонуп жатам. Отлично!"</p>
            <div className="testimonial-author">
              <span className="testimonial-avatar">👩‍🌾</span>
              <div>
                <strong>Гульнара М.</strong>
                <span>Сатып алуучу, Жалал-Абад</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <span className="cta-icon">🌾</span>
          <h2>AgroBazar менен бүгүн баштаңыз</h2>
          <p>Айыл чарба продуктыларын сатуу жана сатып алуу эч качан мынчалык оңой болгон эмес</p>
          <div className="cta-buttons">
            {currentUser ? (
              <button className="cta-btn-primary" onClick={() => setShowAddProduct(true)}>
                <FaPlus /> Товарды кошуу
              </button>
            ) : (
              <button className="cta-btn-primary" onClick={() => navigate('/login')}>
                Кирүү <FaArrowRight />
              </button>
            )}
            <button className="cta-btn-secondary" onClick={() => navigate('/discounts')}>
              <FaGift /> Арзандатууларды көрүү
            </button>
            <button className="cta-btn-secondary" onClick={() => navigate('/leaderboard')}>
              <FaMedal /> Рейтинг
            </button>
          </div>
        </div>
      </div>

      <div className="partners-section">
        <div className="partners-header">
          <h2><FaHandshake /> Биз менен иштегендер</h2>
          <p>Ишенимдүү өнөктөштөрүбүз</p>
        </div>
        <div className="partners-container">
          <span className="partner">🌾 Асан-Бакир ферма</span>
          <span className="partner">🌱 Таза Азык</span>
          <span className="partner">🍯 Бал-Ата</span>
          <span className="partner">🥛 Сүт-Кыргыз</span>
          <span className="partner">🥩 Эт-Базар</span>
          <span className="partner">🍎 Мөмө-Плюс</span>
          <span className="partner">🌿 Green Farm</span>
          <span className="partner">🍇 Виноград-Кыргыз</span>
        </div>
      </div>
    </div>
  )
}