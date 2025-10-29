# Redux Toolkit (RTK)

Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development. It simplifies Redux store setup, reduces boilerplate, and includes best practices by default.

## Overview

Redux Toolkit was created to address common concerns about Redux:
- Complicated store setup
- Too much boilerplate code
- Need to add several packages to get started
- Configuration requirements

## Key Features

- **Simplified Store Setup**: `configureStore` with sensible defaults
- **Reduced Boilerplate**: `createSlice` for reducers and actions
- **Built-in Immer**: Allows writing "mutating" code in reducers
- **Included Thunk Middleware**: For async operations out of the box
- **DevTools Integration**: Automatic setup with Redux DevTools

## Installation

```bash
# Using npm
npm install @reduxjs/toolkit react-redux

# Using yarn
yarn add @reduxjs/toolkit react-redux

# Using pnpm
pnpm add @reduxjs/toolkit react-redux
```

## Basic Usage

### Store Setup with configureStore

```javascript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable if needed
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
```

### Creating a Slice with createSlice

```javascript
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
      // Immer allows us to write "mutating" logic
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle async actions here
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Selectors
export const selectCount = (state) => state.counter.value;

export default counterSlice.reducer;
```

### Async Thunks with createAsyncThunk

```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching data
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Using the async thunk in a slice
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    entities: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.entities.push(action.payload);
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});
```

### React Integration

```jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, selectCount } from './counterSlice';

function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>
        Add 5
      </button>
    </div>
  );
}

export default Counter;
```

## Advanced Usage

### Creating API Slices with createApi

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
} = apiSlice;
```

### Using the API in Components

```jsx
import React from 'react';
import { useGetUsersQuery, useCreateUserMutation } from './apiSlice';

function UserList() {
  const { data: users, error, isLoading } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const handleCreateUser = async () => {
    try {
      await createUser({ name: 'John Doe', email: 'john@example.com' });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button onClick={handleCreateUser} disabled={isCreating}>
        Create User
      </button>
    </div>
  );
}

export default UserList;
```

## Best Practices

### 1. Structure Your Files

```
src/
  app/
    store.js          # Store configuration
    hooks.js          # Custom hooks
  features/
    counter/
      counterSlice.js # Slice definition
      Counter.jsx     # Component
    user/
      userSlice.js    # Slice definition
      UserList.jsx    # Component
  api/
    apiSlice.js       # API slice definition
```

### 2. Use TypeScript

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CounterState = {
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
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});
```

### 3. Normalize State Shape

```javascript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    loading: 'idle',
  }),
  reducers: {
    // Can pass adapter functions directly as case reducers
    userAdded: usersAdapter.addOne,
    usersLoading(state, action) {
      state.loading = 'pending';
    },
    usersReceived(state, action) {
      usersAdapter.setAll(state, action.payload);
      state.loading = 'idle';
    },
  },
});

// Export selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users);
```

## Performance Optimization

### 1. Memoized Selectors

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectTodos = (state) => state.todos;
const selectFilter = (state) => state.filter;

export const selectVisibleTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case 'SHOW_ALL':
        return todos;
      case 'SHOW_COMPLETED':
        return todos.filter((todo) => todo.completed);
      case 'SHOW_ACTIVE':
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }
);
```

### 2. Lazy Loading Slices

```javascript
// In your component
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function LazyComponent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserSlice = async () => {
      const { userSlice } = await import('./userSlice');
      dispatch(userSlice.actions.initialize());
    };
    loadUserSlice();
  }, [dispatch]);

  return <div>Lazy loaded component</div>;
}
```

## Resources

- [Official Documentation](https://redux-toolkit.js.org/)
- [Redux Essentials Tutorial](https://redux-toolkit.js.org/tutorials/essentials/part-1-overview-concepts)
- [Redux Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [GitHub Repository](https://github.com/reduxjs/redux-toolkit)