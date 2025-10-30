// Redux Toolkit Examples with TypeScript
// This file demonstrates various Redux Toolkit concepts with comprehensive TypeScript typing

import React, { useState, useEffect } from 'react';
import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// ===== TYPE DEFINITIONS =====

// Interface for counter state
interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Interface for todo item
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Type for filter options
type FilterType = 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED';

// Interface for todo state
interface TodosState {
  items: Todo[];
  loading: boolean;
  error: string | null;
  filter: FilterType;
}

// Interface for user
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

// Interface for users state
interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
}

// Type for async thunk return value
interface AsyncThunkConfig {
  state?: unknown;
  dispatch?: Dispatch;
  extra?: unknown;
  rejectValue?: string;
}

// ===== EXAMPLE 1: BASIC REDUX TOOLKIT SETUP =====

/**
 * Basic Redux Toolkit setup demonstrating createSlice and configureStore with TypeScript
 * Redux Toolkit simplifies Redux setup with opinionated defaults and type safety
 */

// Create a typed slice using createSlice
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    status: 'idle',
  } as CounterState,
  reducers: {
    // Reducer functions for synchronous actions
    increment: (state) => {
      // Immer allows us to write "mutating" logic
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      // action.payload contains the data passed to the action
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    // Handle actions from other slices or async thunks
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = 'succeeded';
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

// Export the auto-generated action creators
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

// Create a typed async thunk
export const incrementAsync = createAsyncThunk<
  number, // Return type
  number, // Argument type
  AsyncThunkConfig // ThunkAPI type
>(
  'counter/incrementAsync',
  async (amount, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return amount;
    } catch (error) {
      return rejectWithValue('Failed to increment');
    }
  }
);

// Export the typed reducer
export const counterReducer = counterSlice.reducer;

// Configure the store with the counter reducer
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
  // Redux DevTools is automatically configured
  devTools: process.env.NODE_ENV !== 'production',
});

// Counter Component using Redux Toolkit with TypeScript
const Counter: React.FC = () => {
  // useSelector to read data from the store with proper typing
  const count = useSelector((state: { counter: CounterState }) => state.counter.value);
  const status = useSelector((state: { counter: CounterState }) => state.counter.status);
  
  // useDispatch to get dispatch function
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleDecrement = () => {
    dispatch(decrement());
  };

  const handleIncrementByAmount = () => {
    dispatch(incrementByAmount(5));
  };

  const handleAsyncIncrement = () => {
    dispatch(incrementAsync(10));
  };

  const handleReset = () => {
    dispatch(reset());
  };

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      border: '1px solid #ddd', 
      margin: '10px',
      borderRadius: '8px'
    }}>
      <h2>Redux Toolkit Counter</h2>
      
      <div style={{ fontSize: '2rem', margin: '20px 0' }}>
        Count: {count}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        Status: <strong>{status}</strong>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={handleIncrement}>
          Increment (+1)
        </button>
        
        <button onClick={handleDecrement}>
          Decrement (-1)
        </button>
        
        <button onClick={handleIncrementByAmount}>
          Increment by 5
        </button>
        
        <button onClick={handleAsyncIncrement} disabled={status === 'loading'}>
          {status === 'loading' ? 'Loading...' : 'Async Increment (+10)'}
        </button>
        
        <button onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

// ===== EXAMPLE 2: TODO SLICE WITH CRUD OPERATIONS =====

/**
 * Todo slice demonstrating CRUD operations with Redux Toolkit and TypeScript
 * Shows how to handle arrays and more complex state with proper typing
 */

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filter: 'SHOW_ALL',
  } as TodosState,
  reducers: {
    // Add a new todo with typed payload
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
        createdAt: new Date().toISOString(),
      });
    },
    
    // Toggle todo completion status
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    
    // Edit todo text with typed payload
    editTodo: (state, action: PayloadAction<{ id: number; text: string }>) => {
      const { id, text } = action.payload;
      const todo = state.items.find(todo => todo.id === id);
      if (todo) {
        todo.text = text;
        todo.updatedAt = new Date().toISOString();
      }
    },
    
    // Delete a todo
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
    
    // Clear completed todos
    clearCompleted: (state) => {
      state.items = state.items.filter(todo => !todo.completed);
    },
    
    // Set filter with typed payload
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
    
    // Toggle all todos
    toggleAll: (state) => {
      const allCompleted = state.items.every(todo => todo.completed);
      state.items.forEach(todo => {
        todo.completed = !allCompleted;
      });
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  editTodo,
  deleteTodo,
  clearCompleted,
  setFilter,
  toggleAll,
} = todosSlice.actions;

// Typed selectors for computed values
export const selectTodos = (state: { todos: TodosState }) => state.todos.items;
export const selectFilter = (state: { todos: TodosState }) => state.todos.filter;
export const selectLoading = (state: { todos: TodosState }) => state.todos.loading;
export const selectError = (state: { todos: TodosState }) => state.todos.error;

// Memoized selector for filtered todos
export const selectFilteredTodos = (state: { todos: TodosState }) => {
  const todos = selectTodos(state);
  const filter = selectFilter(state);
  
  switch (filter) {
    case 'SHOW_COMPLETED':
      return todos.filter(todo => todo.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};

// Memoized selector for todo statistics
export const selectTodoStats = (state: { todos: TodosState }) => {
  const todos = selectTodos(state);
  
  return {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
    completionRate: todos.length > 0 
      ? Math.round((todos.filter(todo => todo.completed).length / todos.length) * 100)
      : 0,
  };
};

// Todo Input Component with TypeScript
const TodoInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (inputValue.trim()) {
      dispatch(addTodo(inputValue.trim()));
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new todo..."
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
        Add Todo
      </button>
    </form>
  );
};

// Todo List Component with TypeScript
const TodoList: React.FC = () => {
  const todos = useSelector(selectFilteredTodos);
  const dispatch = useDispatch();

  const handleToggle = (id: number) => {
    dispatch(toggleTodo(id));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTodo(id));
  };

  const handleEdit = (id: number, newText: string) => {
    if (newText.trim()) {
      dispatch(editTodo({ id, text: newText.trim() }));
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
          {todos.map(todo => (
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
};

// Todo Item Component with TypeScript props
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(todo.text);

  const handleSave = () => {
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
};

// Todo Controls Component with TypeScript
const TodoControls: React.FC = () => {
  const filter = useSelector(selectFilter);
  const stats = useSelector(selectTodoStats);
  const dispatch = useDispatch();

  const handleFilterChange = (newFilter: FilterType) => {
    dispatch(setFilter(newFilter));
  };

  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };

  const handleToggleAll = () => {
    dispatch(toggleAll());
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
        {(['SHOW_ALL', 'SHOW_ACTIVE', 'SHOW_COMPLETED'] as FilterType[]).map(f => (
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
};

// ===== EXAMPLE 3: ASYNC THUNKS WITH API CALLS =====

/**
 * Async thunks demonstrating API calls with Redux Toolkit and TypeScript
 * Shows how to handle loading states and errors with proper typing
 */

// Create typed async thunks for user operations
export const fetchUsers = createAsyncThunk<
  User[], // Return type
  void, // Argument type
  AsyncThunkConfig // ThunkAPI type
>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      return data as User[];
    } catch (error) {
      return rejectWithValue('Failed to fetch users');
    }
  }
);

export const createUser = createAsyncThunk<
  User, // Return type
  Omit<User, 'id'>, // Argument type
  AsyncThunkConfig // ThunkAPI type
>(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      const data = await response.json();
      return data as User;
    } catch (error) {
      return rejectWithValue('Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk<
  User, // Return type
  { id: number; userData: Partial<User> }, // Argument type
  AsyncThunkConfig // ThunkAPI type
>(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      const data = await response.json();
      return data as User;
    } catch (error) {
      return rejectWithValue('Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk<
  number, // Return type
  number, // Argument type
  AsyncThunkConfig // ThunkAPI type
>(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      return id; // Return the deleted user ID
    } catch (error) {
      return rejectWithValue('Failed to delete user');
    }
  }
);

// Users slice with async thunks and TypeScript
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedUser: null,
  } as UsersState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.items.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedUser, clearSelectedUser } = usersSlice.actions;

// User management components with TypeScript
const UserList: React.FC = () => {
  const users = useSelector((state: { users: UsersState }) => state.users.items);
  const loading = useSelector((state: { users: UsersState }) => state.users.loading);
  const error = useSelector((state: { users: UsersState }) => state.users.error);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSelectUser = (user: User) => {
    dispatch(setSelectedUser(user));
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  if (loading && users.length === 0) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>User List</h3>
      
      <button
        onClick={() => dispatch(fetchUsers())}
        disabled={loading}
        style={{
          marginBottom: '10px',
          padding: '5px 10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Refreshing...' : 'Refresh Users'}
      </button>
      
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map(user => (
            <li
              key={user.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                margin: '5px 0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white'
              }}
            >
              <div>
                <strong>{user.name}</strong> - {user.email}
              </div>
              <div>
                <button
                  onClick={() => handleSelectUser(user)}
                  style={{
                    marginRight: '5px',
                    padding: '2px 8px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }}
                >
                  Select
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// User Form Component with TypeScript
const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    phone: '',
    website: '',
  });
  
  const loading = useSelector((state: { users: UsersState }) => state.users.loading);
  const error = useSelector((state: { users: UsersState }) => state.users.error);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createUser(formData));
    setFormData({ name: '', email: '', phone: '', website: '' });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Create New User</h3>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Website:</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

// ===== MAIN APP COMPONENT =====

/**
 * Main component that demonstrates all Redux Toolkit TypeScript examples
 */
const ReduxToolkitExamples: React.FC = () => {
  // Configure store with all reducers
  const store = configureStore({
    reducer: {
      counter: counterReducer,
      todos: todosSlice.reducer,
      users: usersSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });

  return (
    <Provider store={store}>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>Redux Toolkit TypeScript Examples</h1>
        
        <Counter />
        
        <div style={{ marginTop: '30px' }}>
          <h2>Todo Management</h2>
          <TodoInput />
          <TodoControls />
          <TodoList />
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h2>User Management</h2>
          <UserForm />
          <UserList />
        </div>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px' 
        }}>
          <h3>Redux Toolkit TypeScript Benefits</h3>
          <ul>
            <li><strong>Simplified Setup:</strong> configureStore with sensible defaults</li>
            <li><strong>Less Boilerplate:</strong> createSlice combines reducers and actions</li>
            <li><strong>Immer Integration:</strong> Write "mutating" code in reducers</li>
            <li><strong>Async Thunks:</strong> Built-in async action handling</li>
            <li><strong>TypeScript Support:</strong> Excellent type safety</li>
            <li><strong>DevTools Integration:</strong> Automatic setup</li>
            <li><strong>Performance:</strong> Optimized re-renders</li>
          </ul>
          
          <h4>Key TypeScript Concepts Demonstrated:</h4>
          <ul>
            <li><strong>Interface Definitions:</strong> Defining state and action types</li>
            <li><strong>Typed Slices:</strong> Creating type-safe slices</li>
            <li><strong>Typed Thunks:</strong> Type-safe async operations</li>
            <li><strong>Typed Selectors:</strong> Creating reusable typed selectors</li>
            <li><strong>Typed Hooks:</strong> Using typed React-Redux hooks</li>
            <li><strong>Middleware Types:</strong> Typing custom middleware</li>
          </ul>
        </div>
      </div>
    </Provider>
  );
};

export default ReduxToolkitExamples;