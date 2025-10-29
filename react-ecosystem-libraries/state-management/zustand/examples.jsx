// Zustand Examples with Detailed Comments
// This file demonstrates various Zustand concepts with comprehensive explanations

import React, { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ===== EXAMPLE 1: BASIC ZUSTAND STORE =====
/**
 * Basic Zustand store demonstrating create function and hooks
 * Zustand provides a simple API for state management
 */

// Create a basic store using create function
// The store contains state and actions (functions that update state)
const useCounterStore = create((set, get) => ({
  // State properties
  count: 0,
  name: 'Zustand Counter',
  
  // Actions - functions that update state
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementByAmount: (amount) => set((state) => ({ count: state.count + amount })),
  
  // Action that accesses current state using get
  incrementAndLog: () => {
    const currentCount = get().count;
    console.log('Current count before increment:', currentCount);
    set((state) => ({ count: state.count + 1 }));
  },
  
  // Action that accepts a callback for complex updates
  updateCount: (updater) => set((state) => ({ count: updater(state.count) })),
}));

// Counter Component using Zustand
function Counter() {
  // Subscribe to specific state slices using selectors
  // This ensures component only re-renders when these values change
  const count = useCounterStore((state) => state.count);
  const name = useCounterStore((state) => state.name);
  
  // Get actions from the store
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);
  const incrementByAmount = useCounterStore((state) => state.incrementByAmount);
  const incrementAndLog = useCounterStore((state) => state.incrementAndLog);
  const updateCount = useCounterStore((state) => state.updateCount);

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      border: '1px solid #ddd', 
      margin: '10px',
      borderRadius: '8px'
    }}>
      <h2>{name}</h2>
      
      <div style={{ fontSize: '2rem', margin: '20px 0' }}>
        Count: {count}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={increment}>
          Increment (+1)
        </button>
        
        <button onClick={decrement}>
          Decrement (-1)
        </button>
        
        <button onClick={() => incrementByAmount(5)}>
          Increment by 5
        </button>
        
        <button onClick={incrementAndLog}>
          Increment & Log
        </button>
        
        <button onClick={() => updateCount((current) => current * 2)}>
          Double Count
        </button>
        
        <button onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}

// ===== EXAMPLE 2: TODO STORE WITH CRUD OPERATIONS =====
/**
 * Todo store demonstrating CRUD operations with Zustand
 * Shows how to handle arrays and more complex state
 */

const useTodoStore = create((set, get) => ({
  // State
  todos: [],
  filter: 'SHOW_ALL', // Can be 'SHOW_ALL', 'SHOW_ACTIVE', 'SHOW_COMPLETED'
  
  // Actions
  addTodo: (text) => {
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      todos: [...state.todos, newTodo]
    }));
  },
  
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  
  editTodo: (id, newText) => set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id 
        ? { ...todo, text: newText.trim(), updatedAt: new Date().toISOString() }
        : todo
    )
  })),
  
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id)
  })),
  
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter((todo) => !todo.completed)
  })),
  
  setFilter: (filter) => set({ filter }),
  
  toggleAll: () => {
    const allCompleted = get().todos.every((todo) => todo.completed);
    set((state) => ({
      todos: state.todos.map((todo) => ({ ...todo, completed: !allCompleted }))
    }));
  },
  
  // Bulk actions
  addMultipleTodos: (todosText) => {
    const newTodos = todosText
      .filter((text) => text.trim())
      .map((text) => ({
        id: Date.now() + Math.random(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      }));
    
    set((state) => ({
      todos: [...state.todos, ...newTodos]
    }));
  },
  
  // Action that returns a value
  getTodoStats: () => {
    const todos = get().todos;
    return {
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      active: todos.filter((todo) => !todo.completed).length,
    };
  },
}));

// Selectors for computed values
const useFilteredTodos = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter((todo) => todo.completed);
    case 'SHOW_ACTIVE':
      return todos.filter((todo) => !todo.completed);
    default:
      return todos;
  }
};

const useTodoStats = () => {
  const todos = useTodoStore((state) => state.todos);
  
  return {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    active: todos.filter((todo) => !todo.completed).length,
    completionRate: todos.length > 0 
      ? Math.round((todos.filter((todo) => todo.completed).length / todos.length) * 100)
      : 0,
  };
};

// Todo Input Component
function TodoInput() {
  const [inputValue, setInputValue] = useState('');
  const [multiInputValue, setMultiInputValue] = useState('');
  
  const addTodo = useTodoStore((state) => state.addTodo);
  const addMultipleTodos = useTodoStore((state) => state.addMultipleTodos);

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue('');
    }
  };

  const handleMultiSubmit = (e) => {
    e.preventDefault();
    if (multiInputValue.trim()) {
      // Split by comma or newline for multiple todos
      const todos = multiInputValue.split(/[,\\n]/).map((todo) => todo.trim());
      addMultipleTodos(todos);
      setMultiInputValue('');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Add Todos</h3>
      
      <form onSubmit={handleSingleSubmit} style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a single todo..."
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginRight: '10px',
            width: '300px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Single
        </button>
      </form>
      
      <form onSubmit={handleMultiSubmit}>
        <input
          type="text"
          value={multiInputValue}
          onChange={(e) => setMultiInputValue(e.target.value)}
          placeholder="Add multiple todos (comma or newline separated)..."
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginRight: '10px',
            width: '400px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Multiple
        </button>
      </form>
    </div>
  );
}

// Todo List Component
function TodoList() {
  const todos = useFilteredTodos();
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const editTodo = useTodoStore((state) => state.editTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const handleToggle = (id) => {
    toggleTodo(id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(id);
    }
  };

  const handleEdit = (id, newText) => {
    if (newText.trim()) {
      editTodo(id, newText.trim());
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Todo List ({todos.length} items)</h3>
      
      {todos.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No todos to display. Add one above!
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// Individual Todo Item Component
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      margin: '5px 0',
      backgroundColor: todo.completed ? '#f8f9fa' : 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
      textDecoration: todo.completed ? 'line-through' : 'none'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{ marginRight: '10px' }}
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          style={{
            flex: 1,
            padding: '5px',
            border: '1px solid #007bff',
            borderRadius: '2px'
          }}
          autoFocus
        />
      ) : (
        <span
          style={{
            flex: 1,
            cursor: 'pointer'
          }}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}
      
      <div style={{ marginLeft: '10px' }}>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              style={{
                padding: '2px 8px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                marginRight: '5px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: '2px 8px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '2px 8px',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '2px',
                marginRight: '5px',
                cursor: 'pointer'
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              style={{
                padding: '2px 8px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

// Todo Controls Component
function TodoControls() {
  const filter = useTodoStore((state) => state.filter);
  const stats = useTodoStats();
  const setFilter = useTodoStore((state) => state.setFilter);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const toggleAll = useTodoStore((state) => state.toggleAll);
  const getTodoStats = useTodoStore((state) => state.getTodoStats);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleClearCompleted = () => {
    clearCompleted();
  };

  const handleToggleAll = () => {
    toggleAll();
  };

  const handleShowStats = () => {
    const stats = getTodoStats();
    alert(`Todo Statistics:\\nTotal: ${stats.total}\\nActive: ${stats.active}\\nCompleted: ${stats.completed}\\nCompletion Rate: ${stats.completionRate}%`);
  };

  return (
    <div style={{ 
      padding: '15px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '4px',
      marginBottom: '20px'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <strong>Filter:</strong>
        {['SHOW_ALL', 'SHOW_ACTIVE', 'SHOW_COMPLETED'].map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: filter === f ? '#007bff' : '#e9ecef',
              color: filter === f ? 'white' : 'black',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {f.replace('SHOW_', '').replace('_', ' ')}
          </button>
        ))}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Statistics:</strong>
        <span style={{ marginLeft: '10px' }}>
          Total: {stats.total} | 
          Active: {stats.active} | 
          Completed: {stats.completed} | 
          Rate: {stats.completionRate}%
        </span>
        <button
          onClick={handleShowStats}
          style={{
            marginLeft: '10px',
            padding: '3px 8px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Show Details
        </button>
      </div>
      
      <div>
        <button
          onClick={handleToggleAll}
          style={{
            marginRight: '10px',
            padding: '5px 10px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Toggle All
        </button>
        
        <button
          onClick={handleClearCompleted}
          disabled={stats.completed === 0}
          style={{
            padding: '5px 10px',
            backgroundColor: stats.completed === 0 ? '#6c757d' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: stats.completed === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Clear Completed ({stats.completed})
        </button>
      </div>
    </div>
  );
}

// ===== EXAMPLE 3: PERSISTED STORE =====
/**
 * Persisted store demonstrating localStorage integration
 * Zustand middleware for persisting state to localStorage
 */

const usePersistedStore = create(
  persist(
    (set, get) => ({
      // State that will be persisted
      user: null,
      theme: 'light',
      preferences: {
        language: 'en',
        notifications: true,
        autoSave: true,
      },
      
      // Actions
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setTheme: (theme) => set({ theme }),
      updatePreferences: (preferences) => 
        set((state) => ({
          preferences: { ...state.preferences, ...preferences }
        })),
      
      // Action that uses get to access current state
      toggleTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === 'light' ? 'dark' : 'light' });
      },
    }),
    {
      name: 'app-storage', // Unique name for the storage
      storage: createJSONStorage(() => localStorage), // Use localStorage with JSON serialization
      partialize: (state) => ({ // Only persist these parts of the state
        user: state.user,
        theme: state.theme,
        preferences: state.preferences,
      }),
    }
  )
);

// User Profile Component
function UserProfile() {
  const user = usePersistedStore((state) => state.user);
  const theme = usePersistedStore((state) => state.theme);
  const preferences = usePersistedStore((state) => state.preferences);
  
  const setUser = usePersistedStore((state) => state.setUser);
  const clearUser = usePersistedStore((state) => state.clearUser);
  const setTheme = usePersistedStore((state) => state.setTheme);
  const toggleTheme = usePersistedStore((state) => state.toggleTheme);
  const updatePreferences = usePersistedStore((state) => state.updatePreferences);

  const handleLogin = () => {
    setUser({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
    });
  };

  const handleLogout = () => {
    clearUser();
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handlePreferenceChange = (key, value) => {
    updatePreferences({ [key]: value });
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
      color: theme === 'dark' ? 'white' : 'black',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3>User Profile & Settings</h3>
      
      {user ? (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src={user.avatar} 
              alt={user.name}
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
              <p style={{ margin: '0', color: theme === 'dark' ? '#ccc' : '#666' }}>
                {user.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <p>No user logged in.</p>
          <button
            onClick={handleLogin}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Login as John Doe
          </button>
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Theme</h4>
        <div>
          <label style={{ marginRight: '10px' }}>
            <input
              type="radio"
              value="light"
              checked={theme === 'light'}
              onChange={() => handleThemeChange('light')}
              style={{ marginRight: '5px' }}
            />
            Light
          </label>
          
          <label>
            <input
              type="radio"
              value="dark"
              checked={theme === 'dark'}
              onChange={() => handleThemeChange('dark')}
              style={{ marginRight: '5px' }}
            />
            Dark
          </label>
          
          <button
            onClick={toggleTheme}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toggle Theme
          </button>
        </div>
      </div>
      
      <div>
        <h4>Preferences</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Enable Notifications
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={preferences.autoSave}
              onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Auto Save
          </label>
          
          <div>
            <label style={{ marginRight: '8px' }}>Language:</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              style={{ padding: '4px', borderRadius: '4px' }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== EXAMPLE 4: MULTIPLE STORES =====
/**
 * Multiple stores demonstrating how to use separate stores
 * Zustand allows creating multiple independent stores
 */

const useCartStore = create((set) => ({
  items: [],
  total: 0,
  
  addItem: (product) => set((state) => {
    const newItems = [...state.items, { ...product, id: Date.now() }];
    const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);
    return { items: newItems, total: newTotal };
  }),
  
  removeItem: (id) => set((state) => {
    const newItems = state.items.filter((item) => item.id !== id);
    const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);
    return { items: newItems, total: newTotal };
  }),
  
  clearCart: () => set({ items: [], total: 0 }),
}));

const useProductStore = create((set) => ({
  products: [
    { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
    { id: 2, name: 'Mouse', price: 29, category: 'Electronics' },
    { id: 3, name: 'Keyboard', price: 79, category: 'Electronics' },
    { id: 4, name: 'Monitor', price: 299, category: 'Electronics' },
    { id: 5, name: 'Headphones', price: 149, category: 'Electronics' },
  ],
  
  searchQuery: '',
  
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

// Shopping Cart Component
function ShoppingCart() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3>Shopping Cart</h3>
      
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div style={{ marginBottom: '15px' }}>
            <strong>Items ({items.length}):</strong>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    margin: '5px 0',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                  }}
                >
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      padding: '2px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ 
            borderTop: '1px solid #ddd', 
            paddingTop: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <strong>Total: ${total.toFixed(2)}</strong>
            <button
              onClick={clearCart}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Product List Component
function ProductList() {
  const products = useProductStore((state) => state.products);
  const searchQuery = useProductStore((state) => state.searchQuery);
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);
  const addItem = useCartStore((state) => state.addItem);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addItem(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px'
    }}>
      <h3>Products</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '8px',
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white'
            }}
          >
            <h4 style={{ margin: '0 0 10px 0' }}>{product.name}</h4>
            <p style={{ color: '#666', margin: '0 0 10px 0' }}>
              {product.category}
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <strong>${product.price}</strong>
              <button
                onClick={() => handleAddToCart(product)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====
/**
 * Main component that demonstrates all Zustand examples
 */
function ZustandExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1>Zustand Examples</h1>
      
      <Counter />
      
      <div style={{ marginTop: '30px' }}>
        <h2>Todo Management</h2>
        <TodoInput />
        <TodoControls />
        <TodoList />
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Persisted Store</h2>
        <UserProfile />
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Multiple Stores</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <ProductList />
          <ShoppingCart />
        </div>
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <h3>Zustand Benefits</h3>
        <ul>
          <li><strong>Minimal API:</strong> Simple and intuitive to use</li>
          <li><strong>No Providers:</strong> No need to wrap components in providers</li>
          <li><strong>TypeScript Support:</strong> Excellent type safety out of the box</li>
          <li><strong>Performance:</strong> Optimized re-renders with fine-grained control</li>
          <li><strong>Small Bundle Size:</strong> Lightweight and fast</li>
          <li><strong>Middleware Support:</strong> Built-in middleware for persistence, devtools, etc.</li>
          <li><strong>Flexible:</strong> Can be used with or without React</li>
        </ul>
        
        <h4>Key Concepts Demonstrated:</h4>
        <ul>
          <li><strong>Basic Store:</strong> State and actions in one place</li>
          <li><strong>Selectors:</strong> Subscribe to specific state slices</li>
          <li><strong>CRUD Operations:</strong> Create, Read, Update, Delete</li>
          <li><strong>Persistence:</strong> Automatic state persistence</li>
          <li><strong>Multiple Stores:</strong> Separate stores for different concerns</li>
          <li><strong>Computed Values:</strong> Derived state from store state</li>
        </ul>
      </div>
    </div>
  );
}

export default ZustandExamples;