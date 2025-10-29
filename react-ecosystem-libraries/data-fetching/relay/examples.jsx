import React, { useState, useEffect } from 'react';

// Example 1: Basic Query with useLazyLoadQuery
function BasicQueryExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(1);
  
  const fetchUser = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with Relay useLazyLoadQuery
      // In real app: 
      // const data = useLazyLoadQuery(
      //   graphql`
      //     query UserQuery($id: ID!) {
      //       user(id: $id) {
      //         id
      //         name
      //         email
      //       }
      //     }
      //   `,
      //   { id },
      //   { fetchPolicy: 'store-or-network' }
      // );
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = {
        user: {
          id,
          name: `User ${id}`,
          email: `user${id}@example.com`
        }
      };
      
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
  
  return (
    <div className="relay-example">
      <h2>Basic Query with useLazyLoadQuery</h2>
      <p>Demonstrates fetching data with Relay's useLazyLoadQuery hook.</p>
      
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
        <div className="user-profile">
          <h3>{data.user.name}</h3>
          <p>Email: {data.user.email}</p>
        </div>
      )}
      
      <pre>{`
// Basic query with Relay
import { graphql, useLazyLoadQuery } from 'react-relay';

// Define the GraphQL query
const UserQuery = graphql\`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
\`;

function UserProfile({ userId }) {
  // Fetch data using useLazyLoadQuery
  const data = useLazyLoadQuery(
    UserQuery,
    { id: userId },
    { fetchPolicy: 'store-or-network' }
  );

  return (
    <div>
      {data?.user ? (
        <>
          <h1>{data.user.name}</h1>
          <p>Email: {data.user.email}</p>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

// Using the component
function App() {
  const [userId, setUserId] = useState(1);
  
  return (
    <div>
      <div>
        {[1, 2, 3].map(id => (
          <button
            key={id}
            onClick={() => setUserId(id)}
          >
            User {id}
          </button>
        ))}
      </div>
      
      <UserProfile userId={userId} />
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 2: Mutation with useMutation
function MutationExample() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn Relay', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const addTodo = async (text) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with Relay useMutation
      // In real app:
      // const [commit, isInFlight] = useMutation(
      //   graphql\`
      //     mutation AddTodoMutation($input: AddTodoInput!) {
      //       addTodo(input: $input) {
      //         todo {
      //           id
      //           text
      //           completed
      //         }
      //       }
      //     }
      //   \`
      // );
      
      // const handleAddTodo = () => {
      //   commit({
      //     variables: {
      //       input: { text }
      //     },
      //     onCompleted: (response) => {
      //       setTodos(prev => [...prev, response.addTodo.todo]);
      //     },
      //     onError: (error) => {
      //       setError(error.message);
      //     }
      //   });
      // };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTodoItem = {
        id: Date.now(),
        text,
        completed: false
      };
      
      setTodos(prev => [...prev, newTodoItem]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleTodo = async (id) => {
    try {
      // Simulate API call with Relay useMutation
      // In real app:
      // const [commit, isInFlight] = useMutation(
      //   graphql\`
      //     mutation ToggleTodoMutation($input: ToggleTodoInput!) {
      //       toggleTodo(input: $input) {
      //         todo {
      //           id
      //           completed
      //         }
      //       }
      //     }
      //   \`
      // );
      
      // const handleToggleTodo = (id, completed) => {
      //   commit({
      //     variables: {
      //       input: { id, completed: !completed }
      //     },
      //     onCompleted: (response) => {
      //       setTodos(prev => 
      //         prev.map(todo => 
      //           todo.id === id ? response.toggleTodo.todo : todo
      //         )
      //       );
      //     }
      //   });
      // };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
    <div className="relay-example">
      <h2>Mutation with useMutation</h2>
      <p>Demonstrates creating and updating data with Relay's useMutation hook.</p>
      
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
// Mutation with Relay
import { graphql, useMutation } from 'react-relay';

// Define the GraphQL mutation
const AddTodoMutation = graphql\`
  mutation AddTodoMutation($input: AddTodoInput!) {
    addTodo(input: $input) {
      todo {
        id
        text
        completed
      }
    }
  }
\`;

const ToggleTodoMutation = graphql\`
  mutation ToggleTodoMutation($input: ToggleTodoInput!) {
    toggleTodo(input: $input) {
      todo {
        id
        completed
      }
    }
  }
\`;

function TodoList() {
  const [todos, setTodos] = useState([]);
  
  // Set up the add todo mutation
  const [commitAddTodo, isAddTodoInFlight] = useMutation(AddTodoMutation);
  
  // Set up the toggle todo mutation
  const [commitToggleTodo, isToggleTodoInFlight] = useMutation(ToggleTodoMutation);
  
  const handleAddTodo = (text) => {
    commitAddTodo({
      variables: {
        input: { text }
      },
      onCompleted: (response) => {
        setTodos(prev => [...prev, response.addTodo.todo]);
      },
      onError: (error) => {
        console.error('Error adding todo:', error);
      }
    });
  };
  
  const handleToggleTodo = (id, completed) => {
    commitToggleTodo({
      variables: {
        input: { id, completed: !completed }
      },
      onCompleted: (response) => {
        setTodos(prev => 
          prev.map(todo => 
            todo.id === id ? response.toggleTodo.todo : todo
          )
        );
      }
    });
  };
  
  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const text = e.target.elements.text.value;
        if (text.trim()) {
          handleAddTodo(text);
          e.target.reset();
        }
      }}>
        <input name="text" placeholder="Add a new todo" />
        <button type="submit" disabled={isAddTodoInFlight}>
          {isAddTodoInFlight ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id, todo.completed)}
              disabled={isToggleTodoInFlight}
            />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 3: Preloaded Query with usePreloadedQuery
function PreloadedQueryExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(1);
  
  const preloadUser = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with Relay usePreloadedQuery
      // In real app:
      // const queryRef = loadQuery(
      //   environment,
      //   UserQuery,
      //   { id }
      // );
      
      // const data = usePreloadedQuery(UserQuery, queryRef);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = {
        user: {
          id,
          name: `User ${id}`,
          email: `user${id}@example.com`,
          posts: Array.from({ length: 3 }, (_, i) => ({
            id: i + 1,
            title: `Post ${i + 1} by User ${id}`,
            content: `Content for post ${i + 1} by User ${id}`
          }))
        }
      };
      
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    preloadUser(userId);
  }, [userId]);
  
  return (
    <div className="relay-example">
      <h2>Preloaded Query with usePreloadedQuery</h2>
      <p>Demonstrates preloading data with Relay's usePreloadedQuery hook.</p>
      
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
        <div className="user-profile">
          <h3>{data.user.name}</h3>
          <p>Email: {data.user.email}</p>
          
          <div className="user-posts">
            <h4>Posts:</h4>
            {data.user.posts.map(post => (
              <div key={post.id} className="post-card">
                <h5>{post.title}</h5>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <pre>{`
// Preloaded query with Relay
import { graphql, usePreloadedQuery, loadQuery } from 'react-relay';

// Define the GraphQL query
const UserWithPostsQuery = graphql\`
  query UserWithPostsQuery($id: ID!) {
    user(id: $id) {
      id
      name
      email
      posts {
        id
        title
        content
      }
    }
  }
\`;

// Preload the query
function preloadUserData(environment, userId) {
  return loadQuery(
    environment,
    UserWithPostsQuery,
    { id: userId }
  );
}

// Use the preloaded query
function UserProfile({ queryRef }) {
  const data = usePreloadedQuery(UserWithPostsQuery, queryRef);
  
  return (
    <div>
      <h1>{data.user.name}</h1>
      <p>Email: {data.user.email}</p>
      
      <h2>Posts</h2>
      {data.user.posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

// Using in a router or navigation
function App() {
  const [userId, setUserId] = useState(1);
  const [queryRef, setQueryRef] = useState(null);
  const environment = useRelayEnvironment();
  
  // Preload data when userId changes
  useEffect(() => {
    const ref = preloadUserData(environment, userId);
    setQueryRef(ref);
  }, [userId, environment]);
  
  return (
    <div>
      <div>
        {[1, 2, 3].map(id => (
          <button
            key={id}
            onClick={() => setUserId(id)}
          >
            User {id}
          </button>
        ))}
      </div>
      
      {queryRef && <UserProfile queryRef={queryRef} />}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 4: Fragment for Reusable Fields
function FragmentExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with Relay fragments
      // In real app:
      // const UserAvatarFragment = graphql\`
      //   fragment UserAvatarFragment on User {
      //     id
      //     name
      //     avatarUrl
      //   }
      // \`;
      
      // const UserQuery = graphql\`
      //   query UserQuery($id: ID!) {
      //     user(id: $id) {
      //       ...UserAvatarFragment
      //       email
      //     }
      //   }
      // \`;
      
      // const data = useLazyLoadQuery(UserQuery, { id });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = {
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          avatarUrl: 'https://picsum.photos/seed/johndoe/100/100.jpg'
        }
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
    <div className="relay-example">
      <h2>Fragment for Reusable Fields</h2>
      <p>Demonstrates using Relay fragments for reusable field selections.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div className="user-profile">
          <div className="user-avatar">
            <img src={data.user.avatarUrl} alt={data.user.name} />
          </div>
          <div className="user-info">
            <h3>{data.user.name}</h3>
            <p>Email: {data.user.email}</p>
          </div>
        </div>
      )}
      
      <pre>{`
// Fragments with Relay
import { graphql } from 'react-relay';

// Define a fragment for reusable user fields
const UserAvatarFragment = graphql\`
  fragment UserAvatarFragment on User {
    id
    name
    avatarUrl
  }
\`;

// Define a fragment for user details
const UserDetailsFragment = graphql\`
  fragment UserDetailsFragment on User {
    id
    name
    email
    bio
  }
\`;

// Use fragments in queries
const UserQuery = graphql\`
  query UserQuery($id: ID!) {
    user(id: $id) {
      ...UserAvatarFragment
      ...UserDetailsFragment
    }
  }
\`;

// Use fragments in mutations
const UpdateUserMutation = graphql\`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        ...UserAvatarFragment
        ...UserDetailsFragment
      }
    }
  }
\`;

function UserProfile({ userId }) {
  const data = useLazyLoadQuery(UserQuery, { id: userId });
  
  return (
    <div>
      {data?.user && (
        <>
          <img src={data.user.avatarUrl} alt={data.user.name} />
          <h1>{data.user.name}</h1>
          <p>{data.user.email}</p>
          <p>{data.user.bio}</p>
        </>
      )}
    </div>
  );
}

// Using fragments in different components
function UserAvatar({ user }) {
  return (
    <div className="avatar">
      <img src={user.avatarUrl} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
}

function UserCard({ userId }) {
  const data = useLazyLoadQuery(UserQuery, { id: userId });
  
  return (
    <div className="card">
      {data?.user && <UserAvatar user={data.user} />}
      {data?.user && <p>{data.user.email}</p>}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 5: Refetching with useRefetchable
function RefetchableExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(1);
  const [refetchCount, setRefetchCount] = useState(0);
  
  const fetchData = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with Relay refetchable
      // In real app:
      // const { data, refetch } = useRefetchable(
      //   graphql\`
      //     query UserQuery($id: ID!) {
      //       user(id: $id) {
      //         id
      //         name
      //         email
      //         lastSeen
      //       }
      //     }
      //   \`,
      //   { id }
      // );
      
      // const handleRefetch = () => {
      //   refetch({ id });
      // };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = {
        user: {
          id,
          name: `User ${id}`,
          email: `user${id}@example.com`,
          lastSeen: new Date().toISOString()
        }
      };
      
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const refetch = () => {
    setRefetchCount(prev => prev + 1);
    fetchData(userId);
  };
  
  useEffect(() => {
    fetchData(userId);
  }, [userId]);
  
  return (
    <div className="relay-example">
      <h2>Refetching with useRefetchable</h2>
      <p>Demonstrates refetching data with Relay's useRefetchable hook.</p>
      
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
      
      <button onClick={refetch} disabled={loading}>
        {loading ? 'Refetching...' : 'Refetch Data'}
      </button>
      
      <p>Refetch count: {refetchCount}</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div className="user-profile">
          <h3>{data.user.name}</h3>
          <p>Email: {data.user.email}</p>
          <p>Last seen: {new Date(data.user.lastSeen).toLocaleString()}</p>
        </div>
      )}
      
      <pre>{`
// Refetching with Relay
import { graphql, useRefetchable } from 'react-relay';

// Define a refetchable query
const UserQuery = graphql\`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      name
      email
      lastSeen
    }
  }
\`;

function UserProfile({ userId }) {
  const { data, refetch } = useRefetchable(
    UserQuery,
    { id: userId }
  );
  
  const handleRefresh = () => {
    refetch({ id: userId });
  };
  
  return (
    <div>
      {data?.user && (
        <>
          <h1>{data.user.name}</h1>
          <p>Email: {data.user.email}</p>
          <p>Last seen: {new Date(data.user.lastSeen).toLocaleString()}</p>
          <button onClick={handleRefresh}>
            Refresh
          </button>
        </>
      )}
    </div>
  );
}

// Refetching with new variables
function SearchResults({ initialQuery }) {
  const [query, setQuery] = useState(initialQuery);
  
  const { data, refetch } = useRefetchable(
    SearchQuery,
    { query }
  );
  
  const handleSearch = (e) => {
    e.preventDefault();
    const newQuery = e.target.elements.search.value;
    setQuery(newQuery);
    refetch({ query: newQuery });
  };
  
  return (
    <div>
      <form onSubmit={handleSearch}>
        <input name="search" defaultValue={query} />
        <button type="submit">Search</button>
      </form>
      
      <ul>
        {data?.search.results.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 6: Pagination with useRefetchable
function PaginationExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchPage = async (pageNum) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with Relay pagination
      // In real app:
      // const { data, refetch, loadNext, hasNext } = useRefetchable(
      //   graphql\`
      //     query PostsQuery($count: Int!, $cursor: String) {
      //       posts(first: $count, after: $cursor) {
      //         edges {
      //           node {
      //             id
      //             title
      //             content
      //           }
      //           cursor
      //         }
      //         pageInfo {
      //           hasNextPage
      //           endCursor
      //         }
      //       }
      //     }
      //   \`,
      //   { count: 10, cursor: null }
      // );
      
      // const handleLoadMore = () => {
      //   if (hasNext) {
      //     loadNext(10);
      //   }
      // };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPosts = Array.from({ length: 5 }, (_, i) => ({
        id: (pageNum - 1) * 5 + i + 1,
        title: `Post ${(pageNum - 1) * 5 + i + 1}`,
        content: `Content for post ${(pageNum - 1) * 5 + i + 1}`
      }));
      
      setData(prev => {
        if (pageNum === 1) return { posts: newPosts };
        return { posts: [...(prev?.posts || []), ...newPosts] };
      });
      
      // Simulate no more pages after 3 pages
      if (pageNum >= 3) setHasMore(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const nextPage = () => {
    if (hasMore && !loading) {
      const nextPageNum = page + 1;
      setPage(nextPageNum);
      fetchPage(nextPageNum);
    }
  };
  
  useEffect(() => {
    fetchPage(1);
  }, []);
  
  return (
    <div className="relay-example">
      <h2>Pagination with useRefetchable</h2>
      <p>Demonstrates pagination with Relay's useRefetchable hook.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      {data && (
        <div className="posts-list">
          {data.posts.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="pagination-controls">
        <p>Page: {page}</p>
        <button onClick={nextPage} disabled={!hasMore || loading}>
          {loading ? 'Loading...' : hasMore ? 'Load More' : 'No More Posts'}
        </button>
      </div>
      
      <pre>{`
// Pagination with Relay
import { graphql, useRefetchable } from 'react-relay';

// Define a paginated query
const PostsQuery = graphql\`
  query PostsQuery($count: Int!, $cursor: String) {
    posts(first: $count, after: $cursor) {
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

function PostList() {
  const { data, refetch, loadNext, hasNext } = useRefetchable(
    PostsQuery,
    { count: 10, cursor: null }
  );
  
  const posts = data?.posts.edges.map(edge => edge.node) || [];
  
  const handleLoadMore = () => {
    if (hasNext) {
      loadNext(10);
    }
  };
  
  return (
    <div>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
      
      {hasNext && (
        <button onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
}

// Advanced pagination with variables
function AdvancedPagination() {
  const [pageSize, setPageSize] = useState(10);
  
  const { data, refetch } = useRefetchable(
    PostsQuery,
    { count: pageSize, cursor: null }
  );
  
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    refetch({ count: newSize, cursor: null });
  };
  
  return (
    <div>
      <div>
        <label>Posts per page:</label>
        <select 
          value={pageSize} 
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      
      <PostList />
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function RelayExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicQueryExample, title: "Basic Query with useLazyLoadQuery" },
    { component: MutationExample, title: "Mutation with useMutation" },
    { component: PreloadedQueryExample, title: "Preloaded Query with usePreloadedQuery" },
    { component: FragmentExample, title: "Fragment for Reusable Fields" },
    { component: RefetchableExample, title: "Refetching with useRefetchable" },
    { component: PaginationExample, title: "Pagination with useRefetchable" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="relay-examples">
      <h1>Relay Examples</h1>
      <p>Comprehensive examples demonstrating Relay features and patterns.</p>
      
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
        <h2>About Relay</h2>
        <p>
          Relay is a JavaScript framework for building data-driven React applications. 
          It provides a declarative way to fetch and manage GraphQL data with features 
          like automatic caching, optimistic updates, and refetching.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Declarative Data Fetching</strong>: Use GraphQL queries to declare data requirements</li>
          <li><strong>Automatic Caching</strong>: Built-in cache with intelligent invalidation</li>
          <li><strong>Optimistic Updates</strong>: Update UI before server confirmation</li>
          <li><strong>Refetching</strong>: Refresh data with new variables</li>
          <li><strong>Pagination</strong>: Built-in support for paginated data</li>
          <li><strong>Fragments</strong>: Reusable field selections across components</li>
          <li><strong>Preloading</strong>: Load data before rendering components</li>
          <li><strong>Type Safety</strong>: Full TypeScript support</li>
          <li><strong>Performance</strong>: Efficient data fetching and rendering</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`# Install Relay packages
npm install --save relay-runtime react-relay
npm install --save-dev relay-compiler babel-plugin-relay

# For TypeScript users
npm install --save-dev @types/relay-runtime @types/react-relay`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`// Configure Relay
import { RelayEnvironmentProvider } from 'react-relay';
import { Environment } from 'relay-runtime';

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(Source),
});

function App() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <YourComponents />
    </RelayEnvironmentProvider>
  );
}

// Define and use queries
import { graphql, useLazyLoadQuery } from 'react-relay';

const UserQuery = graphql\`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
\`;

function UserProfile({ userId }) {
  const data = useLazyLoadQuery(UserQuery, { id: userId });
  
  return (
    <div>
      {data?.user && (
        <>
          <h1>{data.user.name}</h1>
          <p>{data.user.email}</p>
        </>
      )}
    </div>
  );
}`}</pre>
      </div>
    </div>
  );
}