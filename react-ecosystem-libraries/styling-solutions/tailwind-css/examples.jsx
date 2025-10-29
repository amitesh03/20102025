import React, { useState } from 'react';

// Tailwind CSS Examples Component
const TailwindCSSExamples = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [gridColumns, setGridColumns] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const colors = ['blue', 'red', 'green', 'purple', 'yellow', 'pink', 'indigo', 'gray'];
  const tailwindColors = {
    blue: ['bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900'],
    red: ['bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900'],
    green: ['bg-green-50', 'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900'],
    purple: ['bg-purple-50', 'bg-purple-100', 'bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'bg-purple-900'],
    yellow: ['bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700', 'bg-yellow-800', 'bg-yellow-900'],
    pink: ['bg-pink-50', 'bg-pink-100', 'bg-pink-200', 'bg-pink-300', 'bg-pink-400', 'bg-pink-500', 'bg-pink-600', 'bg-pink-700', 'bg-pink-800', 'bg-pink-900'],
    indigo: ['bg-indigo-50', 'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-300', 'bg-indigo-400', 'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700', 'bg-indigo-800', 'bg-indigo-900'],
    gray: ['bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900']
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Header with Navigation */}
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Tailwind CSS Examples</h1>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
              <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                <li><a href="#layout" className="block py-2 text-white hover:text-blue-200 transition-colors">Layout</a></li>
                <li><a href="#typography" className="block py-2 text-white hover:text-blue-200 transition-colors">Typography</a></li>
                <li><a href="#colors" className="block py-2 text-white hover:text-blue-200 transition-colors">Colors</a></li>
                <li><a href="#components" className="block py-2 text-white hover:text-blue-200 transition-colors">Components</a></li>
                <li><a href="#animations" className="block py-2 text-white hover:text-blue-200 transition-colors">Animations</a></li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-12">
          {/* Layout Examples */}
          <section id="layout" className="space-y-6">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2">Layout Examples</h2>
            
            {/* Flexbox Examples */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Flexbox Layout</h3>
              
              <div className="space-y-4">
                {/* Basic Flex */}
                <div className="flex space-x-4">
                  <div className="flex-1 bg-blue-500 text-white p-4 rounded">Flex 1</div>
                  <div className="flex-2 bg-blue-600 text-white p-4 rounded">Flex 2</div>
                  <div className="flex-1 bg-blue-500 text-white p-4 rounded">Flex 1</div>
                </div>

                {/* Flex Direction */}
                <div className="flex flex-col space-y-2">
                  <div className="bg-green-500 text-white p-4 rounded">Column Item 1</div>
                  <div className="bg-green-600 text-white p-4 rounded">Column Item 2</div>
                  <div className="bg-green-500 text-white p-4 rounded">Column Item 3</div>
                </div>

                {/* Justify and Align */}
                <div className="flex justify-between items-center bg-purple-100 dark:bg-purple-900 p-4 rounded">
                  <div className="bg-purple-500 text-white px-4 py-2 rounded">Start</div>
                  <div className="bg-purple-600 text-white px-4 py-2 rounded">Center</div>
                  <div className="bg-purple-500 text-white px-4 py-2 rounded">End</div>
                </div>

                {/* Flex Wrap */}
                <div className="flex flex-wrap gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-indigo-500 text-white px-4 py-2 rounded">
                      Item {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid Examples */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Grid Layout</h3>
              
              <div className="space-y-4">
                {/* Basic Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-red-500 text-white p-4 rounded text-center">
                      Grid {i + 1}
                    </div>
                  ))}
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-yellow-500 text-white p-4 rounded text-center">
                      Responsive {i + 1}
                    </div>
                  ))}
                </div>

                {/* Grid with Span */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-2 bg-pink-500 text-white p-4 rounded">Span 2</div>
                  <div className="bg-pink-600 text-white p-4 rounded">Span 1</div>
                  <div className="bg-pink-500 text-white p-4 rounded">Span 1</div>
                  <div className="col-span-4 bg-pink-700 text-white p-4 rounded">Span 4</div>
                </div>

                {/* Dynamic Grid */}
                <div>
                  <label className="block text-sm font-medium mb-2">Grid Columns: {gridColumns}</label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={gridColumns}
                    onChange={(e) => setGridColumns(parseInt(e.target.value))}
                    className="w-full mb-4"
                  />
                  <div className={`grid grid-cols-${gridColumns} gap-2`}>
                    {[...Array(gridColumns * 2)].map((_, i) => (
                      <div key={i} className="bg-teal-500 text-white p-3 rounded text-center text-sm">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Container and Spacing */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Container & Spacing</h3>
              
              <div className="space-y-4">
                {/* Container */}
                <div className="container mx-auto bg-orange-100 dark:bg-orange-900 p-4 rounded">
                  <p className="text-center">Container with max-width and centered</p>
                </div>

                {/* Padding and Margin */}
                <div className="space-y-2">
                  <div className="bg-cyan-100 dark:bg-cyan-900 p-2 m-2 rounded">p-2 m-2</div>
                  <div className="bg-cyan-200 dark:bg-cyan-800 p-4 m-4 rounded">p-4 m-4</div>
                  <div className="bg-cyan-300 dark:bg-cyan-700 p-6 m-6 rounded">p-6 m-6</div>
                </div>

                {/* Space Between */}
                <div className="space-y-2">
                  <div className="bg-lime-500 text-white p-3 rounded">Item 1</div>
                  <div className="bg-lime-600 text-white p-3 rounded">Item 2</div>
                  <div className="bg-lime-500 text-white p-3 rounded">Item 3</div>
                </div>
              </div>
            </div>
          </section>

          {/* Typography Examples */}
          <section id="typography" className="space-y-6">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2">Typography Examples</h2>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-4">
              {/* Font Sizes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Font Sizes</h3>
                <p className="text-xs">Extra Small text (text-xs)</p>
                <p className="text-sm">Small text (text-sm)</p>
                <p className="text-base">Base text (text-base)</p>
                <p className="text-lg">Large text (text-lg)</p>
                <p className="text-xl">Extra Large text (text-xl)</p>
                <p className="text-2xl">2XL text (text-2xl)</p>
                <p className="text-3xl">3XL text (text-3xl)</p>
                <p className="text-4xl">4XL text (text-4xl)</p>
                <p className="text-5xl">5XL text (text-5xl)</p>
                <p className="text-6xl">6XL text (text-6xl)</p>
              </div>

              {/* Font Weights */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Font Weights</h3>
                <p className="font-thin">Thin (font-thin)</p>
                <p className="font-extralight">Extra Light (font-extralight)</p>
                <p className="font-light">Light (font-light)</p>
                <p className="font-normal">Normal (font-normal)</p>
                <p className="font-medium">Medium (font-medium)</p>
                <p className="font-semibold">Semibold (font-semibold)</p>
                <p className="font-bold">Bold (font-bold)</p>
                <p className="font-extrabold">Extra Bold (font-extrabold)</p>
                <p className="font-black">Black (font-black)</p>
              </div>

              {/* Text Alignment */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Text Alignment</h3>
                <p className="text-left bg-gray-200 dark:bg-gray-700 p-2 rounded mb-2">Left aligned text</p>
                <p className="text-center bg-gray-200 dark:bg-gray-700 p-2 rounded mb-2">Center aligned text</p>
                <p className="text-right bg-gray-200 dark:bg-gray-700 p-2 rounded mb-2">Right aligned text</p>
                <p className="text-justify bg-gray-200 dark:bg-gray-700 p-2 rounded">Justified text that spans multiple lines to demonstrate the justify alignment property</p>
              </div>

              {/* Text Decoration */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Text Decoration</h3>
                <p className="underline">Underlined text</p>
                <p className="line-through">Line through text</p>
                <p className="overline">Overline text</p>
                <p className="no-underline">No underline (even on links)</p>
              </div>

              {/* Text Transform */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Text Transform</h3>
                <p className="uppercase">Uppercase text</p>
                <p className="lowercase">LOWERCASE TEXT</p>
                <p className="capitalize">capitalize text</p>
                <p className="normal-case">Normal case text</p>
              </div>

              {/* Line Height */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Line Height</h3>
                <p className="leading-none">Leading none - Tight line height for compact text</p>
                <p className="leading-tight">Leading tight - Slightly tighter than normal</p>
                <p className="leading-snug">Leading snug - Comfortable but compact</p>
                <p className="leading-normal">Leading normal - Default line height</p>
                <p className="leading-relaxed">Leading relaxed - More space between lines</p>
                <p className="leading-loose">Leading loose - Maximum space between lines</p>
              </div>
            </div>
          </section>

          {/* Color Examples */}
          <section id="colors" className="space-y-6">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2">Color Examples</h2>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-6">
              {/* Color Palette Selector */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Color Palette</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded capitalize ${
                        selectedColor === color
                          ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-800'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                
                {/* Color Shades */}
                <div className="grid grid-cols-5 gap-2">
                  {tailwindColors[selectedColor].map((colorClass, index) => (
                    <div key={index} className={`${colorClass} p-4 rounded text-center text-sm font-medium`}>
                      {index * 100}
                    </div>
                  ))}
                </div>
              </div>

              {/* Background Colors */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Background Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-red-500 p-4 rounded text-white">bg-red-500</div>
                  <div className="bg-blue-500 p-4 rounded text-white">bg-blue-500</div>
                  <div className="bg-green-500 p-4 rounded text-white">bg-green-500</div>
                  <div className="bg-yellow-500 p-4 rounded text-white">bg-yellow-500</div>
                  <div className="bg-purple-500 p-4 rounded text-white">bg-purple-500</div>
                  <div className="bg-pink-500 p-4 rounded text-white">bg-pink-500</div>
                  <div className="bg-indigo-500 p-4 rounded text-white">bg-indigo-500</div>
                  <div className="bg-gray-500 p-4 rounded text-white">bg-gray-500</div>
                </div>
              </div>

              {/* Text Colors */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Text Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <span className="text-red-500">text-red-500</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <span className="text-blue-500">text-blue-500</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <span className="text-green-500">text-green-500</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <span className="text-yellow-500">text-yellow-500</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <span className="text-purple-500">text-purple-500</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <span className="text-pink-500">text-pink-500</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <span className="text-indigo-500">text-indigo-500</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <span className="text-gray-500">text-gray-500</span>
                  </div>
                </div>
              </div>

              {/* Opacity */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Opacity</h3>
                <div className="space-y-2">
                  <div className="bg-blue-500 bg-opacity-100 p-4 rounded text-white">bg-opacity-100</div>
                  <div className="bg-blue-500 bg-opacity-75 p-4 rounded text-white">bg-opacity-75</div>
                  <div className="bg-blue-500 bg-opacity-50 p-4 rounded text-white">bg-opacity-50</div>
                  <div className="bg-blue-500 bg-opacity-25 p-4 rounded text-white">bg-opacity-25</div>
                  <div className="bg-blue-500 bg-opacity-10 p-4 rounded text-white">bg-opacity-10</div>
                </div>
              </div>

              {/* Gradients */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Gradients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-600 p-4 rounded text-white">
                    bg-gradient-to-r from-purple-400 to-pink-600
                  </div>
                  <div className="bg-gradient-to-l from-green-400 to-blue-600 p-4 rounded text-white">
                    bg-gradient-to-l from-green-400 to-blue-600
                  </div>
                  <div className="bg-gradient-to-t from-red-400 to-yellow-400 p-4 rounded text-white">
                    bg-gradient-to-t from-red-400 to-yellow-400
                  </div>
                  <div className="bg-gradient-to-b from-indigo-400 to-purple-600 p-4 rounded text-white">
                    bg-gradient-to-b from-indigo-400 to-purple-600
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Component Examples */}
          <section id="components" className="space-y-6">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2">Component Examples</h2>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-6">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Primary Button
                  </button>
                  <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    Outline Button
                  </button>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                    Secondary Button
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                    Danger Button
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                    Success Button
                  </button>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full">
                    Rounded Button
                  </button>
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg">
                    Shadow Button
                  </button>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105">
                    Animated Button
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <img className="w-full" src="https://picsum.photos/seed/card1/400/200.jpg" alt="Card image" />
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">Card Title</div>
                      <p className="text-gray-700 dark:text-gray-300 text-base">
                        This is a simple card component with image, title, and description.
                      </p>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                      <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2">#photography</span>
                      <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2">#travel</span>
                      <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2">#winter</span>
                    </div>
                  </div>

                  <div className="max-w-sm rounded-lg shadow-xl bg-white dark:bg-gray-800">
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">Dark Card</div>
                      <p className="text-gray-700 dark:text-gray-300 text-base">
                        Card with dark mode support and different styling.
                      </p>
                    </div>
                    <div className="px-6 py-4">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Action</button>
                      <button className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded">Cancel</button>
                    </div>
                  </div>

                  <div className="max-w-sm rounded overflow-hidden shadow-lg border-l-4 border-blue-500">
                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">Bordered Card</div>
                      <p className="text-gray-700 dark:text-gray-300 text-base">
                        Card with left border accent and hover effects.
                      </p>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full mr-4" src="https://picsum.photos/seed/avatar1/100/100.jpg" alt="Avatar" />
                        <div className="text-sm">
                          <p className="text-gray-900 dark:text-white leading-none">John Doe</p>
                          <p className="text-gray-600 dark:text-gray-400">Developer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forms */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Form Elements</h3>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                        Name
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="message">
                        Message
                      </label>
                      <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                        id="message"
                        rows="4"
                        placeholder="Enter your message"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="select">
                        Select Option
                      </label>
                      <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                        id="select"
                      >
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        className="mr-2 leading-tight"
                        type="checkbox"
                        id="checkbox"
                      />
                      <label className="text-gray-700 dark:text-gray-300 text-sm" htmlFor="checkbox">
                        I agree to the terms and conditions
                      </label>
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="text-gray-700 dark:text-gray-300 text-sm">
                        <input className="mr-2" type="radio" name="radio" />
                        Option A
                      </label>
                      <label className="text-gray-700 dark:text-gray-300 text-sm">
                        <input className="mr-2" type="radio" name="radio" />
                        Option B
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                      >
                        Sign In
                      </button>
                      <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Forgot Password?
                      </a>
                    </div>
                  </form>
                </div>
              </div>

              {/* Alerts */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Alerts</h3>
                <div className="space-y-4">
                  <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
                    <p className="font-bold">Info Alert</p>
                    <p>This is an informational alert message.</p>
                  </div>

                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
                    <p className="font-bold">Success Alert</p>
                    <p>Your changes have been saved successfully!</p>
                  </div>

                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <p className="font-bold">Warning Alert</p>
                    <p>Please review your input before submitting.</p>
                  </div>

                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">Error Alert</p>
                    <p>There was an error processing your request.</p>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Default</span>
                  <span className="bg-red-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Red</span>
                  <span className="bg-yellow-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Yellow</span>
                  <span className="bg-green-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Green</span>
                  <span className="bg-blue-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Blue</span>
                  <span className="bg-indigo-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Indigo</span>
                  <span className="bg-purple-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Purple</span>
                  <span className="bg-pink-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Pink</span>
                </div>
              </div>
            </div>
          </section>

          {/* Animation Examples */}
          <section id="animations" className="space-y-6">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2">Animation Examples</h2>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-6">
              {/* Transitions */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Transitions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                    Color Transition
                  </button>
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 transform hover:scale-110">
                    Scale Transition
                  </button>
                  <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-lg">
                    Lift Transition
                  </button>
                </div>
              </div>

              {/* Hover Effects */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Hover Effects</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="group bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h4 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">Hover Title</h4>
                    <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                      Content that changes on hover
                    </p>
                  </div>

                  <div className="relative overflow-hidden bg-gradient-to-r from-purple-400 to-pink-400 p-6 rounded-lg">
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <h4 className="text-lg font-semibold text-white relative z-10">Overlay Effect</h4>
                    <p className="text-white relative z-10">Dark overlay on hover</p>
                  </div>

                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border-2 border-transparent hover:border-blue-500 transition-colors duration-300">
                    <h4 className="text-lg font-semibold">Border Effect</h4>
                    <p>Border appears on hover</p>
                  </div>
                </div>
              </div>

              {/* Loading States */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Loading States</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-center items-center p-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                  <div className="flex justify-center items-center p-6">
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-12 w-12 rounded"></div>
                  </div>
                  <div className="flex justify-center items-center p-6">
                    <div className="animate-bounce bg-blue-500 h-12 w-12 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Keyframe Animations */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Keyframe Animations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-center items-center p-6">
                    <div className="w-16 h-16 bg-blue-500 rounded animate-ping"></div>
                  </div>
                  <div className="flex justify-center items-center p-6">
                    <div className="w-16 h-16 bg-green-500 rounded animate-spin"></div>
                  </div>
                  <div className="flex justify-center items-center p-6">
                    <div className="w-16 h-16 bg-purple-500 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Responsive Design Examples */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2">Responsive Design Examples</h2>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Responsive Grid</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gradient-to-r from-blue-400 to-purple-500 p-4 rounded text-white text-center">
                    <div className="text-xs sm:text-sm md:text-base lg:text-lg">
                      Responsive {i + 1}
                    </div>
                    <div className="text-xs mt-2">
                      <span className="sm:hidden">Mobile</span>
                      <span className="hidden sm:inline md:hidden">Tablet</span>
                      <span className="hidden md:inline lg:hidden">Desktop</span>
                      <span className="hidden lg:inline">Large</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Utility Examples */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2">Utility Examples</h2>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-6">
              {/* Position */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Position</h3>
                <div className="relative h-32 bg-gray-200 dark:bg-gray-700 rounded">
                  <div className="absolute top-0 left-0 bg-red-500 text-white p-2 rounded">Top Left</div>
                  <div className="absolute top-0 right-0 bg-blue-500 text-white p-2 rounded">Top Right</div>
                  <div className="absolute bottom-0 left-0 bg-green-500 text-white p-2 rounded">Bottom Left</div>
                  <div className="absolute bottom-0 right-0 bg-yellow-500 text-white p-2 rounded">Bottom Right</div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white p-2 rounded">Center</div>
                </div>
              </div>

              {/* Z-Index */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Z-Index</h3>
                <div className="relative h-32">
                  <div className="absolute inset-0 bg-red-200 rounded z-10">z-10</div>
                  <div className="absolute inset-4 bg-blue-200 rounded z-20">z-20</div>
                  <div className="absolute inset-8 bg-green-200 rounded z-30">z-30</div>
                </div>
              </div>

              {/* Overflow */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Overflow</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-24 overflow-auto bg-gray-200 dark:bg-gray-700 p-2 rounded">
                    <p>Scrollable content with overflow-auto. This content is long enough to trigger scrolling.</p>
                    <p>More content to demonstrate scrolling behavior.</p>
                  </div>
                  <div className="h-24 overflow-hidden bg-gray-200 dark:bg-gray-700 p-2 rounded">
                    <p>Hidden overflow with overflow-hidden. Content that extends beyond the container is clipped.</p>
                  </div>
                  <div className="h-24 overflow-visible bg-gray-200 dark:bg-gray-700 p-2 rounded">
                    <div className="w-32 h-32 bg-blue-500 text-white p-2 rounded">Visible overflow</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-gray-400">Comprehensive Tailwind CSS examples demonstrating various utility classes and components.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#layout" className="text-gray-400 hover:text-white transition-colors">Layout</a></li>
                  <li><a href="#typography" className="text-gray-400 hover:text-white transition-colors">Typography</a></li>
                  <li><a href="#colors" className="text-gray-400 hover:text-white transition-colors">Colors</a></li>
                  <li><a href="#components" className="text-gray-400 hover:text-white transition-colors">Components</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Components</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Templates</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tools</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-400">Learn more about Tailwind CSS and build amazing interfaces.</p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-400">&copy; 2024 Tailwind CSS Examples. Built with Tailwind CSS.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TailwindCSSExamples;