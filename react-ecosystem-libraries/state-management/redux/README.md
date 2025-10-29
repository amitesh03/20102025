# Redux

Redux is a predictable state container for JavaScript applications. It helps you write applications that behave consistently, run in different environments, and are easy to test.

## Overview

Redux is most commonly used with React, but it can be used with any other JavaScript framework or library. It is a small library with a simple, predictable API.

## Core Concepts

### 1. Single Source of Truth
The state of your whole application is stored in an object tree within a single store.

### 2. State is Read-Only
The only way to change the state is to emit an action, an object describing what happened.

### 3. Changes are Made with Pure Functions
To specify how the state tree is transformed by actions, you write pure reducers.

## Installation

```bash
# Using npm
npm install redux

# Using yarn
yarn add redux

# Using pnpm
pnpm add redux

# For React integration
npm install react-redux
```

## Basic Usage

### Store Setup

```javascript
import { createStore } from 'redux';

// Initial state
const initialState = {
  count: 0,
  user: null,
};

// Reducer function
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

// Create store
const store = createStore(counterReducer);

// Get state
console.log(store.getState()); // { count: 0, user: null }

// Dispatch actions
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });

console.log(store.getState()); // { count: 1, user: null }
```

### React Integration

```jsx
import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { createStore } from 'redux';

// Reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// Store
const store = createStore(counterReducer);

// Component
function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>
        Decrement
      </button>
    </div>
  );
}

// App
function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

export default App;
```

## Action Creators

Action creators are functions that create and return action objects.

```javascript
// Action types
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const ADD_TODO = 'ADD_TODO';

// Action creators
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });

export const addTodo = (text) => ({
  type: ADD_TODO,
  payload: {
    id: Date.now(),
    text,
    completed: false,
  },
});
```

## Async Actions with Middleware

Redux doesn't handle async operations by default. You need middleware like Redux Thunk or Redux Saga.

### Using Redux Thunk

```bash
npm install redux-thunk
```

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Async action creator
export const fetchUser = (userId) => {
  return async (dispatch, getState) => {
    dispatch({ type: 'FETCH_USER_REQUEST' });
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'FETCH_USER_FAILURE', error });
    }
  };
};

// Store with middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);
```

## Combining Reducers

Use `combineReducers` to split your reducing function into separate functions.

```javascript
import { combineReducers } from 'redux';

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    default:
      return state;
  }
};

const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'CLEAR_USER':
      return null;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  todos: todosReducer,
  user: userReducer,
});

const store = createStore(rootReducer);
```

## Middleware

Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer.

```javascript
import { createStore, applyMiddleware } from 'redux';

// Custom middleware example
const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};

const store = createStore(
  rootReducer,
  applyMiddleware(loggerMiddleware)
);
```

## DevTools Integration

```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(...middleware)
    // other store enhancers if any
  )
);
```

## Best Practices

1. **Keep your state shape normalized** to avoid nested data
2. **Use action creators** instead of inline action objects
3. **Split reducers** by domain/feature
4. **Use middleware** for side effects and async operations
5. **Use TypeScript** for better type safety
6. **Keep reducers pure** and predictable
7. **Use selectors** to compute derived data

## Advanced Patterns

### Selectors

```javascript
import { createSelector } from 'reselect';

const getTodos = state => state.todos;
const getFilter = state => state.filter;

export const getVisibleTodos = createSelector(
  [getTodos, getFilter],
  (todos, filter) => {
    switch (filter) {
      case 'SHOW_ALL':
        return todos;
      case 'SHOW_COMPLETED':
        return todos.filter(todo => todo.completed);
      case 'SHOW_ACTIVE':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }
);
```

### Higher-Order Reducers

```javascript
const undoable = reducer => {
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
  };

  return function (state = initialState, action) {
    const { past, present, future } = state;

    switch (action.type) {
      case 'UNDO':
        return {
          past: past.slice(0, past.length - 1),
          present: past[past.length - 1],
          future: [present, ...future],
        };
      case 'REDO':
        return {
          past: [...past, present],
          present: future[0],
          future: future.slice(1),
        };
      default:
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          return state;
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        };
    }
  };
};
```

## Resources

- [Official Documentation](https://redux.js.org/)
- [React Redux Documentation](https://react-redux.js.org/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Redux Style Guide](https://redux.js.org/style-guide/style-guide)