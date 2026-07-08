// components/pages/BlogPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaNewspaper, FaSearch, FaUser, 
  FaCalendarAlt, FaTag, FaEye, FaHeart, FaComment,
  FaFire, FaClock
} from 'react-icons/fa'
import './BlogPage.css'

export default function BlogPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const blogPosts = [
    {
      id: 1,
      title: 'Как вырастить органические яблоки в Кыргызстане',
      excerpt: 'Полное руководство по выращиванию органических яблок в условиях Кыргызстана. Советы от опытных фермеров...',
      image: '🍎',
      category: 'Садоводство',
      author: 'Асан Бакиров',
      date: '2026-07-01',
      readTime: '5 мин',
      views: 245,
      likes: 56,
      comments: 12,
      featured: true,
      tags: ['Яблоки', 'Органика', 'Садоводство']
    },
    {
      id: 2,
      title: 'Современные методы полива в фермерстве',
      excerpt: 'Обзор современных систем капельного полива и их преимущества для фермерских хозяйств...',
      image: '💧',
      category: 'Технологии',
      author: 'Салима Исакова',
      date: '2026-06-28',
      readTime: '7 мин',
      views: 189,
      likes: 34,
      comments: 8,
      featured: false,
      tags: ['Полив', 'Технологии', 'Экономия']
    },
    {
      id: 3,
      title: 'Пчеловодство: секреты получения качественного меда',
      excerpt: 'Как правильно организовать пасеку и получить высококачественный горный мед...',
      image: '🐝',
      category: 'Пчеловодство',
      author: 'Бакыт Джумалиев',
      date: '2026-06-25',
      readTime: '8 мин',
      views: 312,
      likes: 78,
      comments: 23,
      featured: true,
      tags: ['Мед', 'Пчелы', 'Горный мед']
    },
    {
      id: 4,
      title: 'Животноводство: как выбрать породу коров',
      excerpt: 'Обзор лучших пород крупного рогатого скота для выращивания в Кыргызстане...',
      image: '🐄',
      category: 'Животноводство',
      author: 'Эрмек Кубанычбеков',
      date: '2026-06-22',
      readTime: '10 мин',
      views: 156,
      likes: 28,
      comments: 5,
      featured: false,
      tags: ['КРС', 'Породы', 'Животноводство']
    },
    {
      id: 5,
      title: 'Экологически чистые продукты: миф или реальность?',
      excerpt: 'Разбираемся в органических продуктах и их влиянии на здоровье человека...',
      image: '🌿',
      category: 'Экология',
      author: 'Айгуль Маматова',
      date: '2026-06-20',
      readTime: '6 мин',
      views: 423,
      likes: 95,
      comments: 31,
      featured: true,
      tags: ['Органика', 'Экология', 'Здоровье']
    },
    {
      id: 6,
      title: 'Урожай 2026: прогнозы и советы',
      excerpt: 'Что ожидать фермерам в этом сезоне. Прогнозы погоды и советы по уходу за посевами...',
      image: '🌾',
      category: 'Агрономия',
      author: 'Нурлан Турусбеков',
      date: '2026-06-18',
      readTime: '4 мин',
      views: 267,
      likes: 43,
      comments: 16,
      featured: false,
      tags: ['Урожай', 'Прогноз', 'Советы']
    }
  ]

  const categories = ['Все', 'Садоводство', 'Технологии', 'Пчеловодство', 'Животноводство', 'Экология', 'Агрономия']

  const filteredPosts = blogPosts.filter(post => {
    const matchSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchSearch && matchCategory
  })

  const featuredPosts = blogPosts.filter(p => p.featured)

  return (
    <div className="blog-page">
      <div className="blog-header">
        <button className="blog-back" onClick={() => navigate('/')}>
          <FaArrowLeft /> Назад
        </button>
        <h1><FaNewspaper /> Блог</h1>
        <div className="blog-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Поиск по блогу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="blog-featured">
        <h2><FaFire /> Избранные статьи</h2>
        <div className="featured-grid">
          {featuredPosts.map(post => (
            <div key={post.id} className="featured-card" onClick={() => {}}>
              <div className="featured-image">
                <span className="featured-emoji">{post.image}</span>
                <span className="featured-badge">Избранное</span>
              </div>
              <div className="featured-content">
                <span className="featured-category">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="featured-meta">
                  <span><FaUser /> {post.author}</span>
                  <span><FaCalendarAlt /> {post.date}</span>
                  <span><FaClock /> {post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="blog-categories">
        <h2><FaTag /> Категории</h2>
        <div className="categories-list">
          <button 
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Все
          </button>
          {categories.filter(c => c !== 'Все').map(cat => (
            <button 
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="blog-posts">
        {filteredPosts.map(post => (
          <div key={post.id} className="blog-post-card">
            <div className="post-image">
              <span className="post-emoji">{post.image}</span>
            </div>
            <div className="post-content">
              <div className="post-header">
                <span className="post-category">{post.category}</span>
                <span className="post-date"><FaCalendarAlt /> {post.date}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="post-footer">
                <div className="post-author">
                  <FaUser /> {post.author}
                </div>
                <div className="post-stats">
                  <span><FaEye /> {post.views}</span>
                  <span><FaHeart /> {post.likes}</span>
                  <span><FaComment /> {post.comments}</span>
                  <span><FaClock /> {post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="blog-empty">
            <FaNewspaper className="empty-icon" />
            <p>Статьи не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}