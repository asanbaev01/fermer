// App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import HomePage from './components/pages/HomePage'
import ProductDetail from './components/pages/ProductDetail'
import ProfilePage from './components/pages/ProfilePage'
import UserProfile from './components/pages/UserProfile'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="user/:id" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  )
}