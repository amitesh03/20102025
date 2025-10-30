// React Query (TanStack Query) Examples with TypeScript
// This file demonstrates various React Query concepts with comprehensive TypeScript typing

import React, { useState, useEffect } from 'react';
import { 
  useQuery, 
  useMutation, 
  useInfiniteQuery, 
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
  UseMutationResult,
  UseInfiniteQueryResult
} from '@tanstack/react-query';

// ===== TYPE DEFINITIONS =====

// Interface for post data
interface Post {
  id: number;
  title: string;
  content: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Interface for new post data
interface NewPostData {
  title: string;
  content: string;
}

// Interface for user data
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

// Interface for API response
interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Interface for query error
interface QueryError {
  message: string;
  status?: number;
}

// Type for query key
type PostQueryKey = ['posts', { page?: number; category?: string }];
type UserQueryKey = ['user', { id: number }];
type PostsQueryKey = ['posts', { page?: number }];

// Type for infinite query result
type InfinitePostsResult = UseInfiniteQueryResult<ApiResponse<Post>, QueryError>;

// ===== EXAMPLE 1: BASIC QUERY =====

/**
 * Basic query demonstrating TypeScript integration with React Query
 * Shows how to type query keys, responses, and errors
 */

const BasicQueryExample: React.FC = () => {
  // Use typed query with proper typing
  const { 
    data, 
    error, 
    isLoading, 
    isError 
  }: UseQueryResult<Post[], QueryError> = useQuery<Post[], QueryError, PostQueryKey>({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response: Post[] = [
        { id: 1, title: 'First Post', content: 'Content of first post' },
        { id: 2, title: 'Second Post', content: 'Content of second post' }
      ];
      
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });

  return (
    <div className="react-query-example">
      <h2>Basic Query</h2>
      <p>Demonstrates making a simple query with React Query and TypeScript.</p>
      
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error?.message}</p>}
      {data && (
        <div className="data-display">
          {data.map((post: Post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <pre>{`
// Basic query with React Query and TypeScript
import { useQuery } from '@tanstack/react-query';

// Define type for API response
interface Post {
  id: number;
  title: string;
  content: string;
}

// Define type for query key
type PostQueryKey = ['posts'];

function PostsList() {
  const { data, error, isLoading, isError } = useQuery<Post[], Error, PostQueryKey>({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> => {
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
      {data?.map((post: Post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  );
}

// Query with parameters
interface PostDetailParams {
  postId: number;
}

type PostDetailQueryKey = ['post', { postId: number }];

function PostDetail({ postId }: PostDetailParams) {
  const { data, error, isLoading } = useQuery<Post, Error, PostDetailQueryKey>({
    queryKey: ['post', { postId }],
    queryFn: async (): Promise<Post> => {
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
      <h1>{data?.title}</h1>
      <p>{data?.content}</p>
    </article>
  );
}
      `}</pre>
    </div>
  );
};

// ===== EXAMPLE 2: MUTATION WITH OPTIMISTIC UPDATES =====

/**
 * Mutation with optimistic updates demonstrating TypeScript integration
 * Shows how to type mutations, payloads, and optimistic updates
 */

const MutationExample: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, title: 'First Post', content: 'Content of first post' }
  ]);
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  // Use typed mutation with proper typing
  const { 
    mutate, 
    isPending, 
    isError 
  }: UseMutationResult<Post, QueryError, NewPostData> = useMutation<Post, QueryError, NewPostData>({
    mutationFn: async (newPost: NewPostData): Promise<Post> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const createdPost: Post = {
        id: Date.now(),
        title: newPost.title,
        content: `Content for ${newPost.title}`
      };
      
      return createdPost;
    },
    onMutate: (newPost: NewPostData) => {
      // Optimistic update with proper typing
      const optimisticPost: Post = {
        id: Date.now(),
        title: newPost.title,
        content: `Content for ${newPost.title}`
      };
      
      setPosts((prev: Post[]) => [...prev, optimisticPost]);
    },
    onError: (error: QueryError) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPostTitle.trim()) {
      mutate({ title: newPostTitle, content: '' });
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
          disabled={isPending}
        />
        <button type="submit" disabled={isPending || !newPostTitle.trim()}>
          {isPending ? 'Adding...' : 'Add Post'}
        </button>
      </form>
      
      {error && <p className="error">Error: {error}</p>}
      
      <div className="posts-list">
        <h3>Posts:</h3>
        {posts.map((post: Post) => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      
      <pre>{`
// Mutation with optimistic updates and TypeScript
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Define types for mutation
interface NewPostData {
  title: string;
  content: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
}

function CreatePostForm() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const createPostMutation = useMutation<Post, Error, NewPostData>({
    mutationFn: async (newPost: NewPostData): Promise<Post> => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onMutate: (newPost: NewPostData) => {
      // Optimistic update
      queryClient.setQueryData(['posts'], (old: Post[] | undefined) => [
        ...(old || []),
        { ...newPost, id: Date.now() }
      ]);
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
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
      `}</pre>
    </div>
  );
};

// ===== EXAMPLE 3: INFINITE QUERY =====

/**
 * Infinite query demonstrating TypeScript integration
 * Shows how to type infinite queries and pagination
 */

const InfiniteQueryExample: React.FC = () => {
  // Use typed infinite query with proper typing
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  }: InfinitePostsResult = useInfiniteQuery<ApiResponse<Post>, QueryError, PostsQueryKey>({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 1 }): Promise<ApiResponse<Post>> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPosts: Post[] = Array.from({ length: 5 }, (_, i) => ({
        id: (pageParam - 1) * 5 + i + 1,
        title: `Post ${(pageParam - 1) * 5 + i + 1}`,
        content: `Content for post ${(pageParam - 1) * 5 + i + 1}`
      }));
      
      return {
        data: newPosts,
        total: 15,
        page: pageParam,
        totalPages: 3,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: ApiResponse<Post>) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
  });

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="react-query-example">
      <h2>Infinite Query</h2>
      <p>Demonstrates infinite scrolling with React Query and TypeScript.</p>
      
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error?.message}</p>}
      
      {data && (
        <div className="posts-list">
          {data.pages.map((page: ApiResponse<Post>, pageIndex: number) => (
            <div key={pageIndex} className="page-section">
              <h3>Page {page.page}</h3>
              {page.data.map((post: Post) => (
                <div key={post.id} className="post-card">
                  <h4>{post.title}</h4>
                  <p>{post.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {hasNextPage && (
        <button onClick={loadMore} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
      
      <pre>{`
// Infinite query with React Query and TypeScript
import { useInfiniteQuery } from '@tanstack/react-query';

// Define types for infinite query
interface Post {
  id: number;
  title: string;
  content: string;
}

interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

type PostsQueryKey = ['posts'];

function InfinitePostsList() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<ApiResponse<Post>, Error, PostsQueryKey>({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 1 }): Promise<ApiResponse<Post>> => {
      const response = await fetch(\`/api/posts?page=\${pageParam}\`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      return {
        data: response.json(),
        nextPage: pageParam + 1,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: ApiResponse<Post>) => lastPage.nextPage,
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.pages.map((page: ApiResponse<Post>, i: number) => (
        <div key={i}>
          <h3>Page {i + 1}</h3>
          <ul>
            {page.data.map((post: Post) => (
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
      `}</pre>
    </div>
  );
};

// ===== EXAMPLE 4: DEPENDENT QUERIES =====

/**
 * Dependent queries demonstrating TypeScript integration
 * Shows how to type dependent queries and conditional fetching
 */

const DependentQueriesExample: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  // Use typed dependent query with proper typing
  const { 
    data: user, 
    error: userError, 
    isLoading: userLoading 
  }: UseQueryResult<User, QueryError, UserQueryKey> = useQuery<User, QueryError, UserQueryKey>({
    queryKey: ['user', { id: selectedUserId! }],
    queryFn: async (): Promise<User> => {
      if (!selectedUserId) throw new Error('User ID is required');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: selectedUserId,
        name: `User ${selectedUserId}`,
        email: `user${selectedUserId}@example.com`,
        avatar: `https://i.pravatar.cc/150?img=${selectedUserId}`,
      };
    },
    enabled: !!selectedUserId, // Only run when userId is provided
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  // Use typed dependent query that depends on user data
  const { 
    data: posts, 
    error: postsError, 
    isLoading: postsLoading 
  }: UseQueryResult<Post[], QueryError, PostQueryKey> = useQuery<Post[], QueryError, PostQueryKey>({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> => {
      if (!user) throw new Error('User data is required');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1} by ${user.name}`,
        content: `Content for post ${i + 1} by ${user.name}`
      }));
    },
    enabled: !!user, // Only run when user data is available
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="react-query-example">
      <h2>Dependent Queries</h2>
      <p>Demonstrates dependent queries with React Query and TypeScript.</p>
      
      <div className="user-selector">
        <h3>Select a User:</h3>
        {[1, 2, 3].map((userId: number) => (
          <button
            key={userId}
            onClick={() => setSelectedUserId(userId)}
            className={selectedUserId === userId ? 'active' : ''}
          >
            User {userId}
          </button>
        ))}
      </div>
      
      {userLoading && <p>Loading user...</p>}
      {userError && <p>Error: {userError.message}</p>}
      
      {user && (
        <div className="data-display">
          <div className="user-info">
            <h3>User Information:</h3>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          
          {postsLoading && <p>Loading posts...</p>}
          {postsError && <p>Error: {postsError.message}</p>}
          
          {posts && (
            <div className="user-posts">
              <h3>User Posts:</h3>
              {posts.map((post: Post) => (
                <div key={post.id} className="post-card">
                  <h4>{post.title}</h4>
                  <p>{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <pre>{`
// Dependent queries with React Query and TypeScript
import { useQuery } from '@tanstack/react-query';

// Define types for dependent queries
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
}

type UserQueryKey = ['user', { id: number }];
type PostsQueryKey = ['posts', { userId: number }];

function UserProfile({ userId }: { userId: number }) {
  // This query will only run when userId is provided
  const { data: user, isLoading: userLoading } = useQuery<User, Error, UserQueryKey>({
    queryKey: ['user', { userId }],
    queryFn: async (): Promise<User> => {
      const response = await fetch(\`/api/users/\${userId}\`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
    enabled: !!userId,
  });

  // This query depends on user query and will only run when user data is available
  const { data: posts, isLoading: postsLoading } = useQuery<Post[], Error, PostsQueryKey>({
    queryKey: ['posts', { userId: userId }],
    queryFn: async (): Promise<Post[]> => {
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
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
      </div>
      
      <h3>Posts:</h3>
      <ul>
        {posts?.map((post: Post) => (
          <li key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
      `}</pre>
    </div>
  );
};

// ===== EXAMPLE 5: QUERY CLIENT METHODS =====

/**
 * Query client methods demonstrating TypeScript integration
 * Shows how to type query client methods and programmatic cache management
 */

const QueryClientMethodsExample: React.FC = () => {
  const [data, setData] = useState<Post[] | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setMessage('');
    
    try {
      // Simulate API call with React Query client methods
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response: Post[] = [
        { id: 1, title: 'First Post', content: 'Content of first post' },
        { id: 2, title: 'Second Post', content: 'Content of second post' }
      ];
      
      setData(response);
      setMessage('Data fetched successfully');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrefetch = async () => {
    // Prefetch data with proper typing
    await queryClient.prefetchQuery<Post[], QueryError, PostQueryKey>({
      queryKey: ['posts'],
      queryFn: async (): Promise<Post[]> => {
        const response = await fetch('/api/posts');
        return response.json();
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
    setMessage('Data prefetched successfully');
  };

  const handleGetCachedData = () => {
    // Get cached data with proper typing
    const cachedData = queryClient.getQueryData<Post[]>(['posts']);
    if (cachedData) {
      setData(cachedData);
      setMessage('Retrieved cached data');
    } else {
      setMessage('No cached data found');
    }
  };

  const handleSetQueryData = () => {
    // Set query data manually with proper typing
    const newData: Post[] = [
      { id: 1, title: 'Updated Post 1', content: 'Updated content 1' },
      { id: 2, title: 'Updated Post 2', content: 'Updated content 2' }
    ];
    
    queryClient.setQueryData<Post[]>(['posts'], newData);
    setData(newData);
    setMessage('Query data updated manually');
  };

  const handleInvalidateQueries = async () => {
    // Invalidate queries with proper typing
    await queryClient.invalidateQueries({ queryKey: ['posts'] });
    setMessage('Queries invalidated');
  };

  const handleCancelQueries = () => {
    // Cancel queries with proper typing
    queryClient.cancelQueries({ queryKey: ['posts'] });
    setMessage('Queries cancelled');
  };

  const handleRemoveQueries = () => {
    // Remove queries from cache with proper typing
    queryClient.removeQueries({ queryKey: ['posts'] });
    setData(null);
    setMessage('Queries removed from cache');
  };

  const handleResetQueries = async () => {
    // Reset queries with proper typing
    await queryClient.resetQueries({ queryKey: ['posts'] });
    setData(null);
    setMessage('Queries reset');
  };

  return (
    <div className="react-query-example">
      <h2>Query Client Methods</h2>
      <p>Demonstrates programmatic cache management with React Query and TypeScript.</p>
      
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {message && <p className="success">{message}</p>}
      
      {data && (
        <div className="data-display">
          {data.map((post: Post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="client-methods">
        <h3>Query Client Methods:</h3>
        <button onClick={handlePrefetch}>Prefetch Data</button>
        <button onClick={handleGetCachedData}>Get Cached Data</button>
        <button onClick={handleSetQueryData}>Set Query Data</button>
        <button onClick={handleInvalidateQueries}>Invalidate Queries</button>
        <button onClick={handleCancelQueries}>Cancel Queries</button>
        <button onClick={handleRemoveQueries}>Remove Queries</button>
        <button onClick={handleResetQueries}>Reset Queries</button>
      </div>
      
      <pre>{`
// Query client methods with TypeScript
import { useQueryClient } from '@tanstack/react-query';

// Define types
interface Post {
  id: number;
  title: string;
  content: string;
}

type PostQueryKey = ['posts'];

function CacheControls() {
  const queryClient = useQueryClient();

  // Prefetch data
  const prefetchPosts = async () => {
    await queryClient.prefetchQuery<Post[], Error, PostQueryKey>({
      queryKey: ['posts'],
      queryFn: async (): Promise<Post[]> => {
        const response = await fetch('/api/posts');
        return response.json();
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Get cached data without fetching
  const getCachedPosts = (): Post[] | undefined => {
    return queryClient.getQueryData<Post[]>(['posts']);
  };

  // Set query data manually
  const updatePost = (postId: number, updates: Partial<Post>) => {
    queryClient.setQueryData<Post[]>(['posts'], (old: Post[] | undefined) => {
      if (!old) return old;
      return old.map((post: Post) => 
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
};

// ===== MAIN APP COMPONENT =====

/**
 * Main component that demonstrates all React Query TypeScript examples
 */
const ReactQueryExamples: React.FC = () => {
  const [activeExample, setActiveExample] = useState<number>(0);
  
  const examples = [
    { component: BasicQueryExample, title: "Basic Query" },
    { component: MutationExample, title: "Mutation with Optimistic Updates" },
    { component: InfiniteQueryExample, title: "Infinite Query" },
    { component: DependentQueriesExample, title: "Dependent Queries" },
    { component: QueryClientMethodsExample, title: "Query Client Methods" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="react-query-examples">
      <h1>React Query (TanStack Query) TypeScript Examples</h1>
      <p>Comprehensive examples demonstrating React Query features with TypeScript typing.</p>
      
      <div className="example-navigation">
        {examples.map((example, index: number) => (
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
        <h2>About React Query (TanStack Query) with TypeScript</h2>
        <p>
          React Query (now TanStack Query) is a powerful data fetching and state management library for React. 
          With TypeScript, it provides type-safe server state management with automatic caching, 
          background refetching, and synchronization.
        </p>
        
        <h3>Key TypeScript Benefits:</h3>
        <ul>
          <li><strong>Typed Queries:</strong> Type-safe query keys and return values</li>
          <li><strong>Typed Mutations:</strong> Type-safe mutation parameters and results</li>
          <li><strong>Typed Selectors:</strong> Type-safe data transformation</li>
          <li><strong>Typed Hooks:</strong> Properly typed React Query hooks</li>
          <li><strong>Error Typing:</strong> Type-safe error handling</li>
          <li><strong>IntelliSense:</strong> Better autocompletion and refactoring</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`npm install @tanstack/react-query`}</pre>
        
        <h3>Basic Usage with TypeScript:</h3>
        <pre>{`import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

// Create a typed client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourComponents />
    </QueryClientProvider>
  );
}

// Use in a typed component
interface Post {
  id: number;
  title: string;
  content: string;
}

function Posts() {
  const { data, error, isLoading } = useQuery<Post[], Error, ['posts']>({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> => {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((post: Post) => (
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
};

export default ReactQueryExamples;