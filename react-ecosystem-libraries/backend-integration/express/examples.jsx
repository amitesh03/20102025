// Express.js Examples with Detailed Comments
// This file demonstrates various Express.js concepts with comprehensive explanations
// Note: These examples show the client-side React code that would interact with Express.js backends

import React, { useState, useEffect } from 'react';

// ===== EXAMPLE 1: BASIC HTTP CLIENT =====
/**
 * Basic HTTP client demonstrating core Express.js concepts
 * Shows how to make requests to Express.js endpoints
 */

function BasicHttpClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate Express.js backend endpoints
  const apiEndpoints = {
    getUsers: '/api/users',
    createUser: '/api/users',
    updateUser: '/api/users/:id',
    deleteUser: '/api/users/:id',
  };

  // GET request - fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This would make a GET request to Express.js
      const response = await fetch(apiEndpoints.getUsers);
      const users = await response.json();
      setData(users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // POST request - create new user
  const createUser = async (userData) => {
    setLoading(true);
    
    try {
      // This would make a POST request to Express.js
      const response = await fetch(apiEndpoints.createUser, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const newUser = await response.json();
      setData(prev => [...prev, newUser]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // PUT request - update user
  const updateUser = async (id, userData) => {
    setLoading(true);
    
    try {
      // This would make a PUT request to Express.js
      const response = await fetch(apiEndpoints.updateUser.replace(':id', id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const updatedUser = await response.json();
      setData(prev => prev.map(user => 
        user.id === id ? { ...user, ...updatedUser } : user
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE request - delete user
  const deleteUser = async (id) => {
    setLoading(true);
    
    try {
      // This would make a DELETE request to Express.js
      await fetch(apiEndpoints.deleteUser.replace(':id', id), {
        method: 'DELETE',
      });
      
      setData(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Basic HTTP Client</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchUsers} disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Loading...' : 'Refresh Users'}
        </button>
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee' }}>
          Error: {error}
        </div>
      )}
      
      {/* Create User Form */}
      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h4>Create New User</h4>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          createUser({
            name: formData.get('name'),
            email: formData.get('email'),
          });
        }}>
          <input name="name" placeholder="Name" required style={{ margin: '5px', padding: '8px' }} />
          <input name="email" type="email" placeholder="Email" required style={{ margin: '5px', padding: '8px' }} />
          <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
            Create User
          </button>
        </form>
      </div>
      
      {/* Users List */}
      <div style={{ textAlign: 'left' }}>
        <h4>Users ({data?.length || 0}):</h4>
        {data?.map(user => (
          <div key={user.id} style={{ 
            padding: '15px', 
            margin: '10px 0', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>{user.name}</strong> ({user.email})
            </div>
            <div>
              <button 
                onClick={() => updateUser(user.id, { name: user.name + ' (Updated)' })}
                style={{ marginRight: '10px', padding: '5px 10px' }}
              >
                Update
              </button>
              <button 
                onClick={() => deleteUser(user.id)}
                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== EXAMPLE 2: ROUTE PARAMETERS =====
/**
 * Route parameters demonstrating dynamic URL handling
 * Shows how to work with Express.js route parameters
 */

function RouteParameters() {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulate Express.js routes with parameters
  const fetchPosts = async () => {
    setLoading(true);
    
    try {
      // GET /api/posts - would fetch all posts
      const response = await fetch('/api/posts');
      const allPosts = await response.json();
      setPosts(allPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific post by ID
  const fetchPostById = async (postId) => {
    setLoading(true);
    
    try {
      // GET /api/posts/:id - Express.js route parameter
      const response = await fetch(`/api/posts/${postId}`);
      const post = await response.json();
      setCurrentPost(post);
    } catch (err) {
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search posts by category
  const fetchPostsByCategory = async (category) => {
    setLoading(true);
    
    try {
      // GET /api/posts/category/:category - Express.js route parameter
      const response = await fetch(`/api/posts/category/${category}`);
      const categoryPosts = await response.json();
      setPosts(categoryPosts);
      setCurrentPost(null);
    } catch (err) {
      console.error('Error fetching category posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Route Parameters</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchPosts} disabled={loading} style={{ marginRight: '10px', padding: '8px 16px' }}>
          All Posts
        </button>
        <button onClick={() => fetchPostsByCategory('technology')} disabled={loading} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Technology
        </button>
        <button onClick={() => fetchPostsByCategory('design')} disabled={loading} style={{ padding: '8px 16px' }}>
          Design
        </button>
      </div>
      
      {loading && <div>Loading posts...</div>}
      
      {/* Posts List */}
      <div style={{ textAlign: 'left', marginBottom: '20px' }}>
        <h4>Posts:</h4>
        {posts.map(post => (
          <div 
            key={post.id} 
            style={{ 
              padding: '10px', 
              margin: '5px 0', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              cursor: 'pointer',
              backgroundColor: currentPost?.id === post.id ? '#e3f2fd' : 'white'
            }}
            onClick={() => fetchPostById(post.id)}
          >
            <strong>{post.title}</strong>
            <br />
            <small>Category: {post.category} | ID: {post.id}</small>
          </div>
        ))}
      </div>
      
      {/* Current Post Details */}
      {currentPost && (
        <div style={{ 
          padding: '20px', 
          border: '2px solid #007bff', 
          borderRadius: '8px',
          textAlign: 'left',
          backgroundColor: '#f8f9fa'
        }}>
          <h4>Current Post Details</h4>
          <p><strong>ID:</strong> {currentPost.id}</p>
          <p><strong>Title:</strong> {currentPost.title}</p>
          <p><strong>Category:</strong> {currentPost.category}</p>
          <p><strong>Content:</strong> {currentPost.content}</p>
          <small>
            <em>This data came from Express.js route: GET /api/posts/{currentPost.id}</em>
          </small>
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 3: MIDDLEWARE INTERACTION =====
/**
 * Middleware interaction demonstrating Express.js middleware concepts
 * Shows how to work with authentication, logging, and error handling
 */

function MiddlewareInteraction() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulate authentication with Express.js middleware
  const login = async (credentials) => {
    setLoading(true);
    
    try {
      // POST /api/auth/login - would go through Express.js auth middleware
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUser(result.user);
        addLog('Authentication successful', 'success');
      } else {
        addLog(result.message, 'error');
      }
    } catch (err) {
      addLog('Login failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Logout - would clear Express.js session
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      addLog('Logged out', 'info');
    } catch (err) {
      addLog('Logout error: ' + err.message, 'error');
    }
  };

  // Access protected route
  const accessProtectedResource = async () => {
    setLoading(true);
    
    try {
      // GET /api/protected - Express.js would check authentication middleware
      const response = await fetch('/api/protected');
      const result = await response.json();
      
      if (result.success) {
        addLog('Protected resource accessed: ' + result.data, 'success');
      } else {
        addLog('Access denied: ' + result.message, 'error');
      }
    } catch (err) {
      addLog('Error accessing protected resource: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Middleware Interaction</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Authentication Section */}
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h4>Authentication</h4>
          
          {user ? (
            <div>
              <p><strong>Logged in as:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <button onClick={logout} style={{ padding: '10px 20px' }}>
                Logout
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              login({
                email: formData.get('email'),
                password: formData.get('password'),
              });
            }}>
              <div style={{ marginBottom: '10px' }}>
                <input name="email" type="email" placeholder="Email" required style={{ width: '100%', padding: '8px' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input name="password" type="password" placeholder="Password" required style={{ width: '100%', padding: '8px' }} />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}
        </div>
        
        {/* Protected Resource Section */}
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h4>Protected Resource</h4>
          
          <button onClick={accessProtectedResource} disabled={loading} style={{ padding: '10px 20px' }}>
            {loading ? 'Accessing...' : 'Access Protected Resource'}
          </button>
          
          <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
            <p>This button simulates accessing a route protected by Express.js authentication middleware.</p>
            <p>Express.js middleware would check for valid session/token before allowing access.</p>
          </div>
        </div>
      </div>
      
      {/* Logs Section */}
      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h4>Request Logs (Simulated Express.js Logging)</h4>
        <div style={{ 
          height: '200px', 
          overflow: 'auto', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          padding: '10px',
          backgroundColor: '#f8f9fa'
        }}>
          {logs.map((log, index) => (
            <div key={index} style={{
              padding: '5px',
              margin: '2px 0',
              borderRadius: '3px',
              backgroundColor: log.type === 'error' ? '#ffebee' : log.type === 'success' ? '#d4edda' : '#e3f2fd',
              fontSize: '12px'
            }}>
              <strong>{log.timestamp}</strong> - {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== EXAMPLE 4: FILE UPLOADS =====
/**
 * File uploads demonstrating Express.js file handling
 * Shows how to upload and manage files with Express.js
 */

function FileUploads() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Simulate file upload to Express.js
  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // POST /api/upload - Express.js multer middleware would handle this
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          setFiles(prev => [...prev, result.file]);
          setUploadProgress(100);
        }
      };
      
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
      
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      // DELETE /api/files/:id - Express.js route
      await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    selectedFiles.forEach(file => uploadFile(file));
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>File Uploads</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'inline-block', 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Choose Files
          <input 
            type="file" 
            multiple 
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      
      {uploading && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            width: '300px', 
            height: '20px', 
            backgroundColor: '#e9ecef', 
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${uploadProgress}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p>Uploading... {Math.round(uploadProgress)}%</p>
        </div>
      )}
      
      {/* Files List */}
      <div style={{ textAlign: 'left' }}>
        <h4>Uploaded Files:</h4>
        {files.map(file => (
          <div key={file.id} style={{ 
            padding: '15px', 
            margin: '10px 0', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>{file.name}</strong>
              <br />
              <small>Size: {(file.size / 1024).toFixed(2)} KB | Type: {file.type}</small>
            </div>
            <button 
              onClick={() => deleteFile(file.id)}
              style={{ 
                padding: '5px 10px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Express.js Features Demonstrated:</strong></p>
        <ul style={{ textAlign: 'left' }}>
          <li>Multer middleware for file uploads</li>
          <li>File validation and storage</li>
          <li>Progress tracking during upload</li>
          <li>File deletion endpoints</li>
          <li>Static file serving</li>
        </ul>
      </div>
    </div>
  );
}

// ===== EXAMPLE 5: REAL-TIME COMMUNICATION =====
/**
 * Real-time communication demonstrating WebSocket/Socket.io integration
 * Shows how to work with Express.js real-time features
 */

function RealTimeCommunication() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState(false);

  // Simulate WebSocket connection to Express.js
  useEffect(() => {
    // In real implementation, this would connect to Socket.io server
    const mockSocket = {
      emit: (event, data) => {
        console.log('Emitting:', event, data);
        
        if (event === 'chat message') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            user: 'You',
            text: data,
            timestamp: new Date().toLocaleTimeString()
          }]);
        }
      },
      
      simulateConnection: () => {
        setConnected(true);
        setUsers(['Alice', 'Bob', 'Charlie', 'You']);
        
        // Simulate receiving initial messages
        setTimeout(() => {
          setMessages([
            { id: 1, user: 'System', text: 'Welcome to chat!', timestamp: new Date().toLocaleTimeString() },
            { id: 2, user: 'Alice', text: 'Hello everyone!', timestamp: new Date().toLocaleTimeString() }
          ]);
        }, 1000);
      }
    };
    
    mockSocket.simulateConnection();
    
    return () => {
      setConnected(false);
      setUsers([]);
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Emit message to Express.js Socket.io server
      const mockSocket = { emit: () => {} };
      mockSocket.emit('chat message', message);
      setMessage('');
      setTyping(false);
    }
  };

  const handleTyping = (text) => {
    setMessage(text);
    setTyping(text.length > 0);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Real-Time Communication</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Chat Section */}
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h4>Chat Room</h4>
          
          <div style={{ 
            height: '300px', 
            overflow: 'auto', 
            border: '1px solid #eee', 
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '15px',
            textAlign: 'left',
            backgroundColor: '#f8f9fa'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ 
                marginBottom: '10px', 
                padding: '8px',
                borderRadius: '5px',
                backgroundColor: msg.user === 'You' ? '#d4edda' : '#white'
              }}>
                <strong>{msg.user}:</strong> {msg.text}
                <br />
                <small style={{ color: '#666' }}>{msg.timestamp}</small>
              </div>
            ))}
          </div>
          
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text"
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              placeholder="Type a message..."
              style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '5px 0 0 5px',
                border: '1px solid #ddd'
              }}
            />
            <button 
              type="submit" 
              disabled={!message.trim()}
              style={{ 
                padding: '10px 20px', 
                borderRadius: '0 5px 5px 0',
                border: '1px solid #ddd',
                borderLeft: 'none'
              }}
            >
              Send
            </button>
          </form>
          
          {typing && (
            <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
              You are typing...
            </div>
          )}
        </div>
        
        {/* Users List */}
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h4>Connected Users</h4>
          
          <div style={{ marginBottom: '10px' }}>
            <span style={{ 
              padding: '5px 10px', 
              backgroundColor: connected ? '#28a745' : '#dc3545', 
              color: 'white',
              borderRadius: '15px'
            }}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div style={{ textAlign: 'left' }}>
            {users.map((user, index) => (
              <div key={index} style={{ 
                padding: '8px', 
                margin: '5px 0', 
                backgroundColor: user === 'You' ? '#007bff' : '#f8f9fa',
                borderRadius: '5px',
                color: user === 'You' ? 'white' : 'black'
              }}>
                {user} {user === 'You' && '(You)'}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Express.js Real-Time Features:</strong></p>
        <ul style={{ textAlign: 'left' }}>
          <li>Socket.io integration for WebSocket connections</li>
          <li>Real-time message broadcasting</li>
          <li>User presence tracking</li>
          <li>Typing indicators</li>
          <li>Room-based communication</li>
        </ul>
      </div>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all Express.js examples
 */
function ExpressExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Express.js Examples</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px' }}>
        <BasicHttpClient />
        <RouteParameters />
        <MiddlewareInteraction />
        <FileUploads />
        <RealTimeCommunication />
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px' 
      }}>
        <h3>Express.js Benefits</h3>
        <ul>
          <li><strong>Minimalist:</strong> Unopinionated, flexible framework</li>
          <li><strong>Middleware:</strong> Powerful middleware system</li>
          <li><strong>Routing:</strong> Simple, intuitive routing</li>
          <li><strong>Performance:</strong> Fast, scalable applications</li>
          <li><strong>Ecosystem:</strong> Rich ecosystem of middleware</li>
          <li><strong>HTTP Utilities:</strong> Built-in request/response helpers</li>
          <li><strong>Template Engines:</strong> Support for various templating</li>
          <li><strong>File Handling:</strong> Easy file upload/download</li>
          <li><strong>Real-time:</strong> WebSocket/Socket.io integration</li>
          <li><strong>Production Ready:</strong> Battle-tested and widely adopted</li>
        </ul>
        
        <h4>Key Concepts Demonstrated:</h4>
        <ul>
          <li><strong>HTTP Methods:</strong> GET, POST, PUT, DELETE</li>
          <li><strong>Route Parameters:</strong> Dynamic URL handling</li>
          <li><strong>Middleware:</strong> Authentication, logging, error handling</li>
          <li><strong>File Uploads:</strong> Multer integration</li>
          <li><strong>Real-time:</strong> Socket.io/WebSocket communication</li>
          <li><strong>Request/Response:</strong> Express.js object handling</li>
          <li><strong>Error Handling:</strong> Comprehensive error management</li>
        </ul>
        
        <h4>Installation:</h4>
        <pre style={{ backgroundColor: '#f1f3f4', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
{`npm install express
# or
yarn add express`}
        </pre>
      </div>
    </div>
  );
}

export default ExpressExamples;