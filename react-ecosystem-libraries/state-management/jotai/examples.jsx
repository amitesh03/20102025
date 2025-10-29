import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { 
  atom, 
  useAtom, 
  useAtomValue, 
  useSetAtom,
  Provider,
  createStore
} from 'jotai';
import { 
  atomWithStorage,
  atomFamily,
  loadable,
  selectAtom,
  splitAtom,
  useAtomCallback,
  useHydrateAtoms
} from 'jotai/utils';

// Jotai Examples - Comprehensive Guide to Atomic State Management
// Jotai is a primitive and flexible state management library for React that provides
// a bottom-up approach with atoms as the fundamental unit of state.

// ===== 1. BASIC ATOMS =====

// Primitive atoms - the building blocks of state
const countAtom = atom(0);
const textAtom = atom('Hello Jotai');
const userAtom = atom({ name: 'John', age: 30 });
const todosAtom = atom([
  { id: 1, text: 'Learn Jotai', completed: false },
  { id: 2, text: 'Build amazing apps', completed: false }
]);

// Basic Counter Component
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Basic Counter: {count}</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
        <button onClick={() => setCount(0)}>Reset</button>
        <button onClick={() => setCount(c => c * 2)}>Double</button>
      </div>
    </div>
  );
}

// Text Input Component
function TextInput() {
  const [text, setText] = useAtom(textAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Text Input</h2>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ 
          padding: '10px', 
          fontSize: '16px', 
          width: '300px',
          marginRight: '10px'
        }}
      />
      <button onClick={() => setText('')}>Clear</button>
      <p>You typed: {text}</p>
    </div>
  );
}

// User Profile Component
function UserProfile() {
  const [user, setUser] = useAtom(userAtom);
  
  const handleBirthday = () => {
    setUser({ ...user, age: user.age + 1 });
  };
  
  const handleNameChange = (name) => {
    setUser({ ...user, name });
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>User Profile</h2>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Name:</label>
        <input
          type="text"
          value={user.name}
          onChange={(e) => handleNameChange(e.target.value)}
          style={{ padding: '5px' }}
        />
      </div>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <button onClick={handleBirthday}>Happy Birthday!</button>
    </div>
  );
}

// ===== 2. DERIVED ATOMS =====

// Derived atoms - computed values from other atoms
const doubleCountAtom = atom((get) => get(countAtom) * 2);
const isEvenAtom = atom((get) => get(countAtom) % 2 === 0);
const countStatusAtom = atom((get) => {
  const count = get(countAtom);
  if (count === 0) return 'Zero';
  if (count < 10) return 'Small';
  if (count < 100) return 'Medium';
  return 'Large';
});

// Complex derived atom
const todoStatsAtom = atom((get) => {
  const todos = get(todosAtom);
  return {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
    completionRate: todos.length > 0 
      ? Math.round((todos.filter(todo => todo.completed).length / todos.length) * 100)
      : 0
  };
});

// Derived Counter Component
function DerivedCounter() {
  const count = useAtomValue(countAtom);
  const doubleCount = useAtomValue(doubleCountAtom);
  const isEven = useAtomValue(isEvenAtom);
  const countStatus = useAtomValue(countStatusAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Derived Counter</h2>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <p>Is Even: {isEven ? 'Yes' : 'No'}</p>
      <p>Status: {countStatus}</p>
    </div>
  );
}

// Todo Stats Component
function TodoStats() {
  const stats = useAtomValue(todoStatsAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Todo Statistics</h2>
      <p>Total: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
      <p>Active: {stats.active}</p>
      <p>Completion Rate: {stats.completionRate}%</p>
    </div>
  );
}

// ===== 3. WRITABLE DERIVED ATOMS =====

// Writable derived atoms - two-way binding with custom logic
const celsiusAtom = atom(0);
const fahrenheitAtom = atom(
  (get) => (get(celsiusAtom) * 9) / 5 + 32,
  (get, set, newFahrenheit) => {
    set(celsiusAtom, ((newFahrenheit - 32) * 5) / 9);
  }
);

// Multi-update writable atom
const firstNameAtom = atom('John');
const lastNameAtom = atom('Doe');
const fullNameAtom = atom(
  (get) => `${get(firstNameAtom)} ${get(lastNameAtom)}`,
  (get, set, newFullName) => {
    const [first, last] = newFullName.split(' ');
    set(firstNameAtom, first || '');
    set(lastNameAtom, last || '');
  }
);

// Temperature Converter Component
function TemperatureConverter() {
  const [celsius, setCelsius] = useAtom(celsiusAtom);
  const [fahrenheit, setFahrenheit] = useAtom(fahrenheitAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Temperature Converter</h2>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Celsius:</label>
        <input
          type="number"
          value={celsius}
          onChange={(e) => setCelsius(Number(e.target.value))}
          style={{ padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Fahrenheit:</label>
        <input
          type="number"
          value={fahrenheit}
          onChange={(e) => setFahrenheit(Number(e.target.value))}
          style={{ padding: '5px' }}
        />
      </div>
    </div>
  );
}

// Name Editor Component
function NameEditor() {
  const [fullName, setFullName] = useAtom(fullNameAtom);
  const [firstName] = useAtom(firstNameAtom);
  const [lastName] = useAtom(lastNameAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Name Editor</h2>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Full Name:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ padding: '5px', width: '200px' }}
        />
      </div>
      <p>First: {firstName}</p>
      <p>Last: {lastName}</p>
    </div>
  );
}

// ===== 4. ASYNC ATOMS =====

// Async atoms - for data fetching and async operations
const userIdAtom = atom(1);
const userDataAtom = atom(async (get) => {
  const userId = get(userIdAtom);
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
});

const userPostsAtom = atom(async (get) => {
  const user = await get(userDataAtom);
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
});

// Async User Display Component
function AsyncUserDisplay() {
  const [userId, setUserId] = useAtom(userIdAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Async User Data</h2>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>User ID:</label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          min="1"
          max="10"
          style={{ padding: '5px' }}
        />
      </div>
      
      <Suspense fallback={<div>Loading user data...</div>}>
        <UserInfo />
        <UserPosts />
      </Suspense>
    </div>
  );
}

function UserInfo() {
  const user = useAtomValue(userDataAtom);
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
    </div>
  );
}

function UserPosts() {
  const posts = useAtomValue(userPostsAtom);
  
  return (
    <div>
      <h3>Posts ({posts.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.slice(0, 3).map(post => (
          <li key={post.id} style={{ 
            padding: '10px', 
            margin: '5px 0', 
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            <strong>{post.title}</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===== 5. ACTION ATOMS =====

// Write-only atoms for actions
const historyAtom = atom([]);

const incrementActionAtom = atom(
  null,
  (get, set) => {
    const current = get(countAtom);
    set(countAtom, current + 1);
    set(historyAtom, [...get(historyAtom), { 
      action: 'increment', 
      value: current + 1, 
      timestamp: Date.now() 
    }]);
  }
);

const decrementActionAtom = atom(
  null,
  (get, set) => {
    const current = get(countAtom);
    set(countAtom, current - 1);
    set(historyAtom, [...get(historyAtom), { 
      action: 'decrement', 
      value: current - 1, 
      timestamp: Date.now() 
    }]);
  }
);

const resetActionAtom = atom(
  null,
  (get, set) => {
    set(countAtom, 0);
    set(historyAtom, []);
  }
);

// Action-based Counter Component
function ActionCounter() {
  const count = useAtomValue(countAtom);
  const history = useAtomValue(historyAtom);
  const increment = useSetAtom(incrementActionAtom);
  const decrement = useSetAtom(decrementActionAtom);
  const reset = useSetAtom(resetActionAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Action Counter: {count}</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <button onClick={reset}>Reset</button>
      </div>
      
      <div>
        <h4>History:</h4>
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: '150px', overflow: 'auto' }}>
          {history.map((entry, index) => (
            <li key={index} style={{ 
              padding: '5px', 
              margin: '2px 0', 
              backgroundColor: '#f8f9fa',
              fontSize: '12px'
            }}>
              {entry.action}: {entry.value} ({new Date(entry.timestamp).toLocaleTimeString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ===== 6. PERSISTED ATOMS =====

// Atoms with storage persistence
const themeAtom = atomWithStorage('jotai-theme', 'light');
const userPreferencesAtom = atomWithStorage('jotai-preferences', {
  fontSize: 16,
  language: 'en',
  sidebarOpen: true
});

// Theme Toggle Component
function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333'
    }}>
      <h2>Theme Persistence</h2>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </button>
      <p style={{ fontSize: '12px', marginTop: '10px' }}>
        Theme is persisted to localStorage and survives page reloads
      </p>
    </div>
  );
}

// User Preferences Component
function UserPreferences() {
  const [preferences, setPreferences] = useAtom(userPreferencesAtom);
  
  const updatePreference = (key, value) => {
    setPreferences({ ...preferences, [key]: value });
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>User Preferences</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Font Size:</label>
        <input
          type="range"
          min="12"
          max="24"
          value={preferences.fontSize}
          onChange={(e) => updatePreference('fontSize', Number(e.target.value))}
        />
        <span style={{ marginLeft: '10px' }}>{preferences.fontSize}px</span>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Language:</label>
        <select
          value={preferences.language}
          onChange={(e) => updatePreference('language', e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={preferences.sidebarOpen}
            onChange={(e) => updatePreference('sidebarOpen', e.target.checked)}
            style={{ marginRight: '5px' }}
          />
          Sidebar Open
        </label>
      </div>
      
      <p style={{ fontSize: '12px', color: '#666' }}>
        Preferences are persisted to localStorage
      </p>
    </div>
  );
}

// ===== 7. ATOM FAMILIES =====

// Parameterized atoms for collections
const todoAtomFamily = atomFamily((id) => 
  atom({ id, text: '', completed: false })
);

const todoIdsAtom = atom([1, 2, 3]);

// Todo Item Component using atom family
function TodoItem({ id }) {
  const [todo, setTodo] = useAtom(todoAtomFamily(id));
  
  const toggleCompleted = () => {
    setTodo({ ...todo, completed: !todo.completed });
  };
  
  const updateText = (text) => {
    setTodo({ ...todo, text });
  };
  
  return (
    <div style={{ 
      padding: '10px', 
      margin: '5px 0', 
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: todo.completed ? '#f8f9fa' : '#fff'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleCompleted}
        style={{ marginRight: '10px' }}
      />
      <input
        type="text"
        value={todo.text}
        onChange={(e) => updateText(e.target.value)}
        placeholder="Todo text..."
        style={{ 
          border: 'none', 
          outline: 'none',
          textDecoration: todo.completed ? 'line-through' : 'none',
          flex: 1
        }}
      />
    </div>
  );
}

// Todo List Component using atom family
function TodoListFamily() {
  const [todoIds, setTodoIds] = useAtom(todoIdsAtom);
  
  const addTodo = () => {
    const newId = Math.max(...todoIds, 0) + 1;
    setTodoIds([...todoIds, newId]);
  };
  
  const removeTodo = (id) => {
    setTodoIds(todoIds.filter(todoId => todoId !== id));
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Todo List (Atom Family)</h2>
      
      {todoIds.map(id => (
        <div key={id} style={{ display: 'flex', alignItems: 'center' }}>
          <TodoItem id={id} />
          <button 
            onClick={() => removeTodo(id)}
            style={{ 
              marginLeft: '10px', 
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Remove
          </button>
        </div>
      ))}
      
      <button 
        onClick={addTodo}
        style={{ 
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Add Todo
      </button>
    </div>
  );
}

// ===== 8. LOADABLE ATOMS =====

// Async atoms with loading states without Suspense
const loadableUserAtom = loadable(userDataAtom);

// Loadable User Component
function LoadableUserDisplay() {
  const [userId, setUserId] = useAtom(userIdAtom);
  const userLoadable = useAtomValue(loadableUserAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Loadable User Data</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>User ID:</label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          min="1"
          max="10"
          style={{ padding: '5px' }}
        />
      </div>
      
      {userLoadable.state === 'loading' && (
        <div>Loading user data...</div>
      )}
      
      {userLoadable.state === 'hasError' && (
        <div style={{ color: 'red' }}>
          Error: {userLoadable.error.message}
        </div>
      )}
      
      {userLoadable.state === 'hasData' && (
        <div>
          <h3>{userLoadable.data.name}</h3>
          <p>Email: {userLoadable.data.email}</p>
          <p>Phone: {userLoadable.data.phone}</p>
          <p>Website: {userLoadable.data.website}</p>
        </div>
      )}
    </div>
  );
}

// ===== 9. SELECT ATOMS =====

// Optimized atoms with fine-grained subscriptions
const complexUserAtom = atom({
  id: 1,
  profile: { name: 'John', age: 30, email: 'john@example.com' },
  settings: { theme: 'light', notifications: true },
  metadata: { lastLogin: Date.now(), version: '1.0.0' }
});

const userNameAtom = selectAtom(complexUserAtom, (user) => user.profile.name);
const userThemeAtom = selectAtom(complexUserAtom, (user) => user.settings.theme);
const userAgeGroupAtom = selectAtom(
  complexUserAtom,
  (user) => Math.floor(user.profile.age / 10) * 10,
  (prev, next) => prev === next
);

// Select User Component
function SelectUserDisplay() {
  const [user, setUser] = useAtom(complexUserAtom);
  const userName = useAtomValue(userNameAtom);
  const userTheme = useAtomValue(userThemeAtom);
  const userAgeGroup = useAtomValue(userAgeGroupAtom);
  
  const updateTheme = (theme) => {
    setUser({
      ...user,
      settings: { ...user.settings, theme }
    });
  };
  
  const updateMetadata = () => {
    setUser({
      ...user,
      metadata: { ...user.metadata, lastLogin: Date.now() }
    });
  };
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Select Atoms (Optimized)</h2>
      
      <p><strong>Name (selectAtom):</strong> {userName}</p>
      <p><strong>Theme (selectAtom):</strong> {userTheme}</p>
      <p><strong>Age Group (selectAtom):</strong> {userAgeGroup}s</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => updateTheme(userTheme === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </button>
        <button onClick={updateMetadata} style={{ marginLeft: '10px' }}>
          Update Metadata
        </button>
      </div>
      
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Only components that depend on changed values re-render
      </p>
    </div>
  );
}

// ===== 10. SPLIT ATOMS =====

// Efficient array item management
const todosArrayAtom = atom([
  { id: 1, text: 'Learn Jotai', completed: false },
  { id: 2, text: 'Build apps', completed: true },
  { id: 3, text: 'Master state management', completed: false }
]);

const todoAtomsAtom = splitAtom(todosArrayAtom);

// Split Todo Item Component
function SplitTodoItem({ itemAtom }) {
  const [item, setItem] = useAtom(itemAtom);
  
  const toggleCompleted = () => {
    setItem({ ...item, completed: !item.completed });
  };
  
  const updateText = (text) => {
    setItem({ ...item, text });
  };
  
  return (
    <div style={{ 
      padding: '10px', 
      margin: '5px 0', 
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: item.completed ? '#f8f9fa' : '#fff'
    }}>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={toggleCompleted}
        style={{ marginRight: '10px' }}
      />
      <input
        type="text"
        value={item.text}
        onChange={(e) => updateText(e.target.value)}
        style={{ 
          border: 'none', 
          outline: 'none',
          textDecoration: item.completed ? 'line-through' : 'none',
          flex: 1
        }}
      />
    </div>
  );
}

// Split Todo List Component
function SplitTodoList() {
  const [todoAtoms] = useAtom(todoAtomsAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Split Todo List (Efficient Updates)</h2>
      
      {todoAtoms.map((itemAtom) => (
        <SplitTodoItem key={`${itemAtom}`} itemAtom={itemAtom} />
      ))}
      
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Each todo item updates independently without re-rendering the entire list
      </p>
    </div>
  );
}

// ===== 11. USE ATOM CALLBACK =====

// Imperative atom access in callbacks
function AtomCallbackExample() {
  const [count] = useAtom(countAtom);
  const [logs, setLogs] = useState([]);
  
  // Callback with read access
  const logState = useAtomCallback(
    useCallback((get) => {
      const count = get(countAtom);
      const user = get(userAtom);
      const text = get(textAtom);
      const logEntry = `State: count=${count}, user=${user.name}, text=${text}`;
      setLogs(prev => [...prev, logEntry]);
      return { count, user, text };
    }, [setLogs])
  );
  
  // Callback with write access
  const complexUpdate = useAtomCallback(
    useCallback((get, set) => {
      const currentCount = get(countAtom);
      const currentUser = get(userAtom);
      
      // Multiple atom updates in one callback
      set(countAtom, currentCount + 10);
      set(userAtom, { ...currentUser, age: currentUser.age + 1 });
      set(textAtom, 'Updated via callback!');
      
      setLogs(prev => [...prev, 'Complex update executed']);
    }, [setLogs])
  );
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Atom Callback Example</h2>
      
      <p>Current count: {count}</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={logState}>Log Current State</button>
        <button onClick={complexUpdate} style={{ marginLeft: '10px' }}>
          Complex Update
        </button>
      </div>
      
      <div>
        <h4>Logs:</h4>
        <div style={{ 
          maxHeight: '150px', 
          overflow: 'auto', 
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          {logs.map((log, index) => (
            <div key={index} style={{ fontSize: '12px', marginBottom: '5px' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 12. PROVIDER EXAMPLES =====

// Multiple isolated atom scopes
function ProviderExample() {
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Provider Examples</h2>
      
      <h3>Shared State (No Provider):</h3>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <Counter />
        <Counter />
      </div>
      
      <h3>Isolated State (Separate Providers):</h3>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <Provider>
          <Counter />
        </Provider>
        <Provider>
          <Counter />
        </Provider>
      </div>
      
      <h3>Nested Providers:</h3>
      <Provider>
        <div style={{ padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <p>Outer Provider</p>
          <Counter />
          <Provider>
            <div style={{ padding: '10px', backgroundColor: '#f3e5f5', borderRadius: '4px', marginTop: '10px' }}>
              <p>Inner Provider (isolated)</p>
              <Counter />
            </div>
          </Provider>
        </div>
      </Provider>
    </div>
  );
}

// ===== 13. HYDRATION EXAMPLE =====

// SSR hydration example
function HydrationExample({ initialCount, initialUser }) {
  // Hydrate atoms with initial values
  useHydrateAtoms([
    [countAtom, initialCount],
    [userAtom, initialUser]
  ]);
  
  const [count, setCount] = useAtom(countAtom);
  const [user] = useAtom(userAtom);
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Hydration Example</h2>
      <p><strong>Hydrated Count:</strong> {count}</p>
      <p><strong>Hydrated User:</strong> {user.name} (Age: {user.age})</p>
      <button onClick={() => setCount(count + 1)}>
        Increment Hydrated Count
      </button>
      
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Atoms were hydrated with server-side data
      </p>
    </div>
  );
}

// ===== MAIN APP COMPONENT =====

function JotaiExamples() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Jotai Examples</h1>
      
      <Counter />
      <TextInput />
      <UserProfile />
      
      <DerivedCounter />
      <TodoStats />
      
      <TemperatureConverter />
      <NameEditor />
      
      <AsyncUserDisplay />
      
      <ActionCounter />
      
      <ThemeToggle />
      <UserPreferences />
      
      <TodoListFamily />
      
      <LoadableUserDisplay />
      
      <SelectUserDisplay />
      
      <SplitTodoList />
      
      <AtomCallbackExample />
      
      <ProviderExample />
      
      <HydrationExample 
        initialCount={100} 
        initialUser={{ name: 'Hydrated User', age: 25 }} 
      />
      
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <h2>Jotai Benefits</h2>
        <ul>
          <li><strong>Atomic:</strong> Bottom-up approach with atoms as fundamental units</li>
          <li><strong>Minimal:</strong> Core is only 2kb with optional utilities</li>
          <li><strong>Flexible:</strong> Composable atoms for complex state relationships</li>
          <li><strong>TypeScript:</strong> First-class TypeScript support</li>
          <li><strong>Performance:</strong> Fine-grained subscriptions and optimizations</li>
          <li><strong>No Boilerplate:</strong> Simple API without providers or actions</li>
          <li><strong>Suspense Ready:</strong> Built-in async state handling</li>
          <li><strong>DevTools:</strong> Excellent debugging capabilities</li>
        </ul>
        
        <h3>Key Concepts Demonstrated:</h3>
        <ul>
          <li><strong>Basic Atoms:</strong> Primitive state management</li>
          <li><strong>Derived Atoms:</strong> Computed values and transformations</li>
          <li><strong>Writable Derived:</strong> Two-way binding with custom logic</li>
          <li><strong>Async Atoms:</strong> Data fetching with Suspense</li>
          <li><strong>Action Atoms:</strong> Write-only operations</li>
          <li><strong>Persistence:</strong> Storage integration</li>
          <li><strong>Atom Families:</strong> Parameterized collections</li>
          <li><strong>Loadable:</strong> Async states without Suspense</li>
          <li><strong>Select Atoms:</strong> Performance optimization</li>
          <li><strong>Split Atoms:</strong> Efficient array management</li>
          <li><strong>Callbacks:</strong> Imperative operations</li>
          <li><strong>Providers:</strong> State isolation</li>
          <li><strong>Hydration:</strong> SSR support</li>
        </ul>
      </div>
    </div>
  );
}

export default JotaiExamples;