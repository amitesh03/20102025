import React, { useState, useEffect, useContext, useReducer, useRef, useMemo, useCallback } from 'react'
import './Fundamentals.css'

// Example 1: JSX and Basic Components
const JSXExample = () => {
  const name = "React Developer"
  const element = <h1>Hello, {name}!</h1>
  
  return (
    <div className="example-section">
      <h3>JSX and Basic Components</h3>
      <div className="code-block">
        <pre>{`const name = "React Developer"
const element = <h1>Hello, {name}!</h1>`}</pre>
      </div>
      <div className="demo-area">
        {element}
        <p>JSX allows you to write HTML-like syntax in JavaScript</p>
      </div>
    </div>
  )
}

// Example 2: Functional Components with Props
const Greeting = ({ name, message }) => {
  return (
    <div className="greeting">
      <h3>Hello, {name}!</h3>
      <p>{message}</p>
    </div>
  )
}

const PropsExample = () => {
  return (
    <div className="example-section">
      <h3>Props (Properties)</h3>
      <div className="code-block">
        <pre>{`const Greeting = ({ name, message }) => {
  return (
    <div>
      <h3>Hello, {name}!</h3>
      <p>{message}</p>
    </div>
  )
}

// Usage:
<Greeting name="Alice" message="Welcome to React!" />`}</pre>
      </div>
      <div className="demo-area">
        <Greeting name="Alice" message="Welcome to React!" />
        <Greeting name="Bob" message="Let's learn React together!" />
      </div>
    </div>
  )
}

// Example 3: useState Hook
const Counter = () => {
  const [count, setCount] = useState(0)
  
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(0)
  
  return (
    <div className="counter">
      <h3>Counter: {count}</h3>
      <div className="button-group">
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}

const StateExample = () => {
  const [text, setText] = useState("")
  const [isVisible, setIsVisible] = useState(true)
  
  return (
    <div className="example-section">
      <h3>useState Hook</h3>
      <div className="code-block">
        <pre>{`const [state, setState] = useState(initialValue)`}</pre>
      </div>
      <div className="demo-area">
        <div>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
          />
          <p>You typed: {text}</p>
        </div>
        <div>
          <button onClick={() => setIsVisible(!isVisible)}>
            Toggle Visibility
          </button>
          {isVisible && <p>This text can be toggled!</p>}
        </div>
        <Counter />
      </div>
    </div>
  )
}

// Example 4: useEffect Hook
const Timer = () => {
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  
  useEffect(() => {
    let interval = null
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1)
      }, 1000)
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval)
    }
    
    return () => clearInterval(interval)
  }, [isActive, seconds])
  
  const toggle = () => setIsActive(!isActive)
  const reset = () => {
    setSeconds(0)
    setIsActive(false)
  }
  
  return (
    <div className="timer">
      <h3>Timer: {seconds}s</h3>
      <div className="button-group">
        <button onClick={toggle}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}

const EffectExample = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData("Data fetched successfully!")
      setLoading(false)
    }, 2000)
  }, [])
  
  return (
    <div className="example-section">
      <h3>useEffect Hook</h3>
      <div className="code-block">
        <pre>{`useEffect(() => {
  // Side effect logic
  return () => {
    // Cleanup function
  }
}, [dependencies])`}</pre>
      </div>
      <div className="demo-area">
        <div>
          <h4>Timer Example:</h4>
          <Timer />
        </div>
        <div>
          <h4>Data Fetching Example:</h4>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <p>{data}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Example 5: Context API
const ThemeContext = React.createContext()

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

const ThemedComponent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  
  return (
    <div className={`themed-component ${theme}`}>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}

const ContextExample = () => {
  return (
    <div className="example-section">
      <h3>Context API</h3>
      <div className="code-block">
        <pre>{`const MyContext = React.createContext()

const MyProvider = ({ children }) => {
  const [value, setValue] = useState(initialValue)
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  )
}

const MyComponent = () => {
  const { value, setValue } = useContext(MyContext)
  // Use value and setValue
}`}</pre>
      </div>
      <div className="demo-area">
        <ThemeProvider>
          <ThemedComponent />
        </ThemeProvider>
      </div>
    </div>
  )
}

// Example 6: useReducer Hook
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return { count: 0 }
    default:
      return state
  }
}

const CounterWithReducer = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 })
  
  return (
    <div className="counter">
      <h3>Count: {state.count}</h3>
      <div className="button-group">
        <button onClick={() => dispatch({ type: 'increment' })}>+</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>
    </div>
  )
}

const ReducerExample = () => {
  return (
    <div className="example-section">
      <h3>useReducer Hook</h3>
      <div className="code-block">
        <pre>{`const reducer = (state, action) => {
  switch (action.type) {
    case 'action1':
      return newState1
    case 'action2':
      return newState2
    default:
      return state
  }
}

const [state, dispatch] = useReducer(reducer, initialState)`}</pre>
      </div>
      <div className="demo-area">
        <CounterWithReducer />
      </div>
    </div>
  )
}

// Example 7: useRef Hook
const FocusInput = () => {
  const inputRef = useRef(null)
  
  const focusInput = () => {
    inputRef.current.focus()
  }
  
  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Click the button to focus me" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  )
}

const RefExample = () => {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  
  const incrementState = () => {
    setCount(count + 1)
  }
  
  const incrementRef = () => {
    countRef.current = countRef.current + 1
    console.log("Ref count:", countRef.current)
  }
  
  return (
    <div className="example-section">
      <h3>useRef Hook</h3>
      <div className="code-block">
        <pre>{`const ref = useRef(initialValue)
// Access: ref.current`}</pre>
      </div>
      <div className="demo-area">
        <div>
          <h4>DOM Reference:</h4>
          <FocusInput />
        </div>
        <div>
          <h4>Mutable Value (doesn't trigger re-render):</h4>
          <p>State count: {count}</p>
          <p>Ref count: {countRef.current}</p>
          <button onClick={incrementState}>Increment State</button>
          <button onClick={incrementRef}>Increment Ref</button>
        </div>
      </div>
    </div>
  )
}

// Example 8: useMemo and useCallback
const ExpensiveComponent = ({ numbers }) => {
  const expensiveCalculation = useMemo(() => {
    console.log("Running expensive calculation...")
    return numbers.reduce((sum, num) => sum + num, 0)
  }, [numbers])
  
  return <p>Sum: {expensiveCalculation}</p>
}

const MemoCallbackExample = () => {
  const [count, setCount] = useState(0)
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5])
  
  const addNumber = useCallback(() => {
    setNumbers(prev => [...prev, prev.length + 1])
  }, [])
  
  return (
    <div className="example-section">
      <h3>useMemo and useCallback</h3>
      <div className="code-block">
        <pre>{`// Memoize expensive calculation
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b)
}, [a, b])

// Memoize function
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])`}</pre>
      </div>
      <div className="demo-area">
        <div>
          <h4>useMemo Example:</h4>
          <ExpensiveComponent numbers={numbers} />
          <button onClick={addNumber}>Add Number</button>
        </div>
        <div>
          <h4>useCallback Example:</h4>
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>Increment Count</button>
          <p>(Check console to see when expensive calculation runs)</p>
        </div>
      </div>
    </div>
  )
}

const Fundamentals = () => {
  return (
    <div className="fundamentals">
      <div className="example-container">
        <div className="example-header">
          <h2>React Fundamentals</h2>
          <p>Learn the core concepts of React including JSX, components, and hooks</p>
        </div>
        
        <JSXExample />
        <PropsExample />
        <StateExample />
        <EffectExample />
        <ContextExample />
        <ReducerExample />
        <RefExample />
        <MemoCallbackExample />
        
        <div className="exercise">
          <h4>Exercise:</h4>
          <p>Create a simple todo list application that uses useState to manage the list of todos, useEffect to save todos to localStorage, and useContext to share the todo list between components.</p>
        </div>
      </div>
    </div>
  )
}

export default Fundamentals