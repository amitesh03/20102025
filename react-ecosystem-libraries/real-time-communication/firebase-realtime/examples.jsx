/**
 * Firebase Realtime Database Examples
 * 
 * Firebase Realtime Database is a cloud-hosted NoSQL database that lets
 * you store and sync data between clients in real-time. It's perfect for
 * building collaborative applications, live dashboards, and chat apps.
 */

// Example 1: Basic Firebase setup
/*
// Install Firebase SDK:
// npm install firebase --save

// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };

// App.js
import React, { useState, useEffect } from 'react';
import { database } from './firebase/config';

function App() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const dataRef = database.ref('data');
    
    // Listen for value changes
    const unsubscribe = dataRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setData(data);
      setLoading(false);
    });
    
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>Firebase Realtime Database</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
*/

// Example 2: Real-time data synchronization
/*
// hooks/useFirebaseData.js
import { useState, useEffect } from 'react';
import { database } from '../firebase/config';

export const useFirebaseData = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const dataRef = database.ref(path);
    
    const handleValueChange = (snapshot) => {
      const data = snapshot.val();
      setData(data);
      setLoading(false);
      setError(null);
    };
    
    const handleError = (error) => {
      setError(error);
      setLoading(false);
      console.error('Firebase error:', error);
    };
    
    // Set up listeners
    dataRef.on('value', handleValueChange, handleError);
    
    // Cleanup
    return () => {
      dataRef.off('value', handleValueChange);
      dataRef.off('value', handleError);
    };
  }, [path]);
  
  const updateData = (newData) => {
    setLoading(true);
    database.ref(path).set(newData)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };
  
  return { data, loading, error, updateData };
};

// components/RealtimeCounter.js
import React from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';

function RealtimeCounter() {
  const { data, updateData } = useFirebaseData('counter');
  
  const increment = () => {
    if (data) {
      updateData({ count: data.count + 1 });
    }
  };
  
  const decrement = () => {
    if (data && data.count > 0) {
      updateData({ count: data.count - 1 });
    }
  };
  
  const reset = () => {
    updateData({ count: 0 });
  };
  
  return (
    <div>
      <h2>Real-time Counter</h2>
      <p>Count: {data ? data.count : 'Loading...'}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default RealtimeCounter;
*/

// Example 3: Real-time chat application
/*
// hooks/useFirebaseChat.js
import { useState, useEffect, useRef } from 'react';
import { database } from '../firebase/config';

export const useFirebaseChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesRef = useRef(null);
  
  useEffect(() => {
    messagesRef.current = database.ref(`rooms/${roomId}/messages`);
    
    // Listen for new messages
    const handleChildAdded = (snapshot) => {
      const newMessage = {
        id: snapshot.key,
        ...snapshot.val()
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };
    
    // Load initial messages
    messagesRef.current.once('value', (snapshot) => {
      const initialMessages = snapshot.val() || {};
      const messageList = Object.keys(initialMessages).map(key => ({
        id: key,
        ...initialMessages[key]
      }));
      
      setMessages(messageList);
      setLoading(false);
    });
    
    // Set up listener for new messages
    messagesRef.current.on('child_added', handleChildAdded);
    
    // Cleanup
    return () => {
      messagesRef.current.off('child_added', handleChildAdded);
    };
  }, [roomId]);
  
  const sendMessage = (text, user) => {
    const newMessage = {
      text,
      user,
      timestamp: Date.now()
    };
    
    messagesRef.current.push(newMessage);
  };
  
  return { messages, loading, sendMessage };
};

// components/ChatRoom.js
import React, { useState } from 'react';
import { useFirebaseChat } from '../hooks/useFirebaseChat';

function ChatRoom({ roomId, currentUser }) {
  const [messageText, setMessageText] = useState('');
  const { messages, loading, sendMessage } = useFirebaseChat(roomId);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText, currentUser);
      setMessageText('');
    }
  };
  
  return (
    <div className="chat-room">
      <h2>Chat Room: {roomId}</h2>
      
      {loading ? (
        <div>Loading messages...</div>
      ) : (
        <div className="messages">
          {messages.map(message => (
            <div key={message.id} className="message">
              <strong>{message.user}:</strong> {message.text}
              <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;
*/

// Example 4: Real-time collaborative document
/*
// hooks/useFirebaseDocument.js
import { useState, useEffect } from 'react';
import { database } from '../firebase/config';

export const useFirebaseDocument = (docId) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const docRef = database.ref(`documents/${docId}`);
    
    const handleValueChange = (snapshot) => {
      const doc = snapshot.val();
      setDocument(doc);
      setLoading(false);
      setError(null);
    };
    
    const handleError = (error) => {
      setError(error);
      setLoading(false);
    };
    
    // Set up listeners
    docRef.on('value', handleValueChange, handleError);
    
    // Cleanup
    return () => {
      docRef.off('value', handleValueChange);
      docRef.off('value', handleError);
    };
  }, [docId]);
  
  const updateDocument = (updates) => {
    setLoading(true);
    database.ref(`documents/${docId}`).update(updates)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };
  
  const updateField = (field, value) => {
    updateDocument({ [field]: value });
  };
  
  return { document, loading, error, updateDocument, updateField };
};

// components/CollaborativeEditor.js
import React, { useState, useEffect } from 'react';
import { useFirebaseDocument } from '../hooks/useFirebaseDocument';

function CollaborativeEditor({ docId, currentUser }) {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { document, loading, updateField } = useFirebaseDocument(docId);
  
  useEffect(() => {
    if (document && document.content !== content) {
      setContent(document.content || '');
    }
  }, [document]);
  
  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (isEditing) {
      updateField('content', e.target.value);
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    updateField('content', content);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setContent(document ? document.content : '');
    setIsEditing(false);
  };
  
  if (loading) {
    return <div>Loading document...</div>;
  }
  
  return (
    <div className="collaborative-editor">
      <h2>Collaborative Document</h2>
      
      <div className="editor-info">
        <p>Editing: {isEditing ? 'Yes' : 'No'}</p>
        <p>Last updated by: {document ? document.lastUpdatedBy : 'Unknown'}</p>
      </div>
      
      <textarea
        value={content}
        onChange={handleContentChange}
        disabled={!isEditing}
        placeholder="Document content..."
      />
      
      <div className="editor-controls">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <button onClick={handleEdit}>Edit</button>
        )}
      </div>
    </div>
  );
}

export default CollaborativeEditor;
*/

// Example 5: Real-time presence system
/*
// hooks/useFirebasePresence.js
import { useState, useEffect, useRef } from 'react';
import { database } from '../firebase/config';

export const useFirebasePresence = (userId) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const presenceRef = useRef(null);
  
  useEffect(() => {
    presenceRef.current = database.ref('presence');
    
    // Set user as online when they connect
    const userStatusRef = presenceRef.current.child(userId);
    userStatusRef.onDisconnect().set({
      online: false,
      lastSeen: Date.now()
    });
    
    userStatusRef.set({
      online: true,
      lastSeen: Date.now()
    });
    
    // Listen for presence changes
    const handleValueChange = (snapshot) => {
      const presence = snapshot.val() || {};
      const users = Object.keys(presence)
        .filter(key => presence[key].online)
        .map(key => ({
          id: key,
          ...presence[key]
        }));
      
      setOnlineUsers(users);
    };
    
    presenceRef.current.on('value', handleValueChange);
    
    // Cleanup
    return () => {
      presenceRef.current.off('value', handleValueChange);
    };
  }, [userId]);
  
  return { onlineUsers };
};

// components/PresenceIndicator.js
import React from 'react';
import { useFirebasePresence } from '../hooks/useFirebasePresence';

function PresenceIndicator({ userId }) {
  const { onlineUsers } = useFirebasePresence(userId);
  
  const isUserOnline = onlineUsers.some(user => user.id === userId && user.online);
  const onlineCount = onlineUsers.filter(user => user.online).length;
  
  return (
    <div className="presence-indicator">
      <div className={`status ${isUserOnline ? 'online' : 'offline'}`}>
        {isUserOnline ? '🟢 Online' : '🔴 Offline'}
      </div>
      <p>{onlineCount} user(s) online</p>
    </div>
  );
}

export default PresenceIndicator;
*/

// Example 6: Real-time data filtering and querying
/*
// hooks/useFirebaseQuery.js
import { useState, useEffect } from 'react';
import { database } from '../firebase/config';

export const useFirebaseQuery = (path, filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const dataRef = database.ref(path);
    
    const handleValueChange = (snapshot) => {
      const allData = snapshot.val() || {};
      
      // Apply filters
      let filteredData = Object.keys(allData).map(key => ({
        id: key,
        ...allData[key]
      }));
      
      if (filters.category) {
        filteredData = filteredData.filter(item => item.category === filters.category);
      }
      
      if (filters.minPrice) {
        filteredData = filteredData.filter(item => item.price >= filters.minPrice);
      }
      
      if (filters.maxPrice) {
        filteredData = filteredData.filter(item => item.price <= filters.maxPrice);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
        );
      }
      
      setData(filteredData);
      setLoading(false);
    };
    
    dataRef.on('value', handleValueChange);
    
    return () => {
      dataRef.off('value', handleValueChange);
    };
  }, [path, filters]);
  
  return { data, loading };
};

// components/FilteredProductList.js
import React, { useState } from 'react';
import { useFirebaseQuery } from '../hooks/useFirebaseQuery';

function FilteredProductList() {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    search: ''
  });
  
  const { data, loading } = useFirebaseQuery('products', filters);
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };
  
  return (
    <div className="filtered-product-list">
      <h2>Product List</h2>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
        
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
        />
        
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
        />
      </div>
      
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className="products">
          {data.map(product => (
            <div key={product.id} className="product">
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilteredProductList;
*/

// Example 7: Real-time analytics and monitoring
/*
// hooks/useFirebaseAnalytics.js
import { useEffect, useRef } from 'react';
import { database } from '../firebase/config';

export const useFirebaseAnalytics = () => {
  const analyticsRef = useRef(null);
  
  useEffect(() => {
    analyticsRef.current = database.ref('analytics');
    
    // Track page views
    const trackPageView = (page) => {
      analyticsRef.current.push({
        type: 'page_view',
        page,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      });
    };
    
    // Track user interactions
    const trackInteraction = (action, target) => {
      analyticsRef.current.push({
        type: 'interaction',
        action,
        target,
        timestamp: Date.now()
      });
    };
    
    // Track errors
    const trackError = (error, context) => {
      analyticsRef.current.push({
        type: 'error',
        message: error.message,
        stack: error.stack,
        context,
        timestamp: Date.now()
      });
    };
    
    // Expose tracking functions globally
    window.analytics = {
      trackPageView,
      trackInteraction,
      trackError
    };
    
    return () => {
      delete window.analytics;
    };
  }, []);
  
  return null;
};

// components/AnalyticsTracker.js
import React, { useEffect } from 'react';
import { useFirebaseAnalytics } from '../hooks/useFirebaseAnalytics';

function AnalyticsTracker() {
  useFirebaseAnalytics();
  
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
    
    // Track errors
    const handleError = (error, errorInfo) => {
      if (window.analytics) {
        window.analytics.trackError(error, errorInfo);
      }
    };
    
    document.addEventListener('click', handleClick);
    window.addEventListener('error', handleError);
    
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  return null; // This component doesn't render anything
}

export default AnalyticsTracker;
*/

// Example 8: Real-time data validation and security rules
/*
// firebase/database.rules.json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    
    "messages": {
      ".read": "auth != null",
      ".write": "auth != null && 
        data.child('userId').val() === auth.uid &&
        data.child('text').val().length <= 500"
      },
      
      "$messageId": {
        ".read": "auth != null",
        ".write": "auth != null && 
          data.child('userId').val() === auth.uid"
      }
    },
    
    "presence": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}

// hooks/useFirebaseAuth.js
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { database } from '../firebase/config';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  return { user, loading };
};

// components/SecureChat.js
import React, { useState } from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useFirebaseChat } from '../hooks/useFirebaseChat';

function SecureChat({ roomId }) {
  const { user } = useFirebaseAuth();
  const { messages, sendMessage } = useFirebaseChat(roomId);
  const [messageText, setMessageText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim() && user) {
      sendMessage(messageText, user);
      setMessageText('');
    }
  };
  
  if (!user) {
    return <div>Please sign in to chat</div>;
  }
  
  return (
    <div className="secure-chat">
      <h2>Secure Chat Room: {roomId}</h2>
      <p>Logged in as: {user.displayName || user.email}</p>
      
      <div className="messages">
        {messages.map(message => (
          <div key={message.id} className="message">
            <strong>{message.user}:</strong> {message.text}
            <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default SecureChat;
*/

// Example 9: Real-time data pagination
/*
// hooks/useFirebasePagination.js
import { useState, useEffect } from 'react';
import { database } from '../firebase/config';

export const useFirebasePagination = (path, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastKey, setLastKey] = useState(null);
  
  useEffect(() => {
    const dataRef = database.ref(path).orderByKey().limitToFirst(pageSize + 1);
    
    const handleValueChange = (snapshot) => {
      const values = snapshot.val() || {};
      const items = Object.keys(values).map(key => ({
        id: key,
        ...values[key]
      }));
      
      // Remove the extra item we requested for pagination check
      const paginatedItems = items.slice(0, pageSize);
      
      setData(paginatedItems);
      setLoading(false);
      setHasMore(items.length > pageSize);
      setLastKey(items[items.length - 1]?.id || null);
    };
    
    dataRef.on('value', handleValueChange);
    
    return () => {
      dataRef.off('value', handleValueChange);
    };
  }, [path, pageSize]);
  
  const loadMore = () => {
    if (!loading && hasMore && lastKey) {
      setLoading(true);
      
      const nextRef = database.ref(path)
        .orderByKey()
        .startAfter(lastKey)
        .limitToFirst(pageSize);
      
      nextRef.once('value', (snapshot) => {
        const values = snapshot.val() || {};
        const newItems = Object.keys(values).map(key => ({
          id: key,
          ...values[key]
        }));
        
        setData(prevData => [...prevData, ...newItems]);
        setLoading(false);
        setHasMore(newItems.length === pageSize);
        setLastKey(newItems[newItems.length - 1]?.id || null);
      });
    }
  };
  
  return { data, loading, hasMore, loadMore };
};

// components/PaginatedList.js
import React from 'react';
import { useFirebasePagination } from '../hooks/useFirebasePagination';

function PaginatedList() {
  const { data, loading, hasMore, loadMore } = useFirebasePagination('items', 5);
  
  return (
    <div className="paginated-list">
      <h2>Paginated List</h2>
      
      <div className="items">
        {data.map(item => (
          <div key={item.id} className="item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      
      {loading && <div>Loading more items...</div>}
      
      {hasMore && (
        <button onClick={loadMore} className="load-more">
          Load More
        </button>
      )}
    </div>
  );
}

export default PaginatedList;
*/

// Example 10: Real-time data transformation and aggregation
/*
// hooks/useFirebaseAggregation.js
import { useState, useEffect } from 'react';
import { database } from '../firebase/config';

export const useFirebaseAggregation = (path) => {
  const [data, setData] = useState([]);
  const [aggregates, setAggregates] = useState({});
  
  useEffect(() => {
    const dataRef = database.ref(path);
    
    const handleValueChange = (snapshot) => {
      const values = snapshot.val() || {};
      const items = Object.keys(values).map(key => ({
        id: key,
        ...values[key]
      }));
      
      // Calculate aggregates
      const total = items.reduce((sum, item) => sum + (item.value || 0), 0);
      const count = items.length;
      const average = count > 0 ? total / count : 0;
      const max = Math.max(...items.map(item => item.value || 0));
      const min = Math.min(...items.map(item => item.value || 0));
      
      const categories = items.reduce((cats, item) => {
        const category = item.category || 'other';
        if (!cats[category]) {
          cats[category] = 0;
        }
        cats[category]++;
        return cats;
      }, {});
      
      setData(items);
      setAggregates({
        total,
        count,
        average,
        max,
        min,
        categories
      });
    };
    
    dataRef.on('value', handleValueChange);
    
    return () => {
      dataRef.off('value', handleValueChange);
    };
  }, [path]);
  
  return { data, aggregates };
};

// components/AnalyticsDashboard.js
import React from 'react';
import { useFirebaseAggregation } from '../hooks/useFirebaseAggregation';

function AnalyticsDashboard() {
  const { data, aggregates } = useFirebaseAggregation('sales');
  
  return (
    <div className="analytics-dashboard">
      <h2>Sales Analytics</h2>
      
      <div className="metrics">
        <div className="metric">
          <h3>Total Sales</h3>
          <p>${aggregates.total.toFixed(2)}</p>
        </div>
        
        <div className="metric">
          <h3>Average Sale</h3>
          <p>${aggregates.average.toFixed(2)}</p>
        </div>
        
        <div className="metric">
          <h3>Highest Sale</h3>
          <p>${aggregates.max.toFixed(2)}</p>
        </div>
        
        <div className="metric">
          <h3>Lowest Sale</h3>
          <p>${aggregates.min.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="categories">
        <h3>Sales by Category</h3>
        {Object.entries(aggregates.categories).map(([category, count]) => (
          <div key={category} className="category">
            <h4>{category}</h4>
            <p>{count} sales</p>
          </div>
        ))}
      </div>
      
      <div className="recent-sales">
        <h3>Recent Sales</h3>
        <ul>
          {data.slice(-5).map(item => (
            <li key={item.id}>
              {item.name}: ${item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
*/

export const firebaseRealtimeExamples = {
  description: "Examples of using Firebase Realtime Database for real-time data synchronization",
  installation: "npm install firebase --save",
  concepts: [
    "Realtime Database - NoSQL cloud database",
    "Data synchronization - Automatic sync across clients",
    "Listeners - Real-time event handling",
    "Security rules - Data access control",
    "Authentication - User identity verification"
  ],
  benefits: [
    "Real-time data synchronization",
    "Automatic conflict resolution",
    "Scalable infrastructure",
    "Built-in security",
    "Offline support",
    "Cross-platform compatibility"
  ],
  patterns: [
    "Real-time counters",
    "Chat applications",
    "Collaborative documents",
    "Presence systems",
    "Data filtering and querying",
    "Analytics and monitoring",
    "Data pagination",
    "Data aggregation"
  ],
  bestPractices: [
    "Structure data efficiently",
    "Implement proper security rules",
    "Use listeners efficiently",
    "Handle connection states",
    "Optimize for performance",
    "Validate data on client and server",
    "Use appropriate data types"
  ]
};