# React TypeScript Examples

This folder contains comprehensive examples of using TypeScript with React, demonstrating modern patterns, best practices, and advanced techniques.

## 📚 What's Included

### 1. Component Patterns
- Functional components with proper typing
- Generic components for reusability
- Higher-order components (HOCs)
- Render props patterns
- Compound components

### 2. Hooks and State Management
- Custom hooks with TypeScript
- Context API with type safety
- State management patterns
- Performance optimizations
- Side effects handling

### 3. Form Handling
- Type-safe form state
- Validation patterns
- Controlled components
- Form libraries integration
- Dynamic forms

### 4. Advanced Patterns
- Performance optimization
- Error boundaries
- Code splitting
- Lazy loading
- Testing patterns

## 📁 File Structure

```
react-types/
├── README.md              # This documentation
├── examples.tsx           # Comprehensive React TypeScript examples
└── exercises/             # Practice exercises (coming soon)
    ├── component-patterns/
    ├── custom-hooks/
    ├── form-handling/
    └── advanced-patterns/
```

## 🛠️ Installation

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom
```

## 📖 Core Concepts

### 1. Component Typing

```typescript
import React, { ReactNode, ComponentType } from 'react';

// Basic functional component
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  onEdit?: (user: UserCardProps['user']) => void;
  children?: ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, children }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
      {children}
    </div>
  );
};
```

### 2. Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

function List<T>({ items, renderItem, keyExtractor, emptyMessage }: ListProps<T>) {
  if (items.length === 0) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}
```

### 3. Custom Hooks

```typescript
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
```

### 4. Context with TypeScript

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## 🎯 Advanced Patterns

### 1. Higher-Order Components

```typescript
interface WithLoadingProps {
  loading: boolean;
}

const withLoading = <P extends object>(
  Component: ComponentType<P>
): React.FC<P & WithLoadingProps> => {
  return ({ loading, ...props }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return <Component {...(props as P)} />;
  };
};
```

### 2. Forward Refs

```typescript
interface InputWithRefProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const InputWithRef = React.forwardRef<HTMLInputElement, InputWithRefProps>(
  ({ value, onChange, placeholder }, ref) => {
    return (
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  }
);
```

### 3. Performance Optimization

```typescript
const MemoizedComponent = React.memo(({ data, onItemClick }) => {
  return (
    <div>
      {data.map(item => (
        <div key={item.id} onClick={() => onItemClick(item)}>
          {item.name}
        </div>
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.length === nextProps.data.length &&
         prevProps.data.every((item, index) => item.id === nextProps.data[index].id);
});
```

## 🔧 Event Handling

### 1. Typed Event Handlers

```typescript
interface FormProps {
  onSubmit: (data: { name: string; email: string }) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### 2. Keyboard Events

```typescript
const KeyboardHandler: React.FC = () => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed');
    }
  };

  return <input onKeyDown={handleKeyDown} />;
};
```

## 🎨 Styling with TypeScript

### 1. CSS-in-JS

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  children 
}) => {
  const className = `btn btn--${variant} btn--${size}`;
  
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};
```

### 2. Styled Components

```typescript
import styled from 'styled-components';

interface StyledButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

const StyledButton = styled.button<StyledButtonProps>`
  padding: ${props => props.size === 'small' ? '8px 16px' : '16px 32px'};
  background-color: ${props => props.variant === 'primary' ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
```

## 🧪 Testing with TypeScript

### 1. Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

### 2. Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useApi } from './useApi';

describe('useApi', () => {
  it('fetches data successfully', async () => {
    const mockData = { id: '1', name: 'Test' };
    
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    } as Response);

    const { result, waitForNextUpdate } = renderHook(() => useApi('/api/test'));

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });
});
```

## 📋 Best Practices

### 1. Type Safety
- Always define interfaces for props
- Use generic types for reusable components
- Avoid `any` type when possible
- Use discriminated unions for complex state

### 2. Performance
- Use `React.memo` for expensive components
- Implement proper dependency arrays in hooks
- Use `useCallback` and `useMemo` appropriately
- Consider virtualization for large lists

### 3. Code Organization
- Group related types together
- Export types for reuse
- Use consistent naming conventions
- Separate concerns properly

### 4. Error Handling
- Implement proper error boundaries
- Use type-safe error handling
- Provide fallback UIs
- Log errors appropriately

## 🚀 Advanced Topics

### 1. State Management
- Context API patterns
- State machines
- Redux with TypeScript
- Zustand with TypeScript

### 2. Routing
- React Router with TypeScript
- Route protection
- Type-safe navigation
- Dynamic routing

### 3. Data Fetching
- SWR with TypeScript
- React Query with TypeScript
- GraphQL with TypeScript
- Type-safe API clients

### 4. Forms
- React Hook Form with TypeScript
- Formik with TypeScript
- Custom form solutions
- Validation libraries

## 🔗 Integration Examples

### 1. Redux Integration

```typescript
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    users: userSlice.reducer,
  },
});
```

### 2. React Router Integration

```typescript
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

interface UserParams {
  id: string;
}

const UserProfile: React.FC = () => {
  const { id } = useParams<UserParams>();
  // Component logic
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
};
```

## 📚 Additional Resources

### Official Documentation
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

### Community Resources
- [TypeScript React Starter](https://github.com/microsoft/TypeScript-React-Starter)
- [React TypeScript Examples](https://github.com/typescript-cheatsheets/react)
- [Awesome React TypeScript](https://github.com/niieani/awesome-react-typescript)

### Tools and Libraries
- [React Hook Form](https://react-hook-form.com/)
- [React Query](https://tanstack.com/query/v4)
- [Styled Components](https://styled-components.com/)
- [Emotion](https://emotion.sh/)

## 🤝 Contributing

When contributing to this examples repository:

1. Follow React and TypeScript best practices
2. Include comprehensive type definitions
3. Add JSDoc comments for complex types
4. Provide usage examples
5. Ensure all examples are testable

## 📄 License

This project is for educational purposes and follows MIT license.