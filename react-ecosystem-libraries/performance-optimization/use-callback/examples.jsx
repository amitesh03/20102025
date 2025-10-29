/**
 * React useCallback Examples
 * 
 * useCallback() is a hook that returns a memoized callback function.
 * It's useful for optimizing performance by preventing unnecessary
 * re-creations of functions, especially when passed as props to child components.
 */

// Example 1: Basic useCallback usage
/*
// components/Counter.js
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  // Without useCallback, this function is recreated on every render
  const handleIncrement = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}

export default Counter;

// components/OptimizedCounter.js
import React, { useState, useCallback } from 'react';

function OptimizedCounter() {
  const [count, setCount] = useState(0);
  
  // With useCallback, this function is memoized and only recreated
  // when its dependencies change (none in this case)
  const handleIncrement = useCallback(() => {
    setCount(count + 1);
  }, [count]);
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}

export default OptimizedCounter;
*/

// Example 2: useCallback with dependencies
/*
// components/UserProfile.js
import React, { useState, useCallback } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // This function will be recreated only when userId changes
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  if (loading) {
    return <div>Loading user data...</div>;
  }
  
  if (!user) {
    return <div>No user data found.</div>;
  }
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <button onClick={fetchUser}>Refresh</button>
    </div>
  );
}

export default UserProfile;
*/

// Example 3: useCallback with event handlers
/*
// components/TodoList.js
import React, { useState, useCallback } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);
  
  // These functions are memoized and won't cause unnecessary re-renders
  const handleToggle = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);
  
  const handleDelete = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);
  
  const handleAdd = useCallback((text) => {
    if (text.trim()) {
      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
    }
  }, []);
  
  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <AddTodoForm onAdd={handleAdd} />
    </div>
  );
}

// components/AddTodoForm.js
import React, { useState, useCallback } from 'react';

function AddTodoForm({ onAdd }) {
  const [text, setText] = useState('');
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onAdd(text);
    setText('');
  }, [onAdd, text]);
  
  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Add new todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodoForm;
*/

// Example 4: useCallback with complex objects
/*
// components/DataProcessor.js
import React, { useState, useCallback, useMemo } from 'react';

function DataProcessor({ data }) {
  const [processedData, setProcessedData] = useState([]);
  const [processing, setProcessing] = useState(false);
  
  // Memoize the processing function
  const processData = useCallback((rawData) => {
    console.log('Processing data...');
    return rawData.map(item => ({
      ...item,
      processed: item.value * 2,
      category: item.value > 50 ? 'high' : 'low',
      timestamp: Date.now()
    }));
  }, []);
  
  // Memoize the expensive calculation
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);
  
  const handleProcess = useCallback(async () => {
    setProcessing(true);
    try {
      // Simulate async processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = processData(data);
      setProcessedData(result);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setProcessing(false);
    }
  }, [data, processData]);
  
  return (
    <div>
      <h2>Data Processor</h2>
      <p>Total: {total}</p>
      <button onClick={handleProcess} disabled={processing}>
        {processing ? 'Processing...' : 'Process Data'}
      </button>
      
      {processedData.length > 0 && (
        <div>
          <h3>Processed Results:</h3>
          <ul>
            {processedData.map(item => (
              <li key={item.id}>
                {item.name}: {item.processed} ({item.category})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DataProcessor;
*/

// Example 5: useCallback with custom comparison
/*
// utils/useCallbackWithComparison.js
import { useCallback } from 'react';

// Custom hook that extends useCallback with comparison
export const useCallbackWithComparison = (fn, deps, compareFn) => {
  const ref = React.useRef();
  
  if (!ref.current || !compareFn(deps, ref.current.deps)) {
    ref.current = {
      fn: useCallback(fn, deps),
      deps
    };
  }
  
  return ref.current.fn;
};

// components/ExpensiveComponent.js
import React, { useState } from 'react';
import { useCallbackWithComparison } from '../utils/useCallbackWithComparison';

function ExpensiveComponent({ config }) {
  const [result, setResult] = useState(null);
  
  // Custom comparison function for complex objects
  const areConfigsEqual = (prevConfig, nextConfig) => {
    return (
      prevConfig.threshold === nextConfig.threshold &&
      prevConfig.options.length === nextConfig.options.length &&
      prevConfig.options.every((option, index) => 
        option.value === nextConfig.options[index].value
      )
    );
  };
  
  // This will only be recreated when config actually changes
  const processConfig = useCallbackWithComparison(
    (currentConfig) => {
      console.log('Processing expensive configuration...');
      const result = currentConfig.options
        .filter(option => option.value > currentConfig.threshold)
        .reduce((sum, option) => sum + option.value, 0);
      
      setResult(result);
      return result;
    },
    [config],
    areConfigsEqual
  );
  
  React.useEffect(() => {
    processConfig();
  }, [processConfig]);
  
  return (
    <div>
      <h2>Expensive Component</h2>
      <p>Result: {result}</p>
    </div>
  );
}

export default ExpensiveComponent;
*/

// Example 6: useCallback with debouncing
/*
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

export const useDebounce = (callback, delay) => {
  const [debouncedCallback, setDebouncedCallback] = useState(null);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback());
    }, delay);
    
    return () => clearTimeout(handler);
  }, [callback, delay]);
  
  return debouncedCallback;
};

// components/SearchInput.js
import React, { useState, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';

function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('');
  
  // Debounce the search function to avoid excessive API calls
  const debouncedSearch = useDebounce(
    (searchQuery) => {
      onSearch(searchQuery);
    },
    500 // 500ms delay
  );
  
  const handleChange = useCallback((e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  }, [debouncedSearch]);
  
  return (
    <div>
      <h2>Search</h2>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
      />
      <p>Current query: {query}</p>
    </div>
  );
}

export default SearchInput;
*/

// Example 7: useCallback with throttling
/*
// hooks/useThrottle.js
import { useState, useEffect } from 'react';

export const useThrottle = (callback, delay) => {
  const [throttledCallback, setThrottledCallback] = useState(null);
  const lastRun = React.useRef(Date.now());
  
  useEffect(() => {
    const handler = () => {
      if (Date.now() - lastRun.current >= delay) {
        lastRun.current = Date.now();
        setThrottledCallback(() => callback());
      }
    };
    
    const interval = setInterval(handler, 50);
    
    return () => clearInterval(interval);
  }, [callback, delay]);
  
  return throttledCallback;
};

// components/ScrollHandler.js
import React, { useState, useCallback } from 'react';
import { useThrottle } from '../hooks/useThrottle';

function ScrollHandler() {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  
  // Throttle scroll events to improve performance
  const throttledHandleScroll = useThrottle(
    () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY
      });
    },
    100 // 100ms throttle
  );
  
  const handleScroll = useCallback(() => {
    throttledHandleScroll();
  }, [throttledHandleScroll]);
  
  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  
  return (
    <div>
      <h2>Scroll Position</h2>
      <p>X: {scrollPosition.x}, Y: {scrollPosition.y}</p>
    </div>
  );
}

export default ScrollHandler;
*/

// Example 8: useCallback with memoization
/*
// utils/memoizedCallback.js
import { useCallback, useRef } from 'react';

export const useMemoizedCallback = (fn, deps) => {
  const memoizedRef = useRef();
  
  if (!memoizedRef.current || !deps.every((dep, index) => dep === memoizedRef.current.deps[index])) {
    memoizedRef.current = {
      fn: useCallback(fn, deps),
      deps: [...deps]
    };
  }
  
  return memoizedRef.current.fn;
};

// components/MemoizedFunctions.js
import React, { useState } from 'react';
import { useMemoizedCallback } from '../utils/memoizedCallback';

function MemoizedFunctions() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  
  // Memoized functions that won't be recreated unnecessarily
  const increment = useMemoizedCallback(
    () => setCount(prev => prev + 1),
    []
  );
  
  const fetchData = useMemoizedCallback(
    async () => {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    },
    []
  );
  
  return (
    <div>
      <h2>Memoized Functions</h2>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={fetchData}>Fetch Data</button>
      
      {data.length > 0 && (
        <div>
          <h3>Data:</h3>
          <ul>
            {data.slice(0, 5).map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MemoizedFunctions;
*/

// Example 9: useCallback with TypeScript
/*
// components/TypedButton.tsx
import React, { useCallback } from 'react';

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const TypedButton: React.FC<ButtonProps> = ({ onClick, children, disabled = false, variant = 'primary' }) => {
  // Memoized click handler with TypeScript
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onClick(event);
    }
  }, [onClick, disabled]);
  
  const getButtonStyles = useCallback(() => {
    const baseStyles = {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 'bold'
    };
    
    const variantStyles = {
      primary: {
        backgroundColor: '#007bff',
        color: 'white'
      },
      secondary: {
        backgroundColor: '#6c757d',
        color: 'white'
      }
    };
    
    return {
      ...baseStyles,
      ...variantStyles[variant]
    };
  }, [disabled, variant]);
  
  return (
    <button 
      onClick={handleClick}
      disabled={disabled}
      style={getButtonStyles()}
    >
      {children}
    </button>
  );
};

export default TypedButton;

// App.tsx
import React, { useState } from 'react';
import TypedButton from './components/TypedButton';

interface User {
  id: number;
  name: string;
}

function App() {
  const [user, setUser] = useState<User>({ id: 1, name: 'John Doe' });
  
  const handleButtonClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked:', event.currentTarget);
  }, []);
  
  const handleUserUpdate = useCallback(() => {
    setUser(prev => ({ ...prev, name: 'Jane Smith' }));
  }, []);
  
  return (
    <div>
      <h1>TypeScript useCallback Example</h1>
      <p>User: {user.name}</p>
      
      <TypedButton 
        onClick={handleButtonClick}
        variant="primary"
      >
        Click Me
      </TypedButton>
      
      <TypedButton 
        onClick={handleUserUpdate}
        variant="secondary"
      >
        Update User
      </TypedButton>
    </div>
  );
}

export default App;
*/

// Example 10: Advanced useCallback patterns
/*
// hooks/useStableCallback.js
import { useCallback, useRef } from 'react';

// Hook that ensures callback stability across renders
export const useStableCallback = (callback) => {
  const callbackRef = useRef(callback);
  
  // Update the ref if callback changes
  if (callback !== callbackRef.current) {
    callbackRef.current = callback;
  }
  
  // Return a stable function that calls the latest callback
  return useCallback((...args) => callbackRef.current(...args), []);
};

// components/StableCallbackExample.js
import React, { useState, useEffect } from 'react';
import { useStableCallback } from '../hooks/useStableCallback';

function StableCallbackExample() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  
  // Stable callback that won't cause re-renders
  const handleDataUpdate = useStableCallback((newData) => {
    console.log('Data updated:', newData);
    setData(newData);
  });
  
  // Effect that uses the stable callback
  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      handleDataUpdate([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [handleDataUpdate]);
  
  return (
    <div>
      <h2>Stable Callback Example</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      
      <div>
        <h3>Data:</h3>
        {data.length > 0 ? (
          <ul>
            {data.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default StableCallbackExample;
*/

export const useCallbackExamples = {
  description: "Examples of using React useCallback() for optimizing function creation",
  concepts: [
    "useCallback() - Hook for memoizing functions",
    "Dependency array - Controls when function is recreated",
    "Event handlers - Common use case for useCallback",
    "Performance optimization - Preventing unnecessary re-renders"
  ],
  benefits: [
    "Prevents unnecessary function recreations",
    "Improves child component performance",
    "Reduces garbage collection pressure",
    "Stabilizes references for equality checks",
    "Optimizes event handling"
  ],
  whenToUse: [
    "Functions passed to child components",
    "Event handlers in frequently re-rendering components",
    "Functions with expensive computations",
    "Callbacks in dependency arrays",
    "Functions that need stable references"
  ],
  whenNotToUse: [
    "Simple functions with no performance impact",
    "Functions that change on every render",
    "Functions used only once in component lifecycle",
    "Functions without stable dependencies"
  ],
  bestPractices: [
    "Include all dependencies in the dependency array",
    "Use useCallback for event handlers",
    "Combine with useMemo for complex operations",
    "Consider custom comparison functions",
    "Profile to identify optimization opportunities"
  ]
};