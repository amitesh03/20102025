import React, { useState, useEffect } from 'react';

// Example 1: Basic Data Fetching
function BasicDataFetchingExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with SWR
      // In real app: const { data, error, isLoading } = useSWR('/api/user', fetcher);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      setData(response);
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
    <div className="swr-example">
      <h2>Basic Data Fetching</h2>
      <p>Demonstrates making a simple data request with SWR.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div className="user-profile">
          <h3>{data.name}</h3>
          <p>Email: {data.email}</p>
        </div>
      )}
      
      <pre>{`
// Basic data fetching with SWR
import useSWR from 'swr';

// Define a fetcher function
const fetcher = (...args) => fetch(...args).then(res => res.json());

function Profile() {
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/user', fetcher);

  if (error) return <div>Failed to load: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Hello {data.name}!</h1>
      <p>Email: {data.email}</p>
      <button onClick={() => mutate()}>Refresh</button>
      {isValidating && <span>Revalidating...</span>}
    </div>
  );
}

// With custom fetcher
const apiFetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }
  return response.json();
};

function UserProfile() {
  const { data, error } = useSWR('/api/user', apiFetcher);

  if (error) {
    return <div>Error: {error.info?.message || error.message}</div>;
  }

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>Email: {data.email}</p>
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 2: Global Configuration
function GlobalConfigurationExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with SWR global configuration
      // In real app: 
      // <SWRConfig
      //   value={{
      //     fetcher,
      //     refreshInterval: 3000,
      //     revalidateOnFocus: true,
      //     revalidateOnReconnect: true,
      //     dedupingInterval: 2000,
      //     errorRetryInterval: 5000,
      //     errorRetryCount: 5,
      //   }}
      // >
      //   <Profile />
      // </SWRConfig>
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      setData(response);
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
    <div className="swr-example">
      <h2>Global Configuration</h2>
      <p>Demonstrates configuring SWR globally with SWRConfig.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div className="user-profile">
          <h3>{data.name}</h3>
          <p>Email: {data.email}</p>
        </div>
      )}
      
      <pre>{`
// Global configuration with SWRConfig
import { SWRConfig } from 'swr';

const fetcher = url => fetch(url).then(res => res.json());

function App() {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 3000, // Auto refresh every 3 seconds
        revalidateOnFocus: true, // Revalidate when window gets focus
        revalidateOnReconnect: true, // Revalidate when network reconnects
        dedupingInterval: 2000, // Dedupe requests within 2 seconds
        errorRetryInterval: 5000, // Retry failed requests every 5 seconds
        errorRetryCount: 5, // Retry failed requests up to 5 times
        onError: (error, key) => {
          console.error('SWR Error:', key, error);
        },
        onSuccess: (data, key) => {
          console.log('SWR Success:', key);
        }
      }}
    >
      <Profile />
      <Dashboard />
    </SWRConfig>
  );
}

// Custom configuration for specific hooks
function Profile() {
  const { data } = useSWR('/api/user', null, {
    refreshInterval: 0, // Disable auto refresh
    revalidateOnFocus: false, // Disable revalidation on focus
  });

  return <div>{data?.name}</div>;
}

// Using different fetchers for different endpoints
const jsonFetcher = url => fetch(url).then(res => res.json());
const textFetcher = url => fetch(url).then(res => res.text());

function App() {
  return (
    <SWRConfig value={{ fetcher: jsonFetcher }}>
      <UserProfile />
      <TermsOfService />
    </SWRConfig>
  );
}

function TermsOfService() {
  // Override the global fetcher
  const { data } = useSWR('/api/terms', textFetcher);
  return <pre>{data}</pre>;
}
      `}</pre>
    </div>
  );
}

// Example 3: Mutation with Optimistic Updates
function MutationExample() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn SWR', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const addTodo = async (text) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with SWR mutation
      // In real app: 
      // const { trigger } = useSWRMutation('/api/todos', sendRequest);
      // await trigger({ text });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTodoItem = {
        id: Date.now(),
        text,
        completed: false
      };
      
      // Optimistic update
      setTodos(prev => [...prev, newTodoItem]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleTodo = async (id) => {
    try {
      // Simulate API call with SWR mutation
      // In real app:
      // const { trigger } = useSWRMutation('/api/todos', sendRequest);
      // await trigger({ id, completed: !completed });
      
      // Optimistic update
      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };
  
  return (
    <div className="swr-example">
      <h2>Mutation with Optimistic Updates</h2>
      <p>Demonstrates creating and updating data with SWR mutations.</p>
      
      <form onSubmit={handleSubmit} className="form-example">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !newTodo.trim()}>
          {loading ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
      
      {error && <p className="error">Error: {error}</p>}
      
      <div className="todo-list">
        {todos.map(todo => (
          <div key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'completed' : ''}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>
      
      <pre>{`
// Mutation with optimistic updates
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

const sendRequest = async (url, { arg }) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg)
  });
  
  if (!response.ok) throw new Error('Request failed');
  return response.json();
};

function TodoList() {
  const { data: todos, mutate } = useSWR('/api/todos', fetcher);
  
  const { trigger: addTodo } = useSWRMutation('/api/todos', sendRequest, {
    onSuccess: (newTodo) => {
      // Update the cache with the new todo
      mutate(currentTodos => [...currentTodos, newTodo], false);
    }
  });
  
  const { trigger: updateTodo } = useSWRMutation('/api/todos', sendRequest, {
    optimisticData: (currentTodos, { arg }) => {
      // Optimistically update the todo
      return currentTodos.map(todo => 
        todo.id === arg.id ? { ...todo, ...arg } : todo
      );
    },
    rollbackOnError: true,
    onSuccess: (updatedTodo) => {
      // Update the cache with the updated todo
      mutate(currentTodos => 
        currentTodos.map(todo => 
          todo.id === updatedTodo.id ? updatedTodo : todo
        ), false
      );
    }
  });
  
  const handleAddTodo = async (text) => {
    await addTodo({ text, completed: false });
  };
  
  const handleToggleTodo = async (id, completed) => {
    await updateTodo({ id, completed });
  };
  
  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleAddTodo(e.target.elements.text.value);
        e.target.reset();
      }}>
        <input name="text" placeholder="Add a new todo" />
        <button type="submit">Add</button>
      </form>
      
      <ul>
        {todos?.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id, !todo.completed)}
            />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Using mutate directly for optimistic updates
function TodoItem({ todo }) {
  const { mutate } = useSWR('/api/todos');
  
  const toggleCompleted = async () => {
    // Optimistically update the UI
    mutate(
      '/api/todos',
      currentTodos => 
        currentTodos.map(t => 
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        ),
      false // Don't revalidate
    );
    
    try {
      // Send the update to the server
      await fetch(\`/api/todos/\${todo.id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      });
      
      // Revalidate to ensure cache is in sync
      mutate('/api/todos');
    } catch (error) {
      // Rollback on error
      mutate('/api/todos');
    }
  };
  
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleCompleted}
      />
      <span>{todo.text}</span>
    </li>
  );
}
      `}</pre>
    </div>
  );
}

// Example 4: Infinite Loading
function InfiniteLoadingExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const fetchPage = async (pageNum) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with SWR infinite loading
      // In real app: 
      // const { data, error, size, setSize } = useSWRInfinite(
      //   getKey,
      //   fetcher,
      //   { revalidateFirstPage: false }
      // );
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPosts = Array.from({ length: 5 }, (_, i) => ({
        id: (pageNum - 1) * 5 + i + 1,
        title: `Post ${(pageNum - 1) * 5 + i + 1}`,
        content: `Content for post ${(pageNum - 1) * 5 + i + 1}`
      }));
      
      setData(prev => {
        if (!prev) return [newPosts];
        return [...prev, newPosts];
      });
      
      // Simulate no more pages after 3 pages
      if (pageNum >= 3) setHasMore(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPage(nextPage);
    }
  };
  
  useEffect(() => {
    fetchPage(1);
  }, []);
  
  return (
    <div className="swr-example">
      <h2>Infinite Loading</h2>
      <p>Demonstrates infinite scrolling with SWR's useSWRInfinite.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      {data && (
        <div className="posts-list">
          {data.map((page, pageIndex) => (
            <div key={pageIndex} className="page-section">
              <h3>Page {pageIndex + 1}</h3>
              {page.map(post => (
                <div key={post.id} className="post-card">
                  <h4>{post.title}</h4>
                  <p>{post.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
      
      <pre>{`
// Infinite loading with useSWRInfinite
import useSWRInfinite from 'swr/infinite';

const fetcher = url => fetch(url).then(res => res.json());

function IssueList({ repo }) {
  const PAGE_SIZE = 10;

  const getKey = (pageIndex, previousPageData) => {
    // Reached the end
    if (previousPageData && !previousPageData.length) return null;

    // First page, no previousPageData
    return \`https://api.github.com/repos/\${repo}/issues?per_page=\${PAGE_SIZE}&page=\${pageIndex + 1}\`;
  };

  const { data, error, size, setSize, isValidating, isLoading } = useSWRInfinite(
    getKey,
    fetcher,
    { revalidateFirstPage: false }
  );

  const issues = data ? [].concat(...data) : [];
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  return (
    <div>
      {issues.map(issue => (
        <div key={issue.id}>{issue.title}</div>
      ))}

      {error && <div>Error loading issues</div>}

      <button
        disabled={isLoadingMore || isReachingEnd}
        onClick={() => setSize(size + 1)}
      >
        {isLoadingMore ? 'Loading...' : isReachingEnd ? 'No more' : 'Load More'}
      </button>
    </div>
  );
}

// Auto-load on scroll
import { useInView } from 'react-intersection-observer';

function AutoInfiniteList() {
  const { ref, inView } = useInView();
  
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher);
  
  useEffect(() => {
    if (inView) {
      setSize(size + 1);
    }
  }, [inView, size, setSize]);
  
  return (
    <div>
      {data?.map((page, i) => (
        <div key={i}>
          {page.map(item => (
            <div key={item.id}>{item.title}</div>
          ))}
        </div>
      ))}
      
      <div ref={ref}>Loading more...</div>
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 5: Conditional Fetching
function ConditionalFetchingExample() {
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with SWR conditional fetching
      // In real app: 
      // const { data: user } = useSWR(userId ? \`/api/user/\${userId}\` : null, fetcher);
      // const { data: posts } = useSWR(user ? \`/api/posts?author=\${user.id}\` : null, fetcher);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`
      };
      
      const posts = Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1} by ${user.name}`,
        content: `Content for post ${i + 1} by ${user.name}`
      }));
      
      setData({ user, posts });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);
  
  return (
    <div className="swr-example">
      <h2>Conditional Fetching</h2>
      <p>Demonstrates conditional data fetching with SWR.</p>
      
      <div className="user-selector">
        <h3>Select a User:</h3>
        {[1, 2, 3].map(id => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            className={userId === id ? 'active' : ''}
          >
            User {id}
          </button>
        ))}
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      {data && (
        <div className="data-display">
          <div className="user-info">
            <h3>User Information:</h3>
            <p><strong>ID:</strong> {data.user.id}</p>
            <p><strong>Name:</strong> {data.user.name}</p>
            <p><strong>Email:</strong> {data.user.email}</p>
          </div>
          
          <div className="user-posts">
            <h3>User Posts:</h3>
            {data.posts.map(post => (
              <div key={post.id} className="post-card">
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <pre>{`
// Conditional fetching with SWR
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json());

function UserDashboard({ userId }) {
  // Fetch only if userId exists (conditional fetching)
  const { data: user } = useSWR(userId ? \`/api/user/\${userId}\` : null, fetcher);

  // Fetch posts only after user data is available (dependent query)
  const { data: posts } = useSWR(
    user ? \`/api/posts?author=\${user.id}\` : null,
    fetcher
  );

  // Fetch multiple dependent resources
  const { data: settings } = useSWR(
    user?.isAdmin ? '/api/admin/settings' : null,
    fetcher
  );

  if (!userId) return <div>No user selected</div>;
  if (!user) return <div>Loading user...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      {posts ? (
        <ul>
          {posts.map(post => <li key={post.id}>{post.title}</li>)}
        </ul>
      ) : (
        <div>Loading posts...</div>
      )}
      {user.isAdmin && settings && (
        <div>Admin Settings: {JSON.stringify(settings)}</div>
      )}
    </div>
  );
}

// Complex conditional logic
function UserProfile({ userId, showDetails }) {
  const { data: user } = useSWR(
    userId ? \`/api/user/\${userId}\` : null,
    fetcher,
    {
      revalidateOnFocus: showDetails,
      refreshInterval: showDetails ? 5000 : 0
    }
  );

  const { data: details } = useSWR(
    () => (user && showDetails ? \`/api/user/\${user.id}/details\` : null),
    fetcher
  );

  return (
    <div>
      {user && <h1>{user.name}</h1>}
      {details && <p>{details.bio}</p>}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 6: Error Handling and Retry
function ErrorHandlingExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with SWR error handling
      // In real app: 
      // const { data, error } = useSWR('/api/data', fetcher, {
      //   shouldRetryOnError: true,
      //   errorRetryCount: 3,
      //   errorRetryInterval: 5000,
      //   onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      //     if (error.status === 404) return;
      //     if (retryCount >= 5) return;
      //     setTimeout(() => revalidate({ retryCount }), 1000 * Math.pow(2, retryCount));
      //   }
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate error for demonstration
      if (retryCount < 2) {
        throw new Error('Failed to fetch data');
      }
      
      const response = {
        id: 1,
        title: 'Data loaded successfully',
        content: 'This is the content of the data'
      };
      
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const retry = () => {
    setRetryCount(prev => prev + 1);
    fetchData();
  };
  
  useEffect(() => {
    fetchData();
  }, [retryCount]);
  
  return (
    <div className="swr-example">
      <h2>Error Handling and Retry</h2>
      <p>Demonstrates error handling and retry logic with SWR.</p>
      
      {loading && <p>Loading...</p>}
      {error && (
        <div className="error-section">
          <p className="error">Error: {error}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}
      {data && (
        <div className="data-display">
          <h3>{data.title}</h3>
          <p>{data.content}</p>
        </div>
      )}
      
      <pre>{`
// Error handling and retry with SWR
import useSWR from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Request failed');
    error.status = res.status;
    error.info = await res.json();
    throw error;
  }
  return res.json();
};

function DataComponent() {
  const { data, error } = useSWR('/api/data', fetcher, {
    // Retry on error
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,

    // Custom retry logic
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Don't retry on 404
      if (error.status === 404) return;

      // Don't retry after 5 attempts
      if (retryCount >= 5) return;

      // Exponential backoff
      setTimeout(() => revalidate({ retryCount }), 1000 * Math.pow(2, retryCount));
    },

    onError: (error, key) => {
      console.error(\`Error fetching \${key}:\`, error);
      // Log to error tracking service
      if (error.status !== 404) {
        logErrorToService(error, key);
      }
    }
  });

  if (error) {
    if (error.status === 404) {
      return <div>Data not found</div>;
    }
    if (error.status === 403) {
      return <div>Access denied</div>;
    }
    return <div>Error: {error.message}</div>;
  }

  if (!data) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}

// Error boundary integration
function ErrorBoundary({ children }) {
  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          // Show toast notification
          showToast(\`Error fetching \${key}: \${error.message}\`);
        },
        errorRetryCount: 2,
        errorRetryInterval: 1000,
      }}
    >
      {children}
    </SWRConfig>
  );
}

// Custom error component
function ErrorMessage({ error, reset }) {
  return (
    <div className="error-message">
      <h3>Something went wrong</h3>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

function DataWithErrorBoundary() {
  const { data, error, mutate } = useSWR('/api/data', fetcher);

  if (error) {
    return <ErrorMessage error={error} reset={() => mutate()} />;
  }

  if (!data) return <div>Loading...</div>;

  return <div>{data.content}</div>;
}
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function SWRExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicDataFetchingExample, title: "Basic Data Fetching" },
    { component: GlobalConfigurationExample, title: "Global Configuration" },
    { component: MutationExample, title: "Mutation with Optimistic Updates" },
    { component: InfiniteLoadingExample, title: "Infinite Loading" },
    { component: ConditionalFetchingExample, title: "Conditional Fetching" },
    { component: ErrorHandlingExample, title: "Error Handling and Retry" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="swr-examples">
      <h1>SWR Examples</h1>
      <p>Comprehensive examples demonstrating SWR features and patterns.</p>
      
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
        <h2>About SWR</h2>
        <p>
          SWR is a React Hooks library for data fetching that implements the stale-while-revalidate 
          HTTP cache invalidation strategy. The name derives from this caching pattern where the library 
          first returns cached (stale) data, then sends a fetch request (revalidate), and finally updates 
          with fresh data.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Stale-While-Revalidate</strong>: Return cached data immediately, then revalidate</li>
          <li><strong>Automatic Caching</strong>: Built-in cache with intelligent revalidation</li>
          <li><strong>Request Deduplication</strong>: Prevent duplicate requests</li>
          <li><strong>Real-time Updates</strong>: Auto-revalidate on focus, reconnect, and interval</li>
          <li><strong>Optimistic UI</strong>: Update UI before server confirmation</li>
          <li><strong>Infinite Loading</strong>: Built-in support for pagination and infinite scroll</li>
          <li><strong>Error Handling</strong>: Robust error handling with retry logic</li>
          <li><strong>TypeScript Support</strong>: Full TypeScript support</li>
          <li><strong>Minimal API</strong>: Simple and intuitive API</li>
          <li><strong>Framework Agnostic</strong>: Works with any data fetching library</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`npm install swr`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import useSWR from 'swr';

// Define a fetcher function
const fetcher = (...args) => fetch(...args).then(res => res.json());

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div>Hello {data.name}!</div>;
}`}</pre>
      </div>
    </div>
  );
}