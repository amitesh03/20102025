import React, { useState } from 'react';
import _ from 'lodash';

const LodashExamples = () => {
  const [selectedExample, setSelectedExample] = useState('arrays');
  const [inputArray, setInputArray] = useState('[1, 2, 3, 4, 5]');
  const [inputObject, setInputObject] = useState('{"a": 1, "b": 2, "c": 3}');
  const [inputString, setInputString] = useState('hello world');
  const [result, setResult] = useState('');

  const handleArrayInputChange = (e) => {
    setInputArray(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      if (Array.isArray(parsed)) {
        setResult(JSON.stringify(_.chunk(parsed, 2)));
      }
    } catch (error) {
      // Invalid JSON
    }
  };

  const handleObjectInputChange = (e) => {
    setInputObject(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        setResult(JSON.stringify(_.keys(parsed)));
      }
    } catch (error) {
      // Invalid JSON
    }
  };

  const handleStringInputChange = (e) => {
    setInputString(e.target.value);
    setResult(_.capitalize(e.target.value));
  };

  const renderArrayExamples = () => (
    <div className="example-section">
      <h3>Array Operations</h3>
      <div className="code-example">
        <pre>{`// Chunk an array into chunks of specified size
_.chunk([1, 2, 3, 4, 5], 2) // ${JSON.stringify(_.chunk([1, 2, 3, 4, 5], 2))}

// Compact an array removing falsy values
_.compact([0, 1, false, 2, '', 3]) // ${JSON.stringify(_.compact([0, 1, false, 2, '', 3]))}

// Concatenate multiple arrays
_.concat([1], 2, [3], [[4]]) // ${JSON.stringify(_.concat([1], 2, [3], [[4]]))}

// Difference between arrays
_.difference([2, 1], [2, 3]) // ${JSON.stringify(_.difference([2, 1], [2, 3]))}

// Remove duplicate values from an array
_.uniq([2, 1, 2, 3, 1]) // ${JSON.stringify(_.uniq([2, 1, 2, 3, 1]))}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <textarea 
          value={inputArray} 
          onChange={handleArrayInputChange}
          placeholder="Enter an array (e.g., [1, 2, 3, 4, 5])"
          rows={3}
        />
        <div className="button-group">
          <button onClick={() => {
            try {
              const parsed = JSON.parse(inputArray);
              setResult(JSON.stringify(_.chunk(parsed, 2)));
            } catch (error) {
              setResult('Invalid JSON');
            }
          }}>
            Chunk (size 2)
          </button>
          <button onClick={() => {
            try {
              const parsed = JSON.parse(inputArray);
              setResult(JSON.stringify(_.compact(parsed)));
            } catch (error) {
              setResult('Invalid JSON');
            }
          }}>
            Compact
          </button>
          <button onClick={() => {
            try {
              const parsed = JSON.parse(inputArray);
              setResult(JSON.stringify(_.uniq(parsed)));
            } catch (error) {
              setResult('Invalid JSON');
            }
          }}>
            Unique
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderCollectionExamples = () => (
    <div className="example-section">
      <h3>Collection Operations</h3>
      <div className="code-example">
        <pre>{`// Map over a collection
_.map([1, 2, 3], n => n * 3) // ${JSON.stringify(_.map([1, 2, 3], n => n * 3))}

// Filter a collection
_.filter([1, 2, 3, 4, 5], n => n % 2 === 0) // ${JSON.stringify(_.filter([1, 2, 3, 4, 5], n => n % 2 === 0))}

// Reduce a collection
_.reduce([1, 2, 3], (sum, n) => sum + n, 0) // ${_.reduce([1, 2, 3], (sum, n) => sum + n, 0)}

// Find an element in a collection
_.find([1, 2, 3, 4, 5], n => n > 3) // ${_.find([1, 2, 3, 4, 5], n => n > 3)}

// Check if all elements pass a test
_.every([1, 2, 3, 4, 5], n => n < 10) // ${_.every([1, 2, 3, 4, 5], n => n < 10)}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <textarea 
          value={inputArray} 
          onChange={handleArrayInputChange}
          placeholder="Enter an array (e.g., [1, 2, 3, 4, 5])"
          rows={3}
        />
        <div className="button-group">
          <button onClick={() => {
            try {
              const parsed = JSON.parse(inputArray);
              setResult(JSON.stringify(_.map(parsed, n => n * 2)));
            } catch (error) {
              setResult('Invalid JSON');
            }
          }}>
            Map (x2)
          </button>
          <button onClick={() => {
            try {
              const parsed = JSON.parse(inputArray);
              setResult(JSON.stringify(_.filter(parsed, n => n > 2)));
            } catch (error) {
              setResult('Invalid JSON');
            }
          }}>
            Filter (&gt;2)
          </button>
          <button onClick={() => {
            try {
              const parsed = JSON.parse(inputArray);
              setResult(String(_.reduce(parsed, (sum, n) => sum + n, 0)));
            } catch (error) {
              setResult('Invalid JSON');
            }
          }}>
            Sum
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderObjectExamples = () => (
    <div className="example-section">
      <h3>Object Operations</h3>
      <div className="code-example">
        <pre>{`// Get all keys of an object
_.keys({a: 1, b: 2, c: 3}) // ${JSON.stringify(_.keys({a: 1, b: 2, c: 3}))}

// Get all values of an object
_.values({a: 1, b: 2, c: 3}) // ${JSON.stringify(_.values({a: 1, b: 2, c: 3}))}

// Convert object to array of [key, value] pairs
_.toPairs({a: 1, b: 2, c: 3}) // ${JSON.stringify(_.toPairs({a: 1, b: 2, c: 3}))}

// Pick specific properties from an object
_.pick({a: 1, b: 2, c: 3}, ['a', 'c']) // ${JSON.stringify(_.pick({a: 1, b: 2, c: 3}, ['a', 'c']))}

// Omit specific properties from an object
_.omit({a: 1, b: 2, c: 3}, ['b']) // ${JSON.stringify(_.omit({a: 1, b: 2, c: 3}, ['b']))}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <textarea 
          value={inputObject} 
          onChange={handleObjectInputChange}
          placeholder="Enter an object (e.g., {&quot;a&quot;: 1, &quot;b&quot;: 2, &quot;c&quot;: 3})"
          rows={3}
        />
        <div className="button-group">
          <button onClick={() => {
            try {
              const parsed = JSON.parse(inputObject);
              setResult(JSON.stringify(_.keys(parsed)));
            } catch (error) {
              setResult('Invalid JSON');
            }
          }}>
            Keys
          </button>
          <button onClick={() => {
            try {
              const parsed = JSON.parse(inputObject);
              setResult(JSON.stringify(_.values(parsed)));
            } catch (error) {
              setResult('Invalid JSON');
            }
          }}>
            Values
          </button>
          <button onClick={() => {
            try {
              const parsed = JSON.parse(inputObject);
              setResult(JSON.stringify(_.toPairs(parsed)));
            } catch (error) {
              setResult('Invalid JSON');
            }
          }}>
            To Pairs
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderStringExamples = () => (
    <div className="example-section">
      <h3>String Operations</h3>
      <div className="code-example">
        <pre>{`// Capitalize first character of a string
_.capitalize('hello') // "${_.capitalize('hello')}"

// Convert string to camel case
_.camelCase('hello world') // "${_.camelCase('hello world')}"

// Convert string to kebab case
_.kebabCase('hello world') // "${_.kebabCase('hello world')}"

// Convert string to snake case
_.snakeCase('hello world') // "${_.snakeCase('hello world')}"

// Convert string to start case
_.startCase('hello world') // "${_.startCase('hello world')}"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <input 
          type="text" 
          value={inputString} 
          onChange={handleStringInputChange}
          placeholder="Enter a string"
        />
        <div className="button-group">
          <button onClick={() => setResult(_.capitalize(inputString))}>
            Capitalize
          </button>
          <button onClick={() => setResult(_.camelCase(inputString))}>
            Camel Case
          </button>
          <button onClick={() => setResult(_.kebabCase(inputString))}>
            Kebab Case
          </button>
          <button onClick={() => setResult(_.snakeCase(inputString))}>
            Snake Case
          </button>
          <button onClick={() => setResult(_.startCase(inputString))}>
            Start Case
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderUtilityExamples = () => (
    <div className="example-section">
      <h3>Utility Functions</h3>
      <div className="code-example">
        <pre>{`// Deep clone an object
const obj = {a: 1, b: {c: 2}}
_.cloneDeep(obj) // ${JSON.stringify(_.cloneDeep({a: 1, b: {c: 2}}))}

// Check if a value is empty
_.isEmpty({}) // ${_.isEmpty({})}
_.isEmpty([]) // ${_.isEmpty([])}
_.isEmpty('') // ${_.isEmpty('')}

// Check if a value is a function
_.isFunction(() => {}) // ${_.isFunction(() => {})}

// Check if a value is an object
_.isObject({}) // ${_.isObject({})}
_.isObject([1, 2, 3]) // ${_.isObject([1, 2, 3])}

// Random number between min and max
_.random(0, 10) // ${_.random(0, 10)}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => setResult(String(_.random(1, 100)))}>
            Random (1-100)
          </button>
          <button onClick={() => setResult(String(_.isEmpty({})))}>
            Is Empty Object
          </button>
          <button onClick={() => setResult(String(_.isEmpty([])))}>
            Is Empty Array
          </button>
          <button onClick={() => setResult(String(_.isEmpty('')))}>
            Is Empty String
          </button>
          <button onClick={() => setResult(String(_.isObject({})))}>
            Is Object
          </button>
          <button onClick={() => setResult(String(_.isFunction(() => {})))}>
            Is Function
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  const renderFunctionExamples = () => (
    <div className="example-section">
      <h3>Function Utilities</h3>
      <div className="code-example">
        <pre>{`// Debounce a function
const debouncedFn = _.debounce(() => console.log('Debounced'), 300)

// Throttle a function
const throttledFn = _.throttle(() => console.log('Throttled'), 300)

// Create a function that only calls once
const onceFn = _.once(() => console.log('Called once'))

// Create a function with a specific context
const boundFn = _.bind(function(greeting) { 
  return greeting + ' ' + this.name; 
}, {name: 'John'}, 'Hello')

// Memoize a function
const memoizedFn = _.memoize(n => n * n)`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            const memoized = _.memoize(n => n * n);
            setResult(`5² = ${memoized(5)}, 5² = ${memoized(5)} (cached)`);
          }}>
            Memoize
          </button>
          <button onClick={() => {
            let count = 0;
            const onceFn = _.once(() => ++count);
            onceFn();
            onceFn();
            setResult(`Called once, count = ${count}`);
          }}>
            Once
          </button>
          <button onClick={() => {
            const bound = _.bind(function(greeting) { 
              return greeting + ' ' + this.name; 
            }, {name: 'React'}, 'Hello');
            setResult(bound());
          }}>
            Bind
          </button>
        </div>
        <div className="result">
          <p>Result: {result}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="library-examples">
      <h2>Lodash Examples</h2>
      <p>Lodash is a modern JavaScript utility library delivering modularity, performance, and extras.</p>
      
      <div className="example-navigation">
        <button 
          className={selectedExample === 'arrays' ? 'active' : ''}
          onClick={() => setSelectedExample('arrays')}
        >
          Arrays
        </button>
        <button 
          className={selectedExample === 'collections' ? 'active' : ''}
          onClick={() => setSelectedExample('collections')}
        >
          Collections
        </button>
        <button 
          className={selectedExample === 'objects' ? 'active' : ''}
          onClick={() => setSelectedExample('objects')}
        >
          Objects
        </button>
        <button 
          className={selectedExample === 'strings' ? 'active' : ''}
          onClick={() => setSelectedExample('strings')}
        >
          Strings
        </button>
        <button 
          className={selectedExample === 'utility' ? 'active' : ''}
          onClick={() => setSelectedExample('utility')}
        >
          Utilities
        </button>
        <button 
          className={selectedExample === 'functions' ? 'active' : ''}
          onClick={() => setSelectedExample('functions')}
        >
          Functions
        </button>
      </div>

      <div className="example-content">
        {selectedExample === 'arrays' && renderArrayExamples()}
        {selectedExample === 'collections' && renderCollectionExamples()}
        {selectedExample === 'objects' && renderObjectExamples()}
        {selectedExample === 'strings' && renderStringExamples()}
        {selectedExample === 'utility' && renderUtilityExamples()}
        {selectedExample === 'functions' && renderFunctionExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install lodash</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://lodash.com/" target="_blank" rel="noopener noreferrer">Official Documentation</a></li>
          <li><a href="https://github.com/lodash/lodash" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default LodashExamples;