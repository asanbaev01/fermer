// components/layout/Footer.jsx
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLeaf, FaUsers, FaBox, FaEnvelope, FaPhone, FaInstagram, FaFacebook, FaYoutube, FaGlobe, FaTag } from 'react-icons/fa'
import { RiCustomerService2Fill } from 'react-icons/ri'
import { AppContext } from '../../context/AppContext'
import './Footer.css'

export default function Footer() {
  const { products, users, setSelectedRegion, setActiveTab, setSelectedCategory } = useContext(AppContext)
  const navigate = useNavigate()

  const regions = [
    'Баткенская область', 'Джалал-Абадская область',
    'Иссык-Кульская область', 'Нарынская область',
    'Ошская область', 'Таласская область', 'Чуйская область'
  ]

  const categories = [
    'Жашылча', 'Мөмө', 'Дан', 'Сүт', 'Эт', 'Тоок', 'Жумуртка',
    'Бал', 'Тоют', 'Жем', 'Жер семирткич', 'Үрөн', 'Техника'
  ]

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3><FaLeaf /> AgroBazar</h3>
          <p>Кыргызстандын айыл чарба маркетплейси</p>
          <p><FaUsers /> {users?.length || 0} колдонуучу</p>
          <p><FaBox /> {products?.length || 0} товар</p>
        </div>
        <div className="footer-section">
          <h4><FaGlobe /> Региондор</h4>
          <ul>
            {regions.map(r => (
              <li key={r} onClick={() => { setSelectedRegion(r); setActiveTab('products'); navigate('/') }}>
                {r} ({products?.filter(p => p.region === r).length || 0})
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-section">
          <h4><FaTag /> Категориялар</h4>
          <ul>
            {categories.slice(0, 10).map(c => (
              <li key={c} onClick={() => { setSelectedCategory(c); setActiveTab('products'); navigate('/') }}>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-section">
          <h4><RiCustomerService2Fill /> Байланыш</h4>
          <p><FaEnvelope /> info@agrobazar.kg</p>
          <p><FaPhone /> +996 700 888 999</p>
          <div className="social-links">
            <span onClick={() => window.open('https://instagram.com', '_blank')}><FaInstagram /></span>
            <span onClick={() => window.open('https://facebook.com', '_blank')}><FaFacebook /></span>
            <span onClick={() => window.open('https://youtube.com', '_blank')}><FaYoutube /></span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 AgroBazar. Бардык укуктар корголгон.</p>
      </div>
    </footer>
  )
}