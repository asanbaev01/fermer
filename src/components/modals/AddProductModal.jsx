// components/modals/AddProductModal.jsx
import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { FaTimes, FaPlus, FaTrash, FaLeaf } from 'react-icons/fa'
import './Modal.css'

export default function AddProductModal() {
  const {
    showAddProduct,
    setShowAddProduct,
    products,
    setProducts,
    currentUser,
    showToastMessage,
    categories
  } = useContext(AppContext)

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: 'кг',
    region: '',
    category: '',
    description: '',
    quantity: '',
    organic: false,
    deliveryAvailable: false,
    image: '🍎'
  })

  const emojis = ['🍎', '🥔', '🍐', '🥕', '🧅', '🧄', '🥬', '🍅', '🥒', '🍯', '🥩', '🥚', '🥛', '🧀', '🌱', '🌽', '🌾', '🚜', '💧', '🍇', '🍉', '🍓', '🍒', '🍑', '🥜']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!currentUser) {
      showToastMessage('Пожалуйста, войдите в систему!', 'error')
      return
    }

    if (!formData.name || !formData.price || !formData.region || !formData.category) {
      showToastMessage('Заполните все обязательные поля!', 'error')
      return
    }

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      price: parseFloat(formData.price),
      unit: formData.unit,
      region: formData.region,
      category: formData.category,
      description: formData.description || 'Качественный продукт',
      quantity: parseInt(formData.quantity) || 100,
      organic: formData.organic,
      deliveryAvailable: formData.deliveryAvailable,
      image: formData.image || '🍎',
      farmer: currentUser.fullName,
      farmerId: currentUser.id,
      phone: currentUser.phone,
      rating: 0,
      reviews: [],
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      minOrder: 1,
      maxOrder: 1000,
      storageCondition: 'Обычное',
      certification: formData.organic ? 'Органический' : '',
      coordinates: '',
      images: [],
      video: ''
    }

    setProducts([newProduct, ...products])
    setShowAddProduct(false)
    showToastMessage('Товар успешно добавлен! 🎉', 'success')

    setFormData({
      name: '',
      price: '',
      unit: 'кг',
      region: '',
      category: '',
      description: '',
      quantity: '',
      organic: false,
      deliveryAvailable: false,
      image: '🍎'
    })
  }

  if (!showAddProduct) return null

  return (
    <div className="modal-overlay" onClick={() => setShowAddProduct(false)}>
      <div className="modal modal-add-product" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FaPlus /> Добавить товар</h2>
          <button className="modal-close" onClick={() => setShowAddProduct(false)}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Название товара *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Например: Яблоки Гала"
                required
              />
            </div>
            <div className="form-group">
              <label>Цена *</label>
              <div className="price-input-group">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  step="0.1"
                />
                <span className="price-unit">сом</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Единица измерения</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                <option value="кг">кг</option>
                <option value="л">л</option>
                <option value="шт">шт</option>
                <option value="тонна">тонна</option>
                <option value="десяток">десяток</option>
              </select>
            </div>
            <div className="form-group">
              <label>Количество</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="100"
                min="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Регион *</label>
              <select name="region" value={formData.region} onChange={handleChange} required>
                <option value="">Выберите регион</option>
                <option value="Чуйская область">Чуйская область</option>
                <option value="Иссык-Кульская область">Иссык-Кульская область</option>
                <option value="Нарынская область">Нарынская область</option>
                <option value="Таласская область">Таласская область</option>
                <option value="Ошская область">Ошская область</option>
                <option value="Баткенская область">Баткенская область</option>
                <option value="Джалал-Абадская область">Джалал-Абадская область</option>
              </select>
            </div>
            <div className="form-group">
              <label>Категория *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите ваш товар..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Выберите иконку</label>
            <div className="emoji-grid">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`emoji-btn ${formData.image === emoji ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="organic"
                checked={formData.organic}
                onChange={handleChange}
              />
              <span><FaLeaf /> Органический продукт</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="deliveryAvailable"
                checked={formData.deliveryAvailable}
                onChange={handleChange}
              />
              <span>🚚 Доставка доступна</span>
            </label>
          </div>

          <button type="submit" className="btn-submit">
            <FaPlus /> Добавить товар
          </button>
        </form>
      </div>
    </div>
  )
}