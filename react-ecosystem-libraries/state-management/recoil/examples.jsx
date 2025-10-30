import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

// Basic atoms
const countAtom = atom({
  key: 'countState',
  default: 0,
});

const textAtom = atom({
  key: 'textState',
  default: 'Hello Recoil',
});

// Derived selector
const doubledCountSelector = selector({
  key: 'doubledCountState',
  get: ({get}) => {
    const count = get(countAtom);
    return count * 2;
  },
});

// Async selector
const userDataSelector = selector({
  key: 'userDataState',
  get: async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
    return response.json();
  },
});

// Atom family
const todoListAtom = atom({
  key: 'todoListState',
  default: [],
});

// Components
function Counter() {
  const [count, setCount] = useRecoilState(countAtom);
  const doubledCount = useRecoilValue(doubledCountSelector);
  
  return (
    <div>
      <h2>Counter: {count}</h2>
      <p>Doubled: {doubledCount}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
    </div>
  );
}

function TextInput() {
  const [text, setText] = useRecoilState(textAtom);
  
  return (
    <div>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>
    </div>
  );
}

function TodoList() {
  const [todos, setTodos] = useRecoilState(todoListAtom);
  const [inputValue, setInputValue] = React.useState('');
  
  const handleAddTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }]);
      setInputValue('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
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
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            margin: '5px 0'
          }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.text}
            <button 
              onClick={() => deleteTodo(todo.id)}
              style={{ marginLeft: '10px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UserData() {
  const userData = useRecoilValue(userDataSelector);
  
  if (!userData) return <div>Loading user data...</div>;
  
  return (
    <div>
      <h3>User Data</h3>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <p>Website: {userData.website}</p>
    </div>
  );
}

// Selector with parameters example
const filteredTodosSelector = selector({
  key: 'filteredTodosState',
  get: ({get}) => {
    const todos = get(todoListAtom);
    return todos.filter(todo => !todo.completed);
  },
});

function TodoStats() {
  const todos = useRecoilValue(todoListAtom);
  const activeTodos = useRecoilValue(filteredTodosSelector);
  
  return (
    <div>
      <h3>Todo Stats</h3>
      <p>Total: {todos.length}</p>
      <p>Active: {activeTodos.length}</p>
      <p>Completed: {todos.length - activeTodos.length}</p>
    </div>
  );
}

// Main App component
function RecoilExample() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Recoil State Management Examples</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <Counter />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <TextInput />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <TodoList />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <TodoStats />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <UserData />
      </div>
    </div>
  );
}

export default RecoilExample;