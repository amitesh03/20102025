import { makeObservable, observable, action, computed, autorun, reaction } from 'mobx';
import { observer } from 'mobx-react';

// Counter Store
class CounterStore {
  count = 0;
  
  constructor() {
    makeObservable(this, {
      count: observable,
      increment: action,
      decrement: action,
      reset: action,
      doubled: computed
    });
  }
  
  increment() {
    this.count++;
  }
  
  decrement() {
    this.count--;
  }
  
  reset() {
    this.count = 0;
  }
  
  get doubled() {
    return this.count * 2;
  }
}

// Todo Store
class TodoStore {
  todos = [];
  filter = 'all'; // 'all', 'active', 'completed'
  
  constructor() {
    makeObservable(this, {
      todos: observable,
      filter: observable,
      addTodo: action,
      toggleTodo: action,
      deleteTodo: action,
      setFilter: action,
      clearCompleted: action,
      activeTodos: computed,
      completedTodos: computed,
      filteredTodos: computed,
      stats: computed
    });
  }
  
  addTodo(text) {
    this.todos.push({
      id: Date.now(),
      text,
      completed: false
    });
  }
  
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }
  
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
  }
  
  setFilter(filter) {
    this.filter = filter;
  }
  
  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
  }
  
  get activeTodos() {
    return this.todos.filter(t => !t.completed);
  }
  
  get completedTodos() {
    return this.todos.filter(t => t.completed);
  }
  
  get filteredTodos() {
    switch (this.filter) {
      case 'active':
        return this.activeTodos;
      case 'completed':
        return this.completedTodos;
      default:
        return this.todos;
    }
  }
  
  get stats() {
    return {
      total: this.todos.length,
      active: this.activeTodos.length,
      completed: this.completedTodos.length
    };
  }
}

// User Store with async action
class UserStore {
  user = null;
  loading = false;
  error = null;
  
  constructor() {
    makeObservable(this, {
      user: observable,
      loading: observable,
      error: observable,
      fetchUser: action,
      clearUser: action
    });
  }
  
  async fetchUser() {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      this.user = await response.json();
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
  
  clearUser() {
    this.user = null;
    this.error = null;
  }
}

// Create store instances
const counterStore = new CounterStore();
const todoStore = new TodoStore();
const userStore = new UserStore();

// Autorun example - runs whenever any observable changes
autorun(() => {
  console.log('Counter changed:', counterStore.count);
});

// Reaction example - runs when specific data changes
reaction(
  () => todoStore.stats,
  (stats) => {
    console.log('Todo stats changed:', stats);
  }
);

// Components
const Counter = observer(() => {
  return (
    <div>
      <h2>Counter: {counterStore.count}</h2>
      <p>Doubled: {counterStore.doubled}</p>
      <button onClick={() => counterStore.increment()}>Increment</button>
      <button onClick={() => counterStore.decrement()}>Decrement</button>
      <button onClick={() => counterStore.reset()}>Reset</button>
    </div>
  );
});

const TodoList = observer(() => {
  const [inputValue, setInputValue] = React.useState('');
  
  const handleAddTodo = () => {
    if (inputValue.trim()) {
      todoStore.addTodo(inputValue);
      setInputValue('');
    }
  };
  
  return (
    <div>
      <h3>Todo List</h3>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add new todo..."
        onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
      />
      <button onClick={handleAddTodo}>Add</button>
      
      <div style={{ margin: '10px 0' }}>
        <button onClick={() => todoStore.setFilter('all')}>All</button>
        <button onClick={() => todoStore.setFilter('active')}>Active</button>
        <button onClick={() => todoStore.setFilter('completed')}>Completed</button>
        <button onClick={() => todoStore.clearCompleted()}>Clear Completed</button>
      </div>
      
      <ul>
        {todoStore.filteredTodos.map(todo => (
          <li key={todo.id} style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            margin: '5px 0'
          }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => todoStore.toggleTodo(todo.id)}
            />
            {todo.text}
            <button 
              onClick={() => todoStore.deleteTodo(todo.id)}
              style={{ marginLeft: '10px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      <div>
        <p>Total: {todoStore.stats.total}</p>
        <p>Active: {todoStore.stats.active}</p>
        <p>Completed: {todoStore.stats.completed}</p>
      </div>
    </div>
  );
});

const UserData = observer(() => {
  return (
    <div>
      <h3>User Data</h3>
      <button onClick={() => userStore.fetchUser()}>
        {userStore.loading ? 'Loading...' : 'Fetch User'}
      </button>
      <button onClick={() => userStore.clearUser()}>Clear</button>
      
      {userStore.error && <p style={{ color: 'red' }}>Error: {userStore.error}</p>}
      
      {userStore.user && (
        <div>
          <p>Name: {userStore.user.name}</p>
          <p>Email: {userStore.user.email}</p>
          <p>Website: {userStore.user.website}</p>
        </div>
      )}
    </div>
  );
});

// Main App component
const MobXExample = observer(() => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MobX State Management Examples</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <Counter />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <TodoList />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <UserData />
      </div>
    </div>
  );
});

export default MobXExample;