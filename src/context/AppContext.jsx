// context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('agrobazar_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.id) return parsed
      } catch (e) {
        localStorage.removeItem('agrobazar_user')
      }
    }
    return null
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showOrder, setShowOrder] = useState(false)
  const [currentOrderProduct, setCurrentOrderProduct] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewProductId, setReviewProductId] = useState(null)
  const [toast, setToast] = useState(null)

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('agrobazar_users')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {
        localStorage.removeItem('agrobazar_users')
      }
    }
    const defaultUsers = [
      { id: 1, username: 'asan', password: '123456', fullName: 'Асан Бакиров', phone: '+996 700 123 456', region: 'Чуйская область', district: 'Сокулук', farmName: 'Асан-Бакир ферма', farmType: 'Садоводство', email: 'asan@email.kg', bio: 'Опытный фермер, выращиваю яблоки и груши более 10 лет.', createdAt: '2024-01-15', rating: 4.9, avatar: '🍎', experience: '10 лет', education: 'Аграрный университет', website: 'https://asanfarmer.kg', role: 'Фермер', socialMedia: { instagram: '@asanfarmer', facebook: 'asanfarmer', youtube: '' }, verified: true },
      { id: 2, username: 'salima', password: '123456', fullName: 'Салима Исакова', phone: '+996 550 987 654', region: 'Иссык-Кульская область', district: 'Түп', farmName: 'Иссык-Куль Агро', farmType: 'Овощеводство', email: 'salima@email.kg', bio: 'Выращиваю экологически чистые овощи на берегу Иссык-Куля.', createdAt: '2024-02-20', rating: 4.8, avatar: '🥕', experience: '8 лет', education: 'Сельхозтехникум', website: 'https://issykagro.kg', role: 'Фермер', socialMedia: { instagram: '@issykagro', facebook: 'issykagro', youtube: '' }, verified: true },
      { id: 3, username: 'baky', password: '123456', fullName: 'Бакыт Джумалиев', phone: '+996 770 456 789', region: 'Нарынская область', district: 'Ак-Талаа', farmName: 'Нарын Бал', farmType: 'Пчеловодство', email: 'baky@email.kg', bio: 'Профессиональный пчеловод, занимаюсь горным медом более 15 лет.', createdAt: '2024-03-10', rating: 4.9, avatar: '🐝', experience: '15 лет', education: 'Пчеловодческие курсы', website: 'https://narynbal.kg', role: 'Фермер', socialMedia: { instagram: '@narynbal', facebook: 'narynbal', youtube: '' }, verified: true },
      { id: 4, username: 'ermek', password: '123456', fullName: 'Эрмек Кубанычбеков', phone: '+996 555 321 987', region: 'Таласская область', district: 'Талас', farmName: 'Талас Эт', farmType: 'Животноводство', email: 'ermek@email.kg', bio: 'Занимаюсь разведением крупного рогатого скота.', createdAt: '2024-04-05', rating: 4.7, avatar: '🐄', experience: '12 лет', education: 'Ветеринарный институт', website: 'https://talaset.kg', role: 'Фермер', socialMedia: { instagram: '@talaset', facebook: 'talaset', youtube: '' }, verified: false },
      { id: 5, username: 'aigul', password: '123456', fullName: 'Айгуль Маматова', phone: '+996 702 234 567', region: 'Ошская область', district: 'Кара-Суу', farmName: 'Ош Саженцы', farmType: 'Садоводство', email: 'aigul@email.kg', bio: 'Выращиваю качественные саженцы фруктовых деревьев.', createdAt: '2024-05-01', rating: 4.8, avatar: '🌱', experience: '7 лет', education: 'Аграрный колледж', website: 'https://oshsaj.kg', role: 'Фермер', socialMedia: { instagram: '@oshsaj', facebook: 'oshsaj', youtube: '' }, verified: false },
      { id: 6, username: 'nurlan', password: '123456', fullName: 'Нурлан Турусбеков', phone: '+996 550 111 222', region: 'Ошская область', district: 'Өзгөн', farmName: 'Нур Агро', farmType: 'Тепличное хозяйство', email: 'nurlan@email.kg', bio: 'Выращиваю свежие овощи в теплицах круглый год.', createdAt: '2024-08-01', rating: 4.6, avatar: '🍅', experience: '5 лет', education: 'Аграрный колледж', website: '', role: 'Сатып алуучу', socialMedia: { instagram: '@nurlagro', facebook: '', youtube: '' }, verified: false }
    ]
    return defaultUsers
  })

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('agrobazar_products')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {
        localStorage.removeItem('agrobazar_products')
      }
    }
    return []
  })

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('agrobazar_orders')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {
        localStorage.removeItem('agrobazar_orders')
      }
    }
    return []
  })

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('agrobazar_favorites')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {
        localStorage.removeItem('agrobazar_favorites')
      }
    }
    return []
  })

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('agrobazar_cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {
        localStorage.removeItem('agrobazar_cart')
      }
    }
    return []
  })

  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('agrobazar_comments')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') return parsed
      } catch (e) {
        localStorage.removeItem('agrobazar_comments')
      }
    }
    return {}
  })

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('agrobazar_chat_messages')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) {
        localStorage.removeItem('agrobazar_chat_messages')
      }
    }
    return []
  })

  const [activeTab, setActiveTab] = useState('my-products')
  const [editUserData, setEditUserData] = useState({})
  const [forgotPasswordData, setForgotPasswordData] = useState({
    step: 1,
    email: '',
    code: '',
    verified: false
  })

  const regions = [
    'Баткенская область',
    'Джалал-Абадская область',
    'Иссык-Кульская область',
    'Нарынская область',
    'Ошская область',
    'Таласская область',
    'Чуйская область'
  ]

  const farmTypes = [
    'Растениеводство',
    'Животноводство',
    'Птицеводство',
    'Пчеловодство',
    'Садоводство',
    'Тепличное хозяйство'
  ]

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agrobazar_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('agrobazar_user')
    }
  }, [currentUser])

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('agrobazar_users', JSON.stringify(users))
    }
  }, [users])

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('agrobazar_products', JSON.stringify(products))
    }
  }, [products])

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('agrobazar_orders', JSON.stringify(orders))
    }
  }, [orders])

  useEffect(() => {
    localStorage.setItem('agrobazar_favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('agrobazar_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (Object.keys(comments).length > 0) {
      localStorage.setItem('agrobazar_comments', JSON.stringify(comments))
    }
  }, [comments])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('agrobazar_chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
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
    const existingUsers = JSON.parse(localStorage.getItem('agrobazar_users') || '[]')
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toLocaleDateString('ru-RU'),
      rating: 0,
      verified: false,
      avatar: userData.avatar || '🌾',
      fullName: userData.fullName || userData.username || 'Пользователь',
      role: userData.role || 'Сатып алуучу'
    }
    existingUsers.push(newUser)
    localStorage.setItem('agrobazar_users', JSON.stringify(existingUsers))
    setUsers(existingUsers)
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

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('agrobazar_user')
    showToastMessage('Вы вышли из системы', 'info')
  }

  const handleForgotPassword = (email) => {
    const foundUser = users.find(u => u.email === email)
    if (foundUser) {
      const code = String(Math.floor(100000 + Math.random() * 900000))
      setForgotPasswordData(prev => ({ ...prev, code, email }))
      showToastMessage(`Код подтверждения отправлен на ${email}`, 'success')
      return true
    } else {
      showToastMessage('Пользователь с таким email не найден', 'error')
      return false
    }
  }

  const handleVerifyCode = (code) => {
    if (code === forgotPasswordData.code) {
      setForgotPasswordData(prev => ({ ...prev, step: 3, verified: true }))
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

  const toggleFavorite = (productId) => {
    if (!currentUser) {
      showToastMessage('Сначала войдите в систему', 'info')
      setShowLogin(true)
      return
    }
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      return newFavorites
    })
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
      setProducts(prev => prev.filter(p => p.id !== productId))
      showToastMessage('Товар удален', 'info')
    }
  }

  const calculateTotalSales = (userId) => {
    if (!userId) return 0
    const userOrders = orders.filter(o => o.farmerId === userId && o.status === 'confirmed')
    return userOrders.reduce((sum, o) => sum + (parseFloat(o.quantity) || 0), 0)
  }

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0'
    return Number(price).toFixed(1)
  }

  const formatRating = (rating) => {
    if (rating === undefined || rating === null) return '0'
    return Number(rating).toFixed(1)
  }

  const getTimeAgo = (date) => {
    if (!date) return 'сегодня'
    const diff = new Date() - new Date(date)
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'сегодня'
    if (days === 1) return 'вчера'
    if (days < 7) return `${days} дня назад`
    if (days < 30) return `${Math.floor(days / 7)} недель назад`
    if (days < 365) return `${Math.floor(days / 30)} месяцев назад`
    return `${Math.floor(days / 365)} лет назад`
  }

  const sendMessage = (fromUserId, toUserId, text) => {
    const key = [fromUserId, toUserId].sort().join('-')
    const newMessage = {
      id: Date.now(),
      key: key,
      from: fromUserId,
      to: toUserId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false
    }
    setMessages(prev => [...prev, newMessage])
  }

  const getMessages = (userId1, userId2) => {
    const key = [userId1, userId2].sort().join('-')
    return messages.filter(m => m.key === key)
  }

  const getUnreadCount = (userId) => {
    return messages.filter(m => m.to === userId && !m.read).length
  }

  const markAsRead = (userId) => {
    setMessages(prev => prev.map(m => {
      if (m.to === userId && !m.read) {
        return { ...m, read: true }
      }
      return m
    }))
  }

  const value = {
    currentUser,
    setCurrentUser,
    searchTerm,
    setSearchTerm,
    showNotifications,
    setShowNotifications,
    notifications,
    setNotifications,
    showLogin,
    setShowLogin,
    showRegister,
    setShowRegister,
    showForgotPassword,
    setShowForgotPassword,
    showAddProduct,
    setShowAddProduct,
    showEditProfile,
    setShowEditProfile,
    showOrder,
    setShowOrder,
    currentOrderProduct,
    setCurrentOrderProduct,
    showReviewModal,
    setShowReviewModal,
    reviewProductId,
    setReviewProductId,
    toast,
    users,
    setUsers,
    products,
    setProducts,
    orders,
    setOrders,
    favorites,
    setFavorites,
    cart,
    setCart,
    comments,
    setComments,
    messages,
    setMessages,
    activeTab,
    setActiveTab,
    editUserData,
    setEditUserData,
    regions,
    farmTypes,
    forgotPasswordData,
    setForgotPasswordData,
    showToastMessage,
    handleLogin,
    handleRegister,
    handleLogout,
    handleForgotPassword,
    handleVerifyCode,
    handleResetPassword,
    toggleFavorite,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    handleDeleteProduct,
    calculateTotalSales,
    formatPrice,
    formatRating,
    getTimeAgo,
    sendMessage,
    getMessages,
    getUnreadCount,
    markAsRead
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  )
}