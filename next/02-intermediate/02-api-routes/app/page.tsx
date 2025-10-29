'use client'

import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
      
      const data = await res.json()
      setResponse(data.message)
    } catch (error) {
      setResponse('Error: Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Next.js API Routes Example</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Try the API</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <input
                type="text"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a message"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          
          {response && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Response:</h3>
              <p className="text-gray-900">{response}</p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Endpoints</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700">GET /api/hello</h3>
              <p className="text-gray-600">Returns a simple greeting message</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">POST /api/hello</h3>
              <p className="text-gray-600">Accepts a message and returns a personalized response</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">GET /api/users</h3>
              <p className="text-gray-600">Returns a list of users</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">GET /api/users/[id]</h3>
              <p className="text-gray-600">Returns a specific user by ID</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}