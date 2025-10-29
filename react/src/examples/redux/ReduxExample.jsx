import React, { useState } from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import './ReduxExample.css'

// Example 1: Basic Redux Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
    reset: state => {
      state.value = 0
    }
  }
})

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions

// Example 2: Todo Slice
const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [
      { id: 1, text: 'Learn Redux Toolkit', completed: false },
      { id: 2, text: 'Build a React app', completed: true }
    ],
    filter: 'all' // all, active, completed
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      })
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(todo => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter(todo => todo.id !== action.payload)
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    }
  }
})

export const { addTodo, toggleTodo, deleteTodo, setFilter } = todoSlice.actions

// Example 3: Async Thunk for API calls
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Redux Toolkit is Awesome', body: 'Learn how to use Redux Toolkit' },
        { id: 2, title: 'React Hooks', body: 'Understanding React Hooks' },
        { id: 3, title: 'State Management', body: 'Different approaches to state management' }
      ])
    }, 1000)
  })
})

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

// Example 4: User Profile Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'React Developer'
    },
    preferences: {
      theme: 'light',
      language: 'en'
    }
  },
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload }
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload }
    }
  }
})

export const { updateProfile, updatePreferences } = userSlice.actions

// Configure Store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    todos: todoSlice.reducer,
    posts: postsSlice.reducer,
    user: userSlice.reducer
  }
})

// Example Components

// Counter Component
const Counter = () => {
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()
  const [incrementAmount, setIncrementAmount] = useState(2)
  
  return (
    <div className="counter-example">
      <h3>Counter Example</h3>
      <div className="counter-display">
        <span className="count">{count}</span>
      </div>
      <div className="counter-controls">
        <button onClick={() => dispatch(decrement())}>-</button>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(reset())}>Reset</button>
      </div>
      <div className="increment-by-amount">
        <input 
          type="number" 
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value))}
        />
        <button onClick={() => dispatch(incrementByAmount(incrementAmount))}>
          Add Amount
        </button>
      </div>
    </div>
  )
}

// Todo Components
const TodoItem = ({ todo }) => {
  const dispatch = useDispatch()
  
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => dispatch(toggleTodo(todo.id))}
      />
      <span className="todo-text">{todo.text}</span>
      <button 
        className="delete-btn"
        onClick={() => dispatch(deleteTodo(todo.id))}
      >
        Delete
      </button>
    </div>
  )
}

const TodoList = () => {
  const { items, filter } = useSelector(state => state.todos)
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  
  const filteredTodos = items.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })
  
  const handleAddTodo = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      dispatch(addTodo(inputValue))
      setInputValue('')
    }
  }
  
  return (
    <div className="todo-example">
      <h3>Todo List Example</h3>
      <form onSubmit={handleAddTodo} className="todo-form">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button type="submit">Add</button>
      </form>
      
      <div className="todo-filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => dispatch(setFilter('all'))}
        >
          All
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''}
          onClick={() => dispatch(setFilter('active'))}
        >
          Active
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => dispatch(setFilter('completed'))}
        >
          Completed
        </button>
      </div>
      
      <div className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  )
}

// Posts Component with Async Thunk
const PostsList = () => {
  const { items, status, error } = useSelector(state => state.posts)
  const dispatch = useDispatch()
  
  return (
    <div className="posts-example">
      <h3>Async Data Fetching Example</h3>
      <button 
        onClick={() => dispatch(fetchPosts())}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Loading...' : 'Fetch Posts'}
      </button>
      
      {status === 'failed' && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      
      {status === 'succeeded' && (
        <div className="posts-list">
          {items.map(post => (
            <div key={post.id} className="post-item">
              <h4>{post.title}</h4>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// User Profile Component
const UserProfile = () => {
  const { profile, preferences } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  
  const handleSave = () => {
    dispatch(updateProfile(formData))
    setIsEditing(false)
  }
  
  const handleThemeChange = (theme) => {
    dispatch(updatePreferences({ theme }))
  }
  
  return (
    <div className="user-profile-example">
      <h3>User Profile Example</h3>
      <div className="profile-card">
        <div className="profile-header">
          <h4>Profile Information</h4>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        {isEditing ? (
          <div className="profile-form">
            <div className="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Bio:</label>
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <div className="profile-display">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Bio:</strong> {profile.bio}</p>
          </div>
        )}
      </div>
      
      <div className="preferences-card">
        <h4>Preferences</h4>
        <div className="theme-selector">
          <p>Theme:</p>
          <div className="theme-options">
            <button 
              className={preferences.theme === 'light' ? 'active' : ''}
              onClick={() => handleThemeChange('light')}
            >
              Light
            </button>
            <button 
              className={preferences.theme === 'dark' ? 'active' : ''}
              onClick={() => handleThemeChange('dark')}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Redux Example Component
const ReduxExample = () => {
  const [activeTab, setActiveTab] = useState('counter')
  
  return (
    <div className="redux-example">
      <div className="example-container">
        <div className="example-header">
          <h2>Redux Toolkit Examples</h2>
          <p>Learn state management with Redux Toolkit</p>
        </div>
        
        <div className="example-section">
          <h3>Basic Redux Setup</h3>
          <div className="code-block">
            <pre>{`// Create a slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1 },
    decrement: state => { state.value -= 1 }
  }
})

// Configure store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
})

// Use in component
const count = useSelector(state => state.counter.value)
const dispatch = useDispatch()
dispatch(increment())`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Async Thunks</h3>
          <div className="code-block">
            <pre>{`// Create async thunk
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts', 
  async () => {
    const response = await api.get('/posts')
    return response.data
  }
)

// Handle in slice
extraReducers: (builder) => {
  builder
    .addCase(fetchPosts.pending, (state) => {
      state.status = 'loading'
    })
    .addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.items = action.payload
    })
}`}</pre>
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
              className={activeTab === 'todos' ? 'active' : ''}
              onClick={() => setActiveTab('todos')}
            >
              Todo List
            </button>
            <button 
              className={activeTab === 'posts' ? 'active' : ''}
              onClick={() => setActiveTab('posts')}
            >
              Async Data
            </button>
            <button 
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              User Profile
            </button>
          </div>
          
          <div className="tab-content">
            <Provider store={store}>
              {activeTab === 'counter' && <Counter />}
              {activeTab === 'todos' && <TodoList />}
              {activeTab === 'posts' && <PostsList />}
              {activeTab === 'profile' && <UserProfile />}
            </Provider>
          </div>
        </div>
        
        <div className="exercise">
          <h4>Exercise:</h4>
          <p>Create a shopping cart application with Redux Toolkit that includes:</p>
          <ul>
            <li>Product catalog with items that can be added to cart</li>
            <li>Shopping cart with quantity controls and item removal</li>
            <li>Total price calculation</li>
            <li>Async product fetching from a mock API</li>
            <li>User authentication state management</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ReduxExample