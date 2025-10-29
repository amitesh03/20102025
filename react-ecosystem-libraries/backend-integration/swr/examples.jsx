// SWR Examples with Detailed Comments
// This file demonstrates various SWR concepts with comprehensive explanations

import React, { useState } from 'react';
import useSWR, { useSWRConfig, mutate } from 'swr';

// ===== EXAMPLE 1: BASIC DATA FETCHING =====
/**
 * Basic data fetching demonstrating core SWR concepts
 * SWR provides data fetching with caching, revalidation, and more
 */

// Fetcher function for SWR
const fetcher = async (url) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }
  
  return response.json();
};

// Mock fetcher for demonstration (since we can't make real API calls)
const mockFetcher = async (key) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data based on the key
  if (key === 'posts') {
    return [
      { id: 1, title: 'Post 1', body: 'This is the first post' },
      { id: 2, title: 'Post 2', body: 'This is the second post' },
      { id: 3, title: 'Post 3', body: 'This is the third post' },
    ];
  }
  
  if (key.startsWith('post/')) {
    const id = key.split('/')[1];
    return {
      id: parseInt(id),
      title: `Post ${id}`,
      body: `This is the content of post ${id}`,
      userId: 1
    };
  }
  
  return null;
};

function BasicDataFetching() {
  // Basic useSWR hook
  const {
    data: posts,
    error,
    isLoading,
    isValidating,
    mutate: localMutate
  } = useSWR(
    'posts', // Key - unique identifier for this query
    mockFetcher, // Fetcher function
    {
      // SWR options
      revalidateOnFocus: true, // Revalidate when window gets focus
      revalidateOnReconnect: true, // Revalidate when network reconnects
      refreshInterval: 0, // Auto refresh interval (0 = disabled)
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      errorRetryCount: 3, // Number of retry attempts on error
      errorRetryInterval: 5000, // Delay between retries
    }
  );

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Basic Data Fetching</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => localMutate()} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Revalidate
        </button>
        <button onClick={() => localMutate(undefined, { revalidate: false })} style={{ padding: '10px 20px' }}>
          Update without Revalidation
        </button>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          Loading posts...
        </div>
      )}
      
      {/* Validating state (revalidating in background) */}
      {isValidating && !isLoading && (
        <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '8px', marginBottom: '10px' }}>
          Revalidating...
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px', color: '#c62828' }}>
          Error: {error.message}
        </div>
      )}
      
      {/* Success state */}
      {posts && (
        <div style={{ textAlign: 'left' }}>
          <h4>Posts ({posts.length}):</h4>
          {posts.map(post => (
            <div key={post.id} style={{ 
              padding: '15px', 
              margin: '10px 0', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '8px' 
            }}>
              <h5>{post.title}</h5>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 2: CONDITIONAL FETCHING =====
/**
 * Conditional fetching demonstrating data fetching based on conditions
 * Use conditional keys to fetch data only when certain conditions are met
 */

function ConditionalFetching() {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [shouldFetchPosts, setShouldFetchPosts] = useState(false);

  // Conditional fetch - only fetch when shouldFetchPosts is true
  const {
    data: posts,
    error: postsError,
    isLoading: postsLoading
  } = useSWR(
    shouldFetchPosts ? 'posts' : null, // Conditional key
    mockFetcher
  );

  // Conditional fetch - only fetch when selectedPostId is not null
  const {
    data: selectedPost,
    error: postError,
    isLoading: postLoading
  } = useSWR(
    selectedPostId ? `post/${selectedPostId}` : null, // Conditional key
    mockFetcher
  );

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Conditional Fetching</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShouldFetchPosts(!shouldFetchPosts)} 
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          {shouldFetchPosts ? 'Stop Fetching Posts' : 'Start Fetching Posts'}
        </button>
      </div>
      
      {/* Posts section */}
      {shouldFetchPosts && (
        <div style={{ marginBottom: '20px' }}>
          {postsLoading && <div>Loading posts...</div>}
          {postsError && <div>Error loading posts: {postsError.message}</div>}
          
          {posts && (
            <div>
              <h4>Select a Post:</h4>
              {posts.map(post => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  style={{
                    margin: '5px',
                    padding: '10px 15px',
                    backgroundColor: selectedPostId === post.id ? '#007bff' : '#e9ecef',
                    color: selectedPostId === post.id ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {post.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Selected post section */}
      {selectedPostId && (
        <div>
          {postLoading && <div>Loading post details...</div>}
          {postError && <div>Error loading post: {postError.message}</div>}
          
          {selectedPost && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#e8f5e8', 
              borderRadius: '8px',
              textAlign: 'left'
            }}>
              <h4>Selected Post Details:</h4>
              <h5>{selectedPost.title}</h5>
              <p>{selectedPost.body}</p>
              <p><strong>User ID:</strong> {selectedPost.userId}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 3: GLOBAL MUTATION =====
/**
 * Global mutation demonstrating how to mutate data globally
 * Use the mutate function from useSWRConfig for global mutations
 */

function GlobalMutationExample() {
  const { mutate } = useSWRConfig();
  const [mutationLog, setMutationLog] = useState([]);

  const addLog = (message) => {
    setMutationLog(prev => [...prev, { message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const globalMutatePosts = () => {
    addLog('Globally mutating posts...');
    
    // Global mutation - affects all components using 'posts' key
    mutate('posts', async (currentPosts) => {
      // Optimistic update
      const newPost = {
        id: Date.now(),
        title: `New Post ${Date.now()}`,
        body: 'This post was added via global mutation'
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [...(currentPosts || []), newPost];
    }, false); // false = don't revalidate
  };

  const globalMutateWithRevalidation = () => {
    addLog('Globally mutating posts with revalidation...');
    
    // Global mutation with revalidation
    mutate('posts');
  };

  const globalMutateMultiple = () => {
    addLog('Globally mutating multiple keys...');
    
    // Mutate multiple keys
    mutate(
      key => typeof key === 'string' && key.includes('post'),
      undefined,
      { revalidate: true }
    );
  };

  const clearLogs = () => {
    setMutationLog([]);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Global Mutation Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={globalMutatePosts} style={{ margin: '5px', padding: '10px 15px' }}>
          Add Post (Optimistic)
        </button>
        <button onClick={globalMutateWithRevalidation} style={{ margin: '5px', padding: '10px 15px' }}>
          Revalidate Posts
        </button>
        <button onClick={globalMutateMultiple} style={{ margin: '5px', padding: '10px 15px' }}>
          Mutate Multiple
        </button>
        <button onClick={clearLogs} style={{ margin: '5px', padding: '10px 15px' }}>
          Clear Logs
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
        <div>
          <h4>Mutation Logs:</h4>
          <div style={{ height: '200px', overflow: 'auto', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            {mutationLog.map((log, index) => (
              <div key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
                <strong>{log.timestamp}:</strong> {log.message}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <PostsDisplay />
        </div>
      </div>
    </div>
  );
}

// Helper component to display posts
function PostsDisplay() {
  const { data: posts, isLoading } = useSWR('posts', mockFetcher);
  
  return (
    <div>
      <h4>Current Posts:</h4>
      {isLoading && <div>Loading...</div>}
      {posts && (
        <div style={{ height: '200px', overflow: 'auto', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          {posts.map(post => (
            <div key={post.id} style={{ marginBottom: '10px', padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
              <strong>{post.title}</strong>
              <p style={{ margin: '5px 0', fontSize: '12px' }}>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 4: AUTO REFRESH =====
/**
 * Auto refresh demonstrating automatic data revalidation
 * Use refreshInterval for periodic data updates
 */

function AutoRefreshExample() {
  const [refreshInterval, setRefreshInterval] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Mock fetcher that returns data with timestamp
  const timedFetcher = async (key) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const timestamp = new Date().toLocaleTimeString();
    setLastUpdate(timestamp);
    
    return [
      { id: 1, title: `Post 1 - ${timestamp}`, body: 'This post updates automatically' },
      { id: 2, title: `Post 2 - ${timestamp}`, body: 'This post also updates automatically' },
    ];
  };

  const {
    data: posts,
    error,
    isLoading
  } = useSWR(
    'auto-refresh-posts',
    timedFetcher,
    {
      refreshInterval, // Auto refresh interval in milliseconds
      dedupingInterval: 1000, // Prevent duplicate requests
    }
  );

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Auto Refresh Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Refresh Interval:</label>
        <select 
          value={refreshInterval} 
          onChange={(e) => setRefreshInterval(Number(e.target.value))}
          style={{ padding: '5px', marginRight: '10px' }}
        >
          <option value={0}>Disabled</option>
          <option value={1000}>1 second</option>
          <option value={2000}>2 seconds</option>
          <option value={5000}>5 seconds</option>
        </select>
        
        {lastUpdate && (
          <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
            Last update: {lastUpdate}
          </span>
        )}
      </div>
      
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      
      {posts && (
        <div style={{ textAlign: 'left' }}>
          <h4>Auto-refreshing Posts:</h4>
          {posts.map(post => (
            <div key={post.id} style={{ 
              padding: '15px', 
              margin: '10px 0', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '8px' 
            }}>
              <h5>{post.title}</h5>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 5: ERROR HANDLING =====
/**
 * Error handling demonstrating comprehensive error management
 * SWR provides detailed error information and retry mechanisms
 */

function ErrorHandlingExample() {
  const [shouldError, setShouldError] = useState(false);

  // Fetcher that can simulate errors
  const errorFetcher = async (key) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (shouldError) {
      throw new Error('Simulated fetch error');
    }
    
    return { message: 'Data fetched successfully', timestamp: new Date().toLocaleTimeString() };
  };

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate: localMutate
  } = useSWR(
    'error-test',
    errorFetcher,
    {
      errorRetryCount: 3, // Number of retry attempts
      errorRetryInterval: 2000, // Delay between retries
      shouldRetryOnError: true, // Whether to retry on error
      onError: (error, key) => {
        console.error('SWR Error:', error, 'Key:', key);
      },
      onLoadingSlow: (key, config) => {
        console.log('Loading slow for key:', key);
      }
    }
  );

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Error Handling Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShouldError(!shouldError)} 
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          {shouldError ? 'Disable Errors' : 'Enable Errors'}
        </button>
        <button onClick={() => localMutate()} style={{ padding: '10px 20px' }}>
          Retry
        </button>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          Loading data...
        </div>
      )}
      
      {/* Validating state */}
      {isValidating && !isLoading && (
        <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '8px', marginBottom: '10px' }}>
          Revalidating...
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px', color: '#c62828' }}>
          <h4>Error Details:</h4>
          <p><strong>Message:</strong> {error.message}</p>
          <p><strong>Type:</strong> {error.constructor.name}</p>
          <p>SWR will automatically retry this error {3} times with 2 second intervals.</p>
        </div>
      )}
      
      {/* Success state */}
      {data && (
        <div style={{ padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
          <h4>Success:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 6: CUSTOM FETCHER =====
/**
 * Custom fetcher demonstrating advanced fetcher patterns
 * Create reusable fetchers with different configurations
 */

// Custom fetcher with authentication
const authenticatedFetcher = async (url) => {
  const token = 'mock-auth-token';
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Custom fetcher with POST method
const postFetcher = async ([url, data]) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Custom fetcher with timeout
const timeoutFetcher = async (url, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

function CustomFetcherExample() {
  const [fetcherType, setFetcherType] = useState('mock');
  const [postData, setPostData] = useState({ title: 'Test Post', body: 'Test content' });

  // Mock data for different fetcher types
  const mockData = {
    authenticated: { user: 'John Doe', role: 'admin' },
    post: { id: 1, ...postData, createdAt: new Date().toISOString() },
    timeout: { message: 'Data fetched within timeout' },
    mock: { message: 'Mock data for demonstration' }
  };

  // Mock fetcher that simulates different responses
  const customMockFetcher = async (key) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockData[fetcherType] || mockData.mock;
  };

  const {
    data,
    error,
    isLoading,
    mutate
  } = useSWR(
    `custom-fetcher-${fetcherType}`,
    customMockFetcher
  );

  const handlePostSubmit = (e) => {
    e.preventDefault();
    setFetcherType('post');
    mutate();
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Custom Fetcher Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Fetcher Type:</label>
        <select 
          value={fetcherType} 
          onChange={(e) => setFetcherType(e.target.value)}
          style={{ padding: '5px', marginRight: '10px' }}
        >
          <option value="mock">Mock</option>
          <option value="authenticated">Authenticated</option>
          <option value="post">POST</option>
          <option value="timeout">Timeout</option>
        </select>
        
        <button onClick={() => mutate()} style={{ padding: '5px 10px' }}>
          Refetch
        </button>
      </div>
      
      {/* POST form */}
      {fetcherType === 'post' && (
        <form onSubmit={handlePostSubmit} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Title"
              value={postData.title}
              onChange={(e) => setPostData({...postData, title: e.target.value})}
              style={{ padding: '5px', marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="Body"
              value={postData.body}
              onChange={(e) => setPostData({...postData, body: e.target.value})}
              style={{ padding: '5px' }}
            />
          </div>
          <button type="submit" style={{ padding: '5px 15px' }}>
            Submit POST
          </button>
        </form>
      )}
      
      {isLoading && <div>Loading with {fetcherType} fetcher...</div>}
      {error && <div>Error: {error.message}</div>}
      
      {data && (
        <div style={{ textAlign: 'left', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4>Response from {fetcherType} fetcher:</h4>
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
 * Main component that demonstrates all SWR examples
 */
function SWRExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>SWR Examples</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <BasicDataFetching />
        <ConditionalFetching />
        <GlobalMutationExample />
        <AutoRefreshExample />
        <ErrorHandlingExample />
        <CustomFetcherExample />
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '10px' 
      }}>
        <h3>SWR Benefits</h3>
        <ul>
          <li><strong>Lightweight:</strong> Small bundle size with minimal dependencies</li>
          <li><strong>Auto Revalidation:</strong> Automatic data refetching on focus, reconnect, and interval</li>
          <li><strong>Caching:</strong> Built-in intelligent caching with deduplication</li>
          <li><strong>Optimistic UI:</strong> Easy optimistic updates with mutate function</li>
          <li><strong>Error Handling:</strong> Comprehensive error handling with retry logic</li>
          <li><strong>TypeScript Support:</strong> Excellent type safety</li>
          <li><strong>Flexible:</strong> Works with any fetching library</li>
          <li><strong>SSR Support:</strong> Built-in server-side rendering support</li>
          <li><strong>DevTools:</strong> Excellent developer tools for debugging</li>
          <li><strong>React Hooks:</strong> Simple and intuitive hook-based API</li>
        </ul>
        
        <h4>Key Concepts Demonstrated:</h4>
        <ul>
          <li><strong>useSWR:</strong> Basic data fetching hook</li>
          <li><strong>Conditional Fetching:</strong> Data fetching based on conditions</li>
          <li><strong>Global Mutation:</strong> Cross-component data mutation</li>
          <li><strong>Auto Refresh:</strong> Periodic data revalidation</li>
          <li><strong>Error Handling:</strong> Comprehensive error management</li>
          <li><strong>Custom Fetchers:</strong> Reusable fetching logic</li>
          <li><strong>Mutate Function:</strong> Manual data updates</li>
          <li><strong>SWR Config:</strong> Global configuration management</li>
        </ul>
      </div>
    </div>
  );
}

export default SWRExamples;