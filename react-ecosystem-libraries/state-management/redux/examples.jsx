import React, { useState, useEffect, useCallback } from 'react';
import { 
  Provider, 
  useSelector, 
  useDispatch, 
  connect,
  createStore,
  combineReducers,
  applyMiddleware,
  bindActionCreators
} from 'react-redux';
import { 
  configureStore,
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit';

// Redux Examples - Comprehensive Guide to State Management
// Redux is a predictable state container for JavaScript applications, providing a centralized store
// for managing application state with a unidirectional data flow.

// ===== 1. BASIC REDUX SETUP =====

// Store configuration with Redux Toolkit
const createBasicStore = () => {
  const counterReducer = createSlice({
    name: 'counter',
    initialState: {
      value: 0,
      history: []
    },
    reducers: {
      increment: (state) => {
        state.value += 1;
        state.history.push(state.value);
        return state;
      },
      decrement: (state) => {
        state.value -= 1;
        state.history.push(state.value);
        return state;
      },
      reset: (state) => {
        state.history = [];
        state.value = 0;
        return state;
      },
      incrementByAmount: (state, action) => {
        state.value += action.payload;
        state.history.push(state.value);
        return state;
      }
    }
  });

  const userReducer = createSlice({
    name: 'user',
    initialState: {
      currentUser: null,
      loading: false,
      error: null
    },
    reducers: {
      clearError: (state) => {
        state.error = null;
        return state;
      }
    }
  });

  return configureStore({
    reducer: {
      counter: counterReducer.reducer,
      user: userReducer.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST']
        }
      })
  });
};

// ===== 2. PROVIDER SETUP =====

const BasicApp = () => {
  const store = createBasicStore();
  
  return (
    <Provider store={store}>
      <div className="app">
        <header>
          <h1>Redux Counter App</h1>
        </header>
        
        <main>
          <BasicCounter />
          <BasicUserProfile />
        </main>
      </div>
    </Provider>
  );
};

// ===== 3. HOOKS USAGE =====

const BasicCounter = () => {
  const count = useSelector((state) => state.counter.value);
  const history = useSelector((state) => state.counter.history);
  const dispatch = useDispatch();
  
  const handleIncrement = () => dispatch({ type: 'counter/increment' });
  const handleDecrement = () => dispatch({ type: 'counter/decrement' });
  const handleReset = () => dispatch({ type: 'counter/reset' });
  
  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      
      <div className="counter-controls">
        <button onClick={handleIncrement}>
          Increment
        </button>
        <button onClick={handleDecrement}>
          Decrement
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
      </div>
      
      <div className="counter-history">
        <h3>History:</h3>
        <ul>
          {history.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const BasicUserProfile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const handleClearError = () => dispatch({ type: 'user/clearError' });
  
  if (loading) {
    return <div>Loading user...</div>;
  }
  
  if (error) {
    return (
      <div className="error">
        <h3>Error:</h3>
        <p>{error}</p>
        <button onClick={handleClearError}>
          Clear Error
        </button>
      </div>
    );
  }
  
  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {currentUser ? (
        <div>
          <p><strong>Name:</strong> {currentUser.name}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Role:</strong> {currentUser.role}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

// ===== 4. ASYNC ACTIONS =====

const createAsyncStore = () => {
  const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (userId) => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return await response.json();
    }
  );

  const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (params = {}) => {
      const { page = 1, limit = 10 } = params;
      const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return await response.json();
    }
  );

  const createPost = createAsyncThunk(
    'posts/createPost',
    async (postData) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      return await response.json();
    }
  );

  const userSlice = createSlice({
    name: 'user',
    initialState: {
      currentUser: null,
      loading: false,
      error: null
    },
    reducers: {
      clearError: (state) => {
        state.error = null;
        return state;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
          state.loading = false;
          state.currentUser = action.payload;
          state.error = null;
        })
        .addCase(fetchUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    }
  });

  const apiSlice = createSlice({
    name: 'api',
    initialState: {
      posts: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1
      }
    },
    reducers: {
      clearPosts: (state) => {
        state.posts = [];
        state.pagination = { currentPage: 1, totalPages: 1 };
        return state;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchPosts.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
          state.loading = false;
          state.posts = action.payload.posts;
          state.pagination = action.payload.pagination;
          state.error = null;
        })
        .addCase(fetchPosts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(createPost.fulfilled, (state, action) => {
          state.posts.unshift(action.payload);
        });
    }
  });

  return configureStore({
    reducer: {
      user: userSlice.reducer,
      api: apiSlice.reducer
    }
  });
};

const AsyncPosts = () => {
  const { posts, loading, error, pagination } = useSelector((state) => state.api);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch({ type: 'posts/fetchPosts' });
  }, [dispatch]);
  
  const handleLoadMore = () => {
    dispatch({ type: 'posts/fetchPosts', payload: { page: pagination.currentPage + 1 } });
  };
  
  const handleClearPosts = () => {
    dispatch({ type: 'api/clearPosts' });
  };
  
  if (loading) {
    return <div>Loading posts...</div>;
  }
  
  if (error) {
    return (
      <div className="error">
        <h3>Error:</h3>
        <p>{error}</p>
        <button onClick={handleClearPosts}>
          Clear Posts
        </button>
      </div>
    );
  }
  
  return (
    <div className="posts">
      <h2>Posts</h2>
      
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>By {post.author} on {new Date(post.date).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
      
      {pagination.currentPage < pagination.totalPages && (
        <button onClick={handleLoadMore} disabled={loading}>
          Load More
        </button>
      )}
      
      <button onClick={handleClearPosts}>
        Clear All Posts
      </button>
    </div>
  );
};

// ===== 5. MIDDLEWARE =====

const logger = (store) => (next) => (action) => {
  console.log('Dispatching:', action);
  console.log('Current state:', store.getState());
  
  const result = next(action);
  
  console.log('Next state:', store.getState());
  return result;
};

const apiMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith('/pending')) {
    console.log(`API call started: ${action.type}`);
  } else if (action.type.endsWith('/fulfilled')) {
    console.log(`API call succeeded: ${action.type}`);
  } else if (action.type.endsWith('/rejected')) {
    console.error(`API call failed: ${action.type}`);
  }
  
  return next(action);
};

const createMiddlewareStore = () => {
  const counterReducer = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
      increment: (state) => { state.value += 1; },
      decrement: (state) => { state.value -= 1; }
    }
  });

  return configureStore({
    reducer: {
      counter: counterReducer.reducer
    },
    middleware: [logger, apiMiddleware]
  });
};

// ===== 6. NORMALIZATION =====

const createNormalizedStore = () => {
  const postsAdapter = createEntityAdapter({
    selectId: (post) => post.id,
    sortComparer: (a, b) => b.date.localeCompare(a.date)
  });

  const postsSlice = createSlice({
    name: 'posts',
    initialState: postsAdapter.getInitialState({
      loading: false,
      error: null
    }),
    reducers: {
      addPost: postsAdapter.addOne,
      updatePost: postsAdapter.updateOne,
      removePost: postsAdapter.removeOne,
      clearPosts: postsAdapter.removeAll
    }
  });

  return configureStore({
    reducer: {
      posts: postsSlice.reducer
    }
  });
};

// ===== 7. PERSISTENCE =====

const createPersistentStore = () => {
  const counterReducer = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
      increment: (state) => { state.value += 1; },
      decrement: (state) => { state.value -= 1; }
    }
  });

  return configureStore({
    reducer: {
      counter: counterReducer.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
        }
      })
  });
};

// ===== 8. CONNECT HOC =====

const CounterConnect = connect(
  (state) => ({ value: state.counter.value }),
  (dispatch) => ({
    onIncrement: () => dispatch({ type: 'counter/increment' }),
    onDecrement: () => dispatch({ type: 'counter/decrement' })
  })
)(({ value, onIncrement, onDecrement }) => {
  return (
    <div className="counter">
      <h2>Counter (connect): {value}</h2>
      
      <div className="counter-controls">
        <button onClick={onIncrement}>
          Increment
        </button>
        <button onClick={onDecrement}>
          Decrement
        </button>
      </div>
    </div>
  );
});

// ===== 9. ADVANCED PATTERNS =====

// Ducks pattern
const counterDuck = {
  INCREMENT: 'counter/increment',
  DECREMENT: 'counter/decrement',
  RESET: 'counter/reset',
  
  increment: () => ({ type: 'counter/increment' }),
  decrement: () => ({ type: 'counter/decrement' }),
  reset: () => ({ type: 'counter/reset' }),
  
  reducer: (state = { value: 0, history: [] }, action) => {
    switch (action.type) {
      case 'counter/increment':
        return {
          ...state,
          value: state.value + 1,
          history: [...state.history, state.value + 1]
        };
      case 'counter/decrement':
        return {
          ...state,
          value: state.value - 1,
          history: [...state.history, state.value - 1]
        };
      case 'counter/reset':
        return {
          ...state,
          value: 0,
          history: []
        };
      default:
        return state;
    }
  }
};

// ===== 10. TESTING REDUX =====

const createTestStore = (initialState) => {
  const counterReducer = createSlice({
    name: 'counter',
    initialState: initialState || { value: 0 },
    reducers: {
      increment: (state) => { state.value += 1; },
      decrement: (state) => { state.value -= 1; }
    }
  });

  return configureStore({
    reducer: counterReducer.reducer
  });
};

// ===== 11. PERFORMANCE OPTIMIZATION =====

const PostItem = React.memo(({ post }) => {
  return (
    <div className="post-item">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <small>Words: {post.wordCount} | Reading time: {post.readingTime}min</small>
    </div>
  );
});

const OptimizedPostList = () => {
  const posts = useSelector((state) => state.posts);
  
  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

// ===== 12. DEVTOOLS INTEGRATION =====

const createDevToolsStore = () => {
  const counterReducer = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
      increment: (state) => { state.value += 1; },
      decrement: (state) => { state.value -= 1; }
    }
  });

  return configureStore({
    reducer: {
      counter: counterReducer.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST']
        }
      }),
    devTools: process.env.NODE_ENV !== 'production' && {
      name: 'My App',
      trace: true,
      traceLimit: 25
    }
  });
};

// ===== 13. TYPED HOOKS (JavaScript version) =====

const useAppDispatch = () => useDispatch();
const useAppSelector = useSelector;

const TypedCounter = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  
  return (
    <div className="counter">
      <h2>Typed Counter: {count}</h2>
      
      <div className="counter-controls">
        <button onClick={() => dispatch({ type: 'counter/increment' })}>
          Increment
        </button>
        <button onClick={() => dispatch({ type: 'counter/decrement' })}>
          Decrement
        </button>
      </div>
    </div>
  );
};

// ===== 14. REAL-WORLD EXAMPLES =====

const createShoppingCartStore = () => {
  const cartAdapter = createEntityAdapter({
    selectId: (item) => item.id
  });

  const cartSlice = createSlice({
    name: 'cart',
    initialState: cartAdapter.getInitialState({
      total: 0,
      itemCount: 0
    }),
    reducers: {
      addItem: cartAdapter.addOne,
      removeItem: cartAdapter.removeOne,
      updateQuantity: cartAdapter.updateOne,
      clearCart: cartAdapter.removeAll,
      calculateTotal: (state) => {
        const items = Object.values(state.entities);
        state.total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        state.itemCount = items.reduce((count, item) => count + item.quantity, 0);
      }
    }
  });

  return configureStore({
    reducer: {
      cart: cartSlice.reducer
    }
  });
};

const ShoppingCart = () => {
  const items = useSelector((state) => state.cart.entities);
  const total = useSelector((state) => state.cart.total);
  const itemCount = useSelector((state) => state.cart.itemCount);
  const dispatch = useDispatch();
  
  const handleAddToCart = (product) => {
    dispatch({ type: 'cart/addItem', payload: { ...product, quantity: 1 } });
  };
  
  const handleRemoveFromCart = (itemId) => {
    dispatch({ type: 'cart/removeItem', payload: itemId });
  };
  
  const handleUpdateQuantity = (itemId, quantity) => {
    dispatch({ type: 'cart/updateQuantity', payload: { id: itemId, quantity } });
  };
  
  const handleClearCart = () => {
    dispatch({ type: 'cart/clearCart' });
  };
  
  return (
    <div className="shopping-cart">
      <h2>Shopping Cart ({itemCount} items)</h2>
      
      {Object.keys(items).length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <div className="cart-items">
            {Object.values(items).map((item) => (
              <div key={item.id} className="cart-item">
                <h4>{item.name}</h4>
                <p>${item.price}</p>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button onClick={() => handleRemoveFromCart(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Total: ${total.toFixed(2)}</h3>
            <button onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== 15. ADVANCED REDUX PATTERNS =====

const createOptimisticStore = () => {
  const optimisticSlice = createSlice({
    name: 'optimistic',
    initialState: {
      posts: [],
      loading: false
    },
    reducers: {
      updatePostOptimistically: (state, action) => {
        const { postId, updates } = action.payload;
        
        const existingPostIndex = state.posts.findIndex(post => post.id === postId);
        
        if (existingPostIndex !== -1) {
          state.posts[existingPostIndex] = {
            ...state.posts[existingPostIndex],
            ...updates,
            isOptimistic: true
          };
        }
      },
      confirmUpdate: (state, action) => {
        const { postId, confirmedData } = action.payload;
        
        state.posts = state.posts.map(post => 
          post.id === postId && post.isOptimistic
            ? { ...post, ...confirmedData, isOptimistic: false }
            : post
        );
      },
      rejectUpdate: (state, action) => {
        const { postId } = action.payload;
        
        state.posts = state.posts.map(post => 
          post.id === postId && post.isOptimistic
            ? { ...post, isOptimistic: false }
            : post
        );
      }
    }
  });

  return configureStore({
    reducer: {
      optimistic: optimisticSlice.reducer
    }
  });
};

const OptimisticPost = ({ postId, initialContent }) => {
  const post = useSelector((state) => 
    state.optimistic.posts.find(post => post.id === postId)
  );
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(initialContent);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(post.content);
  };
  
  const handleSave = () => {
    dispatch({
      type: 'optimistic/updatePostOptimistically',
      payload: {
        postId,
        updates: { content: editContent }
      }
    });
    
    setTimeout(() => {
      dispatch({
        type: 'optimistic/confirmUpdate',
        payload: {
          postId,
          confirmedData: { content: editContent }
        }
      });
      setIsEditing(false);
    }, 1000);
  };
  
  const handleCancel = () => {
    if (post.isOptimistic) {
      dispatch({
        type: 'optimistic/rejectUpdate',
        payload: { postId }
      });
    }
    setIsEditing(false);
    setEditContent(post.content);
  };
  
  return (
    <div className="optimistic-post">
      <h3>Post Title</h3>
      
      {isEditing ? (
        <div className="edit-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={10}
          />
          <div className="edit-controls">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="post-content">
          <p>{post.content}</p>
          {post.isOptimistic && (
            <div className="optimistic-indicator">
              Updating...
            </div>
          )}
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
    </div>
  );
};

// ===== KEY CONCEPTS =====

/*
1. Unidirectional Data Flow: State flows in one direction from actions to reducers
2. Single Source of Truth: One global store contains all application state
3. Pure Reducers: Reducers are pure functions that return new state based on action
4. Actions: Plain objects describing what happened, dispatched to update state
5. Middleware: Extends store functionality, handles async operations, logging, etc.
6. Selectors: Functions that extract specific data from the global state
7. Immutability: State is never mutated directly, always returned as new objects
8. Time Travel: Redux DevTools enable debugging and state history navigation
9. Normalization: Structuring data with entities and IDs for efficient updates
10. Persistence: Saving and restoring state using redux-persist
*/

// ===== BEST PRACTICES =====

/*
1. Use Redux Toolkit for simplified Redux setup
2. Structure state by feature/domain, not by component
3. Use createAsyncThunk for async operations
4. Normalize complex state with entity adapters
5. Use createSelector for memoized selectors
6. Keep reducers pure and side-effect free
7. Use TypeScript for type safety
8. Test actions and reducers separately
9. Use middleware for cross-cutting concerns
10. Optimize performance with memoization
*/

// ===== MIGRATION GUIDE =====

/*
// From Redux to Redux Toolkit:

// Old way:
const increment = () => ({ type: 'INCREMENT' });
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    default:
      return state;
  }
};

// New way:
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1
  }
});

// Key benefits:
// - Less boilerplate code
// - Built-in Immer for immutable updates
// - Included TypeScript support
// - Simplified async handling with createAsyncThunk
// - Better DevTools integration
*/

// Export all components and utilities
export {
  // Basic components
  BasicApp,
  BasicCounter,
  BasicUserProfile,
  AsyncPosts,
  CounterConnect,
  PostItem,
  OptimizedPostList,
  ShoppingCart,
  OptimisticPost,
  
  // Advanced components
  TypedCounter,
  
  // Store creators
  createBasicStore,
  createAsyncStore,
  createMiddlewareStore,
  createNormalizedStore,
  createPersistentStore,
  createTestStore,
  createDevToolsStore,
  createShoppingCartStore,
  createOptimisticStore,
  
  // Hooks
  useAppDispatch,
  useAppSelector,
  
  // Middleware
  logger,
  apiMiddleware,
  
  // Ducks pattern
  counterDuck
};