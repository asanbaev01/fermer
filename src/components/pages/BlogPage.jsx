// components/pages/BlogPage.jsx
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaNewspaper, FaSearch, FaUser, 
  FaCalendarAlt, FaTag, FaEye, FaHeart, FaComment,
  FaFire, FaClock
} from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './BlogPage.css'

export default function BlogPage() {
  const navigate = useNavigate()
  const { language } = useContext(AppContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const blogPosts = [
    {
      id: 1,
      title: {
        ky: 'Кыргызстанда органикалык алманы кантип өстүрүү керек',
        ru: 'Как вырастить органические яблоки в Кыргызстане',
        en: 'How to grow organic apples in Kyrgyzstan'
      },
      excerpt: {
        ky: 'Кыргызстандын шартында органикалык алма өстүрүү боюнча толук колдонмо. Тажрыйбалуу фермерлердин кеңештери...',
        ru: 'Полное руководство по выращиванию органических яблок в условиях Кыргызстана. Советы от опытных фермеров...',
        en: 'Complete guide to growing organic apples in Kyrgyzstan. Tips from experienced farmers...'
      },
      image: '🍎',
      category: {
        ky: 'Багбанчылык',
        ru: 'Садоводство',
        en: 'Gardening'
      },
      author: 'Асан Бакиров',
      date: '2026-07-01',
      readTime: {
        ky: '5 мүн',
        ru: '5 мин',
        en: '5 min'
      },
      views: 245,
      likes: 56,
      comments: 12,
      featured: true,
      tags: ['Яблоки', 'Органика', 'Садоводство']
    },
    {
      id: 2,
      title: {
        ky: 'Фермердик чарбада сугаруунун заманбап ыкмалары',
        ru: 'Современные методы полива в фермерстве',
        en: 'Modern irrigation methods in farming'
      },
      excerpt: {
        ky: 'Тамчылатып сугаруу системаларына жана алардын фермердик чарбалар үчүн артыкчылыктарына сереп...',
        ru: 'Обзор современных систем капельного полива и их преимущества для фермерских хозяйств...',
        en: 'Overview of modern drip irrigation systems and their benefits for farms...'
      },
      image: '💧',
      category: {
        ky: 'Технологиялар',
        ru: 'Технологии',
        en: 'Technologies'
      },
      author: 'Салима Исакова',
      date: '2026-06-28',
      readTime: {
        ky: '7 мүн',
        ru: '7 мин',
        en: '7 min'
      },
      views: 189,
      likes: 34,
      comments: 8,
      featured: false,
      tags: ['Полив', 'Технологии', 'Экономия']
    },
    {
      id: 3,
      title: {
        ky: 'Аарычылык: сапаттуу бал алуунун сырлары',
        ru: 'Пчеловодство: секреты получения качественного меда',
        en: 'Beekeeping: secrets of getting quality honey'
      },
      excerpt: {
        ky: 'Аарыны туура уюштуруу жана сапаттуу тоо балун кантип алуу керек...',
        ru: 'Как правильно организовать пасеку и получить высококачественный горный мед...',
        en: 'How to properly organize an apiary and get high-quality mountain honey...'
      },
      image: '🐝',
      category: {
        ky: 'Аарычылык',
        ru: 'Пчеловодство',
        en: 'Beekeeping'
      },
      author: 'Бакыт Джумалиев',
      date: '2026-06-25',
      readTime: {
        ky: '8 мүн',
        ru: '8 мин',
        en: '8 min'
      },
      views: 312,
      likes: 78,
      comments: 23,
      featured: true,
      tags: ['Мед', 'Пчелы', 'Горный мед']
    },
    {
      id: 4,
      title: {
        ky: 'Мал чарбасы: уйдун тукумун кантип тандоо керек',
        ru: 'Животноводство: как выбрать породу коров',
        en: 'Livestock: how to choose a breed of cows'
      },
      excerpt: {
        ky: 'Кыргызстанда багуу үчүн ири мүйүздүү малдын мыкты тукумдарына сереп...',
        ru: 'Обзор лучших пород крупного рогатого скота для выращивания в Кыргызстане...',
        en: 'Overview of the best cattle breeds for breeding in Kyrgyzstan...'
      },
      image: '🐄',
      category: {
        ky: 'Мал чарбасы',
        ru: 'Животноводство',
        en: 'Livestock'
      },
      author: 'Эрмек Кубанычбеков',
      date: '2026-06-22',
      readTime: {
        ky: '10 мүн',
        ru: '10 мин',
        en: '10 min'
      },
      views: 156,
      likes: 28,
      comments: 5,
      featured: false,
      tags: ['КРС', 'Породы', 'Животноводство']
    },
    {
      id: 5,
      title: {
        ky: 'Экологиялык таза азыктар: мифпи же чындыкпы?',
        ru: 'Экологически чистые продукты: миф или реальность?',
        en: 'Organic products: myth or reality?'
      },
      excerpt: {
        ky: 'Органикалык азыктарды жана алардын адамдын ден соолугуна тийгизген таасирин түшүнүү...',
        ru: 'Разбираемся в органических продуктах и их влиянии на здоровье человека...',
        en: 'Understanding organic products and their impact on human health...'
      },
      image: '🌿',
      category: {
        ky: 'Экология',
        ru: 'Экология',
        en: 'Ecology'
      },
      author: 'Айгуль Маматова',
      date: '2026-06-20',
      readTime: {
        ky: '6 мүн',
        ru: '6 мин',
        en: '6 min'
      },
      views: 423,
      likes: 95,
      comments: 31,
      featured: true,
      tags: ['Органика', 'Экология', 'Здоровье']
    },
    {
      id: 6,
      title: {
        ky: '2026-жылдагы түшүм: божомолдор жана кеңештер',
        ru: 'Урожай 2026: прогнозы и советы',
        en: 'Harvest 2026: forecasts and tips'
      },
      excerpt: {
        ky: 'Бул сезондо фермерлерди эмне күтүп турат. Аба ырайынын божомолдору жана эгиндерге кам көрүү боюнча кеңештер...',
        ru: 'Что ожидать фермерам в этом сезоне. Прогнозы погоды и советы по уходу за посевами...',
        en: 'What to expect for farmers this season. Weather forecasts and crop care tips...'
      },
      image: '🌾',
      category: {
        ky: 'Агрономия',
        ru: 'Агрономия',
        en: 'Agronomy'
      },
      author: 'Нурлан Турусбеков',
      date: '2026-06-18',
      readTime: {
        ky: '4 мүн',
        ru: '4 мин',
        en: '4 min'
      },
      views: 267,
      likes: 43,
      comments: 16,
      featured: false,
      tags: ['Урожай', 'Прогноз', 'Советы']
    }
  ]

  const categories = {
    ky: ['Баары', 'Багбанчылык', 'Технологиялар', 'Аарычылык', 'Мал чарбасы', 'Экология', 'Агрономия'],
    ru: ['Все', 'Садоводство', 'Технологии', 'Пчеловодство', 'Животноводство', 'Экология', 'Агрономия'],
    en: ['All', 'Gardening', 'Technologies', 'Beekeeping', 'Livestock', 'Ecology', 'Agronomy']
  }

  const translations = {
    ky: {
      title: 'Блог',
      back: 'Артка',
      search: 'Блогдон издөө...',
      featured: 'Тандалган макалалар',
      categories: 'Категориялар',
      all: 'Баары',
      noArticles: 'Макалалар табылган жок',
      readTime: 'оқуу',
      views: 'Көрүүлөр',
      likes: 'Жактыруулар',
      comments: 'Пикирлер'
    },
    ru: {
      title: 'Блог',
      back: 'Назад',
      search: 'Поиск по блогу...',
      featured: 'Избранные статьи',
      categories: 'Категории',
      all: 'Все',
      noArticles: 'Статьи не найдены',
      readTime: 'мин',
      views: 'Просмотров',
      likes: 'Лайков',
      comments: 'Комментариев'
    },
    en: {
      title: 'Blog',
      back: 'Back',
      search: 'Search blog...',
      featured: 'Featured Articles',
      categories: 'Categories',
      all: 'All',
      noArticles: 'No articles found',
      readTime: 'min',
      views: 'Views',
      likes: 'Likes',
      comments: 'Comments'
    }
  }

  const t = translations[language] || translations.ru

  const getCategoryDisplay = (categoryObj) => {
    return categoryObj[language] || categoryObj.ru
  }

  const getText = (obj) => {
    return obj[language] || obj.ru
  }

  const categoriesList = categories[language] || categories.ru

  const filteredPosts = blogPosts.filter(post => {
    const postTitle = getText(post.title).toLowerCase()
    const postExcerpt = getText(post.excerpt).toLowerCase()
    const matchSearch = postTitle.includes(searchTerm.toLowerCase()) ||
                        postExcerpt.includes(searchTerm.toLowerCase()) ||
                        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory === 'all' || getCategoryDisplay(post.category) === selectedCategory
    return matchSearch && matchCategory
  })

  const featuredPosts = blogPosts.filter(p => p.featured)

  return (
    <div className="blog-page">
      <div className="blog-header">
        <button className="blog-back" onClick={() => navigate('/')}>
          <FaArrowLeft /> {t.back}
        </button>
        <h1><FaNewspaper /> {t.title}</h1>
        <div className="blog-search">
          <FaSearch />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="blog-featured">
        <h2><FaFire /> {t.featured}</h2>
        <div className="featured-grid">
          {featuredPosts.map(post => (
            <div key={post.id} className="featured-card" onClick={() => {}}>
              <div className="featured-image">
                <span className="featured-emoji">{post.image}</span>
                <span className="featured-badge">{t.featured}</span>
              </div>
              <div className="featured-content">
                <span className="featured-category">{getCategoryDisplay(post.category)}</span>
                <h3>{getText(post.title)}</h3>
                <p>{getText(post.excerpt)}</p>
                <div className="featured-meta">
                  <span><FaUser /> {post.author}</span>
                  <span><FaCalendarAlt /> {post.date}</span>
                  <span><FaClock /> {getText(post.readTime)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="blog-categories">
        <h2><FaTag /> {t.categories}</h2>
        <div className="categories-list">
          <button 
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {t.all}
          </button>
          {categoriesList.filter(c => c !== t.all).map(cat => (
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
                <span className="post-category">{getCategoryDisplay(post.category)}</span>
                <span className="post-date"><FaCalendarAlt /> {post.date}</span>
              </div>
              <h3>{getText(post.title)}</h3>
              <p>{getText(post.excerpt)}</p>
              <div className="post-footer">
                <div className="post-author">
                  <FaUser /> {post.author}
                </div>
                <div className="post-stats">
                  <span><FaEye /> {t.views}: {post.views}</span>
                  <span><FaHeart /> {t.likes}: {post.likes}</span>
                  <span><FaComment /> {t.comments}: {post.comments}</span>
                  <span><FaClock /> {getText(post.readTime)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="blog-empty">
            <FaNewspaper className="empty-icon" />
            <p>{t.noArticles}</p>
          </div>
        )}
      </div>
    </div>
  )
}