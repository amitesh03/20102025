# Advanced Data Fetching Exercises

These exercises will help you practice advanced data fetching techniques in Next.js.

## Exercise 1: Implement SWR for Client-Side Data Fetching

Create a page that uses SWR for client-side data fetching with the following features:

1. Fetch data from a public API (e.g., JSONPlaceholder)
2. Display loading and error states
3. Implement automatic revalidation on focus
4. Add a refresh button to manually revalidate
5. Implement pagination

### Hints

- Install SWR: `npm install swr`
- Use the `useSWR` hook for data fetching
- Implement a custom fetcher function
- Use the `mutate` function for manual revalidation

### Solution

<details>
<summary>Click to see solution</summary>

First, install SWR:

```bash
npm install swr
```

Create a fetcher utility at `lib/fetcher.ts`:

```typescript
export async function fetcher(url: string) {
  const res = await fetch(url)
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    throw error
  }
  
  return res.json()
}
```

Create a posts page at `app/swr-posts/page.tsx`:

```typescript
'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { fetcher } from '../../../lib/fetcher'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export default function SWRPostsPage() {
  const [page, setPage] = useState(1)
  const { data, error, isLoading, mutate } = useSWR<Post[]>(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`,
    fetcher
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Posts (SWR)</h1>
        <button
          onClick={() => mutate()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading posts...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Failed to load posts: {error.message}</p>
          <button
            onClick={() => mutate()}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}
      
      {data && (
        <div className="space-y-4">
          {data.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600">{post.body}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span className="text-gray-600">Page {page}</span>
        
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={data && data.length < 5}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

</details>

---

## Exercise 2: Create an Infinite Scroll Component

Implement an infinite scroll component that loads more data as the user scrolls down the page.

### Hints

- Use the Intersection Observer API to detect when the user reaches the bottom
- Combine with SWR for data fetching
- Implement a loading indicator at the bottom
- Handle errors gracefully

### Solution

<details>
<summary>Click to see solution</summary>

Create `app/infinite-scroll/page.tsx`:

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import { fetcher } from '../../../lib/fetcher'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export default function InfiniteScrollPage() {
  const [isReachingEnd, setIsReachingEnd] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  const { data, error, isLoading, size, setSize } = useSWRInfinite<Post[]>(
    (index: number) => `https://jsonplaceholder.typicode.com/posts?_page=${index + 1}&_limit=5`,
    fetcher
  )

  const posts = data ? data.flat() : []

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isReachingEnd) {
          setSize(size + 1)
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [observerTarget, isReachingEnd, setSize, size])

  useEffect(() => {
    if (data && data[data.length - 1].length < 5) {
      setIsReachingEnd(true)
    }
  }, [data])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Infinite Scroll Posts</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Failed to load posts</p>
        </div>
      )}
      
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.body}</p>
          </div>
        ))}
      </div>
      
      <div ref={observerTarget} className="flex justify-center py-4">
        {isLoading && (
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        )}
        
        {!isLoading && !isReachingEnd && (
          <button
            onClick={() => setSize(size + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Load More
          </button>
        )}
        
        {isReachingEnd && (
          <p className="text-gray-500">No more posts to load</p>
        )}
      </div>
    </div>
  )
}
```

</details>

---

## Exercise 3: Implement Optimistic Updates

Create a todo list application with optimistic updates for a better user experience.

### Hints

- Use SWR's mutate function for optimistic updates
- Update the UI immediately before the API call completes
- Roll back changes if the API call fails
- Add loading states for individual operations

### Solution

<details>
<summary>Click to see solution</summary>

Create `app/todos/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { fetcher } from '../../../lib/fetcher'

interface Todo {
  id: number
  title: string
  completed: boolean
  userId: number
}

export default function TodosPage() {
  const [newTodo, setNewTodo] = useState('')
  const { data: todos, error } = useSWR<Todo[]>(
    'https://jsonplaceholder.typicode.com/todos?_limit=10',
    fetcher
  )

  const addTodo = async () => {
    if (!newTodo.trim()) return

    const optimisticTodo: Todo = {
      id: Date.now(), // Temporary ID
      title: newTodo,
      completed: false,
      userId: 1,
    }

    // Optimistically update the UI
    mutate(
      'https://jsonplaceholder.typicode.com/todos?_limit=10',
      [...(todos || []), optimisticTodo],
      false
    )

    setNewTodo('')

    try {
      // Make the API call
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: optimisticTodo.title,
          completed: optimisticTodo.completed,
          userId: optimisticTodo.userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add todo')
      }

      const savedTodo = await response.json()

      // Update with the real data from the server
      mutate(
        'https://jsonplaceholder.typicode.com/todos?_limit=10',
        [...(todos || []), savedTodo],
        false
      )
    } catch (error) {
      // Roll back on error
      mutate('https://jsonplaceholder.typicode.com/todos?_limit=10')
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (todo: Todo) => {
    const originalTodos = [...(todos || [])]
    const updatedTodo = { ...todo, completed: !todo.completed }

    // Optimistically update the UI
    mutate(
      'https://jsonplaceholder.typicode.com/todos?_limit=10',
      todos?.map(t => t.id === todo.id ? updatedTodo : t),
      false
    )

    try {
      // Make the API call
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: updatedTodo.completed,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }
    } catch (error) {
      // Roll back on error
      mutate('https://jsonplaceholder.typicode.com/todos?_limit=10', originalTodos, false)
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (todoId: number) => {
    const originalTodos = [...(todos || [])]

    // Optimistically update the UI
    mutate(
      'https://jsonplaceholder.typicode.com/todos?_limit=10',
      todos?.filter(t => t.id !== todoId),
      false
    )

    try {
      // Make the API call
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }
    } catch (error) {
      // Roll back on error
      mutate('https://jsonplaceholder.typicode.com/todos?_limit=10', originalTodos, false)
      console.error('Error deleting todo:', error)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Failed to load todos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          disabled={!newTodo.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      
      {!todos ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading todos...</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="bg-white p-4 rounded-lg shadow flex items-center gap-3"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span
                className={`flex-grow ${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

</details>

---

## Exercise 4: Create a Data Cache Provider

Create a custom data cache provider that handles caching, invalidation, and background revalidation.

### Hints

- Create a context provider for data management
- Implement cache invalidation strategies
- Add background refresh functionality
- Handle stale-while-revalidate pattern

### Solution

<details>
<summary>Click to see solution</summary>

Create a cache context at `lib/cache-context.tsx`:

```typescript
'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

interface CacheContextType {
  get: <T>(key: string) => T | null
  set: <T>(key: string, data: T, ttl?: number) => void
  invalidate: (key: string) => void
  clear: () => void
}

const CacheContext = createContext<CacheContextType | null>(null)

export function CacheProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<Record<string, CacheItem<any>>>({})

  const get = useCallback(<T,>(key: string): T | null => {
    const item = cache[key]
    if (!item) return null

    // Check if item is expired
    if (Date.now() > item.timestamp + item.ttl) {
      invalidate(key)
      return null
    }

    return item.data as T
  }, [cache])

  const set = useCallback(<T,>(key: string, data: T, ttl = 300000) => {
    // Default TTL is 5 minutes
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now(),
        ttl
      }
    }))
  }, [])

  const invalidate = useCallback((key: string) => {
    setCache(prev => {
      const newCache = { ...prev }
      delete newCache[key]
      return newCache
    })
  }, [])

  const clear = useCallback(() => {
    setCache({})
  }, [])

  return (
    <CacheContext.Provider value={{ get, set, invalidate, clear }}>
      {children}
    </CacheContext.Provider>
  )
}

export function useCache() {
  const context = useContext(CacheContext)
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider')
  }
  return context
}
```

Create a custom hook at `lib/use-cached-fetch.ts`:

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCache } from './cache-context'

interface UseCachedFetchOptions {
  ttl?: number // Time to live in milliseconds
  revalidateOnFocus?: boolean
  revalidateInterval?: number // In milliseconds
}

export function useCachedFetch<T>(
  url: string,
  options: UseCachedFetchOptions = {}
) {
  const { ttl = 300000, revalidateOnFocus = true, revalidateInterval } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const cache = useCache()

  const fetchData = useCallback(async (useCache = true) => {
    try {
      setLoading(true)
      setError(null)

      // Try to get data from cache first
      if (useCache) {
        const cachedData = cache.get<T>(url)
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
          return cachedData
        }
      }

      // Fetch from network
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Cache the result
      cache.set(url, result, ttl)
      setData(result)
      setLoading(false)
      
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      setLoading(false)
      throw err
    }
  }, [url, ttl, cache])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return

    const handleFocus = () => {
      fetchData(false) // Skip cache on focus
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [revalidateOnFocus, fetchData])

  // Revalidate on interval
  useEffect(() => {
    if (!revalidateInterval) return

    const interval = setInterval(() => {
      fetchData(false) // Skip cache on interval
    }, revalidateInterval)

    return () => clearInterval(interval)
  }, [revalidateInterval, fetchData])

  const mutate = useCallback(() => {
    return fetchData(false) // Skip cache when mutating
  }, [fetchData])

  return { data, loading, error, mutate }
}
```

Create a page that uses the cache at `app/cached-data/page.tsx`:

```typescript
'use client'

import { useCachedFetch } from '../../../lib/use-cached-fetch'
import { CacheProvider } from '../../../lib/cache-context'

function CachedDataComponent() {
  const { data, loading, error, mutate } = useCachedFetch<any[]>(
    'https://jsonplaceholder.typicode.com/posts?_limit=5',
    {
      ttl: 60000, // 1 minute
      revalidateOnFocus: true,
      revalidateInterval: 30000, // 30 seconds
    }
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cached Data</h1>
        <button
          onClick={() => mutate()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
      
      {loading && !data && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading data...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Failed to load data: {error.message}</p>
        </div>
      )}
      
      {data && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <p>
              Data is cached for 1 minute and revalidated every 30 seconds.
              Try switching tabs and coming back to see revalidation in action.
            </p>
          </div>
          
          {data.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600">{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CachedDataPage() {
  return (
    <CacheProvider>
      <div className="container mx-auto px-4 py-8">
        <CachedDataComponent />
      </div>
    </CacheProvider>
  )
}
```

</details>

---

## Exercise 5: Create a Data Fetching Abstraction Layer

Create an abstraction layer for data fetching that handles common patterns like error handling, retries, and request cancellation.

### Hints

- Create a base API client class
- Implement request cancellation with AbortController
- Add retry logic with exponential backoff
- Handle different types of errors appropriately

### Solution

<details>
<summary>Click to see solution</summary>

Create an API client at `lib/api-client.ts`:

```typescript
interface ApiClientConfig {
  baseURL: string
  timeout?: number
  retries?: number
  retryDelay?: number
}

interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private baseURL: string
  private defaultTimeout: number
  private defaultRetries: number
  private defaultRetryDelay: number

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL
    this.defaultTimeout = config.timeout || 10000
    this.defaultRetries = config.retries || 3
    this.defaultRetryDelay = config.retryDelay || 1000
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async requestWithRetry(
    url: string,
    options: RequestOptions,
    retries: number
  ): Promise<Response> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.defaultTimeout)
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new ApiError(
          errorData?.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        )
      }
      
      return response
    } catch (error) {
      // Don't retry if it's an abort error or a 4xx error
      if (
        error instanceof Error && 
        (error.name === 'AbortError' || 
        (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500))
      ) {
        throw error
      }
      
      if (retries > 0) {
        // Exponential backoff
        const delay = this.defaultRetryDelay * Math.pow(2, this.defaultRetries - retries)
        await this.sleep(delay)
        return this.requestWithRetry(url, options, retries - 1)
      }
      
      throw error
    }
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const response = await this.requestWithRetry(
      url,
      { method: 'GET', ...options },
      options.retries || this.defaultRetries
    )
    return response.json()
  }

  async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const response = await this.requestWithRetry(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      },
      options.retries || this.defaultRetries
    )
    return response.json()
  }

  async put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const response = await this.requestWithRetry(
      url,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      },
      options.retries || this.defaultRetries
    )
    return response.json()
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const response = await this.requestWithRetry(
      url,
      { method: 'DELETE', ...options },
      options.retries || this.defaultRetries
    )
    return response.json()
  }
}

// Create a default instance
export const apiClient = new ApiClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
})
```

Create a custom hook at `lib/use-api.ts`:

```typescript
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient, ApiError } from './api-client'

interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const execute = useCallback(async (
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    try {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      setLoading(true)
      setError(null)

      const result = await apiCall()
      setData(result)
      options.onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      options.onError?.(error)
      return null
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [options])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return { data, loading, error, execute, reset }
}
```

Create a page that uses the API client at `app/api-client/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useApi } from '../../../lib/use-api'
import { apiClient } from '../../../lib/api-client'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export default function ApiClientPage() {
  const [postId, setPostId] = useState('1')
  const { data: post, loading, error, execute } = useApi<Post>()
  const { data: posts, loading: postsLoading, execute: fetchPosts } = useApi<Post[]>()

  const fetchPost = () => {
    execute(() => apiClient.get<Post>(`/posts/${postId}`))
  }

  const createPost = () => {
    execute(() => 
      apiClient.post<Post>('/posts', {
        title: 'New Post',
        body: 'This is a new post created with the API client',
        userId: 1,
      })
    )
  }

  const updatePost = () => {
    if (!post) return
    execute(() =>
      apiClient.put<Post>(`/posts/${post.id}`, {
        ...post,
        title: `${post.title} (Updated)`,
      })
    )
  }

  const deletePost = () => {
    if (!post) return
    execute(() => apiClient.delete<void>(`/posts/${post.id}`))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Client Demo</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Fetch Single Post</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            placeholder="Post ID"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchPost}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Fetch
          </button>
        </div>
        
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error: {error.message}</p>
          </div>
        )}
        
        {post && (
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.body}</p>
            <div className="flex gap-2">
              <button
                onClick={updatePost}
                disabled={loading}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                Update
              </button>
              <button
                onClick={deletePost}
                disabled={loading}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
        <button
          onClick={createPost}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Create Post
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Fetch All Posts</h2>
        <button
          onClick={() => fetchPosts(() => apiClient.get<Post[]>('/posts?_limit=5'))}
          disabled={postsLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
        >
          Fetch Posts
        </button>
        
        {postsLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {posts && (
          <div className="space-y-2">
            {posts.map((p) => (
              <div key={p.id} className="bg-gray-50 p-3 rounded">
                <h3 className="font-medium">{p.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

</details>

---

## Additional Challenges

1. Implement request deduplication to prevent duplicate API calls
2. Add request retry with exponential backoff
3. Create a data prefetching strategy
4. Implement a request queue for rate limiting
5. Add request/response interceptors for logging and authentication

These exercises will help you master advanced data fetching techniques in Next.js.