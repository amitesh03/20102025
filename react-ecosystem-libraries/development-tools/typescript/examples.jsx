/**
 * TypeScript Examples
 * 
 * TypeScript is a strongly typed programming language that builds on JavaScript,
 * giving you better tooling at any scale. It adds static type definitions to JavaScript.
 */

// Example 1: Basic TypeScript types
/*
// types.ts
// Basic types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let x: [string, number] = ["hello", 10]; // Tuple

// Enum
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;

// Any type
let notSure: any = 4;
notSure = "maybe a string";
notSure = false;

// Void type
function warnUser(): void {
  console.log("This is a warning message");
}

// Null and Undefined
let u: undefined = undefined;
let n: null = null;
*/

// Example 2: Interface definitions
/*
// interfaces.ts
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
  readonly createdAt: Date; // Read-only property
}

interface Admin extends User {
  permissions: string[];
}

// Function interface
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// Using interfaces
const user: User = {
  id: 1,
  name: "John Doe",
  createdAt: new Date()
};

const admin: Admin = {
  id: 2,
  name: "Admin User",
  email: "admin@example.com",
  createdAt: new Date(),
  permissions: ["read", "write", "delete"]
};
*/

// Example 3: Classes with TypeScript
/*
// classes.ts
class Animal {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  public move(distanceInMeters: number = 0): void {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
  
  public bark(): void {
    console.log(`${this.name} barks.`);
  }
}

// Using classes
const dog = new Dog("Rex");
dog.bark(); // Rex barks.
dog.move(10); // Rex moved 10m.
*/

// Example 4: Generics
/*
// generics.ts
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// Generic class
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

// Using generics
let output = identity<string>("myString");
let myIdentity: GenericIdentityFn<number> = identity;

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
*/

// Example 5: React with TypeScript
/*
// components/Button.tsx
import React from 'react';

// Define props interface
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Functional component with TypeScript
const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;
*/

// Example 6: Custom hooks with TypeScript
/*
// hooks/useApi.ts
import { useState, useEffect } from 'react';

// Generic API hook
interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApi<T>(url: string): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useApi;
*/

// Example 7: Context with TypeScript
/*
// context/AuthContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define types
interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (user: User) => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Action types
type AuthAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user: action.payload,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false
  });

  const login = (user: User) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
*/

// Example 8: Redux with TypeScript
/*
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import counterReducer from './counterSlice';

// Configure store
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// store/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
*/

// Example 9: API types and services
/*
// types/api.ts
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

// services/apiService.ts
import { Post, Comment, User } from '../types/api';

class ApiService {
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${this.baseUrl}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  }

  async getPost(id: number): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    return response.json();
  }

  async getComments(postId: number): Promise<Comment[]> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}/comments`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    return response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  }
}

export default new ApiService();
*/

// Example 10: Utility types
/*
// utils/utilityTypes.ts
// Partial - Makes all properties optional
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

// Required - Makes all properties required
interface PartialTodo {
  title?: string;
  description?: string;
  completed?: boolean;
}

const completeTodo = (todo: Required<PartialTodo>) => {
  // All properties are now required
};

// Pick - Creates a type by picking a set of properties
interface TodoPreview {
  title: string;
  completed: boolean;
}

const todoPreview: Pick<Todo, 'title' | 'completed'> = {
  title: "Clean room",
  completed: false
};

// Omit - Creates a type by omitting a set of properties
interface TodoInfo {
  description: string;
  completed: boolean;
}

const todoInfo: Omit<Todo, 'title'> = {
  description: "Clean the room",
  completed: false
};

// Record - Creates an object type with specified keys and values
interface PageInfo {
  title: string;
}

type Page = 'home' | 'about' | 'contact';

const nav: Record<Page, PageInfo> = {
  home: { title: "Home" },
  about: { title: "About" },
  contact: { title: "Contact" }
};
*/

// Example 11: tsconfig.json configuration
/*
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "declaration": true,
    "outDir": "./dist",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/utils/*": ["utils/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
*/

export const typescriptExamples = {
  description: "Examples of using TypeScript with React for type-safe development",
  installation: "npm install typescript @types/react @types/react-dom --save-dev",
  benefits: [
    "Type safety at compile time",
    "Better IDE support with autocompletion",
    "Self-documenting code",
    "Easier refactoring",
    "Catch errors before runtime"
  ],
  concepts: [
    "Basic types (string, number, boolean, etc.)",
    "Interfaces and type definitions",
    "Generics for reusable code",
    "React component typing",
    "Custom hooks with types",
    "Context API with TypeScript",
    "Redux with TypeScript",
    "API service typing",
    "Utility types (Partial, Required, Pick, etc.)"
  ]
};