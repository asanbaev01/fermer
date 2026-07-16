// Header.jsx - Добавить, John Doe, Выйти оң жакка жылдырылды
import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaLeaf,
  FaSearch,
  FaBell,
  FaUser,
  FaPlus,
  FaSignOutAlt,
  FaHeart,
  FaShoppingCart,
  FaTrophy,
  FaChartBar,
  FaBox,
  FaComment,
  FaMapMarkerAlt,
  FaTag,
  FaGlobe,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaChevronDown,
} from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import './Header.css';

export default function Header() {
  const {
    currentUser,
    setCurrentUser,
    searchTerm,
    setSearchTerm,
    showNotifications,
    setShowNotifications,
    notifications,
    setNotifications,
    setShowLogin,
    setShowRegister,
    setShowAddProduct,
    showToastMessage,
    favorites,
    cart,
    language,
    setLanguage,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef(null);
  const langMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowNotifications]);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('agrobazar_user');
    showToastMessage('Вы вышли из системы', 'info');
    setNotifications((prev) => [
      {
        id: Date.now(),
        message: 'Вы вышли из системы',
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setShowMobileMenu(false);
  };

  const unreadNotifications = notifications.filter((n) => !n.read);

  const getTimeAgo = (date) => {
    const diff = new Date() - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'сегодня';
    if (days === 1) return 'вчера';
    if (days < 7) return `${days} дня назад`;
    if (days < 30) return `${Math.floor(days / 7)} недель назад`;
    if (days < 365) return `${Math.floor(days / 30)} месяцев назад`;
    return `${Math.floor(days / 365)} лет назад`;
  };

  const languages = [
    { code: 'ky', label: 'Кыргызча', flag: '🇰🇬' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setShowLangMenu(false);
    showToastMessage(
      `Язык изменен на ${languages.find((l) => l.code === langCode)?.label}`,
      'success'
    );
  };

  const getCurrentLangLabel = () => {
    const lang = languages.find((l) => l.code === language);
    return lang ? `${lang.flag} ${lang.label}` : '🇷🇺 Русский';
  };

  const topNavItems = [
    {
      icon: FaHeart,
      label: 'Избранное',
      path: '/favorites',
      badge: favorites?.length || 0,
    },
    {
      icon: FaShoppingCart,
      label: 'Корзина',
      path: '/cart',
      badge: cart?.length || 0,
    },
    {
      icon: FaBell,
      label: 'Уведомления',
      path: null,
      badge: unreadNotifications.length,
      isNotif: true,
    },
  ];

  const bottomNavItems = [
    { icon: FaTrophy, label: 'Рейтинг', path: '/leaderboard' },
    { icon: FaChartBar, label: 'Статистика', path: '/analytics' },
    { icon: FaBox, label: 'Заказы', path: '/orders' },
    { icon: FaComment, label: 'Чат', path: '/chat' },
    { icon: FaMapMarkerAlt, label: 'Карта', path: '/map' },
    { icon: FaTag, label: 'Скидки', path: '/discounts' },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`header ${!isHeaderVisible ? 'header-hidden' : ''} ${
          isExpanded ? 'header-expanded' : ''
        }`}
      >
        <div className="header-container">
          <div className="header-row header-row-top">
            {/* Логотип */}
            <div className="logo-wrapper" onClick={() => navigate('/')}>
              <div className="logo-icon-wrap">
                <FaLeaf className="logo-icon" />
              </div>
              <div className="logo-text-wrap">
                <h1 className="logo-main">AgroBazar</h1>
                <span className="logo-sub">АГРОБАЗАР МАРКЕТИНГС</span>
              </div>
            </div>

            {/* Search - Ортодо */}
            <div className="search-wrapper">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Товар, фермер, регион..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="search-clear" onClick={() => setSearchTerm('')}>
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* Оң жак - Тил, Тема жана Добавить/Акаунт/Выйти */}
            <div className="top-actions">
              <div className="lang-wrapper" ref={langMenuRef}>
                <button
                  className="lang-btn"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                >
                  <FaGlobe />
                  <span className="lang-label">{getCurrentLangLabel()}</span>
                </button>
                {showLangMenu && (
                  <div className="lang-dropdown">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`lang-option ${
                          language === lang.code ? 'active' : ''
                        }`}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        <span className="lang-flag">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="theme-btn"
                onClick={() => setIsDark(!isDark)}
                aria-label="Тема"
              >
                {isDark ? <FaSun /> : <FaMoon />}
              </button>

              {/* Добавить, Акаунт, Выйти - оң жакта */}
              {currentUser ? (
                <>
                  <button
                    className="nav-btn add-btn"
                    onClick={() => setShowAddProduct(true)}
                  >
                    <FaPlus />
                    <span>Добавить</span>
                  </button>
                  <button
                    className="nav-btn user-btn"
                    onClick={() => navigate('/profile')}
                  >
                    <div className="user-avatar-sm">
                      {currentUser.fullName?.charAt(0) || 'U'}
                    </div>
                    <span>{currentUser.fullName}</span>
                  </button>
                  <button
                    className="nav-btn logout-btn"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="nav-btn login-btn"
                    onClick={() => setShowLogin(true)}
                  >
                    <FaUser />
                    <span>Войти</span>
                  </button>
                  <button
                    className="nav-btn register-btn"
                    onClick={() => setShowRegister(true)}
                  >
                    <FaLeaf />
                    <span>Регистрация</span>
                  </button>
                </>
              )}

              <button
                className="mobile-toggle"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                aria-label="Меню"
              >
                {showMobileMenu ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          <div className="header-row header-row-bottom">
            <div className="nav-wrapper">
              {/* Сол жак - бош (эч нерсе жок) */}
              <div className="nav-left"></div>

              {/* Орто - Навигация (Избранное, Корзина, Уведомления, Рейтинг, Статистика, Заказы, Чат, Карта, Скидки) */}
              <div className="nav-center">
                {topNavItems.map((item, index) => (
                  <button
                    key={index}
                    className={`nav-btn ${item.isNotif ? 'notif-btn' : ''}`}
                    onClick={() => {
                      if (item.isNotif) {
                        setShowNotifications(!showNotifications);
                      } else {
                        navigate(item.path);
                      }
                    }}
                    aria-label={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </button>
                ))}
                {bottomNavItems.map((item, index) => (
                  <button
                    key={`bottom-${index}`}
                    className="nav-btn"
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Оң жак - бош */}
              <div className="nav-right"></div>
            </div>
          </div>
        </div>

        {showNotifications && (
          <div className="notifications-dropdown" ref={notifRef}>
            <div className="notif-header">
              <h3>
                <FaBell /> Уведомления
              </h3>
              {unreadNotifications.length > 0 && (
                <button
                  className="mark-read-btn"
                  onClick={() =>
                    setNotifications(
                      notifications.map((n) => ({ ...n, read: true }))
                    )
                  }
                >
                  Прочитать все
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="empty-notif">
                <FaBell className="empty-icon" />
                <p>Нет уведомлений</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                  onClick={() =>
                    setNotifications(
                      notifications.map((n) =>
                        n.id === notif.id ? { ...n, read: true } : n
                      )
                    )
                  }
                >
                  <div className="notif-message">{notif.message}</div>
                  <div className="notif-time">{getTimeAgo(notif.createdAt)}</div>
                </div>
              ))
            )}
          </div>
        )}

        {showMobileMenu && (
          <div className="mobile-menu" ref={mobileMenuRef}>
            <div className="mobile-menu-header">
              {currentUser ? (
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {currentUser.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="mobile-user-name">{currentUser.fullName}</div>
                    <div className="mobile-user-email">{currentUser.email}</div>
                  </div>
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <button
                    className="mobile-login-btn"
                    onClick={() => {
                      setShowLogin(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <FaUser /> Войти
                  </button>
                  <button
                    className="mobile-register-btn"
                    onClick={() => {
                      setShowRegister(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <FaLeaf /> Регистрация
                  </button>
                </div>
              )}
            </div>

            <div className="mobile-menu-body">
              <div className="mobile-menu-section">
                <div className="mobile-section-title">Основное</div>
                {topNavItems.map((item, index) => (
                  <button
                    key={index}
                    className="mobile-nav-link"
                    onClick={() => {
                      if (item.isNotif) {
                        setShowNotifications(!showNotifications);
                      } else {
                        navigate(item.path);
                      }
                      setShowMobileMenu(false);
                    }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="mobile-badge">{item.badge}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mobile-menu-section">
                <div className="mobile-section-title">Навигация</div>
                {bottomNavItems.map((item, index) => (
                  <button
                    key={index}
                    className="mobile-nav-link"
                    onClick={() => {
                      navigate(item.path);
                      setShowMobileMenu(false);
                    }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="mobile-menu-section">
                <div className="mobile-section-title">Действия</div>
                {currentUser && (
                  <button
                    className="mobile-nav-link add-mobile-btn"
                    onClick={() => {
                      setShowAddProduct(true);
                      setShowMobileMenu(false);
                    }}
                  >
                    <FaPlus />
                    <span>Добавить товар</span>
                  </button>
                )}
                {currentUser && (
                  <button
                    className="mobile-nav-link logout-mobile-btn"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    <span>Выйти</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <button
        className={`header-toggle-btn ${!isHeaderVisible ? 'visible' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Header көрсөтүү/жашыруу"
      >
        <FaChevronDown
          className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}
        />
      </button>
    </>
  );
}