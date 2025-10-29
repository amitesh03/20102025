# API Routes Exercises

These exercises will help you practice creating and using API routes in Next.js applications. API routes allow you to build full-stack applications with Next.js by providing backend functionality.

## Exercise 1: Basic CRUD API

Create a complete CRUD (Create, Read, Update, Delete) API for managing a collection of items.

### Requirements

1. Create API routes for the following operations:
   - `GET /api/items` - Get all items
   - `GET /api/items/[id]` - Get a specific item by ID
   - `POST /api/items` - Create a new item
   - `PUT /api/items/[id]` - Update an existing item
   - `DELETE /api/items/[id]` - Delete an item

2. Each item should have:
   - ID (auto-generated)
   - Title
   - Description
   - Created at timestamp
   - Updated at timestamp

3. Implement proper error handling and validation

4. Store data in memory (no database needed for this exercise)

### Hints

- Use the `pages/api` directory structure
- Create an in-memory data store using a simple object or array
- Use the `req` and `res` objects to handle requests and responses
- Implement validation for required fields

<details>
<summary>View Solution</summary>

```tsx
// pages/api/items/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'

interface Item {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

// In-memory data store
let items: Item[] = [
  {
    id: '1',
    title: 'First Item',
    description: 'This is the first item',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        // Get all items
        res.status(200).json(items)
        break
        
      case 'POST':
        // Create a new item
        const { title, description } = req.body
        
        // Validation
        if (!title || !description) {
          return res.status(400).json({ 
            error: 'Title and description are required' 
          })
        }
        
        const newItem: Item = {
          id: Date.now().toString(),
          title,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        items.push(newItem)
        res.status(201).json(newItem)
        break
        
      default:
        // Method not allowed
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
```

```tsx
// pages/api/items/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'

interface Item {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

// In-memory data store (in a real app, this would be a database)
let items: Item[] = [
  {
    id: '1',
    title: 'First Item',
    description: 'This is the first item',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  
  try {
    switch (req.method) {
      case 'GET':
        // Get a specific item
        const item = items.find(item => item.id === id)
        
        if (!item) {
          return res.status(404).json({ error: 'Item not found' })
        }
        
        res.status(200).json(item)
        break
        
      case 'PUT':
        // Update an existing item
        const { title, description } = req.body
        
        // Validation
        if (!title && !description) {
          return res.status(400).json({ 
            error: 'At least title or description must be provided' 
          })
        }
        
        const itemIndex = items.findIndex(item => item.id === id)
        
        if (itemIndex === -1) {
          return res.status(404).json({ error: 'Item not found' })
        }
        
        // Update the item
        items[itemIndex] = {
          ...items[itemIndex],
          title: title || items[itemIndex].title,
          description: description || items[itemIndex].description,
          updatedAt: new Date().toISOString()
        }
        
        res.status(200).json(items[itemIndex])
        break
        
      case 'DELETE':
        // Delete an item
        const deleteIndex = items.findIndex(item => item.id === id)
        
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'Item not found' })
        }
        
        items.splice(deleteIndex, 1)
        res.status(204).end() // No content
        break
        
      default:
        // Method not allowed
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
```

```tsx
// components/ItemForm.tsx
'use client'

import { useState } from 'react'

interface ItemFormProps {
  initialData?: { title: string; description: string }
  onSubmit: (data: { title: string; description: string }) => void
  isEditing?: boolean
}

export default function ItemForm({ initialData, onSubmit, isEditing = false }: ItemFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await onSubmit({ title, description })
      
      if (!isEditing) {
        // Reset form if creating a new item
        setTitle('')
        setDescription('')
      }
    } catch (err) {
      setError('Failed to save item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      
      <div>
        <label className="block text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          rows={4}
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : isEditing ? 'Update Item' : 'Create Item'}
      </button>
    </form>
  )
}
```

```tsx
// pages/index.tsx
'use client'

import { useState, useEffect } from 'react'
import ItemForm from '../components/ItemForm'

interface Item {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch items on component mount
  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }

  const createItem = async (data: { title: string; description: string }) => {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to create item')
    }

    const newItem = await response.json()
    setItems([...items, newItem])
  }

  const updateItem = async (id: string, data: { title: string; description: string }) => {
    const response = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to update item')
    }

    const updatedItem = await response.json()
    setItems(items.map(item => item.id === id ? updatedItem : item))
    setEditingItem(null)
  }

  const deleteItem = async (id: string) => {
    const response = await fetch(`/api/items/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete item')
    }

    setItems(items.filter(item => item.id !== id))
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  const handleSubmit = async (data: { title: string; description: string }) => {
    if (editingItem) {
      await updateItem(editingItem.id, data)
    } else {
      await createItem(data)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Item Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Item' : 'Create New Item'}
          </h2>
          <ItemForm
            initialData={editingItem ? {
              title: editingItem.title,
              description: editingItem.description
            } : undefined}
            onSubmit={handleSubmit}
            isEditing={!!editingItem}
          />
          {editingItem && (
            <button
              onClick={handleCancelEdit}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel Edit
            </button>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">No items yet. Create your first item!</p>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <h3 className="font-medium text-lg">{item.title}</h3>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

</details>

## Exercise 2: Authentication API

Create an authentication system with API routes for user registration, login, and protected routes.

### Requirements

1. Create API routes for:
   - `POST /api/auth/register` - Register a new user
   - `POST /api/auth/login` - Log in a user
   - `GET /api/auth/me` - Get current user info
   - `POST /api/auth/logout` - Log out a user

2. Implement JWT (JSON Web Tokens) for authentication

3. Create a middleware to protect certain routes

4. Store user data in memory (no database needed for this exercise)

5. Implement password hashing

### Hints

- Use the `jsonwebtoken` package for JWT
- Use `bcryptjs` for password hashing
- Store JWT tokens in HTTP-only cookies
- Create a middleware function to check authentication

<details>
<summary>View Solution</summary>

```tsx
// lib/auth.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}
```

```tsx
// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { hashPassword } from '../../../lib/auth'

interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

// In-memory user store
let users: User[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, name } = req.body

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      })
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      })
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

```tsx
// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyPassword, generateToken } from '../../../lib/auth'

interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

// In-memory user store (same as in register)
let users: User[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      })
    }

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken(user.id)

    // Set HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }; SameSite=strict`
    )

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    res.status(200).json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

```tsx
// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../../lib/auth'

interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

// In-memory user store
let users: User[] = []

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get token from cookies
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Find user
    const user = users.find(u => u.id === decoded.userId)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    res.status(200).json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

```tsx
// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Clear the token cookie
  res.setHeader(
    'Set-Cookie',
    'token=; HttpOnly; Path=/; Max-Age=0; SameSite=strict'
  )

  res.status(200).json({ message: 'Logged out successfully' })
}
```

```tsx
// pages/api/protected.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '../../lib/auth'

interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

// In-memory user store
let users: User[] = []

// Middleware to check authentication
function withAuth(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get token from cookies
      const token = req.cookies.token

      if (!token) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      // Verify token
      const decoded = verifyToken(token)
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      // Find user
      const user = users.find(u => u.id === decoded.userId)
      if (!user) {
        return res.status(401).json({ error: 'User not found' })
      }

      // Add user to request object
      req.user = user

      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

// Protected handler
async function protectedHandler(req: NextApiRequest & { user: any }, res: NextApiResponse) {
  // This is a protected route
  const { password: _, ...userWithoutPassword } = req.user
  
  res.status(200).json({
    message: 'This is protected data',
    user: userWithoutPassword,
    secretData: 'You can only see this if you are authenticated'
  })
}

export default withAuth(protectedHandler)
```

```tsx
// components/AuthForm.tsx
'use client'

import { useState } from 'react'

interface AuthFormProps {
  mode: 'login' | 'register'
  onSubmit: (data: { email: string; password: string; name?: string }) => void
  loading?: boolean
  error?: string
}

export default function AuthForm({ mode, onSubmit, loading = false, error }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = mode === 'register' 
      ? { email, password, name } 
      : { email, password }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      
      {mode === 'register' && (
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
      )}
      
      <div>
        <label className="block text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  )
}
```

```tsx
// pages/auth.tsx
'use client'

import { useState, useEffect } from 'react'
import AuthForm from '../components/AuthForm'
import { useRouter } from 'next/router'

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (data: { email: string; password: string; name?: string }) => {
    setLoading(true)
    setError('')
    
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed')
      }
      
      if (mode === 'login') {
        // Redirect to dashboard on successful login
        router.push('/dashboard')
      } else {
        // Switch to login mode after successful registration
        setMode('login')
        setError('Registration successful! Please login.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Login' : 'Register'}
      </h1>
      
      <AuthForm
        mode={mode}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
      
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
          }}
          className="text-blue-500 hover:underline"
        >
          {mode === 'login'
            ? "Don't have an account? Register"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
}
```

```tsx
// pages/dashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
    fetchProtectedData()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Redirect to login if not authenticated
        router.push('/auth')
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const fetchProtectedData = async () => {
    try {
      const response = await fetch('/api/protected')
      if (response.ok) {
        const data = await response.json()
        setProtectedData(data)
      }
    } catch (error) {
      console.error('Failed to fetch protected data:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
      
      {protectedData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Protected Data</h2>
          <p><strong>Message:</strong> {protectedData.message}</p>
          <p><strong>Secret Data:</strong> {protectedData.secretData}</p>
        </div>
      )}
    </div>
  )
}
```

</details>

## Exercise 3: File Upload API

Create an API route that handles file uploads with validation and processing.

### Requirements

1. Create an API route at `POST /api/upload` that:
   - Accepts file uploads
   - Validates file type and size
   - Saves files to the public directory
   - Returns file information

2. Implement the following validations:
   - Only allow image files (jpg, png, gif)
   - Maximum file size of 5MB
   - Generate unique filenames to prevent conflicts

3. Create a frontend component that:
   - Allows users to select and upload files
   - Shows upload progress
   - Displays uploaded images

### Hints

- Use the `multer` package for handling file uploads
- Use the `fs` module to save files
- Create a public uploads directory
- Use FormData on the frontend to send files

<details>
<summary>View Solution</summary>

```tsx
// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface FileData {
  filename: string
  originalName: string
  size: number
  mimetype: string
  url: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Parse form data
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: function ({ mimetype }) {
        // Only allow image files
        return mimetype && mimetype.includes('image/')
      },
      filename: function (name, ext, part) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        return `${part.originalName}-${uniqueSuffix}${ext}`
      }
    })

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err)
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size too large (max 5MB)' })
        }
        return res.status(500).json({ error: 'Failed to process upload' })
      }

      const file = files.file?.[0]
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      // Check if file is an image
      if (!file.mimetype || !file.mimetype.includes('image/')) {
        // Delete the uploaded file if it's not an image
        fs.unlinkSync(file.filepath)
        return res.status(400).json({ error: 'Only image files are allowed' })
      }

      // Prepare file data
      const fileData: FileData = {
        filename: file.newFilename || file.originalFilename || 'unknown',
        originalName: file.originalFilename || 'unknown',
        size: file.size,
        mimetype: file.mimetype || 'unknown',
        url: `/uploads/${file.newFilename || file.originalFilename}`
      }

      res.status(200).json({ file: fileData })
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

```tsx
// pages/api/uploads.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

interface FileData {
  filename: string
  originalName: string
  size: number
  mimetype: string
  url: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json({ files: [] })
    }

    // Get all files in uploads directory
    const files = fs.readdirSync(uploadsDir)
    
    const fileList: FileData[] = files.map(filename => {
      const filePath = path.join(uploadsDir, filename)
      const stats = fs.statSync(filePath)
      
      return {
        filename,
        originalName: filename.split('-').slice(0, -1).join('-'), // Remove unique suffix
        size: stats.size,
        mimetype: 'image/*', // We don't store mimetypes, so we'll assume they're images
        url: `/uploads/${filename}`
      }
    })

    res.status(200).json({ files: fileList })
  } catch (error) {
    console.error('Error fetching uploads:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

```tsx
// components/FileUpload.tsx
'use client'

import { useState, useRef } from 'react'

interface UploadedFile {
  filename: string
  originalName: string
  size: number
  mimetype: string
  url: string
}

interface FileUploadProps {
  onUploadComplete: (file: UploadedFile) => void
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.includes('image/')) {
      setError('Only image files are allowed')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setError('')
    setUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          setProgress(Math.round(percentComplete))
        }
      })

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          onUploadComplete(response.file)
        } else {
          setError('Upload failed')
        }
        setUploading(false)
        setProgress(0)
      })

      // Handle errors
      xhr.addEventListener('error', () => {
        setError('Upload failed')
        setUploading(false)
        setProgress(0)
      })

      // Open and send request
      xhr.open('POST', '/api/upload')
      xhr.send(formData)
    } catch (err) {
      setError('Upload failed')
      setUploading(false)
      setProgress(0)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {uploading ? (
        <div>
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Uploading... {progress}%</p>
          </div>
        </div>
      ) : (
        <div>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <button
              onClick={handleFileSelect}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Select Image
            </button>
            <p className="mt-2 text-sm text-gray-600">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  )
}
```

```tsx
// components/ImageGallery.tsx
'use client'

import { useState, useEffect } from 'react'

interface UploadedFile {
  filename: string
  originalName: string
  size: number
  mimetype: string
  url: string
}

export default function ImageGallery() {
  const [images, setImages] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/uploads')
      if (response.ok) {
        const data = await response.json()
        setImages(data.files)
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewImage = (newImage: UploadedFile) => {
    setImages([newImage, ...images])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (loading) {
    return <div className="text-center py-8">Loading images...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Image Gallery</h2>
      
      {images.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No images uploaded yet. Upload your first image!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.filename} className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={image.url}
                  alt={image.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="font-medium truncate" title={image.originalName}>
                  {image.originalName}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(image.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

```tsx
// pages/upload.tsx
'use client'

import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import ImageGallery from '../components/ImageGallery'

interface UploadedFile {
  filename: string
  originalName: string
  size: number
  mimetype: string
  url: string
}

export default function UploadPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadComplete = (file: UploadedFile) => {
    // Refresh the gallery to show the new image
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">File Upload</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>
        
        <div>
          <ImageGallery key={refreshKey} />
        </div>
      </div>
    </div>
  )
}
```

</details>

## Exercise 4: API with External Service

Create an API route that integrates with an external service (e.g., weather API, payment gateway, etc.).

### Requirements

1. Create an API route that:
   - Fetches data from an external API
   - Handles errors and rate limiting
   - Caches responses to improve performance
   - Transforms data as needed

2. Implement the following features:
   - Error handling for network failures
   - Request validation
   - Response caching with TTL (time to live)
   - Rate limiting to prevent abuse

3. Choose one of these external services:
   - Weather API (e.g., OpenWeatherMap)
   - Currency conversion API
   - Random quote/fact API
   - Any other public API of your choice

### Hints

- Use a simple in-memory cache for this exercise
- Implement rate limiting using a timestamp-based approach
- Use try-catch blocks for error handling
- Use the built-in `fetch` API to make requests

<details>
<summary>View Solution</summary>

```tsx
// pages/api/weather.ts
import type { NextApiRequest, NextApiResponse } from 'next'

// Simple in-memory cache
interface CacheEntry {
  data: any
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

// Simple rate limiter
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimit = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per minute

// Weather API key (in a real app, this would be in environment variables)
const WEATHER_API_KEY = 'your-api-key-here'
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'

// Helper function to check cache
function getCachedData(key: string): any | null {
  const entry = cache.get(key)
  if (!entry) return null
  
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  
  return entry.data
}

// Helper function to set cache
function setCachedData(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

// Helper function to check rate limit
function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(identifier)
  
  if (!entry) {
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return true
  }
  
  if (now > entry.resetTime) {
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return true
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  entry.count++
  return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { city } = req.query
    
    // Validate input
    if (!city || typeof city !== 'string') {
      return res.status(400).json({ error: 'City parameter is required' })
    }
    
    // Get client identifier for rate limiting
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    const identifier = Array.isArray(clientIp) ? clientIp[0] : clientIp
    
    // Check rate limit
    if (!checkRateLimit(identifier)) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimit.get(identifier)?.resetTime || 0) - Date.now()) / 1000
      })
    }
    
    // Check cache
    const cacheKey = `weather-${city.toLowerCase()}`
    const cachedData = getCachedData(cacheKey)
    
    if (cachedData) {
      return res.status(200).json({
        ...cachedData,
        cached: true
      })
    }
    
    // Fetch data from external API
    const apiUrl = `${WEATHER_API_URL}?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'City not found' })
      }
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Transform data
    const transformedData = {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      feelsLike: Math.round(data.main.feels_like)
    }
    
    // Cache the response
    setCachedData(cacheKey, transformedData)
    
    res.status(200).json({
      ...transformedData,
      cached: false
    })
    
  } catch (error) {
    console.error('Weather API error:', error)
    res.status(500).json({ error: 'Failed to fetch weather data' })
  }
}
```

```tsx
// components/WeatherForm.tsx
'use client'

import { useState } from 'react'

interface WeatherFormProps {
  onSubmit: (city: string) => void
  loading?: boolean
}

export default function WeatherForm({ onSubmit, loading = false }: WeatherFormProps) {
  const [city, setCity] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      onSubmit(city.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        className="flex-1 px-3 py-2 border border-gray-300 rounded"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !city.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Get Weather'}
      </button>
    </form>
  )
}
```

```tsx
// components/WeatherDisplay.tsx
'use client'

import { useEffect } from 'react'

interface WeatherData {
  city: string
  country: string
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  pressure: number
  feelsLike: number
  cached?: boolean
}

interface WeatherDisplayProps {
  weatherData: WeatherData | null
  error?: string
  loading?: boolean
}

export default function WeatherDisplay({ weatherData, error, loading }: WeatherDisplayProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Fetching weather data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center">
        <p className="text-gray-500">Enter a city name to see the weather</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {weatherData.cached && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded text-sm">
          Data from cache
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">
            {weatherData.city}, {weatherData.country}
          </h2>
          <p className="text-gray-600 capitalize">{weatherData.description}</p>
        </div>
        
        <div className="text-center">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
            alt={weatherData.description}
            className="mx-auto"
          />
          <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
          <p className="text-sm text-gray-500">Feels like {weatherData.feelsLike}°C</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-blue-600 font-medium">Humidity</p>
          <p className="text-xl">{weatherData.humidity}%</p>
        </div>
        
        <div className="bg-green-50 p-3 rounded">
          <p className="text-green-600 font-medium">Wind Speed</p>
          <p className="text-xl">{weatherData.windSpeed} m/s</p>
        </div>
        
        <div className="bg-purple-50 p-3 rounded">
          <p className="text-purple-600 font-medium">Pressure</p>
          <p className="text-xl">{weatherData.pressure} hPa</p>
        </div>
      </div>
    </div>
  )
}
```

```tsx
// pages/weather.tsx
'use client'

import { useState } from 'react'
import WeatherForm from '../components/WeatherForm'
import WeatherDisplay from '../components/WeatherDisplay'

interface WeatherData {
  city: string
  country: string
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  pressure: number
  feelsLike: number
  cached?: boolean
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (city: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch weather data')
      }
      
      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Weather App</h1>
      
      <div className="mb-8">
        <WeatherForm onSubmit={fetchWeather} loading={loading} />
      </div>
      
      <WeatherDisplay
        weatherData={weatherData}
        error={error}
        loading={loading}
      />
    </div>
  )
}
```

</details>

## Additional Challenges

1. **API Versioning**: Implement versioning for your API routes (e.g., `/api/v1/items`).

2. **API Documentation**: Create API documentation using Swagger/OpenAPI.

3. **API Testing**: Write tests for your API routes using Jest and Supertest.

4. **Database Integration**: Replace the in-memory storage with a real database (MongoDB, PostgreSQL, etc.).

5. **API Security**: Implement additional security measures like CORS, rate limiting, and input sanitization.

## Summary

These exercises cover the main concepts of building API routes in Next.js:

1. **Basic CRUD Operations**: Creating, reading, updating, and deleting resources
2. **Authentication**: Implementing user authentication with JWT
3. **File Handling**: Processing and storing file uploads
4. **External API Integration**: Working with third-party services

API routes in Next.js provide a powerful way to build full-stack applications without needing a separate backend server.