// components/pages/CartPage.jsx
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingBag, FaUser } from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './CartPage.css'

export default function CartPage() {
  const navigate = useNavigate()
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const { 
    cart, 
    setCart, 
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    formatPrice, 
    showToastMessage,
    setShowOrder,
    setCurrentOrderProduct
  } = context

  const updateQuantity = (productId, change) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = (item.quantity || 1) + change
        if (newQuantity <= 0) return null
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean))
  }

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      showToastMessage('Корзина пуста', 'error')
      return
    }
    setCurrentOrderProduct(cart)
    setShowOrder(true)
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <FaShoppingCart className="cart-empty-icon" />
          <h2>Корзина пуста</h2>
          <p>Добавьте товары в корзину, чтобы оформить заказ</p>
          <button className="cart-back-btn" onClick={() => navigate('/')}>
            <FaArrowLeft /> На главную
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="cart-back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Назад
        </button>
        <h1><FaShoppingCart /> Корзина</h1>
        <button className="cart-clear-btn" onClick={clearCart}>
          <FaTrash /> Очистить
        </button>
      </div>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <span className="cart-item-emoji">{item.image}</span>
            </div>
            <div className="cart-item-info">
              <h3 onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
              <p className="cart-item-price">{formatPrice(item.price)} сом/{item.unit}</p>
              <p className="cart-item-farmer"><FaUser /> {item.farmer}</p>
            </div>
            <div className="cart-item-actions">
              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item.id, -1)}>
                  <FaMinus />
                </button>
                <span>{item.quantity || 1}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>
                  <FaPlus />
                </button>
              </div>
              <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Итого:</span>
          <span className="cart-total-price">{formatPrice(getCartTotal())} сом</span>
        </div>
        <button className="cart-checkout-btn" onClick={handleCheckout}>
          <FaShoppingBag /> Оформить заказ
        </button>
      </div>
    </div>
  )
}