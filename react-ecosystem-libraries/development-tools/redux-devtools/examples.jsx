/**
 * Redux DevTools Examples
 * 
 * Redux DevTools is a powerful tool for debugging Redux applications. It allows you to
 * inspect every state change, travel back in time, and replay actions with hot reloading.
 */

// Example 1: Basic setup with Redux DevTools
/*
// store.js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(...middleware)
    // other store enhancers if any
  )
);

export default store;
*/

// Example 2: Advanced configuration with options
/*
// store.js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import thunk from 'redux-thunk';

const composeEnhancers = composeWithDevTools({
  // Options: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
  name: 'My Redux App', // A custom name for the debug session
  trace: true, // Show stack trace for every action
  traceLimit: 25, // Max stack trace frames
  // Other options
});

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

export default store;
*/

// Example 3: Using Redux DevTools with Redux Toolkit
/*
// store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // Enable in development only
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
*/

// Example 4: Basic Redux slice for demonstration
/*
// features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  status: 'idle',
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
*/

// Example 5: Using Redux DevTools in a React component
/*
// components/Counter.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../features/counter/counterSlice';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}

export default Counter;
*/

// Example 6: Async actions with Redux Toolkit and DevTools
/*
// features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    return response.json();
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    entities: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
*/

// Example 7: Using Redux DevTools features
/*
// Redux DevTools provides several powerful features:

// 1. Time Travel Debugging
// - Click on actions in the history to jump to that state
// - Use the slider to scrub through state changes

// 2. Action Replay
// - Replay actions with different conditions
// - Test edge cases by modifying action payloads

// 3. State Inspection
// - Click on any state property to inspect its value
// - Use the "Diff" tab to see what changed

// 4. State Export/Import
// - Export current state as JSON
// - Import state to reproduce specific conditions

// 5. Action Logging
// - See all dispatched actions with timestamps
// - Filter actions by type
// - Search for specific actions
*/

// Example 8: Custom action creators with DevTools support
/*
// utils/actionCreators.js
export const createAppAction = (type, payloadCreator) => {
  const actionCreator = (...args) => {
    const payload = payloadCreator ? payloadCreator(...args) : args[0];
    return {
      type,
      payload,
      meta: {
        timestamp: Date.now(),
        // Add custom metadata for better debugging
      }
    };
  };
  
  // Add type information for better DevTools experience
  actionCreator.type = type;
  
  return actionCreator;
};

// Usage
export const addTodo = createAppAction('todos/add', (text) => ({
  id: Date.now(),
  text,
  completed: false,
}));
*/

// Example 9: Middleware for logging with DevTools
/*
// middleware/logger.js
export const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

// store.js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { logger } from './middleware/logger';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger))
);
*/

// Example 10: Using Redux DevTools with React Native
/*
// For React Native, you need to use the remote-redux-devtools package
// store.js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  composeWithDevTools({
    name: 'My React Native App',
    hostname: 'localhost',
    port: 8000,
    realtime: true,
  })
);

export default store;
*/

// Example 11: Persisting and rehydrating state with DevTools
/*
// store.js with redux-persist
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools()
);

const persistor = persistStore(store);

export { store, persistor };
*/

// Example 12: Testing with Redux DevTools
/*
// Redux DevTools can be used for testing:
// 1. Export state from a specific point in your app
// 2. Import that state in a test environment
// 3. Reproduce the exact conditions for testing

// Example test file:
// __tests__/counter.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Counter from '../components/Counter';

// Import a specific state for testing
const testState = {
  counter: {
    value: 10,
    status: 'idle',
  },
};

// Create a test store with the imported state
const testStore = { ...store };
testStore.getState = () => testState;

test('Counter displays initial value from state', () => {
  render(
    <Provider store={testStore}>
      <Counter />
    </Provider>
  );
  
  expect(screen.getByText(/Count: 10/i)).toBeInTheDocument();
});
*/

export const reduxDevToolsExamples = {
  description: "Examples of using Redux DevTools for debugging Redux applications",
  installation: {
    browser: "Install Redux DevTools Extension from browser store",
    package: "npm install redux-devtools-extension"
  },
  features: [
    "Time travel debugging",
    "Action replay",
    "State inspection and diffing",
    "State export/import",
    "Action logging and filtering",
    "Performance monitoring"
  ],
  setup: {
    basic: "composeWithDevTools()",
    advanced: "composeWithDevTools(options)",
    reduxToolkit: "configureStore({ devTools: true })"
  }
};