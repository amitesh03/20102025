# Next.js Fundamentals Exercises

These exercises will help you practice the fundamental concepts of Next.js.

## Exercise 1: Create a Basic Next.js App

Create a new Next.js application with the following requirements:

1. Set up a new Next.js project with TypeScript
2. Create a home page with a welcome message
3. Add an about page with information about yourself
4. Create navigation between the two pages
5. Style the pages with Tailwind CSS

### Hints

- Use `npx create-next-app@latest` to create a new project
- Create pages in the `app/` directory
- Use the `Link` component for navigation
- Add classes to your HTML elements for styling

### Solution

<details>
<summary>Click to see solution</summary>

Create a new Next.js project:

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint
```

Create an about page at `app/about/page.tsx`:

```typescript
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Me</h1>
      <p className="text-gray-700">
        I am a web developer learning Next.js. This is my about page.
      </p>
    </div>
  )
}
```

Update the home page at `app/page.tsx`:

```typescript
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to My Next.js App</h1>
      <p className="text-gray-700 mb-4">
        This is a basic Next.js application.
      </p>
      <Link href="/about" className="bg-blue-500 text-white px-4 py-2 rounded">
        About Me
      </Link>
    </div>
  )
}
```

</details>

---

## Exercise 2: Create a Layout Component

Create a reusable layout component that includes:

1. A header with navigation
2. A footer with copyright information
3. A main content area
4. Apply the layout to all pages

### Hints

- Create a layout component in the `app/layout.tsx` file
- Use the `children` prop to render page content
- Use semantic HTML elements like `<header>`, `<main>`, and `<footer>`

### Solution

<details>
<summary>Click to see solution</summary>

Update `app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'A basic Next.js application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-blue-600 text-white p-4">
            <nav className="container mx-auto flex justify-between">
              <h1 className="text-xl font-bold">My App</h1>
              <div className="space-x-4">
                <Link href="/" className="hover:text-blue-200">Home</Link>
                <Link href="/about" className="hover:text-blue-200">About</Link>
              </div>
            </nav>
          </header>
          
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          
          <footer className="bg-gray-800 text-white p-4 text-center">
            <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
```

</details>

---

## Exercise 3: Create a Contact Form

Create a contact form with the following fields:

1. Name (text input)
2. Email (email input)
3. Message (textarea)
4. Submit button
5. Form validation
6. Success message after submission

### Hints

- Create a new page at `app/contact/page.tsx`
- Use React hooks for form state management
- Add validation for required fields
- Show a success message after form submission

### Solution

<details>
<summary>Click to see solution</summary>

Create `app/contact/page.tsx`:

```typescript
'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Here you would normally send the data to a server
      console.log('Form submitted:', formData)
      setSubmitted(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      
      {submitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Thank you for your message! We'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  )
}
```

Add a link to the contact page in the navigation:

```typescript
<Link href="/contact" className="hover:text-blue-">Contact</Link>
```

</details>

---

## Exercise 4: Create a Product Listing Page

Create a product listing page with the following features:

1. Display a list of products with name, price, and image
2. Add a search bar to filter products
3. Add a sort dropdown to sort by price (low to high, high to low)
4. Display the number of products found
5. Add a "No products found" message when search returns no results

### Hints

- Create product data in a separate file
- Use React state for search term and sort order
- Filter and sort products based on user input
- Use placeholder images from a service like picsum.photos

### Solution

<details>
<summary>Click to see solution</summary>

Create `lib/products.ts`:

```typescript
export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
}

export const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics', image: 'https://picsum.photos/seed/laptop/640/480.jpg' },
  { id: 2, name: 'Headphones', price: 199, category: 'Electronics', image: 'https://picsum.photos/seed/headphones/640/640.jpg' },
  { id: 3, name: 'Coffee Maker', price: 79, category: 'Appliances', image: 'https://picsum.photos/seed/coffee/640/480.jpg' },
  { id: 4, name: 'Desk Chair', price: 299, category: 'Furniture', image: 'https://picsum.photos/seed/chair/640/640.jpg' },
  { id: 5, name: 'Smartphone', price: 699, category: 'Electronics', image: 'https://picsum.photos/seed/phone/640/640.jpg' },
  { id: 6, name: 'Table Lamp', price: 49, category: 'Furniture', image: 'https://picsum.photos/seed/lamp/640/640.jpg' },
]
```

Create `app/products/page.tsx`:

```typescript
'use client'

import { useState, useMemo } from 'react'
import { products, Product } from '../../../lib/products'
import Image from 'next/image'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('default')

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortOrder === 'price-low-high') {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortOrder === 'price-high-low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [searchTerm, sortOrder])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Sort by</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      <p className="mb-4 text-gray-600">
        {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
      </p>
      
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={640}
                  height={480}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.category}</p>
                <p className="text-xl font-bold text-blue-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

</details>

---

## Exercise 5: Create a 404 Page

Create a custom 404 page with the following features:

1. A friendly "Page not found" message
2. A brief explanation
3. A link back to the home page
4. Some creative styling

### Hints

- Create a file at `app/not-found.tsx`
- This file will automatically be used for any non-existent routes
- Make the page helpful and visually appealing

### Solution

<details>
<summary>Click to see solution</summary>

Create `app/not-found.tsx`:

```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}
```

</details>

---

## Additional Challenges

1. Add a dark mode toggle to your application
2. Create an animation for the page transitions
3. Add a loading state for async operations
4. Implement a simple accordion component
5. Create a modal dialog component

These exercises will help you practice the fundamental concepts of Next.js and prepare you for more advanced topics.