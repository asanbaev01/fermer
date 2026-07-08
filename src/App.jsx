// App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import HomePage from './components/pages/HomePage'
import ProductDetail from './components/pages/ProductDetail'
import ProfilePage from './components/pages/ProfilePage'
import UserProfile from './components/pages/UserProfile'
import FavoritesPage from './components/pages/FavoritesPage'
import CartPage from './components/pages/CartPage'
import LeaderboardPage from './components/pages/LeaderboardPage'
import AnalyticsPage from './components/pages/AnalyticsPage'
import OrderTrackingPage from './components/pages/OrderTrackingPage'
import ChatPage from './components/pages/ChatPage'
import MapPage from './components/pages/MapPage'
import DiscountPage from './components/pages/DiscountPage'
import BlogPage from './components/pages/BlogPage'
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
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="orders" element={<OrderTrackingPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:userId" element={<ChatPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="discounts" element={<DiscountPage />} />
          <Route path="blog" element={<BlogPage />} />
        </Route>
      </Routes>
    </Router>
  )
}