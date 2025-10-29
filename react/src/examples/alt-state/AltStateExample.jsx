import React, { useState } from 'react'
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import './AltStateExample.css'

// Recoil Examples

// Atoms
const counterState = atom({
  key: 'counterState',
  default: 0,
})

const textState = atom({
  key: 'textState',
  default: '',
})

const todoListState = atom({
  key: 'todoListState',
  default: [
    { id: 1, text: 'Learn Recoil', completed: true },
    { id: 2, text: 'Learn Zustand', completed: false },
  ],
})

// Selectors
const charCountState = selector({
  key: 'charCountState',
  get: ({ get }) => {
    const text = get(textState)
    return text.length
  },
})

const completedTodoCountState = selector({
  key: 'completedTodoCountState',
  get: ({ get }) => {
    const todoList = get(todoListState)
    return todoList.filter(todo => todo.completed).length
  },
})

const filteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({ get }) => {
    const filter = get(todoFilterState)
    const list = get(todoListState)
    
    switch (filter) {
      case 'completed':
        return list.filter(todo => todo.completed)
      case 'uncompleted':
        return list.filter(todo => !todo.completed)
      default:
        return list
    }
  },
})

const todoFilterState = atom({
  key: 'todoFilterState',
  default: 'all',
})

// Recoil Components
const RecoilCounter = () => {
  const [count, setCount] = useRecoilState(counterState)
  
  return (
    <div className="counter-example">
      <h3>Recoil Counter</h3>
      <div className="counter-display">
        <span className="count">{count}</span>
      </div>
      <div className="counter-controls">
        <button onClick={() => setCount(count - 1)}>-</button>
        <button onClick={() => setCount(count + 1)}>+</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  )
}

const RecoilTextInput = () => {
  const [text, setText] = useRecoilState(textState)
  const charCount = useRecoilValue(charCountState)
  
  return (
    <div className="text-input-example">
      <h3>Recoil Text Input</h3>
      <div className="input-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
        />
        <div className="char-count">Character count: {charCount}</div>
      </div>
    </div>
  )
}

const RecoilTodoItem = ({ todo }) => {
  const setTodoList = useSetRecoilState(todoListState)
  
  const toggleTodo = () => {
    setTodoList(prevTodos =>
      prevTodos.map(todoItem =>
        todoItem.id === todo.id
          ? { ...todoItem, completed: !todoItem.completed }
          : todoItem
      )
    )
  }
  
  const deleteTodo = () => {
    setTodoList(prevTodos =>
      prevTodos.filter(todoItem => todoItem.id !== todo.id)
    )
  }
  
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleTodo}
      />
      <span className="todo-text">{todo.text}</span>
      <button className="delete-btn" onClick={deleteTodo}>
        Delete
      </button>
    </div>
  )
}

const RecoilTodoList = () => {
  const todoList = useRecoilValue(filteredTodoListState)
  const [filter, setFilter] = useRecoilState(todoFilterState)
  const setTodoList = useSetRecoilState(todoListState)
  const [inputValue, setInputValue] = useState('')
  
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodoList(prevTodos => [
        ...prevTodos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false
        }
      ])
      setInputValue('')
    }
  }
  
  const completedCount = useRecoilValue(completedTodoCountState)
  
  return (
    <div className="todo-example">
      <h3>Recoil Todo List</h3>
      
      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      
      <div className="todo-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'uncompleted' ? 'active' : ''}
          onClick={() => setFilter('uncompleted')}
        >
          Active
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      
      <div className="todo-stats">
        Completed: {completedCount} / {todoList.length}
      </div>
      
      <div className="todo-list">
        {todoList.map(todo => (
          <RecoilTodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  )
}

// Zustand Examples

// Create a Zustand store
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementByAmount: (amount) => set((state) => ({ count: state.count + amount })),
}))

const useTextStore = create((set) => ({
  text: '',
  setText: (text) => set({ text }),
  charCount: () => get().text.length,
}))

const useTodoStore = create(
  persist(
    (set, get) => ({
      todos: [
        { id: 1, text: 'Learn Zustand', completed: true },
        { id: 2, text: 'Build an app', completed: false },
      ],
      filter: 'all',
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: Date.now(), text, completed: false },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      setFilter: (filter) => set({ filter }),
      completedCount: () => get().todos.filter((todo) => todo.completed).length,
      filteredTodos: () => {
        const { todos, filter } = get()
        switch (filter) {
          case 'completed':
            return todos.filter((todo) => todo.completed)
          case 'uncompleted':
            return todos.filter((todo) => !todo.completed)
          default:
            return todos
        }
      },
    }),
    {
      name: 'todo-storage',
    }
  )
)

// Zustand Components
const ZustandCounter = () => {
  const { count, increment, decrement, reset, incrementByAmount } = useCounterStore()
  const [amount, setAmount] = useState(5)
  
  return (
    <div className="counter-example">
      <h3>Zustand Counter</h3>
      <div className="counter-display">
        <span className="count">{count}</span>
      </div>
      <div className="counter-controls">
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
        <button onClick={reset}>Reset</button>
      </div>
      <div className="increment-by-amount">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={() => incrementByAmount(amount)}>
          Add {amount}
        </button>
      </div>
    </div>
  )
}

const ZustandTextInput = () => {
  const { text, setText } = useTextStore()
  const charCount = text.length
  
  return (
    <div className="text-input-example">
      <h3>Zustand Text Input</h3>
      <div className="input-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
        />
        <div className="char-count">Character count: {charCount}</div>
      </div>
    </div>
  )
}

const ZustandTodoItem = ({ todo }) => {
  const { toggleTodo, deleteTodo } = useTodoStore()
  
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span className="todo-text">{todo.text}</span>
      <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
        Delete
      </button>
    </div>
  )
}

const ZustandTodoList = () => {
  const {
    todos,
    filter,
    addTodo,
    setFilter,
    completedCount,
    filteredTodos,
  } = useTodoStore()
  const [inputValue, setInputValue] = useState('')
  
  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo(inputValue)
      setInputValue('')
    }
  }
  
  const filteredList = filteredTodos()
  
  return (
    <div className="todo-example">
      <h3>Zustand Todo List</h3>
      
      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      
      <div className="todo-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'uncompleted' ? 'active' : ''}
          onClick={() => setFilter('uncompleted')}
        >
          Active
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      
      <div className="todo-stats">
        Completed: {completedCount()} / {todos.length}
      </div>
      
      <div className="todo-list">
        {filteredList.map(todo => (
          <ZustandTodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  )
}

// Comparison Component
const ComparisonTable = () => {
  return (
    <div className="comparison-table">
      <h3>Recoil vs Zustand Comparison</h3>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Recoil</th>
            <th>Zustand</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Learning Curve</td>
            <td>Moderate</td>
            <td>Easy</td>
          </tr>
          <tr>
            <td>Boilerplate</td>
            <td>More</td>
            <td>Less</td>
          </tr>
          <tr>
            <td>DevTools</td>
            <td>Built-in</td>
            <td>Third-party</td>
          </tr>
          <tr>
            <td>Persistence</td>
            <td>Manual</td>
            <td>Built-in middleware</td>
          </tr>
          <tr>
            <td>TypeScript</td>
            <td>Good support</td>
            <td>Excellent support</td>
          </tr>
          <tr>
            <td>Bundle Size</td>
            <td>Larger</td>
            <td>Smaller</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// Main Component
const AltStateExample = () => {
  const [activeTab, setActiveTab] = useState('recoil')
  
  return (
    <div className="alt-state-example">
      <div className="example-container">
        <div className="example-header">
          <h2>Alternative State Management</h2>
          <p>Learn lightweight state management alternatives to Redux</p>
        </div>
        
        <div className="example-section">
          <h3>Recoil Setup</h3>
          <div className="code-block">
            <pre>{`// Atom (state)
const counterState = atom({
  key: 'counterState',
  default: 0,
})

// Selector (derived state)
const doubledState = selector({
  key: 'doubledState',
  get: ({ get }) => get(counterState) * 2,
})

// Component
function Counter() {
  const [count, setCount] = useRecoilState(counterState)
  const doubled = useRecoilValue(doubledState)
  return (
    <div>
      <div>Count: {count}</div>
      <div>Doubled: {doubled}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Zustand Setup</h3>
          <div className="code-block">
            <pre>{`// Store
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

// Component
function Counter() {
  const { count, increment, decrement } = useCounterStore()
  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}`}</pre>
          </div>
        </div>
        
        <div className="example-section">
          <h3>Interactive Examples</h3>
          <div className="tab-navigation">
            <button 
              className={activeTab === 'recoil' ? 'active' : ''}
              onClick={() => setActiveTab('recoil')}
            >
              Recoil
            </button>
            <button 
              className={activeTab === 'zustand' ? 'active' : ''}
              onClick={() => setActiveTab('zustand')}
            >
              Zustand
            </button>
            <button 
              className={activeTab === 'comparison' ? 'active' : ''}
              onClick={() => setActiveTab('comparison')}
            >
              Comparison
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'recoil' && (
              <RecoilRoot>
                <div className="state-demo">
                  <RecoilCounter />
                  <RecoilTextInput />
                  <RecoilTodoList />
                </div>
              </RecoilRoot>
            )}
            
            {activeTab === 'zustand' && (
              <div className="state-demo">
                <ZustandCounter />
                <ZustandTextInput />
                <ZustandTodoList />
              </div>
            )}
            
            {activeTab === 'comparison' && <ComparisonTable />}
          </div>
        </div>
        
        <div className="exercise">
          <h4>Exercise:</h4>
          <p>Create a shopping cart application using both Recoil and Zustand:</p>
          <ul>
            <li>Product catalog with items that can be added to cart</li>
            <li>Shopping cart with quantity controls</li>
            <li>Total price calculation</li>
            <li>Cart persistence using localStorage</li>
            <li>Product filtering and search</li>
            <li>Compare the implementation complexity between both solutions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AltStateExample