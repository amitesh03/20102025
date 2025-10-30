import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Basic atoms
const countAtom = atom(0);
const textAtom = atom('Hello Jotai');

// Derived atom
const doubledCountAtom = atom(
  (get) => get(countAtom) * 2
);

// Async atom
const userDataAtom = atom(async (get) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
  return response.json();
});

// Atom with storage
const themeAtom = atomWithStorage('theme', 'light');

// Atom family
const todoListAtom = atom([]);

const addTodoAtom = atom(
  null,
  (get, set, newTodo) => {
    set(todoListAtom, [...get(todoListAtom), newTodo]);
  }
);

// Components
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [doubledCount] = useAtom(doubledCountAtom);
  
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
  const [text, setText] = useAtom(textAtom);
  
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

function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}

function TodoList() {
  const [todos, setTodos] = useAtom(todoListAtom);
  const [, addTodo] = useAtom(addTodoAtom);
  const [inputValue, setInputValue] = React.useState('');
  
  const handleAddTodo = () => {
    if (inputValue.trim()) {
      addTodo({
        id: Date.now(),
        text: inputValue,
        completed: false
      });
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
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}

function UserData() {
  const [userData] = useAtom(userDataAtom);
  
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

// Main App component
function JotaiExample() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Jotai State Management Examples</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <Counter />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <TextInput />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <ThemeToggle />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <TodoList />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <UserData />
      </div>
    </div>
  );
}

export default JotaiExample;