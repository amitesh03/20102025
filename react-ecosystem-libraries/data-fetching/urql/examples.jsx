import React, { useState, useEffect, useRef } from 'react';

// Note: These examples demonstrate URQL concepts in a web-compatible format
// In a real app, you would install urql and use actual GraphQL endpoints

// Example 1: Basic Setup and Query
function BasicSetupExample() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // Simulate URQL client setup
  const mockClient = {
    query: async ({ query }) => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          data: {
            posts: [
              { id: '1', title: 'First Post', content: 'Content of first post' },
              { id: '2', title: 'Second Post', content: 'Content of second post' }
            ]
          }
        };
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const fetchData = async () => {
    const result = await mockClient.query({
      query: 'GET_POSTS'
    });
    setData(result.data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="urql-example">
      <h2>Basic Setup and Query</h2>
      <p>Demonstrates URQL client initialization and basic querying.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div className="data-display">
          {data.posts.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// URQL Basic Setup:
import { createClient, Provider, useQuery } from 'urql';
import { cacheExchange, fetchExchange } from 'urql';

// Create URQL client
const client = createClient({
  url: 'https://your-graphql-endpoint.com/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

// Wrap app with Provider
function App() {
  return (
    <Provider value={client}>
      <Posts />
    </Provider>
  );
}

// Define GraphQL query
const GET_POSTS = \`
  query GetPosts {
    posts {
      id
      title
      content
    }
  }
\`;

// Use query in component
function Posts() {
  const [result] = useQuery(GET_POSTS);
  const { fetching, error, data } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.posts?.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 2: Mutations
function MutationExample() {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [posts, setPosts] = useState([
    { id: '1', title: 'Existing Post', content: 'Existing content' }
  ]);
  const [loading, setLoading] = useState(false);
  
  // Simulate mutation
  const mockMutation = async (variables) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPost = {
      id: String(Date.now()),
      ...variables
    };
    setPosts(prev => [...prev, newPost]);
    setLoading(false);
    return { data: { createPost: newPost } };
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await mockMutation(formData);
    setFormData({ title: '', content: '' });
  };
  
  return (
    <div className="urql-example">
      <h2>Mutations</h2>
      <p>Demonstrates GraphQL mutations with URQL.</p>
      
      <form onSubmit={handleSubmit} className="mutation-form">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
      
      <div className="posts-list">
        <h3>Posts:</h3>
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      
      <pre>{`
// URQL Mutations:
import { gql, useMutation } from 'urql';

const CREATE_POST = gql\`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
    }
  }
\`;

function PostForm() {
  const [createPostResult, createPost] = useMutation(CREATE_POST);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createPost(formData);
    if (result.error) {
      console.error('Mutation error:', result.error);
    } else {
      console.log('Post created:', result.data);
      setFormData({ title: '', content: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title"
      />
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        placeholder="Content"
      />
      <button type="submit" disabled={createPostResult.fetching}>
        {createPostResult.fetching ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
      `}</pre>
    </div>
  );
}

// Example 3: Caching with Graphcache
function CachingExample() {
  const [cachePolicy, setCachePolicy] = useState('cache-first');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cacheHits, setCacheHits] = useState(0);
  
  // Simulate cache behavior
  const mockCache = new Map();
  
  const fetchData = async (policy) => {
    setLoading(true);
    const cacheKey = 'users';
    
    if (policy === 'cache-first' && mockCache.has(cacheKey)) {
      setData(mockCache.get(cacheKey));
      setCacheHits(prev => prev + 1);
      setLoading(false);
      return;
    }
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    const newData = {
      users: [
        { id: '1', name: 'Alice', email: 'alice@example.com' },
        { id: '2', name: 'Bob', email: 'bob@example.com' }
      ]
    };
    
    mockCache.set(cacheKey, newData);
    setData(newData);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchData(cachePolicy);
  }, [cachePolicy]);
  
  return (
    <div className="urql-example">
      <h2>Caching with Graphcache</h2>
      <p>Demonstrates URQL caching strategies.</p>
      
      <div className="cache-controls">
        <label>Cache Policy:</label>
        <select value={cachePolicy} onChange={(e) => setCachePolicy(e.target.value)}>
          <option value="cache-first">Cache First</option>
          <option value="network-only">Network Only</option>
          <option value="cache-only">Cache Only</option>
          <option value="cache-and-network">Cache and Network</option>
        </select>
        <button onClick={() => fetchData(cachePolicy)}>Refetch</button>
      </div>
      
      <div className="cache-stats">
        <p>Cache Hits: {cacheHits}</p>
      </div>
      
      {loading && <p>Loading...</p>}
      {data && (
        <div className="users-grid">
          {data.users.map(user => (
            <div key={user.id} className="user-card">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// URQL Graphcache Setup:
import { createClient, cacheExchange, fetchExchange } from 'urql';
import { offlineExchange } from '@urql/exchange-graphcache';

const client = createClient({
  url: 'https://your-graphql-endpoint.com/graphql',
  exchanges: [
    offlineExchange({
      storage: makeStorage({ idbName: 'urql-cache' }),
    }),
    cacheExchange({
      // Cache configuration
      keys: {
        User: data => data.id,
        Post: data => data.id,
      },
      resolvers: {
        Query: {
          posts: {
            // Custom resolver for posts
            posts: (parent, args) => {
              return { __typename: 'PostConnection', edges: [] };
            },
          },
        },
      },
      updates: {
        Mutation: {
          createPost: (result, args, cache) => {
            // Update cache when post is created
            cache.updateQuery({ query: GET_POSTS }, (data) => {
              if (data) {
                return {
                  ...data,
                  posts: [...data.posts, result.createPost],
                };
              }
              return data;
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
});

// Using different request policies:
function UserList() {
  const [result, reexecute] = useQuery(GET_USERS, {
    requestPolicy: 'cache-first', // or 'network-only', 'cache-only', 'cache-and-network'
    context: {
      // Additional context for the request
      requestPolicy: 'cache-first',
    },
  });

  const { fetching, error, data, stale } = result;

  // Manual cache invalidation
  const invalidateCache = () => {
    reexecute({ requestPolicy: 'network-only' });
  };

  return (
    <div>
      <button onClick={invalidateCache}>Refresh Data</button>
      {fetching && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          {data.users.map(user => (
            <div key={user.id}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 4: Subscriptions
function SubscriptionExample() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  // Simulate WebSocket subscription
  useEffect(() => {
    if (connected) {
      const interval = setInterval(() => {
        const mockMessage = {
          id: Date.now(),
          text: `Message ${Date.now()}`,
          user: 'User ' + Math.floor(Math.random() * 100),
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, mockMessage]);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [connected]);
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        user: 'Me',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };
  
  return (
    <div className="urql-example">
      <h2>Subscriptions</h2>
      <p>Demonstrates real-time GraphQL subscriptions with URQL.</p>
      
      <button onClick={() => setConnected(!connected)}>
        {connected ? 'Disconnect' : 'Connect'} Subscription
      </button>
      
      {connected && (
        <div className="subscription-status">
          <span className="status-indicator connected"></span>
          Connected to subscription
        </div>
      )}
      
      <div className="messages-container">
        <h3>Messages:</h3>
        {messages.map(message => (
          <div key={message.id} className="message">
            <strong>{message.user}:</strong> {message.text}
            <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!connected}
        />
        <button type="submit" disabled={!connected}>Send</button>
      </form>
      
      <pre>{`
// URQL Subscriptions:
import { createClient, useSubscription } from 'urql';
import { subscriptionExchange } from '@urql/exchange-subscription';
import { createClient as createWSClient } from 'graphql-ws';

// WebSocket client for subscriptions
const wsClient = createWSClient({
  url: 'wss://your-graphql-endpoint.com/graphql',
  connectionParams: {
    authToken: 'your-auth-token',
  },
});

const client = createClient({
  url: 'https://your-graphql-endpoint.com/graphql',
  exchanges: [
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => {
          const subscription = wsClient.subscribe(operation);
          
          subscription.subscribe({
            next: sink.next,
            error: sink.error,
            complete: sink.complete,
          });
          
          return () => subscription.unsubscribe();
        },
      }),
    }),
    cacheExchange,
    fetchExchange,
  ],
});

// Subscription query
const MESSAGE_SUBSCRIPTION = gql\`
  subscription MessageAdded {
    messageAdded {
      id
      text
      user
      timestamp
    }
  }
\`;

function MessageList() {
  const [result] = useSubscription(MESSAGE_SUBSCRIPTION);
  const { data, error } = result;

  useEffect(() => {
    if (data) {
      console.log('New message:', data.messageAdded);
    }
  }, [data]);

  return (
    <div>
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <strong>{data.messageAdded.user}:</strong> {data.messageAdded.text}
          <small>{new Date(data.messageAdded.timestamp).toLocaleTimeString()}</small>
        </div>
      )}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 5: Error Handling and Retry
function ErrorHandlingExample() {
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simulate API with potential errors
  const fetchDataWithRetry = async (attempt = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random error
      if (Math.random() > 0.7 && attempt < 3) {
        throw new Error('Network error occurred');
      }
      
      setData({
        todos: [
          { id: '1', title: 'Todo 1', completed: false },
          { id: '2', title: 'Todo 2', completed: true }
        ]
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRetry = () => {
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);
    fetchDataWithRetry(newRetryCount);
  };
  
  useEffect(() => {
    fetchDataWithRetry();
  }, []);
  
  return (
    <div className="urql-example">
      <h2>Error Handling and Retry</h2>
      <p>Demonstrates error handling strategies in URQL.</p>
      
      {loading && <p>Loading...</p>}
      {error && (
        <div className="error-display">
          <h4>Error: {error.message}</h4>
          <p>Retry attempts: {retryCount}</p>
          {retryCount < 3 && (
            <button onClick={handleRetry}>Retry</button>
          )}
          {retryCount >= 3 && (
            <p>Max retry attempts reached. Please try again later.</p>
          )}
        </div>
      )}
      {data && (
        <div className="todos-list">
          {data.todos.map(todo => (
            <div key={todo.id} className="todo-card">
              <h4>{todo.title}</h4>
              <p>Status: {todo.completed ? 'Completed' : 'Pending'}</p>
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// URQL Error Handling:
import { createClient, useQuery, retryExchange } from 'urql';
import { dedupExchange, cacheExchange, fetchExchange } from 'urql';

const client = createClient({
  url: 'https://your-graphql-endpoint.com/graphql',
  exchanges: [
    dedupExchange,
    retryExchange({
      // Retry configuration
      initialDelayMs: 1000,
      maxDelayMs: 15000,
      randomDelay: true,
      maxNumberAttempts: 3,
      retryIf: (error) => {
        // Retry on network errors or specific GraphQL errors
        return error.networkError || 
               error.graphQLErrors?.some(e => e.extensions?.code === 'RETRYABLE');
      },
    }),
    cacheExchange,
    fetchExchange,
  ],
});

// Query with error handling
function TodoList() {
  const [result, reexecute] = useQuery(GET_TODOS, {
    context: {
      // Additional context for error handling
      requestPolicy: 'cache-and-network',
    },
  });

  const { fetching, error, data, operation } = result;

  // Manual retry
  const handleRetry = () => {
    reexecute({ requestPolicy: 'network-only' });
  };

  // Error boundary handling
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        {error.networkError && (
          <p>Network error: {error.networkError.message}</p>
        )}
        {error.graphQLErrors && (
          <div>
            {error.graphQLErrors.map((gqlError, index) => (
              <p key={index}>
                GraphQL Error: {gqlError.message}
              </p>
            ))}
          </div>
        )}
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {fetching && <p>Loading...</p>}
      {data?.todos?.map(todo => (
        <div key={todo.id}>
          <h3>{todo.title}</h3>
          <p>Completed: {todo.completed ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 6: Authentication
function AuthenticationExample() {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simulate authentication
  const login = async (username, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === 'user' && password === 'pass') {
      const authToken = 'mock-jwt-token';
      setToken(authToken);
      setIsAuthenticated(true);
      setUserData({ id: '1', name: 'John Doe', email: 'john@example.com' });
    } else {
      alert('Invalid credentials');
    }
    setLoading(false);
  };
  
  const logout = () => {
    setToken('');
    setIsAuthenticated(false);
    setUserData(null);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    login(formData.get('username'), formData.get('password'));
  };
  
  return (
    <div className="urql-example">
      <h2>Authentication</h2>
      <p>Demonstrates authentication with URQL.</p>
      
      {!isAuthenticated ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <input name="username" type="text" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p>Hint: use "user" / "pass"</p>
        </form>
      ) : (
        <div className="user-profile">
          <h3>Welcome, {userData.name}!</h3>
          <p>Email: {userData.email}</p>
          <p>Token: {token.substring(0, 20)}...</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
      
      <pre>{`
// URQL Authentication:
import { createClient, useQuery, authExchange } from 'urql';
import { cacheExchange, fetchExchange } from 'urql';

const client = createClient({
  url: 'https://your-graphql-endpoint.com/graphql',
  exchanges: [
    authExchange(async ({ authState, mutate }) => {
      if (!authState) {
        // Get token from storage
        const token = localStorage.getItem('auth-token');
        
        if (token) {
          return { token };
        }
        
        return null;
      }

      // Handle token refresh
      if (authState?.refreshToken) {
        try {
          const result = await mutate(REFRESH_TOKEN_MUTATION, {
            refreshToken: authState.refreshToken,
          });
          
          const newToken = result.data?.refreshToken?.token;
          if (newToken) {
            localStorage.setItem('auth-token', newToken);
            return { token: newToken };
          }
        } catch (error) {
          // Handle refresh failure
          localStorage.removeItem('auth-token');
          return null;
        }
      }

      return null;
    }),
    cacheExchange,
    fetchExchange,
  ],
});

// Authenticated query
function UserProfile() {
  const [result] = useQuery(GET_PROFILE, {
    context: {
      // Include auth in request context
      auth: {
        token: localStorage.getItem('auth-token'),
      },
    },
  });

  const { fetching, error, data } = result;

  if (fetching) return <p>Loading profile...</p>;
  if (error) {
    if (error.graphQLErrors?.some(e => e.extensions?.code === 'UNAUTHORIZED')) {
      // Redirect to login
      return <Login />;
    }
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>Welcome, {data?.profile?.name}</h2>
      <p>Email: {data?.profile?.email}</p>
    </div>
  );
}

// Login mutation
const LOGIN_MUTATION = gql\`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
\`;

function Login() {
  const [loginResult, login] = useMutation(LOGIN_MUTATION);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    
    if (result.data?.login) {
      localStorage.setItem('auth-token', result.data.login.token);
      // Redirect or update state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        placeholder="Username"
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
      />
      <button type="submit" disabled={loginResult.fetching}>
        {loginResult.fetching ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
      `}</pre>
    </div>
  );
}

// Example 7: Pagination
function PaginationExample() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  
  // Simulate paginated fetch
  const fetchPosts = async (currentOffset = 0, append = false) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPosts = Array.from({ length: limit }, (_, i) => ({
      id: currentOffset + i + 1,
      title: `Post ${currentOffset + i + 1}`,
      content: `Content for post ${currentOffset + i + 1}`
    }));
    
    if (append) {
      setPosts(prev => [...prev, ...newPosts]);
    } else {
      setPosts(newPosts);
    }
    
    setHasMore(currentOffset + limit < 20); // Simulate 20 total posts
    setOffset(currentOffset + limit);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const loadMore = () => {
    fetchPosts(offset, true);
  };
  
  const refetch = () => {
    setPosts([]);
    setOffset(0);
    fetchPosts(0, false);
  };
  
  return (
    <div className="urql-example">
      <h2>Pagination</h2>
      <p>Demonstrates pagination strategies with URQL.</p>
      
      <button onClick={refetch}>Refetch</button>
      
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
      
      {!hasMore && posts.length > 0 && (
        <p>No more posts to load.</p>
      )}
      
      <pre>{`
// URQL Pagination:
import { gql, useQuery } from 'urql';

const GET_POSTS = gql\`
  query GetPosts($offset: Int, $limit: Int) {
    posts(offset: $offset, limit: $limit) {
      id
      title
      content
      createdAt
    }
  }
\`;

function PaginatedPosts() {
  const [result, fetchMore] = useQuery(GET_POSTS, {
    variables: {
      offset: 0,
      limit: 5
    },
  });

  const { data, fetching, error } = result;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        offset: data?.posts?.length || 0,
        limit: 5
      },
    });
  };

  if (fetching && !data) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.posts?.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
      
      <button 
        onClick={loadMorePosts}
        disabled={fetching}
      >
        {fetching ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}

// Cursor-based pagination
const GET_POSTS_CURSOR = gql\`
  query GetPostsCursor($cursor: String, $limit: Int) {
    posts(cursor: $cursor, limit: $limit) {
      edges {
        node {
          id
          title
          content
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
\`;

function CursorPaginatedPosts() {
  const [result, fetchMore] = useQuery(GET_POSTS_CURSOR, {
    variables: {
      limit: 5
    },
  });

  const { data, fetching } = result;

  const loadMore = () => {
    if (data?.posts?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          cursor: data.posts.pageInfo.endCursor,
          limit: 5
        },
      });
    }
  };

  return (
    <div>
      {data?.posts?.edges?.map(edge => (
        <div key={edge.node.id}>
          <h3>{edge.node.title}</h3>
          <p>{edge.node.content}</p>
        </div>
      ))}
      
      {data?.posts?.pageInfo?.hasNextPage && (
        <button onClick={loadMore} disabled={fetching}>
          {fetching ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 8: Optimistic UI
function OptimisticUIExample() {
  const [posts, setPosts] = useState([
    { id: '1', title: 'Post 1', likes: 5 },
    { id: '2', title: 'Post 2', likes: 3 }
  ]);
  const [loading, setLoading] = useState(false);
  
  // Simulate optimistic update
  const likePost = async (postId) => {
    setLoading(true);
    
    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, this would succeed and update would remain
    } catch (error) {
      // Rollback on error
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes - 1 }
          : post
      ));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="urql-example">
      <h2>Optimistic UI</h2>
      <p>Demonstrates optimistic updates for better user experience.</p>
      
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <div className="post-actions">
              <button 
                onClick={() => likePost(post.id)}
                disabled={loading}
              >
                ❤️ {post.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <pre>{`
// URQL Optimistic UI:
import { gql, useMutation } from 'urql';

const LIKE_POST = gql\`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes
    }
  }
\`;

function Post({ post }) {
  const [likePostResult, likePost] = useMutation(LIKE_POST, {
    optimisticResponse: ({ postId }) => ({
      likePost: {
        __typename: 'Post',
        id: postId,
        likes: post.likes + 1,
      },
    }),
    update: (cache, { data: { likePost } }) => {
      // Update cache with optimistic response
      cache.updateQuery(
        { query: GET_POSTS },
        (data) => {
          if (!data) return data;
          
          return {
            ...data,
            posts: data.posts.map(p => 
              p.id === likePost.id ? likePost : p
            ),
          };
        }
      );
    },
  });

  return (
    <div>
      <h3>{post.title}</h3>
      <button 
        onClick={() => likePost({ variables: { postId: post.id } })}
        disabled={likePostResult.fetching}
      >
        {likePostResult.fetching ? 'Liking...' : \`❤️ \${post.likes}\`}
      </button>
    </div>
  );
}

// Complex optimistic update with multiple fields
const CREATE_COMMENT = gql\`
  mutation CreateComment($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      id
      content
      author {
        id
        name
      }
      createdAt
    }
  }
\`;

function CommentForm({ postId }) {
  const [content, setContent] = useState('');
  const [createComment] = useMutation(CREATE_COMMENT, {
    optimisticResponse: ({ postId, content }) => ({
      createComment: {
        __typename: 'Comment',
        id: 'temp-id',
        content,
        author: {
          __typename: 'User',
          id: 'current-user-id',
          name: 'Current User',
        },
        createdAt: new Date().toISOString(),
      },
    }),
    update: (cache, { data: { createComment } }) => {
      cache.updateQuery(
        { query: GET_POST_COMMENTS, variables: { postId } },
        (data) => {
          if (!data) return data;
          
          return {
            ...data,
            comments: [...(data.comments || []), createComment],
          };
        }
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createComment({ variables: { postId, content } });
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit">Post Comment</button>
    </form>
  );
}
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function UrqlExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicSetupExample, title: "Basic Setup" },
    { component: MutationExample, title: "Mutations" },
    { component: CachingExample, title: "Caching" },
    { component: SubscriptionExample, title: "Subscriptions" },
    { component: ErrorHandlingExample, title: "Error Handling" },
    { component: AuthenticationExample, title: "Authentication" },
    { component: PaginationExample, title: "Pagination" },
    { component: OptimisticUIExample, title: "Optimistic UI" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="urql-examples">
      <h1>URQL Examples</h1>
      <p>Comprehensive examples demonstrating URQL features and patterns.</p>
      
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
        <h2>About URQL</h2>
        <p>
          URQL (Universal React Query Library) is a highly customizable and versatile GraphQL client for React, 
          Preact, Vue, Svelte, and other JavaScript frameworks. It focuses on performance, 
          extensibility, and providing a great developer experience.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Exchanges-based Architecture</strong>: Composable middleware for custom behavior</li>
          <li><strong>Normalized Caching</strong>: Efficient cache with Graphcache</li>
          <li><strong>Real-time Updates</strong>: Subscriptions for live data</li>
          <li><strong>Optimistic UI</strong>: Update UI before server confirmation</li>
          <li><strong>Error Handling</strong>: Comprehensive error management and retry logic</li>
          <li><strong>Authentication</strong>: Built-in auth exchange for token management</li>
          <li><strong>Pagination</strong>: Support for cursor and offset pagination</li>
          <li><strong>Framework Agnostic</strong>: Works with React, Vue, Svelte, and more</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`npm install urql graphql`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import { createClient, Provider, useQuery } from 'urql';
import { cacheExchange, fetchExchange } from 'urql';

// Create client
const client = createClient({
  url: 'https://your-graphql-endpoint.com/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

// Wrap app
<Provider value={client}>
  <App />
</Provider>

// Use in component
const GET_DATA = gql\`
  query GetData {
    items {
      id
      name
    }
  }
\`;

function MyComponent() {
  const [result] = useQuery(GET_DATA);
  const { fetching, error, data } = result;
  
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return data.items.map(item => <div key={item.id}>{item.name}</div>);
}`}</pre>
      </div>
    </div>
  );
}