/**
 * Pusher Examples
 * 
 * Pusher is a hosted API that makes it easy to add real-time
 * functionality to web and mobile applications. It provides WebSocket
 * connections with fallbacks for browsers that don't support WebSockets.
 */

// Example 1: Basic Pusher setup
/*
// Install Pusher:
// npm install pusher-js --save

// pusher/config.js
import Pusher from 'pusher-js';

const pusherConfig = {
  cluster: 'your-cluster',
  key: 'your-pusher-key',
  forceTLS: true
};

// Initialize Pusher
const pusher = new Pusher(pusherConfig.key, {
  cluster: pusherConfig.cluster,
  forceTLS: pusherConfig.forceTLS
});

export { pusher };

// App.js
import React, { useState, useEffect } from 'react';
import { pusher } from './pusher/config';

function App() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    // Subscribe to a channel
    const channel = pusher.subscribe('my-channel');
    
    // Listen for connection events
    pusher.connection.bind('connected', () => {
      setConnected(true);
      console.log('Connected to Pusher!');
    });
    
    pusher.connection.bind('disconnected', () => {
      setConnected(false);
      console.log('Disconnected from Pusher');
    });
    
    // Listen for new messages
    channel.bind('new-message', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });
    
    // Cleanup
    return () => {
      channel.unbind_all();
      pusher.connection.unbind_all();
    };
  }, []);
  
  return (
    <div>
      <h1>Pusher Real-time Communication</h1>
      <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
      
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>{message.user}:</strong> {message.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
*/

// Example 2: Real-time chat with Pusher
/*
// hooks/usePusherChat.js
import { useState, useEffect, useRef } from 'react';
import { pusher } from '../pusher/config';

export const usePusherChat = (channelName) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef(null);
  
  useEffect(() => {
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;
    
    // Connection events
    channel.bind('pusher:subscription_succeeded', () => {
      setConnected(true);
      console.log(`Subscribed to ${channelName}`);
    });
    
    channel.bind('pusher:subscription_error', (err) => {
      console.error(`Subscription error: ${err}`);
    });
    
    // Chat events
    channel.bind('new-message', (data) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });
    
    channel.bind('user-typing', (data) => {
      console.log(`User ${data.user} is typing`);
    });
    
    channel.bind('user-stopped-typing', (data) => {
      console.log(`User ${data.user} stopped typing`);
    });
    
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
    };
  }, [channelName]);
  
  const sendMessage = (message) => {
    if (channelRef.current && connected) {
      // Trigger client event
      channelRef.current.trigger('client-new-message', message);
    }
  };
  
  const startTyping = (user) => {
    if (channelRef.current && connected) {
      channelRef.current.trigger('client-typing', { user });
    }
  };
  
  const stopTyping = (user) => {
    if (channelRef.current && connected) {
      channelRef.current.trigger('client-stopped-typing', { user });
    }
  };
  
  return { messages, connected, sendMessage, startTyping, stopTyping };
};

// components/ChatRoom.js
import React, { useState } from 'react';
import { usePusherChat } from '../hooks/usePusherChat';

function ChatRoom({ channelName, currentUser }) {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { messages, connected, sendMessage, startTyping, stopTyping } = usePusherChat(channelName);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage({
        user: currentUser,
        text: messageText,
        timestamp: new Date().toISOString()
      });
      setMessageText('');
    }
  };
  
  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    
    if (e.target.value.trim()) {
      startTyping(currentUser);
    } else {
      stopTyping(currentUser);
    }
  };
  
  return (
    <div className="chat-room">
      <h2>Chat Room: {channelName}</h2>
      <p>Status: {connected ? 'Connected' : 'Connecting...'}</p>
      
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.user}:</strong> {message.text}
            <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
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

// Example 3: Real-time collaboration with Pusher
/*
// hooks/usePusherCollaboration.js
import { useState, useEffect, useRef } from 'react';
import { pusher } from '../pusher/config';

export const usePusherCollaboration = (channelName, documentId) => {
  const [document, setDocument] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const channelRef = useRef(null);
  
  useEffect(() => {
    const channel = pusher.subscribe(`presence-${channelName}`);
    channelRef.current = channel;
    
    // Connection events
    channel.bind('pusher:subscription_succeeded', () => {
      setConnected(true);
      console.log(`Subscribed to ${channelName}`);
    });
    
    // Document events
    channel.bind('document-updated', (data) => {
      if (data.documentId === documentId) {
        setDocument(data.content);
      }
    });
    
    // Presence events
    channel.bind('pusher:member_added', (member) => {
      setActiveUsers(prevUsers => [...prevUsers, member]);
    });
    
    channel.bind('pusher:member_removed', (member) => {
      setActiveUsers(prevUsers => prevUsers.filter(user => user.id !== member.id));
    });
    
    // Cursor position events
    channel.bind('cursor-moved', (data) => {
      if (data.documentId === documentId) {
        console.log(`User ${data.user} moved cursor to position ${data.position}`);
      }
    });
    
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
    };
  }, [channelName, documentId]);
  
  const updateDocument = (content) => {
    if (channelRef.current && connected) {
      channelRef.current.trigger('client-document-update', {
        documentId,
        content,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  const moveCursor = (position) => {
    if (channelRef.current && connected) {
      channelRef.current.trigger('client-cursor-move', {
        documentId,
        position,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return { document, connected, activeUsers, updateDocument, moveCursor };
};

// components/CollaborativeEditor.js
import React, { useState, useEffect } from 'react';
import { usePusherCollaboration } from '../hooks/usePusherCollaboration';

function CollaborativeEditor({ channelName, documentId, currentUser }) {
  const [content, setContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const { document, connected, activeUsers, updateDocument, moveCursor } = usePusherCollaboration(channelName, documentId);
  
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
          className="cursor"
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            backgroundColor: getUserColor(currentUser.id)
          }}
        ></div>
      </div>
    </div>
  );
}

export default CollaborativeEditor;
*/

// Example 4: Real-time notifications with Pusher
/*
// hooks/usePusherNotifications.js
import { useState, useEffect, useRef } from 'react';
import { pusher } from '../pusher/config';

export const usePusherNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef(null);
  
  useEffect(() => {
    const channel = pusher.subscribe(`private-notifications-${userId}`);
    channelRef.current = channel;
    
    // Connection events
    channel.bind('pusher:subscription_succeeded', () => {
      setConnected(true);
      console.log(`Subscribed to notifications for user ${userId}`);
    });
    
    // Notification events
    channel.bind('new-notification', (data) => {
      setNotifications(prevNotifications => [data, ...prevNotifications]);
    });
    
    channel.bind('notification-read', (data) => {
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === data.id 
            ? { ...notification, read: true }
            : notification
        )
      );
    });
    
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
    };
  }, [userId]);
  
  const markAsRead = (notificationId) => {
    if (channelRef.current && connected) {
      channelRef.current.trigger('client-notification-read', { notificationId });
    }
  };
  
  return { notifications, connected, markAsRead };
};

// components/NotificationCenter.js
import React from 'react';
import { usePusherNotifications } from '../hooks/usePusherNotifications';

function NotificationCenter({ userId }) {
  const { notifications, connected, markAsRead } = usePusherNotifications(userId);
  
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

// Example 5: Real-time data synchronization with Pusher
/*
// hooks/usePusherSync.js
import { useState, useEffect, useRef } from 'react';
import { pusher } from '../pusher/config';

export const usePusherSync = (channelName, initialData) => {
  const [data, setData] = useState(initialData);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef(null);
  
  useEffect(() => {
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;
    
    // Connection events
    channel.bind('pusher:subscription_succeeded', () => {
      setConnected(true);
      console.log(`Subscribed to ${channelName}`);
    });
    
    // Sync events
    channel.bind('data-updated', (updateData) => {
      setData(prevData => {
        const updatedData = { ...prevData };
        
        // Apply the update
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
    
    // Request initial sync
    channel.trigger('client-sync-request', {
      requestId: Date.now(),
      timestamp: new Date().toISOString()
    });
    
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
    };
  }, [channelName, initialData]);
  
  const updateData = (field, value) => {
    if (channelRef.current && connected) {
      channelRef.current.trigger('client-data-update', {
        type: 'update',
        field,
        value,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return { data, lastUpdate, connected, updateData };
};

// components/SyncedData.js
import React, { useState } from 'react';
import { usePusherSync } from '../hooks/usePusherSync';

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
  
  const { data, lastUpdate, connected, updateData } = usePusherSync('sync-data', initialData);
  
  const handleUpdate = () => {
    if (updateField && updateValue) {
      updateData(updateField, updateValue);
      setUpdateField('');
      setUpdateValue('');
    }
  };
  
  return (
    <div className="synced-data">
      <h2>Real-time Data Synchronization</h2>
      <p>Status: {connected ? 'Connected' : 'Connecting...'}</p>
      
      {lastUpdate && (
        <div className="last-update">
          <p>Last Update: {new Date(lastUpdate.timestamp).toLocaleString()}</p>
          <p>Type: {lastUpdate.type}</p>
          <p>Field: {lastUpdate.field}</p>
        </div>
      )}
      
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

// Example 6: Real-time analytics with Pusher
/*
// hooks/usePusherAnalytics.js
import { useEffect, useRef } from 'react';
import { pusher } from '../pusher/config';

export const usePusherAnalytics = () => {
  const channelRef = useRef(null);
  
  useEffect(() => {
    const channel = pusher.subscribe('analytics');
    channelRef.current = channel;
    
    // Track page views
    const trackPageView = (page) => {
      channel.trigger('client-page-view', {
        page,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    };
    
    // Track user interactions
    const trackInteraction = (action, target, value) => {
      channel.trigger('client-interaction', {
        action,
        target,
        value,
        timestamp: new Date().toISOString()
      });
    };
    
    // Track performance metrics
    const trackPerformance = (metric, value) => {
      channel.trigger('client-performance', {
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
import { usePusherAnalytics } from '../hooks/usePusherAnalytics';

function AnalyticsTracker() {
  usePusherAnalytics();
  
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

// Example 7: Real-time multiplayer game with Pusher
/*
// hooks/usePusherGame.js
import { useState, useEffect, useRef } from 'react';
import { pusher } from '../pusher/config';

export const usePusherGame = (gameId) => {
  const [gameState, setGameState] = useState({
    players: [],
    started: false,
    score: {}
  });
  const [connected, setConnected] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const channelRef = useRef(null);
  
  useEffect(() => {
    const channel = pusher.subscribe(`game-${gameId}`);
    channelRef.current = channel;
    
    // Connection events
    channel.bind('pusher:subscription_succeeded', () => {
      setConnected(true);
      console.log(`Subscribed to game ${gameId}`);
    });
    
    // Game events
    channel.bind('player-joined', (data) => {
      setGameState(prevState => ({
        ...prevState,
        players: [...prevState.players, data.player]
      }));
    });
    
    channel.bind('player-left', (data) => {
      setGameState(prevState => ({
        ...prevState,
        players: prevState.players.filter(p => p.id !== data.playerId)
      }));
    });
    
    channel.bind('game-started', () => {
      setGameState(prevState => ({
        ...prevState,
        started: true
      }));
    });
    
    channel.bind('player-action', (data) => {
      setGameState(prevState => {
        const newScore = { ...prevState.score };
        newScore[data.playerId] = (newScore[data.playerId] || 0) + data.points;
        
        return {
          ...prevState,
          score: newScore
        };
      });
    });
    
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
    };
  }, [gameId]);
  
  const joinGame = (playerName) => {
    if (channelRef.current && connected) {
      const newPlayer = {
        id: playerId || Date.now().toString(),
        name: playerName,
        joinedAt: new Date().toISOString()
      };
      
      channelRef.current.trigger('client-join-game', newPlayer);
      setPlayerId(newPlayer.id);
    }
  };
  
  const performAction = (action, points) => {
    if (channelRef.current && connected && playerId) {
      channelRef.current.trigger('client-player-action', {
        playerId,
        action,
        points,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return { gameState, connected, playerId, joinGame, performAction };
};

// components/MultiplayerGame.js
import React, { useState } from 'react';
import { usePusherGame } from '../hooks/usePusherGame';

function MultiplayerGame({ gameId }) {
  const [playerName, setPlayerName] = useState('');
  const { gameState, connected, playerId, joinGame, performAction } = usePusherGame(gameId);
  
  const handleJoinGame = () => {
    if (playerName.trim()) {
      joinGame(playerName);
    }
  };
  
  const handleAction = (action, points) => {
    performAction(action, points);
  };
  
  return (
    <div className="multiplayer-game">
      <h2>Multiplayer Game: {gameId}</h2>
      <p>Status: {connected ? 'Connected' : 'Connecting...'}</p>
      
      {!gameState.started ? (
        <div className="join-game">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={handleJoinGame}>Join Game</button>
        </div>
      ) : (
        <div className="game-play">
          <h3>Players</h3>
          <ul>
            {gameState.players.map(player => (
              <li key={player.id}>
                {player.name} (Score: {gameState.score[player.id] || 0})
              </li>
            ))}
          </ul>
          
          <div className="actions">
            <button onClick={() => handleAction('jump', 10)}>Jump (+10)</button>
            <button onClick={() => handleAction('collect', 5)}>Collect (+5)</button>
            <button onClick={() => handleAction('attack', 20)}>Attack (+20)</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiplayerGame;
*/

// Example 8: Real-time form validation with Pusher
/*
// hooks/usePusherFormValidation.js
import { useState, useEffect, useRef } from 'react';
import { pusher } from '../pusher/config';

export const usePusherFormValidation = (formId) => {
  const [validation, setValidation] = useState({});
  const [connected, setConnected] = useState(false);
  const channelRef = useRef(null);
  
  useEffect(() => {
    const channel = pusher.subscribe(`form-validation-${formId}`);
    channelRef.current = channel;
    
    // Connection events
    channel.bind('pusher:subscription_succeeded', () => {
      setConnected(true);
    });
    
    // Validation events
    channel.bind('field-validated', (data) => {
      setValidation(prevValidation => ({
        ...prevValidation,
        [data.field]: {
          isValid: data.isValid,
          message: data.message
        }
      }));
    });
    
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
    };
  }, [formId]);
  
  const validateField = (field, value) => {
    if (channelRef.current && connected) {
      channelRef.current.trigger('client-validate-field', {
        field,
        value,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return { validation, connected, validateField };
};

// components/ValidatedForm.js
import React, { useState } from 'react';
import { usePusherFormValidation } from '../hooks/usePusherFormValidation';

function ValidatedForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const { validation, connected, validateField } = usePusherFormValidation('registration');
  
  const handleChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Validate field in real-time
    validateField(field, value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  
  const getFieldValidation = (field) => {
    return validation[field] || { isValid: null, message: '' };
  };
  
  return (
    <div className="validated-form">
      <h2>Real-time Form Validation</h2>
      <p>Status: {connected ? 'Connected' : 'Connecting...'}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            className={getFieldValidation('username').isValid === false ? 'invalid' : ''}
          />
          {getFieldValidation('username').message && (
            <small className="validation-message">
              {getFieldValidation('username').message}
            </small>
          )}
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={getFieldValidation('email').isValid === false ? 'invalid' : ''}
          />
          {getFieldValidation('email').message && (
            <small className="validation-message">
              {getFieldValidation('email').message}
            </small>
          )}
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={getFieldValidation('password').isValid === false ? 'invalid' : ''}
          />
          {getFieldValidation('password').message && (
            <small className="validation-message">
              {getFieldValidation('password').message}
            </small>
          )}
        </div>
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default ValidatedForm;
*/

// Example 9: Pusher authentication and authorization
/*
// pusher/auth.js
import { pusher } from './config';

export const authenticateWithPusher = (userCredentials) => {
  return new Promise((resolve, reject) => {
    // This would typically be a server-side operation
    // Here we simulate client-side authentication
    
    // In a real app, you would:
    // 1. Send credentials to your authentication server
    // 2. Server validates credentials
    // 3. Server generates a Pusher authentication token
    // 4. Server returns the token to the client
    
    // For demo purposes, we'll simulate this flow
    setTimeout(() => {
      // Simulate successful authentication
      const authData = {
        user_id: 'user123',
        user_info: {
          name: userCredentials.username,
          email: userCredentials.email
        }
      };
      
      // Authenticate with Pusher
      pusher.signin(authData, (error, auth) => {
        if (error) {
          reject(new Error('Authentication failed'));
        } else {
          resolve(auth);
        }
      });
    }, 1000);
  });
};

// components/AuthenticatedApp.js
import React, { useState, useEffect } from 'react';
import { pusher } from '../pusher/config';
import { authenticateWithPusher } from '../pusher/auth';

function AuthenticatedApp() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const auth = await authenticateWithPusher(credentials);
      setUser(auth.user_info);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated && user) {
      // Subscribe to private channel for authenticated user
      const channel = pusher.subscribe(`private-user-${user.user_id}`);
      
      channel.bind('private-message', (data) => {
        console.log('Private message:', data);
      });
    }
  }, [isAuthenticated, user]);
  
  return (
    <div className="authenticated-app">
      <h2>Pusher Authentication</h2>
      
      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          
          <button type="submit">Login</button>
        </form>
      ) : (
        <div className="authenticated-content">
          <h3>Welcome, {user.name}!</h3>
          <p>Email: {user.email}</p>
          <p>User ID: {user.user_id}</p>
        </div>
      )}
    </div>
  );
}

export default AuthenticatedApp;
*/

// Example 10: Pusher error handling and reconnection
/*
// hooks/usePusherWithRetry.js
import { useState, useEffect, useRef } from 'react';
import { pusher } from '../pusher/config';

export const usePusherWithRetry = (channelName, options = {}) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const channelRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  
  const connect = () => {
    if (retryCount < (options.maxRetries || 5)) {
      setRetryCount(prevCount => prevCount + 1);
      
      const channel = pusher.subscribe(channelName);
      channelRef.current = channel;
      
      // Connection events
      channel.bind('pusher:subscription_succeeded', () => {
        setConnected(true);
        setError(null);
        setRetryCount(0);
        console.log(`Connected to ${channelName} on attempt ${retryCount + 1}`);
      });
      
      channel.bind('pusher:subscription_error', (err) => {
        setError(err);
        setConnected(false);
        console.error(`Subscription error: ${err}`);
        
        // Schedule reconnection
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, options.retryDelay || 3000);
      });
      
      channel.bind('pusher:connection_error', (err) => {
        setError(err);
        setConnected(false);
        console.error(`Connection error: ${err}`);
        
        // Schedule reconnection
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, options.retryDelay || 3000);
      });
    }
  };
  
  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
    };
  }, [channelName, options]);
  
  return { connected, error, retryCount };
};

// components/ResilientChat.js
import React, { useState } from 'react';
import { usePusherWithRetry } from '../hooks/usePusherWithRetry';

function ResilientChat({ channelName, currentUser }) {
  const [messageText, setMessageText] = useState('');
  const { connected, error, retryCount } = usePusherWithRetry(channelName, {
    maxRetries: 5,
    retryDelay: 2000
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim() && connected) {
      // This would trigger the client-new-message event
      console.log('Message sent:', messageText);
      setMessageText('');
    }
  };
  
  return (
    <div className="resilient-chat">
      <h2>Resilient Chat: {channelName}</h2>
      
      <div className="connection-status">
        {connected ? (
          <p className="connected">✅ Connected</p>
        ) : error ? (
          <p className="error">❌ Error: {error.message}</p>
        ) : (
          <p className="connecting">🔄 Connecting... (Attempt {retryCount})</p>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          disabled={!connected}
        />
        <button type="submit" disabled={!connected}>Send</button>
      </form>
    </div>
  );
}

export default ResilientChat;
*/

export const pusherExamples = {
  description: "Examples of using Pusher for real-time communication and data synchronization",
  installation: "npm install pusher-js --save",
  concepts: [
    "Channels - Communication pathways",
    "Events - Real-time message passing",
    "Authentication - User identity verification",
    "Presence - User online status tracking",
    "Client events - Triggering events from clients"
  ],
  benefits: [
    "Real-time bidirectional communication",
    "Automatic reconnection",
    "Scalable infrastructure",
    "Cross-browser compatibility",
    "Low latency",
    "Built-in security",
    "Easy integration"
  ],
  patterns: [
    "Real-time chat applications",
    "Collaborative editing",
    "Live notifications",
    "Data synchronization",
    "Multiplayer games",
    "Form validation",
    "Analytics tracking",
    "Error handling and retry"
  ],
  bestPractices: [
    "Handle connection states properly",
    "Implement error handling and reconnection",
    "Use appropriate channel naming",
    "Validate data on client and server",
    "Optimize for performance",
    "Use authentication for private channels",
    "Clean up event listeners",
    "Monitor connection health"
  ]
};