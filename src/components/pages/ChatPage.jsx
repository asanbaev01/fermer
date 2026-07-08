// components/pages/ChatPage.jsx
import React, { useContext, useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaUser, FaPaperPlane, FaPhone, 
  FaVideo, FaImage, FaSmile, FaCheck, FaCheckDouble,
  FaSearch, FaCircle, FaComment
} from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import './ChatPage.css'

export default function ChatPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { currentUser, users, orders, products, showToastMessage } = useContext(AppContext)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [chatUsers, setChatUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const savedMessages = localStorage.getItem('agrobazar_chat_messages')
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (e) {
        localStorage.removeItem('agrobazar_chat_messages')
      }
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('agrobazar_chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (userId && users.length > 0) {
      const user = users.find(u => u.id === parseInt(userId))
      if (user) {
        setSelectedUser(user)
      }
    }
  }, [userId, users])

  useEffect(() => {
    if (currentUser) {
      const userList = users.filter(u => u.id !== currentUser.id)
      setChatUsers(userList)
    }
  }, [users, currentUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getChatMessages = (userId) => {
    if (!currentUser) return []
    const key = [currentUser.id, userId].sort().join('-')
    return messages.filter(m => m.key === key) || []
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return
    
    const key = [currentUser.id, selectedUser.id].sort().join('-')
    const message = {
      id: Date.now(),
      key: key,
      from: currentUser.id,
      to: selectedUser.id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false
    }
    
    setMessages(prev => [...prev, message])
    setNewMessage('')
    inputRef.current?.focus()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getLastMessage = (userId) => {
    const key = [currentUser?.id, userId].sort().join('-')
    const userMessages = messages.filter(m => m.key === key)
    if (userMessages.length === 0) return null
    return userMessages[userMessages.length - 1]
  }

  const getUnreadCount = (userId) => {
    const key = [currentUser?.id, userId].sort().join('-')
    return messages.filter(m => m.key === key && !m.read && m.to === currentUser?.id).length
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    if (diff < 60000) return 'только что'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин`
    if (diff < 86400000) return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    return `${date.getDate()}.${date.getMonth() + 1}`
  }

  const getChatUser = (userId) => {
    return users.find(u => u.id === userId)
  }

  const filteredUsers = chatUsers.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.farmName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!currentUser) {
    return (
      <div className="chat-page">
        <div className="chat-empty">
          <FaComment className="empty-icon" />
          <h2>Войдите в систему</h2>
          <p>Чтобы начать общение, войдите в свой аккаунт</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            На главную
          </button>
        </div>
      </div>
    )
  }

  if (selectedUser) {
    const chatMessages = getChatMessages(selectedUser.id)
    
    return (
      <div className="chat-page">
        <div className="chat-container">
          <div className="chat-header">
            <button className="chat-back-btn" onClick={() => navigate('/chat')}>
              <FaArrowLeft />
            </button>
            <div className="chat-user-info" onClick={() => navigate(`/user/${selectedUser.id}`)}>
              <span className="chat-user-avatar">{selectedUser.avatar || '👤'}</span>
              <div>
                <div className="chat-user-name">{selectedUser.fullName}</div>
                <div className="chat-user-status">
                  <FaCircle className="status-online" /> Онлайн
                </div>
              </div>
            </div>
            <div className="chat-actions">
              <button className="chat-action-btn" onClick={() => navigate(`/user/${selectedUser.id}`)}>
                <FaUser />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="chat-empty-messages">
                <FaComment className="empty-icon" />
                <p>Нет сообщений</p>
                <p className="empty-subtitle">Начните общение с {selectedUser.fullName}</p>
              </div>
            ) : (
              chatMessages.map((msg, index) => {
                const isOwn = msg.from === currentUser.id
                const showDate = index === 0 || new Date(msg.timestamp).toDateString() !== new Date(chatMessages[index - 1]?.timestamp).toDateString()
                
                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="chat-date-divider">
                        {new Date(msg.timestamp).toLocaleDateString('ru-RU', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    )}
                    <div className={`chat-message ${isOwn ? 'own' : 'other'}`}>
                      <div className="chat-message-bubble">
                        <div className="chat-message-text">{msg.text}</div>
                        <div className="chat-message-time">
                          {formatTime(msg.timestamp)}
                          {isOwn && (
                            <span className="chat-message-status">
                              {msg.read ? <FaCheckDouble /> : <FaCheck />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <button className="chat-input-btn">
              <FaImage />
            </button>
            <button className="chat-input-btn">
              <FaSmile />
            </button>
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <button 
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-page">
      <div className="chat-list-container">
        <div className="chat-list-header">
          <button className="chat-back-btn" onClick={() => navigate('/')}>
            <FaArrowLeft />
          </button>
          <h1><FaComment /> Чаты</h1>
          <div className="chat-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-users-list">
          {filteredUsers.length === 0 ? (
            <div className="chat-empty-users">
              <FaComment className="empty-icon" />
              <h3>Нет чатов</h3>
              <p>Начните общение с фермерами или покупателями</p>
            </div>
          ) : (
            filteredUsers.map(user => {
              const lastMessage = getLastMessage(user.id)
              const unreadCount = getUnreadCount(user.id)
              
              return (
                <div 
                  key={user.id} 
                  className="chat-user-item"
                  onClick={() => navigate(`/chat/${user.id}`)}
                >
                  <div className="chat-user-avatar-wrapper">
                    <span className="chat-user-avatar">{user.avatar || '👤'}</span>
                    {unreadCount > 0 && (
                      <span className="chat-unread-badge">{unreadCount}</span>
                    )}
                  </div>
                  <div className="chat-user-info">
                    <div className="chat-user-name">{user.fullName}</div>
                    <div className="chat-user-last-message">
                      {lastMessage ? (
                        <span>
                          {lastMessage.from === currentUser.id && 'Вы: '}
                          {lastMessage.text}
                        </span>
                      ) : (
                        <span className="chat-no-messages">Нет сообщений</span>
                      )}
                    </div>
                  </div>
                  <div className="chat-user-time">
                    {lastMessage && formatTime(lastMessage.timestamp)}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}