import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Next.js Data Fetching Examples
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore different data fetching patterns in Next.js, including server-side rendering, static generation, and client-side fetching.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            Server-Side Fetching
          </h2>
          <p className="mb-4">
            Fetch data on the server using async components.
          </p>
          <Link 
            href="/server"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            View Example
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Client-Side Fetching
          </h2>
          <p className="mb-4">
            Fetch data on the client using useEffect and state.
          </p>
          <Link 
            href="/client"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            View Example
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">
            Static Generation
          </h2>
          <p className="mb-4">
            Generate static content at build time.
          </p>
          <Link 
            href="/static"
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            View Example
          </Link>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">
          Key Concepts
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Server components for server-side data fetching</li>
          <li>Client components for client-side data fetching</li>
          <li>Static site generation with caching</li>
          <li>Loading and error states</li>
          <li>Data revalidation strategies</li>
        </ul>
      </div>
    </div>
  )
}