import React, { useState } from 'react';

// Vitest Examples - Educational Examples for Vitest
// Note: Vitest is a next-generation testing framework powered by Vite

export default function VitestExamples() {
  const [activeExample, setActiveExample] = useState('basics');

  return (
    <div className="examples-container">
      <h1>Vitest Examples</h1>
      <p className="intro">
        Vitest is a next-generation testing framework powered by Vite, offering features like Jest snapshot support, built-in Chai assertions, instant watch mode, and native code coverage. It provides a fast and efficient testing experience for modern JavaScript projects.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('basics')} className={activeExample === 'basics' ? 'active' : ''}>
          Basics
        </button>
        <button onClick={() => setActiveExample('matchers')} className={activeExample === 'matchers' ? 'active' : ''}>
          Matchers
        </button>
        <button onClick={() => setActiveExample('async')} className={activeExample === 'async' ? 'active' : ''}>
          Async Testing
        </button>
        <button onClick={() => setActiveExample('mocking')} className={activeExample === 'mocking' ? 'active' : ''}>
          Mocking
        </button>
        <button onClick={() => setActiveExample('snapshots')} className={activeExample === 'snapshots' ? 'active' : ''}>
          Snapshots
        </button>
        <button onClick={() => setActiveExample('browser')} className={activeExample === 'browser' ? 'active' : ''}>
          Browser Testing
        </button>
        <button onClick={() => setActiveExample('advanced')} className={activeExample === 'advanced' ? 'active' : ''}>
          Advanced
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'basics' && <BasicsExample />}
        {activeExample === 'matchers' && <MatchersExample />}
        {activeExample === 'async' && <AsyncExample />}
        {activeExample === 'mocking' && <MockingExample />}
        {activeExample === 'snapshots' && <SnapshotsExample />}
        {activeExample === 'browser' && <BrowserExample />}
        {activeExample === 'advanced' && <AdvancedExample />}
      </div>
    </div>
  );
}

// Basics Example
function BasicsExample() {
  return (
    <div className="example-section">
      <h2>Vitest Basics</h2>
      <p>Getting started with Vitest testing.</p>
      
      <div className="code-block">
        <h3>Installation</h3>
        <pre>
{`# Install Vitest
npm install -D vitest

# Install with TypeScript support
npm install -D vitest @vitest/ui

# Install with browser support
npm install -D vitest @vitest/browser

# Install with coverage support
npm install -D @vitest/coverage-v8

# Run tests
npx vitest

# Run tests in watch mode
npx vitest --watch

# Run tests with coverage
npx vitest --coverage

# Run tests in UI mode
npx vitest --ui`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Basic Test Structure</h3>
        <pre>
{`// sum.test.ts
import { expect, test } from 'vitest'
import { sum } from './sum'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

// Using describe blocks
describe('sum function', () => {
  test('adds positive numbers', () => {
    expect(sum(2, 3)).toBe(5)
  })
  
  test('adds negative numbers', () => {
    expect(sum(-2, -3)).toBe(-5)
  })
  
  test('adds mixed numbers', () => {
    expect(sum(5, -3)).toBe(2)
  })
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Configuration</h3>
        <pre>
{`// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Test environment
  environment: 'jsdom', // or 'node', 'happy-dom'
  
  // Test file patterns
  include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  exclude: ['node_modules', 'dist'],
  
  // Coverage configuration
  coverage: {
    provider: 'v8', // or 'c8', 'istanbul'
    reporter: ['text', 'json', 'html'],
    reportsDirectory: './coverage',
    exclude: [
      'src/**/*.test.{js,ts}',
      'src/**/*.spec.{js,ts}'
    ]
  },
  
  // Setup files
  setupFiles: ['./vitest.setup.ts'],
  
  // Global configuration
  globals: true,
  
  // Test timeout
  testTimeout: 5000,
  
  // Watch configuration
  watch: {
    include: ['src/**/*'],
    exclude: ['node_modules']
  }
})

// package.json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  },
  "vitest": {
    "environment": "jsdom"
  }
}`}
        </pre>
      </div>
    </div>
  );
}

// Matchers Example
function MatchersExample() {
  return (
    <div className="example-section">
      <h2>Vitest Matchers</h2>
      <p>Using Vitest's built-in matchers (based on Chai).</p>
      
      <div className="code-block">
        <h3>Common Matchers</h3>
        <pre>
{`// Exact equality
expect(2 + 2).toBe(4)
expect({ name: 'John' }).toEqual({ name: 'John' })
expect([1, 2, 3]).toStrictEqual([1, 2, 3])

// Truthiness
expect(null).toBeNull()
expect(undefined).toBeUndefined()
expect(true).toBeTruthy()
expect(false).toBeFalsy()
expect(0).toBeFalsy()
expect('').toBeFalsy()

// Numbers
expect(10).toBeGreaterThan(5)
expect(10).toBeGreaterThanOrEqual(10)
expect(5).toBeLessThan(10)
expect(5).toBeLessThanOrEqual(5)

// Floating point numbers
expect(0.1 + 0.2).toBeCloseTo(0.3)
expect(0.1 + 0.2).not.toBe(0.3) // This would fail

// Strings
expect('Hello World').toMatch(/World/)
expect('Hello World').toContain('World')
expect('Hello World').not.toContain('Bye')
expect('Hello World').toHaveLength(11)

// Arrays
expect([1, 2, 3]).toContain(2)
expect([1, 2, 3]).toHaveLength(3)
expect([{ id: 1 }, { id: 2 }]).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ id: 1 }),
    expect.objectContaining({ id: 2 })
  ])
)}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Negated Matchers</h3>
        <pre>
{`// Using .not for negation
expect(2 + 2).not.toBe(5)
expect('Hello').not.toContain('World')
expect([1, 2, 3]).not.toContain(4)
expect(null).not.toBeNull()
expect(true).not.toBeFalsy()
expect(false).not.toBeTruthy()

// Combining with other matchers
expect('Hello World').not.toMatch(/Bye/)
expect({ name: 'John' }).not.toEqual({ name: 'Jane' })
expect([1, 2, 3]).not.toHaveLength(4)}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Custom Matchers</h3>
        <pre>
{`// Creating custom matchers
import { expect } from 'vitest'

expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () =>
          \`expected \${received} not to be within range \${floor} - \${ceiling}\`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          \`expected \${received} to be within range \${floor} - \${ceiling}\`,
        pass: false,
      }
    }
  },
})

// Using custom matchers
test('number is within range', () => {
  expect(100).toBeWithinRange(90, 110)
  expect(50).not.toBeWithinRange(90, 110)
})`}
        </pre>
      </div>
    </div>
  );
}

// Async Example
function AsyncExample() {
  return (
    <div className="example-section">
      <h2>Async Testing in Vitest</h2>
      <p>Testing asynchronous code with Vitest.</p>
      
      <div className="code-block">
        <h3>Promises</h3>
        <pre>
{`// Testing with promises
function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve('peanut butter'), 1000)
  })
}

test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter')
  })
})

// Using resolves matcher
test('the data is peanut butter with resolves', () => {
  return expect(fetchData()).resolves.toBe('peanut butter')
})

// Testing promise rejection
function fetchRejectedData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Error fetching data')), 1000)
  })
}

test('the fetch fails with an error', () => {
  return expect(fetchRejectedData()).rejects.toThrow('Error fetching data')
})

// Using async/await
test('the data is peanut butter with async/await', async () => {
  const data = await fetchData()
  expect(data).toBe('peanut butter')
})

test('the fetch fails with async/await', async () => {
  await expect(fetchRejectedData()).rejects.toThrow('Error fetching data')
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Timer Mocks</h3>
        <pre>
{`// Mocking timers
import { vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

test('timer mock example', () => {
  const callback = vi.fn()
  
  setTimeout(() => {
    callback('called')
  }, 1000)
  
  // Timer hasn't run yet
  expect(callback).not.toHaveBeenCalled()
  
  // Fast-forward time
  vi.advanceTimersByTime(1000)
  
  // Timer should have run
  expect(callback).toHaveBeenCalledWith('called')
  expect(callback).toHaveBeenCalledTimes(1)
})`}
        </pre>
      </div>
    </div>
  );
}

// Mocking Example
function MockingExample() {
  return (
    <div className="example-section">
      <h2>Mocking in Vitest</h2>
      <p>Creating and using mocks in Vitest tests.</p>
      
      <div className="code-block">
        <h3>Function Mocks</h3>
        <pre>
{`// Creating a mock function
import { vi } from 'vitest'

const mockFn = vi.fn()

// Using mock function
mockFn('arg1', 'arg2')
mockFn('arg3')

// Checking mock calls
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledTimes(2)
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenLastCalledWith('arg3')

// Mock return values
const mockFn = vi.fn(() => 'return value')
expect(mockFn()).toBe('return value')

// Mock implementation once
const mockFn = vi.fn()
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call')
  .mockReturnValue('default')

expect(mockFn()).toBe('first call')
expect(mockFn()).toBe('second call')
expect(mockFn()).toBe('default')

// Mock implementation
const mockFn = vi.fn((arg1, arg2) => arg1 + arg2)
expect(mockFn(2, 3)).toBe(5)}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Module Mocks</h3>
        <pre>
{`// Mocking entire modules
import { vi, test, expect } from 'vitest'

vi.mock('./axios')

const axios = await import('./axios')

// Mock implementation
vi.mocked(axios).get.mockResolvedValue({ data: 'mock data' })

// Test with mocked module
test('fetches data correctly', async () => {
  const data = await axios.get('/api/data')
  expect(data.data).toBe('mock data')
  expect(axios.get).toHaveBeenCalledWith('/api/data')
})

// Mock with different implementations
vi.mocked(axios).get
  .mockResolvedValueOnce({ data: 'first call' })
  .mockResolvedValueOnce({ data: 'second call' })
  .mockResolvedValue({ data: 'default' })

// Partial module mocking
vi.mock('./utils', () => {
  const originalUtils = await vi.importActual('./utils')
  
  return {
    ...originalUtils,
    helperFunction: vi.fn(() => 'mocked helper')
  }
})

const { helperFunction, otherFunction } = await import('./utils')

test('uses mocked helper function', () => {
  expect(helperFunction()).toBe('mocked helper')
  expect(otherFunction()).toBe('original implementation')
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Timer Mocks</h3>
        <pre>
{`// Mocking timers
import { vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

test('timer mock example', () => {
  const callback = vi.fn()
  
  setTimeout(() => {
    callback('called')
  }, 1000)
  
  // Timer hasn't run yet
  expect(callback).not.toHaveBeenCalled()
  
  // Fast-forward time
  vi.advanceTimersByTime(1000)
  
  // Timer should have run
  expect(callback).toHaveBeenCalledWith('called')
  expect(callback).toHaveBeenCalledTimes(1)
})`}
        </pre>
      </div>
    </div>
  );
}

// Snapshots Example
function SnapshotsExample() {
  return (
    <div className="example-section">
      <h2>Snapshot Testing in Vitest</h2>
      <p>Capturing and comparing component snapshots.</p>
      
      <div className="code-block">
        <h3>Basic Snapshots</h3>
        <pre>
{`// React component
import React from 'react'

function Link({ page }) {
  return <a href={page}>{page}</a>
}

// Test with snapshot
import React from 'react'
import { render } from '@testing-library/react'
import { test, expect } from 'vitest'
import Link from './Link'

test('Link changes the class when hovered', () => {
  const { container } = render(
    <Link page="http://www.facebook.com">Facebook</Link>
  )
  
  expect(container.firstChild).toMatchSnapshot()
  
  // Simulate hover
  container.firstChild.className = 'hovered'
  expect(container.firstChild).toMatchSnapshot()
  
  // Simulate mouse leave
  container.firstChild.className = ''
  expect(container.firstChild).toMatchSnapshot()
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Inline Snapshots</h3>
        <pre>
{`// Using inline snapshots
test('inline snapshot', () => {
  const user = {
    createdAt: new Date(),
    id: '123456',
    name: 'John Doe'
  }
  
  expect(user).toMatchInlineSnapshot(\`
    Object {
      "createdAt": Any<Date>,
      "id": "123456",
      "name": "John Doe",
    }
  \`)
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Image Snapshots</h3>
        <pre>
{`// Install image snapshot support
npm install -D vitest-image-snapshot

// Using image snapshots
import { test, expect } from 'vitest'
import { readFileSync } from 'fs'

test('image snapshot', () => {
  expect(readFileSync('./test/stubs/input-image.png'))
    .toMatchImageSnapshot()
})`}
        </pre>
      </div>
    </div>
  );
}

// Browser Example
function BrowserExample() {
  return (
    <div className="example-section">
      <h2>Browser Testing in Vitest</h2>
      <p>Testing in browser environment with Vitest.</p>
      
      <div className="code-block">
        <h3>Browser Setup</h3>
        <pre>
{`// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  browser: {
    enabled: true,
    name: 'chrome', // or 'firefox', 'webkit'
    provider: 'webdriverio', // or 'playwright', 'webdriver'
    headless: false,
    viewport: { width: 1280, height: 720 }
  }
})

// Running browser tests
npx vitest --browser
npx vitest --browser=firefox
npx vitest --browser=webkit`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Browser Testing</h3>
        <pre>
{`// Browser testing APIs
import { test, expect } from 'vitest'

test('browser test', async () => {
  // Access browser globals
  expect(window).toBeDefined()
  expect(document).toBeDefined()
  
  // Navigate to page
  await page.goto('https://example.com')
  
  // Interact with page
  await page.getByRole('button', { name: /submit/i }).click()
  await page.getByLabelText(/email/i).fill('user@example.com')
  
  // Assertions
  expect(page.getByText('Success')).toBeInTheDocument()
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Visual Testing</h3>
        <pre>
{`// Visual regression testing
import { test, expect } from 'vitest'

test('visual regression', async () => {
  // Take screenshot
  await page.goto('https://example.com')
  await expect(page).toMatchScreenshot()
  
  // With custom name
  await expect(page).toMatchScreenshot('homepage')
  
  // With options
  await expect(page).toMatchScreenshot({
    threshold: 0.2,
    maxDiffPixels: 100
  })
})`}
        </pre>
      </div>
    </div>
  );
}

// Advanced Example
function AdvancedExample() {
  return (
    <div className="example-section">
      <h2>Advanced Vitest Features</h2>
      <p>Advanced testing patterns with Vitest.</p>
      
      <div className="code-block">
        <h3>Parameterized Tests</h3>
        <pre>
{`// Using test.each with arrays
test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('adds %i + %i to equal %i', (a, b, expected) => {
  expect(a + b).toBe(expected)
})

// Using test.each with objects
test.each([
  {a: 1, b: 1, expected: 2},
  {a: 1, b: 2, expected: 3},
  {a: 2, b: 1, expected: 3},
])('returns $expected when $a is added to $b', ({a, b, expected}) => {
  expect(a + b).toBe(expected)
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Concurrent Testing</h3>
        <pre>
{`// Running tests concurrently
import { describe, test, expect } from 'vitest'

describe.concurrent('suite', () => {
  test('concurrent test 1', async () => {
    // This test runs in parallel
    expect(1 + 1).toBe(2)
  })
  
  test('concurrent test 2', async () => {
    // This test runs in parallel
    expect(2 + 2).toBe(4)
  })
})

// Using test.concurrent
test.concurrent('concurrent test 3', async () => {
  // This test runs in parallel
  expect(3 + 3).toBe(6)
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>In-Source Testing</h3>
        <pre>
{`// In-source testing
// Implementation
export function add(...args: number[]): number {
  return args.reduce((prev, curr) => prev + curr, 0)
}

// In-source test
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest
  
  test('add function works', () => {
    expect(add()).toBe(0)
    expect(add(1, 2)).toBe(3)
    expect(add(1, 2, 3)).toBe(6)
  })
}}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Test Context</h3>
        <pre>
{`// Using test context
import { test, expect } from 'vitest'

test('uses test context', ({ task }) => {
  // task is provided by test runner
  expect(task).toBeDefined()
  
  // Can use context for setup
  task.setup()
  
  // Can use context for teardown
  return () => {
    task.cleanup()
  }
})`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Code Coverage</h3>
        <pre>
{`// Generate coverage report
npx vitest --coverage

// Coverage configuration in vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  coverage: {
    provider: 'v8', // or 'c8', 'istanbul'
    reporter: ['text', 'json', 'html'],
    reportsDirectory: './coverage',
    exclude: [
      'src/**/*.test.{js,ts}',
      'src/**/*.spec.{js,ts}'
    ],
    thresholds: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
})

// Coverage with specific files
npx vitest --coverage --include=src/utils.ts

// Coverage in CI
# In package.json
{
  "scripts": {
    "test:coverage": "vitest --coverage --reporter=json --outputFile=coverage.json"
  }
}`}
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