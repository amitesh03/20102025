import React, { useState, useEffect } from 'react';
import { 
  makeAutoObservable, 
  observable, 
  computed, 
  action, 
  autorun, 
  reaction, 
  when, 
  flow, 
  observe,
  makeObservable,
  runInAction,
  configure
} from 'mobx';
import { observer } from 'mobx-react-lite';

// Configure MobX for strict mode
configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: false
});

// Example 1: Basic makeAutoObservable with Timer
class Timer {
  secondsPassed = 0;
  intervalId = null;

  constructor() {
    makeAutoObservable(this, {
      intervalId: false // Exclude from being observable
    });
  }

  increase() {
    this.secondsPassed += 1;
  }

  reset() {
    this.secondsPassed = 0;
  }

  get minutesPassed() {
    return Math.floor(this.secondsPassed / 60);
  }

  get formattedTime() {
    const minutes = Math.floor(this.secondsPassed / 60);
    const seconds = this.secondsPassed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  start() {
    this.intervalId = setInterval(() => this.increase(), 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Example 2: Todo Store with explicit annotations
class TodoStore {
  todos = [];
  filter = "all";
  isLoading = false;

  constructor() {
    makeObservable(this, {
      todos: observable,
      filter: observable,
      isLoading: observable,
      completedCount: computed,
      activeCount: computed,
      filteredTodos: computed,
      addTodo: action,
      toggleTodo: action,
      removeTodo: action,
      setFilter: action,
      clearCompleted: action,
      loadTodos: flow
    });
  }

  get completedCount() {
    return this.todos.filter(todo => todo.completed).length;
  }

  get activeCount() {
    return this.todos.filter(todo => !todo.completed).length;
  }

  get filteredTodos() {
    switch(this.filter) {
      case "completed":
        return this.todos.filter(t => t.completed);
      case "active":
        return this.todos.filter(t => !t.completed);
      default:
        return this.todos;
    }
  }

  addTodo(title) {
    this.todos.push({
      id: Date.now(),
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    });
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  removeTodo(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
    }
  }

  setFilter(filter) {
    this.filter = filter;
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
  }

  *loadTodos() {
    this.isLoading = true;
    try {
      // Simulate API call
      yield new Promise(resolve => setTimeout(resolve, 1000));
      const mockTodos = [
        { id: 1, title: 'Learn MobX', completed: true },
        { id: 2, title: 'Build React app', completed: false },
        { id: 3, title: 'Master state management', completed: false }
      ];
      
      runInAction(() => {
        this.todos = mockTodos;
      });
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      this.isLoading = false;
    }
  }
}

// Example 3: Shopping Cart with computed values
class ShoppingCart {
  items = observable([]);
  discount = observable.box(0);
  taxRate = 0.08;

  constructor() {
    makeAutoObservable(this);
  }

  get subtotal() {
    return this.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  }

  get discountAmount() {
    return this.subtotal * (this.discount.get() / 100);
  }

  get total() {
    return this.subtotal - this.discountAmount;
  }

  get totalWithTax() {
    return this.total * (1 + this.taxRate);
  }

  get itemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  addItem = action((product, quantity = 1) => {
    const existingItem = this.items.find(i => i.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  });

  removeItem = action((productId) => {
    const index = this.items.findIndex(i => i.product.id === productId);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  });

  updateQuantity = action((productId, quantity) => {
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      item.quantity = Math.max(0, quantity);
    }
  });

  setDiscount = action((percentage) => {
    this.discount.set(Math.max(0, Math.min(100, percentage)));
  });

  clear = action(() => {
    this.items.clear();
    this.discount.set(0);
  });
}

// Example 4: User Store with async operations
class UserStore {
  users = [];
  currentUser = null;
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this, {
      users: observable,
      currentUser: observable,
      isLoading: observable,
      error: observable,
      activeUsers: computed,
      userCount: computed,
      fetchUsers: flow,
      createUser: flow,
      updateUser: flow,
      deleteUser: flow,
      setCurrentUser: action,
      clearError: action
    });
  }

  get activeUsers() {
    return this.users.filter(user => user.isActive);
  }

  get userCount() {
    return this.users.length;
  }

  setCurrentUser = action((user) => {
    this.currentUser = user;
  });

  clearError = action(() => {
    this.error = null;
  });

  *fetchUsers() {
    this.isLoading = true;
    this.error = null;

    try {
      // Simulate API call
      yield new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', isActive: true },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', isActive: false },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', isActive: true }
      ];

      runInAction(() => {
        this.users = mockUsers;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  *createUser(userData) {
    this.isLoading = true;
    this.error = null;

    try {
      yield new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser = {
        id: Date.now(),
        ...userData,
        isActive: true
      };

      runInAction(() => {
        this.users.push(newUser);
      });

      return newUser;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  *updateUser(userId, updates) {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const originalData = { ...user };
    
    try {
      yield new Promise(resolve => setTimeout(resolve, 300));
      
      runInAction(() => {
        Object.assign(user, updates);
      });

      return user;
    } catch (error) {
      runInAction(() => {
        Object.assign(user, originalData);
        this.error = error.message;
      });
      throw error;
    }
  }

  *deleteUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    try {
      yield new Promise(resolve => setTimeout(resolve, 200));
      
      runInAction(() => {
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
          this.users.splice(index, 1);
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
      throw error;
    }
  }
}

// Example 5: Game State Store with reactions
class GameStateStore {
  score = 0;
  level = 1;
  lives = 3;
  isGameOver = false;
  isPaused = false;
  highScore = 0;
  achievements = observable.set([]);

  constructor() {
    makeAutoObservable(this, {
      score: observable,
      level: observable,
      lives: observable,
      isGameOver: observable,
      isPaused: observable,
      highScore: observable,
      achievements: observable,
      isAlive: computed,
      levelProgress: computed,
      addScore: action,
      loseLife: action,
      resetGame: action,
      togglePause: action,
      addAchievement: action
    });

    // Setup reactions
    this.setupReactions();
  }

  get isAlive() {
    return this.lives > 0 && !this.isGameOver;
  }

  get levelProgress() {
    return (this.score % 1000) / 1000;
  }

  setupReactions() {
    // Level up reaction
    this.levelUpDisposer = reaction(
      () => Math.floor(this.score / 1000),
      (newLevel, oldLevel) => {
        if (newLevel > oldLevel) {
          this.level = newLevel + 1;
          console.log(`Level up! Now at level ${this.level}`);
        }
      }
    );

    // Game over reaction
    this.gameOverDisposer = reaction(
      () => this.lives,
      (lives) => {
        if (lives <= 0) {
          this.isGameOver = true;
          if (this.score > this.highScore) {
            this.highScore = this.score;
            this.addAchievement('new_high_score');
          }
        }
      }
    );

    // Achievement reactions
    this.achievementDisposers = [
      reaction(
        () => this.score,
        (score) => {
          if (score >= 100 && !this.achievements.has('centurion')) {
            this.addAchievement('centurion');
          }
          if (score >= 1000 && !this.achievements.has('scorer')) {
            this.addAchievement('scorer');
          }
        }
      ),
      reaction(
        () => this.level,
        (level) => {
          if (level >= 5 && !this.achievements.has('level_master')) {
            this.addAchievement('level_master');
          }
        }
      )
    ];
  }

  addScore = action((points) => {
    if (this.isAlive && !this.isPaused) {
      this.score += points;
    }
  });

  loseLife = action(() => {
    if (this.isAlive && !this.isPaused) {
      this.lives -= 1;
    }
  });

  resetGame = action(() => {
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.isGameOver = false;
    this.isPaused = false;
  });

  togglePause = action(() => {
    if (this.isAlive) {
      this.isPaused = !this.isPaused;
    }
  });

  addAchievement = action((achievementId) => {
    this.achievements.add(achievementId);
  });

  dispose() {
    this.levelUpDisposer();
    this.gameOverDisposer();
    this.achievementDisposers.forEach(disposer => disposer());
  }
}

// Example 6: Observable Data Structures
class DataStructuresStore {
  constructor() {
    makeAutoObservable(this);
    
    // Observable array
    this.tags = observable(['javascript', 'react', 'mobx']);
    
    // Observable map
    this.cache = observable.map();
    
    // Observable set
    this.activeUsers = observable.set();
    
    // Observable box (primitive)
    this.temperature = observable.box(20);
    
    // Setup observers
    this.setupObservers();
  }

  setupObservers() {
    // Observe array changes
    this.arrayObserver = observe(this.tags, (change) => {
      console.log('Tags changed:', change);
    });

    // Observe map changes
    this.mapObserver = observe(this.cache, (change) => {
      console.log('Cache changed:', change);
    });

    // Observe set changes
    this.setObserver = observe(this.activeUsers, (change) => {
      console.log('Active users changed:', change);
    });

    // Observe primitive changes
    this.primitiveObserver = observe(this.temperature, (change) => {
      console.log('Temperature changed:', change);
    });
  }

  addTag = action((tag) => {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  });

  removeTag = action((tag) => {
    const index = this.tags.indexOf(tag);
    if (index !== -1) {
      this.tags.splice(index, 1);
    }
  });

  setCache = action((key, value) => {
    this.cache.set(key, value);
  });

  deleteCache = action((key) => {
    this.cache.delete(key);
  });

  addUser = action((userId) => {
    this.activeUsers.add(userId);
  });

  removeUser = action((userId) => {
    this.activeUsers.delete(userId);
  });

  setTemperature = action((temp) => {
    this.temperature.set(temp);
  });

  dispose() {
    this.arrayObserver();
    this.mapObserver();
    this.setObserver();
    this.primitiveObserver();
  }
}

// React Components
const TimerComponent = observer(({ timer }) => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Timer Example</h3>
      <div style={{ fontSize: '24px', fontFamily: 'monospace' }}>
        {timer.formattedTime}
      </div>
      <div>Minutes: {timer.minutesPassed}</div>
      <div>Seconds: {timer.secondsPassed}</div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => timer.start()}>Start</button>
        <button onClick={() => timer.stop()}>Stop</button>
        <button onClick={() => timer.reset()}>Reset</button>
      </div>
    </div>
  );
});

const TodoComponent = observer(({ store }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      store.addTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Todo List Example</h3>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add new todo..."
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit">Add</button>
      </form>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => store.setFilter('all')} 
                style={{ marginRight: '5px', fontWeight: store.filter === 'all' ? 'bold' : 'normal' }}>
          All ({store.todos.length})
        </button>
        <button onClick={() => store.setFilter('active')} 
                style={{ marginRight: '5px', fontWeight: store.filter === 'active' ? 'bold' : 'normal' }}>
          Active ({store.activeCount})
        </button>
        <button onClick={() => store.setFilter('completed')} 
                style={{ marginRight: '5px', fontWeight: store.filter === 'completed' ? 'bold' : 'normal' }}>
          Completed ({store.completedCount})
        </button>
        <button onClick={() => store.clearCompleted()} disabled={store.completedCount === 0}>
          Clear Completed
        </button>
      </div>

      {store.isLoading ? (
        <div>Loading todos...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {store.filteredTodos.map(todo => (
            <li key={todo.id} style={{ 
              padding: '10px', 
              margin: '5px 0', 
              backgroundColor: todo.completed ? '#f0f0f0' : 'white',
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => store.toggleTodo(todo.id)}
                style={{ marginRight: '10px' }}
              />
              {todo.title}
              <button 
                onClick={() => store.removeTodo(todo.id)}
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => store.loadTodos()} style={{ marginTop: '10px' }}>
        Load Sample Todos
      </button>
    </div>
  );
});

const ShoppingCartComponent = observer(({ cart }) => {
  const products = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Mouse', price: 29.99 },
    { id: 3, name: 'Keyboard', price: 79.99 },
    { id: 4, name: 'Monitor', price: 299.99 }
  ];

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Shopping Cart Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Products</h4>
        {products.map(product => (
          <div key={product.id} style={{ marginBottom: '10px' }}>
            <span>{product.name} - ${product.price.toFixed(2)}</span>
            <button 
              onClick={() => cart.addItem(product)}
              style={{ marginLeft: '10px' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Cart ({cart.itemCount} items)</h4>
        {cart.items.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <div>
            {cart.items.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <span>{item.product.name} - ${item.product.price.toFixed(2)} x </span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => cart.updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                  min="0"
                  style={{ width: '60px', margin: '0 10px' }}
                />
                <span> = ${(item.product.price * item.quantity).toFixed(2)}</span>
                <button 
                  onClick={() => cart.removeItem(item.product.id)}
                  style={{ marginLeft: '10px', color: 'red' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Pricing</h4>
        <div>Subtotal: ${cart.subtotal.toFixed(2)}</div>
        <div>
          Discount: 
          <input
            type="number"
            value={cart.discount.get()}
            onChange={(e) => cart.setDiscount(parseInt(e.target.value) || 0)}
            min="0"
            max="100"
            style={{ width: '60px', margin: '0 10px' }}
          />
          %
        </div>
        <div>Discount Amount: ${cart.discountAmount.toFixed(2)}</div>
        <div>Total: ${cart.total.toFixed(2)}</div>
        <div>Total with Tax (8%): ${cart.totalWithTax.toFixed(2)}</div>
      </div>

      <button onClick={() => cart.clear()}>Clear Cart</button>
    </div>
  );
});

const UserManagementComponent = observer(({ store }) => {
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);

  const handleCreateUser = async () => {
    try {
      await store.createUser(newUser);
      setNewUser({ name: '', email: '' });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await store.updateUser(userId, updates);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await store.deleteUser(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>User Management Example</h3>
      
      {store.error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {store.error}
          <button onClick={() => store.clearError()} style={{ marginLeft: '10px' }}>
            Clear
          </button>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h4>Create New User</h4>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleCreateUser} disabled={!newUser.name || !newUser.email || store.isLoading}>
          Create User
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => store.fetchUsers()} disabled={store.isLoading}>
          {store.isLoading ? 'Loading...' : 'Load Users'}
        </button>
        <span style={{ marginLeft: '10px' }}>
          Total Users: {store.userCount} | Active: {store.activeUsers.length}
        </span>
      </div>

      <div>
        <h4>Users</h4>
        {store.users.length === 0 ? (
          <p>No users loaded</p>
        ) : (
          <div>
            {store.users.map(user => (
              <div key={user.id} style={{ 
                padding: '10px', 
                margin: '5px 0', 
                backgroundColor: user.isActive ? '#e8f5e8' : '#ffe8e8',
                border: '1px solid #ddd'
              }}>
                {editingUser?.id === user.id ? (
                  <div>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      style={{ marginRight: '10px' }}
                    />
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      style={{ marginRight: '10px' }}
                    />
                    <button onClick={() => handleUpdateUser(user.id, editingUser)}>Save</button>
                    <button onClick={() => setEditingUser(null)} style={{ marginLeft: '5px' }}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <strong>{user.name}</strong> ({user.email})
                    <span style={{ marginLeft: '10px', color: user.isActive ? 'green' : 'red' }}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button 
                      onClick={() => setEditingUser(user)}
                      style={{ marginLeft: '10px' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ marginLeft: '5px', color: 'red' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

const GameComponent = observer(({ game }) => {
  useEffect(() => {
    return () => game.dispose();
  }, [game]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Game State Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div>Score: {game.score}</div>
        <div>Level: {game.level}</div>
        <div>Lives: {game.lives}</div>
        <div>High Score: {game.highScore}</div>
        <div>Status: {game.isGameOver ? 'Game Over' : game.isPaused ? 'Paused' : 'Playing'}</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ width: '200px', height: '20px', backgroundColor: '#ddd', marginBottom: '10px' }}>
          <div 
            style={{ 
              width: `${game.levelProgress * 100}%`, 
              height: '100%', 
              backgroundColor: '#4CAF50' 
            }}
          />
        </div>
        <div>Level Progress: {Math.round(game.levelProgress * 100)}%</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Achievements</h4>
        {game.achievements.size === 0 ? (
          <p>No achievements yet</p>
        ) : (
          <div>
            {Array.from(game.achievements).map(achievement => (
              <span key={achievement} style={{ 
                display: 'inline-block', 
                padding: '5px 10px', 
                margin: '2px', 
                backgroundColor: '#FFD700', 
                borderRadius: '15px',
                fontSize: '12px'
              }}>
                {achievement.replace('_', ' ').toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <button onClick={() => game.addScore(10)} disabled={!game.isAlive || game.isPaused}>
          Add Score (+10)
        </button>
        <button onClick={() => game.addScore(100)} disabled={!game.isAlive || game.isPaused}>
          Add Score (+100)
        </button>
        <button onClick={() => game.loseLife()} disabled={!game.isAlive || game.isPaused}>
          Lose Life
        </button>
        <button onClick={() => game.togglePause()} disabled={!game.isAlive || game.isGameOver}>
          {game.isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={() => game.resetGame()}>
          Reset Game
        </button>
      </div>
    </div>
  );
});

const DataStructuresComponent = observer(({ store }) => {
  useEffect(() => {
    return () => store.dispose();
  }, [store]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Observable Data Structures Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Observable Array (Tags)</h4>
        <div>
          {store.tags.map((tag, index) => (
            <span key={index} style={{ 
              display: 'inline-block', 
              padding: '5px 10px', 
              margin: '2px', 
              backgroundColor: '#e1f5fe',
              borderRadius: '15px'
            }}>
              {tag}
              <button 
                onClick={() => store.removeTag(tag)}
                style={{ marginLeft: '5px', border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Add tag"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                store.addTag(e.target.value.trim());
                e.target.value = '';
              }
            }}
            style={{ marginRight: '10px', padding: '5px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Observable Map (Cache)</h4>
        <div>
          {Array.from(store.cache.entries()).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '5px' }}>
              <strong>{key}:</strong> {JSON.stringify(value)}
              <button 
                onClick={() => store.deleteCache(key)}
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Key"
            id="cacheKey"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            type="text"
            placeholder="Value"
            id="cacheValue"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button onClick={() => {
            const key = document.getElementById('cacheKey').value;
            const value = document.getElementById('cacheValue').value;
            if (key && value) {
              store.setCache(key, value);
              document.getElementById('cacheKey').value = '';
              document.getElementById('cacheValue').value = '';
            }
          }}>
            Set Cache
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Observable Set (Active Users)</h4>
        <div>
          {Array.from(store.activeUsers).map(userId => (
            <span key={userId} style={{ 
              display: 'inline-block', 
              padding: '5px 10px', 
              margin: '2px', 
              backgroundColor: '#e8f5e8',
              borderRadius: '15px'
            }}>
              User {userId}
              <button 
                onClick={() => store.removeUser(userId)}
                style={{ marginLeft: '5px', border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div style={{ marginTop: '10px' }}>
          <input
            type="number"
            placeholder="User ID"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                store.addUser(parseInt(e.target.value));
                e.target.value = '';
              }
            }}
            style={{ marginRight: '10px', padding: '5px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Observable Box (Temperature)</h4>
        <div>Current Temperature: {store.temperature.get()}°C</div>
        <div style={{ marginTop: '10px' }}>
          <input
            type="range"
            min="-10"
            max="40"
            value={store.temperature.get()}
            onChange={(e) => store.setTemperature(parseInt(e.target.value))}
            style={{ width: '200px' }}
          />
          <input
            type="number"
            min="-10"
            max="40"
            value={store.temperature.get()}
            onChange={(e) => store.setTemperature(parseInt(e.target.value) || 0)}
            style={{ marginLeft: '10px', width: '60px' }}
          />
        </div>
      </div>
    </div>
  );
});

// Main App Component
const MobXExamples = () => {
  const [timer] = useState(() => new Timer());
  const [todoStore] = useState(() => new TodoStore());
  const [cart] = useState(() => new ShoppingCart());
  const [userStore] = useState(() => new UserStore());
  const [game] = useState(() => new GameStateStore());
  const [dataStore] = useState(() => new DataStructuresStore());

  useEffect(() => {
    // Setup autorun examples
    const autorunDisposer = autorun(() => {
      console.log(`Timer: ${timer.formattedTime}`);
    });

    const reactionDisposer = reaction(
      () => todoStore.completedCount,
      (count) => {
        console.log(`Completed todos: ${count}`);
      }
    );

    const whenPromise = when(
      () => game.score >= 500,
      () => {
        console.log('Milestone reached: 500 points!');
      }
    );

    return () => {
      autorunDisposer();
      reactionDisposer();
      whenPromise.cancel();
    };
  }, [timer, todoStore, game]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MobX Examples</h1>
      <p>Comprehensive examples demonstrating MobX state management patterns</p>
      
      <TimerComponent timer={timer} />
      <TodoComponent store={todoStore} />
      <ShoppingCartComponent cart={cart} />
      <UserManagementComponent store={userStore} />
      <GameComponent game={game} />
      <DataStructuresComponent store={dataStore} />
    </div>
  );
};

export default MobXExamples;