// context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [toast, setToast] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [favorites, setFavorites] = useState([])
  const [comments, setComments] = useState({})
  const [activeTab, setActiveTab] = useState('my-products')
  const [editUserData, setEditUserData] = useState({})

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
    const savedUser = localStorage.getItem('agrobazar_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        if (user && user.id) {
          setCurrentUser(user)
        }
      } catch (e) {
        localStorage.removeItem('agrobazar_user')
      }
    }

    const savedUsers = localStorage.getItem('agrobazar_users')
    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers)
        if (Array.isArray(parsed)) {
          setUsers(parsed)
        }
      } catch (e) {
        localStorage.removeItem('agrobazar_users')
      }
    }

    const savedProducts = localStorage.getItem('agrobazar_products')
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts)
        if (Array.isArray(parsed)) {
          setProducts(parsed)
        }
      } catch (e) {
        localStorage.removeItem('agrobazar_products')
      }
    }

    const savedOrders = localStorage.getItem('agrobazar_orders')
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders)
        if (Array.isArray(parsed)) {
          setOrders(parsed)
        }
      } catch (e) {
        localStorage.removeItem('agrobazar_orders')
      }
    }

    const savedFavorites = localStorage.getItem('agrobazar_favorites')
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites)
        if (Array.isArray(parsed)) {
          setFavorites(parsed)
        }
      } catch (e) {
        localStorage.removeItem('agrobazar_favorites')
      }
    }

    const savedComments = localStorage.getItem('agrobazar_comments')
    if (savedComments) {
      try {
        const parsed = JSON.parse(savedComments)
        if (parsed && typeof parsed === 'object') {
          setComments(parsed)
        }
      } catch (e) {
        localStorage.removeItem('agrobazar_comments')
      }
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agrobazar_user', JSON.stringify(currentUser))
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
    if (Object.keys(comments).length > 0) {
      localStorage.setItem('agrobazar_comments', JSON.stringify(comments))
    }
  }, [comments])

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
      fullName: userData.fullName || userData.username || 'Пользователь'
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

  const [forgotPasswordData, setForgotPasswordData] = useState({
    step: 1,
    email: '',
    code: '',
    verified: false
  })

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
    setShowForgotPassword, // 👈 Мына ушул жерге кошулду, эми LoginModal ичинде ката бербейт
    showAddProduct,
    setShowAddProduct,
    showEditProfile,
    setShowEditProfile,
    toast,
    users,
    setUsers,
    products,
    setProducts,
    orders,
    setOrders,
    favorites,
    setFavorites,
    comments,
    setComments,
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
    formatPrice,
    formatRating,
    getTimeAgo,
    toggleFavorite,
    handleDeleteProduct,
    calculateTotalSales
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