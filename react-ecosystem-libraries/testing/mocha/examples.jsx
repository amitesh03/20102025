import React, { useState } from 'react';

// Mocha Examples - Educational Examples for Mocha
// Note: Mocha is a feature-rich JavaScript test framework for Node.js and browser

export default function MochaExamples() {
  const [activeExample, setActiveExample] = useState('basics');

  return (
    <div className="examples-container">
      <h1>Mocha Examples</h1>
      <p className="intro">
        Mocha is a feature-rich JavaScript test framework for Node.js and browser, offering flexibility and ease of use for writing and running tests. It provides a simple interface for organizing tests and supports various assertion libraries.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('basics')} className={activeExample === 'basics' ? 'active' : ''}>
          Basics
        </button>
        <button onClick={() => setActiveExample('interfaces')} className={activeExample === 'interfaces' ? 'active' : ''}>
          Interfaces
        </button>
        <button onClick={() => setActiveExample('hooks')} className={activeExample === 'hooks' ? 'active' : ''}>
          Hooks
        </button>
        <button onClick={() => setActiveExample('async')} className={activeExample === 'async' ? 'active' : ''}>
          Async Testing
        </button>
        <button onClick={() => setActiveExample('reporters')} className={activeExample === 'reporters' ? 'active' : ''}>
          Reporters
        </button>
        <button onClick={() => setActiveExample('advanced')} className={activeExample === 'advanced' ? 'active' : ''}>
          Advanced
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'basics' && <BasicsExample />}
        {activeExample === 'interfaces' && <InterfacesExample />}
        {activeExample === 'hooks' && <HooksExample />}
        {activeExample === 'async' && <AsyncExample />}
        {activeExample === 'reporters' && <ReportersExample />}
        {activeExample === 'advanced' && <AdvancedExample />}
      </div>
    </div>
  );
}

// Basics Example
function BasicsExample() {
  return (
    <div className="example-section">
      <h2>Mocha Basics</h2>
      <p>Getting started with Mocha testing.</p>
      
      <div className="code-block">
        <h3>Installation</h3>
        <pre>
{`# Install Mocha
npm install --save-dev mocha

# Install globally
npm install -g mocha

# Install assertion library (Chai recommended)
npm install --save-dev chai

# Run tests
npx mocha

# Run tests with specific pattern
npx mocha "test/**/*.test.js"

# Run tests with reporter
npx mocha --reporter spec`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Basic Test Structure</h3>
        <pre>
{`// test/array.test.js
const assert = require('assert');
const { add, subtract } = require('../array');

describe('Array', function() {
  describe('#add()', function() {
    it('should add two numbers', function() {
      assert.equal(add(2, 3), 5);
    });
    
    it('should handle negative numbers', function() {
      assert.equal(add(-2, -3), -5);
    });
  });
  
  describe('#subtract()', function() {
    it('should subtract two numbers', function() {
      assert.equal(subtract(5, 3), 2);
    });
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Configuration</h3>
        <pre>
{`// mocha.opts
--require test/setup.js
--reporter spec
--timeout 5000
--recursive
--grep "pattern"

// package.json
{
  "scripts": {
    "test": "mocha",
    "test:watch": "mocha --watch",
    "test:debug": "mocha --inspect-brk"
  },
  "mocha": {
    "timeout": 5000,
    "reporter": "spec",
    "require": "test/setup.js"
  }
}

// .mocharc.json
{
  "require": ["test/setup.js"],
  "reporter": "spec",
  "timeout": 5000,
  "recursive": true,
  "spec": ["test/**/*.test.js"]
}`}
        </pre>
      </div>
    </div>
  );
}

// Interfaces Example
function InterfacesExample() {
  return (
    <div className="example-section">
      <h2>Mocha Interfaces</h2>
      <p>Different ways to structure tests in Mocha.</p>
      
      <div className="code-block">
        <h3>BDD Interface</h3>
        <pre>
{`// Using describe, context, and it
describe('User', function() {
  context('when logged in', function() {
    it('should display user profile', function() {
      // Test implementation
    });
    
    it('should allow editing profile', function() {
      // Test implementation
    });
  });
  
  context('when not logged in', function() {
    it('should redirect to login', function() {
      // Test implementation
    });
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>TDD Interface</h3>
        <pre>
{`// Using suite, setup, suiteTeardown, and test
suite('Array', function() {
  setup(function() {
    // Runs once before all tests in this suite
  });
  
  suiteTeardown(function() {
    // Runs once after all tests in this suite
  });
  
  test('#indexOf()', function() {
    assert.equal([1, 2, 3].indexOf(2), 1);
  });
  
  test('#includes()', function() {
    assert.ok([1, 2, 3].includes(2));
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>QUnit Interface</h3>
        <pre>
{`// Using suite and test functions
function ok(expr, msg) {
  if (!expr) throw new Error(msg || 'Assertion failed');
}

suite('Array', function() {
  test('#length', function() {
    ok([1, 2, 3].length === 3, 'array has length 3');
  });
  
  test('#indexOf()', function() {
    ok([1, 2, 3].indexOf(2) === 1, 'element found at index 1');
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Exports Interface</h3>
        <pre>
{`// Using module.exports
module.exports = {
  before: function() {
    // Global setup
  },
  
  Array: {
    '#indexOf()': function() {
      assert.equal([1, 2, 3].indexOf(2), 1);
    }
  }
};`}
        </pre>
      </div>
    </div>
  );
}

// Hooks Example
function HooksExample() {
  return (
    <div className="example-section">
      <h2>Mocha Hooks</h2>
      <p>Using hooks for setup and teardown.</p>
      
      <div className="code-block">
        <h3>Basic Hooks</h3>
        <pre>
{`describe('Database tests', function() {
  let db;
  
  before(function() {
    // Runs once before all tests
    db = connectToDatabase();
  });
  
  after(function() {
    // Runs once after all tests
    db.close();
  });
  
  beforeEach(function() {
    // Runs before each test
    db.clear();
  });
  
  afterEach(function() {
    // Runs after each test
    db.reset();
  });
  
  it('should save user', function() {
    const user = { name: 'John' };
    db.save(user);
    assert.ok(db.findUser('John'));
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Asynchronous Hooks</h3>
        <pre>
{`describe('Async tests', function() {
  let db;
  
  beforeEach(function(done) {
    // Async setup
    connectToDatabase(function(err, connection) {
      if (err) return done(err);
      db = connection;
      db.clear(done);
    });
  });
  
  afterEach(function(done) {
    // Async teardown
    db.close(function(err) {
      if (err) return done(err);
      done();
    });
  });
  
  it('should save user', function(done) {
    const user = { name: 'John' };
    db.save(user, function(err) {
      if (err) return done(err);
      db.findUser('John', function(err, foundUser) {
        if (err) return done(err);
        assert.ok(foundUser);
        done();
      });
    });
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Root Hooks</h3>
        <pre>
{`// test/setup.js
// Global hooks that run for all test files

exports.mochaHooks = {
  beforeAll: function() {
    // Runs before all tests
    console.log('Starting test suite');
  },
  
  afterAll: function() {
    // Runs after all tests
    console.log('Finished test suite');
  },
  
  beforeEach: function() {
    // Runs before each test
    console.log('Starting test');
  },
  
  afterEach: function() {
    // Runs after each test
    console.log('Finished test');
  }
};

// In test file
describe('Test with root hooks', function() {
  it('should use global hooks', function() {
    // Test implementation
  });
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
      <h2>Async Testing in Mocha</h2>
      <p>Testing asynchronous code with Mocha.</p>
      
      <div className="code-block">
        <h3>Callback Pattern</h3>
        <pre>
{`// Using done callback
describe('Async tests', function() {
  it('should callback with result', function(done) {
    fetchData(function(err, data) {
      if (err) return done(err);
      assert.equal(data, 'expected data');
      done();
    });
  });
  
  it('should timeout if callback not called', function(done) {
    // This test will fail after 2000ms
    fetchData(function() {});
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Promise Pattern</h3>
        <pre>
{`// Returning promises
describe('Async tests', function() {
  it('should resolve with result', function() {
    return fetchData().then(function(data) {
      assert.equal(data, 'expected data');
    });
  });
  
  it('should reject with error', function() {
    return fetchRejectedData().catch(function(err) {
      assert.ok(err);
      assert.equal(err.message, 'expected error');
    });
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Async/Await Pattern</h3>
        <pre>
{`// Using async/await (requires Node.js 8+ or Babel)
describe('Async tests', function() {
  it('should resolve with result', async function() {
    const data = await fetchData();
    assert.equal(data, 'expected data');
  });
  
  it('should reject with error', async function() {
    try {
      await fetchRejectedData();
      assert.fail('Should have thrown an error');
    } catch (err) {
      assert.ok(err);
      assert.equal(err.message, 'expected error');
    }
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Timeouts</h3>
        <pre>
{`// Setting timeouts
describe('Timeout tests', function() {
  this.timeout(5000); // Set timeout for this test
  
  it('should complete within timeout', function(done) {
    setTimeout(function() {
      done();
    }, 1000);
  });
  
  it('should fail with timeout', function(done) {
    // This test will fail after 2000ms
    setTimeout(function() {
      done();
    }, 3000);
  });
});

// Global timeout
describe('Global timeout tests', function() {
  this.timeout(10000); // Set timeout for all tests in this suite
  
  it('should complete within timeout', function(done) {
    setTimeout(function() {
      done();
    }, 1000);
  });
});`}
        </pre>
      </div>
    </div>
  );
}

// Reporters Example
function ReportersExample() {
  return (
    <div className="example-section">
      <h2>Mocha Reporters</h2>
      <p>Different ways to report test results.</p>
      
      <div className="code-block">
        <h3>Built-in Reporters</h3>
        <pre>
{`# Using built-in reporters
npx mocha --reporter spec    # Spec reporter (default)
npx mocha --reporter dot     # Dot reporter
npx mocha --reporter tap      # TAP reporter
npx mocha --reporter json     # JSON reporter
npx mocha --reporter xunit    # XUnit reporter
npx mocha --reporter landing  # HTML reporter
npx mocha --reporter list    # List all reporters
npx mocha --reporter min     # Minimal reporter
npx mocha --reporter doc     # Documentation reporter
npx mocha --reporter json-stream # Streaming JSON reporter`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Custom Reporters</h3>
        <pre>
{`// Creating a custom reporter
// custom-reporter.js
class CustomReporter {
  constructor(runner, options) {
    this.runner = runner;
    this.options = options;
  }
  
  start() {
    console.log('Test suite started');
  }
  
  end() {
    console.log('Test suite completed');
  }
  
  test(test) {
    console.log(\`Test started: \${test.title}\`);
  }
  
  pass(test) {
    console.log(\`Test passed: \${test.title}\`);
  }
  
  fail(test, err) {
    console.log(\`Test failed: \${test.title} - \${err.message}\`);
  }
}

module.exports = CustomReporter;

// Using custom reporter
npx mocha --reporter ./custom-reporter.js`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Reporter Options</h3>
        <pre>
{`// Reporter configuration
npx mocha --reporter-options '{"outputFile": "results.html"}' --reporter html

// In package.json
{
  "mocha": {
    "reporter": "html",
    "reporterOptions": {
      "outputFile": "results.html"
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
}

// Advanced Example
function AdvancedExample() {
  return (
    <div className="example-section">
      <h2>Advanced Mocha Features</h2>
      <p>Advanced testing patterns with Mocha.</p>
      
      <div className="code-block">
        <h3>Test Filtering</h3>
        <pre>
{`# Using grep to filter tests
npx mocha --grep "pattern"           # Run tests matching pattern
npx mocha --fgrep "pattern"          # Run tests matching pattern (case-insensitive)
npx mocha --invert --grep "pattern"   # Run tests NOT matching pattern

# Using skip and only
describe('Test suite', function() {
  it('should run this test', function() {
    // This test will run
  });
  
  it.skip('should skip this test', function() {
    // This test will be skipped
  });
  
  it.only('should run only this test', function() {
    // Only this test will run
  });
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Parameterized Tests</h3>
        <pre>
{`// Using forEach for parameterized tests
describe('Math operations', function() {
  const testCases = [
    { a: 1, b: 2, expected: 3 },
    { a: 5, b: 3, expected: 8 },
    { a: 10, b: 5, expected: 15 }
  ];
  
  testCases.forEach(function(testCase) {
    it(\`\${testCase.a} + \${testCase.b} should equal \${testCase.expected}\`, function() {
      assert.equal(add(testCase.a, testCase.b), testCase.expected);
    });
  });
});

// Using helper function for parameterized tests
function testAdd(a, b, expected) {
  return function() {
    assert.equal(add(a, b), expected);
  };
}

describe('Math operations', function() {
  testAdd(1, 2, 3)();
  testAdd(5, 3, 8)();
  testAdd(10, 5, 15)();
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Parallel Testing</h3>
        <pre>
{`# Running tests in parallel
npx mocha --parallel --jobs 4    # Run with 4 parallel workers
npx mocha --parallel --jobs max   # Run with maximum available workers

// Parallel configuration
{
  "mocha": {
    "parallel": true,
    "jobs": 4
  }
}

# Limitations of parallel mode
- Tests must be self-contained
- No shared state between tests
- Root hooks don't work in parallel mode`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Browser Testing</h3>
        <pre>
{`// Running tests in browser
npx mocha --browser chrome
npx mocha --browser firefox
npx mocha --browser safari

// Browser configuration
{
  "mocha": {
    "browser": "chrome",
    "timeout": 10000
  }
}

// Browser-specific setup
describe('Browser tests', function() {
  before(function() {
    // Browser-specific setup
    if (typeof window !== 'undefined') {
      // Browser environment
    }
  });
  
  it('should work in browser', function() {
    // Browser-specific test
    assert.ok(document.getElementById('app'));
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