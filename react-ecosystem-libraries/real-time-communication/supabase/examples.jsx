/**
 * Supabase Realtime Examples
 * 
 * Supabase is an open-source Firebase alternative that provides a real-time
 * database, authentication, and storage solution. It combines the
 * features of a traditional database with the real-time capabilities of
 * a NoSQL database.
 */

// Example 1: Basic Supabase setup
/*
// Install Supabase client:
// npm install @supabase/supabase-js --save

// supabase/config.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseKey = 'your-anon-key'; // Found in Supabase settings

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Supabase
export const initSupabase = () => {
  // This would typically be called in your app's entry point
  console.log('Supabase initialized');
};

// App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabase/config';

function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        setSession(session);
      }
    };
    
    checkSession();
  }, []);
  
  const handleLogin = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login failed:', error);
      } else {
        setUser(data.user);
        setSession(data.session);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout failed:', error);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <div>
      <h1>Supabase Authentication</h1>
      
      {user ? (
        <div>
          <h2>Welcome, {user.email}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Please log in</h2>
          <button onClick={() => {
            // This would open a login modal
            console.log('Open login modal');
          }}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
*/

// Example 2: Real-time data synchronization
/*
// hooks/useSupabaseRealtime.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

export const useSupabaseRealtime = (tableName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel(`public:${tableName}`)
      .on('postgres_changes', (event) => {
        if (event.eventType === 'INSERT') {
          setData(prevData => [...prevData, event.new]);
        } else if (event.eventType === 'UPDATE') {
          setData(prevData => 
            prevData.map(item => 
              item.id === event.old.id ? event.new : item
            )
          );
        } else if (event.eventType === 'DELETE') {
          setData(prevData => 
            prevData.filter(item => item.id !== event.old.id)
          );
        }
        
        setLoading(false);
        setError(null);
      });
    
    // Handle errors
    subscription.on('postgres_changes', (error) => {
      setError(error);
      setLoading(false);
      console.error('Realtime subscription error:', error);
    });
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [tableName]);
  
  const insertData = async (newData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(newData);
      
      if (error) {
        setError(error);
      } else {
        // The subscription will handle the data update
        console.log('Data inserted:', data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateData = async (id, updates) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id);
      
      if (error) {
        setError(error);
      } else {
        // The subscription will handle the data update
        console.log('Data updated:', data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteData = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) {
        setError(error);
      } else {
        // The subscription will handle the data deletion
        console.log('Data deleted:', id);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, insertData, updateData, deleteData };
};

// components/RealtimeList.js
import React from 'react';
import { useSupabaseRealtime } from '../hooks/useSupabaseRealtime';

function RealtimeList({ tableName }) {
  const { data, loading, error, insertData } = useSupabaseRealtime(tableName);
  
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      name: `Item ${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    insertData(newItem);
  };
  
  const handleUpdateItem = (id) => {
    const updates = {
      name: `Updated Item ${id}`,
      updated_at: new Date().toISOString()
    };
    
    updateData(id, updates);
  };
  
  const handleDeleteItem = (id) => {
    deleteData(id);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div>
      <h2>Realtime List</h2>
      <button onClick={handleAddItem}>Add Item</button>
      
      <ul>
        {data.map(item => (
          <li key={item.id}>
            {item.name}
            <small>{new Date(item.created_at).toLocaleString()}</small>
            <button onClick={() => handleUpdateItem(item.id)}>Update</button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RealtimeList;
*/

// Example 3: Real-time collaboration
/*
// hooks/useSupabaseCollaboration.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

export const useSupabaseCollaboration = (documentId) => {
  const [document, setDocument] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel(`public:documents:id=eq.${documentId}`)
      .on('postgres_changes', (event) => {
        if (event.eventType === 'INSERT' && event.new.id === documentId) {
          setDocument(event.new);
        } else if (event.eventType === 'UPDATE' && event.new.id === documentId) {
          setDocument(event.new);
        }
      });
    
    // Handle errors
    subscription.on('postgres_changes', (error) => {
      setError(error);
      setLoading(false);
      console.error('Collaboration subscription error:', error);
    });
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [documentId]);
  
  const updateDocument = async (updates) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', documentId);
      
      if (error) {
        setError(error);
      } else {
        // The subscription will handle the document update
        console.log('Document updated:', data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateField = (field, value) => {
    updateDocument({ [field]: value });
  };
  
  return { document, loading, error, updateDocument, updateField };
};

// components/CollaborativeEditor.js
import React, { useState, useEffect } from 'react';
import { useSupabaseCollaboration } from '../hooks/useSupabaseCollaboration';

function CollaborativeEditor({ documentId, currentUser }) {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { document, loading, error, updateDocument, updateField } = useSupabaseCollaboration(documentId);
  
  useEffect(() => {
    if (document && document.content !== content) {
      setContent(document.content || '');
    }
  }, [document]);
  
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (isEditing) {
      updateField('content', newContent);
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
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div>
      <h2>Collaborative Editor</h2>
      <p>Editing: {isEditing ? 'Yes' : 'No'}</p>
      <p>Last updated by: {document ? document.updated_at : 'Unknown'}</p>
      
      <textarea
        value={content}
        onChange={handleContentChange}
        disabled={!isEditing}
        placeholder="Start typing..."
      />
      
      <div>
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

// Example 4: Real-time presence system
/*
// hooks/useSupabasePresence.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

export const useSupabasePresence = (userId) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel(`public:presence`)
      .on('postgres_changes', (event) => {
        if (event.eventType === 'INSERT' && event.new.table === 'presence') {
          const newUser = event.new;
          
          setOnlineUsers(prevUsers => {
            const existingUserIndex = prevUsers.findIndex(u => u.id === newUser.id);
            
            if (existingUserIndex >= 0) {
              // Update existing user
              const updatedUsers = [...prevUsers];
              updatedUsers[existingUserIndex] = newUser;
              setOnlineUsers(updatedUsers);
            } else {
              // Add new user
              setOnlineUsers([...prevUsers, newUser]);
            }
          });
        } else if (event.eventType === 'UPDATE' && event.new.table === 'presence') {
          const updatedUser = event.new;
          
          setOnlineUsers(prevUsers => {
            const existingUserIndex = prevUsers.findIndex(u => u.id === updatedUser.id);
            
            if (existingUserIndex >= 0) {
              // Update existing user
              const updatedUsers = [...prevUsers];
              updatedUsers[existingUserIndex] = updatedUser;
              setOnlineUsers(updatedUsers);
            }
          });
        } else if (event.eventType === 'DELETE' && event.old.table === 'presence') {
          const deletedUser = event.old;
          
          setOnlineUsers(prevUsers => 
            prevUsers.filter(u => u.id !== deletedUser.id)
          );
        }
      });
    
    // Handle errors
    subscription.on('postgres_changes', (error) => {
      setError(error);
      setLoading(false);
      console.error('Presence subscription error:', error);
    });
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
  
  const updatePresence = (isOnline) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('client-presence-update', {
        userId,
        isOnline,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return { onlineUsers, loading, error, updatePresence };
};

// components/PresenceIndicator.js
import React from 'react';
import { useSupabasePresence } from '../hooks/useSupabasePresence';

function PresenceIndicator({ userId }) {
  const { onlineUsers, loading, error } = useSupabasePresence(userId);
  
  const isUserOnline = onlineUsers.some(user => user.id === userId && user.is_online);
  const onlineCount = onlineUsers.filter(user => user.is_online).length;
  
  return (
    <div className="presence-indicator">
      <h2>Presence System</h2>
      <p>Status: {loading ? 'Loading...' : 'Connected'}</p>
      
      <div className="user-status">
        <p>Online Users: {onlineCount}</p>
        <p>You are: {isUserOnline ? 'Online' : 'Offline'}</p>
      </div>
      
      <div className="online-users">
        <h3>Online Users</h3>
        <ul>
          {onlineUsers.map(user => (
            <li key={user.id}>
              <div className={`user ${user.is_online ? 'online' : 'offline'}`}>
                <span className="user-name">{user.name}</span>
                <span className="user-status">{user.is_online ? '🟢 Online' : '🔴 Offline'}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PresenceIndicator;
*/

// Example 5: Real-time notifications
/*
// hooks/useSupabaseNotifications.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

export const useSupabaseNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel(`public:notifications:user_id=eq.${userId}`)
      .on('postgres_changes', (event) => {
        if (event.eventType === 'INSERT' && event.new.table === 'notifications') {
          const newNotification = event.new;
          
          setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
        }
      });
    
    // Handle errors
    subscription.on('postgres_changes', (error) => {
      setError(error);
      setLoading(false);
      console.error('Notifications subscription error:', error);
    });
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
  
  const markAsRead = (notificationId) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('mark-notification-read', { userId, notificationId });
    }
  };
  
  return { notifications, loading, error, markAsRead };
};

// components/NotificationCenter.js
import React from 'react';
import { useSupabaseNotifications } from '../hooks/useSupabaseNotifications';

function NotificationCenter({ userId }) {
  const { notifications, loading, error, markAsRead } = useSupabaseNotifications(userId);
  
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="notification-center">
      <h2>Notifications</h2>
      <p>Status: {loading ? 'Loading...' : 'Connected'}</p>
      
      <div className="notifications">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.read ? 'read' : 'unread'}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
            <small>{new Date(notification.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
      
      <div className="notification-stats">
        <p>Total: {notifications.length}</p>
        <p>Unread: {unreadCount}</p>
      </div>
    </div>
  );
}

export default NotificationCenter;
*/

// Example 6: Real-time data filtering and querying
/*
// hooks/useSupabaseQuery.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

export const useSupabaseQuery = (tableName, filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Set up real-time subscription
    const subscription = supabase
      .channel(`public:${tableName}`)
      .on('postgres_changes', (event) => {
        if (event.eventType === 'INSERT' || event.eventType === 'UPDATE') {
          // Handle data changes
          setData(prevData => {
            const existingIndex = prevData.findIndex(item => item.id === event.new.id);
            
            if (existingIndex >= 0) {
              // Update existing item
              const updatedData = [...prevData];
              updatedData[existingIndex] = event.new;
              setData(updatedData);
            } else {
              // Add new item
              setData([...prevData, event.new]);
            }
          });
        } else if (event.eventType === 'DELETE') {
          // Handle data deletion
          setData(prevData => 
            prevData.filter(item => item.id !== event.old.id)
          );
        }
      });
    
    // Handle errors
    subscription.on('postgres_changes', (error) => {
      setError(error);
      setLoading(false);
      console.error('Query subscription error:', error);
    });
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [tableName, filters]);
  
  const updateFilters = (newFilters) => {
    // This would typically trigger a new subscription with updated filters
    console.log('Filters updated:', newFilters);
  };
  
  return { data, loading, error, updateFilters };
};

// components/FilteredDataList.js
import React, { useState } from 'react';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

function FilteredDataList({ tableName }) {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    search: ''
  });
  const { data, loading, error, updateFilters } = useSupabaseQuery(tableName, filters);
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };
  
  return (
    <div>
      <h2>Filtered Data List</h2>
      
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
      
      <div>
        <h3>Statistics</h3>
        <p>Total Items: {data.length}</p>
        <p>Filtered Items: {data.length}</p>
      </div>
      
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className="products">
          {data.map(item => (
            <div key={item.id} className="product">
              <h3>{item.name}</h3>
              <p>Price: ${item.price}</p>
              <p>Category: {item.category}</p>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div>Error: {error.message}</div>
      )}
    </div>
  );
}

export default FilteredDataList;
*/

// Example 7: Real-time analytics with Supabase
/*
// hooks/useSupabaseAnalytics.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

export const useSupabaseAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    userActions: 0,
    errors: 0
  });
  
  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      setAnalytics(prevAnalytics => ({
        ...prevAnalytics,
        pageViews: prevAnalytics.pageViews + 1
      }));
    };
    
    // Track user actions
    const trackUserAction = (action) => {
      setAnalytics(prevAnalytics => ({
        ...prevAnalytics,
        userActions: prevAnalytics.userActions + 1
      }));
    };
    
    // Track errors
    const trackError = (error) => {
      setAnalytics(prevAnalytics => ({
        ...prevAnalytics,
        errors: prevAnalytics.errors + 1
      }));
    };
    
    // Expose tracking functions globally
    window.analytics = {
      trackPageView,
      trackUserAction,
      trackError
    };
    
    return () => {
      delete window.analytics;
    };
  }, []);
  
  return { analytics };
};

// components/AnalyticsTracker.js
import React, { useEffect } from 'react';
import { useSupabaseAnalytics } from '../hooks/useSupabaseAnalytics';

function AnalyticsTracker() {
  useSupabaseAnalytics();
  
  useEffect(() => {
    // Track page view
    if (window.analytics) {
      window.analytics.trackPageView(window.location.pathname);
    }
    
    // Track user interactions
    const handleClick = (event) => {
      if (window.analytics) {
        window.analytics.trackUserAction('click', {
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

// Example 8: Supabase authentication and authorization
/*
// supabase/auth.js
import { supabase } from './config';

export const signUp = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: metadata.displayName || email,
          avatar_url: metadata.avatarUrl
        }
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
      throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
      throw new Error(error.message);
  }
};

// supabase/row-level-security.js
import { supabase } from './config';

export const canAccessResource = async (userId, resource, action) => {
  try {
    const { data } = await supabase
      .from('permissions')
      .select('*')
      .eq('user_id', userId)
      .eq('resource', resource)
      .eq('action', action);
      .single();
    
    if (data) {
      return data.can;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// components/SecureData.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import { canAccessResource } from '../supabase/row-level-security';

function SecureData({ userId, tableName }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  
  useEffect(() => {
    // Check if user can edit data
    const checkEditPermission = async () => {
      const hasPermission = await canAccessResource(userId, tableName, 'update');
      setCanEdit(hasPermission);
    };
    
    // Fetch data
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*');
        
        if (error) {
          setError(error);
        } else {
          setData(data || []);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    checkEditPermission();
    fetchData();
  }, [userId, tableName, canEdit]);
  
  const handleUpdate = async (id, updates) => {
    if (!canEdit) {
      setError('You do not have permission to edit this data');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id);
      
      if (error) {
        setError(error);
      } else {
        // The subscription will handle the data update
        console.log('Data updated:', id);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Secure Data</h2>
      <p>Can Edit: {canEdit ? 'Yes' : 'No'}</p>
      
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      
      <div className="data-display">
        <ul>
          {data.map(item => (
            <li key={item.id}>
              {item.name}
              {canEdit && (
                <button onClick={() => handleUpdate(item.id, { name: `Updated ${item.name}` })}>
                  Update
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SecureData;
*/

// Example 9: Supabase storage
/*
// hooks/useSupabaseStorage.js
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

export const useSupabaseStorage = (bucketName) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    // List files
    const listFiles = async () => {
      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .list();
        
        if (error) {
          setError(error);
        } else {
          setFiles(data || []);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    listFiles();
  }, [bucketName]);
  
  const uploadFile = async (file) => {
    setLoading(true);
    setUploadProgress(0);
    
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(file, {
          onProgress: (event) => {
            setUploadProgress(event.percent);
          }
        });
      
      if (error) {
        setError(error);
      } else {
        setFiles(prevFiles => [...prevFiles, data]);
        console.log('File uploaded:', data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setUploadProgress(100);
    }
  };
  
  const downloadFile = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(path);
      
      if (error) {
        setError(error);
      } else {
        // Create download URL
        const { publicURL } = supabase.storage
          .getPublicUrl();
        
        // Create download link
        const downloadLink = `${publicURL}/${path}`;
        
        // Trigger download
        const link = document.createElement('a');
        link.href = downloadLink;
        link.download = path.split('/').pop();
        link.click();
      }
    } catch (error) {
      setError(error);
    }
  };
  
  return { files, loading, error, uploadProgress, uploadFile, downloadFile };
};

// components/FileUploader.js
import React, { useState } from 'react';
import { useSupabaseStorage } from '../hooks/useSupabaseStorage';

function FileUploader({ bucketName }) {
  const [file, setFile] = useState(null);
  const { uploadProgress, uploadFile } = useSupabaseStorage(bucketName);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleUpload = () => {
    if (file) {
      uploadFile(file);
    }
  };
  
  return (
    <div>
      <h2>File Uploader</h2>
      
      <div className="upload-area">
        <input
          type="file"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload} disabled={!file || uploadProgress > 0}>
          {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Upload'}
        </button>
      </div>
      
      {uploadProgress > 0 && (
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {uploadProgress === 100 && (
        <div className="upload-success">
          <p>Upload complete!</p>
        </div>
      )}
      
      {uploadProgress > 0 && (
        <div className="upload-status">
          <p>Uploading... {uploadProgress}%</p>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
*/

// Example 10: Supabase edge functions
/*
// supabase/functions.js
import { supabase } from './config';

export const invokeFunction = async (functionName, payload) => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, payload);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
      throw new Error(error.message);
    }
};

// components/FunctionInvoker.js
import React, { useState } from 'react';
import { invokeFunction } from '../supabase/functions';

function FunctionInvoker() {
  const [functionName, setFunctionName] = useState('hello-world');
  const [payload, setPayload] = useState('{}');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleInvoke = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const data = await invokeFunction(functionName, JSON.parse(payload));
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Edge Function Invoker</h2>
      
      <div className="function-form">
        <div className="form-group">
          <label>Function Name:</label>
          <input
            type="text"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Payload (JSON):</label>
          <textarea
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={5}
          />
        </div>
        
        <button onClick={handleInvoke} disabled={loading}>
          {loading ? 'Invoking...' : 'Invoke Function'}
        </button>
      </div>
      
      {result && (
        <div className="result">
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div className="error">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default FunctionInvoker;
*/

export const supabaseExamples = {
  description: "Examples of using Supabase for real-time data synchronization and authentication",
  installation: "npm install @supabase/supabase-js --save",
  concepts: [
    "Realtime Database - PostgreSQL with real-time capabilities",
    "Authentication - User identity and access control",
    "Storage - File and media storage",
    "Edge Functions - Serverless compute",
    "Row Level Security - Fine-grained permissions"
  ],
  benefits: [
    "Real-time data synchronization",
    "Automatic conflict resolution",
    "Built-in authentication",
    "File storage with CDN",
    "Serverless functions",
    "PostgreSQL database",
    "Open source alternative to Firebase"
  ],
  patterns: [
    "Real-time subscriptions",
    "Data synchronization",
    "Authentication flows",
    "File uploads and downloads",
    "Edge function invocation",
    "Row-level security",
    "Real-time presence"
  ],
  bestPractices: [
    "Use appropriate RLS policies",
    "Implement proper security rules",
    "Optimize database queries",
    "Use storage buckets efficiently",
    "Handle connection states properly",
    "Validate data on client and server",
    "Use edge functions for compute-intensive tasks"
  ]
};