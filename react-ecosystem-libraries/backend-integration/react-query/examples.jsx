// React Query Examples with Detailed Comments
// This file demonstrates various React Query concepts with comprehensive explanations

import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

// Create a client for React Query
const queryClient = new QueryClient();

// ===== EXAMPLE 1: BASIC DATA FETCHING =====
/**
 * Basic data fetching demonstrating core React Query concepts
 * useQuery hook provides data fetching with caching, refetching, and more
 */

// Mock API functions for demonstration
const fetchPosts = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  return [
    { id: 1, title: 'Post 1', body: 'This is the first post' },
    { id: 2, title: 'Post 2', body: 'This is the second post' },
    { id: 3, title: 'Post 3', body: 'This is the third post' },
  ];
};

const fetchPostById = async (postId) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: postId,
    title: `Post ${postId}`,
    body: `This is the content of post ${postId}`,
    userId: 1
  };
};

function BasicDataFetching() {
  // Basic useQuery hook
  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery(
    'posts', // Query key - unique identifier for this query
    fetchPosts, // Query function - returns a promise
    {
      // Query options
      staleTime: 5000, // Data is considered fresh for 5 seconds
      cacheTime: 10000, // Data is cached for 10 seconds
      refetchOnWindowFocus: true, // Refetch when window gains focus
      retry: 3, // Retry failed requests 3 times
      retryDelay: 1000, // Delay between retries
    }
  );

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Basic Data Fetching</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => refetch()} disabled={isFetching} style={{ padding: '10px 20px' }}>
          {isFetching ? 'Refetching...' : 'Refetch Posts'}
        </button>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          Loading posts...
        </div>
      )}
      
      {/* Error state */}
      {isError && (
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

// ===== EXAMPLE 2: DEPENDENT QUERIES =====
/**
 * Dependent queries demonstrating queries that depend on other data
 * Use the enabled option to create dependent queries
 */

function DependentQueries() {
  const [selectedPostId, setSelectedPostId] = useState(null);

  // First query to get all posts
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError
  } = useQuery('posts', fetchPosts);

  // Second query that depends on the first query's result
  const {
    data: selectedPost,
    isLoading: postLoading,
    error: postError
  } = useQuery(
    ['post', selectedPostId], // Query key includes the post ID
    () => fetchPostById(selectedPostId),
    {
      // Only run this query if selectedPostId is not null
      enabled: !!selectedPostId,
      staleTime: 0, // Always refetch when selectedPostId changes
    }
  );

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Dependent Queries</h3>
      
      {/* First query results */}
      {postsLoading && <div>Loading posts...</div>}
      {postsError && <div>Error loading posts: {postsError.message}</div>}
      
      {posts && (
        <div style={{ marginBottom: '20px' }}>
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
      
      {/* Dependent query results */}
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

// ===== EXAMPLE 3: MUTATIONS =====
/**
 * Mutations demonstrating data modification operations
 * useMutation hook for POST, PUT, DELETE operations
 */

// Mock mutation functions
const createPost = async (newPost) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: Date.now(),
    ...newPost,
    createdAt: new Date().toISOString()
  };
};

const updatePost = async ({ id, ...updates }) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

const deletePost = async (postId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true, deletedId: postId };
};

function MutationsExample() {
  const queryClient = useQueryClient();
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  // Create mutation
  const createMutation = useMutation(createPost, {
    // onSuccess callback - called when mutation succeeds
    onSuccess: (data) => {
      console.log('Post created successfully:', data);
      // Invalidate and refetch posts query
      queryClient.invalidateQueries('posts');
      // Reset form
      setNewPostTitle('');
      setNewPostBody('');
    },
    // onError callback - called when mutation fails
    onError: (error) => {
      console.error('Failed to create post:', error);
    },
    // onSettled callback - called regardless of success or failure
    onSettled: () => {
      console.log('Create mutation settled');
    }
  });

  // Update mutation
  const updateMutation = useMutation(updatePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    }
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    
    if (newPostTitle && newPostBody) {
      createMutation.mutate({
        title: newPostTitle,
        body: newPostBody,
        userId: 1
      });
    }
  };

  const handleUpdatePost = (postId) => {
    updateMutation.mutate({
      id: postId,
      title: `Updated Post ${postId}`,
      body: `This post was updated at ${new Date().toLocaleTimeString()}`
    });
  };

  const handleDeletePost = (postId) => {
    deleteMutation.mutate(postId);
  };

  // Get posts data for display
  const { data: posts } = useQuery('posts', fetchPosts);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Mutations Example</h3>
      
      {/* Create Post Form */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Create New Post</h4>
        <form onSubmit={handleCreatePost}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Post Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              style={{ padding: '8px', marginRight: '10px', width: '200px' }}
            />
            <input
              type="text"
              placeholder="Post Body"
              value={newPostBody}
              onChange={(e) => setNewPostBody(e.target.value)}
              style={{ padding: '8px', width: '300px' }}
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isLoading}
            style={{ padding: '10px 20px' }}
          >
            {createMutation.isLoading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
        
        {createMutation.isError && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            Error: {createMutation.error.message}
          </div>
        )}
        
        {createMutation.isSuccess && (
          <div style={{ color: 'green', marginTop: '10px' }}>
            Post created successfully!
          </div>
        )}
      </div>
      
      {/* Posts List with Actions */}
      {posts && (
        <div style={{ textAlign: 'left' }}>
          <h4>Posts:</h4>
          {posts.map(post => (
            <div key={post.id} style={{ 
              padding: '15px', 
              margin: '10px 0', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '8px' 
            }}>
              <h5>{post.title}</h5>
              <p>{post.body}</p>
              
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => handleUpdatePost(post.id)}
                  disabled={updateMutation.isLoading}
                  style={{ 
                    marginRight: '10px', 
                    padding: '5px 10px',
                    backgroundColor: '#ffc107',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {updateMutation.isLoading ? 'Updating...' : 'Update'}
                </button>
                
                <button
                  onClick={() => handleDeletePost(post.id)}
                  disabled={deleteMutation.isLoading}
                  style={{ 
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 4: PAGINATION =====
/**
 * Pagination demonstrating how to implement paginated queries
 * Use query keys with page parameters for pagination
 */

// Mock paginated fetch function
const fetchPaginatedPosts = async ({ pageParam = 1 }) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const postsPerPage = 3;
  const allPosts = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    body: `This is the content of post ${i + 1}`,
  }));
  
  const startIndex = (pageParam - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  
  return {
    posts: allPosts.slice(startIndex, endIndex),
    currentPage: pageParam,
    totalPages: Math.ceil(allPosts.length / postsPerPage),
    hasNextPage: pageParam < Math.ceil(allPosts.length / postsPerPage),
    hasPreviousPage: pageParam > 1,
  };
};

function PaginationExample() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    isPreviousData
  } = useQuery(
    ['paginatedPosts', page], // Query key includes page
    () => fetchPaginatedPosts({ pageParam: page }),
    {
      keepPreviousData: true, // Keep previous data while fetching new data
      staleTime: 5000,
    }
  );

  const goToNextPage = () => {
    if (data?.hasNextPage) {
      setPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (data?.hasPreviousPage) {
      setPage(page - 1);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Pagination Example</h3>
      
      {isLoading && <div>Loading page {page}...</div>}
      {isError && <div>Error: {error.message}</div>}
      
      {data && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h4>Page {data.currentPage} of {data.totalPages}</h4>
            <p>Showing {data.posts.length} posts</p>
          </div>
          
          {/* Posts */}
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            {data.posts.map(post => (
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
          
          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={goToPreviousPage}
              disabled={!data.hasPreviousPage || isFetching}
              style={{ padding: '10px 20px' }}
            >
              ← Previous
            </button>
            
            <span style={{ padding: '10px' }}>
              {isFetching && isPreviousData ? 'Fetching...' : `Page ${data.currentPage}`}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={!data.hasNextPage || isFetching}
              style={{ padding: '10px 20px' }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 5: INFINITE QUERY =====
/**
 * Infinite query demonstrating infinite scrolling functionality
 * useInfiniteQuery hook for infinite loading patterns
 */

import { useInfiniteQuery } from 'react-query';

// Mock infinite fetch function
const fetchInfinitePosts = async ({ pageParam = 1 }) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const postsPerPage = 3;
  const allPosts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    body: `This is the content of post ${i + 1}`,
  }));
  
  const startIndex = (pageParam - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  
  const posts = allPosts.slice(startIndex, endIndex);
  
  return {
    posts,
    nextPage: endIndex < allPosts.length ? pageParam + 1 : undefined,
    hasMore: endIndex < allPosts.length,
  };
};

function InfiniteQueryExample() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery(
    'infinitePosts',
    fetchInfinitePosts,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Infinite Query Example</h3>
      
      {isLoading && <div>Loading initial posts...</div>}
      {isError && <div>Error: {error.message}</div>}
      
      {data && (
        <div>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            {data.pages.map((page, pageIndex) => (
              <div key={pageIndex}>
                {page.posts.map(post => (
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
            ))}
          </div>
          
          {/* Load More Button */}
          <div>
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              style={{ padding: '10px 20px' }}
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== EXAMPLE 6: QUERY INVALIDATION =====
/**
 * Query invalidation demonstrating how to manage cache invalidation
 * Various methods to invalidate and refetch queries
 */

function QueryInvalidationExample() {
  const queryClient = useQueryClient();
  const [invalidationType, setInvalidationType] = useState('');

  const { data: posts, isLoading } = useQuery('posts', fetchPosts);

  const handleInvalidatePosts = () => {
    setInvalidationType('posts');
    queryClient.invalidateQueries('posts');
  };

  const handleInvalidateAll = () => {
    setInvalidationType('all');
    queryClient.invalidateQueries();
  };

  const handleRefetchPosts = () => {
    setInvalidationType('refetch');
    queryClient.refetchQueries('posts');
  };

  const handleRemovePosts = () => {
    setInvalidationType('remove');
    queryClient.removeQueries('posts');
  };

  const handleResetQueries = () => {
    setInvalidationType('reset');
    queryClient.resetQueries('posts');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Query Invalidation Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleInvalidatePosts} style={{ margin: '5px', padding: '10px 15px' }}>
          Invalidate Posts
        </button>
        <button onClick={handleInvalidateAll} style={{ margin: '5px', padding: '10px 15px' }}>
          Invalidate All
        </button>
        <button onClick={handleRefetchPosts} style={{ margin: '5px', padding: '10px 15px' }}>
          Refetch Posts
        </button>
        <button onClick={handleRemovePosts} style={{ margin: '5px', padding: '10px 15px' }}>
          Remove Posts
        </button>
        <button onClick={handleResetQueries} style={{ margin: '5px', padding: '10px 15px' }}>
          Reset Queries
        </button>
      </div>
      
      {invalidationType && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          Last action: {invalidationType}
        </div>
      )}
      
      {isLoading && <div>Loading posts...</div>}
      
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

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all React Query examples
 */
function ReactQueryExamples() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1>React Query Examples</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
          <BasicDataFetching />
          <DependentQueries />
          <MutationsExample />
          <PaginationExample />
          <InfiniteQueryExample />
          <QueryInvalidationExample />
        </div>
        
        <div style={{ 
          marginTop: '40px', 
          padding: '30px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '10px' 
        }}>
          <h3>React Query Benefits</h3>
          <ul>
            <li><strong>Automatic Caching:</strong> Built-in intelligent caching</li>
            <li><strong>Background Updates:</strong> Automatic refetching in background</li>
            <li><strong>Parallel Queries:</strong> Execute multiple queries in parallel</li>
            <li><strong>Dependent Queries:</strong> Queries that depend on other queries</li>
            <li><strong>Mutations:</strong> Easy data modification with optimistic updates</li>
            <li><strong>Pagination:</strong> Built-in pagination support</li>
            <li><strong>Infinite Loading:</strong> Infinite scroll functionality</li>
            <li><strong>DevTools:</strong> Excellent developer tools for debugging</li>
            <li><strong>TypeScript Support:</strong> Excellent type safety</li>
            <li><strong>Server-side Rendering:</strong> Works with SSR frameworks</li>
          </ul>
          
          <h4>Key Concepts Demonstrated:</h4>
          <ul>
            <li><strong>useQuery:</strong> Data fetching with caching</li>
            <li><strong>useMutation:</strong> Data modification operations</li>
            <li><strong>useInfiniteQuery:</strong> Infinite scrolling</li>
            <li><strong>Query Keys:</strong> Unique identifiers for queries</li>
            <li><strong>Cache Management:</strong> Invalidation and refetching</li>
            <li><strong>Query Options:</strong> Configuration and optimization</li>
            <li><strong>Error Handling:</strong> Comprehensive error management</li>
          </ul>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default ReactQueryExamples;