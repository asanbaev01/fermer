// components/pages/LeaderboardPage.jsx
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrophy, FaStar, FaUser, FaArrowLeft, FaBox, FaHeart, FaShoppingBag, FaUsers } from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './LeaderboardPage.css'

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const { users, products, orders, favorites } = useContext(AppContext)
  const [filter, setFilter] = useState('all')

  const getTopFarmers = () => {
    const farmers = users.filter(u => u.role === 'Фермер' || u.role === 'Сатып алуучу')
    
    return farmers.map(user => {
      const userProducts = products.filter(p => p.farmerId === user.id)
      const userOrders = orders.filter(o => o.farmerId === user.id)
      const totalSales = userOrders.reduce((sum, o) => sum + (parseFloat(o.quantity) || 0), 0)
      const avgRating = userProducts.length > 0 
        ? userProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / userProducts.length 
        : 0
      
      return {
        ...user,
        productsCount: userProducts.length,
        ordersCount: userOrders.length,
        totalSales: totalSales,
        avgRating: avgRating
      }
    }).sort((a, b) => {
      if (filter === 'sales') return b.totalSales - a.totalSales
      if (filter === 'rating') return b.avgRating - a.avgRating
      if (filter === 'products') return b.productsCount - a.productsCount
      return (b.avgRating * 10 + b.totalSales) - (a.avgRating * 10 + a.totalSales)
    })
  }

  const topFarmers = getTopFarmers()
  const getMedalIcon = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}.`
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <button className="leaderboard-back" onClick={() => navigate('/')}>
          <FaArrowLeft /> Назад
        </button>
        <h1><FaTrophy /> Рейтинг фермеров</h1>
        <div className="leaderboard-filter">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Общий</button>
          <button className={`filter-btn ${filter === 'sales' ? 'active' : ''}`} onClick={() => setFilter('sales')}>По продажам</button>
          <button className={`filter-btn ${filter === 'rating' ? 'active' : ''}`} onClick={() => setFilter('rating')}>По рейтингу</button>
          <button className={`filter-btn ${filter === 'products' ? 'active' : ''}`} onClick={() => setFilter('products')}>По товарам</button>
        </div>
      </div>

      <div className="leaderboard-stats">
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-info"><h3>{users.length}</h3><p>Всего фермеров</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaBox /></div>
          <div className="stat-info"><h3>{products.length}</h3><p>Всего товаров</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaShoppingBag /></div>
          <div className="stat-info"><h3>{orders.length}</h3><p>Всего заказов</p></div>
        </div>
      </div>

      <div className="leaderboard-list">
        <div className="leaderboard-list-header">
          <span>Место</span>
          <span>Фермер</span>
          <span>Товары</span>
          <span>Продажи</span>
          <span>Рейтинг</span>
        </div>
        
        {topFarmers.map((farmer, index) => (
          <div key={farmer.id} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`} onClick={() => navigate(`/user/${farmer.id}`)}>
            <div className="leaderboard-rank">
              {index < 3 ? <span className="medal">{getMedalIcon(index)}</span> : <span className="rank-number">{index + 1}</span>}
            </div>
            <div className="leaderboard-user">
              <span className="user-avatar">{farmer.avatar || '🌾'}</span>
              <div className="user-info">
                <span className="user-name">{farmer.fullName}</span>
                <span className="user-farm">{farmer.farmName}</span>
              </div>
            </div>
            <div className="leaderboard-products"><FaBox /> {farmer.productsCount}</div>
            <div className="leaderboard-sales"><FaShoppingBag /> {farmer.totalSales}</div>
            <div className="leaderboard-rating"><FaStar style={{ color: '#f59e0b' }} /> {farmer.avgRating ? farmer.avgRating.toFixed(1) : '0.0'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}