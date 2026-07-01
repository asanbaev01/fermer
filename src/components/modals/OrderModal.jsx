// components/modals/OrderModal.jsx
import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { FaTimes, FaShoppingBag, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaComment, FaCreditCard, FaUser, FaBox } from 'react-icons/fa'
import './Modal.css'

export default function OrderModal() {
  const {
    showOrder,
    setShowOrder,
    currentOrderProduct,
    orders,
    setOrders,
    currentUser,
    showToastMessage
  } = useContext(AppContext)

  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    quantity: '',
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

    if (!currentUser) {
      showToastMessage('Пожалуйста, войдите в систему!', 'error')
      return
    }

    if (!formData.address || !formData.phone || !formData.quantity || !formData.deliveryDate) {
      showToastMessage('Заполните все обязательные поля!', 'error')
      return
    }

    const newOrder = {
      id: Date.now(),
      productId: currentOrderProduct.id,
      productName: currentOrderProduct.name,
      farmerId: currentOrderProduct.farmerId,
      farmerName: currentOrderProduct.farmer,
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      address: formData.address,
      phone: formData.phone,
      quantity: parseInt(formData.quantity),
      deliveryDate: formData.deliveryDate,
      paymentMethod: formData.paymentMethod,
      comment: formData.comment || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    setOrders([newOrder, ...orders])
    setShowOrder(false)
    showToastMessage('Заказ успешно оформлен! 🎉', 'success')

    setFormData({
      address: '',
      phone: '',
      quantity: '',
      deliveryDate: '',
      paymentMethod: 'Наличные',
      comment: ''
    })
  }

  if (!showOrder || !currentOrderProduct) return null

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
          <div className="order-summary-title">📦 Информация о товаре</div>
          <div className="order-summary-item">
            <span className="label"><FaBox /> Товар:</span>
            <span className="value">{currentOrderProduct.image} {currentOrderProduct.name}</span>
          </div>
          <div className="order-summary-item">
            <span className="label">💰 Цена:</span>
            <span className="value">{currentOrderProduct.price} сом/{currentOrderProduct.unit}</span>
          </div>
          <div className="order-summary-item">
            <span className="label"><FaUser /> Продавец:</span>
            <span className="value">{currentOrderProduct.farmer}</span>
          </div>
          <div className="order-summary-item">
            <span className="label"><FaMapMarkerAlt /> Регион:</span>
            <span className="value">{currentOrderProduct.region}</span>
          </div>
          <div className="order-summary-item">
            <span className="label">📦 Доступно:</span>
            <span className="value">{currentOrderProduct.quantity} {currentOrderProduct.unit}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label><FaMapMarkerAlt /> Адрес доставки *</label>
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

          <div className="form-row">
            <div className="form-group">
              <label>📦 Количество *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Введите количество"
                required
                min="1"
                max={currentOrderProduct.quantity}
              />
            </div>
            <div className="form-group">
              <label><FaCalendarAlt /> Дата доставки *</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-group">
            <label><FaCreditCard /> Способ оплаты</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="Наличные">Наличные</option>
              <option value="Банковский перевод">Банковский перевод</option>
              <option value="Карта">Карта</option>
              <option value="Электронный кошелек">Электронный кошелек</option>
            </select>
          </div>

          <div className="form-group">
            <label><FaComment /> Комментарий к заказу</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Дополнительные пожелания..."
              rows="3"
            />
          </div>

          <div className="order-total">
            <span>Итого к оплате:</span>
            <span className="total-price">{currentOrderProduct.price * (parseInt(formData.quantity) || 0)} сом</span>
          </div>

          <button type="submit" className="btn-submit">
            <FaShoppingBag /> Подтвердить заказ
          </button>
        </form>
      </div>
    </div>
  )
}