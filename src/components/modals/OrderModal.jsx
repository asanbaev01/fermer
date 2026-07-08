// components/modals/OrderModal.jsx
import React, { useContext, useState } from 'react'
import { FaTimes, FaMapMarkerAlt, FaPhone, FaShoppingBag, FaUser, FaBox, FaMapPin } from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './Modal.css'

export default function OrderModal() {
  const context = useContext(AppContext)

  if (!context) {
    return null
  }

  const {
    showOrder,
    setShowOrder,
    currentOrderProduct,
    formatPrice,
    showToastMessage,
    currentUser
  } = context

  const [formData, setFormData] = useState({
    address: '',
    phone: currentUser?.phone || '',
    deliveryDate: '',
    paymentMethod: 'Наличные',
    comment: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.address) {
      showToastMessage('Введите адрес доставки', 'error')
      return
    }
    if (!formData.phone) {
      showToastMessage('Введите номер телефона', 'error')
      return
    }
    showToastMessage('Заказ успешно оформлен! 🎉', 'success')
    setShowOrder(false)
    setFormData({
      address: '',
      phone: currentUser?.phone || '',
      deliveryDate: '',
      paymentMethod: 'Наличные',
      comment: ''
    })
  }

  if (!showOrder) return null

  const isMultiple = Array.isArray(currentOrderProduct)
  const products = isMultiple ? currentOrderProduct : [currentOrderProduct]
  const totalPrice = products.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)

  return (
    <div className="modal-overlay" onClick={() => setShowOrder(false)}>
      <div className="modal modal-order" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FaShoppingBag /> Оформление заказа</h2>
          <button className="modal-close" onClick={() => setShowOrder(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="order-summary">
          <div className="order-summary-title">Информация о товаре</div>
          {products.map((item, idx) => (
            <div key={idx} className="order-summary-item">
              <span className="label">{item.name}</span>
              <span className="value">{formatPrice(item.price)} сом/{item.unit} × {item.quantity || 1}</span>
            </div>
          ))}
          <div className="order-total">
            <span>Итого:</span>
            <span className="total-price">{formatPrice(totalPrice)} сом</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label><FaMapPin /> Адрес доставки *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Введите адрес доставки"
              required
            />
          </div>

          <div className="form-group">
            <label><FaPhone /> Номер телефона *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+996 700 123 456"
              required
            />
          </div>

          <div className="form-group">
            <label><FaMapMarkerAlt /> Дата доставки</label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><FaShoppingBag /> Способ оплаты</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="Наличные">Наличные</option>
              <option value="Карта">Карта</option>
              <option value="Банковский перевод">Банковский перевод</option>
            </select>
          </div>

          <div className="form-group">
            <label><FaUser /> Комментарий</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Дополнительные пожелания..."
              rows="2"
            />
          </div>

          <button type="submit" className="btn-submit">
            <FaShoppingBag /> Подтвердить заказ
          </button>
        </form>
      </div>
    </div>
  )
}