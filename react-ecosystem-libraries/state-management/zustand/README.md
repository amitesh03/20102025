# Zustand

Zustand is a small, fast, and scalable bearbones state-management solution. It has a simple API, minimal boilerplate, and no providers or context required.

## Overview

Zustand (German for "state") is an unopinionated state management library that provides a simple and intuitive API for managing state in React applications. It's designed to be minimal yet powerful.

## Key Features

- **Minimal API**: Simple and easy to learn
- **No Providers**: No need to wrap your app in providers
- **TypeScript Support**: Excellent TypeScript support out of the box
- **Performance Optimized**: Selective re-renders with fine-grained control
- **No Boilerplate**: Get started quickly with minimal setup
- **Framework Agnostic**: Can be used with vanilla JavaScript

## Installation

```bash
# Using npm
npm install zustand

# Using yarn
yarn add zustand

# Using pnpm
pnpm add zustand
```

## Basic Usage

### Creating a Store

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  // State
  count: 0,
  name: 'John Doe',
  
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setName: (name) => set({ name }),
}));

export default useStore;
```

### Using the Store in Components

```jsx
import React from 'react';
import useStore from './store';

function Counter() {
  // Subscribe to specific state slices
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  const reset = useStore((state) => state.reset);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

function UserProfile() {
  const name = useStore((state) => state.name);
  const setName = useStore((state) => state.setName);

  return (
    <div>
      <h2>Name: {name}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}

function App() {
  return (
    <div>
      <Counter />
      <UserProfile />
    </div>
  );
}

export default App;
```

## Advanced Patterns

### Using Multiple Selectors

```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  bears: 0,
  fish: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  addFish: () => set((state) => ({ fish: state.fish + 1 })),
}));

// Component that only subscribes to bears
function BearCounter() {
  const bears = useStore((state) => state.bears);
  const addBear = useStore((state) => state.addBear);
  
  return (
    <div>
      <h3>Bears: {bears}</h3>
      <button onClick={addBear}>Add Bear</button>
    </div>
  );
}

// Component that only subscribes to fish
function FishCounter() {
  const fish = useStore((state) => state.fish);
  const addFish = useStore((state) => state.addFish);
  
  return (
    <div>
      <h3>Fish: {fish}</h3>
      <button onClick={addFish}>Add Fish</button>
    </div>
  );
}
```

### Async Actions

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  
  fetchUser: async (userId) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

// Usage in component
function UserProfile({ userId }) {
  const user = useStore((state) => state.user);
  const loading = useStore((state) => state.loading);
  const error = useStore((state) => state.error);
  const fetchUser = useStore((state) => state.fetchUser);

  React.useEffect(() => {
    fetchUser(userId);
  }, [userId, fetchUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### Computed Values with Selectors

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  firstName: '',
  lastName: '',
  email: '',
  
  // Actions
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setEmail: (email) => set({ email }),
}));

// Selector for computed value
const useFullName = () => {
  return useStore((state) => `${state.firstName} ${state.lastName}`.trim());
};

// Usage in component
function UserProfile() {
  const firstName = useStore((state) => state.firstName);
  const lastName = useStore((state) => state.lastName);
  const setFirstName = useStore((state) => state.setFirstName);
  const setLastName = useStore((state) => state.setLastName);
  const fullName = useFullName();

  return (
    <div>
      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <h3>Full Name: {fullName}</h3>
    </div>
  );
}
```

### TypeScript Support

```typescript
import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  fetchUsers: () => Promise<void>;
  clearUser: () => void;
}

const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  users: [],
  loading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  
  fetchUsers: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      set({ users, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  clearUser: () => set({ user: null }),
}));

// Usage with proper typing
function UserList() {
  const users = useUserStore((state) => state.users);
  const loading = useUserStore((state) => state.loading);
  const fetchUsers = useUserStore((state) => state.fetchUsers);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Persisting State

```javascript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      bears: 0,
      addBear: () => set((state) => ({ bears: state.bears + 1 })),
    }),
    {
      name: 'bear-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage), // default: localStorage
    }
  )
);

// The state will be automatically persisted to localStorage
// and restored when the store is created
```

### DevTools Integration

```javascript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: 'counter-store', // optional name for the store
    }
  )
);
```

### Combining Multiple Stores

```javascript
import { create } from 'zustand';

// User store
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Theme store
const useThemeStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}));

// Component using multiple stores
function App() {
  const user = useUserStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <div className={`app ${theme}`}>
      <h1>Welcome {user?.name || 'Guest'}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## Best Practices

1. **Use Selectors**: Always use selectors to subscribe to specific state slices
2. **Organize by Feature**: Create separate stores for different features
3. **TypeScript**: Use TypeScript for better type safety
4. **Persist When Needed**: Use persist middleware for state that should survive page reloads
5. **DevTools**: Use devtools middleware for debugging
6. **Keep Stores Small**: Don't put everything in one store

## Performance Tips

1. **Shallow Comparison**: Zustand uses shallow comparison by default
2. **Select Specific State**: Only subscribe to the state you need
3. **Use Callbacks**: For expensive computations, use memoization
4. **Avoid Object Creation**: Don't create new objects in selectors unnecessarily

## Resources

- [Official Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [GitHub Repository](https://github.com/pmndrs/zzustand)
- [TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)
- [Examples](https://github.com/pmndrs/zustand/tree/main/examples)