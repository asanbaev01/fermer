import React, { useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaUser, FaPaperPlane, FaPhone, 
  FaVideo, FaImage, FaSmile, FaCheck, FaCheckDouble,
  FaSearch, FaCircle, FaComment, FaMicrophone,
  FaFile, FaDownload, FaCopy, FaReply, FaTrash,
  FaHeart, FaRegHeart, FaShare, FaTimes,
  FaSpinner
} from 'react-icons/fa'
import { AppContext } from '../../context/AppContext'
import EmojiPicker from 'emoji-picker-react'
import './ChatPage.css'

export default function ChatPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { currentUser, users, showToastMessage } = useContext(AppContext)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [chatUsers, setChatUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const [editingMessage, setEditingMessage] = useState(null)
  const [showCallModal, setShowCallModal] = useState(false)
  const [callType, setCallType] = useState(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedMessages, setSelectedMessages] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const savedMessages = localStorage.getItem('agrobazar_chat_messages')
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch {
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
      if (user) setSelectedUser(user)
    }
  }, [userId, users])

  useEffect(() => {
    if (currentUser) {
      setChatUsers(users.filter(u => u.id !== currentUser.id))
    }
  }, [users, currentUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isCallActive) {
      const interval = setInterval(() => setCallDuration(prev => prev + 1), 1000)
      return () => clearInterval(interval)
    }
  }, [isCallActive])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getChatMessages = (userId) => {
    if (!currentUser) return []
    const key = [currentUser.id, userId].sort().join('-')
    return messages.filter(m => m.key === key && !m.isDeleted) || []
  }

  const generateAIResponse = (messageText) => {
    const responses = [
      "Рахмат, сурооңузду түшүндүм! Мен сизге жардам берейин.",
      "Кызыктуу суроо! Бул тууралуу ойлонуп көрөлү.",
      "Макул, мен түшүндүм. Бул жерде бир нече сунуштар бар:",
      "Эн сонун идея! Мен сизди толук колдойм.",
      "Так эмес, бир аз тактап берсеңиз? Мен жардам берүүгө даярмын.",
      "Бул абдан пайдалуу суроо. Мен дароо изилдеп баштайм.",
      "Рахмат, эми түшүндүм. Келгиле, чогуу чечим табалы.",
      "Керемет суроо! Мен буга чейин ушундай ойлогон эмесмин.",
      "Менин оюмча, сиз туура айтасыз. Мына дагы бир идея:",
      "Убакыт үчүн рахмат! Мен бул боюнча көп ойлондум."
    ]
    const response = responses[Math.floor(Math.random() * responses.length)]
    const words = messageText.trim().split(' ')
    const preview = words.length > 3 ? words.slice(0, 3).join(' ') + '...' : messageText.trim()
    return `${response}\n\nСиздин билдирүүңүз: "${preview}"`
  }

  const sendMessage = useCallback((text, type = 'text', file = null) => {
    if (isSending || !selectedUser || !currentUser) return
    if (!text?.trim() && !file) return
    
    setIsSending(true)
    
    const key = [currentUser.id, selectedUser.id].sort().join('-')
    const message = {
      id: Date.now(),
      key,
      from: currentUser.id,
      to: selectedUser.id,
      text: text?.trim() || '',
      type,
      file,
      timestamp: new Date().toISOString(),
      read: false,
      liked: false,
      replyTo: replyTo?.id || null,
      isDeleted: false,
      isEdited: false,
      isAi: false
    }
    
    setMessages(prev => [...prev, message])
    setNewMessage('')
    setReplyTo(null)
    setImagePreview(null)
    inputRef.current?.focus()

    if (type === 'text' && text?.trim()) {
      setIsAiThinking(true)
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          key,
          from: selectedUser.id,
          to: currentUser.id,
          text: generateAIResponse(text),
          type: 'text',
          timestamp: new Date().toISOString(),
          read: true,
          liked: false,
          isAi: true,
          isDeleted: false,
          isEdited: false,
          replyTo: message.id
        }
        setMessages(prev => [...prev, aiMessage])
        setIsAiThinking(false)
        setIsSending(false)
      }, 1000 + Math.random() * 1500)
    } else {
      setIsSending(false)
    }
  }, [currentUser, selectedUser, replyTo, isSending])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && newMessage.trim()) {
      e.preventDefault()
      sendMessage(newMessage)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      showToastMessage('Сүрөт өлчөмү 5MB дан ашпоо керек!', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const imgData = event.target.result
      setImagePreview(imgData)
      sendMessage('Сүрөт', 'image', imgData)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      showToastMessage('Файл өлчөмү 10MB дан ашпоо керек!', 'error')
      return
    }
    sendMessage(`Файл: ${file.name}`, 'file', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    e.target.value = ''
  }

  const handleAudioRecord = () => {
    if (!isRecording) {
      setIsRecording(true)
      showToastMessage('Жазуу башталды... 5 секунд', 'info')
      setTimeout(() => {
        setIsRecording(false)
        sendMessage('Аудио билдирүү')
        showToastMessage('Жазуу аяктады', 'success')
      }, 5000)
    }
  }

  const deleteMessage = (messageId) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isDeleted: true, text: 'Бул билдирүү өчүрүлдү' } : m
    ))
    showToastMessage('Билдирүү өчүрүлдү', 'info')
  }

  const editMessage = (messageId, newText) => {
    if (!newText.trim()) return
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, text: newText.trim(), isEdited: true } : m
    ))
    setEditingMessage(null)
    showToastMessage('Билдирүү оңдолду', 'success')
  }

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => showToastMessage('Билдирүү көчүрүлдү', 'success'))
      .catch(() => showToastMessage('Көчүрүү мүмкүн болбой калды', 'error'))
  }

  const toggleLike = (messageId) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, liked: !m.liked } : m
    ))
  }

  const startCall = (type) => {
    setCallType(type)
    setShowCallModal(true)
    setTimeout(() => {
      setShowCallModal(false)
      setIsCallActive(true)
      showToastMessage(`${type === 'audio' ? 'Аудио' : 'Видео'} чалуу башталды`, 'success')
      setTimeout(() => {
        setIsCallActive(false)
        setCallDuration(0)
        showToastMessage('Чалуу аяктады', 'info')
      }, 30000)
    }, 3000)
  }

  const endCall = () => {
    setIsCallActive(false)
    setCallDuration(0)
    showToastMessage('Чалуу аяктады', 'info')
  }

  const shareMessage = (message) => {
    if (navigator.share) {
      navigator.share({
        title: 'AgroBazar билдирүү',
        text: message.text,
      }).catch(() => {})
    } else {
      copyMessage(message.text)
    }
  }

  const toggleMessageSelection = (messageId) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    )
  }

  const deleteSelectedMessages = () => {
    setMessages(prev => prev.map(m => 
      selectedMessages.includes(m.id) ? { ...m, isDeleted: true, text: 'Өчүрүлгөн' } : m
    ))
    setSelectedMessages([])
    setIsSelectionMode(false)
    showToastMessage(`${selectedMessages.length} билдирүү өчүрүлдү`, 'success')
  }

  const getLastMessage = (userId) => {
    if (!currentUser) return null
    const key = [currentUser.id, userId].sort().join('-')
    const userMessages = messages.filter(m => m.key === key && !m.isDeleted)
    return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null
  }

  const getUnreadCount = (userId) => {
    if (!currentUser) return 0
    const key = [currentUser.id, userId].sort().join('-')
    return messages.filter(m => m.key === key && !m.read && m.to === currentUser.id && !m.isDeleted).length
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    if (diff < 60000) return 'азыр'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин`
    if (diff < 86400000) return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    return `${date.getDate()}.${date.getMonth() + 1}`
  }

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const filteredUsers = chatUsers.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.farmName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!currentUser) {
    return (
      <div className="chat-page">
        <div className="chat-empty">
          <FaComment className="empty-icon" />
          <h2>Кирүү керек</h2>
          <p>Чатташуу үчүн системага кириңиз</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Башкы бетке</button>
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
            <button className="chat-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>
            <div className="chat-user-info" onClick={() => navigate(`/user/${selectedUser.id}`)}>
              <span className="chat-user-avatar">{selectedUser.avatar || '👤'}</span>
              <div>
                <div className="chat-user-name">{selectedUser.fullName}</div>
                <div className="chat-user-status">
                  {isCallActive ? (
                    <span className="call-active">Чалуу {formatCallDuration(callDuration)}</span>
                  ) : (
                    <>
                      <FaCircle className="status-online" /> Онлайн
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="chat-actions">
              <button className="chat-action-btn" onClick={() => startCall('audio')}>
                <FaPhone />
              </button>
              <button className="chat-action-btn" onClick={() => startCall('video')}>
                <FaVideo />
              </button>
              {chatMessages.length > 0 && (
                <button className="chat-action-btn" onClick={() => {
                  setIsSelectionMode(!isSelectionMode)
                  if (isSelectionMode) setSelectedMessages([])
                }}>
                  <FaCheck />
                </button>
              )}
            </div>
          </div>

          {isSelectionMode && (
            <div className="selection-toolbar">
              <span>{selectedMessages.length} тандалды</span>
              <button onClick={deleteSelectedMessages} disabled={selectedMessages.length === 0}>
                <FaTrash /> Өчүрүү
              </button>
              <button onClick={() => {
                setSelectedMessages([])
                setIsSelectionMode(false)
              }}>
                <FaTimes /> Болдурбоо
              </button>
            </div>
          )}

          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="chat-empty-messages">
                <FaComment className="empty-icon" />
                <p>Билдирүүлөр жок</p>
                <p className="empty-subtitle">{selectedUser.fullName} менен баарлаша баштаңыз</p>
              </div>
            ) : (
              chatMessages.map((msg, index) => {
                const isOwn = msg.from === currentUser.id
                const showDate = index === 0 || new Date(msg.timestamp).toDateString() !== new Date(chatMessages[index - 1]?.timestamp).toDateString()
                const isSelected = selectedMessages.includes(msg.id)
                const replyMsg = chatMessages.find(m => m.id === msg.replyTo)
                
                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="chat-date-divider">
                        {new Date(msg.timestamp).toLocaleDateString('ky-KG', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    )}
                    <div 
                      className={`chat-message ${isOwn ? 'own' : 'other'} ${isSelected ? 'selected' : ''} ${msg.isAi ? 'ai-message' : ''}`}
                      onClick={() => isSelectionMode && toggleMessageSelection(msg.id)}
                      onDoubleClick={() => {
                        if (!isSelectionMode && !msg.isAi) {
                          setReplyTo(msg)
                        }
                      }}
                    >
                      {isSelectionMode && (
                        <div className="message-select-checkbox">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleMessageSelection(msg.id)} />
                        </div>
                      )}
                      <div className="chat-message-bubble">
                        {msg.replyTo && replyMsg && (
                          <div className="message-reply">
                            <FaReply />
                            <span>{replyMsg.isDeleted ? 'Өчүрүлгөн' : replyMsg.text}</span>
                          </div>
                        )}
                        {msg.type === 'image' && msg.file && (
                          <img src={msg.file} alt="Сүрөт" className="message-image" loading="lazy" />
                        )}
                        {msg.type === 'file' && msg.file && (
                          <div className="message-file">
                            <FaFile />
                            <div>
                              <div className="file-name">{msg.file.name}</div>
                              <div className="file-size">{(msg.file.size / 1024).toFixed(0)} KB</div>
                            </div>
                            <button className="download-btn"><FaDownload /></button>
                          </div>
                        )}
                        <div className="chat-message-text">{msg.text}</div>
                        <div className="chat-message-time">
                          {formatTime(msg.timestamp)}
                          {isOwn && (
                            <span className="chat-message-status">
                              {msg.read ? <FaCheckDouble className="read" /> : <FaCheck />}
                            </span>
                          )}
                          {msg.isEdited && <span className="edited-badge">өңдөлдү</span>}
                          {msg.isAi && <span className="ai-badge">AI</span>}
                          {msg.liked && <span className="liked-badge">❤️</span>}
                        </div>
                      </div>
                      {!isSelectionMode && (
                        <div className="message-actions">
                          <button onClick={() => toggleLike(msg.id)}>
                            {msg.liked ? <FaHeart className="liked" /> : <FaRegHeart />}
                          </button>
                          <button onClick={() => setReplyTo(msg)}><FaReply /></button>
                          {isOwn && !msg.isAi && (
                            <>
                              <button onClick={() => setEditingMessage(msg.id)}><FaCheck /></button>
                              <button onClick={() => deleteMessage(msg.id)}><FaTrash /></button>
                            </>
                          )}
                          <button onClick={() => copyMessage(msg.text)}><FaCopy /></button>
                          <button onClick={() => shareMessage(msg)}><FaShare /></button>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )
              })
            )}
            {isAiThinking && (
              <div className="chat-message other ai-thinking">
                <div className="chat-message-bubble">
                  <FaSpinner className="spinner" /> AI ойлонуп жатат...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {replyTo && (
            <div className="reply-indicator">
              <div>
                <FaReply /> Жооп: {chatMessages.find(m => m.id === replyTo.id)?.text || 'Өчүрүлгөн'}
              </div>
              <button onClick={() => setReplyTo(null)}><FaTimes /></button>
            </div>
          )}

          {editingMessage && (
            <div className="edit-indicator">
              <div><FaCheck /> Билдирүү оңдолууда</div>
              <div>
                <input 
                  type="text" 
                  defaultValue={chatMessages.find(m => m.id === editingMessage)?.text || ''}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      editMessage(editingMessage, e.target.value)
                    }
                  }}
                  placeholder="Жаңы текст..."
                  autoFocus
                />
                <button onClick={() => setEditingMessage(null)}><FaTimes /></button>
              </div>
            </div>
          )}

          <div className="chat-input-area">
            <button className="chat-input-btn" onClick={() => fileInputRef.current?.click()}>
              <FaImage />
            </button>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            
            <button className="chat-input-btn" onClick={() => document.getElementById('fileUpload').click()}>
              <FaFile />
            </button>
            <input type="file" id="fileUpload" onChange={handleFileUpload} style={{ display: 'none' }} />
            
            <button className="chat-input-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <FaSmile />
            </button>
            
            <button className="chat-input-btn" onClick={handleAudioRecord}>
              <FaMicrophone className={isRecording ? 'recording' : ''} />
            </button>
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Препарат" />
                <button onClick={() => setImagePreview(null)}><FaTimes /></button>
              </div>
            )}
            
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder={isRecording ? 'Жазуу уланууда...' : 'Билдирүү жазыңыз...'}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
              disabled={isRecording}
            />
            
            <button 
              className="chat-send-btn"
              onClick={() => sendMessage(newMessage)}
              disabled={!newMessage.trim() || isRecording || isSending}
            >
              {isSending ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
            </button>
          </div>

          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <EmojiPicker 
                onEmojiClick={(emoji) => {
                  setNewMessage(prev => prev + emoji.emoji)
                  setShowEmojiPicker(false)
                }}
                theme="dark"
                width="100%"
              />
            </div>
          )}
        </div>

        {showCallModal && (
          <div className="call-modal">
            <div className="call-modal-content">
              <div className="call-animation">
                <span className="call-avatar">{selectedUser?.avatar || '👤'}</span>
                <div className="call-pulse"></div>
              </div>
              <h3>{selectedUser?.fullName}</h3>
              <p>{callType === 'audio' ? 'Аудио чалуу' : 'Видео чалуу'} байланыштыруу...</p>
              <button className="call-end-btn" onClick={() => setShowCallModal(false)}>
                <FaTimes /> Болдурбоо
              </button>
            </div>
          </div>
        )}

        {isCallActive && (
          <div className="call-active-overlay">
            <div className="call-active-content">
              <span className="call-avatar large">{selectedUser?.avatar || '👤'}</span>
              <h3>{selectedUser?.fullName}</h3>
              <p className="call-duration">{formatCallDuration(callDuration)}</p>
              <div className="call-buttons">
                <button className="call-mute-btn">🔇</button>
                <button className="call-end-btn" onClick={endCall}>📞</button>
                <button className="call-speaker-btn">🔊</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="chat-page">
      <div className="chat-list-container">
        <div className="chat-list-header">
          <button className="chat-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <h1><FaComment /> Чаты</h1>
          <div className="chat-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Издөө..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-users-list">
          {filteredUsers.length === 0 ? (
            <div className="chat-empty-users">
              <FaComment className="empty-icon" />
              <h3>Чаттар жок</h3>
              <p>Фермерлер же сатып алуучулар менен баарлаша баштаңыз</p>
            </div>
          ) : (
            filteredUsers.map(user => {
              const lastMessage = getLastMessage(user.id)
              const unreadCount = getUnreadCount(user.id)
              
              return (
                <div key={user.id} className="chat-user-item" onClick={() => navigate(`/chat/${user.id}`)}>
                  <div className="chat-user-avatar-wrapper">
                    <span className="chat-user-avatar">{user.avatar || '👤'}</span>
                    {unreadCount > 0 && <span className="chat-unread-badge">{unreadCount}</span>}
                    <span className="online-indicator"></span>
                  </div>
                  <div className="chat-user-info">
                    <div className="chat-user-name">{user.fullName}</div>
                    <div className="chat-user-last-message">
                      {lastMessage ? (
                        <span>
                          {lastMessage.from === currentUser.id && 'Сиз: '}
                          {lastMessage.isDeleted ? 'Өчүрүлгөн' : lastMessage.text}
                          {lastMessage.isAi && ' AI'}
                        </span>
                      ) : (
                        <span className="chat-no-messages">Билдирүүлөр жок</span>
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