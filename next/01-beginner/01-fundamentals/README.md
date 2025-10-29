# Next.js Fundamentals

This example covers the basic concepts of Next.js, including components, pages, layouts, and the App Router.

## Learning Objectives

- Understand the Next.js App Router structure
- Learn about layouts and pages
- Create basic React components
- Understand the difference between server and client components

## Project Structure

```
01-fundamentals/
├── app/
│   ├── globals.css
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── about/
│   │   └── page.tsx        # About page
│   ├── components/
│   │   ├── Header.tsx      # Header component
│   │   ├── Footer.tsx      # Footer component
│   │   └── Counter.tsx     # Interactive component
│   └── loading.tsx         # Loading state
├── package.json
└── README.md
```

## Key Concepts

### 1. App Router

Next.js 13+ introduced the App Router, which uses a file-based routing system with layouts, nested routes, and loading states.

### 2. Server Components vs Client Components

- **Server Components**: Run on the server, can directly access data sources, and have no client-side JavaScript
- **Client Components**: Run on the client, marked with `"use client"` directive, can use state and effects

### 3. Layouts

Layouts are shared UI that preserve state and remain interactive during navigation.

## Running This Example

1. Navigate to this directory
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open http://localhost:3000 in your browser

## Code Explanation

### Root Layout (app/layout.tsx)

The root layout wraps every page in your application:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### Page Component (app/page.tsx)

Pages are UI that are unique to a route:

```tsx
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Next.js Fundamentals</h1>
      <p>This is the home page of our application.</p>
    </div>
  );
}
```

### Client Component (app/components/Counter.tsx)

Client components use the `"use client"` directive:

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## Exercises

1. Create a new "Contact" page at `/contact`
2. Add a navigation component that highlights the current page
3. Create a client component with a form that captures user input
4. Add a loading state that shows while pages are loading
5. Experiment with server vs client components by moving components between them

## Next Steps

After completing this example, proceed to the routing example to learn more about Next.js routing capabilities.