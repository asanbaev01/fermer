// components/pages/AnalyticsPage.jsx
import React, { useContext, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaChartBar, FaBox, FaUsers, FaShoppingBag, 
  FaStar, FaCalendarAlt, FaTrophy, FaDollarSign, FaEye,
  FaDownload, FaPrint, FaFilter, FaSearch, FaSort,
  FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight,
  FaPlus, FaMinus, FaTimes, FaCheck, FaClock, FaTruck,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaTag,
  FaPercent, FaChartLine, FaChartPie, FaChartArea,
  FaList
} from 'react-icons/fa'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Scatter, ScatterChart, ZAxis
} from 'recharts'
import { AppContext } from '../../context/AppContext'
import './AnalyticsPage.css'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const { users, products, orders, favorites } = useContext(AppContext)
  
  const [period, setPeriod] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [viewMode, setViewMode] = useState('grid')
  const [chartType, setChartType] = useState('bar')
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const categories = useMemo(() => {
    const cats = {}
    products.forEach(p => {
      cats[p.category] = (cats[p.category] || 0) + 1
    })
    return Object.keys(cats)
  }, [products])

  const regions = useMemo(() => {
    const regs = {}
    products.forEach(p => {
      regs[p.region] = (regs[p.region] || 0) + 1
    })
    return Object.keys(regs)
  }, [products])

  const getCategoryData = useCallback(() => {
    const categories = {}
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1
    })
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  }, [products])

  const getRegionData = useCallback(() => {
    const regions = {}
    products.forEach(p => {
      regions[p.region] = (regions[p.region] || 0) + 1
    })
    return Object.entries(regions).map(([name, value]) => ({ name, value }))
  }, [products])

  const getSalesData = useCallback(() => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    return months.map((m, i) => ({
      name: m,
      sales: Math.floor(Math.random() * 50 + 10),
      revenue: Math.floor(Math.random() * 1000 + 200),
      profit: Math.floor(Math.random() * 500 + 50),
      returns: Math.floor(Math.random() * 10 + 1)
    }))
  }, [])

  const getOrdersByStatus = useCallback(() => {
    const statuses = { pending: 0, confirmed: 0, delivered: 0, cancelled: 0 }
    orders.forEach(o => {
      statuses[o.status] = (statuses[o.status] || 0) + 1
    })
    return Object.entries(statuses).map(([name, value]) => ({ name, value }))
  }, [orders])

  const getProductRatingDistribution = useCallback(() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    products.forEach(p => {
      const rating = Math.round(p.rating || 0)
      if (rating >= 1 && rating <= 5) dist[rating]++
    })
    return Object.entries(dist).map(([rating, count]) => ({ rating: `${rating}★`, count }))
  }, [products])

  const getUserActivityData = useCallback(() => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    return days.map(d => ({
      name: d,
      active: Math.floor(Math.random() * 30 + 5),
      new: Math.floor(Math.random() * 10 + 1),
      returning: Math.floor(Math.random() * 15 + 3)
    }))
  }, [])

  const getRevenueByCategory = useCallback(() => {
    const catRevenue = {}
    orders.forEach(o => {
      const product = products.find(p => p.id === o.productId)
      if (product) {
        const amount = parseFloat(o.quantity) * 100
        catRevenue[product.category] = (catRevenue[product.category] || 0) + amount
      }
    })
    return Object.entries(catRevenue).map(([name, value]) => ({ name, value: Math.round(value) }))
  }, [orders, products])

  const getTopProducts = useCallback(() => {
    const productSales = {}
    orders.forEach(o => {
      productSales[o.productName] = (productSales[o.productName] || 0) + parseFloat(o.quantity)
    })
    return Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
  }, [orders])

  const getMonthlyTrends = useCallback(() => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    return months.map((m, i) => ({
      name: m,
      orders: Math.floor(Math.random() * 30 + 5),
      revenue: Math.floor(Math.random() * 800 + 100),
      customers: Math.floor(Math.random() * 20 + 3)
    }))
  }, [])

  const getFilteredOrders = useCallback(() => {
    let filtered = [...orders]
    
    if (searchTerm) {
      filtered = filtered.filter(o => 
        o.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(o => {
        const product = products.find(p => p.id === o.productId)
        return product?.category === selectedCategory
      })
    }
    
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(o => {
        const product = products.find(p => p.id === o.productId)
        return product?.region === selectedRegion
      })
    }
    
    if (dateRange.start) {
      filtered = filtered.filter(o => o.createdAt >= dateRange.start)
    }
    if (dateRange.end) {
      filtered = filtered.filter(o => o.createdAt <= dateRange.end)
    }
    
    filtered.sort((a, b) => {
      let aVal = a[sortField] || ''
      let bVal = b[sortField] || ''
      if (sortField === 'amount') {
        aVal = parseFloat(a.quantity) * 100
        bVal = parseFloat(b.quantity) * 100
      }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    
    return filtered
  }, [orders, products, searchTerm, selectedCategory, selectedRegion, dateRange, sortField, sortDirection])

  const filteredOrders = getFilteredOrders()
  
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const categoryData = getCategoryData()
  const regionData = getRegionData()
  const salesData = getSalesData()
  const ordersData = getOrdersByStatus()
  const ratingData = getProductRatingDistribution()
  const activityData = getUserActivityData()
  const revenueByCategory = getRevenueByCategory()
  const topProducts = getTopProducts()
  const monthlyTrends = getMonthlyTrends()

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.quantity) || 0) * 100, 0)
  const avgRating = products.length > 0 
    ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length 
    : 0
  const totalOrders = orders.length
  const uniqueCustomers = new Set(orders.map(o => o.userId)).size

  const COLORS = ['#f59e0b', '#fbbf24', '#ef4444', '#34d399', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1']

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const renderChart = () => {
    switch(chartType) {
      case 'bar':
        return (
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
            <Legend />
            <Bar dataKey="sales" fill="#f59e0b" name="Продажи" />
            <Bar dataKey="revenue" fill="#fbbf24" name="Доход" />
          </BarChart>
        )
      case 'line':
        return (
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} name="Продажи" />
            <Line type="monotone" dataKey="revenue" stroke="#fbbf24" strokeWidth={2} name="Доход" />
          </LineChart>
        )
      case 'area':
        return (
          <AreaChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
            <Legend />
            <Area type="monotone" dataKey="sales" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Продажи" />
            <Area type="monotone" dataKey="revenue" stackId="1" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.3} name="Доход" />
          </AreaChart>
        )
      case 'radar':
        return (
          <RadarChart data={categoryData}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="name" stroke="#888" />
            <PolarRadiusAxis stroke="#888" />
            <Radar dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
          </RadarChart>
        )
      default:
        return null
    }
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="analytics-header-left">
          <button className="analytics-back" onClick={() => navigate('/')}>
            <FaArrowLeft /> Назад
          </button>
          <h1><FaChartBar /> Аналитика</h1>
        </div>
        <div className="analytics-header-right">
          <button className="analytics-action-btn" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Фильтры
          </button>
          <button className="analytics-action-btn" onClick={() => window.print()}>
            <FaPrint /> Печать
          </button>
          <button className="analytics-action-btn">
            <FaDownload /> Экспорт
          </button>
          <div className="analytics-period">
            <button className={`period-btn ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>Неделя</button>
            <button className={`period-btn ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>Месяц</button>
            <button className={`period-btn ${period === 'year' ? 'active' : ''}`} onClick={() => setPeriod('year')}>Год</button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="analytics-filters">
          <div className="filter-group">
            <input 
              type="text" 
              placeholder="Поиск заказов..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="filter-select">
              <option value="all">Все категории</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="filter-select">
              <option value="all">Все регионы</option>
              {regions.map(reg => <option key={reg} value={reg}>{reg}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="filter-date" />
            <span>—</span>
            <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="filter-date" />
          </div>
          <button className="filter-clear" onClick={() => {
            setSearchTerm('')
            setSelectedCategory('all')
            setSelectedRegion('all')
            setDateRange({ start: '', end: '' })
          }}>
            <FaTimes /> Очистить
          </button>
        </div>
      )}

      <div className="analytics-stats">
        <div className="stat-card">
          <div className="stat-icon"><FaBox /></div>
          <div className="stat-info">
            <h3>{products.length}</h3>
            <p>Всего товаров</p>
            <span className="stat-change positive">+12%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-info">
            <h3>{users.length}</h3>
            <p>Пользователей</p>
            <span className="stat-change positive">+8%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaShoppingBag /></div>
          <div className="stat-info">
            <h3>{totalOrders}</h3>
            <p>Всего заказов</p>
            <span className="stat-change positive">+15%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaStar /></div>
          <div className="stat-info">
            <h3>{avgRating.toFixed(1)}</h3>
            <p>Средний рейтинг</p>
            <span className="stat-change positive">+0.3</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-info">
            <h3>{totalRevenue.toFixed(0)} сом</h3>
            <p>Общий доход</p>
            <span className="stat-change positive">+22%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-info">
            <h3>{uniqueCustomers}</h3>
            <p>Уникальных клиентов</p>
            <span className="stat-change positive">+5%</span>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3><FaChartLine /> Продажи и доход</h3>
            <div className="chart-controls">
              <button className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`} onClick={() => setChartType('bar')}><FaChartBar /></button>
              <button className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`} onClick={() => setChartType('line')}><FaChartLine /></button>
              <button className={`chart-type-btn ${chartType === 'area' ? 'active' : ''}`} onClick={() => setChartType('area')}><FaChartArea /></button>
              <button className={`chart-type-btn ${chartType === 'radar' ? 'active' : ''}`} onClick={() => setChartType('radar')}><FaChartPie /></button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3><FaTag /> Категории товаров</h3>
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
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3><FaMapMarkerAlt /> Регионы</h3>
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
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3><FaClock /> Статус заказов</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="value" fill="#f59e0b" name="Количество">
                {ordersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3><FaStar /> Распределение рейтингов</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="rating" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="count" fill="#f59e0b" name="Товаров" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3><FaUsers /> Активность пользователей</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
              <Legend />
              <Area type="monotone" dataKey="active" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Активные" />
              <Area type="monotone" dataKey="new" stackId="1" stroke="#34d399" fill="#34d399" fillOpacity={0.3} name="Новые" />
              <Area type="monotone" dataKey="returning" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Вернувшиеся" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3><FaDollarSign /> Доход по категориям</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="value" fill="#fbbf24" name="Доход (сом)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3><FaTrophy /> Топ товаров</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#888" />
              <YAxis type="category" dataKey="name" stroke="#888" width={100} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="quantity" fill="#f59e0b" name="Продано" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width">
          <h3><FaChartLine /> Тренды по месяцам</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} />
              <Legend />
              <Bar dataKey="orders" fill="#f59e0b" name="Заказы" />
              <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} name="Доход" />
              <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} name="Клиенты" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-table">
        <div className="table-header">
          <h3><FaShoppingBag /> Заказы</h3>
          <div className="table-controls">
            <div className="view-toggle">
              <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                <FaBox />
              </button>
              <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                <FaList />
              </button>
            </div>
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="items-select">
              <option value={5}>5 записей</option>
              <option value={10}>10 записей</option>
              <option value={20}>20 записей</option>
              <option value={50}>50 записей</option>
            </select>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  № {sortField === 'id' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                </th>
                <th onClick={() => handleSort('productName')}>
                  Товар {sortField === 'productName' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                </th>
                <th onClick={() => handleSort('quantity')}>
                  Количество {sortField === 'quantity' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                </th>
                <th onClick={() => handleSort('amount')}>
                  Сумма {sortField === 'amount' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                </th>
                <th onClick={() => handleSort('status')}>
                  Статус {sortField === 'status' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                </th>
                <th onClick={() => handleSort('createdAt')}>
                  Дата {sortField === 'createdAt' && (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="product-cell">
                      <span className="product-name">{order.productName}</span>
                      <span className="product-id">#{order.id}</span>
                    </td>
                    <td>{order.quantity}</td>
                    <td className="amount-cell">{(parseFloat(order.quantity) * 100).toFixed(0)} сом</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status === 'pending' && <><FaClock /> Ожидает</>}
                        {order.status === 'confirmed' && <><FaCheck /> Подтвержден</>}
                        {order.status === 'delivered' && <><FaTruck /> Доставлен</>}
                        {order.status === 'cancelled' && <><FaTimes /> Отменен</>}
                      </span>
                    </td>
                    <td>{order.createdAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <FaBox /> Заказов не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="table-pagination">
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            <span className="page-info">
              Страница {currentPage} из {totalPages}
            </span>
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}