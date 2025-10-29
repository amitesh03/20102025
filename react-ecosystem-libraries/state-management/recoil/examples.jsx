import React, { useState } from 'react';

// Recoil Examples - Educational Examples for Recoil
// Note: These examples show the basic concepts of Recoil state management

export default function RecoilExamples() {
  const [activeExample, setActiveExample] = useState('basic-state');

  return (
    <div className="examples-container">
      <h1>Recoil Examples</h1>
      <p className="intro">
        Recoil is an experimental state management library for React applications. It provides a way to create and manage global state with a minimal API and excellent performance.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('basic-state')} className={activeExample === 'basic-state' ? 'active' : ''}>
          Basic State
        </button>
        <button onClick={() => setActiveExample('selectors')} className={activeExample === 'selectors' ? 'active' : ''}>
          Selectors
        </button>
        <button onClick={() => setActiveExample('async-state')} className={activeExample === 'async-state' ? 'active' : ''}>
          Async State
        </button>
        <button onClick={() => setActiveExample('atom-family')} className={activeExample === 'atom-family' ? 'active' : ''}>
          Atom Family
        </button>
        <button onClick={() => setActiveExample('selector-family')} className={activeExample === 'selector-family' ? 'active' : ''}>
          Selector Family
        </button>
        <button onClick={() => setActiveExample('persistence')} className={activeExample === 'persistence' ? 'active' : ''}>
          Persistence
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'basic-state' && <BasicStateExample />}
        {activeExample === 'selectors' && <SelectorsExample />}
        {activeExample === 'async-state' && <AsyncStateExample />}
        {activeExample === 'atom-family' && <AtomFamilyExample />}
        {activeExample === 'selector-family' && <SelectorFamilyExample />}
        {activeExample === 'persistence' && <PersistenceExample />}
      </div>
    </div>
  );
}

// Basic State Example
function BasicStateExample() {
  return (
    <div className="example-section">
      <h2>Basic State with Recoil</h2>
      <p>Creating and using basic atoms and components with Recoil.</p>
      
      <div className="code-block">
        <h3>Creating an Atom</h3>
        <pre>
{`import { atom } from 'recoil';

// Create a simple atom with a default value
export const textState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

// Create a counter atom
export const counterState = atom({
  key: 'counterState',
  default: 0,
});

// Create an object atom
export const userState = atom({
  key: 'userState',
  default: {
    name: '',
    email: '',
    age: 0,
  },
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Using Atoms in Components</h3>
        <pre>
{`import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { textState, counterState, userState } from './atoms';

function TextInput() {
  const [text, setText] = useRecoilState(textState);
  
  const onChange = (event) => {
    setText(event.target.value);
  };
  
  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <p>You typed: {text}</p>
    </div>
  );
}

function Counter() {
  const [count, setCount] = useRecoilState(counterState);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

function UserInfo() {
  const user = useRecoilValue(userState);
  
  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <TextInput />
      <Counter />
      <UserInfo />
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Selectors Example
function SelectorsExample() {
  return (
    <div className="example-section">
      <h2>Selectors in Recoil</h2>
      <p>Creating and using selectors to derive state from atoms.</p>
      
      <div className="code-block">
        <h3>Creating Selectors</h3>
        <pre>
{`import { atom, selector } from 'recoil';

// Define atoms
export const firstNameState = atom({
  key: 'firstNameState',
  default: '',
});

export const lastNameState = atom({
  key: 'lastNameState',
  default: '',
});

// Create a selector that combines the first and last name
export const fullNameState = selector({
  key: 'fullNameState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const firstName = get(firstNameState);
    const lastName = get(lastNameState);
    return \`\${firstName} \${lastName}\`;
  },
});

// Create a selector with parameters
export const lengthState = selector({
  key: 'lengthState',
  get: ({ get }) => {
    const text = get(textState);
    return text.length;
  },
});

// Create a selector that filters data
export const evenNumbersState = selector({
  key: 'evenNumbersState',
  get: ({ get }) => {
    const numbers = get(numbersState);
    return numbers.filter(number => number % 2 === 0);
  },
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Using Selectors</h3>
        <pre>
{`import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { 
  firstNameState, 
  lastNameState, 
  fullNameState 
} from './atoms';

function NameInput() {
  const [firstName, setFirstName] = useRecoilState(firstNameState);
  const [lastName, setLastName] = useRecoilState(lastNameState);
  
  return (
    <div>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
    </div>
  );
}

function DisplayName() {
  const fullName = useRecoilValue(fullNameState);
  
  return <p>Full Name: {fullName}</p>;
}

function App() {
  return (
    <div>
      <NameInput />
      <DisplayName />
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Async State Example
function AsyncStateExample() {
  return (
    <div className="example-section">
      <h2>Async State with Recoil</h2>
      <p>Handling asynchronous operations with Recoil.</p>
      
      <div className="code-block">
        <h3>Async Selector</h3>
        <pre>
{`import { atom, selector } from 'recoil';

// Create an atom for the user ID
export const userIdState = atom({
  key: 'userIdState',
  default: 1,
});

// Create an async selector to fetch user data
export const currentUserState = selector({
  key: 'currentUserState',
  get: async ({ get }) => {
    const userId = get(userIdState);
    
    // Fetch user data from an API
    const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`);
    const userData = await response.json();
    
    return userData;
  },
});

// Create an async selector with error handling
export const postsState = selector({
  key: 'postsState',
  get: async ({ get }) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const posts = await response.json();
      return posts;
    } catch (error) {
      throw error;
    }
  },
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Loading and Error States</h3>
        <pre>
{`import React from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { currentUserState, userIdState } from './atoms';

function UserInfo() {
  const userLoadable = useRecoilValueLoadable(currentUserState);
  
  if (userLoadable.state === 'loading') {
    return <div>Loading user data...</div>;
  }
  
  if (userLoadable.state === 'hasError') {
    return <div>Error loading user data</div>;
  }
  
  if (userLoadable.state === 'hasValue') {
    const user = userLoadable.contents;
    return (
      <div>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
      </div>
    );
  }
  
  return null;
}

function UserSelector() {
  const [userId, setUserId] = useRecoilState(userIdState);
  
  return (
    <div>
      <label>
        Select User ID:
        <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>
    </div>
  );
}

function App() {
  return (
    <div>
      <UserSelector />
      <UserInfo />
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Atom Family Example
function AtomFamilyExample() {
  return (
    <div className="example-section">
      <h2>Atom Family in Recoil</h2>
      <p>Creating collections of atoms with atomFamily.</p>
      
      <div className="code-block">
        <h3>Creating an Atom Family</h3>
        <pre>
{`import { atomFamily } from 'recoil';

// Create an atom family for todo items
export const todoState = atomFamily({
  key: 'todoState', // unique ID
  default: {
    text: '',
    completed: false,
  },
});

// Create an atom family for user data
export const userState = atomFamily({
  key: 'userState',
  default: {
    name: 'Loading...',
    email: 'Loading...',
  },
});

// Create an atom family with a parameterized default
export const counterState = atomFamily({
  key: 'counterState',
  default: (param) => param * 10, // default value based on parameter
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Using Atom Family</h3>
        <pre>
{`import React from 'react';
import { useRecoilState } from 'recoil';
import { todoState } from './atoms';

function TodoItem({ id }) {
  const [todo, setTodo] = useRecoilState(todoState(id));
  
  const toggleCompleted = () => {
    setTodo(prevTodo => ({
      ...prevTodo,
      completed: !prevTodo.completed,
    }));
  };
  
  const updateText = (event) => {
    setTodo(prevTodo => ({
      ...prevTodo,
      text: event.target.value,
    }));
  };
  
  return (
    <div>
      <input
        type="text"
        value={todo.text}
        onChange={updateText}
      />
      <button onClick={toggleCompleted}>
        {todo.completed ? 'Undo' : 'Complete'}
      </button>
    </div>
  );
}

function TodoList() {
  const todoIds = [1, 2, 3, 4, 5];
  
  return (
    <div>
      <h2>Todo List</h2>
      {todoIds.map(id => (
        <TodoItem key={id} id={id} />
      ))}
    </div>
  );
}

function App() {
  return <TodoList />;
}`}
        </pre>
      </div>
    </div>
  );
}

// Selector Family Example
function SelectorFamilyExample() {
  return (
    <div className="example-section">
      <h2>Selector Family in Recoil</h2>
      <p>Creating parameterized selectors with selectorFamily.</p>
      
      <div className="code-block">
        <h3>Creating a Selector Family</h3>
        <pre>
{`import { atom, selectorFamily } from 'recoil';

// Define atoms
export const todosState = atom({
  key: 'todosState',
  default: [],
});

// Create a selector family to get a todo by ID
export const todoByIdState = selectorFamily({
  key: 'todoByIdState',
  get: (id) => ({ get }) => {
    const todos = get(todosState);
    return todos.find(todo => todo.id === id);
  },
});

// Create a selector family to filter todos by status
export const todosByStatusState = selectorFamily({
  key: 'todosByStatusState',
  get: (status) => ({ get }) => {
    const todos = get(todosState);
    return todos.filter(todo => todo.completed === status);
  },
});

// Create an async selector family
export const userByIdState = selectorFamily({
  key: 'userByIdState',
  get: (id) => async ({ get }) => {
    const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);
    return await response.json();
  },
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Using Selector Family</h3>
        <pre>
{`import React from 'react';
import { useRecoilValue } from 'recoil';
import { todoByIdState, todosByStatusState } from './selectors';

function TodoItem({ id }) {
  const todo = useRecoilValue(todoByIdState(id));
  
  if (!todo) {
    return <div>Todo not found</div>;
  }
  
  return (
    <div>
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
      <p>Status: {todo.completed ? 'Completed' : 'Pending'}</p>
    </div>
  );
}

function TodoList({ status }) {
  const todos = useRecoilValue(todosByStatusState(status));
  
  return (
    <div>
      <h2>
        {status ? 'Completed Todos' : 'Pending Todos'}
      </h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div>
      <TodoList status={false} />
      <TodoList status={true} />
      <TodoItem id={1} />
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Persistence Example
function PersistenceExample() {
  return (
    <div className="example-section">
      <h2>Persistence with Recoil</h2>
      <p>Persisting Recoil state to localStorage.</p>
      
      <div className="code-block">
        <h3>Creating Persistent Atoms</h3>
        <pre>
{`import { atom } from 'recoil';

// Helper function to create a persistent atom
const persistentAtom = (key, defaultValue) => {
  // Get the stored value from localStorage
  const storedValue = localStorage.getItem(key);
  
  return atom({
    key,
    default: storedValue !== null ? JSON.parse(storedValue) : defaultValue,
    effects: [
      ({ onSet }) => {
        onSet(newValue => {
          // Save the new value to localStorage
          localStorage.setItem(key, JSON.stringify(newValue));
        });
      },
    ],
  });
};

// Create persistent atoms
export const themeState = persistentAtom('themeState', 'light');
export const languageState = persistentAtom('languageState', 'en');
export const userPreferencesState = persistentAtom('userPreferencesState', {
  fontSize: 'medium',
  showNotifications: true,
});`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Using Persistent Atoms</h3>
        <pre>
{`import React from 'react';
import { useRecoilState } from 'recoil';
import { themeState, languageState, userPreferencesState } from './atoms';

function ThemeSelector() {
  const [theme, setTheme] = useRecoilState(themeState);
  
  return (
    <div>
      <label>
        Select Theme:
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
}

function LanguageSelector() {
  const [language, setLanguage] = useRecoilState(languageState);
  
  return (
    <div>
      <label>
        Select Language:
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </label>
    </div>
  );
}

function Preferences() {
  const [preferences, setPreferences] = useRecoilState(userPreferencesState);
  
  const updateFontSize = (fontSize) => {
    setPreferences(prev => ({
      ...prev,
      fontSize,
    }));
  };
  
  const toggleNotifications = () => {
    setPreferences(prev => ({
      ...prev,
      showNotifications: !prev.showNotifications,
    }));
  };
  
  return (
    <div>
      <h3>User Preferences</h3>
      <p>Font Size: {preferences.fontSize}</p>
      <p>Show Notifications: {preferences.showNotifications ? 'Yes' : 'No'}</p>
      
      <button onClick={() => updateFontSize('small')}>Small Font</button>
      <button onClick={() => updateFontSize('medium')}>Medium Font</button>
      <button onClick={() => updateFontSize('large')}>Large Font</button>
      
      <button onClick={toggleNotifications}>
        Toggle Notifications
      </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <ThemeSelector />
      <LanguageSelector />
      <Preferences />
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Add some basic styles for the examples
const style = document.createElement('style');
style.textContent = `
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.intro {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 30px;
}

.example-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.example-nav button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
}

.example-nav button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.example-content {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.example-section h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.code-block {
  margin: 20px 0;
}

.code-block h3 {
  color: #555;
  margin-bottom: 10px;
}

.code-block pre {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
}
`;
document.head.appendChild(style);