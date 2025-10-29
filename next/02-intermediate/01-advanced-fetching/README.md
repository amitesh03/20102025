# Advanced Data Fetching in Next.js

This example covers advanced data fetching patterns in Next.js, including React Query, SWR, server-side rendering integration, and real-time data synchronization.

## Learning Objectives

- Implement React Query for advanced data fetching with caching
- Use SWR for client-side data fetching with revalidation
- Implement optimistic updates and mutations
- Handle real-time data synchronization
- Create custom data fetching hooks
- Implement error boundaries and retry logic

## Project Structure

```
02-intermediate/01-advanced-fetching/
├── app/
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Home page with examples
│   ├── react-query/
│   │   └── page.tsx                  # React Query examples
│   ├── swr/
│   │   └── page.tsx                  # SWR examples
│   ├── real-time/
│   │   └── page.tsx                  # Real-time data examples
│   └── api/
│       ├── posts/
│       │   ├── route.ts              # API route for posts
│       │   └── [id]/
│       │       └── route.ts          # API route for single post
│       └── users/
│           ├── route.ts              # API route for users
│           └── [id]/
│               └── route.ts          # API route for single user
├── components/
│   ├── PostList.tsx                  # Post list component
│   ├── PostForm.tsx                  # Post creation form
│   ├── UserList.tsx                  # User list component
│   └── LoadingSpinner.tsx            # Loading component
├── hooks/
│   ├── usePosts.ts                   # Custom posts hook
│   ├── useUsers.ts                   # Custom users hook
│   └── useRealTime.ts                # Real-time data hook
├── lib/
│   ├── api.ts                        # API utilities
│   └── providers.tsx                 # React providers
└── README.md
```

## Key Concepts

### 1. React Query

React Query is a powerful data synchronization library that provides:

- Server state management
- Caching and background refetching
- Parallel and dependent queries
- Mutations and optimistic updates
- Pagination and infinite scrolling

```tsx
// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts')
      if (!res.ok) throw new Error('Failed to fetch posts')
      return res.json()
    }
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newPost) => {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })
      if (!res.ok) throw new Error('Failed to create post')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}
```

### 2. SWR

SWR (stale-while-revalidate) is a React Hooks library for data fetching:

```tsx
// hooks/useUsers.ts
import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export function useUsers() {
  const { data, error, isLoading } = useSWR('/api/users', fetcher)
  
  return {
    users: data,
    isLoading,
    isError: error
  }
}
```

### 3. Optimistic Updates

Optimistic updates improve perceived performance by updating the UI before the API call completes:

```tsx
// components/PostForm.tsx
export function PostForm() {
  const createPost = useCreatePost()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const title = formData.get('title')
    
    // Optimistic update
    createPost.mutate(
      { title },
      {
        onSuccess: () => {
          // Reset form on success
          e.target.reset()
        }
      }
    )
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### 4. Real-time Data Synchronization

Implement real-time updates using WebSockets or Server-Sent Events:

```tsx
// hooks/useRealTime.ts
import { useEffect, useState } from 'react'

export function useRealTime(url: string) {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    const eventSource = new EventSource(url)
    
    eventSource.onmessage = (event) => {
      setData(JSON.parse(event.data))
    }
    
    return () => {
      eventSource.close()
    }
  }, [url])
  
  return data
}
```

## Installation

```bash
npm install @tanstack/react-query swr
```

## Running This Example

1. Navigate to this directory
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open http://localhost:3000 in your browser

## Exercises

1. Implement a custom hook for paginated data fetching
2. Add error boundaries to handle fetch errors gracefully
3. Create a mutation with optimistic updates for a todo list
4. Implement infinite scrolling with React Query
5. Add a real-time feature using WebSockets or Server-Sent Events

## Next Steps

After completing this example, proceed to the API routes example to learn how to build backend APIs within Next.js.