import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

// Counter Machine
const counterMachine = createMachine({
  id: 'counter',
  initial: 'active',
  context: {
    count: 0
  },
  states: {
    active: {
      on: {
        INCREMENT: {
          actions: assign({
            count: (context) => context.count + 1
          })
        },
        DECREMENT: {
          actions: assign({
            count: (context) => context.count - 1
          })
        },
        RESET: {
          actions: assign({
            count: 0
          })
        }
      }
    }
  }
});

// Todo Machine
const todoMachine = createMachine({
  id: 'todo',
  initial: 'idle',
  context: {
    todos: [],
    filter: 'all', // 'all', 'active', 'completed'
    error: null
  },
  states: {
    idle: {},
    loading: {},
    error: {}
  },
  on: {
    ADD_TODO: {
      actions: assign({
        todos: (context, event) => [
          ...context.todos,
          {
            id: Date.now(),
            text: event.text,
            completed: false
          }
        ]
      })
    },
    TOGGLE_TODO: {
      actions: assign({
        todos: (context, event) =>
          context.todos.map(todo =>
            todo.id === event.id
              ? { ...todo, completed: !todo.completed }
              : todo
          )
      })
    },
    DELETE_TODO: {
      actions: assign({
        todos: (context, event) =>
          context.todos.filter(todo => todo.id !== event.id)
      })
    },
    SET_FILTER: {
      actions: assign({
        filter: (_, event) => event.filter
      })
    },
    CLEAR_COMPLETED: {
      actions: assign({
        todos: (context) => context.todos.filter(todo => !todo.completed)
      })
    }
  }
});

// Fetch Machine (async example)
const fetchMachine = createMachine({
  id: 'fetch',
  initial: 'idle',
  context: {
    data: null,
    error: null
  },
  states: {
    idle: {
      on: {
        FETCH: 'loading'
      }
    },
    loading: {
      invoke: {
        id: 'fetchData',
        src: async () => {
          const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        },
        onDone: {
          target: 'success',
          actions: assign({
            data: (_, event) => event.data
          })
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: (_, event) => event.data.message
          })
        }
      }
    },
    success: {
      on: {
        FETCH: 'loading',
        RESET: 'idle'
      }
    },
    failure: {
      on: {
        RETRY: 'loading',
        RESET: 'idle'
      }
    }
  }
});

// Form Machine (complex state example)
const formMachine = createMachine({
  id: 'form',
  initial: 'editing',
  context: {
    name: '',
    email: '',
    errors: {}
  },
  states: {
    editing: {
      on: {
        CHANGE_NAME: {
          actions: assign({
            name: (_, event) => event.value
          })
        },
        CHANGE_EMAIL: {
          actions: assign({
            email: (_, event) => event.value
          })
        },
        SUBMIT: {
          target: 'validating',
          actions: assign({
            errors: (context) => {
              const errors = {};
              if (!context.name.trim()) {
                errors.name = 'Name is required';
              }
              if (!context.email.trim()) {
                errors.email = 'Email is required';
              } else if (!/\S+@\S+\.\S+/.test(context.email)) {
                errors.email = 'Email is invalid';
              }
              return errors;
            }
          })
        }
      }
    },
    validating: {
      always: [
        {
          target: 'submitting',
          cond: (context) => Object.keys(context.errors).length === 0
        },
        {
          target: 'editing'
        }
      ]
    },
    submitting: {
      invoke: {
        id: 'submitForm',
        src: async (context) => {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { success: true, data: context };
        },
        onDone: 'success',
        onError: 'editing'
      }
    },
    success: {
      on: {
        RESET: {
          target: 'editing',
          actions: assign({
            name: '',
            email: '',
            errors: {}
          })
        }
      }
    }
  }
});

// Components
function Counter() {
  const [state, send] = useMachine(counterMachine);
  
  return (
    <div>
      <h2>Counter: {state.context.count}</h2>
      <button onClick={() => send('INCREMENT')}>Increment</button>
      <button onClick={() => send('DECREMENT')}>Decrement</button>
      <button onClick={() => send('RESET')}>Reset</button>
    </div>
  );
}

function TodoList() {
  const [state, send] = useMachine(todoMachine);
  const [inputValue, setInputValue] = React.useState('');
  
  const handleAddTodo = () => {
    if (inputValue.trim()) {
      send({ type: 'ADD_TODO', text: inputValue });
      setInputValue('');
    }
  };
  
  const filteredTodos = state.context.todos.filter(todo => {
    switch (state.context.filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });
  
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
        <button onClick={() => send({ type: 'SET_FILTER', filter: 'all' })}>
          All ({state.context.todos.length})
        </button>
        <button onClick={() => send({ type: 'SET_FILTER', filter: 'active' })}>
          Active ({state.context.todos.filter(t => !t.completed).length})
        </button>
        <button onClick={() => send({ type: 'SET_FILTER', filter: 'completed' })}>
          Completed ({state.context.todos.filter(t => t.completed).length})
        </button>
        <button onClick={() => send('CLEAR_COMPLETED')}>Clear Completed</button>
      </div>
      
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            margin: '5px 0'
          }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => send({ type: 'TOGGLE_TODO', id: todo.id })}
            />
            {todo.text}
            <button 
              onClick={() => send({ type: 'DELETE_TODO', id: todo.id })}
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
  const [state, send] = useMachine(fetchMachine);
  
  return (
    <div>
      <h3>User Data</h3>
      <button onClick={() => send('FETCH')}>
        {state.matches('loading') ? 'Loading...' : 'Fetch User'}
      </button>
      {state.matches('failure') && (
        <>
          <button onClick={() => send('RETRY')}>Retry</button>
          <button onClick={() => send('RESET')}>Reset</button>
        </>
      )}
      {state.matches('success') && (
        <button onClick={() => send('RESET')}>Reset</button>
      )}
      
      {state.context.error && (
        <p style={{ color: 'red' }}>Error: {state.context.error}</p>
      )}
      
      {state.context.data && (
        <div>
          <p>Name: {state.context.data.name}</p>
          <p>Email: {state.context.data.email}</p>
          <p>Website: {state.context.data.website}</p>
        </div>
      )}
    </div>
  );
}

function FormExample() {
  const [state, send] = useMachine(formMachine);
  
  return (
    <div>
      <h3>Form Example</h3>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={state.context.name}
          onChange={(e) => send({ type: 'CHANGE_NAME', value: e.target.value })}
          disabled={!state.matches('editing')}
        />
        {state.context.errors.name && (
          <p style={{ color: 'red' }}>{state.context.errors.name}</p>
        )}
      </div>
      
      <div>
        <input
          type="email"
          placeholder="Email"
          value={state.context.email}
          onChange={(e) => send({ type: 'CHANGE_EMAIL', value: e.target.value })}
          disabled={!state.matches('editing')}
        />
        {state.context.errors.email && (
          <p style={{ color: 'red' }}>{state.context.errors.email}</p>
        )}
      </div>
      
      <div>
        <button
          onClick={() => send('SUBMIT')}
          disabled={!state.matches('editing') || state.matches('submitting')}
        >
          {state.matches('submitting') ? 'Submitting...' : 'Submit'}
        </button>
        
        {state.matches('success') && (
          <>
            <p style={{ color: 'green' }}>Form submitted successfully!</p>
            <button onClick={() => send('RESET')}>Reset Form</button>
          </>
        )}
      </div>
    </div>
  );
}

// Main App component
function XStateExample() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>XState State Management Examples</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <Counter />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <TodoList />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <UserData />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <FormExample />
      </div>
    </div>
  );
}

export default XStateExample;