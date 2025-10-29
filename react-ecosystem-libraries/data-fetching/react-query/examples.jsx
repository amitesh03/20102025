import React, { useState, useEffect } from 'react';

// Example 1: Basic Query
function BasicQueryExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with React Query
      // In real app: const { data, error, isLoading } = useQuery({
      //   queryKey: ['posts'],
      //   queryFn: async () => {
      //     const response = await fetch('/api/posts');
      //     return response.json();
      //   }
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = {
        data: [
          { id: 1, title: 'First Post', content: 'Content of first post' },
          { id: 2, title: 'Second Post', content: 'Content of second post' }
        ]
      };
      
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
    <div className="react-query-example">
      <h2>Basic Query</h2>
      <p>Demonstrates making a simple query with React Query.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div className="data-display">
          {data.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// Basic query with React Query
import { useQuery } from '@tanstack/react-query';

function PostsList() {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(post => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  );
}

// Query with parameters
function PostDetail({ postId }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await fetch(\`/api/posts/\${postId}\`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    },
    enabled: !!postId, // Only run when postId is provided
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  if (isLoading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!postId) return <div>Select a post</div>;

  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    </article>
  );
}
      `}</pre>
    </div>
  );
}

// Example 2: Mutation with Optimistic Updates
function MutationExample() {
  const [posts, setPosts] = useState([
    { id: 1, title: 'First Post', content: 'Content of first post' }
  ]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const addPost = async (title) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with React Query mutation
      // In real app: const addPostMutation = useMutation({
      //   mutationFn: async (newPost) => {
      //     const response = await fetch('/api/posts', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(newPost)
      //     });
      //     if (!response.ok) throw new Error('Failed to create post');
      //     return response.json();
      //   },
      //   onMutate: (data) => {
      //     // Optimistic update
      //     setPosts(prev => [...prev, { ...newPost, id: Date.now() }]);
      //   },
      //   onError: (error) => {
      //     setError(error.message);
      //   },
      //   onSettled: () => {
      //     setLoading(false);
      //   }
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost = {
        id: Date.now(),
        title,
        content: `Content for ${title}`
      };
      
      // Optimistic update
      setPosts(prev => [...prev, newPost]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPostTitle.trim()) {
      addPost(newPostTitle);
      setNewPostTitle('');
    }
  };
  
  return (
    <div className="react-query-example">
      <h2>Mutation with Optimistic Updates</h2>
      <p>Demonstrates creating data with React Query and optimistic UI updates.</p>
      
      <form onSubmit={handleSubmit} className="form-example">
        <input
          type="text"
          placeholder="New post title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !newPostTitle.trim()}>
          {loading ? 'Adding...' : 'Add Post'}
        </button>
      </form>
      
      {error && <p className="error">Error: {error}</p>}
      
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
// Mutation with optimistic updates
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreatePostForm() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (newPost) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onMutate: (newPost) => {
      // Optimistic update
      queryClient.setQueryData(['posts'], (old) => [
        ...(old || []),
        { ...newPost, id: Date.now() }
      ]);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      createPostMutation.mutate({ title, content: '' });
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <button type="submit" disabled={createPostMutation.isPending}>
        {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {createPostMutation.isError && (
        <div>Error: {createPostMutation.error.message}</div>
      )}
    </form>
  );
}

// Using the mutation in a component
function PostList() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading posts...</div>;

  return (
    <ul>
      {data?.map(post => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  );
}
      `}</pre>
    </div>
  );
}

// Example 3: Infinite Query
function InfiniteQueryExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchPosts = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with React Query infinite query
      // In real app: const { data, error, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
      //   queryKey: ['posts'],
      //   queryFn: async ({ pageParam = 1 }) => {
      //     const response = await fetch(\`/api/posts?page=\${pageParam}\`);
      //     if (!response.ok) throw new Error('Failed to fetch posts');
      //     return {
      //       data: response.json(),
      //       nextPage: pageParam + 1,
      //     };
      //   },
      //   initialPageParam: 1,
      //   getNextPageParam: (lastPage) => lastPage.nextPage,
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPosts = Array.from({ length: 5 }, (_, i) => ({
        id: (page - 1) * 5 + i + 1,
        title: `Post ${(page - 1) * 5 + i + 1}`,
        content: `Content for post ${(page - 1) * 5 + i + 1}`
      }));
      
      setData(prev => {
        if (!prev) return { pages: [newPosts], pageParams: [page] };
        
        const updatedPages = [...prev.pages, newPosts];
        const updatedPageParams = [...prev.pageParams, page];
        
        return {
          pages: updatedPages,
          pageParams: updatedPageParams
        };
      });
      
      // Simulate no more pages after 3 pages
      if (page >= 3) setHasMore(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const loadMore = () => {
    if (data && hasMore) {
      const nextPage = data.pageParams.length + 1;
      fetchPosts(nextPage);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  return (
    <div className="react-query-example">
      <h2>Infinite Query</h2>
      <p>Demonstrates infinite scrolling with React Query.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      {data && (
        <div className="posts-list">
          {data.pages.map((page, pageIndex) => (
            <div key={pageIndex} className="page-section">
              <h3>Page {data.pageParams[pageIndex]}</h3>
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
// Infinite query with React Query
import { useInfiniteQuery } from '@tanstack/react-query';

function InfinitePostsList() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(\`/api/posts?page=\${pageParam}\`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      return {
        data: response.json(),
        nextPage: pageParam + 1,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          <h3>Page {i + 1}</h3>
          <ul>
            {page.map(post => (
              <li key={post.id}>
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <button
        onClick={fetchNextPage}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading more...' : 'Load More'}
      </button>
    </div>
  );
}

// Auto-fetch on scroll
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

function AutoInfinitePosts() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(\`/api/posts?page=\${pageParam}\`);
      return {
        data: response.json(),
        nextPage: pageParam + 1,
      };
    },
  });

  const { ref, inView } = useInView({
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          <h3>Page {i + 1}</h3>
          <ul>
            {page.map(post => (
              <li key={post.id}>
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <div ref={ref}>Load more when visible</div>
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 4: Dependent Queries
function DependentQueriesExample() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    if (!selectedUserId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with React Query dependent queries
      // In real app: const { data: user } = useQuery({
      //   queryKey: ['user', selectedUserId],
      //   queryFn: async () => {
      //     const response = await fetch(\`/api/users/\${selectedUserId}\`);
      //     if (!response.ok) throw new Error('Failed to fetch user');
      //     return response.json();
      //   },
      //   enabled: !!selectedUserId, // Only run when userId is provided
      // });
      
      // const { data: posts } = useQuery({
      //   queryKey: ['posts', selectedUserId],
      //   queryFn: async () => {
      //     const response = await fetch(\`/api/users/\${selectedUserId}/posts\`);
      //     if (!response.ok) throw new Error('Failed to fetch user posts');
      //     return response.json();
      //   },
      //   enabled: !!selectedUserId, // Only run when userId is provided
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: selectedUserId,
        name: `User ${selectedUserId}`,
        email: `user${selectedUserId}@example.com`
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
  
  return (
    <div className="react-query-example">
      <h2>Dependent Queries</h2>
      <p>Demonstrates dependent queries with React Query.</p>
      
      <div className="user-selector">
        <h3>Select a User:</h3>
        {[1, 2, 3].map(userId => (
          <button
            key={userId}
            onClick={() => setSelectedUserId(userId)}
            className={selectedUserId === userId ? 'active' : ''}
          >
            User {userId}
          </button>
        ))}
      </div>
      
      <button onClick={fetchData} disabled={!selectedUserId || loading}>
        {loading ? 'Loading...' : 'Fetch User Data'}
      </button>
      
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
// Dependent queries with React Query
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  // This query will only run when userId is provided
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(\`/api/users/\${userId}\`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    enabled: !!userId,
  });

  // This query depends on the user query and will only run when user data is available
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', userId],
    queryFn: async () => {
      const response = await fetch(\`/api/users/\${userId}/posts\`);
      if (!response.ok) throw new Error('Failed to fetch user posts');
      return response.json();
    },
    enabled: !!userId && !!user, // Only run when userId and user data are available
  });

  if (userLoading || postsLoading) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
      
      <h3>Posts:</h3>
      <ul>
        {posts?.map(post => (
          <li key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Using in a parent component
function UserSelector() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <div>
      <h2>Select a User:</h2>
      {[1, 2, 3].map(userId => (
        <button
          key={userId}
          onClick={() => setSelectedUserId(userId)}
        >
          User {userId}
        </button>
      ))}
      
      {selectedUserId && <UserProfile userId={selectedUserId} />}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 5: Query Client Methods
function QueryClientMethodsExample() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // In a real app, this would be provided by QueryClientProvider
  // const queryClient = useQueryClient();
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setMessage('');
    
    try {
      // Simulate API call with React Query client methods
      // In real app: 
      // // Prefetch data
      // await queryClient.prefetchQuery({
      //   queryKey: ['posts'],
      //   queryFn: async () => {
      //     const response = await fetch('/api/posts');
      //     return response.json();
      //   },
      //   staleTime: 1000 * 60 * 5, // 5 minutes
      // });
      
      // // Get cached data
      // const cachedData = queryClient.getQueryData(['posts']);
      
      // // Set query data manually
      // queryClient.setQueryData(['posts'], newData);
      
      // // Invalidate queries
      // await queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // // Cancel queries
      // queryClient.cancelQueries({ queryKey: ['posts'] });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = {
        data: [
          { id: 1, title: 'First Post', content: 'Content of first post' },
          { id: 2, title: 'Second Post', content: 'Content of second post' }
        ]
      };
      
      setData(response.data);
      setMessage('Data fetched successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="react-query-example">
      <h2>Query Client Methods</h2>
      <p>Demonstrates programmatic cache management with React Query.</p>
      
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {message && <p className="success">{message}</p>}
      
      {data && (
        <div className="data-display">
          {data.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// Query client methods
import { useQueryClient } from '@tanstack/react-query';

function CacheControls() {
  const queryClient = useQueryClient();

  // Prefetch data
  const prefetchPosts = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['posts'],
      queryFn: async () => {
        const response = await fetch('/api/posts');
        return response.json();
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Get cached data without fetching
  const getCachedPosts = () => {
    return queryClient.getQueryData(['posts']);
  };

  // Set query data manually
  const updatePost = (postId, updates) => {
    queryClient.setQueryData(['posts'], (old) => {
      if (!old) return old;
      return old.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      );
    });
  };

  // Invalidate queries to trigger refetch
  const refreshPosts = async () => {
    await queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  // Cancel ongoing queries
  const cancelPostsQuery = () => {
    queryClient.cancelQueries({ queryKey: ['posts'] });
  };

  // Remove queries from cache
  const clearPostsCache = () => {
    queryClient.removeQueries({ queryKey: ['posts'] });
  };

  // Reset queries (clear cache and refetch)
  const resetPosts = async () => {
    await queryClient.resetQueries({ queryKey: ['posts'] });
  };

  return (
    <div>
      <button onClick={prefetchPosts}>Prefetch Posts</button>
      <button onClick={getCachedPosts}>Get Cached Posts</button>
      <button onClick={() => updatePost(1, { title: 'Updated Title' })}>
        Update Post 1
      </button>
      <button onClick={refreshPosts}>Refresh Posts</button>
      <button onClick={cancelPostsQuery}>Cancel Posts Query</button>
      <button onClick={clearPostsCache}>Clear Posts Cache</button>
      <button onClick={resetPosts}>Reset Posts</button>
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 6: Pagination
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
      // Simulate API call with React Query pagination
      // In real app: const { data, error, isLoading } = useQuery({
      //   queryKey: ['posts', pageNum],
      //   queryFn: async () => {
      //     const response = await fetch(\`/api/posts?page=\${pageNum}&limit=5\`);
      //     if (!response.ok) throw new Error('Failed to fetch posts');
      //     return response.json();
      //   },
      //   keepPreviousData: true, // Keep previous data while fetching new page
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPosts = Array.from({ length: 5 }, (_, i) => ({
        id: (pageNum - 1) * 5 + i + 1,
        title: `Post ${(pageNum - 1) * 5 + i + 1}`,
        content: `Content for post ${(pageNum - 1) * 5 + i + 1}`
      }));
      
      setData(prev => {
        if (!prev) return { pages: [newPosts], pageParams: [pageNum] };
        
        const updatedPages = pageNum === 1 ? [newPosts] : [...(prev.pages || []), newPosts];
        const updatedPageParams = pageNum === 1 ? [pageNum] : [...(prev.pageParams || []), pageNum];
        
        return {
          pages: updatedPages,
          pageParams: updatedPageParams
        };
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
      fetchPage(page + 1);
      setPage(page + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1 && !loading) {
      fetchPage(page - 1);
      setPage(page - 1);
    }
  };
  
  useEffect(() => {
    fetchPage(1);
  }, []);
  
  return (
    <div className="react-query-example">
      <h2>Pagination</h2>
      <p>Demonstrates pagination with React Query.</p>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      {data && (
        <div className="posts-list">
          {data.pages.map((page, pageIndex) => (
            <div key={pageIndex} className="page-section">
              <h3>Page {data.pageParams[pageIndex]}</h3>
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
      
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={page <= 1 || loading}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={nextPage} disabled={!hasMore || loading}>
          Next
        </button>
      </div>
      
      <pre>{`
// Pagination with React Query
import { useQuery } from '@tanstack/react-query';

function PaginatedPosts({ page }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts', page],
    queryFn: async () => {
      const response = await fetch(\`/api/posts?page=\${page}&limit=5\`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    keepPreviousData: true, // Keep previous data while fetching new page
  });

  if (isLoading) return <div>Loading page {page}...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Page {page}</h3>
      <ul>
        {data?.map(post => (
          <li key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PaginationControls() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <button 
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={() => setPage(p + 1)}>
        Next
      </button>
    </div>
  );
}

function App() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <PaginationControls page={page} setPage={setPage} />
      <PaginatedPosts page={page} />
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function ReactQueryExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicQueryExample, title: "Basic Query" },
    { component: MutationExample, title: "Mutation with Optimistic Updates" },
    { component: InfiniteQueryExample, title: "Infinite Query" },
    { component: DependentQueriesExample, title: "Dependent Queries" },
    { component: QueryClientMethodsExample, title: "Query Client Methods" },
    { component: PaginationExample, title: "Pagination" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="react-query-examples">
      <h1>React Query (TanStack Query) Examples</h1>
      <p>Comprehensive examples demonstrating React Query features and patterns.</p>
      
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
        <h2>About React Query (TanStack Query)</h2>
        <p>
          React Query (now TanStack Query) is a powerful data fetching and state management library for React. 
          It provides declarative, framework-agnostic approach to managing server state with automatic caching, 
          background refetching, and synchronization.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Declarative Data Fetching</strong>: Use hooks to fetch data declaratively</li>
          <li><strong>Automatic Caching</strong>: Built-in cache with configurable policies</li>
          <li><strong>Background Refetching</strong>: Automatic refetching on window focus/reconnect</li>
          <li><strong>Optimistic Updates</strong>: Update UI before server confirmation</li>
          <li><strong>Pagination & Infinite Scroll</strong>: Built-in support for paginated data</li>
          <li><strong>Dependent Queries</strong>: Queries that depend on other queries</li>
          <li><strong>Query Client Methods</strong>: Programmatic cache management</li>
          <li><strong>DevTools Integration</strong>: Debug queries and cache state</li>
          <li><strong>Framework Agnostic</strong>: Works with React, Vue, Solid, Svelte</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`npm install @tanstack/react-query`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourComponents />
    </QueryClientProvider>
  );
}

// Use in a component
function Posts() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(post => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  );
}`}</pre>
      </div>
    </div>
  );
}