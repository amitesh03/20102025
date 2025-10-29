import Counter from './components/Counter'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Next.js Fundamentals
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          This example demonstrates the basic concepts of Next.js, including the App Router,
          server and client components, and fundamental routing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            Server Components
          </h2>
          <p className="mb-4">
            Server components run on the server and have no client-side JavaScript. They can
            directly access data sources and are great for static content.
          </p>
          <p className="text-gray-600">
            This page is a server component that renders on the server and is sent as HTML
            to the browser.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Client Components
          </h2>
          <p className="mb-4">
            Client components run on the client and can use state, effects, and browser APIs.
            They are marked with the "use client" directive.
          </p>
          <p className="text-gray-600">
            The counter below is a client component with interactive state management.
          </p>
        </div>
      </div>

      <Counter />

      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Key Concepts Covered
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>App Router file-based routing system</li>
          <li>Root layout that wraps all pages</li>
          <li>Server components for static content</li>
          <li>Client components for interactivity</li>
          <li>Tailwind CSS for styling</li>
          <li>TypeScript for type safety</li>
        </ul>
      </div>
    </div>
  )
}