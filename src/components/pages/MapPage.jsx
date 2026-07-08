// components/pages/MapPage.jsx
import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaMapMarkerAlt, FaSearch, FaLocationArrow,
  FaTimes, FaExpand, FaCompress, FaUser
} from 'react-icons/fa'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { AppContext } from '../../context/AppContext'
import 'leaflet/dist/leaflet.css'
import './MapPage.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const defaultCenter = [42.8746, 74.5698]

function ChangeView({ center, zoom }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

function FlyToLocation({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.5 })
    }
  }, [center, zoom, map])
  return null
}

export default function MapPage() {
  const navigate = useNavigate()
  const { products, selectedRegion, showToastMessage } = useContext(AppContext)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [center, setCenter] = useState(defaultCenter)
  const [zoom, setZoom] = useState(10)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapRef, setMapRef] = useState(null)

  const filteredProducts = products
    .filter(p => {
      if (!searchTerm) return true
      const search = searchTerm.toLowerCase()
      return p.name.toLowerCase().includes(search) || 
             p.farmer.toLowerCase().includes(search) ||
             p.category.toLowerCase().includes(search)
    })
    .filter(p => selectedRegion === 'all' || p.region === selectedRegion)
    .filter(p => p.coordinates)

  const getCategoryIcon = (category) => {
    const icons = {
      'Жашылча': '🥬',
      'Мөмө': '🍎',
      'Дан': '🌾',
      'Сүт': '🥛',
      'Эт': '🥩',
      'Тоок': '🐔',
      'Жумуртка': '🥚',
      'Бал': '🍯'
    }
    return icons[category] || '📍'
  }

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = [position.coords.latitude, position.coords.longitude]
          setCenter(newCenter)
          setZoom(15)
          showToastMessage('📍 Ваше местоположение определено!', 'success')
        },
        () => {
          showToastMessage('Не удалось определить местоположение', 'error')
        }
      )
    } else {
      showToastMessage('Геолокация не поддерживается', 'error')
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      document.querySelector('.map-container-wrapper')?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  const handleProductClick = (product) => {
    if (product.coordinates) {
      const coords = product.coordinates.split(',').map(Number)
      setCenter([coords[0], coords[1]])
      setZoom(15)
      setSelectedProduct(product)
    }
  }

  return (
    <div className={`map-page ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="map-header">
        <button className="map-back-btn" onClick={() => navigate('/')}>
          <FaArrowLeft /> Назад
        </button>
        <h1><FaMapMarkerAlt /> Карта товаров</h1>
        <div className="map-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Поиск на карте..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="map-locate-btn" onClick={handleLocateMe}>
            <FaLocationArrow />
          </button>
          <button className="map-fullscreen-btn" onClick={toggleFullscreen}>
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      <div className="map-container-wrapper">
        <div className="map-container-box">
          <MapContainer
            center={defaultCenter}
            zoom={10}
            className="map-container"
            ref={setMapRef}
          >
            <ChangeView center={center} zoom={zoom} />
            <FlyToLocation center={center} zoom={zoom} />
            
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredProducts.map((product) => {
              if (!product.coordinates) return null
              const coords = product.coordinates.split(',').map(Number)
              if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return null
              
              return (
                <Marker
                  key={product.id}
                  position={[coords[0], coords[1]]}
                  eventHandlers={{
                    click: () => setSelectedProduct(product)
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="map-popup" onClick={() => navigate(`/product/${product.id}`)}>
                      <div className="popup-emoji">{product.image}</div>
                      <h4>{product.name}</h4>
                      <p className="popup-price">{product.price} сом/{product.unit}</p>
                      <p className="popup-farmer"><FaUser /> {product.farmer}</p>
                      <p className="popup-region"><FaMapMarkerAlt /> {product.region}</p>
                      <button className="popup-btn">Подробнее →</button>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>

          {selectedProduct && (
            <div className="map-selected-info">
              <button className="map-selected-close" onClick={() => setSelectedProduct(null)}>
                <FaTimes />
              </button>
              <div className="selected-content">
                <span className="selected-emoji">{selectedProduct.image}</span>
                <h3>{selectedProduct.name}</h3>
                <p className="selected-price">{selectedProduct.price} сом/{selectedProduct.unit}</p>
                <p className="selected-farmer"><FaUser /> {selectedProduct.farmer}</p>
                <p className="selected-region"><FaMapMarkerAlt /> {selectedProduct.region}</p>
                <button 
                  className="selected-btn"
                  onClick={() => navigate(`/product/${selectedProduct.id}`)}
                >
                  Перейти к товару
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="map-sidebar">
          <div className="map-stats">
            <div className="stat-icon"><FaMapMarkerAlt /></div>
            <div>
              <span className="stat-number">{filteredProducts.length}</span>
              <span className="stat-label">Товаров на карте</span>
            </div>
          </div>
          
          <div className="map-categories">
            {['Жашылча', 'Мөмө', 'Сүт', 'Эт', 'Бал'].map(cat => {
              const count = filteredProducts.filter(p => p.category === cat).length
              if (count === 0) return null
              return (
                <div key={cat} className="map-category-item">
                  <span className="cat-emoji">{getCategoryIcon(cat)}</span>
                  <span className="cat-name">{cat}</span>
                  <span className="cat-count">{count}</span>
                </div>
              )
            })}
          </div>

          <div className="map-products-list">
            {filteredProducts.slice(0, 10).map(product => (
              <div 
                key={product.id} 
                className={`map-product-item ${selectedProduct?.id === product.id ? 'active' : ''}`}
                onClick={() => handleProductClick(product)}
              >
                <span className="product-emoji">{product.image}</span>
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">{product.price} сом</span>
                </div>
                <FaMapMarkerAlt className="product-loc-icon" />
              </div>
            ))}
            {filteredProducts.length > 10 && (
              <div className="map-more">
                + еще {filteredProducts.length - 10} товаров
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}