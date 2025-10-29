import React, { useState } from 'react';

// Windi CSS Examples - Educational Examples for Windi CSS
// Note: Windi CSS is a next-generation utility-first CSS framework

export default function WindiCSSExamples() {
  const [activeExample, setActiveExample] = useState('basics');

  return (
    <div className="examples-container">
      <h1>Windi CSS Examples</h1>
      <p className="intro">
        Windi CSS is a next-generation utility-first CSS framework that is highly performant and fully compatible with Tailwind CSS. It provides on-demand utilities and is highly customizable.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('basics')} className={activeExample === 'basics' ? 'active' : ''}>
          Basics
        </button>
        <button onClick={() => setActiveExample('layout')} className={activeExample === 'layout' ? 'active' : ''}>
          Layout
        </button>
        <button onClick={() => setActiveExample('typography')} className={activeExample === 'typography' ? 'active' : ''}>
          Typography
        </button>
        <button onClick={() => setActiveExample('colors')} className={activeExample === 'colors' ? 'active' : ''}>
          Colors
        </button>
        <button onClick={() => setActiveExample('animations')} className={activeExample === 'animations' ? 'active' : ''}>
          Animations
        </button>
        <button onClick={() => setActiveExample('customization')} className={activeExample === 'customization' ? 'active' : ''}>
          Customization
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'basics' && <BasicsExample />}
        {activeExample === 'layout' && <LayoutExample />}
        {activeExample === 'typography' && <TypographyExample />}
        {activeExample === 'colors' && <ColorsExample />}
        {activeExample === 'animations' && <AnimationsExample />}
        {activeExample === 'customization' && <CustomizationExample />}
      </div>
    </div>
  );
}

// Basics Example
function BasicsExample() {
  return (
    <div className="example-section">
      <h2>Windi CSS Basics</h2>
      <p>Getting started with Windi CSS utility classes.</p>
      
      <div className="code-block">
        <h3>Installation</h3>
        <pre>
{`# Install Windi CSS
npm install -D windicss

# Install with Vite
npm install -D vite-plugin-windicss windicss

# Install with Nuxt
npm install -D @nuxtjs/windicss

# Install with Next.js
npm install -D next-windicss`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Configuration</h3>
        <pre>
{`// windi.config.js
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  shortcuts: {
    'btn': 'px-4 py-2 rounded font-medium transition-colors',
    'btn-primary': 'btn bg-primary text-white hover:bg-blue-600',
  },
  plugins: [
    require('windicss/plugin/forms'),
    require('windicss/plugin/typography'),
  ],
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Basic Usage</h3>
        <pre>
{`// HTML/JSX
<div className="flex items-center justify-center p-4">
  <h1 className="text-2xl font-bold text-primary">Hello Windi CSS</h1>
</div>

<button className="btn btn-primary">
  Click me
</button>

<div className="grid grid-cols-3 gap-4">
  <div className="bg-gray-100 p-4 rounded">Item 1</div>
  <div className="bg-gray-100 p-4 rounded">Item 2</div>
  <div className="bg-gray-100 p-4 rounded">Item 3</div>
</div>

// Generated CSS
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.p-4 { padding: 1rem; }
.text-2xl { font-size: 1.5rem; }
.font-bold { font-weight: 700; }
.text-primary { color: #007bff; }
.btn { padding: 1rem 1.5rem; border-radius: 0.25rem; font-weight: 500; transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.btn-primary { background-color: #007bff; color: white; }
.btn-primary:hover { background-color: #2563eb; }
.grid { display: grid; }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }
.bg-gray-100 { background-color: #f3f4f6; }
.rounded { border-radius: 0.25rem; }`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Responsive Design</h3>
        <pre>
{`// Responsive utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="bg-primary text-white p-4 rounded">Item 1</div>
  <div className="bg-primary text-white p-4 rounded">Item 2</div>
  <div className="bg-primary text-white p-4 rounded">Item 3</div>
</div>

// Text responsive sizes
<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>

// Generated CSS
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }
.bg-primary { background-color: #007bff; }
.text-white { color: white; }
.p-4 { padding: 1rem; }
.rounded { border-radius: 0.25rem; }
@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
.text-xl { font-size: 1.25rem; }
@media (min-width: 640px) {
  .sm\:text-2xl { font-size: 1.5rem; }
}
@media (min-width: 768px) {
  .md\:text-3xl { font-size: 1.875rem; }
}
@media (min-width: 1024px) {
  .lg\:text-4xl { font-size: 2.25rem; }
}`}
        </pre>
      </div>
    </div>
  );
}

// Layout Example
function LayoutExample() {
  return (
    <div className="example-section">
      <h2>Layout with Windi CSS</h2>
      <p>Creating layouts with Windi CSS utilities.</p>
      
      <div className="code-block">
        <h3>Flexbox Layout</h3>
        <pre>
{`// Flexbox container
<div className="flex justify-between items-center p-4 bg-gray-100">
  <div className="text-lg font-bold">Logo</div>
  <nav className="flex gap-4">
    <a href="#" className="text-primary hover:underline">Home</a>
    <a href="#" className="text-primary hover:underline">About</a>
    <a href="#" className="text-primary hover:underline">Contact</a>
  </nav>
</div>

// Flexbox with direction
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1 bg-blue-100 p-4">Sidebar</div>
  <div className="flex-2 bg-green-100 p-4">Main Content</div>
</div>

// Generated CSS
.flex { display: flex; }
.justify-between { justify-content: space-between; }
.items-center { align-items: center; }
.p-4 { padding: 1rem; }
.bg-gray-100 { background-color: #f3f4f6; }
.text-lg { font-size: 1.125rem; }
.font-bold { font-weight: 700; }
.gap-4 { gap: 1rem; }
.text-primary { color: #007bff; }
.hover\:underline:hover { text-decoration-line: underline; }
.flex-col { flex-direction: column; }
.flex-1 { flex: 1 1 0%; }
.flex-2 { flex: 2 2 0%; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-green-100 { background-color: #dcfce7; }
@media (min-width: 768px) {
  .md\:flex-row { flex-direction: row; }
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Grid Layout</h3>
        <pre>
{`// Grid container
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
  <div className="bg-white p-4 rounded shadow">Card 1</div>
  <div className="bg-white p-4 rounded shadow">Card 2</div>
  <div className="bg-white p-4 rounded shadow">Card 3</div>
</div>

// Grid with areas
<div className="grid grid-cols-4 grid-rows-3 gap-4 h-96">
  <div className="col-span-4 row-span-1 bg-red-100 p-4">Header</div>
  <div className="col-span-1 row-span-2 bg-blue-100 p-4">Sidebar</div>
  <div className="col-span-3 row-span-2 bg-green-100 p-4">Main</div>
  <div className="col-span-4 row-span-1 bg-yellow-100 p-4">Footer</div>
</div>

// Generated CSS
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.gap-6 { gap: 1.5rem; }
.p-4 { padding: 1rem; }
.bg-white { background-color: white; }
.rounded { border-radius: 0.25rem; }
.shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
@media (min-width: 768px) {
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-rows-3 { grid-template-rows: repeat(3, minmax(0, 1fr)); }
.h-96 { height: 24rem; }
.col-span-4 { grid-column: span 4 / span 4; }
.row-span-1 { grid-row: span 1 / span 1; }
.bg-red-100 { background-color: #fee2e2; }
.col-span-1 { grid-column: span 1 / span 1; }
.row-span-2 { grid-row: span 2 / span 2; }
.bg-blue-100 { background-color: #dbeafe; }
.col-span-3 { grid-column: span 3 / span 3; }
.bg-green-100 { background-color: #dcfce7; }
.bg-yellow-100 { background-color: #fef3c7; }
.col-span-4 { grid-column: span 4 / span 4; }
.row-span-1 { grid-row: span 1 / span 1; }
.bg-yellow-100 { background-color: #fef3c7; }`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Container and Spacing</h3>
        <pre>
{`// Container with max-width
<div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-6">Page Title</h1>
  <div className="space-y-4">
    <div className="bg-gray-100 p-4 rounded">Section 1</div>
    <div className="bg-gray-100 p-4 rounded">Section 2</div>
    <div className="bg-gray-100 p-4 rounded">Section 3</div>
  </div>
</div>

// Custom spacing
<div className="m-4 mt-8 mb-2 ml-6 mr-3">
  <div className="p-2 pt-4 pb-6 pl-8 pr-3">
    Content with custom padding and margins
  </div>
</div>

// Generated CSS
.container { width: 100%; }
@media (min-width: 640px) {
  .container { max-width: 640px; }
}
@media (min-width: 768px) {
  .container { max-width: 768px; }
}
@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}
@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
.mx-auto { margin-left: auto; margin-right: auto; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.text-3xl { font-size: 1.875rem; }
.font-bold { font-weight: 700; }
.mb-6 { margin-bottom: 1.5rem; }
.space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
.bg-gray-100 { background-color: #f3f4f6; }
.p-4 { padding: 1rem; }
.rounded { border-radius: 0.25rem; }
.m-4 { margin: 1rem; }
.mt-8 { margin-top: 2rem; }
.mb-2 { margin-bottom: 0.5rem; }
.ml-6 { margin-left: 1.5rem; }
.mr-3 { margin-right: 0.75rem; }
.p-2 { padding: 0.5rem; }
.pt-4 { padding-top: 1rem; }
.pb-6 { padding-bottom: 1.5rem; }
.pl-8 { padding-left: 2rem; }
.pr-3 { padding-right: 0.75rem; }`}
        </pre>
      </div>
    </div>
  );
}

// Typography Example
function TypographyExample() {
  return (
    <div className="example-section">
      <h2>Typography with Windi CSS</h2>
      <p>Styling text with Windi CSS utilities.</p>
      
      <div className="code-block">
        <h3>Font Sizes and Weights</h3>
        <pre>
{`// Font sizes
<h1 className="text-4xl font-bold">Heading 1</h1>
<h2 className="text-3xl font-semibold">Heading 2</h2>
<h3 className="text-2xl font-medium">Heading 3</h3>
<h4 className="text-xl font-normal">Heading 4</h4>
<p className="text-base">Base text</p>
<p className="text-sm">Small text</p>
<p className="text-xs">Extra small text</p>

// Custom font sizes
<p className="text-5xl">Extra large text</p>
<p className="text-lg">Large text</p>

// Generated CSS
.text-4xl { font-size: 2.25rem; }
.font-bold { font-weight: 700; }
.text-3xl { font-size: 1.875rem; }
.font-semibold { font-weight: 600; }
.text-2xl { font-size: 1.5rem; }
.font-medium { font-weight: 500; }
.text-xl { font-size: 1.25rem; }
.font-normal { font-weight: 400; }
.text-base { font-size: 1rem; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-5xl { font-size: 3rem; }
.text-lg { font-size: 1.125rem; }`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Text Alignment and Decoration</h3>
        <pre>
{`// Text alignment
<p className="text-left">Left aligned text</p>
<p className="text-center">Center aligned text</p>
<p className="text-right">Right aligned text</p>
<p className="text-justify">Justified text that spans multiple lines and demonstrates how text justification works in CSS.</p>

// Text decoration
<p className="underline">Underlined text</p>
<p className="line-through">Strikethrough text</p>
<p className="no-underline">No underline</p>

// Text transform
<p className="uppercase">Uppercase text</p>
<p className="lowercase">Lowercase text</p>
<p className="capitalize">Capitalized text</p>

// Generated CSS
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-justify { text-align: justify; }
.underline { text-decoration-line: underline; }
.line-through { text-decoration-line: line-through; }
.no-underline { text-decoration-line: none; }
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Line Height and Letter Spacing</h3>
        <pre>
{`// Line height
<p className="leading-none">No line height</p>
<p className="leading-tight">Tight line height</p>
<p className="leading-snug">Snug line height</p>
<p className="leading-normal">Normal line height</p>
<p className="leading-relaxed">Relaxed line height</p>
<p className="leading-loose">Loose line height</p>

// Letter spacing
<p className="tracking-tighter">Tighter letter spacing</p>
<p className="tracking-tight">Tight letter spacing</p>
<p className="tracking-normal">Normal letter spacing</p>
<p className="tracking-wide">Wide letter spacing</p>
<p className="tracking-wider">Wider letter spacing</p>
<p className="tracking-widest">Widest letter spacing</p>

// Generated CSS
.leading-none { line-height: 1; }
.leading-tight { line-height: 1.25; }
.leading-snug { line-height: 1.375; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.625; }
.leading-loose { line-height: 2; }
.tracking-tighter { letter-spacing: -0.05em; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-normal { letter-spacing: 0em; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.tracking-widest { letter-spacing: 0.1em; }`}
        </pre>
      </div>
    </div>
  );
}

// Colors Example
function ColorsExample() {
  return (
    <div className="example-section">
      <h2>Colors with Windi CSS</h2>
      <p>Using colors in Windi CSS.</p>
      
      <div className="code-block">
        <h3>Text Colors</h3>
        <pre>
{`// Text colors
<p className="text-red-500">Red text</p>
<p className="text-blue-500">Blue text</p>
<p className="text-green-500">Green text</p>
<p className="text-yellow-500">Yellow text</p>
<p className="text-purple-500">Purple text</p>
<p className="text-gray-500">Gray text</p>

// Text opacity
<p className="text-red-500/50">Red text with 50% opacity</p>
<p className="text-blue-500/75">Blue text with 75% opacity</p>
<p className="text-green-500/25">Green text with 25% opacity</p>

// Generated CSS
.text-red-500 { color: #ef4444; }
.text-blue-500 { color: #3b82f6; }
.text-green-500 { color: #10b981; }
.text-yellow-500 { color: #eab308; }
.text-purple-500 { color: #a855f7; }
.text-gray-500 { color: #6b7280; }
.text-red-500\/50 { color: rgb(239 68 68 / 0.5); }
.text-blue-500\/75 { color: rgb(59 130 246 / 0.75); }
.text-green-500\/25 { color: rgb(16 185 129 / 0.25); }`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Background Colors</h3>
        <pre>
{`// Background colors
<div className="bg-red-100 p-4">Light red background</div>
<div className="bg-blue-100 p-4">Light blue background</div>
<div className="bg-green-100 p-4">Light green background</div>
<div className="bg-yellow-100 p-4">Light yellow background</div>
<div className="bg-purple-100 p-4">Light purple background</div>
<div className="bg-gray-100 p-4">Light gray background</div>

// Background opacity
<div className="bg-red-500/50 p-4">Red background with 50% opacity</div>
<div className="bg-blue-500/75 p-4">Blue background with 75% opacity</div>
<div className="bg-green-500/25 p-4">Green background with 25% opacity</div>

// Generated CSS
.bg-red-100 { background-color: #fee2e2; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-green-100 { background-color: #dcfce7; }
.bg-yellow-100 { background-color: #fef3c7; }
.bg-purple-100 { background-color: #f3e8ff; }
.bg-gray-100 { background-color: #f3f4f6; }
.bg-red-500\/50 { background-color: rgb(239 68 68 / 0.5); }
.bg-blue-500\/75 { background-color: rgb(59 130 246 / 0.75); }
.bg-green-500\/25 { background-color: rgb(16 185 129 / 0.25); }`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Border Colors</h3>
        <pre>
{`// Border colors
<div className="border-2 border-red-500 p-4">Red border</div>
<div className="border-2 border-blue-500 p-4">Blue border</div>
<div className="border-2 border-green-500 p-4">Green border</div>
<div className="border-2 border-yellow-500 p-4">Yellow border</div>
<div className="border-2 border-purple-500 p-4">Purple border</div>
<div className="border-2 border-gray-500 p-4">Gray border</div>

// Border opacity
<div className="border-2 border-red-500/50 p-4">Red border with 50% opacity</div>
<div className="border-2 border-blue-500/75 p-4">Blue border with 75% opacity</div>
<div className="border-2 border-green-500/25 p-4">Green border with 25% opacity</div>

// Generated CSS
.border-2 { border-width: 2px; }
.border-red-500 { border-color: #ef4444; }
.border-blue-500 { border-color: #3b82f6; }
.border-green-500 { border-color: #10b981; }
.border-yellow-500 { border-color: #eab308; }
.border-purple-500 { border-color: #a855f7; }
.border-gray-500 { border-color: #6b7280; }
.border-red-500\/50 { border-color: rgb(239 68 68 / 0.5); }
.border-blue-500\/75 { border-color: rgb(59 130 246 / 0.75); }
.border-green-500\/25 { border-color: rgb(16 185 129 / 0.25); }`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Custom Colors</h3>
        <pre>
{`// windi.config.js
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        info: '#17a2b8',
        warning: '#ffc107',
        danger: '#dc3545',
        light: '#f8f9fa',
        dark: '#343a40',
      },
    },
  },
})

// Usage
<div className="bg-primary text-white p-4">Primary background</div>
<div className="bg-secondary text-white p-4">Secondary background</div>
<div className="bg-success text-white p-4">Success background</div>
<div className="bg-info text-white p-4">Info background</div>
<div className="bg-warning text-white p-4">Warning background</div>
<div className="bg-danger text-white p-4">Danger background</div>
<div className="bg-light text-dark p-4">Light background</div>
<div className="bg-dark text-white p-4">Dark background</div>

// Generated CSS
.bg-primary { background-color: #007bff; }
.text-white { color: white; }
.p-4 { padding: 1rem; }
.bg-secondary { background-color: #6c757d; }
.bg-success { background-color: #28a745; }
.bg-info { background-color: #17a2b8; }
.bg-warning { background-color: #ffc107; }
.bg-danger { background-color: #dc3545; }
.bg-light { background-color: #f8f9fa; }
.text-dark { color: #343a40; }
.bg-dark { background-color: #343a40; }`}
        </pre>
      </div>
    </div>
  );
}

// Animations Example
function AnimationsExample() {
  return (
    <div className="example-section">
      <h2>Animations with Windi CSS</h2>
      <p>Creating animations with Windi CSS utilities.</p>
      
      <div className="code-block">
        <h3>Transitions</h3>
        <pre>
{`// Basic transitions
<button className="bg-blue-500 text-white px-4 py-2 rounded transition-colors hover:bg-blue-600">
  Hover me
</button>

<button className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600 hover:scale-110">
  Scale on hover
</button>

<button className="bg-purple-500 text-white px-4 py-2 rounded transition-transform hover:rotate-12">
  Rotate on hover
</button>

// Generated CSS
.bg-blue-500 { background-color: #3b82f6; }
.text-white { color: white; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.rounded { border-radius: 0.25rem; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.hover\:bg-blue-600:hover { background-color: #2563eb; }
.bg-green-500 { background-color: #10b981; }
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.hover\:bg-green-600:hover { background-color: #059669; }
.hover\:scale-110:hover { transform: scale(1.1); }
.bg-purple-500 { background-color: #a855f7; }
.transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.hover\:rotate-12:hover { transform: rotate(12deg); }`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Animations</h3>
        <pre>
{`// Built-in animations
<div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
<div className="animate-ping w-8 h-8 bg-blue-500 rounded-full"></div>
<div className="animate-pulse w-8 h-8 bg-blue-500 rounded"></div>
<div className="animate-bounce w-8 h-8 bg-blue-500 rounded"></div>

// Custom animations
<div className="animate-fade-in">Fade in animation</div>
<div className="animate-slide-up">Slide up animation</div>
<div className="animate-scale-up">Scale up animation</div>

// windi.config.js
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-up': 'scale-up 0.5s ease-out',
      },
    },
  },
})

// Generated CSS
.animate-spin { animation: spin 1s linear infinite; }
.w-8 { width: 2rem; }
.h-8 { height: 2rem; }
.border-4 { border-width: 4px; }
.border-blue-500 { border-color: #3b82f6; }
.border-t-transparent { border-top-color: transparent; }
.rounded-full { border-radius: 9999px; }
.animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
.bg-blue-500 { background-color: #3b82f6; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.animate-bounce { animation: bounce 1s infinite; }
.animate-fade-in { animation: fade-in 0.5s ease-out; }
.animate-slide-up { animation: slide-up 0.5s ease-out; }
.animate-scale-up { animation: scale-up 0.5s ease-out; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}
@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes slide-up {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes scale-up {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}`}
        </pre>
      </div>
    </div>
  );
}

// Customization Example
function CustomizationExample() {
  return (
    <div className="example-section">
      <h2>Customization in Windi CSS</h2>
      <p>Customizing Windi CSS to fit your needs.</p>
      
      <div className="code-block">
        <h3>Shortcuts</h3>
        <pre>
{`// windi.config.js
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  shortcuts: {
    'btn': 'px-4 py-2 rounded font-medium transition-colors',
    'btn-primary': 'btn bg-primary text-white hover:bg-blue-600',
    'btn-secondary': 'btn bg-secondary text-white hover:bg-gray-600',
    'card': 'bg-white p-4 rounded shadow',
    'input': 'border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary',
    'flex-center': 'flex items-center justify-center',
    'text-ellipsis': 'truncate overflow-hidden whitespace-nowrap',
  },
})

// Usage
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
<div className="card">
  <h2 className="text-xl font-bold mb-2">Card Title</h2>
  <p className="text-gray-600">Card content goes here.</p>
</div>
<input className="input" type="text" placeholder="Enter text" />
<div className="flex-center h-32 bg-gray-100">Centered content</div>
<p className="text-ellipsis w-32">This text will be truncated if it's too long</p>

// Generated CSS
.btn { padding-left: 1rem; padding-right: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; border-radius: 0.25rem; font-weight: 500; transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.btn-primary { background-color: #007bff; color: white; }
.btn-primary:hover { background-color: #2563eb; }
.btn-secondary { background-color: #6c757d; color: white; }
.btn-secondary:hover { background-color: #4b5563; }
.card { background-color: white; padding: 1rem; border-radius: 0.25rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
.text-xl { font-size: 1.25rem; }
.font-bold { font-weight: 700; }
.mb-2 { margin-bottom: 0.5rem; }
.text-gray-600 { color: #4b5563; }
.input { border-width: 1px; border-color: #d1d5db; border-radius: 0.25rem; padding-left: 0.75rem; padding-right: 0.75rem; padding-top: 0.5rem; padding-bottom: 0.5rem; }
.input:focus { outline: 2px solid transparent; outline-offset: 2px; }
.input:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }
.focus\:ring-2:focus { box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-ring-shadow-width, 2px); }
.focus\:ring-primary:focus { --un-ring-color: #007bff; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.h-32 { height: 8rem; }
.bg-gray-100 { background-color: #f3f4f6; }
.text-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.w-32 { width: 8rem; }`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Custom Utilities</h3>
        <pre>
{`// windi.config.js
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    extend: {
      // Custom spacing
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      
      // Custom colors
      colors: {
        'primary': '#007bff',
        'secondary': '#6c757d',
      },
      
      // Custom fonts
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
      },
      
      // Custom shadows
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      
      // Custom animations
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
})

// Usage
<div className="p-72">Custom padding</div>
<div className="bg-primary text-white p-4">Custom primary color</div>
<div className="font-sans">Custom font family</div>
<div className="shadow-custom p-4">Custom shadow</div>
<div className="animate-float">Floating animation</div>

// Generated CSS
.p-72 { padding: 18rem; }
.bg-primary { background-color: #007bff; }
.text-white { color: white; }
.p-4 { padding: 1rem; }
.font-sans { font-family: Inter, sans-serif; }
.shadow-custom { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.animate-float { animation: float 3s ease-in-out infinite; }
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Plugins</h3>
        <pre>
{`// windi.config.js
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  plugins: [
    // Forms plugin
    require('windicss/plugin/forms'),
    
    // Typography plugin
    require('windicss/plugin/typography'),
    
    // Aspect ratio plugin
    require('windicss/plugin/aspect-ratio'),
    
    // Container queries plugin
    require('windicss/plugin/container-queries'),
    
    // Line clamp plugin
    require('windicss/plugin/line-clamp'),
    
    // Custom plugin
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }
      
      addUtilities(newUtilities)
    },
  ],
})

// Usage
<form className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">Name</label>
    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Email</label>
    <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" />
  </div>
</form>

<article className="prose lg:prose-xl">
  <h1>Typography</h1>
  <p>This is a paragraph with typography styles applied.</p>
</article>

<div className="aspect-w-16 aspect-h-9">
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<div className="scrollbar-hide overflow-y-auto h-64">
  <div className="h-96 bg-gray-100">Scrollable content without scrollbar</div>
</div>

// Generated CSS
.space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
.block { display: block; }
.text-sm { font-size: 0.875rem; }
.font-medium { font-weight: 500; }
.text-gray-700 { color: #374151; }
.mt-1 { margin-top: 0.25rem; }
.w-full { width: 100%; }
.rounded-md { border-radius: 0.375rem; }
.border-gray-300 { border-color: #d1d5db; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.focus\:border-primary:focus { border-color: #007bff; }
.focus\:ring:focus { box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-ring-shadow-width, 2px); }
.focus\:ring-primary:focus { --un-ring-color: #007bff; }
.focus\:ring-opacity-50:focus { --un-ring-opacity: 0.5; }
.prose { color: #374151; max-width: none; }
.prose h1 { font-size: 2.25em; margin-top: 0; margin-bottom: 0.8888889em; line-height: 1.1111111; }
.prose p { margin-top: 1.25em; margin-bottom: 1.25em; }
@media (min-width: 1024px) {
  .lg\:prose-xl { font-size: 1.25rem; line-height: 1.8; }
}
.aspect-w-16 { position: relative; padding-bottom: calc(100% / 16 * 9); }
.aspect-w-16 > * { position: absolute; height: 100%; width: 100%; top: 0; right: 0; bottom: 0; left: 0; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.overflow-y-auto { overflow-y: auto; }
.h-64 { height: 16rem; }
.h-96 { height: 24rem; }
.bg-gray-100 { background-color: #f3f4f6; }`}
        </pre>
      </div>
    </div>
  );
}

// Add some basic styles for the examples
const style = document.createElement('style');
style.textContent = `
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.intro {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 30px;
}

.example-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.example-nav button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
}

.example-nav button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.example-content {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.example-section h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.code-block {
  margin: 20px 0;
}

.code-block h3 {
  color: #555;
  margin-bottom: 10px;
}

.code-block pre {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
}
`;
document.head.appendChild(style);