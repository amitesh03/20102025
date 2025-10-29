# State Management in Next.js

This example demonstrates various state management techniques in Next.js applications, from local component state to global state management solutions.

## Learning Objectives

After completing this example, you'll understand:

- How to use React hooks for local state management
- How to implement Context API for global state
- How to use state management libraries like Zustand
- How to manage server state vs. client state
- Best practices for state management in Next.js

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## State Management Techniques

### 1. Local Component State with useState

The most basic form of state management in React is using the `useState` hook for local component state:

```typescript
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

**When to use:**
- Simple UI state that only affects a single component
- Form inputs and their values
- Toggle states (e.g., showing/hiding elements)

### 2. Context API for Global State

Context API allows you to share state between components without prop drilling:

```typescript
// app/context/ThemeContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

**When to use:**
- Theme settings (light/dark mode)
- User authentication status
- Settings that need to be accessed across the app
- Avoiding prop drilling for deeply nested components

### 3. Zustand for Complex State Management

Zustand is a lightweight state management library that provides a simple API for managing global state:

```typescript
// lib/store.ts
import { create } from 'zustand'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  total: number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item) => {
    const { items } = get()
    const existingItem = items.find(i => i.id === item.id)
    
    if (existingItem) {
      set({
        items: items.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      })
    } else {
      set({ items: [...items, { ...item, quantity: 1 }] })
    }
  },
  
  removeItem: (id) => {
    set({ items: get().items.filter(item => item.id !== id) })
  },
  
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id)
    } else {
      set({
        items: get().items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      })
    }
  },
  
  clearCart: () => {
    set({ items: [] })
  },
  
  get total() {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}))
```

**When to use:**
- Shopping carts
- Complex forms with multiple fields
- State that needs to be shared across many components
- State that requires complex logic and computations

### 4. Server State vs. Client State

Understanding the difference between server state and client state is crucial in Next.js:

#### Server State
- Data fetched from an API
- Managed by data fetching libraries (SWR, React Query)
- Cached and synchronized with the server
- Examples: blog posts, user profiles, product data

#### Client State
- UI state that lives only in the browser
- Managed by state management solutions
- Not persisted on the server
- Examples: form inputs, UI preferences, current page

```typescript
// Example of managing both server and client state
'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { useCartStore } from '../lib/store'

export default function ProductPage({ productId }: { productId: string }) {
  // Server state - fetched from API
  const { data: product, error } = useSWR(`/api/products/${productId}`)
  
  // Client state - UI preferences
  const [selectedSize, setSelectedSize] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  
  // Global client state - shopping cart
  const { addItem } = useCartStore()
  
  if (error) return <div>Failed to load product</div>
  if (!product) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      
      <div>
        <label>Select Size:</label>
        <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
          <option value="">Select a size</option>
          {product.sizes.map((size: string) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      
      <button
        onClick={() => addItem({
          id: product.id,
          name: product.name,
          price: product.price
        })}
        disabled={!selectedSize}
      >
        Add to Cart
      </button>
      
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide' : 'Show'} Details
      </button>
      
      {showDetails && (
        <div>
          <h3>Product Details</h3>
          <p>{product.description}</p>
        </div>
      )}
    </div>
  )
}
```

## Best Practices

1. **Keep state close to where it's needed**
   - Don't lift state up more than necessary
   - Use local state for component-specific data

2. **Separate server state from client state**
   - Use data fetching libraries for server state
   - Use state management libraries for client state

3. **Normalize complex state**
   - Avoid deeply nested state structures
   - Use normalized data patterns for complex data

4. **Use derived state instead of redundant state**
   - Compute values from existing state when possible
   - Avoid storing derived values in state

5. **Optimize re-renders**
   - Use React.memo for expensive components
   - Split state to avoid unnecessary re-renders

## Common Patterns

### 1. Form State Management

```typescript
'use client'

import { useState } from 'react'

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const setError = (name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  const validate = (rules: Record<keyof T, (value: any) => string | null>) => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    
    Object.entries(rules).forEach(([key, rule]) => {
      const error = rule(values[key])
      if (error) {
        newErrors[key as keyof T] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const submit = async (onSubmit: (values: T) => Promise<void>) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    validate,
    submit
  }
}
```

### 2. Async State Management

```typescript
'use client'

import { useState, useEffect } from 'react'

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    let isMounted = true
    
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await asyncFn()
        if (isMounted) setData(result)
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    
    run()
    
    return () => {
      isMounted = false
    }
  }, dependencies)
  
  return { data, loading, error }
}
```

## Next Steps

- Explore more advanced state management with Redux Toolkit
- Learn about state persistence with localStorage
- Implement optimistic updates for better UX
- Study state management patterns for large applications