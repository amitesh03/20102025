# Advanced E-commerce Project

This project demonstrates advanced Next.js concepts by building a full-featured e-commerce platform with product catalog, shopping cart, checkout process, and admin dashboard.

## Features

- Product catalog with filtering and search
- Shopping cart with persistent state
- Checkout process with payment integration
- User authentication and authorization
- Admin dashboard for product management
- Order management and tracking
- Product reviews and ratings
- Wishlist functionality
- SEO optimization for product pages
- Performance optimization with image optimization
- Server-side rendering and static generation

## Learning Objectives

After completing this project, you'll understand:

- How to build complex e-commerce applications
- How to implement secure payment processing
- How to optimize performance for large catalogs
- How to implement advanced SEO techniques
- How to handle complex state management
- How to create admin interfaces
- How to implement search and filtering
- How to optimize images and media

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
04-projects/03-advanced-ecommerce/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (shop)/
│   │   ├── products/
│   │   │   └── [slug]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── wishlist/
│   ├── (admin)/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   └── customers/
│   ├── api/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── payments/
│   ├── components/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── admin/
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── WishlistContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useWishlist.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── payments.ts
│   │   ├── products.ts
│   │   └── utils.ts
│   └── globals.css
├── components/
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── ProductGallery.tsx
│   │   └── ProductReviews.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CheckoutForm.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── admin/
│       ├── ProductForm.tsx
│       ├── OrderList.tsx
│       └── CustomerList.tsx
├── lib/
│   ├── auth.ts
│   ├── payments.ts
│   ├── products.ts
│   ├── orders.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

## Key Concepts Demonstrated

### 1. Product Catalog with Filtering

Advanced product catalog with search and filtering:

```typescript
// app/(shop)/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '../../../components/product/ProductCard'
import { Product, FilterOptions } from '../../../lib/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({})
  const searchParams = useSearchParams()

  useEffect(() => {
    const category = searchParams.get('category')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const sort = searchParams.get('sort')

    const filterOptions: FilterOptions = {
      category: category || undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      sort: sort || 'name-asc'
    }

    setFilters(filterOptions)
    fetchProducts(filterOptions).then(setProducts).finally(() => setLoading(false))
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4">
          <ProductFilters filters={filters} />
        </aside>
        
        <main className="lg:w-3/4">
          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
```

### 2. Shopping Cart with Persistent State

Shopping cart with localStorage persistence:

```typescript
// context/CartContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: string
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
    setLoading(false)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, loading])

  const addItem = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevItems, { id: product.id, product, quantity }]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
```

### 3. Checkout with Payment Integration

Secure checkout process with payment integration:

```typescript
// app/(shop)/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../../context/CartContext'
import CheckoutForm from '../../../components/checkout/CheckoutForm'
import OrderSummary from '../../../components/checkout/OrderSummary'

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review
  const router = useRouter()
  const { items, clearCart } = useCart()

  const handlePlaceOrder = async (paymentData: PaymentData) => {
    setLoading(true)
    setError('')

    try {
      // Create order
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: paymentData.shippingAddress,
        paymentMethod: paymentData.paymentMethod,
        total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      const order = await response.json()

      // Process payment
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethodId: paymentData.paymentMethodId,
          amount: order.total
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('Payment failed')
      }

      // Clear cart and redirect to order confirmation
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm
            step={step}
            setStep={setStep}
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
            error={error}
          />
        </div>
        
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
```

### 4. SEO Optimization for Product Pages

Advanced SEO implementation for product pages:

```typescript
// app/(shop)/products/[slug]/page.tsx
import { getProduct, getProductReviews } from '../../../../lib/products'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Breadcrumb from '../../../../components/layout/Breadcrumb'
import ProductDetails from '../../../../components/product/ProductDetails'
import ProductReviews from '../../../../components/product/ProductReviews'
import { generateProductSchema } from '../../../../lib/seo'

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: product.name,
    description: product.description,
    keywords: product.tags.join(', '),
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'product',
      images: product.images.map(image => ({
        url: image.url,
        width: image.width,
        height: image.height,
        alt: product.name,
      })),
      brand: product.brand,
      availability: product.inStock ? 'in stock' : 'out of stock',
      condition: 'new',
      price: {
        currency: 'USD',
        amount: product.price,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images.map(image => image.url),
    },
    alternates: {
      canonical: `/products/${params.slug}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)
  const reviews = await getProductReviews(params.slug)

  if (!product) {
    notFound()
  }

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.category, url: `/products?category=${product.category}` },
    { name: product.name, url: `/products/${params.slug}` },
  ]

  const productSchema = generateProductSchema(product, reviews)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div>
            <ProductGallery images={product.images} />
          </div>
          
          <div>
            <ProductDetails product={product} />
          </div>
        </div>
        
        <div className="mt-16">
          <ProductReviews reviews={reviews} productId={product.id} />
        </div>
      </div>
    </>
  )
}
```

### 5. Admin Dashboard for Product Management

Admin interface for managing products:

```typescript
// app/(admin)/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProductForm from '../../../../components/admin/ProductForm'
import ProductList from '../../../../components/admin/ProductList'
import { Product } from '../../../../lib/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProducts().then(setProducts).finally(() => setLoading(false))
  }, [])

  const handleCreateProduct = async (productData: Partial<Product>) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      const newProduct = await response.json()
      setProducts([...products, newProduct])
      setShowForm(false)
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleUpdateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      const updatedProduct = await response.json()
      setProducts(products.map(p => p.id === id ? updatedProduct : p))
      setEditingProduct(null)
      setShowForm(false)
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ProductForm
            product={editingProduct}
            onSubmit={editingProduct 
              ? (data) => handleUpdateProduct(editingProduct.id, data)
              : handleCreateProduct
            }
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ProductList
          products={products}
          onEdit={(product) => {
            setEditingProduct(product)
            setShowForm(true)
          }}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  )
}
```

## Performance Optimizations

1. **Image Optimization**:
   - Using Next.js Image component with proper sizing
   - Implementing lazy loading for product images
   - Creating responsive image variants

2. **Code Splitting**:
   - Dynamic imports for large components
   - Route-based code splitting
   - Vendor chunking for third-party libraries

3. **Caching Strategy**:
   - ISR (Incremental Static Regeneration) for product pages
   - Client-side caching with SWR
   - CDN integration for static assets

4. **Bundle Optimization**:
   - Tree shaking for unused code
   - Minification and compression
   - Priority hints for critical resources

## Next Steps

1. Implement advanced search with Elasticsearch
2. Add product recommendations engine
3. Implement multi-vendor support
4. Add internationalization and localization
5. Create mobile app with React Native
6. Implement analytics and reporting
7. Add subscription-based products
8. Create customer support chat system

## Technologies Used

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Stripe for payments
- PostgreSQL with Prisma ORM
- Redis for caching
- Elasticsearch for search
- AWS S3 for image storage
- SendGrid for emails