# Redux Toolkit with TypeScript

Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development. This folder demonstrates TypeScript integration with Redux Toolkit for type-safe state management.

## TypeScript Benefits with Redux Toolkit

1. **Type Safety**: Catch state-related errors at compile time
2. **Action Typing**: Type-safe actions and payloads
3. **Reducer Typing**: Ensure reducers handle correct action types
4. **Selector Typing**: Type-safe state selectors
5. **Middleware Typing**: Properly typed middleware and thunks

## Key TypeScript Concepts

- **Slice Types**: Defining typed state and actions
- **Typed Hooks**: Using typed useSelector and useDispatch
- **Thunk Typing**: Type-safe async operations
- **Middleware Types**: Typing custom middleware
- **Store Typing**: Properly typing the Redux store

## Installation

```bash
npm install @reduxjs/toolkit react-redux
npm install @types/react @types/react-dom
```

## Basic Usage

```typescript
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

// Define state interface
interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Create typed slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0, status: 'idle' } as CounterState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

// Configure typed store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});
```

## Advanced Patterns

- **Typed Async Thunks**: Type-safe async operations
- **Typed Selectors**: Creating reusable typed selectors
- **Typed Middleware**: Building custom middleware with types
- **Typed Hooks**: Using typed React-Redux hooks