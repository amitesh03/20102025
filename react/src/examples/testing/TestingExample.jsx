import React, { useState } from 'react'
import './TestingExample.css'

// Example Components for Testing

// Simple Counter Component
const Counter = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount)
  
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(initialCount)
  
  return (
    <div className="counter" data-testid="counter">
      <h2 data-testid="counter-title">Counter</h2>
      <div data-testid="count-display">{count}</div>
      <div className="counter-controls">
        <button 
          onClick={decrement} 
          data-testid="decrement-button"
          aria-label="Decrement count"
        >
          -
        </button>
        <button 
          onClick={reset} 
          data-testid="reset-button"
          aria-label="Reset count"
        >
          Reset
        </button>
        <button 
          onClick={increment} 
          data-testid="increment-button"
          aria-label="Increment count"
        >
          +
        </button>
      </div>
    </div>
  )
}

// Form Component
const UserForm = ({ onSubmit }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  
  const validate = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({ name, email })
      setName('')
      setEmail('')
      setErrors({})
    }
  }
  
  return (
    <form 
      className="user-form" 
      data-testid="user-form"
      onSubmit={handleSubmit}
    >
      <h2 data-testid="form-title">User Form</h2>
      
      <div className="form-group">
        <label htmlFor="name" data-testid="name-label">Name:</label>
        <input
          id="name"
          type="text"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <div 
            id="name-error" 
            data-testid="name-error"
            role="alert"
          >
            {errors.name}
          </div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="email" data-testid="email-label">Email:</label>
        <input
          id="email"
          type="email"
          data-testid="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <div 
            id="email-error" 
            data-testid="email-error"
            role="alert"
          >
            {errors.email}
          </div>
        )}
      </div>
      
      <button 
        type="submit" 
        data-testid="submit-button"
        aria-label="Submit form"
      >
        Submit
      </button>
    </form>
  )
}

// Todo List Component
const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn testing', completed: false },
    { id: 2, text: 'Write tests', completed: true },
  ])
  const [inputValue, setInputValue] = useState('')
  
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false }
      ])
      setInputValue('')
    }
  }
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }
  
  return (
    <div className="todo-list" data-testid="todo-list">
      <h2 data-testid="todo-title">Todo List</h2>
      
      <div className="todo-input">
        <input
          type="text"
          data-testid="todo-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          aria-label="New todo input"
        />
        <button 
          onClick={addTodo}
          data-testid="add-todo-button"
          aria-label="Add new todo"
        >
          Add
        </button>
      </div>
      
      <ul data-testid="todo-items">
        {todos.map(todo => (
          <li 
            key={todo.id} 
            data-testid={`todo-item-${todo.id}`}
            className={todo.completed ? 'completed' : ''}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              data-testid={`todo-checkbox-${todo.id}`}
              aria-label={`Toggle todo: ${todo.text}`}
            />
            <span data-testid={`todo-text-${todo.id}`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              data-testid={`delete-button-${todo.id}`}
              aria-label={`Delete todo: ${todo.text}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      <div data-testid="todo-count">
        Total todos: {todos.length} | 
        Completed: {todos.filter(todo => todo.completed).length}
      </div>
    </div>
  )
}

// Async Component
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fetchUser = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (userId === 'error') {
        throw new Error('User not found')
      }
      
      setUser({
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        avatar: `https://picsum.photos/seed/user${userId}/100/100.jpg`
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="user-profile" data-testid="user-profile">
      <h2 data-testid="profile-title">User Profile</h2>
      
      <div className="profile-controls">
        <input
          type="text"
          data-testid="user-id-input"
          value={userId}
          readOnly
          aria-label="User ID"
        />
        <button
          onClick={fetchUser}
          data-testid="fetch-user-button"
          disabled={loading}
          aria-label="Fetch user data"
        >
          {loading ? 'Loading...' : 'Fetch User'}
        </button>
      </div>
      
      {loading && (
        <div data-testid="loading-indicator" aria-live="polite">
          Loading user data...
        </div>
      )}
      
      {error && (
        <div 
          data-testid="error-message" 
          role="alert"
          aria-live="assertive"
        >
          Error: {error}
        </div>
      )}
      
      {user && (
        <div data-testid="user-info">
          <img
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            data-testid="user-avatar"
          />
          <h3 data-testid="user-name">{user.name}</h3>
          <p data-testid="user-email">{user.email}</p>
        </div>
      )}
    </div>
  )
}

// Custom Hook Component
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue)
  
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(initialValue)
  
  return { count, increment, decrement, reset }
}

const CustomHookExample = () => {
  const { count, increment, decrement, reset } = useCounter(5)
  
  return (
    <div className="custom-hook-example" data-testid="custom-hook-example">
      <h2 data-testid="custom-hook-title">Custom Hook Example</h2>
      <div data-testid="custom-count">{count}</div>
      <button onClick={increment} data-testid="custom-increment">
        Increment
      </button>
      <button onClick={decrement} data-testid="custom-decrement">
        Decrement
      </button>
      <button onClick={reset} data-testid="custom-reset">
        Reset
      </button>
    </div>
  )
}

// Main Testing Example Component
const TestingExample = () => {
  const [activeTab, setActiveTab] = useState('counter')
  const [userId, setUserId] = useState('1')
  const [formSubmitted, setFormSubmitted] = useState(null)
  
  const handleFormSubmit = (data) => {
    setFormSubmitted(data)
  }
  
  return (
    <div className="testing-example">
      <div className="example-container">
        <div className="example-header">
          <h2>React Testing Examples</h2>
          <p>Learn testing strategies and best practices with React Testing Library</p>
        </div>
        
        <div className="example-section">
          <h3>Basic Testing Setup</h3>
          <div className="code-block">
            <pre>{`import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

test('renders counter with initial value', () => {
  render(<Counter initialCount={5} />)
  expect(screen.getByTestId('count-display')).toHaveTextContent('5')
})

test('increments count when button is clicked', async () => {
  const user = userEvent.setup()
  render(<Counter />)
  
  await user.click(screen.getByTestId('increment-button'))
  expect(screen.getByTestId('count-display')).toHaveTextContent('1')
})`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Form Testing</h3>
          <div className="code-block">
            <pre>{`test('submits form with valid data', async () => {
  const handleSubmit = jest.fn()
  const user = userEvent.setup()
  
  render(<UserForm onSubmit={handleSubmit} />)
  
  await user.type(screen.getByTestId('name-input'), 'John Doe')
  await user.type(screen.getByTestId('email-input'), 'john@example.com')
  await user.click(screen.getByTestId('submit-button'))
  
  expect(handleSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com'
  })
})`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Async Testing</h3>
          <div className="code-block">
            <pre>{`test('displays loading state while fetching', async () => {
  render(<UserProfile userId="1" />)
  
  await userEvent.click(screen.getByTestId('fetch-user-button'))
  
  expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.getByTestId('user-name')).toBeInTheDocument()
  })
})`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Interactive Examples</h3>
          <div className="tab-navigation">
            <button 
              className={activeTab === 'counter' ? 'active' : ''}
              onClick={() => setActiveTab('counter')}
            >
              Counter
            </button>
            <button 
              className={activeTab === 'form' ? 'active' : ''}
              onClick={() => setActiveTab('form')}
            >
              Form
            </button>
            <button 
              className={activeTab === 'todo' ? 'active' : ''}
              onClick={() => setActiveTab('todo')}
            >
              Todo List
            </button>
            <button 
              className={activeTab === 'async' ? 'active' : ''}
              onClick={() => setActiveTab('async')}
            >
              Async
            </button>
            <button 
              className={activeTab === 'custom-hook' ? 'active' : ''}
              onClick={() => setActiveTab('custom-hook')}
            >
              Custom Hook
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'counter' && <Counter />}
            
            {activeTab === 'form' && (
              <div>
                <UserForm onSubmit={handleFormSubmit} />
                {formSubmitted && (
                  <div data-testid="form-submitted-data">
                    <h3>Form Submitted:</h3>
                    <pre>{JSON.stringify(formSubmitted, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'todo' && <TodoList />}
            
            {activeTab === 'async' && (
              <div>
                <div className="user-id-selector">
                  <label>User ID:</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID or 'error' to test error state"
                  />
                </div>
                <UserProfile userId={userId} />
              </div>
            )}
            
            {activeTab === 'custom-hook' && <CustomHookExample />}
          </div>
        </div>
        
        <div className="exercise">
          <h4>Exercise:</h4>
          <p>Create comprehensive tests for a React application:</p>
          <ul>
            <li>Write unit tests for utility functions</li>
            <li>Test component rendering with different props</li>
            <li>Test user interactions and form submissions</li>
            <li>Test async operations and loading states</li>
            <li>Test error handling and edge cases</li>
            <li>Write integration tests for component interactions</li>
            <li>Mock API calls and external dependencies</li>
            <li>Achieve good test coverage</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TestingExample