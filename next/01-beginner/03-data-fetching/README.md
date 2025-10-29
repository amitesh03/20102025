# Next.js Data Fetching

This example covers the basic data fetching methods in Next.js, including server-side rendering, static site generation, and client-side fetching.

## Learning Objectives

- Understand different data fetching patterns in Next.js
- Learn about server components and how they fetch data
- Implement client-side data fetching with useEffect
- Handle loading and error states
- Cache and revalidate data

## Project Structure

```
03-data-fetching/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page with data fetching examples
│   ├── server/
│   │   └── page.tsx            # Server-side data fetching example
│   ├── client/
│   │   └── page.tsx            # Client-side data fetching example
│   ├── static/
│   │   └── page.tsx            # Static data generation example
│   └── components/
│       ├── ServerData.tsx      # Server component with data
│       ├── ClientData.tsx      # Client component with data
│       └── LoadingSpinner.tsx  # Loading component
├── lib/
│   └── data.ts                 # Data fetching utilities
└── README.md
```

## Key Concepts

### 1. Server-Side Data Fetching

Server components can fetch data directly on the server:

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function ServerComponent() {
  const data = await getData()
  return <div>{data.name}</div>
}
```

### 2. Client-Side Data Fetching

Client components use useEffect and useState for data fetching:

```tsx
"use client"

import { useState, useEffect } from 'react'

export default function ClientComponent() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])
  
  return <div>{data?.name}</div>
}
```

### 3. Static Data Generation

Use the `cache` option to statically generate data at build time:

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache'
  })
  return res.json()
}
```

### 4. Data Revalidation

Control when data is revalidated with the `next.revalidate` option:

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })
  return res.json()
}
```

## Running This Example

1. Navigate to this directory
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open http://localhost:3000 in your browser

## Code Examples

### Server Component with Data Fetching

```tsx
// app/components/ServerData.tsx
async function getUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function ServerData() {
  const users = await getUsers()
  
  return (
    <div>
      <h2>Server-Side Data</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Client Component with Data Fetching

```tsx
// app/components/ClientData.tsx
"use client"

import { useState, useEffect } from 'react'

export default function ClientData() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [])
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h2>Client-Side Data</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Exercises

1. Create a new page that fetches data from a different API
2. Implement error handling for failed data fetches
3. Add loading states to improve user experience
4. Experiment with different caching strategies
5. Create a component that combines server and client data fetching

## Next Steps

After completing this example, proceed to the intermediate examples to learn about advanced data fetching patterns, API routes, and authentication.