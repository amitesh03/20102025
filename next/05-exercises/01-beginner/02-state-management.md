# State Management Exercises

These exercises will help you practice state management concepts in Next.js applications. We'll cover local component state, Context API, and Zustand for global state management.

## Exercise 1: Local State with useState

Create a simple to-do list application that uses only local state.

### Requirements

1. Create a component that allows users to:
   - Add new to-do items
   - Mark items as complete
   - Delete items
   - Filter items (all, active, completed)

2. Use only the `useState` hook for state management

3. Include the following features:
   - Input field for new to-do items
   - List of to-do items with checkboxes
   - Delete buttons for each item
   - Filter buttons to show all, active, or completed items

### Hints

- You'll need multiple state variables: one for the list of items and one for the current filter
- Each to-do item should have an id, text, and completed status
- Use array methods like `filter` and `map` to render and filter the list

<details>
<summary>View Solution</summary>

```tsx
'use client'

import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

type Filter = 'all' | 'active' | 'completed'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false
        }
      ])
      setInputValue('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      
      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new to-do"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-r"
        >
          Add
        </button>
      </div>

      <div className="flex mb-4 space-x-2">
        {(['all', 'active', 'completed'] as Filter[]).map(filterOption => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-3 py-1 rounded ${
              filter === filterOption
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filteredTodos.map(todo => (
          <li key={todo.id} className="flex items-center p-2 border rounded">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

</details>

## Exercise 2: Context API for Global State

Create a user authentication system using React Context API.

### Requirements

1. Create an `AuthContext` that manages:
   - User login state (logged in or not)
   - Current user information (name, email)
   - Login and logout functions

2. Create components that:
   - Display login form when user is not authenticated
   - Display user profile when authenticated
   - Allow users to log in and log out

3. Use the Context API to share authentication state across components

### Hints

- Create a context with `createContext`
- Create a provider component that wraps your app
- Use `useContext` hook to access the context value
- Store user data in the context state

<details>
<summary>View Solution</summary>

```tsx
// app/context/AuthContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, password: string) => {
    // Simple mock authentication
    if (email === 'user@example.com' && password === 'password') {
      setUser({
        name: 'John Doe',
        email: 'user@example.com'
      })
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

```tsx
// app/components/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(email, password)
    if (!success) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
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
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      
      <p className="mt-4 text-sm text-gray-600">
        Hint: Use user@example.com / password
      </p>
    </div>
  )
}
```

```tsx
// app/components/UserProfile.tsx
'use client'

import { useAuth } from '../context/AuthContext'

export default function UserProfile() {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      
      <div className="mb-4">
        <p className="mb-2"><strong>Name:</strong> {user?.name}</p>
        <p className="mb-4"><strong>Email:</strong> {user?.email}</p>
      </div>
      
      <button
        onClick={logout}
        className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  )
}
```

```tsx
// app/page.tsx
'use client'

import { useAuth } from './context/AuthContext'
import LoginForm from './components/LoginForm'
import UserProfile from './components/UserProfile'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Authentication Example</h1>
        
        {isAuthenticated ? <UserProfile /> : <LoginForm />}
      </div>
    </main>
  )
}
```

</details>

## Exercise 3: Zustand for Complex State

Create a shopping cart application using Zustand for state management.

### Requirements

1. Create a Zustand store that manages:
   - List of products
   - Shopping cart items
   - Cart total
   - Functions to add, remove, and update cart items

2. Create components that:
   - Display a list of available products
   - Show the shopping cart with items and total
   - Allow users to add products to cart
   - Allow users to update quantities or remove items

3. Use Zustand for all state management

### Hints

- Define interfaces for your data structures
- Create separate stores or a single store with multiple slices
- Use Zustand's `create` function to make your store
- Implement cart operations like add, remove, and update quantity

<details>
<summary>View Solution</summary>

```tsx
// lib/store.ts
import { create } from 'zustand'

interface Product {
  id: number
  name: string
  price: number
  category: string
}

interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  products: Product[]
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartItemCount: number
}

export const useCartStore = create<CartStore>((set, get) => ({
  products: [
    { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
    { id: 2, name: 'Headphones', price: 99, category: 'Electronics' },
    { id: 3, name: 'T-Shirt', price: 19, category: 'Clothing' },
    { id: 4, name: 'Book', price: 15, category: 'Books' },
    { id: 5, name: 'Coffee Mug', price: 8, category: 'Kitchen' }
  ],
  cartItems: [],
  
  addToCart: (product) => {
    const { cartItems } = get()
    const existingItem = cartItems.find(item => item.product.id === product.id)
    
    if (existingItem) {
      set({
        cartItems: cartItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      })
    } else {
      set({ cartItems: [...cartItems, { product, quantity: 1 }] })
    }
  },
  
  removeFromCart: (productId) => {
    set({ cartItems: get().cartItems.filter(item => item.product.id !== productId) })
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
    } else {
      set({
        cartItems: get().cartItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      })
    }
  },
  
  clearCart: () => {
    set({ cartItems: [] })
  },
  
  get cartTotal() {
    return get().cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  },
  
  get cartItemCount() {
    return get().cartItems.reduce((count, item) => count + item.quantity, 0)
  }
}))
```

```tsx
// app/components/ProductList.tsx
'use client'

import { useCartStore } from '../../lib/store'

export default function ProductList() {
  const products = useCartStore(state => state.products)
  const addToCart = useCartStore(state => state.addToCart)

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="p-4 border rounded-lg">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-gray-600 mb-2">${product.price}</p>
            <p className="text-sm text-gray-500 mb-3">{product.category}</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

```tsx
// app/components/ShoppingCart.tsx
'use client'

import { useCartStore } from '../../lib/store'

export default function ShoppingCart() {
  const cartItems = useCartStore(state => state.cartItems)
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const clearCart = useCartStore(state => state.clearCart)
  const cartTotal = useCartStore(state => state.cartTotal)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Shopping Cart</h2>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Clear Cart
          </button>
        )}
      </div>
      
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div>
          <div className="space-y-3 mb-4">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex items-center p-3 border rounded">
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-gray-600">${item.product.price}</p>
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded"
                  >
                    +
                  </button>
                </div>
                
                <div className="ml-4 text-right">
                  <p className="font-medium">${item.product.price * item.quantity}</p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

```tsx
// app/page.tsx
'use client'

import ProductList from './components/ProductList'
import ShoppingCart from './components/ShoppingCart'
import { useCartStore } from '../lib/store'

export default function Home() {
  const cartItemCount = useCartStore(state => state.cartItemCount)

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart Example</h1>
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProductList />
          </div>
          <div>
            <ShoppingCart />
          </div>
        </div>
      </div>
    </main>
  )
}
```

</details>

## Exercise 4: Combining State Management Techniques

Create a task management application that combines different state management techniques.

### Requirements

1. Use `useState` for:
   - Form inputs for creating new tasks
   - UI state (e.g., which task is being edited)

2. Use Context API for:
   - User authentication state
   - Current filter/view settings

3. Use Zustand for:
   - Task data (list of tasks)
   - Task operations (add, edit, delete, toggle complete)

4. Features to implement:
   - Create, read, update, and delete tasks
   - Mark tasks as complete/incomplete
   - Filter tasks by status (all, active, completed)
   - Assign tasks to users
   - Due dates for tasks

### Hints

- Think carefully about which state management technique is best for each type of state
- Local state for form inputs and temporary UI state
- Context for state that needs to be accessed by many components
- Zustand for complex data that requires business logic

<details>
<summary>View Solution</summary>

This is a complex exercise that combines all the techniques. The solution would be quite lengthy, but here's an outline of how to structure it:

1. Create a Zustand store for task management
2. Create a Context for authentication and filter settings
3. Use useState in components for form inputs and UI state
4. Build components that use all three techniques appropriately

The key is to understand when to use each technique:
- useState: Simple, component-specific state
- Context: Global state that doesn't change frequently
- Zustand: Complex state with business logic

</details>

## Additional Challenges

1. **Persist State**: Add localStorage persistence to any of the exercises to save state between page refreshes.

2. **Optimistic Updates**: Implement optimistic updates in the shopping cart or task management app for better UX.

3. **State Validation**: Add form validation to the authentication or task creation forms.

4. **State Reset**: Implement a way to reset the application state to its initial values.

5. **State Debugging**: Add Redux DevTools integration to your Zustand store for better debugging.

## Summary

These exercises cover the main state management techniques used in Next.js applications:

1. **Local State with useState**: Best for simple, component-specific state
2. **Context API**: Good for global state that doesn't change frequently
3. **Zustand**: Excellent for complex state with business logic

Understanding when to use each technique is key to building maintainable Next.js applications.