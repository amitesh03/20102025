import React, { useState, useEffect } from 'react';

// Note: These examples demonstrate Apollo Client concepts in a web-compatible format
// In a real app, you would install @apollo/client and use actual GraphQL endpoints

// Example 1: Basic Setup and Query
function BasicSetupExample() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // Simulate Apollo Client setup
  const mockClient = {
    query: async ({ query }) => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          data: {
            locations: [
              { id: '1', name: 'Space Center', description: 'Launch facility', photo: 'space.jpg' },
              { id: '2', name: 'Moon Base', description: 'Lunar habitat', photo: 'moon.jpg' }
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
      query: 'GET_LOCATIONS'
    });
    setData(result.data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <div className="apollo-example">
      <h2>Basic Setup and Query</h2>
      <p>Demonstrates Apollo Client initialization and basic querying.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div className="data-display">
          {data.locations.map(location => (
            <div key={location.id} className="location-card">
              <h3>{location.name}</h3>
              <p>{location.description}</p>
              <img src={location.photo} alt={location.name} />
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// Apollo Client Setup:
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://your-graphql-endpoint.com/graphql',
  cache: new InMemoryCache(),
});

// Wrap app with ApolloProvider
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// Define GraphQL query
const GET_LOCATIONS = gql\`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
\`;

// Use query in component
function DisplayLocations() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return data.locations.map(({ id, name, description, photo }) => (
    <div key={id}>
      <h3>{name}</h3>
      <img width="400" height="250" alt={name} src={photo} />
      <p>{description}</p>
    </div>
  ));
}
      `}</pre>
    </div>
  );
}

// Example 2: Mutations
function MutationExample() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [users, setUsers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com' }
  ]);
  const [loading, setLoading] = useState(false);
  
  // Simulate mutation
  const mockMutation = async (variables) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser = {
      id: String(Date.now()),
      ...variables
    };
    setUsers(prev => [...prev, newUser]);
    setLoading(false);
    return { data: { createUser: newUser } };
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await mockMutation(formData);
    setFormData({ name: '', email: '' });
  };
  
  return (
    <div className="apollo-example">
      <h2>Mutations</h2>
      <p>Demonstrates GraphQL mutations with Apollo Client.</p>
      
      <form onSubmit={handleSubmit} className="mutation-form">
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
// GraphQL Mutation:
import { gql, useMutation } from '@apollo/client';

const CREATE_USER = gql\`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
\`;

function UserForm() {
  const [createUser, { loading, error, data }] = useMutation(CREATE_USER);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({ variables: formData });
    setFormData({ name: '', email: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>User created: {data.createUser.name}</p>}
    </form>
  );
}
      `}</pre>
    </div>
  );
}

// Example 3: Caching and Cache Policies
function CachingExample() {
  const [cachePolicy, setCachePolicy] = useState('cache-first');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cacheHits, setCacheHits] = useState(0);
  
  // Simulate cache behavior
  const mockCache = new Map();
  
  const fetchData = async (policy) => {
    setLoading(true);
    const cacheKey = 'products';
    
    if (policy === 'cache-first' && mockCache.has(cacheKey)) {
      setData(mockCache.get(cacheKey));
      setCacheHits(prev => prev + 1);
      setLoading(false);
      return;
    }
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    const newData = {
      products: [
        { id: '1', name: 'Product 1', price: 10 },
        { id: '2', name: 'Product 2', price: 20 }
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
    <div className="apollo-example">
      <h2>Caching and Cache Policies</h2>
      <p>Demonstrates Apollo Client caching strategies.</p>
      
      <div className="cache-controls">
        <label>Cache Policy:</label>
        <select value={cachePolicy} onChange={(e) => setCachePolicy(e.target.value)}>
          <option value="cache-first">Cache First</option>
          <option value="network-only">Network Only</option>
          <option value="cache-only">Cache Only</option>
          <option value="no-cache">No Cache</option>
        </select>
        <button onClick={() => fetchData(cachePolicy)}>Refetch</button>
      </div>
      
      <div className="cache-stats">
        <p>Cache Hits: {cacheHits}</p>
      </div>
      
      {loading && <p>Loading...</p>}
      {data && (
        <div className="products-grid">
          {data.products.map(product => (
            <div key={product.id} className="product-card">
              <h4>{product.name}</h4>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// Cache Configuration:
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://your-graphql-endpoint.com/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
      Product: {
        keyFields: ['id'],
      },
    },
  }),
});

// Using different fetch policies:
function ProductList() {
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    fetchPolicy: 'cache-first', // or 'network-only', 'cache-only', 'no-cache'
    nextFetchPolicy: 'cache-first',
  });

  // Manual cache updates
  const updateCache = (cache, { data: { addProduct } }) => {
    cache.modify({
      fields: {
        products(existingProducts = []) {
          return [...existingProducts, addProduct];
        },
      },
    });
  };

  const [addProduct] = useMutation(ADD_PRODUCT, {
    update: updateCache,
  });

  return (
    // Component JSX
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
    <div className="apollo-example">
      <h2>Subscriptions</h2>
      <p>Demonstrates real-time GraphQL subscriptions.</p>
      
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
// GraphQL Subscriptions:
import { gql, useSubscription } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

// WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: 'ws://your-graphql-endpoint.com/graphql',
  options: {
    reconnect: true,
  },
});

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
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
  const { data, loading, error } = useSubscription(MESSAGE_SUBSCRIPTION);

  useEffect(() => {
    if (data) {
      console.log('New message:', data.messageAdded);
    }
  }, [data]);

  return (
    <div>
      {loading && <p>Connecting...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <strong>{data.messageAdded.user}:</strong> {data.messageAdded.text}
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
        posts: [
          { id: '1', title: 'Post 1', content: 'Content 1' },
          { id: '2', title: 'Post 2', content: 'Content 2' }
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
    <div className="apollo-example">
      <h2>Error Handling and Retry</h2>
      <p>Demonstrates error handling strategies in Apollo Client.</p>
      
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
        <div className="posts-list">
          {data.posts.map(post => (
            <div key={post.id} className="post-card">
              <h4>{post.title}</h4>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// Error Handling with Apollo Client:
import { gql, useQuery, onError } from '@apollo/client';
import { ApolloLink, from } from '@apollo/client';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        \`[GraphQL error]: Message: \${message}, Location: \${locations}, Path: \${path}\`,
      ),
    );
  }

  if (networkError) {
    console.error(\`[Network error]: \${networkError}\`);
    
    // Retry logic
    if (networkError.statusCode === 401) {
      // Handle authentication error
      return forward(operation);
    }
  }
});

// Retry link
const retryLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(result => {
    if (result.errors) {
      // Handle specific errors and retry
      const shouldRetry = result.errors.some(error => 
        error.extensions?.code === 'RETRYABLE'
      );
      
      if (shouldRetry) {
        // Implement retry logic
        return forward(operation);
      }
    }
    return result;
  });
});

// Query with error handling
function PostList() {
  const { data, loading, error, refetch } = useQuery(GET_POSTS, {
    errorPolicy: 'all', // Return both data and errors
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log('Query completed:', data);
    },
    onError: (error) => {
      console.error('Query error:', error);
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

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

// Example 6: Local State Management
function LocalStateExample() {
  const [theme, setTheme] = useState('light');
  const [localData, setLocalData] = useState({ counter: 0 });
  
  // Simulate local state operations
  const updateLocalState = (key, value) => {
    setLocalData(prev => ({ ...prev, [key]: value }));
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  return (
    <div className="apollo-example">
      <h2>Local State Management</h2>
      <p>Demonstrates managing local state with Apollo Client.</p>
      
      <div className="theme-controls">
        <p>Current Theme: {theme}</p>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
      
      <div className="local-state-demo">
        <p>Counter: {localData.counter}</p>
        <button onClick={() => updateLocalState('counter', localData.counter + 1)}>
          Increment
        </button>
        <button onClick={() => updateLocalState('counter', localData.counter - 1)}>
          Decrement
        </button>
      </div>
      
      <pre>{`
// Local State with Apollo Client:
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { makeVar, InMemoryCache } from '@apollo/client';

// Create reactive variables
export const themeVar = makeVar('light');
export const counterVar = makeVar(0);

// Configure cache with local fields
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        theme: {
          read() {
            return themeVar();
          },
        },
        counter: {
          read() {
            return counterVar();
          },
        },
      },
    },
  },
});

// Local state queries
const GET_THEME = gql\`
  query GetTheme {
    theme @client
  }
\`;

const GET_COUNTER = gql\`
  query GetCounter {
    counter @client
  }
\`;

// Using local state
function ThemeToggle() {
  const { data } = useQuery(GET_THEME);
  const theme = useReactiveVar(themeVar);
  
  const toggleTheme = () => {
    themeVar(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div>
      <p>Current theme: {data?.theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

function Counter() {
  const { data } = useQuery(GET_COUNTER);
  const counter = useReactiveVar(counterVar);
  
  const increment = () => {
    counterVar(counter + 1);
  };
  
  const decrement = () => {
    counterVar(counter - 1);
  };

  return (
    <div>
      <p>Count: {data?.counter}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// Local mutations
const UPDATE_LOCAL_STATE = gql\`
  mutation UpdateLocalState($theme: String, $counter: Int) {
    updateTheme(theme: $theme) @client
    updateCounter(counter: $counter) @client
  }
\`;

function LocalStateUpdater() {
  const [updateLocalState] = useMutation(UPDATE_LOCAL_STATE);
  
  const handleUpdate = () => {
    updateLocalState({
      variables: {
        theme: 'dark',
        counter: 10
      }
    });
  };

  return <button onClick={handleUpdate}>Update Local State</button>;
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
    <div className="apollo-example">
      <h2>Pagination</h2>
      <p>Demonstrates pagination strategies with Apollo Client.</p>
      
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
// Pagination with Apollo Client:
import { gql, useQuery, fetchMore } from '@apollo/client';

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
  const { data, loading, error, fetchMore } = useQuery(GET_POSTS, {
    variables: {
      offset: 0,
      limit: 5
    },
    notifyOnNetworkStatusChange: true,
  });

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        offset: data?.posts?.length || 0,
        limit: 5
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        
        return {
          posts: [...prev.posts, ...fetchMoreResult.posts]
        };
      },
    });
  };

  if (loading && !data) return <p>Loading...</p>;
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
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}

// Infinite scroll with fetchMore
function InfiniteScrollPosts() {
  const { data, loading, fetchMore } = useQuery(GET_POSTS, {
    variables: { offset: 0, limit: 10 },
  });

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 100
      ) {
        fetchMore({
          variables: {
            offset: data?.posts?.length || 0,
            limit: 10
          },
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, fetchMore]);

  return (
    <div>
      {data?.posts?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      {loading && <p>Loading more posts...</p>}
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
    <div className="apollo-example">
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
// Optimistic UI with Apollo Client:
import { gql, useMutation } from '@apollo/client';

const LIKE_POST = gql\`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes
    }
  }
\`;

function Post({ post }) {
  const [likePost, { loading }] = useMutation(LIKE_POST, {
    optimisticResponse: {
      likePost: {
        __typename: 'Post',
        id: post.id,
        likes: post.likes + 1,
      },
    },
    update: (cache, { data: { likePost } }) => {
      cache.modify({
        id: cache.identify({ __typename: 'Post', id: post.id }),
        fields: {
          likes(existingLikes = 0) {
            return likePost.likes;
          },
        },
      });
    },
    onError: (error) => {
      console.error('Failed to like post:', error);
      // Apollo automatically rolls back optimistic update
    },
  });

  return (
    <div>
      <h3>{post.title}</h3>
      <button 
        onClick={() => likePost({ variables: { postId: post.id } })}
        disabled={loading}
      >
        {loading ? 'Liking...' : \`❤️ \${post.likes}\`}
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
      cache.modify({
        id: cache.identify({ __typename: 'Post', id: postId }),
        fields: {
          comments(existingComments = []) {
            return [...existingComments, createComment];
          },
          commentCount(existingCount = 0) {
            return existingCount + 1;
          },
        },
      });
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
export default function ApolloClientExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicSetupExample, title: "Basic Setup" },
    { component: MutationExample, title: "Mutations" },
    { component: CachingExample, title: "Caching" },
    { component: SubscriptionExample, title: "Subscriptions" },
    { component: ErrorHandlingExample, title: "Error Handling" },
    { component: LocalStateExample, title: "Local State" },
    { component: PaginationExample, title: "Pagination" },
    { component: OptimisticUIExample, title: "Optimistic UI" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="apollo-client-examples">
      <h1>Apollo Client Examples</h1>
      <p>Comprehensive examples demonstrating Apollo Client features and patterns.</p>
      
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
        <h2>About Apollo Client</h2>
        <p>
          Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. 
          It provides powerful caching, declarative data fetching, and real-time updates through subscriptions.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Declarative Data Fetching</strong>: Use GraphQL queries to fetch data declaratively</li>
          <li><strong>Intelligent Caching</strong>: Automatic caching with configurable policies</li>
          <li><strong>Real-time Updates</strong>: Subscriptions for live data updates</li>
          <li><strong>Optimistic UI</strong>: Update UI before server confirmation</li>
          <li><strong>Error Handling</strong>: Comprehensive error management and retry logic</li>
          <li><strong>Local State</strong>: Manage local state alongside remote data</li>
          <li><strong>Pagination</strong>: Built-in support for paginated queries</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`npm install @apollo/client graphql`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ApolloProvider, useQuery } from '@apollo/client/react';

// Initialize client
const client = new ApolloClient({
  uri: 'https://your-graphql-endpoint.com/graphql',
  cache: new InMemoryCache(),
});

// Wrap app
<ApolloProvider client={client}>
  <App />
</ApolloProvider>

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
  const { loading, error, data } = useQuery(GET_DATA);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return data.items.map(item => <div key={item.id}>{item.name}</div>);
}`}</pre>
      </div>
    </div>
  );
}