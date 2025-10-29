import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Next.js Routing Examples
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore the different routing capabilities of Next.js, including static routes, dynamic routes, and nested layouts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            Static Routes
          </h2>
          <p className="mb-4">
            Fixed routes that match specific paths in your application.
          </p>
          <Link 
            href="/about" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            About Page
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Dynamic Routes
          </h2>
          <p className="mb-4">
            Routes that accept parameters, allowing you to create dynamic pages.
          </p>
          <Link 
            href="/products/1" 
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            View Product
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">
            Nested Routes
          </h2>
          <p className="mb-4">
            Routes with their own layouts and shared UI components.
          </p>
          <Link 
            href="/blog/getting-started-with-nextjs" 
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Blog Post
          </Link>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Route Examples
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Products</h3>
            <ul className="space-y-1">
              <li><Link href="/products" className="text-blue-600 hover:underline">Products List</Link></li>
              <li><Link href="/products/1" className="text-blue-600 hover:underline">Product ID: 1</Link></li>
              <li><Link href="/products/2" className="text-blue-600 hover:underline">Product ID: 2</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Blog</h3>
            <ul className="space-y-1">
              <li><Link href="/blog" className="text-blue-600 hover:underline">Blog List</Link></li>
              <li><Link href="/blog/getting-started-with-nextjs" className="text-blue-600 hover:underline">Getting Started</Link></li>
              <li><Link href="/blog/understanding-react-components" className="text-blue-600 hover:underline">React Components</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Key Concepts
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>File-based routing system</li>
          <li>Dynamic routes with parameters</li>
          <li>Nested layouts and routes</li>
          <li>Client-side navigation with Link component</li>
          <li>Route parameters and query strings</li>
          <li>Active state management in navigation</li>
        </ul>
      </div>
    </div>
  )
}