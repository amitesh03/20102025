import React, { useState, useEffect } from 'react';
import { 
  types, 
  getSnapshot, 
  applySnapshot, 
  onSnapshot, 
  onPatch, 
  onAction,
  getParent,
  getRoot,
  cast,
  destroy,
  isAlive,
  getType,
  getIdentifier,
  resolvePath,
  tryResolve,
  flow,
  addDisposer,
  protect,
  unprotect,
  applyPatch,
  getMembers
} from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';

// Example 1: Basic Todo Model with MST
const Todo = types
  .model('Todo', {
    id: types.identifier,
    name: types.optional(types.string, ''),
    done: types.optional(types.boolean, false),
    createdAt: types.optional(types.Date, () => new Date()),
    priority: types.optional(types.enumeration('Priority', ['low', 'medium', 'high']), 'medium')
  })
  .views((self) => ({
    get displayName() {
      return self.name || 'Untitled Todo';
    },
    get isOverdue() {
      const daysSinceCreated = (Date.now() - self.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreated > 7 && !self.done;
    }
  }))
  .actions((self) => ({
    setName(newName) {
      self.name = newName;
    },
    toggle() {
      self.done = !self.done;
    },
    setPriority(priority) {
      self.priority = priority;
    },
    delete() {
      getRoot(self).removeTodo(self.id);
    }
  }));

// Example 2: User Model with identifier
const User = types
  .model('User', {
    id: types.identifier,
    name: types.optional(types.string, ''),
    email: types.optional(types.string, ''),
    avatar: types.optional(types.string, ''),
    isActive: types.optional(types.boolean, true)
  })
  .views((self) => ({
    get displayName() {
      return self.name || self.email;
    },
    get gravatarUrl() {
      // Simple gravatar simulation
      return `https://www.gravatar.com/avatar/${self.email}`;
    }
  }))
  .actions((self) => ({
    setName(name) {
      self.name = name;
    },
    setEmail(email) {
      self.email = email;
    },
    toggleActive() {
      self.isActive = !self.isActive;
    }
  }));

// Example 3: Todo with User Reference
const TodoWithUser = types
  .model('TodoWithUser', {
    id: types.identifier,
    name: types.optional(types.string, ''),
    done: types.optional(types.boolean, false),
    user: types.maybe(types.reference(types.late(() => User))),
    tags: types.optional(types.array(types.string), []),
    dueDate: types.maybe(types.Date)
  })
  .views((self) => ({
    get isOverdue() {
      if (!self.dueDate || self.done) return false;
      return self.dueDate < new Date();
    },
    get daysUntilDue() {
      if (!self.dueDate) return null;
      const diff = self.dueDate.getTime() - Date.now();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
  }))
  .actions((self) => ({
    setName(name) {
      self.name = name;
    },
    toggle() {
      self.done = !self.done;
    },
    setUser(userId) {
      self.user = userId || undefined;
    },
    addTag(tag) {
      if (!self.tags.includes(tag)) {
        self.tags.push(tag);
      }
    },
    removeTag(tag) {
      const index = self.tags.indexOf(tag);
      if (index !== -1) {
        self.tags.splice(index, 1);
      }
    },
    setDueDate(date) {
      self.dueDate = date ? new Date(date) : undefined;
    }
  }));

// Example 4: Root Store with computed properties
const RootStore = types
  .model('RootStore', {
    users: types.map(User),
    todos: types.map(TodoWithUser),
    todosWithUser: types.map(TodoWithUser),
    filter: types.optional(types.enumeration('Filter', ['all', 'active', 'completed']), 'all'),
    selectedUser: types.maybe(types.reference(types.late(() => User))),
    isLoading: types.optional(types.boolean, false),
    searchQuery: types.optional(types.string, '')
  })
  .views((self) => ({
    get todoCount() {
      return self.todos.size;
    },
    get completedCount() {
      return Array.from(self.todos.values()).filter(todo => todo.done).length;
    },
    get activeCount() {
      return Array.from(self.todos.values()).filter(todo => !todo.done).length;
    },
    get filteredTodos() {
      let todos = Array.from(self.todos.values());
      
      // Apply filter
      if (self.filter === 'completed') {
        todos = todos.filter(todo => todo.done);
      } else if (self.filter === 'active') {
        todos = todos.filter(todo => !todo.done);
      }
      
      // Apply search
      if (self.searchQuery) {
        todos = todos.filter(todo => 
          todo.name.toLowerCase().includes(self.searchQuery.toLowerCase())
        );
      }
      
      // Apply user filter
      if (self.selectedUser) {
        todos = todos.filter(todo => todo.user?.id === self.selectedUser.id);
      }
      
      return todos;
    },
    get overdueTodos() {
      return Array.from(self.todos.values()).filter(todo => todo.isOverdue);
    },
    get activeUsers() {
      return Array.from(self.users.values()).filter(user => user.isActive);
    },
    get userStats() {
      const stats = {};
      self.users.forEach(user => {
        stats[user.id] = {
          name: user.name,
          todoCount: Array.from(self.todos.values()).filter(todo => todo.user?.id === user.id).length,
          completedCount: Array.from(self.todos.values()).filter(todo => todo.user?.id === user.id && todo.done).length
        };
      });
      return stats;
    }
  }))
  .actions((self) => ({
    addTodo(id, name) {
      self.todos.set(id, TodoWithUser.create({ id, name }));
    },
    removeTodo(id) {
      self.todos.delete(id);
    },
    addUser(id, name, email) {
      self.users.set(id, User.create({ id, name, email }));
    },
    removeUser(id) {
      self.users.delete(id);
    },
    setFilter(filter) {
      self.filter = filter;
    },
    setSelectedUser(userId) {
      self.selectedUser = userId;
    },
    setSearchQuery(query) {
      self.searchQuery = query;
    },
    setLoading(loading) {
      self.isLoading = loading;
    },
    // Async action using flow
    loadInitialData: flow(function* () {
      self.setLoading(true);
      try {
        // Simulate API call
        yield new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add sample users
        self.addUser('1', 'John Doe', 'john@example.com');
        self.addUser('2', 'Jane Smith', 'jane@example.com');
        self.addUser('3', 'Bob Johnson', 'bob@example.com');
        
        // Add sample todos
        self.addTodo('1', 'Learn MobX State Tree');
        self.addTodo('2', 'Build React application');
        self.addTodo('3', 'Master state management');
        
        // Assign users to todos
        const todo1 = self.todos.get('1');
        const todo2 = self.todos.get('2');
        const todo3 = self.todos.get('3');
        
        if (todo1) todo1.setUser('1');
        if (todo2) todo1.setUser('2');
        if (todo3) todo1.setUser('3');
        
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        self.setLoading(false);
      }
    }),
    // Batch operations
    markAllCompleted() {
      self.todos.forEach(todo => {
        if (isAlive(todo)) {
          todo.toggle();
        }
      });
    },
    clearCompleted() {
      const completedIds = Array.from(self.todos.values())
        .filter(todo => todo.done)
        .map(todo => todo.id);
      
      completedIds.forEach(id => self.removeTodo(id));
    }
  }));

// Example 5: Shopping Cart with MST
const Product = types
  .model('Product', {
    id: types.identifier,
    name: types.string,
    price: types.number,
    category: types.string,
    inStock: types.optional(types.boolean, true)
  });

const CartItem = types
  .model('CartItem', {
    product: types.reference(Product),
    quantity: types.number
  })
  .views((self) => ({
    get totalPrice() {
      return self.product.price * self.quantity;
    }
  }))
  .actions((self) => ({
    setQuantity(quantity) {
      self.quantity = Math.max(0, quantity);
    },
    increment() {
      self.quantity += 1;
    },
    decrement() {
      self.quantity = Math.max(0, self.quantity - 1);
    }
  }));

const ShoppingCart = types
  .model('ShoppingCart', {
    items: types.array(CartItem),
    discount: types.optional(types.number, 0)
  })
  .views((self) => ({
    get subtotal() {
      return self.items.reduce((sum, item) => sum + item.totalPrice, 0);
    },
    get total() {
      return self.subtotal * (1 - self.discount / 100);
    },
    get itemCount() {
      return self.items.reduce((count, item) => count + item.quantity, 0);
    },
    get isEmpty() {
      return self.items.length === 0;
    }
  }))
  .actions((self) => ({
    addItem(product, quantity = 1) {
      const existingItem = self.items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        self.items.push({ product, quantity });
      }
    },
    removeItem(productId) {
      const index = self.items.findIndex(item => item.product.id === productId);
      if (index !== -1) {
        self.items.splice(index, 1);
      }
    },
    setDiscount(discount) {
      self.discount = Math.max(0, Math.min(100, discount));
    },
    clear() {
      self.items.clear();
      self.discount = 0;
    }
  }));

// Example 6: Game State with MST
const Achievement = types
  .model('Achievement', {
    id: types.identifier,
    name: types.string,
    description: types.string,
    unlockedAt: types.maybe(types.Date)
  })
  .views((self) => ({
    get isUnlocked() {
      return self.unlockedAt !== null;
    }
  }))
  .actions((self) => ({
    unlock() {
      if (!self.isUnlocked) {
        self.unlockedAt = new Date();
      }
    }
  }));

const GameState = types
  .model('GameState', {
    score: types.optional(types.number, 0),
    level: types.optional(types.number, 1),
    lives: types.optional(types.number, 3),
    isGameOver: types.optional(types.boolean, false),
    isPaused: types.optional(types.boolean, false),
    highScore: types.optional(types.number, 0),
    achievements: types.map(Achievement),
    gameStartTime: types.optional(types.Date, () => new Date())
  })
  .views((self) => ({
    get isAlive() {
      return self.lives > 0 && !self.isGameOver;
    },
    get levelProgress() {
      return (self.score % 1000) / 1000;
    },
    get playTime() {
      return Date.now() - self.gameStartTime.getTime();
    },
    get unlockedAchievements() {
      return Array.from(self.achievements.values()).filter(achievement => achievement.isUnlocked);
    }
  }))
  .actions((self) => ({
    addScore(points) {
      if (self.isAlive && !self.isPaused) {
        self.score += points;
        self.checkLevelUp();
        self.checkAchievements();
      }
    },
    loseLife() {
      if (self.isAlive && !self.isPaused) {
        self.lives -= 1;
        if (self.lives <= 0) {
          self.gameOver();
        }
      }
    },
    levelUp() {
      self.level += 1;
    },
    togglePause() {
      if (self.isAlive) {
        self.isPaused = !self.isPaused;
      }
    },
    gameOver() {
      self.isGameOver = true;
      if (self.score > self.highScore) {
        self.highScore = self.score;
      }
    },
    reset() {
      self.score = 0;
      self.level = 1;
      self.lives = 3;
      self.isGameOver = false;
      self.isPaused = false;
      self.gameStartTime = new Date();
    },
    checkLevelUp() {
      const newLevel = Math.floor(self.score / 1000) + 1;
      if (newLevel > self.level) {
        self.levelUp();
      }
    },
    checkAchievements() {
      // Check for score achievements
      if (self.score >= 100) {
        const achievement = self.achievements.get('centurion');
        if (achievement) achievement.unlock();
      }
      if (self.score >= 1000) {
        const achievement = self.achievements.get('scorer');
        if (achievement) achievement.unlock();
      }
      
      // Check for level achievements
      if (self.level >= 5) {
        const achievement = self.achievements.get('level_master');
        if (achievement) achievement.unlock();
      }
    },
    initializeAchievements() {
      self.achievements.put(Achievement.create({
        id: 'centurion',
        name: 'Centurion',
        description: 'Score 100 points'
      }));
      self.achievements.put(Achievement.create({
        id: 'scorer',
        name: 'High Scorer',
        description: 'Score 1000 points'
      }));
      self.achievements.put(Achievement.create({
        id: 'level_master',
        name: 'Level Master',
        description: 'Reach level 5'
      }));
    }
  }));

// Example 7: Time Travel with MST
const TimeTravelStore = types
  .model('TimeTravelStore', {
    currentState: types.frozen(),
    history: types.array(types.frozen()),
    currentIndex: types.optional(types.number, -1)
  })
  .views((self) => ({
    get canUndo() {
      return self.currentIndex > 0;
    },
    get canRedo() {
      return self.currentIndex < self.history.length - 1;
    }
  }))
  .actions((self) => {
    let targetStore = null;
    
    return {
      setTargetStore(store) {
        targetStore = store;
        // Initialize with current state
        self.currentState = getSnapshot(store);
        self.history.push(self.currentState);
        self.currentIndex = 0;
        
        // Listen for changes
        onSnapshot(store, (snapshot) => {
          self.recordState(snapshot);
        });
      },
      recordState(snapshot) {
        // Remove any states after current index
        self.history = self.history.slice(0, self.currentIndex + 1);
        // Add new state
        self.history.push(snapshot);
        self.currentState = snapshot;
        self.currentIndex = self.history.length - 1;
      },
      undo() {
        if (self.canUndo && targetStore) {
          self.currentIndex -= 1;
          const previousState = self.history[self.currentIndex];
          applySnapshot(targetStore, previousState);
        }
      },
      redo() {
        if (self.canRedo && targetStore) {
          self.currentIndex += 1;
          const nextState = self.history[self.currentIndex];
          applySnapshot(targetStore, nextState);
        }
      },
      goToState(index) {
        if (index >= 0 && index < self.history.length && targetStore) {
          self.currentIndex = index;
          const state = self.history[index];
          applySnapshot(targetStore, state);
        }
      },
      clear() {
        self.history.clear();
        self.currentIndex = -1;
        if (targetStore) {
          self.currentState = getSnapshot(targetStore);
          self.history.push(self.currentState);
          self.currentIndex = 0;
        }
      }
    };
  });

// React Components
const TodoComponent = observer(({ store }) => {
  const [newTodoName, setNewTodoName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleAddTodo = () => {
    if (newTodoName.trim()) {
      const id = Date.now().toString();
      store.addTodo(id, newTodoName);
      setNewTodoName('');
    }
  };

  const handleAddUser = () => {
    if (newUserName.trim() && newUserEmail.trim()) {
      const id = `user_${Date.now()}`;
      store.addUser(id, newUserName, newUserEmail);
      setNewUserName('');
      setNewUserEmail('');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>MobX State Tree Todo Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Add User</h4>
        <input
          type="text"
          placeholder="Name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Add Todo</h4>
        <input
          type="text"
          placeholder="Todo name"
          value={newTodoName}
          onChange={(e) => setNewTodoName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Filters</h4>
        <button onClick={() => store.setFilter('all')} 
                style={{ marginRight: '5px', fontWeight: store.filter === 'all' ? 'bold' : 'normal' }}>
          All ({store.todoCount})
        </button>
        <button onClick={() => store.setFilter('active')} 
                style={{ marginRight: '5px', fontWeight: store.filter === 'active' ? 'bold' : 'normal' }}>
          Active ({store.activeCount})
        </button>
        <button onClick={() => store.setFilter('completed')} 
                style={{ marginRight: '5px', fontWeight: store.filter === 'completed' ? 'bold' : 'normal' }}>
          Completed ({store.completedCount})
        </button>
        
        <select 
          value={store.selectedUser?.id || ''} 
          onChange={(e) => store.setSelectedUser(e.target.value || undefined)}
          style={{ marginLeft: '10px' }}
        >
          <option value="">All Users</option>
          {Array.from(store.users.values()).map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Search..."
          value={store.searchQuery}
          onChange={(e) => store.setSearchQuery(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => store.loadInitialData()} disabled={store.isLoading}>
          {store.isLoading ? 'Loading...' : 'Load Sample Data'}
        </button>
        <button onClick={() => store.markAllCompleted()} style={{ marginLeft: '10px' }}>
          Mark All Completed
        </button>
        <button onClick={() => store.clearCompleted()} style={{ marginLeft: '10px' }}>
          Clear Completed
        </button>
      </div>

      <div>
        <h4>Todos ({store.filteredTodos.length})</h4>
        {store.filteredTodos.length === 0 ? (
          <p>No todos found</p>
        ) : (
          store.filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} users={store.users} />
          ))
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>Overdue Todos</h4>
        {store.overdueTodos.length === 0 ? (
          <p>No overdue todos</p>
        ) : (
          store.overdueTodos.map(todo => (
            <div key={todo.id} style={{ color: 'red', marginBottom: '5px' }}>
              {todo.name} - {todo.daysUntilDue !== null && `${Math.abs(todo.daysUntilDue)} days overdue`}
            </div>
          ))
        )}
      </div>
    </div>
  );
});

const TodoItem = observer(({ todo, users }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(todo.name);

  const handleSave = () => {
    todo.setName(editName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(todo.name);
    setIsEditing(false);
  };

  return (
    <div style={{ 
      padding: '10px', 
      margin: '5px 0', 
      backgroundColor: todo.done ? '#f0f0f0' : 'white',
      border: '1px solid #ddd',
      borderRadius: '5px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => todo.toggle()}
            style={{ marginRight: '10px' }}
          />
          
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <button onClick={handleSave} style={{ marginRight: '5px' }}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <span 
              style={{ 
                textDecoration: todo.done ? 'line-through' : 'none',
                marginRight: '10px'
              }}
            >
              {todo.name}
            </span>
          )}
          
          <select 
            value={todo.user?.id || ''} 
            onChange={(e) => todo.setUser(e.target.value || undefined)}
            style={{ marginRight: '10px' }}
          >
            <option value="">No User</option>
            {Array.from(users.values()).map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          
          {todo.dueDate && (
            <span style={{ marginRight: '10px', color: todo.isOverdue ? 'red' : 'green' }}>
              Due: {todo.dueDate.toLocaleDateString()}
            </span>
          )}
        </div>
        
        <div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} style={{ marginRight: '5px' }}>
              Edit
            </button>
          )}
          <button onClick={() => todo.delete()} style={{ color: 'red' }}>
            Delete
          </button>
        </div>
      </div>
      
      {todo.tags.length > 0 && (
        <div style={{ marginTop: '5px' }}>
          {todo.tags.map(tag => (
            <span key={tag} style={{ 
              display: 'inline-block', 
              padding: '2px 8px', 
              margin: '2px', 
              backgroundColor: '#e1f5fe',
              borderRadius: '10px',
              fontSize: '12px'
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

const ShoppingCartComponent = observer(({ cart, products }) => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>MobX State Tree Shopping Cart</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Products</h4>
        {products.map(product => (
          <div key={product.id} style={{ marginBottom: '10px' }}>
            <span>{product.name} - ${product.price.toFixed(2)}</span>
            <button 
              onClick={() => cart.addItem(product)}
              disabled={!product.inStock}
              style={{ marginLeft: '10px' }}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Cart ({cart.itemCount} items)</h4>
        {cart.isEmpty ? (
          <p>Cart is empty</p>
        ) : (
          <div>
            {cart.items.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                <div>
                  <strong>{item.product.name}</strong> - ${item.product.price.toFixed(2)} x {item.quantity}
                  <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                    = ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div style={{ marginTop: '5px' }}>
                  <button onClick={() => item.decrement()}>-</button>
                  <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                  <button onClick={() => item.increment()}>+</button>
                  <button 
                    onClick={() => cart.removeItem(item.product.id)}
                    style={{ marginLeft: '10px', color: 'red' }}
                  >
                    Remove
                  </button>
                </div>
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
            value={cart.discount}
            onChange={(e) => cart.setDiscount(parseInt(e.target.value) || 0)}
            min="0"
            max="100"
            style={{ width: '60px', margin: '0 10px' }}
          />
          %
        </div>
        <div><strong>Total: ${cart.total.toFixed(2)}</strong></div>
      </div>

      <button onClick={() => cart.clear()}>Clear Cart</button>
    </div>
  );
});

const GameComponent = observer(({ game }) => {
  useEffect(() => {
    game.initializeAchievements();
  }, [game]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>MobX State Tree Game State</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div>Score: {game.score}</div>
        <div>Level: {game.level}</div>
        <div>Lives: {game.lives}</div>
        <div>High Score: {game.highScore}</div>
        <div>Status: {game.isGameOver ? 'Game Over' : game.isPaused ? 'Paused' : 'Playing'}</div>
        <div>Play Time: {Math.floor(game.playTime / 1000)}s</div>
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
        <h4>Achievements ({game.unlockedAchievements.length}/{game.achievements.size})</h4>
        {Array.from(game.achievements.values()).map(achievement => (
          <div key={achievement.id} style={{ 
            padding: '10px', 
            margin: '5px 0', 
            backgroundColor: achievement.isUnlocked ? '#e8f5e8' : '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}>
            <div style={{ fontWeight: 'bold' }}>
              {achievement.name} {achievement.isUnlocked ? '✓' : '🔒'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {achievement.description}
            </div>
            {achievement.isUnlocked && achievement.unlockedAt && (
              <div style={{ fontSize: '10px', color: '#888' }}>
                Unlocked: {achievement.unlockedAt.toLocaleString()}
              </div>
            )}
          </div>
        ))}
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
        <button onClick={() => game.reset()}>
          Reset Game
        </button>
      </div>
    </div>
  );
});

const TimeTravelComponent = observer(({ timeTravelStore, targetStore }) => {
  useEffect(() => {
    if (targetStore && !timeTravelStore.history.length) {
      timeTravelStore.setTargetStore(targetStore);
    }
  }, [timeTravelStore, targetStore]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>MobX State Tree Time Travel</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => timeTravelStore.undo()} disabled={!timeTravelStore.canUndo}>
          Undo
        </button>
        <button onClick={() => timeTravelStore.redo()} disabled={!timeTravelStore.canRedo} style={{ marginLeft: '10px' }}>
          Redo
        </button>
        <button onClick={() => timeTravelStore.clear()} style={{ marginLeft: '10px' }}>
          Clear History
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>History ({timeTravelStore.history.length} states)</h4>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
          {timeTravelStore.history.map((state, index) => (
            <div 
              key={index} 
              style={{ 
                padding: '5px', 
                margin: '2px 0', 
                backgroundColor: index === timeTravelStore.currentIndex ? '#e3f2fd' : '#f5f5f5',
                cursor: 'pointer',
                borderRadius: '3px'
              }}
              onClick={() => timeTravelStore.goToState(index)}
            >
              State {index + 1} {index === timeTravelStore.currentIndex && '(Current)'}
              <div style={{ fontSize: '10px', color: '#666' }}>
                {JSON.stringify(state).substring(0, 100)}...
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div>Current Index: {timeTravelStore.currentIndex}</div>
        <div>Can Undo: {timeTravelStore.canUndo ? 'Yes' : 'No'}</div>
        <div>Can Redo: {timeTravelStore.canRedo ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
});

// Main App Component
const MobXStateTreeExamples = () => {
  const [store] = useState(() => RootStore.create());
  const [game] = useState(() => GameState.create());
  const [timeTravelStore] = useState(() => TimeTravelStore.create());
  
  // Sample products for shopping cart
  const [products] = useState(() => [
    Product.create({ id: '1', name: 'Laptop', price: 999.99, category: 'Electronics' }),
    Product.create({ id: '2', name: 'Mouse', price: 29.99, category: 'Electronics' }),
    Product.create({ id: '3', name: 'Keyboard', price: 79.99, category: 'Electronics' }),
    Product.create({ id: '4', name: 'Monitor', price: 299.99, category: 'Electronics' })
  ]);
  
  const [cart] = useState(() => ShoppingCart.create());

  useEffect(() => {
    // Setup snapshot logging
    const snapshotDisposer = onSnapshot(store, (snapshot) => {
      console.log('Store snapshot:', snapshot);
    });

    // Setup patch logging
    const patchDisposer = onPatch(store, (patch) => {
      console.log('Store patch:', patch);
    });

    // Setup action logging
    const actionDisposer = onAction(store, (call) => {
      console.log('Store action:', call);
    });

    return () => {
      snapshotDisposer();
      patchDisposer();
      actionDisposer();
    };
  }, [store]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MobX State Tree Examples</h1>
      <p>Comprehensive examples demonstrating MobX State Tree patterns</p>
      
      <TodoComponent store={store} />
      <ShoppingCartComponent cart={cart} products={products} />
      <GameComponent game={game} />
      <TimeTravelComponent timeTravelStore={timeTravelStore} targetStore={store} />
    </div>
  );
};

export default MobXStateTreeExamples;