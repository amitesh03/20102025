import React, { useState } from 'react';

// Jest Examples - Educational Examples for Jest
// Note: Jest is a delightful JavaScript Testing Framework with a focus on simplicity

export default function JestExamples() {
  const [activeExample, setActiveExample] = useState('basics');

  return (
    <div className="examples-container">
      <h1>Jest Examples</h1>
      <p className="intro">
        Jest is a delightful JavaScript Testing Framework with a focus on simplicity. It works great out of the box for most JavaScript projects, producing zero-configuration testing with features like snapshot testing, mocking, and code coverage.
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
        {activeExample === 'advanced' && <AdvancedExample />}
      </div>
    </div>
  );
}

// Basics Example
function BasicsExample() {
  return (
    <div className="example-section">
      <h2>Jest Basics</h2>
      <p>Getting started with Jest testing.</p>
      
      <div className="code-block">
        <h3>Installation</h3>
        <pre>
{`# Install Jest
npm install --save-dev jest

# Install with Babel for ES6+ support
npm install --save-dev babel-jest @babel/core @babel/preset-env

# Install with TypeScript support
npm install --save-dev jest @types/jest ts-jest

# Run tests
npx jest

# Run tests in watch mode
npx jest --watch

# Run tests with coverage
npx jest --coverage`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Basic Test Structure</h3>
        <pre>
{`// sum.js
function sum(a, b) {
  return a + b;
}

module.exports = sum;

// sum.test.js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// Using describe blocks
describe('sum function', () => {
  test('adds positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
  
  test('adds negative numbers', () => {
    expect(sum(-2, -3)).toBe(-5);
  });
  
  test('adds mixed numbers', () => {
    expect(sum(5, -3)).toBe(2);
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Configuration</h3>
        <pre>
{`// jest.config.js
module.exports = {
  // Test environment
  testEnvironment: 'jsdom', // or 'node'
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Transform files
  transform: {
    '^.+\\\\.js$': 'babel-jest',
    '^.+\\\\.tsx?$': 'ts-jest'
  }
};

// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "jsdom"
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
      <h2>Jest Matchers</h2>
      <p>Using Jest's built-in matchers for assertions.</p>
      
      <div className="code-block">
        <h3>Common Matchers</h3>
        <pre>
{`// Exact equality
expect(2 + 2).toBe(4);
expect({ name: 'John' }).toEqual({ name: 'John' });
expect([1, 2, 3]).toStrictEqual([1, 2, 3]);

// Truthiness
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(0).toBeFalsy();
expect('').toBeFalsy();

// Numbers
expect(10).toBeGreaterThan(5);
expect(10).toBeGreaterThanOrEqual(10);
expect(5).toBeLessThan(10);
expect(5).toBeLessThanOrEqual(5);

// Floating point numbers
expect(0.1 + 0.2).toBeCloseTo(0.3);
expect(0.1 + 0.2).not.toBe(0.3); // This would fail

// Strings
expect('Hello World').toMatch(/World/);
expect('Hello World').toContain('World');
expect('Hello World').not.toContain('Bye');
expect('Hello World').toHaveLength(11);

// Arrays
expect([1, 2, 3]).toContain(2);
expect([1, 2, 3]).toHaveLength(3);
expect([{ id: 1 }, { id: 2 }]).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ id: 1 }),
    expect.objectContaining({ id: 2 })
  ])
);`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Negated Matchers</h3>
        <pre>
{`// Using .not for negation
expect(2 + 2).not.toBe(5);
expect('Hello').not.toContain('World');
expect([1, 2, 3]).not.toContain(4);
expect(null).not.toBeNull();
expect(true).not.toBeFalsy();
expect(false).not.toBeTruthy();

// Combining with other matchers
expect('Hello World').not.toMatch(/Bye/);
expect({ name: 'John' }).not.toEqual({ name: 'Jane' });
expect([1, 2, 3]).not.toHaveLength(4);`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Custom Matchers</h3>
        <pre>
{`// Creating custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          \`expected \${received} not to be within range \${floor} - \${ceiling}\`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          \`expected \${received} to be within range \${floor} - \${ceiling}\`,
        pass: false,
      };
    }
  },
});

// Using custom matchers
test('number is within range', () => {
  expect(100).toBeWithinRange(90, 110);
  expect(50).not.toBeWithinRange(90, 110);
});

// Async custom matchers
expect.extend({
  async toBeDivisibleByExternalValue(received, divisor) {
    const externalValue = await getExternalValue();
    const pass = received % divisor === 0 && externalValue % divisor === 0;
    
    if (pass) {
      return {
        message: () =>
          \`expected \${received} not to be divisible by \${divisor}\`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          \`expected \${received} to be divisible by \${divisor}\`,
        pass: false,
      };
    }
  },
});

test('async custom matcher', async () => {
  await expect(100).toBeDivisibleByExternalValue(10);
});`}
        </pre>
      </div>
    </div>
  );
}

// Async Example
function AsyncExample() {
  return (
    <div className="example-section">
      <h2>Async Testing in Jest</h2>
      <p>Testing asynchronous code with Jest.</p>
      
      <div className="code-block">
        <h3>Promises</h3>
        <pre>
{`// Testing with promises
function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve('peanut butter'), 1000);
  });
}

test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});

// Using resolves matcher
test('the data is peanut butter with resolves', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});

// Testing promise rejection
function fetchRejectedData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Error fetching data')), 1000);
  });
}

test('the fetch fails with an error', () => {
  return expect(fetchRejectedData()).rejects.toThrow('Error fetching data');
});

// Using async/await
test('the data is peanut butter with async/await', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with async/await', async () => {
  await expect(fetchRejectedData()).rejects.toThrow('Error fetching data');
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Callbacks</h3>
        <pre>
{`// Testing with callbacks
function fetchDataCallback(callback) {
  setTimeout(() => callback(null, 'peanut butter'), 1000);
}

test('the data is peanut butter with callback', done => {
  function callback(error, data) {
    if (error) {
      done(error);
      return;
    }
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  }

  fetchDataCallback(callback);
});

// Using done.fail
test('callback with error', done => {
  fetchDataCallback((error, data) => {
    if (error) {
      done.fail('This should not have failed');
      return;
    }
    done();
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Timer Mocks</h3>
        <pre>
{`// Mocking timers
function timerGame(callback) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log('Time\'s up -- stop!');
    callback && callback();
  }, 1000);
}

// Using fake timers
jest.useFakeTimers();

test('waits 1 second before ending the game', () => {
  const callback = jest.fn();
  timerGame(callback);
  
  // At this point in time, there should have been no calls to the callback
  expect(callback).not.toBeCalled();
  
  // Fast-forward until all timers have been executed
  jest.runAllTimers();
  
  // Now our callback should have been called!
  expect(callback).toBeCalled();
  expect(callback).toHaveBeenCalledTimes(1);
});

// Using advanceTimersByTime
test('calls callback after 1 second via advanceTimersByTime', () => {
  const callback = jest.fn();
  timerGame(callback);
  
  // Fast-forward until all timers have been executed
  jest.advanceTimersByTime(1000);
  
  expect(callback).toHaveBeenCalledTimes(1);
});

// Restore real timers
afterEach(() => {
  jest.useRealTimers();
});`}
        </pre>
      </div>
    </div>
  );
}

// Mocking Example
function MockingExample() {
  return (
    <div className="example-section">
      <h2>Mocking in Jest</h2>
      <p>Creating and using mocks in Jest tests.</p>
      
      <div className="code-block">
        <h3>Function Mocks</h3>
        <pre>
{`// Creating a mock function
const mockFn = jest.fn();

// Using mock function
mockFn('arg1', 'arg2');
mockFn('arg3');

// Checking mock calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenLastCalledWith('arg3');

// Mock return values
const mockFn = jest.fn(() => 'return value');
expect(mockFn()).toBe('return value');

// Mock implementation once
const mockFn = jest.fn()
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call')
  .mockReturnValue('default');

expect(mockFn()).toBe('first call');
expect(mockFn()).toBe('second call');
expect(mockFn()).toBe('default');

// Mock implementation
const mockFn = jest.fn((arg1, arg2) => arg1 + arg2);
expect(mockFn(2, 3)).toBe(5);`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Module Mocks</h3>
        <pre>
{`// Mocking entire modules
jest.mock('./axios');

const axios = require('./axios');

// Mock implementation
axios.get.mockResolvedValue({ data: 'mock data' });

// Test with mocked module
test('fetches data correctly', async () => {
  const data = await axios.get('/api/data');
  expect(data.data).toBe('mock data');
  expect(axios.get).toHaveBeenCalledWith('/api/data');
});

// Mock with different implementations
axios.get
  .mockResolvedValueOnce({ data: 'first call' })
  .mockResolvedValueOnce({ data: 'second call' })
  .mockResolvedValue({ data: 'default' });

// Partial module mocking
jest.mock('./utils', () => {
  const originalUtils = jest.requireActual('./utils');
  
  return {
    ...originalUtils,
    helperFunction: jest.fn(() => 'mocked helper')
  };
});

const { helperFunction, otherFunction } = require('./utils');

test('uses mocked helper function', () => {
  expect(helperFunction()).toBe('mocked helper');
  expect(otherFunction()).toBe('original implementation');
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Timer Mocks</h3>
        <pre>
{`// Mocking timers
jest.useFakeTimers();

test('timer mock example', () => {
  const callback = jest.fn();
  
  setTimeout(() => {
    callback('called');
  }, 1000);
  
  // Timer hasn't run yet
  expect(callback).not.toHaveBeenCalled();
  
  // Fast-forward time
  jest.advanceTimersByTime(1000);
  
  // Timer should have run
  expect(callback).toHaveBeenCalledWith('called');
});

// Restore real timers
afterEach(() => {
  jest.useRealTimers();
});`}
        </pre>
      </div>
    </div>
  );
}

// Snapshots Example
function SnapshotsExample() {
  return (
    <div className="example-section">
      <h2>Snapshot Testing in Jest</h2>
      <p>Capturing and comparing component snapshots.</p>
      
      <div className="code-block">
        <h3>Basic Snapshots</h3>
        <pre>
{`// React component
import React from 'react';

function Link({ page }) {
  return <a href={page}>{page}</a>;
}

module.exports = Link;

// Test with snapshot
import React from 'react';
import renderer from 'react-test-renderer';
import Link from './Link';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Link page="http://www.facebook.com">Facebook</Link>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  
  // Simulate hover
  tree.props.onMouseEnter();
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  
  // Simulate mouse leave
  tree.props.onMouseLeave();
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});`}
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
  };
  
  expect(user).toMatchInlineSnapshot(\`
    Object {
      "createdAt": Any<Date>,
      "id": "123456",
      "name": "John Doe",
    }
  \`);
});

// Multiple inline snapshots
test.each([
  { input: 'hello', expected: 'HELLO' },
  { input: 'world', expected: 'WORLD' }
])('uppercase: %s -> %s', ({ input, expected }) => {
  expect(input.toUpperCase()).toMatchInlineSnapshot(expected);
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Property Matchers</h3>
        <pre>
{`// Using property matchers
test('object with property matchers', () => {
  const user = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      country: 'USA'
    }
  };
  
  expect(user).toEqual(
    expect.objectContaining({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      address: expect.objectContaining({
        street: '123 Main St',
        city: 'Anytown'
      })
    })
  );
  
  expect(user.address).toEqual(
    expect.objectContaining({
      country: 'USA'
    })
  );
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Updating Snapshots</h3>
        <pre>
{`// When snapshots fail, you can update them
# Update all snapshots
npx jest --updateSnapshot

# Update specific snapshot file
npx jest --updateSnapshot path/to/snapshot.test.js

# Or use the interactive mode
npx jest --watch

# In watch mode, press 'u' to update failing snapshots

# Snapshot files are stored in __snapshots__ directory
# Example: __snapshots__/Link.test.js.snap

// Snapshot file content
exports[\`Link changes the class when hovered 1\`] = \`
<a
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
\`;

exports[\`Link changes the class when hovered 2\`] = \`
<a
  className="hovered"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
\`;`}
        </pre>
      </div>
    </div>
  );
}

// Advanced Example
function AdvancedExample() {
  return (
    <div className="example-section">
      <h2>Advanced Jest Features</h2>
      <p>Advanced testing patterns with Jest.</p>
      
      <div className="code-block">
        <h3>Parameterized Tests</h3>
        <pre>
{`// Using test.each with arrays
test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('adds %i + %i to equal %i', (a, b, expected) => {
  expect(a + b).toBe(expected);
});

// Using test.each with objects
test.each([
  {a: 1, b: 1, expected: 2},
  {a: 1, b: 2, expected: 3},
  {a: 2, b: 1, expected: 3},
])('returns $expected when $a is added to $b', ({a, b, expected}) => {
  expect(a + b).toBe(expected);
});

// Using describe.each
describe.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('.add(%i, %i)', (a, b, expected) => {
  test(\`returns \${expected}\`, () => {
    expect(a + b).toBe(expected);
  });
  
  test(\`returned value not be greater than \${expected}\`, () => {
    expect(a + b).not.toBeGreaterThan(expected);
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Setup and Teardown</h3>
        <pre>
{`// Global setup and teardown
beforeAll(() => {
  // Runs once before all tests
  console.log('Starting test suite');
});

afterAll(() => {
  // Runs once after all tests
  console.log('Finished test suite');
});

// Test-specific setup and teardown
beforeEach(() => {
  // Runs before each test
  // Reset modules, clear mocks, etc.
  jest.clearAllMocks();
});

afterEach(() => {
  // Runs after each test
  // Clean up, reset state, etc.
});

// Example with database
describe('Database tests', () => {
  let db;
  
  beforeAll(async () => {
    db = await connectToDatabase();
  });
  
  afterAll(async () => {
    await db.close();
  });
  
  beforeEach(async () => {
    await db.clear();
  });
  
  test('can save user', async () => {
    const user = { name: 'John', email: 'john@example.com' };
    const savedUser = await db.saveUser(user);
    expect(savedUser.id).toBeDefined();
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Code Coverage</h3>
        <pre>
{`// Generate coverage report
npx jest --coverage

# Coverage configuration in jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

# Coverage with specific files
npx jest --coverage --collectCoverageOnlyFrom=src/utils.js

# Generate coverage without running tests
npx jest --coverage --passWithNoTests

# Coverage in CI
# In package.json
{
  "scripts": {
    "test:coverage": "jest --coverage --coverageReporters=text-lcov | coveralls"
  }
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Environment Variables</h3>
        <pre>
{`// Setting environment variables for tests
// In jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.env.js']
};

// In jest.env.js
process.env.NODE_ENV = 'test';
process.env.API_URL = 'http://localhost:3000/api';

// In test file
describe('API tests', () => {
  test('uses test API URL', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.API_URL).toBe('http://localhost:3000/api');
  });
});

// Using different environment variables per test
describe('Feature tests', () => {
  const originalEnv = process.env.NODE_ENV;
  
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });
  
  test('works in development mode', () => {
    process.env.NODE_ENV = 'development';
    // Test development-specific behavior
  });
  
  test('works in production mode', () => {
    process.env.NODE_ENV = 'production';
    // Test production-specific behavior
  });
});`}
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