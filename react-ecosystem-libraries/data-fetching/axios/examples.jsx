import React, { useState, useEffect } from 'react';

// Example 1: Basic GET Request
function BasicGetExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with axios
      // In real app: const response = await axios.get('/api/users');
      const response = {
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ]
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="axios-example">
      <h2>Basic GET Request</h2>
      <p>Demonstrates making a simple GET request with Axios.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div className="data-display">
          {data.map(user => (
            <div key={user.id} className="user-card">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// Basic GET request with axios
import axios from 'axios';

// Using promises
axios.get('/api/users')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

// Using async/await
async function fetchUsers() {
  try {
    const response = await axios.get('/api/users');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// With query parameters
axios.get('/api/users', {
  params: {
    page: 1,
    limit: 10
  }
})
  .then(response => {
    console.log(response.data);
  });
      `}</pre>
    </div>
  );
}

// Example 2: POST Request
function PostRequestExample() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with axios
      // In real app: const response = await axios.post('/api/users', formData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(),
        ...formData
      };
      
      setUsers(prev => [...prev, newUser]);
      setFormData({ name: '', email: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="axios-example">
      <h2>POST Request</h2>
      <p>Demonstrates making a POST request with Axios to create data.</p>
      
      <form onSubmit={handleSubmit} className="form-example">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
      
      {error && <p className="error">Error: {error}</p>}
      
      <div className="users-list">
        <h3>Users:</h3>
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        ))}
      </div>
      
      <pre>{`
// POST request with axios
import axios from 'axios';

// Using promises
axios.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
})
  .then(response => {
    console.log('User created:', response.data);
  })
  .catch(error => {
    console.error('Error creating user:', error);
  });

// Using async/await
async function createUser(userData) {
  try {
    const response = await axios.post('/api/users', userData);
    console.log('User created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// With headers
axios.post('/api/users', userData, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token-here'
  }
});
      `}</pre>
    </div>
  );
}

// Example 3: Request and Response Interceptors
function InterceptorsExample() {
  const [logs, setLogs] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const addLog = (message) => {
    setLogs(prev => [...prev, { message, timestamp: new Date().toLocaleTimeString() }]);
  };
  
  const fetchData = async () => {
    setLoading(true);
    addLog('Starting request...');
    
    try {
      // Simulate request interceptor
      addLog('Request interceptor: Adding auth token');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate response
      const response = {
        data: { message: 'Data fetched successfully', timestamp: Date.now() }
      };
      
      // Simulate response interceptor
      addLog('Response interceptor: Processing data');
      
      setData(response.data);
      addLog('Request completed successfully');
    } catch (error) {
      addLog(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="axios-example">
      <h2>Request and Response Interceptors</h2>
      <p>Demonstrates how to use Axios interceptors to modify requests and responses.</p>
      
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      
      {data && (
        <div className="response-data">
          <h3>Response Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      
      <div className="logs">
        <h3>Interceptor Logs:</h3>
        {logs.map((log, index) => (
          <div key={index} className="log-entry">
            <span className="timestamp">{log.timestamp}</span>
            <span className="message">{log.message}</span>
          </div>
        ))}
      </div>
      
      <pre>{`
// Request and response interceptors with axios
import axios from 'axios';

// Request interceptor
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    console.log('Request interceptor:', config);
    
    // Add auth token to headers
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    
    // Add timestamp to request
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  response => {
    // Do something with response data
    console.log('Response interceptor:', response);
    
    // Calculate request duration
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    console.log(\`Request took \${duration}ms\`);
    
    // Transform response data
    if (response.data && typeof response.data === 'object') {
      response.data.timestamp = new Date().toISOString();
    }
    
    return response;
  },
  error => {
    // Do something with response error
    console.error('Response error:', error);
    
    // Handle specific error codes
    if (error.response && error.response.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Remove interceptor if needed
const myInterceptor = axios.interceptors.request.use(() => {});
axios.interceptors.request.eject(myInterceptor);
      `}</pre>
    </div>
  );
}

// Example 4: Error Handling
function ErrorHandlingExample() {
  const [errorType, setErrorType] = useState('none');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const simulateError = async (type) => {
    setLoading(true);
    setError(null);
    setErrorType(type);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate different error types
      switch (type) {
        case 'network':
          throw new Error('Network Error: Failed to connect to server');
        case 'timeout':
          throw new Error('Request timeout: Server took too long to respond');
        case '404':
          const error404 = new Error('Not Found');
          error404.response = { status: 404, data: { message: 'Resource not found' } };
          throw error404;
        case '500':
          const error500 = new Error('Server Error');
          error500.response = { status: 500, data: { message: 'Internal server error' } };
          throw error500;
        default:
          setError('No error simulated');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="axios-example">
      <h2>Error Handling</h2>
      <p>Demonstrates different types of error handling with Axios.</p>
      
      <div className="error-buttons">
        <button onClick={() => simulateError('network')} disabled={loading}>
          Network Error
        </button>
        <button onClick={() => simulateError('timeout')} disabled={loading}>
          Timeout Error
        </button>
        <button onClick={() => simulateError('404')} disabled={loading}>
          404 Error
        </button>
        <button onClick={() => simulateError('500')} disabled={loading}>
          500 Error
        </button>
      </div>
      
      {loading && <p>Simulating error...</p>}
      
      {error && (
        <div className="error-display">
          <h3>Error Details:</h3>
          <p><strong>Type:</strong> {errorType}</p>
          <p><strong>Message:</strong> {error.message}</p>
          
          {error.response && (
            <div>
              <p><strong>Status:</strong> {error.response.status}</p>
              <p><strong>Response Data:</strong> {JSON.stringify(error.response.data)}</p>
            </div>
          )}
        </div>
      )}
      
      <pre>{`
// Error handling with axios
import axios from 'axios';

// Using catch with error inspection
axios.get('/api/data')
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('Error data:', error.response.data);
      console.log('Error status:', error.response.status);
      console.log('Error headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // error.request is an instance of XMLHttpRequest in the browser
      // and an instance of http.ClientRequest in node.js
      console.log('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error message:', error.message);
    }
    console.log('Error config:', error.config);
  });

// Using try/catch with async/await
async function fetchData() {
  try {
    const response = await axios.get('/api/data');
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle server response errors
      switch (error.response.status) {
        case 400:
          console.error('Bad request');
          break;
        case 401:
          console.error('Unauthorized');
          // Redirect to login
          break;
        case 404:
          console.error('Not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('Unknown error');
      }
    } else if (error.request) {
      // Handle network errors
      console.error('Network error');
    } else {
      // Handle other errors
      console.error('Error:', error.message);
    }
    throw error; // Re-throw for further handling
  }
}

// Global error handler
axios.interceptors.response.use(
  response => response,
  error => {
    // Global error handling
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors globally
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
      `}</pre>
    </div>
  );
}

// Example 5: Concurrent Requests
function ConcurrentRequestsExample() {
  const [data, setData] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchConcurrentData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate concurrent API calls with axios
      // In real app:
      // const [usersResponse, postsResponse] = await Promise.all([
      //   axios.get('/api/users'),
      //   axios.get('/api/posts')
      // ]);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const usersResponse = {
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' }
        ]
      };
      
      const postsResponse = {
        data: [
          { id: 1, title: 'First Post', userId: 1 },
          { id: 2, title: 'Second Post', userId: 2 }
        ]
      };
      
      setData({
        users: usersResponse.data,
        posts: postsResponse.data
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="axios-example">
      <h2>Concurrent Requests</h2>
      <p>Demonstrates making multiple requests concurrently with Axios.</p>
      
      <button onClick={fetchConcurrentData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      
      {error && <p className="error">Error: {error}</p>}
      
      {data.users.length > 0 && (
        <div className="data-display">
          <div className="users-section">
            <h3>Users:</h3>
            {data.users.map(user => (
              <div key={user.id} className="user-card">
                <h4>{user.name}</h4>
              </div>
            ))}
          </div>
          
          <div className="posts-section">
            <h3>Posts:</h3>
            {data.posts.map(post => (
              <div key={post.id} className="post-card">
                <h4>{post.title}</h4>
                <p>By User ID: {post.userId}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <pre>{`
// Concurrent requests with axios
import axios from 'axios';

// Using Promise.all with async/await
async function fetchUserData() {
  try {
    const [usersResponse, postsResponse] = await Promise.all([
      axios.get('/api/users'),
      axios.get('/api/posts')
    ]);
    
    console.log('Users:', usersResponse.data);
    console.log('Posts:', postsResponse.data);
    
    return {
      users: usersResponse.data,
      posts: postsResponse.data
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Using Promise.all with .then()
function fetchUserDataWithPromises() {
  Promise.all([
    axios.get('/api/users'),
    axios.get('/api/posts')
  ])
  .then(([usersResponse, postsResponse]) => {
    console.log('Users:', usersResponse.data);
    console.log('Posts:', postsResponse.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

// Using axios.spread (deprecated in favor of Promise.all destructuring)
import axios from 'axios';

function fetchUserDataWithSpread() {
  axios.all([
    axios.get('/api/users'),
    axios.get('/api/posts')
  ])
  .then(axios.spread((usersResponse, postsResponse) => {
    console.log('Users:', usersResponse.data);
    console.log('Posts:', postsResponse.data);
  }))
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

// Handling partial failures
async function fetchWithPartialFailure() {
  try {
    const results = await Promise.allSettled([
      axios.get('/api/users'),
      axios.get('/api/posts'),
      axios.get('/api/comments') // This might fail
    ]);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Request ${index} succeeded:`, result.value.data);
      } else {
        console.log(`Request ${index} failed:`, result.reason);
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}
      `}</pre>
    </div>
  );
}

// Example 6: Creating Axios Instances
function InstanceExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instanceType, setInstanceType] = useState('default');
  
  // Simulate different axios instances
  const fetchData = async (type) => {
    setLoading(true);
    setError(null);
    setInstanceType(type);
    
    try {
      // Simulate different instance configurations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let response;
      
      switch (type) {
        case 'default':
          response = {
            data: { message: 'Default instance response', timeout: 0 }
          };
          break;
        case 'custom':
          response = {
            data: { message: 'Custom instance response', timeout: 5000 }
          };
          break;
        case 'auth':
          response = {
            data: { message: 'Authenticated instance response', headers: { 'Authorization': 'Bearer token' } }
          };
          break;
        default:
          throw new Error('Unknown instance type');
      }
      
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="axios-example">
      <h2>Axios Instances</h2>
      <p>Demonstrates creating and using custom Axios instances with different configurations.</p>
      
      <div className="instance-buttons">
        <button onClick={() => fetchData('default')} disabled={loading}>
          Default Instance
        </button>
        <button onClick={() => fetchData('custom')} disabled={loading}>
          Custom Instance
        </button>
        <button onClick={() => fetchData('auth')} disabled={loading}>
          Authenticated Instance
        </button>
      </div>
      
      {loading && <p>Loading with {instanceType} instance...</p>}
      {error && <p className="error">Error: {error}</p>}
      {data && (
        <div className="instance-data">
          <h3>Response from {instanceType} instance:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      
      <pre>{`
// Creating and using axios instances
import axios from 'axios';

// Create a default instance
const defaultInstance = axios.create();

// Create a custom instance with specific configuration
const customInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'custom-value'
  }
});

// Create an authenticated instance
const authInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${localStorage.getItem('token')}\`
  }
});

// Using instances
async function fetchWithDefaultInstance() {
  try {
    const response = await defaultInstance.get('/api/data');
    return response.data;
  } catch (error) {
    console.error('Error with default instance:', error);
  }
}

async function fetchWithCustomInstance() {
  try {
    const response = await customInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error with custom instance:', error);
  }
}

async function fetchWithAuthInstance() {
  try {
    const response = await authInstance.post('/protected-data', {
      key: 'value'
    });
    return response.data;
  } catch (error) {
    console.error('Error with auth instance:', error);
  }
}

// Modifying instance defaults
customInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
customInstance.defaults.timeout = 8000;

// Adding interceptors to instances
authInstance.interceptors.request.use(
  config => {
    // Add timestamp to all requests
    config.metadata = { startTime: new Date() };
    return config;
  },
  error => Promise.reject(error)
);

authInstance.interceptors.response.use(
  response => {
    // Log response time
    const duration = new Date() - response.config.metadata.startTime;
    console.log(\`Request took \${duration}ms\`);
    return response;
  },
  error => {
    // Handle 401 errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
      `}</pre>
    </div>
  );
}

// Example 7: Request Cancellation
function CancellationExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelled, setCancelled] = useState(false);
  const abortControllerRef = React.useRef(null);
  
  const fetchData = () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    setLoading(true);
    setError(null);
    setCancelled(false);
    
    // Simulate API call with cancellation
    const simulateRequest = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check if request was cancelled
        if (abortController.signal.aborted) {
          throw new Error('Request was cancelled');
        }
        
        const response = {
          data: [
            { id: 1, title: 'Item 1' },
            { id: 2, title: 'Item 2' },
            { id: 3, title: 'Item 3' }
          ]
        };
        
        setData(response.data);
      } catch (err) {
        if (err.message === 'Request was cancelled') {
          setCancelled(true);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    simulateRequest();
  };
  
  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setCancelled(true);
      setLoading(false);
    }
  };
  
  return (
    <div className="axios-example">
      <h2>Request Cancellation</h2>
      <p>Demonstrates how to cancel requests with Axios.</p>
      
      <div className="cancellation-controls">
        <button onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : 'Start Request'}
        </button>
        <button onClick={cancelRequest} disabled={!loading}>
          Cancel Request
        </button>
      </div>
      
      {loading && <p>Request in progress... (Will complete in 3 seconds)</p>}
      {cancelled && <p className="cancelled">Request was cancelled</p>}
      {error && <p className="error">Error: {error}</p>}
      
      {data && (
        <div className="data-display">
          <h3>Data:</h3>
          {data.map(item => (
            <div key={item.id} className="item-card">
              <h4>{item.title}</h4>
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// Request cancellation with axios
import axios from 'axios';

// Using AbortController (modern approach)
async function fetchWithCancellation() {
  const controller = new AbortController();
  
  try {
    const response = await axios.get('/api/data', {
      signal: controller.signal
    });
    
    console.log('Data:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request was cancelled');
    } else {
      console.error('Error:', error);
    }
  }
}

// Cancel the request
function cancelRequest() {
  controller.abort();
}

// Using CancelToken (legacy approach)
import axios from 'axios';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

async function fetchWithCancelToken() {
  try {
    const response = await axios.get('/api/data', {
      cancelToken: source.token
    });
    
    console.log('Data:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request was cancelled:', error.message);
    } else {
      console.error('Error:', error);
    }
  }
}

// Cancel the request
function cancelRequestWithToken() {
  source.cancel('Request cancelled by user');
}

// Cancellation in React components
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const cancelTokenRef = useRef(null);
  
  useEffect(() => {
    const fetchData = async () => {
      // Cancel previous request if exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('New request started');
      }
      
      // Create new cancel token
      cancelTokenRef.current = CancelToken.source();
      
      setLoading(true);
      
      try {
        const response = await axios.get('/api/data', {
          cancelToken: cancelTokenRef.current.token
        });
        
        setData(response.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching data:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup function
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, []);
  
  return (
    <div>
      {loading ? <p>Loading...</p> : <div>{/* Render data */}</div>}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 8: File Upload
function FileUploadExample() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
    setError(null);
    setResult(null);
  };
  
  const uploadFile = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      // Simulate file upload with progress
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      // Simulate upload completion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setResult({
        filename: file.name,
        size: file.size,
        type: file.type,
        url: `https://example.com/uploads/${file.name}`
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="axios-example">
      <h2>File Upload</h2>
      <p>Demonstrates file upload with progress tracking using Axios.</p>
      
      <div className="upload-form">
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile} disabled={!file || loading}>
          {loading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
      
      {file && (
        <div className="file-info">
          <p><strong>File:</strong> {file.name}</p>
          <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
          <p><strong>Type:</strong> {file.type}</p>
        </div>
      )}
      
      {loading && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: \`\${progress}%\` }}></div>
          <p>Upload Progress: {progress}%</p>
        </div>
      )}
      
      {error && <p className="error">Error: {error}</p>}
      
      {result && (
        <div className="upload-result">
          <h3>Upload Successful!</h3>
          <p><strong>Filename:</strong> {result.filename}</p>
          <p><strong>Size:</strong> {(result.size / 1024).toFixed(2)} KB</p>
          <p><strong>Type:</strong> {result.type}</p>
          <p><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a></p>
        </div>
      )}
      
      <pre>{`
// File upload with axios
import axios from 'axios';

// Basic file upload
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('File uploaded:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// File upload with progress tracking
async function uploadFileWithProgress(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        
        if (onProgress) {
          onProgress(percentCompleted);
        }
        
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });
    
    console.log('File uploaded:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Multiple files upload
async function uploadMultipleFiles(files) {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('files', file);
  });
  
  try {
    const response = await axios.post('/api/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(\`Upload progress: \${percentCompleted}%\`);
      }
    });
    
    console.log('Files uploaded:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
}

// React component for file upload
function FileUploadComponent() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
    setError(null);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    
    try {
      await uploadFileWithProgress(file, setProgress);
      console.log('File uploaded successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      
      {loading && (
        <div>
          <div>Upload Progress: {progress}%</div>
          <div style={{ width: '100%', backgroundColor: '#e0e0e0' }}>
            <div
              style={{
                width: \`\${progress}%\`,
                backgroundColor: '#4caf50',
                height: '10px'
              }}
            />
          </div>
        </div>
      )}
      
      {error && <div>Error: {error}</div>}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function AxiosExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicGetExample, title: "Basic GET Request" },
    { component: PostRequestExample, title: "POST Request" },
    { component: InterceptorsExample, title: "Interceptors" },
    { component: ErrorHandlingExample, title: "Error Handling" },
    { component: ConcurrentRequestsExample, title: "Concurrent Requests" },
    { component: InstanceExample, title: "Axios Instances" },
    { component: CancellationExample, title: "Request Cancellation" },
    { component: FileUploadExample, title: "File Upload" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="axios-examples">
      <h1>Axios Examples</h1>
      <p>Comprehensive examples demonstrating Axios features and patterns.</p>
      
      <div className="example-navigation">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setActiveExample(index)}
            className={activeExample === index ? 'active' : ''}
          >
            {example.title}
          </button>
        ))}
      </div>
      
      <div className="example-content">
        <ActiveExampleComponent />
      </div>
      
      <div className="info-section">
        <h2>About Axios</h2>
        <p>
          Axios is a popular, promise-based HTTP client for the browser and Node.js. 
          It provides a simple API for making HTTP requests and handling responses, 
          with support for request and response transformation, interceptors, and automatic JSON data transformation.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Promise-based API</strong>: Uses promises for async operations</li>
          <li><strong>Request and Response Interception</strong>: Transform requests and responses</li>
          <li><strong>Request Cancellation</strong>: Abort pending requests</li>
          <li><strong>Automatic JSON Transformation</strong>: Convert responses to JSON</li>
          <li><strong>Error Handling</strong>: Comprehensive error handling</li>
          <li><strong>Request Timeout</strong>: Set timeout for requests</li>
          <li><strong>File Upload Support</strong>: Upload files with progress tracking</li>
          <li><strong>Request/Response Config</strong>: Configure requests and responses</li>
          <li><strong>Instance Creation</strong>: Create pre-configured instances</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`npm install axios`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import axios from 'axios';

// GET request
axios.get('/api/data')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// POST request
axios.post('/api/data', { name: 'John' })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// Using async/await
async function fetchData() {
  try {
    const response = await axios.get('/api/data');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}`}</pre>
      </div>
    </div>
  );
}