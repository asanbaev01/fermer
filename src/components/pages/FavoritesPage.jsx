// components/pages/FavoritesPage.jsx
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaArrowLeft, FaTrash, FaShoppingBag } from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './FavoritesPage.css'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites, products, toggleFavorite, formatPrice, formatRating, addToCart } = useContext(AppContext)

  const favoriteProducts = products.filter(p => favorites.includes(p.id))

  if (favoriteProducts.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-empty">
          <FaHeart className="favorites-empty-icon" />
          <h2>Избранное пусто</h2>
          <p>Добавляйте товары в избранное, чтобы не потерять их</p>
          <button className="favorites-back-btn" onClick={() => navigate('/')}>
            <FaArrowLeft /> На главную
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <button className="favorites-back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Назад
        </button>
        <h1><FaHeart /> Избранное</h1>
        <span className="favorites-count">{favoriteProducts.length} товаров</span>
      </div>

      <div className="favorites-grid">
        {favoriteProducts.map(product => (
          <div key={product.id} className="favorites-card">
            <div className="favorites-card-image">
              <span className="favorites-card-emoji">{product.image}</span>
              <button 
                className="favorites-card-remove"
                onClick={() => toggleFavorite(product.id)}
              >
                <FaTrash />
              </button>
            </div>
            <div className="favorites-card-body">
              <h3 onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
              <p className="favorites-card-price">{formatPrice(product.price)} сом/{product.unit}</p>
              <div className="favorites-card-meta">
                <span><FaHeart /> {product.farmer}</span>
                <span>⭐ {formatRating(product.rating || 0)}</span>
              </div>
              <button 
                className="favorites-card-cart"
                onClick={() => {
                  addToCart(product.id)
                }}
              >
                <FaShoppingBag /> В корзину
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}