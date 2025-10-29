import React, { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import './ReactQueryExample.css'

// Create a client
const queryClient = new QueryClient()

// Mock API functions
const fetchPosts = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return [
    { id: 1, title: 'Introduction to React Query', body: 'Learn the basics of React Query', author: 'John Doe', likes: 42 },
    { id: 2, title: 'Advanced React Query Patterns', body: 'Explore advanced patterns with React Query', author: 'Jane Smith', likes: 38 },
    { id: 3, title: 'React Query vs Redux', body: 'Comparing state management solutions', author: 'Mike Johnson', likes: 25 },
    { id: 4, title: 'Optimistic Updates', body: 'Implementing optimistic updates with React Query', author: 'Sarah Williams', likes: 31 },
    { id: 5, title: 'Pagination with React Query', body: 'How to implement pagination', author: 'David Brown', likes: 19 }
  ]
}

const fetchPostById = async (postId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  const posts = await fetchPosts()
  const post = posts.find(p => p.id === parseInt(postId))
  if (!post) throw new Error('Post not found')
  return post
}

const fetchComments = async (postId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    { id: 1, postId: parseInt(postId), text: 'Great article!', author: 'User1' },
    { id: 2, postId: parseInt(postId), text: 'Very helpful, thanks!', author: 'User2' },
    { id: 3, postId: parseInt(postId), text: 'Looking forward to more content like this.', author: 'User3' }
  ]
}

const createPost = async (newPost) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    id: Date.now(),
    ...newPost,
    likes: 0
  }
}

const updatePost = async ({ id, ...updates }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  return { id, ...updates }
}

const deletePost = async (postId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  return postId
}

// Example 1: Basic Query
const PostsList = () => {
  const { data, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5000, // Data is fresh for 5 seconds
  })
  
  if (isLoading) return <div className="loading">Loading posts...</div>
  if (isError) return <div className="error">Error: {error.message}</div>
  
  return (
    <div className="posts-example">
      <div className="posts-header">
        <h3>Posts List</h3>
        <button onClick={() => refetch()}>Refresh</button>
      </div>
      <div className="posts-grid">
        {data.map(post => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div className="post-meta">
              <span>By {post.author}</span>
              <span>{post.likes} likes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Example 2: Dependent Query
const PostWithComments = ({ postId }) => {
  const { data: post, isLoading: postLoading, isError: postError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId // Only run query if postId is available
  })
  
  const { data: comments, isLoading: commentsLoading, isError: commentsError } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: !!post // Only run comments query if post data is available
  })
  
  if (postLoading) return <div className="loading">Loading post...</div>
  if (postError) return <div className="error">Error: {postError.message}</div>
  
  return (
    <div className="post-detail">
      <div className="post-header">
        <h3>{post.title}</h3>
        <p>By {post.author} | {post.likes} likes</p>
      </div>
      <div className="post-body">
        <p>{post.body}</p>
      </div>
      
      <div className="comments-section">
        <h4>Comments</h4>
        {commentsLoading ? (
          <div className="loading">Loading comments...</div>
        ) : commentsError ? (
          <div className="error">Error loading comments</div>
        ) : (
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <strong>{comment.author}:</strong> {comment.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Example 3: Mutations with Optimistic Updates
const CreatePostForm = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState('')
  const queryClient = useQueryClient()
  
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      
      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['posts'], old => 
        old ? [...old, { id: Date.now(), ...newPost, likes: 0 }] : [newPost]
      )
      
      // Return a context object with the snapshotted value
      return { previousPosts }
    },
    onError: (err, newPost, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['posts'], context.previousPosts)
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (title && body && author) {
      createPostMutation.mutate({ title, body, author })
      setTitle('')
      setBody('')
      setAuthor('')
    }
  }
  
  return (
    <div className="create-post-form">
      <h3>Create New Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input 
            type="text" 
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Body:</label>
          <textarea 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={createPostMutation.isPending}>
          {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
        </button>
      </form>
      {createPostMutation.isError && (
        <div className="error">
          Error creating post: {createPostMutation.error.message}
        </div>
      )}
    </div>
  )
}

// Example 4: Edit and Delete with Mutations
const PostActions = ({ post }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(post.title)
  const [editBody, setEditBody] = useState(post.body)
  const queryClient = useQueryClient()
  
  const updatePostMutation = useMutation({
    mutationFn: updatePost,
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      const previousPosts = queryClient.getQueryData(['posts'])
      
      queryClient.setQueryData(['posts'], old => 
        old ? old.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p) : []
      )
      
      return { previousPosts }
    },
    onError: (err, updatedPost, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
  
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      const previousPosts = queryClient.getQueryData(['posts'])
      
      queryClient.setQueryData(['posts'], old => 
        old ? old.filter(p => p.id !== postId) : []
      )
      
      return { previousPosts }
    },
    onError: (err, postId, context) => {
      queryClient.setQueryData(['posts'], context.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
  
  const handleUpdate = () => {
    updatePostMutation.mutate({ id: post.id, title: editTitle, body: editBody })
    setIsEditing(false)
  }
  
  const handleDelete = () => {
    deletePostMutation.mutate(post.id)
  }
  
  return (
    <div className="post-actions">
      {isEditing ? (
        <div className="edit-form">
          <input 
            type="text" 
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea 
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
          />
          <div className="edit-buttons">
            <button onClick={handleUpdate} disabled={updatePostMutation.isPending}>
              {updatePostMutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="action-buttons">
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete} disabled={deletePostMutation.isPending}>
            {deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}

// Example 5: Pagination
const PaginatedPosts = () => {
  const [page, setPage] = useState(1)
  const postsPerPage = 2
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', 'paginated', page],
    queryFn: async () => {
      const posts = await fetchPosts()
      const startIndex = (page - 1) * postsPerPage
      return {
        posts: posts.slice(startIndex, startIndex + postsPerPage),
        totalPages: Math.ceil(posts.length / postsPerPage)
      }
    },
    keepPreviousData: true // Keep previous data while fetching new data
  })
  
  if (isLoading) return <div className="loading">Loading posts...</div>
  if (isError) return <div className="error">Error loading posts</div>
  
  return (
    <div className="paginated-posts">
      <h3>Paginated Posts</h3>
      <div className="posts-grid">
        {data.posts.map(post => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div className="post-meta">
              <span>By {post.author}</span>
              <span>{post.likes} likes</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button 
          onClick={() => setPage(old => Math.max(old - 1, 1))} 
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {data.totalPages}</span>
        <button 
          onClick={() => setPage(old => Math.min(old + 1, data.totalPages))} 
          disabled={page === data.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

// Example 6: Infinite Scroll
const InfinitePosts = () => {
  const [page, setPage] = useState(1)
  const postsPerPage = 2
  
  const { data, isLoading, isError, isFetchingNextPage, fetchNextPage, hasNextPage } = useQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const posts = await fetchPosts()
      const startIndex = (pageParam - 1) * postsPerPage
      return {
        posts: posts.slice(startIndex, startIndex + postsPerPage),
        nextPage: startIndex + postsPerPage < posts.length ? pageParam + 1 : undefined
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage
  })
  
  const posts = data?.pages.flatMap(page => page.posts) || []
  
  return (
    <div className="infinite-posts">
      <h3>Infinite Scroll Posts</h3>
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div className="post-meta">
              <span>By {post.author}</span>
              <span>{post.likes} likes</span>
            </div>
          </div>
        ))}
      </div>
      <div className="load-more">
        <button 
          onClick={() => fetchNextPage()} 
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
        </button>
      </div>
    </div>
  )
}

// Main Component
const ReactQueryExample = () => {
  const [activeTab, setActiveTab] = useState('basic')
  
  return (
    <div className="react-query-example">
      <div className="example-container">
        <div className="example-header">
          <h2>React Query Examples</h2>
          <p>Learn async data fetching and caching with React Query</p>
        </div>
        
        <div className="example-section">
          <h3>Basic Query Setup</h3>
          <div className="code-block">
            <pre>{`import { useQuery } from '@tanstack/react-query'

const { data, error, isLoading } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 5000, // Data is fresh for 5 seconds
})`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Mutations with Optimistic Updates</h3>
          <div className="code-block">
            <pre>{`const mutation = useMutation({
  mutationFn: createPost,
  onMutate: async (newPost) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries(['posts'])
    
    // Snapshot previous value
    const previousPosts = queryClient.getQueryData(['posts'])
    
    // Optimistically update
    queryClient.setQueryData(['posts'], old => 
      [...old, newPost]
    )
    
    return { previousPosts }
  },
  onError: (err, newPost, context) => {
    // Roll back on error
    queryClient.setQueryData(['posts'], context.previousPosts)
  },
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries(['posts'])
  },
})`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Interactive Examples</h3>
          <div className="tab-navigation">
            <button 
              className={activeTab === 'basic' ? 'active' : ''}
              onClick={() => setActiveTab('basic')}
            >
              Basic Query
            </button>
            <button 
              className={activeTab === 'dependent' ? 'active' : ''}
              onClick={() => setActiveTab('dependent')}
            >
              Dependent Query
            </button>
            <button 
              className={activeTab === 'mutations' ? 'active' : ''}
              onClick={() => setActiveTab('mutations')}
            >
              Mutations
            </button>
            <button 
              className={activeTab === 'pagination' ? 'active' : ''}
              onClick={() => setActiveTab('pagination')}
            >
              Pagination
            </button>
            <button 
              className={activeTab === 'infinite' ? 'active' : ''}
              onClick={() => setActiveTab('infinite')}
            >
              Infinite Scroll
            </button>
          </div>
          
          <div className="tab-content">
            <QueryClientProvider client={queryClient}>
              {activeTab === 'basic' && <PostsList />}
              {activeTab === 'dependent' && (
                <div>
                  <div className="post-selector">
                    <h4>Select a Post:</h4>
                    <select onChange={(e) => setActiveTab(`post-${e.target.value}`)}>
                      <option value="">Choose a post...</option>
                      <option value="1">Post 1</option>
                      <option value="2">Post 2</option>
                      <option value="3">Post 3</option>
                    </select>
                  </div>
                </div>
              )}
              {activeTab.startsWith('post-') && (
                <PostWithComments postId={activeTab.split('-')[1]} />
              )}
              {activeTab === 'mutations' && (
                <div>
                  <CreatePostForm />
                  <div className="posts-with-actions">
                    <h4>Posts with Actions:</h4>
                    <PostsListWithActions />
                  </div>
                </div>
              )}
              {activeTab === 'pagination' && <PaginatedPosts />}
              {activeTab === 'infinite' && <InfinitePosts />}
            </QueryClientProvider>
          </div>
        </div>
        
        <div className="exercise">
          <h4>Exercise:</h4>
          <p>Create a social media feed application with React Query that includes:</p>
          <ul>
            <li>Feed posts with infinite scroll pagination</li>
            <li>Like/unlike functionality with optimistic updates</li>
            <li>Comment system with dependent queries</li>
            <li>Post creation with form validation</li>
            <li>Error handling and retry logic</li>
            <li>Background refetching and stale time configuration</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Helper component for mutations example
const PostsListWithActions = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })
  
  if (isLoading) return <div className="loading">Loading posts...</div>
  if (isError) return <div className="error">Error loading posts</div>
  
  return (
    <div className="posts-with-actions-list">
      {data.map(post => (
        <div key={post.id} className="post-card-with-actions">
          <div className="post-content">
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div className="post-meta">
              <span>By {post.author}</span>
              <span>{post.likes} likes</span>
            </div>
          </div>
          <PostActions post={post} />
        </div>
      ))}
    </div>
  )
}

export default ReactQueryExample