import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Toast from '../common/Toast'
import LoginModal from '../modals/LoginModal'
import RegisterModal from '../modals/RegisterModal'
import ForgotPasswordModal from '../modals/ForgotPasswordModal'
import AddProductModal from '../modals/AddProductModal'
import OrderModal from '../modals/OrderModal'
import ReviewModal from '../modals/ReviewModal'
import InstallPrompt from '../common/InstallPrompt'
import { AppContext } from '../../context/AppContext'
import './MainLayout.css'

export default function MainLayout() {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [requests, setRequests] = useState([])
  const [orders, setOrders] = useState([])
  const [messages, setMessages] = useState({})
  const [comments, setComments] = useState({})
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('agrobazar_cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {
        localStorage.removeItem('agrobazar_cart')
      }
    }
    return []
  })
  const [notifications, setNotifications] = useState([])
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('newest')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddRequest, setShowAddRequest] = useState(false)
  const [showOrder, setShowOrder] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentOrderProduct, setCurrentOrderProduct] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewProductId, setReviewProductId] = useState(null)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState({
    username: '', password: '', fullName: '', phone: '', region: '',
    district: '', village: '', farmName: '', farmType: '', email: '',
    bio: '', avatar: '🌾', experience: '', education: '', website: '',
    socialMedia: { instagram: '', facebook: '', youtube: '' },
    role: 'Фермер', document: '', inn: ''
  })
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', wholesalePrices: [], region: '', district: '',
    category: '', description: '', quantity: '', unit: 'кг',
    harvestDate: '', storageCondition: '', deliveryAvailable: false,
    organic: false, certification: '', minOrder: '', maxOrder: '',
    coordinates: '', images: [], video: ''
  })
  const [newRequest, setNewRequest] = useState({
    title: '', description: '', region: '', district: '',
    category: '', urgency: 'normal', budget: '', deadline: '',
    quantity: '', unit: 'кг', contactMethod: 'phone'
  })
  const [newOrder, setNewOrder] = useState({
    address: '', phone: '', quantity: '', deliveryDate: '',
    paymentMethod: 'Наличные', comment: ''
  })
  const [editUserData, setEditUserData] = useState({})
  const [forgotPasswordData, setForgotPasswordData] = useState({
    step: 1,
    email: '',
    code: '',
    verified: false
  })

  const categories = [
    'Жашылча', 'Мөмө', 'Дан', 'Сүт', 'Эт', 'Тоок', 'Жумуртка',
    'Бал', 'Тоют', 'Жем', 'Жер семирткич', 'Үрөн', 'Техника',
    'Трактор', 'Комбайн', 'Тамчылатып сугаруу', 'Күнөскана',
    'Мал', 'Кой', 'Уй', 'Жылкы', 'Эчки', 'Балык'
  ]

  const generateInitialProducts = () => {
    const allProducts = []
    const regions = [
      'Чуйская область', 'Иссык-Кульская область', 'Нарынская область',
      'Таласская область', 'Ошская область', 'Баткенская область', 'Джалал-Абадская область'
    ]
    const farmers = [
      'Асан Бакиров', 'Салима Исакова', 'Бакыт Джумалиев',
      'Эрмек Кубанычбеков', 'Айгуль Маматова', 'Нурлан Турусбеков',
      'Марат Султанов', 'Гульмира Абдылдаева', 'Талгарбек Карабаев',
      'Айнура Сатыбалдиева', 'Бектур Асанов', 'Жылдыз Ибраимова'
    ]
    const productNames = [
      'Яблоки Ажы', 'Яблоки Гала', 'Груши Конференция', 'Картофель', 'Морковь',
      'Лук', 'Чеснок', 'Капуста', 'Помидоры', 'Огурцы', 'Перец сладкий',
      'Баклажаны', 'Тыква', 'Кабачки', 'Свекла', 'Редис', 'Зелень',
      'Мед горный', 'Мед цветочный', 'Говядина', 'Баранина', 'Куриное мясо',
      'Яйца куриные', 'Молоко коровье', 'Молоко козье', 'Творог', 'Сметана',
      'Саженцы яблони', 'Саженцы груши', 'Кукуруза кормовая', 'Сено', 'Комбикорм',
      'Семена пшеницы', 'Семена ячменя', 'Трактор МТЗ-80', 'Трактор Беларус',
      'Система капельного полива', 'Теплица', 'Виноград', 'Арбузы', 'Дыни',
      'Клубника', 'Малина', 'Смородина', 'Вишня', 'Абрикосы', 'Персики',
      'Сливы', 'Черешня', 'Грецкий орех', 'Фисташки', 'Миндаль'
    ]
    const descriptions = [
      'Экологически чистый продукт выращенный в лучших условиях',
      'Высококачественный продукт с богатым вкусом',
      'Свежий и натуральный продукт прямо с поля',
      'Отборный продукт высшего качества',
      'Натуральный продукт без химикатов и ГМО'
    ]

    for (let i = 0; i < 60; i++) {
      const region = regions[i % regions.length]
      const farmer = farmers[i % farmers.length]
      const farmerId = (i % 12) + 1
      const name = productNames[i % productNames.length]
      const price = Math.round((20 + Math.random() * 500) * 10) / 10
      const unit = ['кг', 'л', 'шт', 'тонна', 'десяток'][i % 5]
      const category = categories[i % categories.length]
      const organic = Math.random() > 0.5
      const rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10

      const harvestDate = new Date()
      harvestDate.setDate(harvestDate.getDate() - Math.floor(Math.random() * 60))

      allProducts.push({
        id: i + 1,
        name: name,
        price: price,
        unit: unit,
        region: region,
        district: '',
        farmer: farmer,
        farmerId: farmerId,
        phone: '+996 700 ' + String(100000 + Math.floor(Math.random() * 900000)),
        description: descriptions[i % descriptions.length] + '. ' + name + ' высокого качества.',
        category: category,
        image: ['🍎', '🥔', '🍐', '🥕', '🧅', '🧄', '🥬', '🍅', '🥒', '🍯', '🥩', '🥚', '🥛', '🧀', '🌱', '🌽', '🌾', '🚜', '💧', '🍇', '🍉', '🍓', '🍒', '🍑', '🥜'][i % 25],
        quantity: Math.floor(Math.random() * 500) + 50,
        minOrder: 1,
        maxOrder: 1000,
        createdAt: harvestDate.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 200) + 20,
        rating: rating,
        reviews: [],
        harvestDate: harvestDate.toISOString().split('T')[0],
        storageCondition: ['Обычное', 'Холодильник', 'Сухое место', 'Погреб', 'Морозильник'][i % 5],
        deliveryAvailable: Math.random() > 0.3,
        organic: organic,
        certification: organic ? 'Органический' : '',
        coordinates: '42.8756, 74.5698',
        images: [],
        video: ''
      })
    }

    return allProducts
  }

  useEffect(() => {
    const savedUsers = localStorage.getItem('agrobazar_users')
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      const defaultUsers = [
        { id: 1, username: 'asan', password: '123456', fullName: 'Асан Бакиров', phone: '+996 700 123 456', region: 'Чуйская область', district: 'Сокулук', village: 'Сокулук', farmName: 'Асан-Бакир ферма', farmType: 'Садоводство', email: 'asan@email.kg', bio: 'Опытный фермер, выращиваю яблоки и груши более 10 лет.', createdAt: '2024-01-15', rating: 4.9, productsCount: 0, avatar: '🍎', experience: '10 лет', education: 'Аграрный университет', website: 'https://asanfarmer.kg', role: 'Фермер', socialMedia: { instagram: '@asanfarmer', facebook: 'asanfarmer', youtube: '' }, reviews: [{ user: 'Айгуль', text: 'Отличные яблоки!', rating: 5 }] },
        { id: 2, username: 'salima', password: '123456', fullName: 'Салима Исакова', phone: '+996 550 987 654', region: 'Иссык-Кульская область', district: 'Түп', village: 'Түп', farmName: 'Иссык-Куль Агро', farmType: 'Овощеводство', email: 'salima@email.kg', bio: 'Выращиваю экологически чистые овощи на берегу Иссык-Куля.', createdAt: '2024-02-20', rating: 4.8, productsCount: 0, avatar: '🥕', experience: '8 лет', education: 'Сельхозтехникум', website: 'https://issykagro.kg', role: 'Фермер', socialMedia: { instagram: '@issykagro', facebook: 'issykagro', youtube: '' }, reviews: [{ user: 'Нурлан', text: 'Картофель отличный!', rating: 5 }] },
        { id: 3, username: 'baky', password: '123456', fullName: 'Бакыт Джумалиев', phone: '+996 770 456 789', region: 'Нарынская область', district: 'Ак-Талаа', village: 'Баетово', farmName: 'Нарын Бал', farmType: 'Пчеловодство', email: 'baky@email.kg', bio: 'Профессиональный пчеловод, занимаюсь горным медом более 15 лет.', createdAt: '2024-03-10', rating: 4.9, productsCount: 0, avatar: '🐝', experience: '15 лет', education: 'Пчеловодческие курсы', website: 'https://narynbal.kg', role: 'Фермер', socialMedia: { instagram: '@narynbal', facebook: 'narynbal', youtube: '' }, reviews: [{ user: 'Эрмек', text: 'Лучший мед!', rating: 5 }] },
        { id: 4, username: 'ermek', password: '123456', fullName: 'Эрмек Кубанычбеков', phone: '+996 555 321 987', region: 'Таласская область', district: 'Талас', village: 'Талас', farmName: 'Талас Эт', farmType: 'Животноводство', email: 'ermek@email.kg', bio: 'Занимаюсь разведением крупного рогатого скота.', createdAt: '2024-04-05', rating: 4.7, productsCount: 0, avatar: '🐄', experience: '12 лет', education: 'Ветеринарный институт', website: 'https://talaset.kg', role: 'Фермер', socialMedia: { instagram: '@talaset', facebook: 'talaset', youtube: '' }, reviews: [] },
        { id: 5, username: 'aigul', password: '123456', fullName: 'Айгуль Маматова', phone: '+996 702 234 567', region: 'Ошская область', district: 'Кара-Суу', village: 'Кара-Суу', farmName: 'Ош Саженцы', farmType: 'Садоводство', email: 'aigul@email.kg', bio: 'Выращиваю качественные саженцы фруктовых деревьев.', createdAt: '2024-05-01', rating: 4.8, productsCount: 0, avatar: '🌱', experience: '7 лет', education: 'Аграрный колледж', website: 'https://oshsaj.kg', role: 'Фермер', socialMedia: { instagram: '@oshsaj', facebook: 'oshsaj', youtube: '' }, reviews: [] },
        { id: 6, username: 'nurlan', password: '123456', fullName: 'Нурлан Турусбеков', phone: '+996 550 111 222', region: 'Ошская область', district: 'Өзгөн', village: 'Өзгөн', farmName: 'Нур Агро', farmType: 'Тепличное хозяйство', email: 'nurlan@email.kg', bio: 'Выращиваю свежие овощи в теплицах круглый год.', createdAt: '2024-08-01', rating: 4.6, productsCount: 0, avatar: '🍅', experience: '5 лет', education: 'Аграрный колледж', website: '', role: 'Сатып алуучу', socialMedia: { instagram: '@nurlagro', facebook: '', youtube: '' }, reviews: [] }
      ]
      setUsers(defaultUsers)
      localStorage.setItem('agrobazar_users', JSON.stringify(defaultUsers))
    }

    const savedProducts = localStorage.getItem('agrobazar_products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const initialProducts = generateInitialProducts()
      setProducts(initialProducts)
      localStorage.setItem('agrobazar_products', JSON.stringify(initialProducts))
    }

    const savedRequests = localStorage.getItem('agrobazar_requests')
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests))
    }

    const savedOrders = localStorage.getItem('agrobazar_orders')
    if (savedOrders) setOrders(JSON.parse(savedOrders))

    const savedFavorites = localStorage.getItem('agrobazar_favorites')
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))

    const savedComments = localStorage.getItem('agrobazar_comments')
    if (savedComments) setComments(JSON.parse(savedComments))

    const savedMessages = localStorage.getItem('agrobazar_messages')
    if (savedMessages) setMessages(JSON.parse(savedMessages))

    const savedNotifications = localStorage.getItem('agrobazar_notifications')
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications))

    const savedUser = localStorage.getItem('agrobazar_user')
    if (savedUser) setCurrentUser(JSON.parse(savedUser))
  }, [])

  useEffect(() => {
    if (users.length > 0) localStorage.setItem('agrobazar_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('agrobazar_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (requests.length > 0) localStorage.setItem('agrobazar_requests', JSON.stringify(requests))
  }, [requests])

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('agrobazar_orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    if (favorites.length > 0) localStorage.setItem('agrobazar_favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('agrobazar_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (Object.keys(comments).length > 0) localStorage.setItem('agrobazar_comments', JSON.stringify(comments))
  }, [comments])

  useEffect(() => {
    if (Object.keys(messages).length > 0) localStorage.setItem('agrobazar_messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (notifications.length > 0) localStorage.setItem('agrobazar_notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agrobazar_user', JSON.stringify(currentUser))
      const userProducts = products.filter(p => p.farmerId === currentUser.id)
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) return { ...u, productsCount: userProducts.length }
        return u
      })
      setUsers(updatedUsers)
    }
  }, [products, currentUser])

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const getTimeAgo = (date) => {
    const diff = new Date() - new Date(date)
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'сегодня'
    if (days === 1) return 'вчера'
    if (days < 7) return `${days} дня назад`
    if (days < 30) return `${Math.floor(days / 7)} недель назад`
    if (days < 365) return `${Math.floor(days / 30)} месяцев назад`
    return `${Math.floor(days / 365)} лет назад`
  }

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Жашылча': '🥔', 'Мөмө': '🍎', 'Дан': '🌾', 'Сүт': '🥛',
      'Эт': '🥩', 'Тоок': '🐔', 'Жумуртка': '🥚', 'Бал': '🍯',
      'Тоют': '🌽', 'Жем': '🌾', 'Жер семирткич': '🧪', 'Үрөн': '🌰',
      'Техника': '🚜', 'Трактор': '🚜', 'Комбайн': '🚜',
      'Тамчылатып сугаруу': '💧', 'Күнөскана': '🏠',
      'Мал': '🐄', 'Кой': '🐑', 'Уй': '🐄', 'Жылкы': '🐴',
      'Эчки': '🐐', 'Балык': '🐟'
    }
    return emojis[category] || '🌾'
  }

  const getRegionColor = (region) => {
    const colors = {
      'Баткенская область': '#FF6B6B',
      'Джалал-Абадская область': '#4ECDC4',
      'Иссык-Кульская область': '#45B7D1',
      'Нарынская область': '#96CEB4',
      'Ошская область': '#FFD93D',
      'Таласская область': '#6C5CE7',
      'Чуйская область': '#A8E6CF'
    }
    return colors[region] || '#95A5A6'
  }

  const getUrgencyEmoji = (urgency) => {
    const emojis = { 'high': '🔴', 'medium': '🟡', 'normal': '🟢' }
    return emojis[urgency] || '🟢'
  }

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0'
    return Number(price).toFixed(1)
  }

  const formatRating = (rating) => {
    if (rating === undefined || rating === null) return '0'
    return Number(rating).toFixed(1)
  }

  const toggleFavorite = (productId) => {
    if (!currentUser) {
      showToastMessage('Пожалуйста, войдите в систему!', 'error')
      return
    }
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId))
      showToastMessage('Удалено из избранного', 'info')
    } else {
      setFavorites([...favorites, productId])
      showToastMessage('Добавлено в избранное ❤️', 'success')
    }
  }

  const addToCart = (productId) => {
    if (!currentUser) {
      showToastMessage('Сначала войдите в систему', 'info')
      setShowLogin(true)
      return
    }
    const product = products.find(p => p.id === productId)
    if (!product) {
      showToastMessage('Товар не найден', 'error')
      return
    }
    setCart(prev => {
      const exists = prev.find(item => item.id === productId)
      if (exists) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    showToastMessage('Товар добавлен в корзину! 🛒', 'success')
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
    showToastMessage('Товар удален из корзины', 'info')
  }

  const clearCart = () => {
    setCart([])
    showToastMessage('Корзина очищена', 'info')
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  }

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      setProducts(products.filter(p => p.id !== productId))
      showToastMessage('Товар удален!', 'info')
    }
  }

  const handleDeleteRequest = (requestId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот запрос?')) {
      setRequests(requests.filter(r => r.id !== requestId))
      showToastMessage('Запрос удален!', 'info')
    }
  }

  const handleLogin = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem('agrobazar_user', JSON.stringify(userData))
    setShowLogin(false)
    showToastMessage(`Добро пожаловать, ${userData.fullName}!`, 'success')
    setNotifications(prev => [
      {
        id: Date.now(),
        message: `Вы вошли как ${userData.fullName}`,
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ])
  }

  const handleRegister = (userData) => {
    const newUser = { ...userData, id: Date.now() }
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem('agrobazar_users', JSON.stringify(updatedUsers))
    setCurrentUser(newUser)
    localStorage.setItem('agrobazar_user', JSON.stringify(newUser))
    setShowRegister(false)
    showToastMessage(`Регистрация успешна! Добро пожаловать, ${newUser.fullName}!`, 'success')
    setNotifications(prev => [
      {
        id: Date.now(),
        message: `Вы зарегистрировались как ${newUser.fullName}`,
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ])
  }

  const handleForgotPassword = (email) => {
    const foundUser = users.find(u => u.email === email)
    if (foundUser) {
      const code = String(Math.floor(100000 + Math.random() * 900000))
      setForgotPasswordData({ step: 2, email, code, verified: false })
      showToastMessage(`Код подтверждения отправлен на ${email}`, 'success')
      return true
    } else {
      showToastMessage('Пользователь с таким email не найден', 'error')
      return false
    }
  }

  const handleVerifyCode = (code) => {
    if (code === forgotPasswordData.code) {
      setForgotPasswordData({ ...forgotPasswordData, step: 3, verified: true })
      showToastMessage('Код подтвержден!', 'success')
      return true
    } else {
      showToastMessage('Неверный код подтверждения', 'error')
      return false
    }
  }

  const handleResetPassword = (email, newPassword) => {
    const updatedUsers = users.map(u => {
      if (u.email === email) {
        return { ...u, password: newPassword }
      }
      return u
    })
    setUsers(updatedUsers)
    localStorage.setItem('agrobazar_users', JSON.stringify(updatedUsers))
    setShowForgotPassword(false)
    setForgotPasswordData({ step: 1, email: '', code: '', verified: false })
    showToastMessage('Пароль успешно изменен!', 'success')
    return true
  }

  const value = {
    currentUser, setCurrentUser,
    users, setUsers,
    products, setProducts,
    requests, setRequests,
    orders, setOrders,
    messages, setMessages,
    comments, setComments,
    favorites, setFavorites,
    cart, setCart,
    notifications, setNotifications,
    selectedRegion, setSelectedRegion,
    searchTerm, setSearchTerm,
    selectedCategory, setSelectedCategory,
    priceFilter, setPriceFilter,
    sortBy, setSortBy,
    ratingFilter, setRatingFilter,
    showFilters, setShowFilters,
    activeTab, setActiveTab,
    showLogin, setShowLogin,
    showRegister, setShowRegister,
    showForgotPassword, setShowForgotPassword,
    showAddProduct, setShowAddProduct,
    showAddRequest, setShowAddRequest,
    showOrder, setShowOrder,
    showEditProfile, setShowEditProfile,
    showReviewModal, setShowReviewModal,
    showNotifications, setShowNotifications,
    currentOrderProduct, setCurrentOrderProduct,
    reviewText, setReviewText,
    reviewRating, setReviewRating,
    reviewProductId, setReviewProductId,
    loginData, setLoginData,
    registerData, setRegisterData,
    newProduct, setNewProduct,
    newRequest, setNewRequest,
    newOrder, setNewOrder,
    editUserData, setEditUserData,
    forgotPasswordData, setForgotPasswordData,
    showToastMessage,
    getTimeAgo,
    getCategoryEmoji,
    getRegionColor,
    getUrgencyEmoji,
    formatPrice,
    formatRating,
    toggleFavorite,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    handleDeleteProduct,
    handleDeleteRequest,
    handleLogin,
    handleRegister,
    handleForgotPassword,
    handleVerifyCode,
    handleResetPassword,
    categories,
    generateInitialProducts
  }

return (
    <AppContext.Provider value={value}>
      <div className="app">
        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
        <Header />
        
        {showLogin && <LoginModal />}
        {showRegister && <RegisterModal />}
        {showForgotPassword && <ForgotPasswordModal />}
        {showAddProduct && <AddProductModal />}
        {showOrder && <OrderModal />}
        {showReviewModal && <ReviewModal />}
        
        <InstallPrompt />
        
        <main className="main-content">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </AppContext.Provider>
  )
}
