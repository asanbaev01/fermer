// context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  // STATE
  const [currentUser, setCurrentUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [toast, setToast] = useState(null)

  // LOCALSTORAGE - колдонуучуну калыбына келтирүү
  useEffect(() => {
    const savedUser = localStorage.getItem('agrobazar_user')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('agrobazar_user')
      }
    }
  }, [])

  // TOAST
  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // LOGIN
  const handleLogin = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem('agrobazar_user', JSON.stringify(userData))
    setShowLogin(false)
    showToastMessage(`Добро пожаловать, ${userData.fullName}!`, 'success')
    
    // Уведомление
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

  // REGISTER
  const handleRegister = (userData) => {
    // Колдонуучуларды сактоо
    const users = JSON.parse(localStorage.getItem('agrobazar_users') || '[]')
    const newUser = { ...userData, id: Date.now() }
    users.push(newUser)
    localStorage.setItem('agrobazar_users', JSON.stringify(users))
    
    // Автоматтык кирүү
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

  // VALUE
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
    showAddProduct,
    setShowAddProduct,
    showToastMessage,
    handleLogin,
    handleRegister
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* TOAST */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  )
}