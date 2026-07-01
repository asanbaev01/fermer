// components/modals/ReviewModal.jsx
import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { FaTimes, FaStar, FaComment } from 'react-icons/fa'
import './Modal.css'

export default function ReviewModal() {
  const {
    showReviewModal,
    setShowReviewModal,
    reviewProductId,
    comments,
    setComments,
    currentUser,
    showToastMessage
  } = useContext(AppContext)

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!currentUser) {
      showToastMessage('Пожалуйста, войдите в систему!', 'error')
      return
    }

    if (rating === 0) {
      showToastMessage('Пожалуйста, выберите оценку!', 'error')
      return
    }

    if (!text.trim()) {
      showToastMessage('Пожалуйста, напишите отзыв!', 'error')
      return
    }

    const newReview = {
      userId: currentUser.id,
      user: currentUser.fullName,
      rating: rating,
      text: text,
      date: new Date().toISOString().split('T')[0]
    }

    const productComments = comments[reviewProductId] || []
    setComments({
      ...comments,
      [reviewProductId]: [newReview, ...productComments]
    })

    setShowReviewModal(false)
    showToastMessage('Отзыв успешно добавлен! ⭐', 'success')

    setRating(0)
    setText('')
  }

  if (!showReviewModal) return null

  return (
    <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
      <div className="modal modal-review" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FaComment /> Оставить отзыв</h2>
          <button className="modal-close" onClick={() => setShowReviewModal(false)}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-section">
            <label>Оценка товара</label>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <FaStar />
                </button>
              ))}
              <span className="rating-text">
                {rating > 0 ? `${rating} из 5 ⭐` : 'Нажмите на звезду'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Ваш отзыв</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Поделитесь своим мнением о товаре..."
              rows="4"
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            <FaStar /> Отправить отзыв
          </button>
        </form>
      </div>
    </div>
  )
}