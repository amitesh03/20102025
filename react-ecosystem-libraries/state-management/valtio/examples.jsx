import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { proxy, useSnapshot, subscribe, snapshot } from 'valtio';
import { proxyMap, proxySet } from 'valtio/utils';
import { proxyWithHistory } from 'valtio-history';
import { derive } from 'valtio/utils';

// Valtio Examples - Comprehensive Guide to Proxy State Management
// Valtio is a tiny state management library that makes proxy-state simple,
// allowing you to mutate state directly and subscribe to changes for render optimization.

// ===== 1. BASIC PROXY STATE =====

// Basic proxy state - the foundation of Valtio
const countState = proxy({
  count: 0,
  name: 'Valtio Counter'
});

const userState = proxy({
  profile: {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com'
  },
  settings: {
    theme: 'light',
    notifications: true
  }
});

const todosState = proxy({
  items: [
    { id: 1, text: 'Learn Valtio', completed: false },
    { id: 2, text: 'Build amazing apps', completed: false }
  ],
  filter: 'all'
});

// Basic Counter Component
function Counter() {
  const snap = useSnapshot(countState);
  
  const increment = () => {
    countState.count += 1;
  };
  
  const decrement = () => {
    countState.count -= 1;
  };
  
  const reset = () => {
    countState.count = 0;
  };
  
  const setName = (name) => {
    countState.name = name;
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>{snap.name}</h2>
      <div style={{ fontSize: '2rem', margin: '20px 0' }}>
        Count: {snap.count}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <button onClick={reset}>Reset</button>
      </div>
      
      <div>
        <input
          type="text"
          value={snap.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter counter name"
          style={{ padding: '8px', marginRight: '10px' }}
        />
      </div>
    </div>
  );
}

// User Profile Component
function UserProfile() {
  const snap = useSnapshot(userState);
  
  const updateProfile = (field, value) => {
    userState.profile[field] = value;
  };
  
  const updateSettings = (field, value) => {
    userState.settings[field] = value;
  };
  
  const toggleTheme = () => {
    userState.settings.theme = userState.settings.theme === 'light' ? 'dark' : 'light';
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px',
      backgroundColor: snap.settings.theme === 'dark' ? '#333' : '#fff',
      color: snap.settings.theme === 'dark' ? '#fff' : '#333'
    }}>
      <h2>User Profile</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <h3>Profile Information</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            value={snap.profile.name}
            onChange={(e) => updateProfile('name', e.target.value)}
            style={{ padding: '5px', width: '200px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Age:</label>
          <input
            type="number"
            value={snap.profile.age}
            onChange={(e) => updateProfile('age', Number(e.target.value))}
            style={{ padding: '5px', width: '100px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={snap.profile.email}
            onChange={(e) => updateProfile('email', e.target.value)}
            style={{ padding: '5px', width: '250px' }}
          />
        </div>
      </div>
      
      <div>
        <h3>Settings</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={snap.settings.notifications}
              onChange={(e) => updateSettings('notifications', e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Enable Notifications
          </label>
        </div>
        
        <div>
          <button onClick={toggleTheme}>
            Switch to {snap.settings.theme === 'light' ? 'dark' : 'light'} theme
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== 2. DERIVED STATE =====

// Derived state using derive utility
const derivedCountState = derive({
  count: (get) => get(countState).count,
  isEven: (get) => get(countState).count % 2 === 0,
  doubled: (get) => get(countState).count * 2,
  status: (get) => {
    const count = get(countState).count;
    if (count === 0) return 'Zero';
    if (count < 10) return 'Small';
    if (count < 100) return 'Medium';
    return 'Large';
  }
});

const derivedUserState = derive({
  fullName: (get) => {
    const profile = get(userState).profile;
    return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
  },
  isAdult: (get) => get(userState).profile.age >= 18,
  ageGroup: (get) => {
    const age = get(userState).profile.age;
    if (age < 13) return 'Child';
    if (age < 20) return 'Teenager';
    if (age < 65) return 'Adult';
    return 'Senior';
  }
});

const derivedTodosState = derive({
  filteredItems: (get) => {
    const todos = get(todosState);
    const filter = todos.filter;
    
    if (filter === 'completed') {
      return todos.items.filter(item => item.completed);
    } else if (filter === 'active') {
      return todos.items.filter(item => !item.completed);
    }
    return todos.items;
  },
  stats: (get) => {
    const items = get(todosState).items;
    return {
      total: items.length,
      completed: items.filter(item => item.completed).length,
      active: items.filter(item => !item.completed).length,
      completionRate: items.length > 0 
        ? Math.round((items.filter(item => item.completed).length / items.length) * 100)
        : 0
    };
  }
});

// Derived Counter Component
function DerivedCounter() {
  const snap = useSnapshot(derivedCountState);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Derived Counter</h2>
      <p>Count: {snap.count}</p>
      <p>Is Even: {snap.isEven ? 'Yes' : 'No'}</p>
      <p>Doubled: {snap.doubled}</p>
      <p>Status: {snap.status}</p>
    </div>
  );
}

// Derived User Component
function DerivedUser() {
  const snap = useSnapshot(derivedUserState);
  const originalSnap = useSnapshot(userState);
  
  const updateFirstName = (firstName) => {
    userState.profile.firstName = firstName;
  };
  
  const updateLastName = (lastName) => {
    userState.profile.lastName = lastName;
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Derived User</h2>
      <p>Full Name: {snap.fullName}</p>
      <p>Is Adult: {snap.isAdult ? 'Yes' : 'No'}</p>
      <p>Age Group: {snap.ageGroup}</p>
      
      <div style={{ marginTop: '15px' }}>
        <h3>Update Name</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>First Name:</label>
          <input
            type="text"
            value={originalSnap.profile.firstName || ''}
            onChange={(e) => updateFirstName(e.target.value)}
            style={{ padding: '5px', width: '150px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:</label>
          <input
            type="text"
            value={originalSnap.profile.lastName || ''}
            onChange={(e) => updateLastName(e.target.value)}
            style={{ padding: '5px', width: '150px' }}
          />
        </div>
      </div>
    </div>
  );
}

// ===== 3. TODO MANAGEMENT =====

// Todo Input Component
function TodoInput() {
  const [inputValue, setInputValue] = useState('');
  
  const addTodo = () => {
    if (inputValue.trim()) {
      todosState.items.push({
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      });
      setInputValue('');
    }
  };
  
  const setFilter = (filter) => {
    todosState.filter = filter;
  };
  
  const snap = useSnapshot(todosState);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Todo Management</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <h3>Add Todo</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Enter a new todo..."
            style={{ 
              padding: '8px', 
              fontSize: '16px', 
              flex: 1,
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button 
            onClick={addTodo}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <h3>Filter</h3>
        <div>
          {['all', 'active', 'completed'].map(filter => (
            <button
              key={filter}
              onClick={() => setFilter(filter)}
              style={{
                marginRight: '5px',
                padding: '5px 10px',
                backgroundColor: snap.filter === filter ? '#007bff' : '#e9ecef',
                color: snap.filter === filter ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Todo List Component
function TodoList() {
  const snap = useSnapshot(derivedTodosState);
  
  const toggleTodo = (id) => {
    const todo = todosState.items.find(item => item.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  };
  
  const deleteTodo = (id) => {
    const index = todosState.items.findIndex(item => item.id === id);
    if (index !== -1) {
      todosState.items.splice(index, 1);
    }
  };
  
  const clearCompleted = () => {
    todosState.items = todosState.items.filter(item => !item.completed);
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3>Todo List ({snap.filteredItems.length} items)</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Statistics</h4>
        <p>Total: {snap.stats.total}</p>
        <p>Completed: {snap.stats.completed}</p>
        <p>Active: {snap.stats.active}</p>
        <p>Completion Rate: {snap.stats.completionRate}%</p>
        
        {snap.stats.completed > 0 && (
          <button 
            onClick={clearCompleted}
            style={{
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Clear Completed
          </button>
        )}
      </div>
      
      <div>
        {snap.filteredItems.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            No todos to display. Add one above!
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {snap.filteredItems.map(todo => (
              <li
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: todo.completed ? '#f8f9fa' : 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ marginRight: '10px' }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#666' : 'black'
                  }}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    padding: '2px 8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    marginLeft: '10px'
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ===== 4. PROXY MAP =====

// Using proxyMap for key-value collections
const cartState = proxyMap();
const productState = proxyMap([
  [1, { name: 'Laptop', price: 999, category: 'Electronics' }],
  [2, { name: 'Mouse', price: 29, category: 'Electronics' }],
  [3, { name: 'Keyboard', price: 79, category: 'Electronics' }],
  [4, { name: 'Monitor', price: 299, category: 'Electronics' }]
]);

// Shopping Cart Component
function ShoppingCart() {
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  const addToCart = (productId) => {
    const product = productState.get(productId);
    if (product) {
      const existingItem = cartState.get(productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartState.set(productId, { ...product, quantity: 1 });
      }
    }
  };
  
  const removeFromCart = (productId) => {
    cartState.delete(productId);
  };
  
  const updateQuantity = (productId, quantity) => {
    const item = cartState.get(productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
    } else if (quantity <= 0) {
      cartState.delete(productId);
    }
  };
  
  const getTotal = () => {
    let total = 0;
    cartState.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };
  
  const getTotalItems = () => {
    let count = 0;
    cartState.forEach((item) => {
      count += item.quantity;
    });
    return count;
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Shopping Cart (Proxy Map)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Products</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {Array.from(productState.entries()).map(([id, product]) => (
            <div
              key={id}
              style={{
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: selectedProductId === id ? '#e3f2fd' : 'white'
              }}
            >
              <h4>{product.name}</h4>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <button
                onClick={() => addToCart(Number(id))}
                style={{
                  padding: '5px 10px',
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
          ))}
        </div>
      </div>
      
      <div>
        <h3>Cart Items ({cartState.size})</h3>
        {cartState.size === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div style={{ marginBottom: '15px' }}>
              {Array.from(cartState.entries()).map(([id, item]) => (
                <div
                  key={id}
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
                  <div>
                    <strong>{item.name}</strong>
                    <p>${item.price} x {item.quantity}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button
                      onClick={() => updateQuantity(Number(id), item.quantity - 1)}
                      style={{ padding: '2px 8px' }}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(Number(id), item.quantity + 1)}
                      style={{ padding: '2px 8px' }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(Number(id))}
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
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              borderTop: '1px solid #ddd', 
              paddingTop: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <strong>Total: ${getTotal().toFixed(2)}</strong>
              <span>Total Items: {getTotalItems()}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===== 5. PROXY SET =====

// Using proxySet for unique collections
const tagsState = proxySet();
const selectedTagsState = proxySet();

// Tags Management Component
function TagsManager() {
  const [newTag, setNewTag] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  const addTag = (tag) => {
    if (tag.trim()) {
      tagsState.add(tag.trim());
    }
  };
  
  const removeTag = (tag) => {
    tagsState.delete(tag);
  };
  
  const toggleTagSelection = (tag) => {
    if (selectedTagsState.has(tag)) {
      selectedTagsState.delete(tag);
    } else {
      selectedTagsState.add(tag);
    }
  };
  
  const clearAllTags = () => {
    tagsState.clear();
  };
  
  const clearSelection = () => {
    selectedTagsState.clear();
  };
  
  const handleAddTag = () => {
    if (inputValue.trim()) {
      addTag(inputValue.trim());
      setInputValue('');
    }
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Tags Manager (Proxy Set)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Add Tag</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Enter a tag..."
            style={{ 
              padding: '8px', 
              fontSize: '16px', 
              flex: 1,
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button 
            onClick={handleAddTag}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Tag
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>All Tags ({tagsState.size})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
          {Array.from(tagsState).map(tag => (
            <span
              key={tag}
              style={{
                padding: '5px 10px',
                backgroundColor: '#e9ecef',
                border: '1px solid #ddd',
                borderRadius: '15px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              >
              {tag}
              </span>
          ))}
        </div>
        <button onClick={clearAllTags} style={{ padding: '5px 10px' }}>
          Clear All Tags
        </button>
      </div>
      
      <div>
        <h3>Selected Tags ({selectedTagsState.size})</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
          {Array.from(selectedTagsState).map(tag => (
            <span
              key={tag}
              style={{
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: '1px solid #0056b3',
                borderRadius: '15px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onClick={() => toggleTagSelection(tag)}
            >
              {tag} ×
            </span>
          ))}
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <h4>Toggle Selection:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {Array.from(tagsState).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTagSelection(tag)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: selectedTagsState.has(tag) ? '#28a745' : '#e9ecef',
                  color: selectedTagsState.has(tag) ? 'white' : 'black',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {selectedTagsState.has(tag) ? '✓ ' : ''}{tag}
              </button>
            ))}
          </div>
          <button onClick={clearSelection} style={{ padding: '5px 10px', marginTop: '10px' }}>
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== 6. HISTORY MANAGEMENT =====

// Using proxyWithHistory for undo/redo functionality
const historyState = proxyWithHistory({
  text: 'Hello Valtio!',
  count: 0,
  items: ['Item 1', 'Item 2']
});

// History Component
function HistoryDemo() {
  const snap = useSnapshot(historyState);
  
  const updateText = (text) => {
    historyState.text = text;
  };
  
  const increment = () => {
    historyState.count += 1;
  };
  
  const addItem = (item) => {
    historyState.items.push(item);
  };
  
  const removeLastItem = () => {
    if (historyState.items.length > 0) {
      historyState.items.pop();
    }
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>History Management</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current State</h3>
        <p>Text: {snap.text}</p>
        <p>Count: {snap.count}</p>
        <p>Items: {snap.items.join(', ')}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Actions</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Text:</label>
          <input
            type="text"
            value={snap.text}
            onChange={(e) => updateText(e.target.value)}
            style={{ padding: '5px', width: '200px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={increment} style={{ padding: '5px 10px', marginRight: '5px' }}>
            Increment Count
          </button>
          <button onClick={() => addItem(`Item ${snap.items.length + 1}`)} style={{ padding: '5px 10px', marginRight: '5px' }}>
            Add Item
          </button>
          <button onClick={removeLastItem} style={{ padding: '5px 10px', marginRight: '5px' }}>
            Remove Last Item
          </button>
        </div>
      </div>
      
      <div>
        <h3>History Controls</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => historyState.undo()}
            disabled={!historyState.canUndo}
            style={{ 
              padding: '5px 10px',
              opacity: historyState.canUndo ? 1 : 0.5,
              cursor: historyState.canUndo ? 'pointer' : 'not-allowed'
            }}
          >
            Undo
          </button>
          <button 
            onClick={() => historyState.redo()}
            disabled={!historyState.canRedo}
            style={{ 
              padding: '5px 10px',
              opacity: historyState.canRedo ? 1 : 0.5,
              cursor: historyState.canRedo ? 'pointer' : 'not-allowed'
            }}
          >
            Redo
          </button>
        </div>
        
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          <p>Can Undo: {historyState.canUndo ? 'Yes' : 'No'}</p>
          <p>Can Redo: {historyState.canRedo ? 'Yes' : 'No'}</p>
          <p>History Length: {historyState.history.length}</p>
          <p>History Index: {historyState.index}</p>
        </div>
      </div>
    </div>
  );
}

// ===== 7. SUBSCRIPTION EXAMPLES =====

// Manual subscription example
function SubscriptionDemo() {
  const [subscriptionLog, setSubscriptionLog] = useState([]);
  
  useEffect(() => {
    const unsubscribe = subscribe(countState, () => {
      setSubscriptionLog(prev => [
        ...prev,
        `State changed at ${new Date().toLocaleTimeString()}`
      ]);
    });
    
    return unsubscribe;
  }, []);
  
  const snap = useSnapshot(countState);
  
  const clearLog = () => {
    setSubscriptionLog([]);
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Subscription Demo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current Count: {snap.count}</h3>
        <button onClick={() => countState.count += 1} style={{ padding: '5px 10px' }}>
          Increment
        </button>
      </div>
      
      <div>
        <h3>Subscription Log</h3>
        <div style={{ 
          maxHeight: '150px', 
          overflow: 'auto', 
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          {subscriptionLog.length === 0 ? (
            <p style={{ color: '#666' }}>No subscriptions yet...</p>
          ) : (
            subscriptionLog.map((log, index) => (
              <div key={index} style={{ fontSize: '12px', marginBottom: '5px' }}>
                {log}
              </div>
            ))
          )}
        </div>
        <button onClick={clearLog} style={{ padding: '5px 10px', marginTop: '10px' }}>
          Clear Log
        </button>
      </div>
    </div>
  );
}

// ===== 8. SNAPSHOT UTILITIES =====

// Snapshot utilities example
function SnapshotDemo() {
  const [snapshots, setSnapshots] = useState([]);
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(-1);
  
  const takeSnapshot = () => {
    const snap = snapshot(countState);
    setSnapshots(prev => [...prev, snap]);
    setCurrentSnapshotIndex(snapshots.length);
  };
  
  const restoreSnapshot = (index) => {
    if (index >= 0 && index < snapshots.length) {
      const snap = snapshots[index];
      countState.count = snap.count;
      countState.name = snap.name;
      setCurrentSnapshotIndex(index);
    }
  };
  
  const clearSnapshots = () => {
    setSnapshots([]);
    setCurrentSnapshotIndex(-1);
  };
  
  const currentSnap = useSnapshot(countState);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Snapshot Utilities</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current State</h3>
        <p>Count: {currentSnap.count}</p>
        <p>Name: {currentSnap.name}</p>
        <button onClick={takeSnapshot} style={{ padding: '5px 10px' }}>
          Take Snapshot
        </button>
      </div>
      
      <div>
        <h3>Saved Snapshots ({snapshots.length})</h3>
        {snapshots.length === 0 ? (
          <p>No snapshots saved yet.</p>
        ) : (
          <>
            <div style={{ marginBottom: '10px' }}>
              {snapshots.map((snap, index) => (
                <button
                  key={index}
                  onClick={() => restoreSnapshot(index)}
                  style={{
                    padding: '5px 10px',
                    margin: '2px',
                    backgroundColor: currentSnapshotIndex === index ? '#007bff' : '#e9ecef',
                    color: currentSnapshotIndex === index ? 'white' : 'black',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Snapshot {index + 1}: {snap.name} ({snap.count})
                </button>
              ))}
            </div>
            
            <div style={{ marginTop: '10px' }}>
              <button onClick={clearSnapshots} style={{ padding: '5px 10px' }}>
                Clear All Snapshots
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====

function ValtioExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Valtio Examples</h1>
      
      <Counter />
      <UserProfile />
      
      <DerivedCounter />
      <DerivedUser />
      
      <TodoInput />
      <TodoList />
      
      <ShoppingCart />
      
      <TagsManager />
      
      <HistoryDemo />
      
      <SubscriptionDemo />
      
      <SnapshotDemo />
      
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <h2>Valtio Benefits</h2>
        <ul>
          <li><strong>Minimal API:</strong> Simple and intuitive proxy-based state</li>
          <li><strong>Direct Mutation:</strong> Mutate state directly like regular objects</li>
          <li><strong>Optimized Re-renders:</strong> Fine-grained subscriptions</li>
          <li><strong>TypeScript Support:</strong> Excellent type safety out of the box</li>
          <li><strong>Small Bundle:</strong> Tiny footprint with tree-shaking support</li>
          <li><strong>DevTools Integration:</strong> Built-in debugging capabilities</li>
          <li><strong>Flexible:</strong> Works with vanilla JS and any framework</li>
          <li><strong>Utilities:</strong> Rich ecosystem of helper functions</li>
        </ul>
        
        <h3>Key Concepts Demonstrated:</h3>
        <ul>
          <li><strong>Basic Proxy:</strong> Core state management with mutations</li>
          <li><strong>Derived State:</strong> Computed values with derive utility</li>
          <li><strong>Todo Management:</strong> CRUD operations with filtering</li>
          <li><strong>Proxy Map:</strong> Key-value collections with Map API</li>
          <li><strong>Proxy Set:</strong> Unique collections with Set API</li>
          <li><strong>History:</strong> Undo/redo functionality</li>
          <li><strong>Subscriptions:</strong> Manual change notifications</li>
          <li><strong>Snapshots:</strong> Immutable state copies</li>
        </ul>
      </div>
    </div>
  );
}

export default ValtioExamples;