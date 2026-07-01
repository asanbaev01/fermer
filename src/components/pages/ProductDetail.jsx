// components/pages/ProductDetail.jsx
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaUser, FaMapMarkerAlt, FaPhone, FaBox,
  FaStar, FaTruck, FaLeaf, FaShoppingBag, FaHeart,
  FaComment, FaCalendarAlt, FaTrash, FaEdit, FaWhatsapp,
  FaTelegram, FaEnvelope
} from 'react-icons/fa'
import { BsFillHeartFill, BsHeart } from 'react-icons/bs'
import { AppContext } from '../../context/AppContext'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    currentUser, products, comments, favorites,
    setFavorites, setShowOrder, setCurrentOrderProduct,
    setShowReviewModal, setReviewProductId,
    handleDeleteProduct, showToastMessage,
    getTimeAgo, formatPrice, formatRating
  } = useContext(AppContext)

  const [product, setProduct] = useState(null)

  useEffect(() => {
    const found = products.find(p => p.id === parseInt(id))
    if (found) {
      setProduct(found)
    } else {
      navigate('/')
    }
  }, [id, products, navigate])

  const toggleFavorite = () => {
    if (!currentUser) {
      showToastMessage('Пожалуйста, войдите в систему!', 'error')
      return
    }
    if (favorites.includes(product.id)) {
      setFavorites(favorites.filter(fid => fid !== product.id))
      showToastMessage('Удалено из избранного', 'info')
    } else {
      setFavorites([...favorites, product.id])
      showToastMessage('Добавлено в избранное ❤️', 'success')
    }
  }

  const handleContact = (method) => {
    if (!currentUser) {
      showToastMessage('Пожалуйста, войдите в систему!', 'error')
      return
    }
    
    const phone = product.phone.replace(/\s/g, '')
    const message = `Здравствуйте! Меня интересует ваш товар: ${product.name}`
    
    switch(method) {
      case 'phone':
        window.location.href = `tel:${phone}`
        break
      case 'whatsapp':
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
        break
      case 'telegram':
        window.open(`https://t.me/${phone}`, '_blank')
        break
      case 'email':
        window.location.href = `mailto:${product.email || 'example@email.kg'}?subject=Вопрос о товаре ${product.name}&body=${encodeURIComponent(message)}`
        break
      default:
        window.location.href = `tel:${phone}`
    }
  }

  if (!product) return null

  return (
    <div className="product-detail-page">
      <button className="btn-back" onClick={() => navigate('/')}><FaArrowLeft /> Назад</button>
      <div className="product-detail">
        <div className="product-detail-image">
          <span className="product-detail-emoji">{product.image}</span>
          <div className="product-detail-badge">{product.category}</div>
          {product.organic && <div className="product-detail-organic"><FaLeaf /> Organic</div>}
        </div>
        <div className="product-detail-info">
          <div className="product-detail-header">
            <h1>{product.name}</h1>
            <div className="product-detail-price">{formatPrice(product.price)} сом/{product.unit}</div>
          </div>
          <div className="product-detail-meta">
            <div className="meta-item"><FaUser /> {product.farmer}</div>
            <div className="meta-item"><FaMapMarkerAlt /> {product.region}</div>
            <div className="meta-item"><FaPhone /> {product.phone}</div>
            <div className="meta-item"><FaBox /> {product.quantity} {product.unit}</div>
            <div className="meta-item"><FaStar /> {formatRating(product.rating || 0)}</div>
            {product.deliveryAvailable && <div className="meta-item"><FaTruck /> Доставка</div>}
            {product.organic && <div className="meta-item"><FaLeaf /> Органический</div>}
          </div>
          <div className="product-detail-description">
            <h3>Описание</h3>
            <p>{product.description}</p>
          </div>
          <div className="product-detail-actions">
            {currentUser && (
              <button className={`btn-favorite ${favorites.includes(product.id) ? 'active' : ''}`} onClick={toggleFavorite}>
                {favorites.includes(product.id) ? <BsFillHeartFill /> : <BsHeart />}
                {favorites.includes(product.id) ? ' В избранном' : ' В избранное'}
              </button>
            )}
            <div className="contact-buttons">
              <button className="btn-contact-phone" onClick={() => handleContact('phone')}>
                <FaPhone /> Позвонить
              </button>
              <button className="btn-contact-whatsapp" onClick={() => handleContact('whatsapp')}>
                <FaWhatsapp /> WhatsApp
              </button>
              <button className="btn-contact-telegram" onClick={() => handleContact('telegram')}>
                <FaTelegram /> Telegram
              </button>
            </div>
            <button className="btn-order" onClick={() => {
              if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return }
              setCurrentOrderProduct(product)
              setShowOrder(true)
            }}>
              <FaShoppingBag /> Заказать
            </button>
            <button className="btn-review" onClick={() => {
              if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return }
              setReviewProductId(product.id)
              setShowReviewModal(true)
            }}>
              <FaStar /> Оставить отзыв
            </button>
            {currentUser && currentUser.id === product.farmerId && (
              <button className="btn-delete" onClick={() => { handleDeleteProduct(product.id); navigate('/') }}>
                <FaTrash /> Удалить
              </button>
            )}
          </div>
          <div className="product-detail-reviews">
            <h3><FaComment /> Отзывы ({comments[product.id]?.length || 0})</h3>
            {comments[product.id] && comments[product.id].length > 0 ? (
              comments[product.id].map((comment, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header">
                    <span className="review-user"><FaUser /> {comment.user}</span>
                    <span className="review-rating">{'⭐'.repeat(Math.round(comment.rating))}</span>
                    <span className="review-date"><FaCalendarAlt /> {comment.date}</span>
                  </div>
                  <p className="review-text">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">Отзывов пока нет. Будьте первым!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}