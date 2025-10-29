'use client'

import { useTheme } from '../context/ThemeContext'

export default function ThemeToggleExample() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Global State with Context API</h2>
      
      <div className="space-y-6">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 className="text-lg font-medium mb-2">Theme Toggle</h3>
          <p className="mb-4">
            Current theme: <span className="font-bold">{theme}</span>
          </p>
          <button
            onClick={toggleTheme}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 className="text-lg font-medium mb-2">Theme Preview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white border border-gray-600' 
                : 'bg-white text-gray-900 border border-gray-300'
            }`}>
              <h4 className="font-medium mb-2">Card Example</h4>
              <p className="text-sm">
                This is how a card looks in {theme} mode.
              </p>
              <button className={`mt-2 px-3 py-1 rounded text-sm ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}>
                Action Button
              </button>
            </div>
            
            <div className={`p-4 rounded ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white border border-gray-600' 
                : 'bg-white text-gray-900 border border-gray-300'
            }`}>
              <h4 className="font-medium mb-2">Form Example</h4>
              <input
                type="text"
                placeholder="Type something..."
                className={`w-full px-3 py-2 rounded border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded">
          <h3 className="text-lg font-medium mb-2">How Context API Works</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>The theme state is stored in a React Context</li>
            <li>Any component can access the theme using the useTheme hook</li>
            <li>When the theme changes, all components using the context re-render</li>
            <li>The theme preference is saved to localStorage</li>
            <li>The theme is applied to the document element for global styling</li>
          </ul>
        </div>
      </div>
    </div>
  )
}