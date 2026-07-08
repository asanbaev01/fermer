// components/pages/AnalyticsPage.jsx
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaChartBar, FaBox, FaUsers, FaShoppingBag, 
  FaStar, FaCalendarAlt, FaTrophy, FaDollarSign 
} from 'react-icons/fa'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts'
import { AppContext } from '../../context/AppContext'
import './AnalyticsPage.css'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const { users, products, orders, favorites } = useContext(AppContext)
  const [period, setPeriod] = useState('week')

  const getCategoryData = () => {
    const categories = {}
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1
    })
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  }

  const getRegionData = () => {
    const regions = {}
    products.forEach(p => {
      regions[p.region] = (regions[p.region] || 0) + 1
    })
    return Object.entries(regions).map(([name, value]) => ({ name, value }))
  }

  const getSalesData = () => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    return months.map((m, i) => ({
      name: m,
      sales: Math.floor(Math.random() * 50 + 10),
      revenue: Math.floor(Math.random() * 1000 + 200)
    }))
  }

  const getOrdersByStatus = () => {
    const statuses = { pending: 0, confirmed: 0, delivered: 0, cancelled: 0 }
    orders.forEach(o => {
      statuses[o.status] = (statuses[o.status] || 0) + 1
    })
    return Object.entries(statuses).map(([name, value]) => ({ name, value }))
  }

  const COLORS = ['#f59e0b', '#fbbf24', '#ef4444', '#34d399', '#3b82f6', '#8b5cf6']

  const categoryData = getCategoryData()
  const regionData = getRegionData()
  const salesData = getSalesData()
  const ordersData = getOrdersByStatus()

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.quantity) || 0) * 100, 0)
  const avgRating = products.length > 0 
    ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length 
    : 0

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <button className="analytics-back" onClick={() => navigate('/')}>
          <FaArrowLeft /> Назад
        </button>
        <h1><FaChartBar /> Аналитика</h1>
        <div className="analytics-period">
          <button className={`period-btn ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>Неделя</button>
          <button className={`period-btn ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>Месяц</button>
          <button className={`period-btn ${period === 'year' ? 'active' : ''}`} onClick={() => setPeriod('year')}>Год</button>
        </div>
      </div>

      <div className="analytics-stats">
        <div className="stat-card">
          <div className="stat-icon"><FaBox /></div>
          <div className="stat-info">
            <h3>{products.length}</h3>
            <p>Всего товаров</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-info">
            <h3>{users.length}</h3>
            <p>Пользователей</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaShoppingBag /></div>
          <div className="stat-info">
            <h3>{orders.length}</h3>
            <p>Всего заказов</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaStar /></div>
          <div className="stat-info">
            <h3>{avgRating.toFixed(1)}</h3>
            <p>Средний рейтинг</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-info">
            <h3>{totalRevenue.toFixed(0)} сом</h3>
            <p>Общий доход</p>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Продажи по месяцам</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#f59e0b" name="Количество" />
              <Bar dataKey="revenue" fill="#fbbf24" name="Доход (сом)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Товары по категориям</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Товары по регионам</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Статус заказов</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#f59e0b" name="Количество">
                {ordersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-table">
        <h3>Последние заказы</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Товар</th>
                <th>Количество</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(-5).reverse().map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.quantity * 100} сом</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status === 'pending' ? '⏳ Ожидает' : 
                       order.status === 'confirmed' ? '✅ Подтвержден' : 
                       order.status === 'delivered' ? '📦 Доставлен' : '❌ Отменен'}
                    </span>
                  </td>
                  <td>{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}