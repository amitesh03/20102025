// React Core Examples with Detailed Comments
// This file demonstrates various React concepts with comprehensive explanations

import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';

// ===== EXAMPLE 1: BASIC FUNCTIONAL COMPONENT =====
/**
 * Basic functional component demonstrating JSX syntax and props
 * Props are read-only attributes passed from parent to child components
 */
function Welcome(props) {
  // JSX allows us to write HTML-like syntax in JavaScript
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Welcome to React learning journey</p>
    </div>
  );
}

// ===== EXAMPLE 2: COMPONENT WITH STATE =====
/**
 * Counter component demonstrating useState hook for state management
 * useState returns a stateful value and a function to update it
 */
function Counter() {
  // Declare a state variable 'count' initialized to 0
  // setCount is the function to update the count value
  const [count, setCount] = useState(0);

  // Event handler function to increment counter
  const handleIncrement = () => {
    // Use the updater function to ensure we get the latest state
    setCount(prevCount => prevCount + 1);
  };

  // Event handler function to decrement counter
  const handleDecrement = () => {
    setCount(prevCount => prevCount - 1);
  };

  // Event handler function to reset counter
  const handleReset = () => {
    setCount(0);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Counter Example</h2>
      <p>Current count: <strong>{count}</strong></p>
      
      {/* Event handlers attached to button onClick events */}
      <button onClick={handleIncrement}>Increment (+1)</button>
      <button onClick={handleDecrement} style={{ margin: '0 10px' }}>Decrement (-1)</button>
      <button onClick={handleReset}>Reset</button>
      
      {/* Conditional rendering based on count value */}
      {count > 10 && <p style={{ color: 'red' }}>Count is getting high!</p>}
    </div>
  );
}

// ===== EXAMPLE 3: COMPONENT WITH SIDE EFFECTS =====
/**
 * Timer component demonstrating useEffect hook for side effects
 * useEffect runs after every render by default, or when dependencies change
 */
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // useEffect to handle the timer logic
  useEffect(() => {
    let interval = null;

    // Only set up interval when timer is active
    if (isActive) {
      // Set up interval to increment seconds every 1000ms (1 second)
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      // Clear interval when timer is stopped
      clearInterval(interval);
    }

    // Cleanup function: runs when component unmounts or before re-running effect
    return () => clearInterval(interval);
  }, [isActive, seconds]); // Dependency array: effect runs when these values change

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsActive(false);
  };

  // Format seconds into MM:SS format
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Timer Example</h2>
      <div style={{ fontSize: '2rem', margin: '20px 0' }}>
        {formatTime(seconds)}
      </div>
      <button onClick={toggleTimer}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={resetTimer} style={{ marginLeft: '10px' }}>
        Reset
      </button>
    </div>
  );
}

// ===== EXAMPLE 4: CONTEXT API =====
/**
 * Context example demonstrating how to share state across components
 * Context provides a way to pass data through the component tree without props drilling
 */

// Create a context with default value
const ThemeContext = React.createContext('light');

// Provider component to wrap parts of the app that need access to the context
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // Value object that will be provided to consuming components
  const value = {
    theme,
    toggleTheme: () => {
      setTheme(currentTheme => currentTheme === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to consume the theme context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Component that consumes the theme context
function ThemedButton() {
  const { theme, toggleTheme } = useTheme();

  // Apply different styles based on theme
  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: theme === 'light' ? '#ffffff' : '#333333',
    color: theme === 'light' ? '#333333' : '#ffffff',
    border: `2px solid ${theme === 'light' ? '#333333' : '#ffffff'}`,
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <button style={buttonStyle} onClick={toggleTheme}>
      Toggle Theme (Current: {theme})
    </button>
  );
}

// ===== EXAMPLE 5: FORM HANDLING =====
/**
 * Form component demonstrating controlled components and form state management
 * In React, form elements typically maintain their own state
 */
function ContactForm() {
  // Initialize form state with empty values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false
  });

  // State for form submission status
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes for text inputs and textarea
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    
    // Log form data (in real app, this would be sent to a server)
    console.log('Form submitted:', formData);
    
    // Set submission status
    setIsSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        message: '',
        subscribe: false
      });
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <h2>Contact Form</h2>
      
      {isSubmitted ? (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px' }}>
          Form submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>
              <input
                type="checkbox"
                name="subscribe"
                checked={formData.subscribe}
                onChange={handleCheckboxChange}
                style={{ marginRight: '8px' }}
              />
              Subscribe to newsletter
            </label>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

// ===== EXAMPLE 6: PERFORMANCE OPTIMIZATION =====
/**
 * Example demonstrating performance optimization techniques
 * useMemo and useCallback help prevent unnecessary re-renders
 */
function ExpensiveCalculation({ number }) {
  // useMemo caches the result of expensive calculation
  // Only recalculates when 'number' changes
  const expensiveValue = useMemo(() => {
    console.log('Performing expensive calculation...');
    let result = 0;
    for (let i = 0; i < number * 1000000; i++) {
      result += i;
    }
    return result;
  }, [number]); // Dependency array: only recalculate when number changes

  return (
    <div>
      <p>Input number: {number}</p>
      <p>Expensive calculation result: {expensiveValue.toLocaleString()}</p>
    </div>
  );
}

function OptimizedComponent() {
  const [count, setCount] = useState(1);
  const [otherState, setOtherState] = useState(0);

  // useCallback memoizes the function definition
  // Only creates new function when 'count' changes
  const handleIncrement = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // Empty dependency array means function never changes

  return (
    <div style={{ padding: '20px' }}>
      <h2>Performance Optimization Example</h2>
      
      <button onClick={handleIncrement}>Increment Count</button>
      <button 
        onClick={() => setOtherState(prev => prev + 1)} 
        style={{ marginLeft: '10px' }}
      >
        Update Other State
      </button>
      
      <p>Count: {count}</p>
      <p>Other State: {otherState}</p>
      
      {/* ExpensiveCalculation will only re-render when count changes */}
      <ExpensiveCalculation number={count} />
    </div>
  );
}

// ===== EXAMPLE 7: REFS =====
/**
 * Example demonstrating useRef hook for accessing DOM elements
 * Refs provide a way to access DOM nodes directly
 */
function FocusInput() {
  // Create a ref to store reference to input element
  const inputRef = useRef(null);

  const focusInput = () => {
    // Access the DOM element directly using the ref
    inputRef.current.focus();
  };

  const clearInput = () => {
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ref Example</h2>
      <input
        ref={inputRef} // Attach ref to input element
        type="text"
        placeholder="Type something here..."
        style={{ padding: '8px', marginRight: '10px' }}
      />
      <button onClick={focusInput}>Focus Input</button>
      <button onClick={clearInput} style={{ marginLeft: '10px' }}>
        Clear & Focus
      </button>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all the examples
 */
function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>React Core Concepts Examples</h1>
      
      {/* Basic component example */}
      <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <Welcome name="React Developer" />
      </section>

      {/* State management example */}
      <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <Counter />
      </section>

      {/* Side effects example */}
      <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <Timer />
      </section>

      {/* Context API example */}
      <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <ThemeProvider>
          <ThemedButton />
        </ThemeProvider>
      </section>

      {/* Form handling example */}
      <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <ContactForm />
      </section>

      {/* Performance optimization example */}
      <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <OptimizedComponent />
      </section>

      {/* Refs example */}
      <section style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd' }}>
        <FocusInput />
      </section>
    </div>
  );
}

export default App;