// components/pages/HomePage.jsx
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBox, FaClipboardList, FaUsers, FaGlobe, FaTag, FaShoppingBag,
  FaHeart, FaUser, FaMapMarkerAlt, FaStar, FaTruck, FaCalendarAlt,
  FaPhone, FaComment, FaPlus, FaLeaf, FaSearch, FaTrash, FaClock, FaTrophy
} from 'react-icons/fa'
import { BsFillHeartFill } from 'react-icons/bs'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
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
    toggleFavorite, handleDeleteProduct, handleDeleteRequest,
    getTimeAgo, getCategoryEmoji, getRegionColor, getUrgencyEmoji,
    formatPrice, formatRating, categories
  } = useContext(AppContext)

  const regions = [
    'Баткенская область', 'Джалал-Абадская область',
    'Иссык-Кульская область', 'Нарынская область',
    'Ошская область', 'Таласская область', 'Чуйская область'
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

  return (
    <div className="home-page">
      {currentUser && (
        <div className="user-profile-bar">
          <div className="profile-info">
            <span className="profile-avatar">{currentUser.avatar || '🌾'}</span>
            <div className="profile-details">
              <span className="profile-name"><FaUser /> {currentUser.fullName}</span>
              <span className="profile-farm"><FaLeaf /> {currentUser.farmName}</span>
              <span className="profile-region"><FaMapMarkerAlt /> {currentUser.region}</span>
              <span className="profile-exp"><FaStar /> {formatRating(currentUser.rating || 0)} | <FaTrophy /> {currentUser.experience || 'Опыт не указан'}</span>
            </div>
            <div className="profile-stats">
              <span><FaBox /> {userProducts.length}</span>
              <span><FaStar /> {formatRating(currentUser.rating || 0)}</span>
              <span><FaHeart /> {favorites.length}</span>
              <span><FaShoppingBag /> {userOrders.length}</span>
            </div>
          </div>
        </div>
      )}

      <div className="regions-bar">
        <div className="regions-container">
          <button className={`region-btn ${selectedRegion === 'all' ? 'active' : ''}`} onClick={() => setSelectedRegion('all')}>
            <FaGlobe /> Баардык региондор <span className="region-count">{products.length}</span>
          </button>
          {regions.map(region => (
            <button key={region} className={`region-btn ${selectedRegion === region ? 'active' : ''}`} onClick={() => setSelectedRegion(region)}>
              <span className="region-dot" style={{ background: getRegionColor(region) }}></span>
              {region} <span className="region-count">{products.filter(p => p.region === region).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="categories-bar">
        <div className="categories-container">
          <button className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>
            <FaTag /> Бардык категориялар
          </button>
          {categories && categories.slice(0, 20).map(category => (
            <button key={category} className={`category-btn ${selectedCategory === category ? 'active' : ''}`} onClick={() => setSelectedCategory(category)}>
              {getCategoryEmoji(category)} {category}
              <span className="category-count">{products.filter(p => p.category === category).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-sort-bar">
        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? <IoIosArrowUp /> : <IoIosArrowDown />} {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </button>
        {showFilters && (
          <div className="filters">
            <div className="filter-group">
              <label>Баасы от</label>
              <input type="number" value={priceFilter.min} onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})} />
            </div>
            <div className="filter-group">
              <label>Баасы до</label>
              <input type="number" value={priceFilter.max} onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})} />
            </div>
            <div className="filter-group">
              <label>Рейтинг</label>
              <select value={ratingFilter} onChange={(e) => setRatingFilter(parseFloat(e.target.value))}>
                <option value={0}>Баары</option>
                <option value={4}>4+ ⭐</option>
                <option value={4.5}>4.5+ ⭐</option>
                <option value={4.8}>4.8+ ⭐</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Сортировка</label>
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
          <FaShoppingBag /> Товарлар ({filteredProducts.length})
        </button>
        <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
          <FaClipboardList /> Сатып алуу ({filteredRequests.length})
        </button>
        {currentUser && (
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <FaClipboardList /> Заказдар ({userOrders.length})
          </button>
        )}
        {currentUser && (
          <button className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
            <FaHeart /> Избранное ({favorites.length})
          </button>
        )}
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon"><FaBox /></div>
          <div className="stat-info"><h3>{products.length}</h3><p>Товарлар</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-info"><h3>{users.length}</h3><p>Колдонуучулар</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaClipboardList /></div>
          <div className="stat-info"><h3>{requests.length}</h3><p>Сатып алуу</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaGlobe /></div>
          <div className="stat-info"><h3>7</h3><p>Областтар</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaTag /></div>
          <div className="stat-info"><h3>{categories ? categories.length : 0}</h3><p>Категориялар</p></div>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="product-image">
                  <span className="product-emoji">{product.image}</span>
                  {favorites.includes(product.id) && <span className="product-favorite-badge"><BsFillHeartFill /></span>}
                  {product.organic && <span className="organic-badge-small"><FaLeaf /></span>}
                </div>
                <div className="product-body">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span className="product-price">{formatPrice(product.price)} сом/{product.unit}</span>
                  </div>
                  <p className="product-description">{product.description.substring(0, 80)}...</p>
                  <div className="product-meta">
                    <span className="meta-item"><FaUser /> {product.farmer}</span>
                    <span className="meta-item"><FaMapMarkerAlt /> {product.region}</span>
                    <span className="meta-item"><FaStar /> {formatRating(product.rating || 0)}</span>
                    {product.deliveryAvailable && <span className="meta-item"><FaTruck /></span>}
                  </div>
                  <div className="product-tags">
                    <span className="product-category">{product.category}</span>
                    <span className="product-date"><FaCalendarAlt /> {getTimeAgo(product.createdAt)}</span>
                    {product.organic && <span className="product-tag-organic"><FaLeaf /> Organic</span>}
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
      )}

      {activeTab === 'requests' && (
        <div className="requests-grid">
          {filteredRequests.length > 0 ? (
            filteredRequests.map(request => (
              <div key={request.id} className="request-card">
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
      )}

      {activeTab === 'orders' && currentUser && (
        <div className="orders-grid">
          {userOrders.length > 0 ? (
            userOrders.map(order => (
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
      )}

      {activeTab === 'favorites' && currentUser && (
        <div className="products-grid">
          {userFavorites.length > 0 ? (
            userFavorites.map(product => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="product-image">
                  <span className="product-emoji">{product.image}</span>
                  <span className="product-favorite-badge"><BsFillHeartFill /></span>
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
            ))
          ) : (
            <div className="empty-state">
              <span className="empty-icon"><FaHeart /></span>
              <p>Избранные товары жок</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}