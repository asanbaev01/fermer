import React, { useState, useEffect } from 'react'
import { 
  FaLeaf, FaSearch, FaBell, FaUser, FaPlus, FaSignOutAlt,
  FaBox, FaClipboardList, FaHeart, FaStar,
  FaPhone, FaEnvelope, FaGlobe, FaInstagram, FaFacebook,
  FaYoutube, FaArrowLeft, FaEdit, FaTrash, FaComment,
  FaShoppingBag, FaMapMarkerAlt, FaCalendarAlt, FaTrophy,
  FaGraduationCap, FaLink, FaUsers, FaTag, FaTruck,
  FaFire, FaAward, FaShieldAlt, FaHandshake, FaRocket,
  FaGift, FaCheckCircle, FaClock, FaFile, FaImage,
  FaVideo, FaWhatsapp, FaTelegram, FaCamera, FaLocationArrow
} from 'react-icons/fa'
import { MdAgriculture, MdOutlineAgriculture } from 'react-icons/md'
import { GiHoneycomb } from 'react-icons/gi'
import { BsFillHeartFill, BsHeart } from 'react-icons/bs'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { RiCustomerService2Fill } from 'react-icons/ri'
import './App.css'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [requests, setRequests] = useState([])
  const [orders, setOrders] = useState([])
  const [messages, setMessages] = useState({})
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddRequest, setShowAddRequest] = useState(false)
  const [showOrder, setShowOrder] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showMyProfile, setShowMyProfile] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(null)
  const [showProductDetail, setShowProductDetail] = useState(null)
  const [showChat, setShowChat] = useState(null)
  const [activeTab, setActiveTab] = useState('products')
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
  const [comments, setComments] = useState({})
  const [favorites, setFavorites] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('newest')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [currentOrderProduct, setCurrentOrderProduct] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(0)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewProductId, setReviewProductId] = useState(null)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('')
  const [showToast, setShowToast] = useState(false)

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const regions = [
    'Баткенская область', 'Джалал-Абадская область',
    'Иссык-Кульская область', 'Нарынская область',
    'Ошская область', 'Таласская область', 'Чуйская область'
  ]

  const districts = {
    'Чуйская область': ['Аламудун', 'Жайыл', 'Кемин', 'Москва', 'Панфилов', 'Сокулук', 'Чуй', 'Ысык-Ата'],
    'Ошская область': ['Араван', 'Кара-Суу', 'Ноокат', 'Өзгөн', 'Чоң-Алай'],
    'Иссык-Кульская область': ['Ак-Суу', 'Жети-Өгүз', 'Түп', 'Тоң'],
    'Нарынская область': ['Ак-Талаа', 'Ат-Башы', 'Жумгал', 'Кочкор', 'Нарын'],
    'Таласская область': ['Бакай-Ата', 'Кара-Буура', 'Манас', 'Талас'],
    'Баткенская область': ['Баткен', 'Кадамжай', 'Лейлек'],
    'Джалал-Абадская область': ['Аксый', 'Ала-Бука', 'Базар-Коргон', 'Ноокен', 'Сузак', 'Тогуз-Торо', 'Чаткал']
  }

  const categories = [
    'Жашылча', 'Мөмө', 'Дан', 'Сүт', 'Эт', 'Тоок', 'Жумуртка',
    'Бал', 'Тоют', 'Жем', 'Жер семирткич', 'Үрөн', 'Техника',
    'Трактор', 'Комбайн', 'Тамчылатып сугаруу', 'Күнөскана',
    'Мал', 'Кой', 'Уй', 'Жылкы', 'Эчки', 'Тоок', 'Балык'
  ]

  const farmTypes = [
    'Растениеводство', 'Животноводство', 'Птицеводство',
    'Пчеловодство', 'Садоводство', 'Тепличное хозяйство',
    'Смешанное хозяйство', 'Овощеводство', 'Зерновое хозяйство'
  ]

  const units = ['кг', 'л', 'шт', 'тонна', 'мешок', 'десяток', 'г', 'м', 'га', 'сотка']
  const storageConditions = ['Обычное', 'Холодильник', 'Сухое место', 'Погреб', 'Морозильник']
  const avatars = ['🌾', '🍎', '🥕', '🐄', '🐔', '🐝', '🌻', '🍇', '🐑', '🐖', '🐓', '🌿']
  const paymentMethods = ['Наличные', 'Безналичный', 'Карта', 'Банковский перевод']
  const roles = ['Фермер', 'Сатып алуучу', 'Кооператив', 'Экспорттоочу', 'Транспорт', 'Компания']

  const generateInitialProducts = () => {
    const allProducts = []
    const productTemplates = [
      { name: 'Яблоки Ажы', price: 40, unit: 'кг', category: 'Мөмө', emoji: '🍎', organic: true },
      { name: 'Яблоки Гала', price: 35, unit: 'кг', category: 'Мөмө', emoji: '🍎', organic: false },
      { name: 'Груши Конференция', price: 55, unit: 'кг', category: 'Мөмө', emoji: '🍐', organic: true },
      { name: 'Картофель', price: 35, unit: 'кг', category: 'Жашылча', emoji: '🥔', organic: true },
      { name: 'Морковь', price: 30, unit: 'кг', category: 'Жашылча', emoji: '🥕', organic: true },
      { name: 'Лук', price: 25, unit: 'кг', category: 'Жашылча', emoji: '🧅', organic: false },
      { name: 'Чеснок', price: 50, unit: 'кг', category: 'Жашылча', emoji: '🧄', organic: true },
      { name: 'Капуста', price: 20, unit: 'кг', category: 'Жашылча', emoji: '🥬', organic: true },
      { name: 'Помидоры', price: 55, unit: 'кг', category: 'Жашылча', emoji: '🍅', organic: true },
      { name: 'Огурцы', price: 40, unit: 'кг', category: 'Жашылча', emoji: '🥒', organic: true },
      { name: 'Мед горный', price: 500, unit: 'л', category: 'Бал', emoji: '🍯', organic: true },
      { name: 'Говядина', price: 380, unit: 'кг', category: 'Эт', emoji: '🥩', organic: true },
      { name: 'Баранина', price: 400, unit: 'кг', category: 'Эт', emoji: '🥩', organic: true },
      { name: 'Куриное мясо', price: 220, unit: 'кг', category: 'Эт', emoji: '🍗', organic: true },
      { name: 'Яйца куриные', price: 80, unit: 'десяток', category: 'Жумуртка', emoji: '🥚', organic: true },
      { name: 'Молоко коровье', price: 60, unit: 'л', category: 'Сүт', emoji: '🥛', organic: true },
      { name: 'Молоко козье', price: 120, unit: 'л', category: 'Сүт', emoji: '🥛', organic: true },
      { name: 'Творог', price: 180, unit: 'кг', category: 'Сүт', emoji: '🧀', organic: true },
      { name: 'Саженцы яблони', price: 150, unit: 'шт', category: 'Саженцы', emoji: '🌱', organic: false },
      { name: 'Кукуруза кормовая', price: 25, unit: 'кг', category: 'Тоют', emoji: '🌽', organic: false },
      { name: 'Сено', price: 15, unit: 'кг', category: 'Тоют', emoji: '🌾', organic: false },
      { name: 'Комбикорм', price: 30, unit: 'кг', category: 'Тоют', emoji: '🌾', organic: false },
      { name: 'Семена пшеницы', price: 40, unit: 'кг', category: 'Үрөн', emoji: '🌾', organic: false },
      { name: 'Трактор МТЗ-80', price: 500000, unit: 'шт', category: 'Трактор', emoji: '🚜', organic: false },
      { name: 'Система капельного полива', price: 150000, unit: 'шт', category: 'Тамчылатып сугаруу', emoji: '💧', organic: false }
    ]

    const regionDescriptions = {
      'Чуйская область': ['Свежие продукты с полей Чуйской долины', 'Экологически чистые продукты из Чуйской области'],
      'Иссык-Кульская область': ['Продукты с берегов Иссык-Куля', 'Выращено в экологически чистом регионе'],
      'Нарынская область': ['Горные продукты из Нарына', 'Экологически чистые продукты высокогорья'],
      'Таласская область': ['Продукты из Таласской долины', 'Свежее мясо и молоко из Таласа'],
      'Ошская область': ['Саженцы и фрукты из Оша', 'Продукты южной столицы'],
      'Баткенская область': ['Горные продукты из Баткена', 'Натуральные молочные продукты'],
      'Джалал-Абадская область': ['Зерновые культуры из Джалал-Абада', 'Качественные корма']
    }

    const storageOptions = ['Обычное', 'Холодильник', 'Сухое место', 'Погреб', 'Морозильник']
    const farmerNames = ['Асан Бакиров', 'Салима Исакова', 'Бакыт Джумалиев', 'Эрмек Кубанычбеков', 'Айгуль Маматова']

    productTemplates.forEach((template, index) => {
      const region = regions[index % regions.length]
      const farmerName = farmerNames[index % farmerNames.length]
      const farmerId = (index % 5) + 1
      const descs = regionDescriptions[region] || ['Качественный продукт']
      const harvestDate = new Date()
      harvestDate.setDate(harvestDate.getDate() - Math.floor(Math.random() * 60))

      const roundedPrice = Math.round((template.price + (Math.random() * 10 - 5)) * 10) / 10
      const roundedRating = Math.round((4 + Math.random() * 0.9) * 10) / 10

      allProducts.push({
        id: index + 1,
        name: template.name,
        price: roundedPrice,
        wholesalePrices: [
          { min: 1, max: 100, price: Math.round((roundedPrice * 0.9) * 10) / 10 },
          { min: 101, max: 500, price: Math.round((roundedPrice * 0.8) * 10) / 10 },
          { min: 501, max: 1000, price: Math.round((roundedPrice * 0.7) * 10) / 10 }
        ],
        unit: template.unit,
        region: region,
        district: districts[region] ? districts[region][index % districts[region].length] : '',
        farmer: farmerName,
        farmerId: farmerId,
        phone: '+996 700 000 000',
        description: descs[index % descs.length] + '. ' + template.name + ' высокого качества.',
        category: template.category,
        image: template.emoji,
        quantity: Math.floor(Math.random() * 500) + 50,
        minOrder: 1,
        maxOrder: 1000,
        createdAt: harvestDate.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 200) + 20,
        rating: roundedRating,
        reviews: [],
        harvestDate: harvestDate.toISOString().split('T')[0],
        storageCondition: storageOptions[Math.floor(Math.random() * storageOptions.length)],
        deliveryAvailable: Math.random() > 0.3,
        organic: template.organic,
        certification: template.organic ? 'Органический' : '',
        coordinates: '42.8756, 74.5698',
        images: [],
        video: ''
      })
    })

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
    } else {
      const initialRequests = [
        { id: 1, title: '100 тонна картошка керек', description: 'Сатып алуучу 100 тонна картошка издейт. Сапаттуу, ири картошка керек.', region: 'Чуйская область', district: 'Сокулук', client: 'Нурлан Турусбеков', clientId: 6, phone: '+996 550 111 222', category: 'Жашылча', urgency: 'high', createdAt: '2025-06-10', budget: '1000000-1200000 сом', deadline: '2025-07-15', quantity: '100', unit: 'тонна', contactMethod: 'phone' },
        { id: 2, title: '5000 саженцы алма', description: 'Ири дүкөн үчүн 5000 саженцы алма керек. Качественный, привитой.', region: 'Ошская область', district: 'Кара-Суу', client: 'Айгуль Маматова', clientId: 5, phone: '+996 702 234 567', category: 'Саженцы', urgency: 'medium', createdAt: '2025-06-11', budget: '750000-800000 сом', deadline: '2025-08-01', quantity: '5000', unit: 'шт', contactMethod: 'email' },
        { id: 3, title: 'Кукуруза оптом 50 тонна', description: 'Корм үчүн 50 тонна кукуруза керек. Баасы боюнча сүйлөшүү.', region: 'Джалал-Абадская область', district: 'Сузак', client: 'Темир Акматов', clientId: 7, phone: '+996 700 345 678', category: 'Тоют', urgency: 'high', createdAt: '2025-06-12', budget: '1250000-1500000 сом', deadline: '2025-07-30', quantity: '50', unit: 'тонна', contactMethod: 'phone' },
        { id: 4, title: 'Мед горный 100 литр', description: 'Экспорт үчүн 100 литр горный мед керек. Сапаттуу, сертификаттуу.', region: 'Нарынская область', district: 'Ак-Талаа', client: 'Бакыт Джумалиев', clientId: 3, phone: '+996 770 456 789', category: 'Бал', urgency: 'medium', createdAt: '2025-06-13', budget: '50000-60000 сом', deadline: '2025-07-20', quantity: '100', unit: 'л', contactMethod: 'phone' }
      ]
      setRequests(initialRequests)
      localStorage.setItem('agrobazar_requests', JSON.stringify(initialRequests))
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

  const handleLogin = (e) => {
    e.preventDefault()
    const user = users.find(u => u.username === loginData.username && u.password === loginData.password)
    if (user) {
      setCurrentUser(user)
      setShowLogin(false)
      setLoginData({ username: '', password: '' })
      showToastMessage(`Добро пожаловать, ${user.fullName}! 🌾`, 'success')
    } else {
      showToastMessage('Неверное имя пользователя или пароль!', 'error')
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (users.find(u => u.username === registerData.username)) {
      showToastMessage('Пользователь с таким именем уже существует!', 'error')
      return
    }
    const newUser = {
      id: Date.now(),
      ...registerData,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 0,
      productsCount: 0,
      reviews: []
    }
    setUsers([...users, newUser])
    setCurrentUser(newUser)
    setShowRegister(false)
    setRegisterData({
      username: '', password: '', fullName: '', phone: '', region: '',
      district: '', village: '', farmName: '', farmType: '', email: '',
      bio: '', avatar: '🌾', experience: '', education: '', website: '',
      socialMedia: { instagram: '', facebook: '', youtube: '' },
      role: 'Фермер', document: '', inn: ''
    })
    showToastMessage('Регистрация успешна! Добро пожаловать в AgroBazar! 🎉', 'success')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('agrobazar_user')
    showToastMessage('Вы вышли из системы', 'info')
  }

  const addNotification = (message, type = 'info') => {
    setNotifications([{ id: Date.now(), message, type, read: false, createdAt: new Date().toISOString() }, ...notifications])
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return }
    const roundedPrice = Math.round(parseFloat(newProduct.price) * 10) / 10
    const product = {
      id: Date.now(),
      ...newProduct,
      price: roundedPrice || 0,
      farmer: currentUser.fullName,
      farmerId: currentUser.id,
      phone: currentUser.phone,
      image: getCategoryEmoji(newProduct.category),
      quantity: parseInt(newProduct.quantity) || 0,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      rating: 0,
      reviews: []
    }
    setProducts([...products, product])
    setNewProduct({
      name: '', price: '', wholesalePrices: [], region: '', district: '',
      category: '', description: '', quantity: '', unit: 'кг',
      harvestDate: '', storageCondition: '', deliveryAvailable: false,
      organic: false, certification: '', minOrder: '', maxOrder: '',
      coordinates: '', images: [], video: ''
    })
    setShowAddProduct(false)
    showToastMessage('Товар успешно добавлен! ✅', 'success')
  }

  const handleAddRequest = (e) => {
    e.preventDefault()
    if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return }
    const request = {
      id: Date.now(),
      ...newRequest,
      client: currentUser.fullName,
      clientId: currentUser.id,
      phone: currentUser.phone,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setRequests([...requests, request])
    setNewRequest({
      title: '', description: '', region: '', district: '',
      category: '', urgency: 'normal', budget: '', deadline: '',
      quantity: '', unit: 'кг', contactMethod: 'phone'
    })
    setShowAddRequest(false)
    showToastMessage('Запрос успешно добавлен! 📝', 'success')
  }

  const handleOrder = (e) => {
    e.preventDefault()
    if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return }
    const order = {
      id: Date.now(),
      ...newOrder,
      productId: currentOrderProduct ? currentOrderProduct.id : null,
      productName: currentOrderProduct ? currentOrderProduct.name : '',
      farmerId: currentOrderProduct ? currentOrderProduct.farmerId : null,
      farmerName: currentOrderProduct ? currentOrderProduct.farmer : '',
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    }
    setOrders([...orders, order])
    setNewOrder({ address: '', phone: '', quantity: '', deliveryDate: '', paymentMethod: 'Наличные', comment: '' })
    setShowOrder(false)
    setCurrentOrderProduct(null)
    showToastMessage('Заказ успешно оформлен! 📦', 'success')
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

  const handleEditProfile = (e) => {
    e.preventDefault()
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) return { ...u, ...editUserData }
      return u
    })
    setUsers(updatedUsers)
    setCurrentUser({ ...currentUser, ...editUserData })
    setShowEditProfile(false)
    showToastMessage('Профиль обновлен! ✅', 'success')
  }

  const handleAddComment = (productId, text, rating) => {
    if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return }
    const comment = { user: currentUser.fullName, userId: currentUser.id, text, rating, date: new Date().toISOString().split('T')[0] }
    setComments({ ...comments, [productId]: [...(comments[productId] || []), comment] })
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const allComments = [...(comments[productId] || []), comment]
        const avgRating = Math.round((allComments.reduce((sum, c) => sum + c.rating, 0) / allComments.length) * 10) / 10
        return { ...p, rating: avgRating }
      }
      return p
    })
    setProducts(updatedProducts)
    setShowReviewModal(false)
    setReviewText('')
    setReviewRating(0)
    setReviewProductId(null)
    showToastMessage('Отзыв добавлен! ⭐', 'success')
  }

  const toggleFavorite = (productId) => {
    if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return }
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId))
      showToastMessage('Удалено из избранного', 'info')
    } else {
      setFavorites([...favorites, productId])
      showToastMessage('Добавлено в избранное ❤️', 'success')
    }
  }

  const sendMessage = (toUserId, message) => {
    if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return }
    const key = [currentUser.id, toUserId].sort().join('-')
    setMessages({
      ...messages,
      [key]: [...(messages[key] || []), { from: currentUser.id, to: toUserId, message, timestamp: new Date().toISOString(), read: false }]
    })
    showToastMessage('Сообщение отправлено! 💬', 'success')
  }

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Жашылча': '🥔', 'Мөмө': '🍎', 'Дан': '🌾', 'Сүт': '🥛',
      'Эт': '🥩', 'Тоок': '🐔', 'Жумуртка': '🥚', 'Бал': '🍯',
      'Тоют': '🌽', 'Жем': '🌾', 'Жер семирткич': '🧪', 'Үрөн': '🌰',
      'Техника': '🚜', 'Трактор': '🚜', 'Комбайн': '🚜',
      'Тамчылатып сугаруу': '💧', 'Күнөскана': '🏠',
      'Мал': '🐄', 'Кой': '🐑', 'Уй': '🐄', 'Жылкы': '🐴',
      'Эчки': '🐐', 'Тоок': '🐔', 'Балык': '🐟'
    }
    return emojis[category] || '🌾'
  }

  const getUrgencyEmoji = (urgency) => {
    const emojis = { 'high': '🔴', 'medium': '🟡', 'normal': '🟢' }
    return emojis[urgency] || '🟢'
  }

  const getRegionColor = (region) => {
    const colors = {
      'Баткенская область': '#FF6B6B', 'Джалал-Абадская область': '#4ECDC4',
      'Иссык-Кульская область': '#45B7D1', 'Нарынская область': '#96CEB4',
      'Ошская область': '#FFD93D', 'Таласская область': '#6C5CE7',
      'Чуйская область': '#A8E6CF'
    }
    return colors[region] || '#95A5A6'
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

  const filteredProducts = products
    .filter(p => selectedRegion === 'all' || p.region === selectedRegion)
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return p.name.toLowerCase().includes(search) || p.farmer.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)
    })
    .filter(p => {
      if (!priceFilter.min && !priceFilter.max) return true
      const price = p.price
      if (priceFilter.min && price < parseFloat(priceFilter.min)) return false
      if (priceFilter.max && price > parseFloat(priceFilter.max)) return false
      return true
    })
    .filter(p => p.rating >= ratingFilter)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0)
      return 0
    })

  const filteredRequests = requests
    .filter(r => selectedRegion === 'all' || r.region === selectedRegion)
    .filter(r => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return r.title.toLowerCase().includes(search) || r.client.toLowerCase().includes(search)
    })

  const userProducts = products.filter(p => p.farmerId === currentUser?.id)
  const userOrders = orders.filter(o => o.buyerId === currentUser?.id || o.farmerId === currentUser?.id)
  const userFavorites = products.filter(p => favorites.includes(p.id))
  const unreadNotifications = notifications.filter(n => !n.read)

  const getUserProducts = (userId) => products.filter(p => p.farmerId === userId)
  const getUserRating = (userId) => {
    const userProducts_ = getUserProducts(userId)
    if (userProducts_.length === 0) return 0
    return Math.round((userProducts_.reduce((sum, p) => sum + (p.rating || 0), 0) / userProducts_.length) * 10) / 10
  }

  const displayRegions = regions

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0'
    return price.toFixed(1)
  }

  const formatRating = (rating) => {
    if (rating === undefined || rating === null) return '0'
    return rating.toFixed(1)
  }

  return (
    <div className="app">
      {showToast && (
        <div className={`toast ${toastType}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toastType === 'success' && '✅'}
              {toastType === 'error' && '❌'}
              {toastType === 'info' && 'ℹ️'}
            </span>
            <span className="toast-message">{toastMessage}</span>
          </div>
          <button className="toast-close" onClick={() => setShowToast(false)}>✕</button>
        </div>
      )}

      <header className="header">
        <div className="header-content">
          <div className="logo-section" onClick={() => {
            setShowMyProfile(false); setShowUserProfile(null); setShowProductDetail(null); setActiveTab('products')
          }}>
            <FaLeaf className="logo-icon" />
            <h1 className="logo-text">AgroBazar</h1>
          </div>
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Товар, фермер, регион..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="header-actions">
            <button className="notif-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell />
              {unreadNotifications.length > 0 && <span className="notif-badge">{unreadNotifications.length}</span>}
            </button>
            {currentUser ? (
              <div className="user-menu">
                <button className="nav-btn" onClick={() => { setShowMyProfile(true); setActiveTab('my-products') }}>
                  <FaUser /> {currentUser.fullName}
                </button>
                <button className="nav-btn" onClick={() => setShowAddProduct(true)}><FaPlus /></button>
                <button className="nav-btn logout-btn" onClick={handleLogout}><FaSignOutAlt /></button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="btn-login" onClick={() => setShowLogin(true)}><FaUser /> Войти</button>
                <button className="btn-register" onClick={() => setShowRegister(true)}><FaLeaf /> Регистрация</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notif-header"><h3><FaBell /> Уведомления</h3>{unreadNotifications.length > 0 && <button className="mark-read-btn" onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}>Прочитать все</button>}</div>
          {notifications.length === 0 ? <div className="empty-notif">Нет уведомлений</div> : notifications.map(notif => (
            <div key={notif.id} className={`notif-item ${notif.read ? 'read' : 'unread'}`} onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))}>
              <div className="notif-message">{notif.message}</div>
              <div className="notif-time">{getTimeAgo(notif.createdAt)}</div>
            </div>
          ))}
        </div>
      )}

      {currentUser && !showMyProfile && !showUserProfile && !showProductDetail && (
        <div className="user-profile-bar">
          <div className="profile-info">
            <span className="profile-avatar">{currentUser.avatar || '🌾'}</span>
            <div className="profile-details">
              <span className="profile-name"><FaUser /> {currentUser.fullName}</span>
              <span className="profile-farm"><MdAgriculture /> {currentUser.farmName}</span>
              <span className="profile-region"><FaMapMarkerAlt /> {currentUser.region}</span>
              <span className="profile-exp"><FaStar /> {formatRating(currentUser.rating || 0)} | <FaTrophy /> {currentUser.experience || 'Опыт не указан'}</span>
            </div>
            <div className="profile-stats">
              <span><FaBox /> {userProducts.length}</span>
              <span><FaStar /> {formatRating(currentUser.rating || 0)}</span>
              <span><FaHeart /> {favorites.length}</span>
              <span><FaShoppingBag /> {userOrders.length}</span>
            </div>
          </div>
        </div>
      )}

      {!showMyProfile && !showUserProfile && !showProductDetail && (
        <>
          <div className="regions-bar">
            <div className="regions-container">
              <button className={`region-btn ${selectedRegion === 'all' ? 'active' : ''}`} onClick={() => setSelectedRegion('all')}>
                <FaGlobe /> Баардык региондор <span className="region-count">{products.length}</span>
              </button>
              {displayRegions.map(region => (
                <button key={region} className={`region-btn ${selectedRegion === region ? 'active' : ''}`} onClick={() => setSelectedRegion(region)} style={{ '--region-color': getRegionColor(region) }}>
                  <span className="region-dot" style={{ background: getRegionColor(region) }}></span>
                  {region} <span className="region-count">{products.filter(p => p.region === region).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="categories-bar">
            <div className="categories-container">
              <button className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>
                <FaTag /> Бардык категориялар
              </button>
              {categories.slice(0, 20).map(category => (
                <button key={category} className={`category-btn ${selectedCategory === category ? 'active' : ''}`} onClick={() => setSelectedCategory(category)}>
                  {getCategoryEmoji(category)} {category}
                  <span className="category-count">{products.filter(p => p.category === category).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-sort-bar">
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? <IoIosArrowUp /> : <IoIosArrowDown />} {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
            </button>
            {showFilters && (
              <div className="filters">
                <div className="filter-group"><label>Баасы от</label><input type="number" value={priceFilter.min} onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})} /></div>
                <div className="filter-group"><label>Баасы до</label><input type="number" value={priceFilter.max} onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})} /></div>
                <div className="filter-group"><label>Рейтинг</label><select value={ratingFilter} onChange={(e) => setRatingFilter(parseFloat(e.target.value))}><option value={0}>Баары</option><option value={4}>4+ ⭐</option><option value={4.5}>4.5+ ⭐</option><option value={4.8}>4.8+ ⭐</option></select></div>
                <div className="filter-group"><label>Сортировка</label><select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="newest">Жаңы</option><option value="price_asc">Баасы ↑</option><option value="price_desc">Баасы ↓</option><option value="rating">Рейтинг</option><option value="views">Көрүүлөр</option></select></div>
              </div>
            )}
          </div>

          <div className="tab-bar">
            <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
              <FaShoppingBag /> Товарлар ({filteredProducts.length})
            </button>
            <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
              <FaClipboardList /> Сатып алуу ({filteredRequests.length})
            </button>
            {currentUser && <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}><FaClipboardList /> Заказдар ({userOrders.length})</button>}
            {currentUser && <button className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}><FaHeart /> Избранное ({favorites.length})</button>}
          </div>

          <div className="stats-section">
            <div className="stat-card"><div className="stat-icon"><FaBox /></div><div className="stat-info"><h3>{products.length}</h3><p>Товарлар</p></div></div>
            <div className="stat-card"><div className="stat-icon"><FaUsers /></div><div className="stat-info"><h3>{users.length}</h3><p>Колдонуучулар</p></div></div>
            <div className="stat-card"><div className="stat-icon"><FaClipboardList /></div><div className="stat-info"><h3>{requests.length}</h3><p>Сатып алуу</p></div></div>
            <div className="stat-card"><div className="stat-icon"><FaGlobe /></div><div className="stat-info"><h3>7</h3><p>Областтар</p></div></div>
            <div className="stat-card"><div className="stat-icon"><FaTag /></div><div className="stat-info"><h3>{categories.length}</h3><p>Категориялар</p></div></div>
          </div>
        </>
      )}

      <main className="main-content">
        {showMyProfile && currentUser && (
          <div className="profile-page">
            <div className="profile-header">
              <div className="profile-cover">
                <span className="profile-cover-emoji">{currentUser.avatar || '🌾'}</span>
                <button className="btn-edit-profile" onClick={() => { setEditUserData({ ...currentUser }); setShowEditProfile(true) }}><FaEdit /> Редактировать</button>
              </div>
              <div className="profile-main">
                <div className="profile-avatar-large">{currentUser.avatar || '🌾'}</div>
                <div className="profile-main-info">
                  <h1>{currentUser.fullName}</h1>
                  <p className="profile-farm-name"><MdAgriculture /> {currentUser.farmName}</p>
                  <p className="profile-farm-type"><FaTag /> {currentUser.farmType}</p>
                  <p className="profile-location"><FaMapMarkerAlt /> {currentUser.region}</p>
                  <div className="profile-main-stats">
                    <span><FaStar /> {formatRating(currentUser.rating || 0)}</span>
                    <span><FaBox /> {userProducts.length} товаров</span>
                    <span><FaClipboardList /> {userOrders.length} заказов</span>
                    <span><FaHeart /> {favorites.length} избранных</span>
                    <span><FaTrophy /> {currentUser.experience || 'Опыт не указан'}</span>
                  </div>
                  <p className="profile-bio">{currentUser.bio || 'Расскажите о себе'}</p>
                  <div className="profile-contact">
                    <span><FaPhone /> {currentUser.phone}</span>
                    <span><FaEnvelope /> {currentUser.email || 'Не указан'}</span>
                    <span><FaGraduationCap /> {currentUser.education || 'Образование не указано'}</span>
                    <span><FaCalendarAlt /> Зарегистрирован: {currentUser.createdAt}</span>
                    {currentUser.website && <span><FaLink /> <a href={currentUser.website} target="_blank">{currentUser.website}</a></span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-tabs">
              <button className={`profile-tab-btn ${activeTab === 'my-products' ? 'active' : ''}`} onClick={() => setActiveTab('my-products')}><FaBox /> Мои товары ({userProducts.length})</button>
              <button className={`profile-tab-btn ${activeTab === 'my-orders' ? 'active' : ''}`} onClick={() => setActiveTab('my-orders')}><FaShoppingBag /> Мои заказы ({userOrders.length})</button>
              <button className={`profile-tab-btn ${activeTab === 'my-favorites' ? 'active' : ''}`} onClick={() => setActiveTab('my-favorites')}><FaHeart /> Избранное ({favorites.length})</button>
              <button className={`profile-tab-btn ${activeTab === 'my-reviews' ? 'active' : ''}`} onClick={() => setActiveTab('my-reviews')}><FaComment /> Отзывы</button>
            </div>

            <div className="profile-content">
              {activeTab === 'my-products' && (
                <div className="products-grid">
                  {userProducts.map(product => (
                    <div key={product.id} className="product-card" onClick={() => { setShowProductDetail(product); setShowMyProfile(false) }}>
                      <div className="product-image"><span className="product-emoji">{product.image}</span>{product.organic && <span className="organic-badge"><FaLeaf /> Organic</span>}</div>
                      <div className="product-body">
                        <div className="product-header"><h3>{product.name}</h3><span className="product-price">{formatPrice(product.price)} сом/{product.unit}</span></div>
                        <div className="product-meta"><span className="meta-item"><FaMapMarkerAlt /> {product.region}</span><span className="meta-item"><FaBox /> {product.quantity} {product.unit}</span><span className="meta-item"><FaStar /> {formatRating(product.rating || 0)}</span></div>
                        <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id) }}><FaTrash /> Удалить</button>
                      </div>
                    </div>
                  ))}
                  {userProducts.length === 0 && <div className="empty-state"><span className="empty-icon"><FaBox /></span><p>У вас пока нет товаров</p><button className="btn-primary" onClick={() => setShowAddProduct(true)}><FaPlus /> Добавить первый товар</button></div>}
                </div>
              )}

              {activeTab === 'my-orders' && (
                <div className="orders-grid">
                  {userOrders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header"><h4>{order.productName}</h4><span className={`order-status ${order.status}`}>{order.status === 'pending' ? '⏳ Ожидает' : order.status === 'confirmed' ? '✅ Подтвержден' : '❌ Отменен'}</span></div>
                      <div className="order-body"><p><FaBox /> Количество: {order.quantity}</p><p><FaMapMarkerAlt /> Адрес: {order.address}</p><p><FaCalendarAlt /> Дата доставки: {order.deliveryDate}</p><p><FaTag /> Оплата: {order.paymentMethod}</p><p><FaComment /> Комментарий: {order.comment || 'Нет'}</p></div>
                      <div className="order-footer"><span className="meta-item"><FaUser /> {order.buyerName}</span><span className="meta-item"><FaClock /> {getTimeAgo(order.createdAt)}</span></div>
                    </div>
                  ))}
                  {userOrders.length === 0 && <div className="empty-state"><span className="empty-icon"><FaShoppingBag /></span><p>У вас пока нет заказов</p></div>}
                </div>
              )}

              {activeTab === 'my-favorites' && (
                <div className="products-grid">
                  {userFavorites.map(product => (
                    <div key={product.id} className="product-card" onClick={() => { setShowProductDetail(product); setShowMyProfile(false) }}>
                      <div className="product-image"><span className="product-emoji">{product.image}</span></div>
                      <div className="product-body">
                        <div className="product-header"><h3>{product.name}</h3><span className="product-price">{formatPrice(product.price)} сом/{product.unit}</span></div>
                        <button className="btn-favorite active" onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }}><FaHeart /> Удалить</button>
                      </div>
                    </div>
                  ))}
                  {userFavorites.length === 0 && <div className="empty-state"><span className="empty-icon"><FaHeart /></span><p>Нет избранных товаров</p></div>}
                </div>
              )}

              {activeTab === 'my-reviews' && (
                <div className="reviews-section">
                  <h3><FaComment /> Мои отзывы</h3>
                  {Object.values(comments).flat().filter(c => c.userId === currentUser.id).length === 0 && <div className="empty-state"><span className="empty-icon"><FaComment /></span><p>У вас пока нет отзывов</p></div>}
                </div>
              )}
            </div>
          </div>
        )}

        {showUserProfile && (
          <div className="profile-page">
            <div className="profile-header">
              <div className="profile-cover"><span className="profile-cover-emoji">{showUserProfile.avatar || '🌾'}</span><button className="btn-back" onClick={() => setShowUserProfile(null)}><FaArrowLeft /> Назад</button></div>
              <div className="profile-main">
                <div className="profile-avatar-large">{showUserProfile.avatar || '🌾'}</div>
                <div className="profile-main-info">
                  <h1>{showUserProfile.fullName}</h1>
                  <p className="profile-farm-name"><MdAgriculture /> {showUserProfile.farmName}</p>
                  <p className="profile-farm-type"><FaTag /> {showUserProfile.farmType}</p>
                  <p className="profile-location"><FaMapMarkerAlt /> {showUserProfile.region}</p>
                  <p className="profile-bio">{showUserProfile.bio || 'Фермер'}</p>
                  <div className="profile-contact">
                    <span><FaPhone /> {showUserProfile.phone}</span>
                    <span><FaEnvelope /> {showUserProfile.email || 'Не указан'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="products-grid">
              {getUserProducts(showUserProfile.id).map(product => (
                <div key={product.id} className="product-card" onClick={() => { setShowProductDetail(product); setShowUserProfile(null) }}>
                  <div className="product-image"><span className="product-emoji">{product.image}</span></div>
                  <div className="product-body">
                    <div className="product-header"><h3>{product.name}</h3><span className="product-price">{formatPrice(product.price)} сом/{product.unit}</span></div>
                    <p className="product-description">{product.description.substring(0, 60)}...</p>
                    <span className="product-category">{product.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showProductDetail && (
          <div className="product-detail-page">
            <button className="btn-back" onClick={() => setShowProductDetail(null)}><FaArrowLeft /> Назад</button>
            <div className="product-detail">
              <div className="product-detail-image">
                <span className="product-detail-emoji">{showProductDetail.image}</span>
                <div className="product-detail-badge">{showProductDetail.category}</div>
                {showProductDetail.organic && <div className="product-detail-organic"><FaLeaf /> Organic</div>}
              </div>
              <div className="product-detail-info">
                <div className="product-detail-header"><h1>{showProductDetail.name}</h1><div className="product-detail-price">{formatPrice(showProductDetail.price)} сом/{showProductDetail.unit}</div></div>
                <div className="product-detail-meta">
                  <div className="meta-item"><FaUser /> {showProductDetail.farmer}</div>
                  <div className="meta-item"><FaMapMarkerAlt /> {showProductDetail.region}</div>
                  <div className="meta-item"><FaPhone /> {showProductDetail.phone}</div>
                  <div className="meta-item"><FaBox /> {showProductDetail.quantity} {showProductDetail.unit}</div>
                  <div className="meta-item"><FaStar /> {formatRating(showProductDetail.rating || 0)}</div>
                  {showProductDetail.deliveryAvailable && <div className="meta-item"><FaTruck /> Доставка</div>}
                  {showProductDetail.organic && <div className="meta-item"><FaLeaf /> Органический</div>}
                </div>
                <div className="product-detail-description"><h3>Описание</h3><p>{showProductDetail.description}</p></div>
                <div className="product-detail-actions">
                  {currentUser && <button className={`btn-favorite ${favorites.includes(showProductDetail.id) ? 'active' : ''}`} onClick={() => toggleFavorite(showProductDetail.id)}>{favorites.includes(showProductDetail.id) ? <BsFillHeartFill /> : <BsHeart />} {favorites.includes(showProductDetail.id) ? ' В избранном' : ' В избранное'}</button>}
                  <button className="btn-contact-large" onClick={() => {
                    if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return }
                    window.location.href = `tel:${showProductDetail.phone}`
                  }}><FaPhone /> Связаться</button>
                  <button className="btn-order" onClick={() => { if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return } setCurrentOrderProduct(showProductDetail); setShowOrder(true) }}><FaShoppingBag /> Заказать</button>
                  <button className="btn-review" onClick={() => { if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return } setReviewProductId(showProductDetail.id); setShowReviewModal(true) }}><FaStar /> Оставить отзыв</button>
                  {currentUser && currentUser.id === showProductDetail.farmerId && <button className="btn-delete" onClick={() => { handleDeleteProduct(showProductDetail.id); setShowProductDetail(null) }}><FaTrash /> Удалить</button>}
                </div>
                <div className="product-detail-reviews">
                  <h3><FaComment /> Отзывы ({comments[showProductDetail.id]?.length || 0})</h3>
                  {comments[showProductDetail.id] && comments[showProductDetail.id].length > 0 ? comments[showProductDetail.id].map((comment, idx) => (
                    <div key={idx} className="review-card">
                      <div className="review-header"><span className="review-user"><FaUser /> {comment.user}</span><span className="review-rating">{'⭐'.repeat(Math.round(comment.rating))}</span><span className="review-date"><FaCalendarAlt /> {comment.date}</span></div>
                      <p className="review-text">{comment.text}</p>
                    </div>
                  )) : <p className="no-reviews">Отзывов пока нет. Будьте первым!</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {!showMyProfile && !showUserProfile && !showProductDetail && activeTab === 'products' && (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card" onClick={() => setShowProductDetail(product)}>
                <div className="product-image">
                  <span className="product-emoji">{product.image}</span>
                  {favorites.includes(product.id) && <span className="product-favorite-badge"><BsFillHeartFill /></span>}
                  {product.organic && <span className="organic-badge-small"><FaLeaf /></span>}
                </div>
                <div className="product-body">
                  <div className="product-header"><h3>{product.name}</h3><span className="product-price">{formatPrice(product.price)} сом/{product.unit}</span></div>
                  <p className="product-description">{product.description.substring(0, 80)}...</p>
                  <div className="product-meta">
                    <span className="meta-item"><FaUser /> {product.farmer}</span>
                    <span className="meta-item"><FaMapMarkerAlt /> {product.region}</span>
                    <span className="meta-item"><FaStar /> {formatRating(product.rating || 0)}</span>
                    {product.deliveryAvailable && <span className="meta-item"><FaTruck /></span>}
                  </div>
                  <div className="product-tags">
                    <span className="product-category">{product.category}</span>
                    <span className="product-date"><FaCalendarAlt /> {getTimeAgo(product.createdAt)}</span>
                    {product.organic && <span className="product-tag-organic"><FaLeaf /> Organic</span>}
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && <div className="empty-state"><span className="empty-icon"><FaSearch /></span><p>Товарлар табылган жок</p></div>}
          </div>
        )}

        {!showMyProfile && !showUserProfile && !showProductDetail && activeTab === 'requests' && (
          <div className="requests-grid">
            {filteredRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <div className="request-title"><span className="request-urgency">{getUrgencyEmoji(request.urgency)}</span><h4>{request.title}</h4></div>
                  <span className="request-region"><FaMapMarkerAlt /> {request.region}</span>
                </div>
                <p className="request-description">{request.description}</p>
                <div className="request-meta">
                  <span className="meta-item"><FaUser /> {request.client}</span>
                  <span className="meta-item"><FaPhone /> {request.phone}</span>
                  <span className="meta-item"><FaBox /> {request.quantity || 'Нет'}</span>
                  <span className="request-category">{request.category}</span>
                </div>
                {currentUser && currentUser.id === request.clientId && <button className="btn-delete" onClick={() => handleDeleteRequest(request.id)}><FaTrash /> Удалить</button>}
                <button className="btn-contact-small" onClick={() => { if (!currentUser) { showToastMessage('Пожалуйста, войдите в систему!', 'error'); return } const message = prompt('Введите сообщение:'); if (message) sendMessage(request.clientId, message) }}><FaComment /> Откликнуться</button>
              </div>
            ))}
            {filteredRequests.length === 0 && <div className="empty-state"><span className="empty-icon"><FaClipboardList /></span><p>Сатып алуу жарыялары табылган жок</p></div>}
          </div>
        )}

        {!showMyProfile && !showUserProfile && !showProductDetail && activeTab === 'orders' && currentUser && (
          <div className="orders-grid">
            {userOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header"><h4>{order.productName}</h4><span className={`order-status ${order.status}`}>{order.status === 'pending' ? '⏳ Ожидает' : order.status === 'confirmed' ? '✅ Подтвержден' : '❌ Отменен'}</span></div>
                <div className="order-body"><p><FaBox /> Количество: {order.quantity}</p><p><FaMapMarkerAlt /> Адрес: {order.address}</p><p><FaCalendarAlt /> Доставка: {order.deliveryDate}</p><p><FaTag /> Оплата: {order.paymentMethod}</p></div>
                <div className="order-footer"><span className="meta-item"><FaUser /> {order.buyerName}</span><span className="meta-item"><FaClock /> {getTimeAgo(order.createdAt)}</span></div>
              </div>
            ))}
            {userOrders.length === 0 && <div className="empty-state"><span className="empty-icon"><FaShoppingBag /></span><p>Заказдар жок</p></div>}
          </div>
        )}

        {!showMyProfile && !showUserProfile && !showProductDetail && activeTab === 'favorites' && currentUser && (
          <div className="products-grid">
            {userFavorites.map(product => (
              <div key={product.id} className="product-card" onClick={() => setShowProductDetail(product)}>
                <div className="product-image"><span className="product-emoji">{product.image}</span><span className="product-favorite-badge"><BsFillHeartFill /></span></div>
                <div className="product-body">
                  <div className="product-header"><h3>{product.name}</h3><span className="product-price">{formatPrice(product.price)} сом/{product.unit}</span></div>
                  <button className="btn-favorite active" onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id) }}><FaHeart /> Удалить</button>
                </div>
              </div>
            ))}
            {userFavorites.length === 0 && <div className="empty-state"><span className="empty-icon"><FaHeart /></span><p>Избранные товары жок</p></div>}
          </div>
        )}
      </main>

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2><FaUser /> Вход</h2><button className="modal-close" onClick={() => setShowLogin(false)}>✕</button></div>
            <form onSubmit={handleLogin}>
              <div className="form-group"><label><FaUser /> Логин</label><input type="text" placeholder="Логин" value={loginData.username} onChange={(e) => setLoginData({...loginData, username: e.target.value})} required /></div>
              <div className="form-group"><label><FaSignOutAlt /> Сырсөз</label><input type="password" placeholder="Сырсөз" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} required /></div>
              <button type="submit" className="btn-submit"><FaUser /> Кирүү</button>
              <p className="form-footer">Аккаунт жок? <span className="form-link" onClick={() => { setShowLogin(false); setShowRegister(true) }}>Катталуу</span></p>
              <p className="form-footer"><small>Тест: asan/123456</small></p>
            </form>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2><FaLeaf /> Катталуу</h2><button className="modal-close" onClick={() => setShowRegister(false)}>✕</button></div>
            <form onSubmit={handleRegister}>
              <div className="form-row"><div className="form-group"><label><FaUser /> Логин *</label><input type="text" placeholder="Логин" value={registerData.username} onChange={(e) => setRegisterData({...registerData, username: e.target.value})} required /></div><div className="form-group"><label><FaSignOutAlt /> Сырсөз *</label><input type="password" placeholder="Сырсөз" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} required minLength="6" /></div></div>
              <div className="form-row"><div className="form-group"><label><FaUser /> Аты-жөнү *</label><input type="text" placeholder="Аты-жөнү" value={registerData.fullName} onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})} required /></div><div className="form-group"><label><FaPhone /> Телефон *</label><input type="tel" placeholder="+996 700 123 456" value={registerData.phone} onChange={(e) => setRegisterData({...registerData, phone: e.target.value})} required /></div></div>
              <div className="form-row"><div className="form-group"><label><FaMapMarkerAlt /> Область *</label><select value={registerData.region} onChange={(e) => setRegisterData({...registerData, region: e.target.value})} required><option value="">Область</option>{regions.map(r => <option key={r} value={r}>{r}</option>)}</select></div><div className="form-group"><label><FaMapMarkerAlt /> Район</label><input type="text" placeholder="Район" value={registerData.district} onChange={(e) => setRegisterData({...registerData, district: e.target.value})} /></div></div>
              <div className="form-row"><div className="form-group"><label><MdAgriculture /> Ферма аты</label><input type="text" placeholder="Ферма аты" value={registerData.farmName} onChange={(e) => setRegisterData({...registerData, farmName: e.target.value})} /></div><div className="form-group"><label><FaTag /> Рол</label><select value={registerData.role} onChange={(e) => setRegisterData({...registerData, role: e.target.value})}><option value="Фермер">Фермер</option><option value="Сатып алуучу">Сатып алуучу</option><option value="Кооператив">Кооператив</option><option value="Экспорттоочу">Экспорттоочу</option><option value="Транспорт">Транспорт</option></select></div></div>
              <div className="form-group"><label><FaComment /> Өзүң жөнүндө</label><textarea placeholder="Өзүң жөнүндө" value={registerData.bio} onChange={(e) => setRegisterData({...registerData, bio: e.target.value})} rows="2" /></div>
              <div className="form-group"><label><FaLeaf /> Аватар</label><div className="avatar-selector">{avatars.map(avatar => <span key={avatar} className={`avatar-option ${registerData.avatar === avatar ? 'active' : ''}`} onClick={() => setRegisterData({...registerData, avatar})}>{avatar}</span>)}</div></div>
              <button type="submit" className="btn-submit"><FaLeaf /> Катталуу</button>
              <p className="form-footer">Аккаунт бар? <span className="form-link" onClick={() => { setShowRegister(false); setShowLogin(true) }}>Кирүү</span></p>
            </form>
          </div>
        </div>
      )}

      {showAddProduct && (
        <div className="modal-overlay" onClick={() => setShowAddProduct(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2><FaPlus /> Товар кошуу</h2><button className="modal-close" onClick={() => setShowAddProduct(false)}>✕</button></div>
            <form onSubmit={handleAddProduct}>
              <div className="form-group"><label><FaTag /> Товар аты *</label><input type="text" placeholder="Товар аты" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required /></div>
              <div className="form-row"><div className="form-group"><label>Баасы (сом) *</label><input type="number" step="0.1" placeholder="Баасы" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required /></div><div className="form-group"><label>Бирдик *</label><select value={newProduct.unit} onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})} required>{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div></div>
              <div className="form-row"><div className="form-group"><label><FaBox /> Саны *</label><input type="number" placeholder="Саны" value={newProduct.quantity} onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} required /></div><div className="form-group"><label><FaMapMarkerAlt /> Область *</label><select value={newProduct.region} onChange={(e) => setNewProduct({...newProduct, region: e.target.value})} required><option value="">Область</option>{regions.map(r => <option key={r} value={r}>{r}</option>)}</select></div></div>
              <div className="form-group"><label><FaTag /> Категория *</label><select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} required><option value="">Категория</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="form-group"><label><FaComment /> Сүрөттөмө *</label><textarea placeholder="Сүрөттөмө" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} rows="3" required /></div>
              <div className="form-row"><div className="form-group checkbox-group"><label><input type="checkbox" checked={newProduct.deliveryAvailable} onChange={(e) => setNewProduct({...newProduct, deliveryAvailable: e.target.checked})} /> <FaTruck /> Жеткирүү</label></div><div className="form-group checkbox-group"><label><input type="checkbox" checked={newProduct.organic} onChange={(e) => setNewProduct({...newProduct, organic: e.target.checked})} /> <FaLeaf /> Органикалык</label></div></div>
              <button type="submit" className="btn-submit"><FaPlus /> Товар кошуу</button>
            </form>
          </div>
        </div>
      )}

      {showAddRequest && (
        <div className="modal-overlay" onClick={() => setShowAddRequest(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2><FaClipboardList /> Сатып алуу жарыясы</h2><button className="modal-close" onClick={() => setShowAddRequest(false)}>✕</button></div>
            <form onSubmit={handleAddRequest}>
              <div className="form-group"><label>Заголовок *</label><input type="text" placeholder="Заголовок" value={newRequest.title} onChange={(e) => setNewRequest({...newRequest, title: e.target.value})} required /></div>
              <div className="form-group"><label><FaComment /> Сүрөттөмө *</label><textarea placeholder="Сүрөттөмө" value={newRequest.description} onChange={(e) => setNewRequest({...newRequest, description: e.target.value})} rows="4" required /></div>
              <div className="form-row"><div className="form-group"><label><FaMapMarkerAlt /> Область *</label><select value={newRequest.region} onChange={(e) => setNewRequest({...newRequest, region: e.target.value})} required><option value="">Область</option>{regions.map(r => <option key={r} value={r}>{r}</option>)}</select></div><div className="form-group"><label><FaTag /> Категория</label><select value={newRequest.category} onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}><option value="">Категория</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div></div>
              <div className="form-row"><div className="form-group"><label><FaBox /> Көлөм</label><input type="text" placeholder="Көлөм" value={newRequest.quantity} onChange={(e) => setNewRequest({...newRequest, quantity: e.target.value})} /></div><div className="form-group"><label>Бирдик</label><select value={newRequest.unit} onChange={(e) => setNewRequest({...newRequest, unit: e.target.value})}>{units.map(u => <option key={u} value={u}>{u}</option>)}</select></div></div>
              <div className="form-group"><label>Срочность</label><select value={newRequest.urgency} onChange={(e) => setNewRequest({...newRequest, urgency: e.target.value})}><option value="normal">🟢 Обычный</option><option value="medium">🟡 Средний</option><option value="high">🔴 Срочный</option></select></div>
              <button type="submit" className="btn-submit"><FaClipboardList /> Жарыялоо</button>
            </form>
          </div>
        </div>
      )}

      {showOrder && currentOrderProduct && (
        <div className="modal-overlay" onClick={() => setShowOrder(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2><FaShoppingBag /> Заказ берүү</h2><button className="modal-close" onClick={() => setShowOrder(false)}>✕</button></div>
            <form onSubmit={handleOrder}>
              <div className="form-group"><label><FaMapMarkerAlt /> Дарек *</label><input type="text" placeholder="Дарек" value={newOrder.address} onChange={(e) => setNewOrder({...newOrder, address: e.target.value})} required /></div>
              <div className="form-group"><label><FaPhone /> Телефон *</label><input type="tel" placeholder="Телефон" value={newOrder.phone} onChange={(e) => setNewOrder({...newOrder, phone: e.target.value})} required /></div>
              <div className="form-row"><div className="form-group"><label><FaBox /> Көлөм *</label><input type="text" placeholder="Көлөм" value={newOrder.quantity} onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})} required /></div><div className="form-group"><label><FaCalendarAlt /> Жеткирүү күнү *</label><input type="date" value={newOrder.deliveryDate} onChange={(e) => setNewOrder({...newOrder, deliveryDate: e.target.value})} required /></div></div>
              <div className="form-group"><label><FaTag /> Төлөм ыкмасы</label><select value={newOrder.paymentMethod} onChange={(e) => setNewOrder({...newOrder, paymentMethod: e.target.value})}>{paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div className="form-group"><label><FaComment /> Комментарий</label><textarea placeholder="Комментарий" value={newOrder.comment} onChange={(e) => setNewOrder({...newOrder, comment: e.target.value})} rows="2" /></div>
              <button type="submit" className="btn-submit"><FaShoppingBag /> Заказ берүү</button>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FaStar /> Отзыв жаз</h2>
              <button className="modal-close" onClick={() => { setShowReviewModal(false); setReviewText(''); setReviewRating(0); }}>✕</button>
            </div>
            <div className="review-form-modal">
              <div className="form-group">
                <label>Баа</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button 
                      key={r} 
                      className={`star-btn ${reviewRating >= r ? 'active' : ''}`} 
                      onClick={() => setReviewRating(r)}
                      type="button"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label><FaComment /> Сиздин отзыв</label>
                <textarea 
                  placeholder="Товар жөнүндө оюңузду жазыңыз..." 
                  value={reviewText} 
                  onChange={(e) => setReviewText(e.target.value)} 
                  rows="4"
                />
              </div>
              <button 
                className="btn-submit" 
                onClick={() => {
                  if (reviewRating === 0) { showToastMessage('Сураныч, баа бериңиз!', 'error'); return }
                  if (!reviewText.trim()) { showToastMessage('Сураныч, текст жазыңыз!', 'error'); return }
                  handleAddComment(reviewProductId, reviewText, reviewRating)
                }}
              >
                <FaStar /> Отзыв жөнөтүү
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditProfile && currentUser && (
        <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2><FaEdit /> Профиль</h2><button className="modal-close" onClick={() => setShowEditProfile(false)}>✕</button></div>
            <form onSubmit={handleEditProfile}>
              <div className="form-row"><div className="form-group"><label><FaUser /> Аты-жөнү</label><input type="text" value={editUserData.fullName || ''} onChange={(e) => setEditUserData({...editUserData, fullName: e.target.value})} required /></div><div className="form-group"><label><FaPhone /> Телефон</label><input type="tel" value={editUserData.phone || ''} onChange={(e) => setEditUserData({...editUserData, phone: e.target.value})} required /></div></div>
              <div className="form-row"><div className="form-group"><label><FaMapMarkerAlt /> Область</label><select value={editUserData.region || ''} onChange={(e) => setEditUserData({...editUserData, region: e.target.value})} required><option value="">Область</option>{regions.map(r => <option key={r} value={r}>{r}</option>)}</select></div><div className="form-group"><label><FaEnvelope /> Email</label><input type="email" value={editUserData.email || ''} onChange={(e) => setEditUserData({...editUserData, email: e.target.value})} /></div></div>
              <div className="form-row"><div className="form-group"><label><MdAgriculture /> Ферма аты</label><input type="text" value={editUserData.farmName || ''} onChange={(e) => setEditUserData({...editUserData, farmName: e.target.value})} /></div><div className="form-group"><label><FaTag /> Тип</label><select value={editUserData.farmType || ''} onChange={(e) => setEditUserData({...editUserData, farmType: e.target.value})}><option value="">Тип</option>{farmTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div></div>
              <div className="form-group"><label><FaComment /> Өзүң жөнүндө</label><textarea value={editUserData.bio || ''} onChange={(e) => setEditUserData({...editUserData, bio: e.target.value})} rows="3" /></div>
              <button type="submit" className="btn-submit"><FaEdit /> Сактоо</button>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section"><h3><FaLeaf /> AgroBazar</h3><p>Кыргызстандын айыл чарба маркетплейси</p><p><FaUsers /> {users.length} колдонуучу</p><p><FaBox /> {products.length} товар</p></div>
          <div className="footer-section"><h4><FaGlobe /> Региондор</h4><ul>{regions.map(r => <li key={r} onClick={() => { setSelectedRegion(r); setActiveTab('products') }}>{r} ({products.filter(p => p.region === r).length})</li>)}</ul></div>
          <div className="footer-section"><h4><FaTag /> Категориялар</h4><ul>{categories.slice(0, 10).map(c => <li key={c} onClick={() => { setSelectedCategory(c); setActiveTab('products') }}>{c}</li>)}</ul></div>
          <div className="footer-section"><h4><RiCustomerService2Fill /> Байланыш</h4><p><FaEnvelope /> info@agrobazar.kg</p><p><FaPhone /> +996 700 888 999</p><div className="social-links"><span onClick={() => window.open('https://instagram.com', '_blank')}><FaInstagram /></span><span onClick={() => window.open('https://facebook.com', '_blank')}><FaFacebook /></span><span onClick={() => window.open('https://youtube.com', '_blank')}><FaYoutube /></span></div></div>
        </div>
        <div className="footer-bottom"><p>© 2026 AgroBazar. Бардык укуктар корголгон.</p></div>
      </footer>
    </div>
  )
}