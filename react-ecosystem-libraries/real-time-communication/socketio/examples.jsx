/**
 * Socket.IO Examples
 * 
 * Socket.IO is a JavaScript library that enables real-time, bidirectional
 * and event-based communication between web clients and servers. It works on
 * every platform, browser or device, focusing equally on reliability and speed.
 */

// Example 1: Basic Socket.IO setup
/*
// Install Socket.IO:
// npm install socket.io-client --save

// socket/config.js
import io from 'socket.io-client';

const socketConfig = {
  url: 'http://localhost:3001',
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000
};

// Initialize Socket.IO connection
const socket = io(socketConfig.url, {
  autoConnect: socketConfig.autoConnect,
  reconnection: socketConfig.reconnection,
  reconnectionDelay: socketConfig.reconnectionDelay,
  reconnectionAttempts: socketConfig.reconnectionAttempts,
  timeout: socketConfig.timeout
});

export { socket };

// App.js
import React, { useState, useEffect } from 'react';
import { socket } from './socket/config';

function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Connection events
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to Socket.IO server');
    });
    
    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from Socket.IO server');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
    
    // Custom events
    socket.on('new-message', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });
    
    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('new-message');
    };
  }, []);
  
  const sendMessage = (message) => {
    if (connected) {
      socket.emit('message', message);
    }
  };
  
  return (
    <div>
      <h1>Socket.IO Real-time Communication</h1>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
      
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>{message.user}:</strong> {message.text}
              <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Type a message..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;
*/

// Example 2: Real-time chat with Socket.IO
/*
// hooks/useSocketIOChat.js
import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket/config';

export const useSocketIOChat = (roomName) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = socket;
    
    // Join room
    socket.emit('join-room', { room: roomName });
    
    // Connection events
    socket.on('connect', () => {
      setConnected(true);
      console.log(`Connected to Socket.IO server, joined room: ${roomName}`);
    });
    
    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from Socket.IO server');
    });
    
    // Chat events
    socket.on('new-message', (data) => {
      if (data.room === roomName) {
        setMessages(prevMessages => [...prevMessages, data]);
      }
    });
    
    socket.on('user-typing', (data) => {
      if (data.room === roomName) {
        console.log(`User ${data.user} is typing in room ${roomName}`);
      }
    });
    
    socket.on('user-stopped-typing', (data) => {
      if (data.room === roomName) {
        console.log(`User ${data.user} stopped typing in room ${roomName}`);
      }
    });
    
    // Room events
    socket.on('room-joined', (data) => {
      if (data.room === roomName) {
        console.log(`Successfully joined room ${roomName}`);
      }
    });
    
    socket.on('room-left', (data) => {
      if (data.room === roomName) {
        console.log(`Left room ${roomName}`);
      }
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('new-message');
        socketRef.current.off('user-typing');
        socketRef.current.off('user-stopped-typing');
        socketRef.current.off('room-joined');
        socketRef.current.off('room-left');
      }
    };
  }, [roomName]);
  
  const sendMessage = (message) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('send-message', {
        room: roomName,
        message,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  const startTyping = () => {
    if (socketRef.current && connected) {
      socketRef.current.emit('start-typing', { room: roomName });
      setIsTyping(true);
    }
  };
  
  const stopTyping = () => {
    if (socketRef.current && connected) {
      socketRef.current.emit('stop-typing', { room: roomName });
      setIsTyping(false);
    }
  };
  
  return { messages, connected, isTyping, sendMessage, startTyping, stopTyping };
};

// components/ChatRoom.js
import React, { useState } from 'react';
import { useSocketIOChat } from '../hooks/useSocketIOChat';

function ChatRoom({ roomName, currentUser }) {
  const [messageText, setMessageText] = useState('');
  const { messages, connected, isTyping, sendMessage, startTyping, stopTyping } = useSocketIOChat(roomName);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage({
        user: currentUser,
        text: messageText
      });
      setMessageText('');
    }
  };
  
  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };
  
  return (
    <div className="chat-room">
      <h2>Chat Room: {roomName}</h2>
      <p>Status: {connected ? 'Connected' : 'Connecting...'}</p>
      
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.user}:</strong> {message.text}
            <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      
      <div className="typing-indicator">
        {isTyping && <p>Someone is typing...</p>}
      </div>
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;
*/

// Example 3: Real-time collaboration with Socket.IO
/*
// hooks/useSocketIOCollaboration.js
import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket/config';

export const useSocketIOCollaboration = (channelName, documentId) => {
  const [document, setDocument] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [cursorPositions, setCursorPositions] = useState({});
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = socket;
    
    // Join collaboration channel
    socket.emit('join-collaboration', { channel: channelName, documentId });
    
    // Connection events
    socket.on('connect', () => {
      setConnected(true);
      console.log(`Connected to collaboration channel: ${channelName}`);
    });
    
    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from collaboration channel');
    });
    
    // Document events
    socket.on('document-updated', (data) => {
      if (data.documentId === documentId) {
        setDocument(data.content);
      }
    });
    
    // Presence events
    socket.on('user-joined', (data) => {
      if (data.channel === channelName) {
        setActiveUsers(prevUsers => [...prevUsers, data.user]);
      }
    });
    
    socket.on('user-left', (data) => {
      if (data.channel === channelName) {
        setActiveUsers(prevUsers => prevUsers.filter(user => user.id !== data.user.id));
      }
    });
    
    // Cursor position events
    socket.on('cursor-moved', (data) => {
      if (data.documentId === documentId) {
        setCursorPositions(prevPositions => ({
          ...prevPositions,
          [data.user.id]: data.position
        }));
      }
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('document-updated');
        socketRef.current.off('user-joined');
        socketRef.current.off('user-left');
        socketRef.current.off('cursor-moved');
      }
    };
  }, [channelName, documentId]);
  
  const updateDocument = (content) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('document-update', {
        channel: channelName,
        documentId,
        content,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  const moveCursor = (position) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('cursor-move', {
        channel: channelName,
        documentId,
        position,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return { document, connected, activeUsers, cursorPositions, updateDocument, moveCursor };
};

// components/CollaborativeEditor.js
import React, { useState, useEffect } from 'react';
import { useSocketIOCollaboration } from '../hooks/useSocketIOCollaboration';

function CollaborativeEditor({ channelName, documentId, currentUser }) {
  const [content, setContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { document, connected, activeUsers, cursorPositions, updateDocument, moveCursor } = useSocketIOCollaboration(channelName, documentId);
  
  useEffect(() => {
    if (document && document.content !== content) {
      setContent(document.content || '');
    }
  }, [document]);
  
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateDocument(newContent);
  };
  
  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCursorPosition({ x, y });
    moveCursor({ x, y });
  };
  
  const getUserColor = (userId) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF9800'];
    const index = activeUsers.findIndex(user => user.id === userId);
    return index >= 0 ? colors[index % colors.length] : '#000000';
  };
  
  return (
    <div className="collaborative-editor">
      <h2>Collaborative Editor</h2>
      <p>Status: {connected ? 'Connected' : 'Connecting...'}</p>
      <p>Active Users: {activeUsers.length}</p>
      
      <div className="active-users">
        {activeUsers.map(user => (
          <div key={user.id} className="user-indicator">
            <div 
              className="user-color" 
              style={{ backgroundColor: getUserColor(user.id) }}
            ></div>
            <span>{user.name}</span>
          </div>
        ))}
      </div>
      
      <div className="editor-container">
        <textarea
          value={content}
          onChange={handleContentChange}
          onMouseMove={handleMouseMove}
          placeholder="Start typing..."
        />
        
        <div 
          className="cursors"
          style={{ position: 'relative' }}
        >
          {Object.entries(cursorPositions).map(([userId, position]) => (
            <div 
              key={userId}
              className="cursor"
              style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                backgroundColor: getUserColor(userId)
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollaborativeEditor;
*/

// Example 4: Real-time notifications with Socket.IO
/*
// hooks/useSocketIONotifications.js
import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket/config';

export const useSocketIONotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = socket;
    
    // Join user-specific notification channel
    socket.emit('join-notifications', { userId });
    
    // Connection events
    socket.on('connect', () => {
      setConnected(true);
      console.log(`Connected to notifications for user ${userId}`);
    });
    
    socket.on('disconnect', () => {
      setConnected(false);
      console.log(`Disconnected from notifications for user ${userId}`);
    });
    
    // Notification events
    socket.on('new-notification', (data) => {
      if (data.userId === userId) {
        setNotifications(prevNotifications => [data, ...prevNotifications]);
      }
    });
    
    socket.on('notification-read', (data) => {
      if (data.userId === userId) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === data.id 
              ? { ...notification, read: true }
              : notification
          )
        );
      }
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('new-notification');
        socketRef.current.off('notification-read');
      }
    };
  }, [userId]);
  
  const markAsRead = (notificationId) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('mark-notification-read', { userId, notificationId });
    }
  };
  
  return { notifications, connected, markAsRead };
};

// components/NotificationCenter.js
import React from 'react';
import { useSocketIONotifications } from '../hooks/useSocketIONotifications';

function NotificationCenter({ userId }) {
  const { notifications, connected, markAsRead } = useSocketIONotifications(userId);
  
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="notification-center">
      <h2>Notifications</h2>
      <p>Status: {connected ? 'Connected' : 'Connecting...'}</p>
      <p>Unread: {unreadCount}</p>
      
      <div className="notifications">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.read ? 'read' : 'unread'}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            <small>{new Date(notification.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationCenter;
*/

// Example 5: Real-time data synchronization with Socket.IO
/*
// hooks/useSocketIOSync.js
import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket/config';

export const useSocketIOSync = (channelName, initialData) => {
  const [data, setData] = useState(initialData);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connected, setConnected] = useState(false);
  const [conflict, setConflict] = useState(false);
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = socket;
    
    // Join sync channel
    socket.emit('join-sync', { channel: channelName });
    
    // Connection events
    socket.on('connect', () => {
      setConnected(true);
      console.log(`Connected to sync channel: ${channelName}`);
    });
    
    socket.on('disconnect', () => {
      setConnected(false);
      console.log(`Disconnected from sync channel: ${channelName}`);
    });
    
    // Sync events
    socket.on('data-updated', (updateData) => {
      setData(prevData => {
        const updatedData = { ...prevData };
        
        // Apply update
        if (updateData.type === 'update') {
          updatedData[updateData.field] = updateData.value;
        } else if (updateData.type === 'delete') {
          delete updatedData[updateData.field];
        } else if (updateData.type === 'add') {
          updatedData[updateData.field] = updateData.value;
        }
        
        return updatedData;
      });
      
      setLastUpdate({
        type: updateData.type,
        field: updateData.field,
        timestamp: new Date().toISOString()
      });
    });
    
    // Conflict detection
    socket.on('conflict-detected', (data) => {
      setConflict(true);
      console.warn('Sync conflict detected:', data);
    });
    
    // Conflict resolution
    socket.on('conflict-resolved', (data) => {
      setConflict(false);
      console.log('Conflict resolved:', data);
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('data-updated');
        socketRef.current.off('conflict-detected');
        socketRef.current.off('conflict-resolved');
      }
    };
  }, [channelName, initialData]);
  
  const updateData = (field, value) => {
    if (socketRef.current && connected && !conflict) {
      socketRef.current.emit('data-update', {
        channel: channelName,
        type: 'update',
        field,
        value,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return { data, lastUpdate, connected, conflict, updateData };
};

// components/SyncedData.js
import React, { useState } from 'react';
import { useSocketIOSync } from '../hooks/useSocketIOSync';

function SyncedData() {
  const [updateField, setUpdateField] = useState('');
  const [updateValue, setUpdateValue] = useState('');
  const initialData = {
    users: [],
    settings: {
      theme: 'light',
      language: 'en'
    },
    lastSync: null
  };
  
  const { data, lastUpdate, connected, conflict, updateData } = useSocketIOSync('sync-data', initialData);
  
  const handleUpdate = () => {
    if (updateField && updateValue) {
      updateData(updateField, updateValue);
      setUpdateField('');
      setUpdateValue('');
    }
  };
  
  const resolveConflict = () => {
    if (socketRef.current && connected) {
      socketRef.current.emit('resolve-conflict', {
        channel: 'sync-data',
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return (
    <div className="synced-data">
      <h2>Real-time Data Synchronization</h2>
      
      <div className="connection-status">
        <p>Status: {connected ? 'Connected' : 'Connecting...'}</p>
        {conflict && (
          <div className="conflict-warning">
            <p>⚠️ Sync conflict detected!</p>
            <button onClick={resolveConflict}>Resolve</button>
          </div>
        )}
      </div>
      
      <div className="data-display">
        <h3>Users</h3>
        <ul>
          {data.users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
        
        <h3>Settings</h3>
        <p>Theme: {data.settings.theme}</p>
        <p>Language: {data.settings.language}</p>
      </div>
      
      <div className="last-update">
        {lastUpdate && (
          <div>
            <p>Last Update: {new Date(lastUpdate.timestamp).toLocaleString()}</p>
            <p>Type: {lastUpdate.type}</p>
            <p>Field: {lastUpdate.field}</p>
          </div>
        )}
      </div>
      
      <div className="update-controls">
        <input
          type="text"
          placeholder="Field name"
          value={updateField}
          onChange={(e) => setUpdateField(e.target.value)}
        />
        <input
          type="text"
          placeholder="New value"
          value={updateValue}
          onChange={(e) => setUpdateValue(e.target.value)}
        />
        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
}

export default SyncedData;
*/

// Example 6: Real-time analytics with Socket.IO
/*
// hooks/useSocketIOAnalytics.js
import { useEffect, useRef } from 'react';
import { socket } from '../socket/config';

export const useSocketIOAnalytics = () => {
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = socket;
    
    // Join analytics channel
    socket.emit('join-analytics');
    
    // Track page views
    const trackPageView = (page) => {
      socketRef.current.emit('page-view', {
        page,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    };
    
    // Track user interactions
    const trackInteraction = (action, target, value) => {
      socketRef.current.emit('user-interaction', {
        action,
        target,
        value,
        timestamp: new Date().toISOString()
      });
    };
    
    // Track performance metrics
    const trackPerformance = (metric, value) => {
      socketRef.current.emit('performance-metric', {
        metric,
        value,
        timestamp: new Date().toISOString()
      });
    };
    
    // Expose tracking functions globally
    window.analytics = {
      trackPageView,
      trackInteraction,
      trackPerformance
    };
    
    return () => {
      delete window.analytics;
    };
  }, []);
  
  return null;
};

// components/AnalyticsTracker.js
import React, { useEffect } from 'react';
import { useSocketIOAnalytics } from '../hooks/useSocketIOAnalytics';

function AnalyticsTracker() {
  useSocketIOAnalytics();
  
  useEffect(() => {
    // Track page view
    if (window.analytics) {
      window.analytics.trackPageView(window.location.pathname);
    }
    
    // Track user interactions
    const handleClick = (event) => {
      if (window.analytics) {
        window.analytics.trackInteraction('click', {
          tagName: event.target.tagName,
          id: event.target.id,
          className: event.target.className
        });
      }
    };
    
    // Track performance
    const trackLoadTime = () => {
      if (window.analytics && window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        window.analytics.trackPerformance('page_load_time', loadTime);
      }
    };
    
    document.addEventListener('click', handleClick);
    window.addEventListener('load', trackLoadTime);
    
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('load', trackLoadTime);
    };
  }, []);
  
  return null; // This component doesn't render anything
}

export default AnalyticsTracker;
*/

// Example 7: Socket.IO authentication and authorization
/*
// socket/auth.js
import { socket } from './config';

export const authenticateWithSocketIO = (token) => {
  return new Promise((resolve, reject) => {
    // Connect with authentication token
    const authSocket = io(socket.url, {
      auth: {
        token: token
      }
    });
    
    authSocket.on('connect', () => {
      console.log('Authenticated with Socket.IO');
      resolve(authSocket);
    });
    
    authSocket.on('connect_error', (error) => {
      console.error('Authentication failed:', error);
      reject(new Error('Authentication failed'));
    });
    
    authSocket.on('disconnect', () => {
      console.log('Disconnected from authenticated Socket.IO');
    });
  });
};

// socket/middleware.js
import { socket } from './config';

export const socketMiddleware = (socket) => {
  // Authentication middleware
  socket.use((packet, next) => {
    if (packet.event === 'authenticate') {
      // Validate authentication token
      if (isValidToken(packet.data.token)) {
        next();
      } else {
        next(new Error('Invalid authentication token'));
      }
    } else {
      next();
    }
  });
  
  // Rate limiting middleware
  const rateLimiter = new Map();
  
  socket.use((packet, next) => {
    const clientId = packet.handshake.query.clientId;
    const now = Date.now();
    
    if (!rateLimiter.has(clientId)) {
      rateLimiter.set(clientId, []);
    }
    
    const requests = rateLimiter.get(clientId);
    const timeWindow = 60000; // 1 minute
    
    // Remove old requests outside time window
    const validRequests = requests.filter(time => now - time < timeWindow);
    
    if (validRequests.length >= 100) {
      return next(new Error('Rate limit exceeded'));
    }
    
    validRequests.push(now);
    rateLimiter.set(clientId, validRequests);
    
    next();
  });
  
  // Logging middleware
  socket.use((packet, next) => {
    console.log(`[${new Date().toISOString()}] ${packet.event}:`, packet.data);
    next();
  });
};

// components/AuthenticatedApp.js
import React, { useState, useEffect } from 'react';
import { authenticateWithSocketIO } from '../socket/auth';
import { socketMiddleware } from '../socket/middleware';

function AuthenticatedApp() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const authSocket = await authenticateWithSocketIO(token);
      
      // Apply middleware
      socketMiddleware(authSocket);
      
      setUser({ id: 'user123', name: 'John Doe' });
      setIsAuthenticated(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="authenticated-app">
      <h1>Socket.IO Authentication</h1>
      
      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Token:</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter authentication token"
            />
          </div>
          
          <div className="form-group">
            <button type="submit">Authenticate</button>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </form>
      ) : (
        <div className="authenticated-content">
          <h2>Welcome, {user.name}!</h2>
          <p>Successfully authenticated with Socket.IO</p>
          <button onClick={() => {
            setUser(null);
            setIsAuthenticated(false);
            setToken('');
          }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default AuthenticatedApp;
*/

// Example 8: Socket.IO rooms and namespaces
/*
// socket/namespaces.js
import { io } from './config';

// Connect to specific namespace
export const connectToNamespace = (namespace) => {
  return io(`${socket.url}/${namespace}`, {
    autoConnect: true
  });
};

// Connect to admin namespace
export const adminSocket = connectToNamespace('admin');

// Connect to chat namespace
export const chatSocket = connectToNamespace('chat');

// hooks/useSocketIORooms.js
import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket/config';

export const useSocketIORooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  
  useEffect(() => {
    socketRef.current = socket;
    
    // Connection events
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to Socket.IO server');
    });
    
    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from Socket.IO server');
    });
    
    // Room events
    socket.on('rooms-list', (data) => {
      setRooms(data.rooms);
    });
    
    socket.on('room-joined', (data) => {
      console.log(`Joined room: ${data.room}`);
      setCurrentRoom(data.room);
    });
    
    socket.on('room-left', (data) => {
      console.log(`Left room: ${data.room}`);
      if (currentRoom === data.room) {
        setCurrentRoom('');
      }
    });
    
    socket.on('room-message', (data) => {
      console.log(`Message in room ${data.room}: ${data.message}`);
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('rooms-list');
        socketRef.current.off('room-joined');
        socketRef.current.off('room-left');
        socketRef.current.off('room-message');
      }
    };
  }, []);
  
  const joinRoom = (roomName) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('join-room', { room: roomName });
    }
  };
  
  const leaveRoom = () => {
    if (socketRef.current && connected && currentRoom) {
      socketRef.current.emit('leave-room', { room: currentRoom });
    }
  };
  
  const sendMessage = (message) => {
    if (socketRef.current && connected && currentRoom) {
      socketRef.current.emit('room-message', {
        room: currentRoom,
        message,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return { rooms, currentRoom, connected, joinRoom, leaveRoom, sendMessage };
};

// components/RoomManager.js
import React, { useState } from 'react';
import { useSocketIORooms } from '../hooks/useSocketIORooms';

function RoomManager() {
  const [newRoomName, setNewRoomName] = useState('');
  const { rooms, currentRoom, connected, joinRoom, leaveRoom, sendMessage } = useSocketIORooms();
  
  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      joinRoom(newRoomName);
      setNewRoomName('');
    }
  };
  
  return (
    <div className="room-manager">
      <h2>Socket.IO Room Manager</h2>
      <p>Status: {connected ? 'Connected' : 'Connecting...'}</p>
      <p>Current Room: {currentRoom || 'None'}</p>
      
      <div className="available-rooms">
        <h3>Available Rooms</h3>
        <ul>
          {rooms.map(room => (
            <li key={room}>
              {room}
              {currentRoom === room && (
                <button onClick={() => leaveRoom()}>Leave</button>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <form onSubmit={handleCreateRoom} className="create-room">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter room name"
        />
        <button type="submit">Create Room</button>
      </form>
      
      {currentRoom && (
        <div className="current-room">
          <h3>Current Room: {currentRoom}</h3>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button onClick={() => sendMessage(document.querySelector('.message-input input').value)}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomManager;
*/

// Example 9: Socket.IO error handling and reconnection
/*
// hooks/useSocketIOWithErrorHandling.js
import { useState, useEffect, useRef } from 'react';
import { socket } from '../socket/config';

export const useSocketIOWithErrorHandling = (options = {}) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const socketRef = useRef(null);
  
  useEffect(() => {
    const connect = () => {
      const newSocket = io(socket.url, {
        autoConnect: options.autoConnect !== false,
        reconnection: true,
        reconnectionDelay: options.reconnectionDelay || 1000,
        reconnectionAttempts: options.maxReconnectAttempts || 5,
        timeout: options.timeout || 20000
      });
      
      socketRef.current = newSocket;
      setupSocketListeners(newSocket);
    };
    
    const setupSocketListeners = (socketInstance) => {
      // Connection events
      socketInstance.on('connect', () => {
        setConnected(true);
        setError(null);
        setReconnectAttempts(0);
        console.log('Connected to Socket.IO server');
      });
      
      socketInstance.on('disconnect', (reason) => {
        setConnected(false);
        setError(`Disconnected: ${reason}`);
        console.log(`Disconnected from Socket.IO: ${reason}`);
      });
      
      socketInstance.on('connect_error', (error) => {
        setError(`Connection error: ${error.message}`);
        console.error('Socket.IO connection error:', error);
      });
      
      socketInstance.on('reconnect', (attemptNumber) => {
        console.log(`Reconnection attempt ${attemptNumber}`);
        setReconnectAttempts(attemptNumber);
      });
      
      socketInstance.on('reconnect_failed', (error) => {
        setError(`Reconnection failed: ${error.message}`);
        console.error('Socket.IO reconnection failed:', error);
      });
      
      socketInstance.on('reconnect_attempt', (attemptNumber) => {
        console.log(`Reconnection attempt ${attemptNumber}`);
      });
    };
    
    connect();
  };
  
  useEffect(() => {
    connect();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off();
      }
    };
  }, [options]);
  
  const manualReconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      setTimeout(() => {
        connect();
      }, 1000);
    }
  };
  
  return { connected, error, reconnectAttempts, manualReconnect };
};

// components/ResilientSocket.js
import React from 'react';
import { useSocketIOWithErrorHandling } from '../hooks/useSocketIOWithErrorHandling';

function ResilientSocket() {
  const { connected, error, reconnectAttempts, manualReconnect } = useSocketIOWithErrorHandling({
    maxReconnectAttempts: 10,
    reconnectionDelay: 2000
  });
  
  return (
    <div className="resilient-socket">
      <h2>Resilient Socket.IO Connection</h2>
      
      <div className="connection-status">
        {connected ? (
          <p className="connected">✅ Connected</p>
        ) : error ? (
          <p className="error">❌ Error: {error}</p>
        ) : (
          <p className="connecting">🔄 Connecting... (Attempt {reconnectAttempts})</p>
        )}
      </div>
      
      <div className="controls">
        <button onClick={manualReconnect} disabled={connected}>
          {connected ? 'Disconnect' : 'Manual Reconnect'}
        </button>
      </div>
      
      <div className="logs">
        <h3>Connection Logs</h3>
        <div className="log-entry">
          Status: {connected ? 'Connected' : 'Disconnected'}
          {error && `Error: ${error}`}
          Reconnect Attempts: {reconnectAttempts}
        </div>
      </div>
    </div>
  );
}

export default ResilientSocket;
*/

export const socketIOExamples = {
  description: "Examples of using Socket.IO for real-time bidirectional communication",
  installation: "npm install socket.io-client --save",
  concepts: [
    "WebSocket communication with fallbacks",
    "Event-driven architecture",
    "Namespaces for logical separation",
    "Rooms for multi-client communication",
    "Authentication and authorization",
    "Middleware for request processing"
  ],
  benefits: [
    "Real-time bidirectional communication",
    "Automatic reconnection",
    "Cross-browser compatibility",
    "Low latency",
    "Built-in compression",
    "Binary and text support",
    "Easy integration with frameworks"
  ],
  patterns: [
    "Real-time chat applications",
    "Collaborative editing",
    "Live notifications",
    "Data synchronization",
    "Multiplayer games",
    "Analytics tracking",
    "Room management",
    "Error handling and reconnection"
  ],
  bestPractices: [
    "Handle connection states properly",
    "Implement error handling and reconnection",
    "Use appropriate event names",
    "Validate data on client and server",
    "Use rooms for logical separation",
    "Implement authentication for private channels",
    "Optimize for performance",
    "Clean up event listeners",
    "Monitor connection health"
  ]
};