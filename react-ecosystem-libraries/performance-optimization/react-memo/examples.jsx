/**
 * React.memo Examples
 * 
 * React.memo() is a higher-order component that prevents unnecessary re-renders
 * by memoizing the rendered output. It's similar to PureComponent but
 * works with functional components.
 */

// Example 1: Basic React.memo usage
/*
// components/RegularComponent.js
import React from 'react';

function RegularComponent({ name, age }) {
  console.log('RegularComponent rendered');
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}

export default RegularComponent;

// components/MemoizedComponent.js
import React from 'react';

const MemoizedComponent = React.memo(function MemoizedComponent({ name, age }) {
  console.log('MemoizedComponent rendered');
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
});

export default MemoizedComponent;

// App.js
import React, { useState } from 'react';
import RegularComponent from './components/RegularComponent';
import MemoizedComponent from './components/MemoizedComponent';

function App() {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  
  const updateUser = () => {
    // This will cause RegularComponent to re-render
    // but MemoizedComponent won't re-render if props are the same
    setUser({ ...user, name: 'John' });
  };
  
  return (
    <div>
      <h1>React.memo Example</h1>
      <button onClick={updateUser}>Update User (same props)</button>
      
      <h2>Regular Component:</h2>
      <RegularComponent name={user.name} age={user.age} />
      
      <h2>Memoized Component:</h2>
      <MemoizedComponent name={user.name} age={user.age} />
    </div>
  );
}

export default App;
*/

// Example 2: React.memo with custom comparison
/*
// components/UserProfile.js
import React from 'react';

// Custom comparison function
const arePropsEqual = (prevProps, nextProps) => {
  // Only re-render if name or age changed
  return (
    prevProps.name === nextProps.name &&
    prevProps.age === nextProps.age
  );
};

const UserProfile = React.memo(function UserProfile({ name, age, address }) {
  console.log('UserProfile rendered');
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Address: {address}</p>
    </div>
  );
}, arePropsEqual);

export default UserProfile;

// App.js
import React, { useState } from 'react';
import UserProfile from './components/UserProfile';

function App() {
  const [user, setUser] = useState({ 
    name: 'John', 
    age: 30, 
    address: '123 Main St' 
  });
  
  const updateUser = () => {
    // This won't cause re-render because only address changes
    // and our comparison function ignores address
    setUser({ ...user, address: '456 Oak Ave' });
  };
  
  return (
    <div>
      <h1>Custom Comparison Function</h1>
      <button onClick={updateUser}>Update Address</button>
      <UserProfile 
        name={user.name} 
        age={user.age} 
        address={user.address} 
      />
    </div>
  );
}

export default App;
*/

// Example 3: React.memo with complex props
/*
// components/ProductList.js
import React from 'react';

// Custom comparison for complex props
const areProductsEqual = (prevProps, nextProps) => {
  // Compare arrays of products
  if (prevProps.products.length !== nextProps.products.length) {
    return false;
  }
  
  return prevProps.products.every((product, index) => {
    const nextProduct = nextProps.products[index];
    return (
      product.id === nextProduct.id &&
      product.name === nextProduct.name &&
      product.price === nextProduct.price
    );
  });
};

const ProductList = React.memo(function ProductList({ products, onProductClick }) {
  console.log('ProductList rendered');
  return (
    <div>
      <h2>Products ({products.length})</h2>
      <ul>
        {products.map(product => (
          <li key={product.id} onClick={() => onProductClick(product)}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}, areProductsEqual);

export default ProductList;

// App.js
import React, { useState } from 'react';
import ProductList from './components/ProductList';

function App() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 699 },
    { id: 3, name: 'Tablet', price: 399 }
  ]);
  
  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
  };
  
  const shuffleProducts = () => {
    // Create new array with same products (different references)
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    setProducts(shuffled);
  };
  
  return (
    <div>
      <h1>Product List with Memo</h1>
      <button onClick={shuffleProducts}>Shuffle Products</button>
      <ProductList 
        products={products} 
        onProductClick={handleProductClick} 
      />
    </div>
  );
}

export default App;
*/

// Example 4: React.memo with functions as props
/*
// components/Button.js
import React from 'react';

const Button = React.memo(function Button({ onClick, children, disabled }) {
  console.log('Button rendered');
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        backgroundColor: disabled ? '#ccc' : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {children}
    </button>
  );
});

export default Button;

// App.js
import React, { useState, useCallback } from 'react';
import Button from './components/Button';

function App() {
  const [count, setCount] = useState(0);
  
  // Use useCallback to memoize the function
  // This prevents the Button component from re-rendering
  // when the parent re-renders for other reasons
  const handleClick = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);
  
  return (
    <div>
      <h1>React.memo with Functions</h1>
      <p>Count: {count}</p>
      <Button onClick={handleClick}>
        Increment Count
      </Button>
    </div>
  );
}

export default App;
*/

// Example 5: React.memo with children
/*
// components/Card.js
import React from 'react';

const Card = React.memo(function Card({ title, children }) {
  console.log('Card rendered');
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
});

export default Card;

// App.js
import React, { useState } from 'react';
import Card from './components/Card';

function App() {
  const [title, setTitle] = useState('Card Title');
  
  return (
    <div>
      <h1>React.memo with Children</h1>
      <input 
        type="text" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter card title"
      />
      
      <Card title={title}>
        <p>This is the card content.</p>
        <p>Changing the title won't re-render the children.</p>
      </Card>
    </div>
  );
}

export default App;
*/

// Example 6: React.memo with forwardRef
/*
// components/Input.js
import React, { forwardRef } from 'react';

const Input = React.memo(forwardRef(function Input({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text' 
}, ref) {
  console.log('Input rendered');
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px'
      }}
    />
  );
}));

export default Input;

// App.js
import React, { useState, useRef, useEffect } from 'react';
import Input from './components/Input';

function App() {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef();
  
  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  return (
    <div>
      <h1>React.memo with forwardRef</h1>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type something..."
      />
      <p>Value: {inputValue}</p>
    </div>
  );
}

export default App;
*/

// Example 7: When NOT to use React.memo
/*
// components/TodoItem.js
import React from 'react';

// DON'T memoize components that need to re-render based on state changes
function TodoItem({ todo, onToggle, onDelete }) {
  console.log('TodoItem rendered:', todo.id);
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(todo.text);
  
  const handleToggle = () => {
    onToggle(todo.id);
  };
  
  const handleDelete = () => {
    onDelete(todo.id);
  };
  
  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
      borderBottom: '1px solid #eee'
    }}>
      <input 
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      
      {isEditing ? (
        <input 
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
        />
      ) : (
        <span 
          style={{
            textDecoration: todo.completed ? 'line-through' : 'none',
            flex: 1,
            cursor: 'pointer'
          }}
          onClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}
      
      <button onClick={handleDelete} style={{ marginLeft: '8px' }}>
        Delete
      </button>
    </div>
  );
}

// DON'T use React.memo here because the component has internal state
// that needs to update when props change
// export default React.memo(TodoItem); // This would cause issues!

export default TodoItem;
*/

// Example 8: React.memo with performance monitoring
/*
// utils/performanceMonitor.js
export const withPerformanceMonitoring = (WrappedComponent) => {
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const MonitoredComponent = React.memo(function MonitoredComponent(props) {
    React.useEffect(() => {
      console.time(`${componentName} render`);
      
      return () => {
        console.timeEnd(`${componentName} render`);
      };
    });
    
    return <WrappedComponent {...props} />;
  });
  
  MonitoredComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  
  return MonitoredComponent;
};

// components/MonitoredComponent.js
import React from 'react';
import { withPerformanceMonitoring } from '../utils/performanceMonitor';

function ExpensiveComponent({ data }) {
  // Simulate expensive computation
  const processedData = React.useMemo(() => {
    console.log('Processing expensive data...');
    return data.map(item => ({
      ...item,
      processed: item.value * Math.random()
    }));
  }, [data]);
  
  return (
    <div>
      <h2>Expensive Component</h2>
      <ul>
        {processedData.map(item => (
          <li key={item.id}>
            {item.name}: {item.processed.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withPerformanceMonitoring(ExpensiveComponent);
*/

// Example 9: React.memo with TypeScript
/*
// components/UserCard.tsx
import React from 'react';

interface UserCardProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  onUserClick: (user: UserCardProps['user']) => void;
}

const UserCard = React.memo(function UserCard({ user, onUserClick }) {
  console.log('UserCard rendered:', user.id);
  
  const handleClick = () => {
    onUserClick(user);
  };
  
  return (
    <div 
      onClick={handleClick}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px',
        cursor: 'pointer'
      }}
    >
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

export default UserCard;

// App.tsx
import React, { useState } from 'react';
import UserCard from './components/UserCard';

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
  
  const handleUserClick = (user: User) => {
    console.log('User clicked:', user);
  };
  
  return (
    <div>
      <h1>React.memo with TypeScript</h1>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onUserClick={handleUserClick} 
        />
      ))}
    </div>
  );
}

export default App;
*/

// Example 10: Advanced memoization patterns
/*
// utils/memoization.js
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
export const useExpensiveCalculation = (data) => {
  return useMemo(() => {
    console.log('Performing expensive calculation...');
    return data.reduce((sum, item) => {
      // Simulate expensive operation
      for (let i = 0; i < 1000; i++) {
        Math.sqrt(item.value);
      }
      return sum + item.value;
    }, 0);
  }, [data]);
};

// Memoize event handlers
export const useEventHandlers = (items) => {
  return useMemo(() => ({
    onItemClick: (id) => {
      console.log('Item clicked:', id);
    },
    onItemEdit: (id) => {
      console.log('Item edited:', id);
    },
    onItemDelete: (id) => {
      console.log('Item deleted:', id);
    }
  }), [items]);
};

// Memoize filtered data
export const useFilteredData = (data, filterFn) => {
  return useMemo(() => {
    console.log('Filtering data...');
    return data.filter(filterFn);
  }, [data, filterFn]);
};

// components/OptimizedList.js
import React from 'react';
import { useExpensiveCalculation, useEventHandlers } from '../utils/memoization';

const OptimizedList = React.memo(function OptimizedList({ items }) {
  const total = useExpensiveCalculation(items);
  const handlers = useEventHandlers(items);
  
  return (
    <div>
      <h2>Optimized List</h2>
      <p>Total: {total}</p>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => handlers.onItemClick(item.id)}>
              Edit
            </button>
            <button onClick={() => handlers.onItemDelete(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default OptimizedList;
*/

export const reactMemoExamples = {
  description: "Examples of using React.memo() for preventing unnecessary re-renders",
  concepts: [
    "React.memo() - Higher-order component for memoization",
    "Custom comparison functions - Fine-grained control",
    "useCallback - Memoizing event handlers",
    "useMemo - Memoizing expensive calculations",
    "forwardRef - Passing refs through memo"
  ],
  benefits: [
    "Prevents unnecessary re-renders",
    "Improves performance for complex components",
    "Reduces computation overhead",
    "Optimizes list rendering",
    "Enhances user experience"
  ],
  whenToUse: [
    "Components with expensive render logic",
    "Components that re-render frequently with same props",
    "List items in large collections",
    "Components receiving stable props",
    "Components with complex prop objects"
  ],
  whenNotToUse: [
    "Components with internal state that depends on props",
    "Components that always need to re-render",
    "Components with children that change frequently",
    "Simple components with minimal render cost"
  ],
  bestPractices: [
    "Use custom comparison functions for complex props",
    "Combine with useCallback for event handlers",
    "Combine with useMemo for expensive calculations",
    "Profile components to identify optimization opportunities",
    "Don't overuse - measure performance impact first"
  ]
};