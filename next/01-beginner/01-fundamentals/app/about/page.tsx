export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          About Next.js Fundamentals
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn the core concepts of Next.js through practical examples.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          What is Next.js?
        </h2>
        <p className="mb-4">
          Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.
        </p>
        <p className="text-gray-600">
          It provides a structured approach to developing React applications with features like server-side rendering, static site generation, file-based routing, and more.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>App Router - A new routing system with layouts, nested routes, and loading states</li>
          <li>Server Components - Components that run on the server for better performance</li>
          <li>Client Components - Components with interactivity and state management</li>
          <li>File-based Routing - Automatic route creation based on file structure</li>
          <li>API Routes - Build backend APIs directly in your Next.js app</li>
          <li>Optimized Images - Built-in image optimization with the Image component</li>
          <li>Font Optimization - Automatic font optimization with next/font</li>
          <li>Built-in CSS Support - Support for CSS Modules, Tailwind CSS, and more</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Learning Path
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Beginner</h3>
            <p className="text-gray-600">Start with the basics: components, routing, and data fetching</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">Intermediate</h3>
            <p className="text-gray-600">Explore advanced patterns: API routes, authentication, and database integration</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800">Advanced</h3>
            <p className="text-gray-600">Master optimization: performance, SEO, and deployment strategies</p>
          </div>
        </div>
      </div>
    </div>
  )
}