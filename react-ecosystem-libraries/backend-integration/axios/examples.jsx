// Axios Examples with Detailed Comments
// This file demonstrates various Axios concepts with comprehensive explanations

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ===== EXAMPLE 1: BASIC HTTP REQUESTS =====
/**
 * Basic HTTP requests demonstrating core Axios concepts
 * Axios provides a simple API for making HTTP requests
 */

// GET Request Example
function GetRequestExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Basic GET request using Axios
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
      
      // Axios automatically parses JSON response
      setData(response.data);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
    } catch (err) {
      // Axios provides detailed error information
      setError(err.message);
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>GET Request Example</h3>
      
      <button onClick={fetchData} disabled={loading} style={{ padding: '10px 20px' }}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {data && (
        <div style={{ marginTop: '20px', textAlign: 'left', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4>Response Data:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// POST Request Example
function PostRequestExample() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPost = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Data to send in POST request
      const postData = {
        title: 'New Post',
        body: 'This is a new post created with Axios',
        userId: 1
      };
      
      // POST request with data
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', postData);
      
      setResponse(response.data);
      console.log('Created post:', response.data);
      
    } catch (err) {
      setError(err.message);
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>POST Request Example</h3>
      
      <button onClick={createPost} disabled={loading} style={{ padding: '10px 20px' }}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {response && (
        <div style={{ marginTop: '20px', textAlign: 'left', padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
          <h4>Created Post:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 2: ADVANCED HTTP METHODS =====
/**
 * Advanced HTTP methods demonstrating PUT, PATCH, DELETE
 * Axios supports all standard HTTP methods
 */

function AdvancedMethodsExample() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const updatePost = async () => {
    setLoading(true);
    
    try {
      // PUT request to update entire resource
      const updateData = {
        id: 1,
        title: 'Updated Post Title',
        body: 'This post has been completely updated',
        userId: 1
      };
      
      const response = await axios.put('https://jsonplaceholder.typicode.com/posts/1', updateData);
      
      setResults(prev => [...prev, { type: 'PUT', data: response.data }]);
      
    } catch (err) {
      console.error('PUT Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const patchPost = async () => {
    setLoading(true);
    
    try {
      // PATCH request to partially update resource
      const patchData = {
        title: 'Partially Updated Title'
      };
      
      const response = await axios.patch('https://jsonplaceholder.typicode.com/posts/1', patchData);
      
      setResults(prev => [...prev, { type: 'PATCH', data: response.data }]);
      
    } catch (err) {
      console.error('PATCH Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    setLoading(true);
    
    try {
      // DELETE request to remove resource
      const response = await axios.delete('https://jsonplaceholder.typicode.com/posts/1');
      
      setResults(prev => [...prev, { type: 'DELETE', data: { status: response.status } }]);
      
    } catch (err) {
      console.error('DELETE Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Advanced HTTP Methods</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={updatePost} disabled={loading} style={{ margin: '5px', padding: '10px 15px' }}>
          PUT Update
        </button>
        <button onClick={patchPost} disabled={loading} style={{ margin: '5px', padding: '10px 15px' }}>
          PATCH Update
        </button>
        <button onClick={deletePost} disabled={loading} style={{ margin: '5px', padding: '10px 15px' }}>
          DELETE
        </button>
      </div>
      
      {results.length > 0 && (
        <div style={{ textAlign: 'left' }}>
          <h4>Results:</h4>
          {results.map((result, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h5>{result.type} Request:</h5>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 3: CONCURRENT REQUESTS =====
/**
 * Concurrent requests demonstrating multiple simultaneous requests
 * Axios provides utilities for handling multiple requests
 */

function ConcurrentRequestsExample() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMultipleData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Make multiple requests concurrently using Promise.all
      const [postsResponse, usersResponse, commentsResponse] = await Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5'),
        axios.get('https://jsonplaceholder.typicode.com/users?_limit=3'),
        axios.get('https://jsonplaceholder.typicode.com/comments?_limit=5')
      ]);
      
      setData({
        posts: postsResponse.data,
        users: usersResponse.data,
        comments: commentsResponse.data
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithAxiosAll = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Alternative using axios.all (deprecated but still works)
      const requests = [
        axios.get('https://jsonplaceholder.typicode.com/posts/1'),
        axios.get('https://jsonplaceholder.typicode.com/users/1'),
        axios.get('https://jsonplaceholder.typicode.com/comments/1')
      ];
      
      const responses = await axios.all(requests);
      
      setData({
        post: responses[0].data,
        user: responses[1].data,
        comment: responses[2].data
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Concurrent Requests</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchMultipleData} disabled={loading} style={{ margin: '5px', padding: '10px 15px' }}>
          {loading ? 'Loading...' : 'Fetch Multiple (Promise.all)'}
        </button>
        <button onClick={fetchWithAxiosAll} disabled={loading} style={{ margin: '5px', padding: '10px 15px' }}>
          {loading ? 'Loading...' : 'Fetch Multiple (axios.all)'}
        </button>
      </div>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {Object.keys(data).length > 0 && (
        <div style={{ textAlign: 'left' }}>
          <h4>Fetched Data:</h4>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h5>{key.charAt(0).toUpperCase() + key.slice(1)}:</h5>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 4: REQUEST CONFIGURATION =====
/**
 * Request configuration demonstrating custom headers, timeouts, and params
 * Axios provides extensive configuration options
 */

function RequestConfigExample() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeConfiguredRequest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Request with custom configuration
      const config = {
        method: 'get',
        url: 'https://jsonplaceholder.typicode.com/posts',
        headers: {
          'Content-Type': 'application/json',
          'Custom-Header': 'custom-value',
          'Authorization': 'Bearer your-token-here'
        },
        params: {
          _limit: 5,
          _sort: 'id',
          _order: 'desc'
        },
        timeout: 5000, // 5 seconds timeout
        responseType: 'json'
      };
      
      const response = await axios(config);
      
      setResponse({
        data: response.data,
        status: response.status,
        headers: response.headers,
        config: response.config
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Request Configuration</h3>
      
      <button onClick={makeConfiguredRequest} disabled={loading} style={{ padding: '10px 20px' }}>
        {loading ? 'Loading...' : 'Make Configured Request'}
      </button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {response && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h5>Status: {response.status}</h5>
            <h5>Data ({response.data.length} items):</h5>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
              {JSON.stringify(response.data.slice(0, 2), null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 5: INTERCEPTORS =====
/**
 * Interceptors demonstrating request and response interception
 * Interceptors allow you to transform requests/responses before they are handled
 */

function InterceptorsExample() {
  const [logs, setLogs] = useState([]);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Log request details
        const log = `Request: ${config.method?.toUpperCase()} ${config.url}`;
        setLogs(prev => [...prev, log]);
        
        // Add custom header
        config.headers['X-Request-Timestamp'] = new Date().toISOString();
        
        return config;
      },
      (error) => {
        const log = `Request Error: ${error.message}`;
        setLogs(prev => [...prev, log]);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        // Log response details
        const log = `Response: ${response.status} ${response.config.url}`;
        setLogs(prev => [...prev, log]);
        
        // Transform response data
        response.data.timestamp = new Date().toISOString();
        
        return response;
      },
      (error) => {
        const log = `Response Error: ${error.response?.status || 'Network'} ${error.message}`;
        setLogs(prev => [...prev, log]);
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const makeRequest = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
      setResponse(response.data);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Interceptors Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={makeRequest} style={{ margin: '5px', padding: '10px 15px' }}>
          Make Request
        </button>
        <button onClick={clearLogs} style={{ margin: '5px', padding: '10px 15px' }}>
          Clear Logs
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
        <div>
          <h4>Interceptor Logs:</h4>
          <div style={{ height: '200px', overflow: 'auto', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            {logs.map((log, index) => (
              <div key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4>Response Data:</h4>
          {response && (
            <div style={{ padding: '10px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== EXAMPLE 6: ERROR HANDLING =====
/**
 * Error handling demonstrating different types of errors
 * Axios provides detailed error information
 */

function ErrorHandlingExample() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const testNetworkError = async () => {
    setLoading(true);
    
    try {
      // This will fail due to invalid URL
      await axios.get('https://invalid-url-that-does-not-exist.com/api');
    } catch (error) {
      const errorInfo = {
        type: 'Network Error',
        message: error.message,
        code: error.code,
        config: error.config
      };
      setErrors(prev => [...prev, errorInfo]);
    } finally {
      setLoading(false);
    }
  };

  const test404Error = async () => {
    setLoading(true);
    
    try {
      // This will return 404
      await axios.get('https://jsonplaceholder.typicode.com/nonexistent-endpoint');
    } catch (error) {
      const errorInfo = {
        type: '404 Error',
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      };
      setErrors(prev => [...prev, errorInfo]);
    } finally {
      setLoading(false);
    }
  };

  const testTimeoutError = async () => {
    setLoading(true);
    
    try {
      // This will timeout
      await axios.get('https://httpbin.org/delay/10', { timeout: 1000 });
    } catch (error) {
      const errorInfo = {
        type: 'Timeout Error',
        message: error.message,
        code: error.code
      };
      setErrors(prev => [...prev, errorInfo]);
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Error Handling Examples</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testNetworkError} disabled={loading} style={{ margin: '5px', padding: '10px 15px' }}>
          Test Network Error
        </button>
        <button onClick={test404Error} disabled={loading} style={{ margin: '5px', padding: '10px 15px' }}>
          Test 404 Error
        </button>
        <button onClick={testTimeoutError} disabled={loading} style={{ margin: '5px', padding: '10px 15px' }}>
          Test Timeout Error
        </button>
        <button onClick={clearErrors} style={{ margin: '5px', padding: '10px 15px' }}>
          Clear Errors
        </button>
      </div>
      
      {errors.length > 0 && (
        <div style={{ textAlign: 'left' }}>
          <h4>Error Details:</h4>
          {errors.map((error, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
              <h5>{error.type}:</h5>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 7: AXIOS INSTANCE =====
/**
 * Axios instance demonstrating custom instances with default configuration
 * Instances allow you to create pre-configured Axios clients
 */

function AxiosInstanceExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create custom Axios instance
  const apiClient = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'axios-instance-example'
    }
  });

  // Add interceptors to the instance
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        console.log('Instance Request:', config.method?.toUpperCase(), config.url);
        return config;
      }
    );

    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => {
        console.log('Instance Response:', response.status);
        return response;
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const fetchWithInstance = async () => {
    setLoading(true);
    
    try {
      // Use the instance to make requests
      const response = await apiClient.get('/posts/1');
      setData(response.data);
    } catch (error) {
      console.error('Instance request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const postWithInstance = async () => {
    setLoading(true);
    
    try {
      const postData = {
        title: 'Post created with instance',
        body: 'This post was created using a custom Axios instance',
        userId: 1
      };
      
      const response = await apiClient.post('/posts', postData);
      setData(response.data);
    } catch (error) {
      console.error('Instance post failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Axios Instance Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchWithInstance} disabled={loading} style={{ margin: '5px', padding: '10px 15px' }}>
          {loading ? 'Loading...' : 'GET with Instance'}
        </button>
        <button onClick={postWithInstance} disabled={loading} style={{ margin: '5px', padding: '10px 15px' }}>
          {loading ? 'Loading...' : 'POST with Instance'}
        </button>
      </div>
      
      {data && (
        <div style={{ textAlign: 'left', padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
          <h4>Response from Instance:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all Axios examples
 */
function AxiosExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Axios Examples</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <GetRequestExample />
        <PostRequestExample />
        <AdvancedMethodsExample />
        <ConcurrentRequestsExample />
        <RequestConfigExample />
        <InterceptorsExample />
        <ErrorHandlingExample />
        <AxiosInstanceExample />
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px' 
      }}>
        <h3>Axios Benefits</h3>
        <ul>
          <li><strong>Promise-based:</strong> Works with async/await and Promises</li>
          <li><strong>Automatic JSON:</strong> Automatically parses JSON responses</li>
          <li><strong>Error Handling:</strong> Comprehensive error information</li>
          <li><strong>Interceptors:</strong> Transform requests/responses</li>
          <li><strong>Instances:</strong> Create pre-configured clients</li>
          <li><strong>Timeout Support:</strong> Built-in request timeout</li>
          <li><strong>Request Cancellation:</strong> Cancel requests with CancelToken</li>
          <li><strong>Browser & Node.js:</strong> Works in both environments</li>
          <li><strong>TypeScript Support:</strong> Excellent type definitions</li>
        </ul>
        
        <h4>Key Concepts Demonstrated:</h4>
        <ul>
          <li><strong>Basic Requests:</strong> GET, POST, PUT, PATCH, DELETE</li>
          <li><strong>Concurrent Requests:</strong> Promise.all and axios.all</li>
          <li><strong>Configuration:</strong> Headers, params, timeout</li>
          <li><strong>Interceptors:</strong> Request/response transformation</li>
          <li><strong>Error Handling:</strong> Network, HTTP, timeout errors</li>
          <li><strong>Instances:</strong> Custom Axios clients</li>
        </ul>
      </div>
    </div>
  );
}

export default AxiosExamples;