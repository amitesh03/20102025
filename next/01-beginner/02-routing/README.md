# Next.js Routing

This example covers the routing system in Next.js, including dynamic routes, nested routes, and navigation.

## Learning Objectives

- Understand Next.js file-based routing system
- Create dynamic routes with parameters
- Implement nested routes and layouts
- Use navigation components for client-side navigation
- Handle route parameters and query strings

## Project Structure

```
02-routing/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── products/
│   │   ├── page.tsx            # Products listing page
│   │   ├── [id]/
│   │   │   └── page.tsx        # Dynamic product detail page
│   │   └── layout.tsx          # Products section layout
│   ├── blog/
│   │   ├── page.tsx            # Blog listing page
│   │   ├── [slug]/
│   │   │   └── page.tsx        # Dynamic blog post page
│   │   └── layout.tsx          # Blog section layout
│   ├── search/
│   │   └── page.tsx            # Search page with query params
│   └── components/
│       ├── Navigation.tsx      # Navigation component
│       └── ProductCard.tsx     # Product card component
├── data/
│   ├── products.json           # Sample products data
│   └── posts.json              # Sample blog posts data
└── README.md
```

## Key Concepts

### 1. File-Based Routing

Next.js uses a file-based routing system where folders are used to create routes. Each folder contains a `page.tsx` file that defines the route's UI.

### 2. Dynamic Routes

Dynamic routes are created by wrapping a file or folder name in square brackets:
- `app/products/[id]/page.tsx` creates a route like `/products/1`, `/products/2`, etc.
- `app/blog/[slug]/page.tsx` creates a route like `/blog/my-first-post`

### 3. Route Parameters

Route parameters are accessed through the `params` prop in page components:
```tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return <div>Product ID: {params.id}</div>
}
```

### 4. Layouts

Layouts are shared UI that preserve state and remain interactive during navigation. Each route segment can have its own layout.

### 5. Navigation

Next.js provides the `Link` component for client-side navigation between routes.

## Running This Example

1. Navigate to this directory
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open http://localhost:3000 in your browser

## Code Examples

### Dynamic Route (app/products/[id]/page.tsx)

```tsx
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  // Fetch product data based on ID
  const res = await fetch(`https://api.example.com/products/${id}`)
  if (!res.ok) return null
  return res.json()
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  
  if (!product) {
    notFound()
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  )
}
```

### Navigation Component (app/components/Navigation.tsx)

```tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav>
      <ul>
        <li>
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/products" className={pathname.startsWith('/products') ? 'active' : ''}>
            Products
          </Link>
        </li>
        <li>
          <Link href="/blog" className={pathname.startsWith('/blog') ? 'active' : ''}>
            Blog
          </Link>
        </li>
      </ul>
    </nav>
  )
}
```

## Exercises

1. Create a new "Users" section with:
   - A users listing page at `/users`
   - Dynamic user profile pages at `/users/[id]`
   - A nested route for user settings at `/users/[id]/settings`

2. Implement a search feature that:
   - Accepts query parameters in the URL (e.g., `/search?q=nextjs`)
   - Displays search results based on the query
   - Updates the URL when the search form is submitted

3. Create a catch-all route for a "Docs" section:
   - Create a route that matches any path under `/docs/[...slug]`
   - Display the path segments in the UI

4. Add active state styling to the navigation component:
   - Highlight the current page in the navigation
   - Also highlight parent sections when viewing nested pages

5. Create a "Not Found" page:
   - Add a custom 404 page at `/not-found`
   - Test it by navigating to non-existent routes

## Next Steps

After completing this example, proceed to the data fetching example to learn how to fetch data in Next.js applications.