# TypeScript React Ecosystem Libraries

This folder contains comprehensive TypeScript examples for popular React ecosystem libraries. Each library demonstrates proper TypeScript integration with type-safe implementations.

## 📁 Folder Structure

```
typescript/react-ecosystem-libraries/
├── state-management/
│   ├── zustand/
│   │   ├── README.md
│   │   └── examples.tsx
│   └── redux-toolkit/
│       ├── README.md
│       └── examples.tsx
├── data-fetching/
│   └── react-query/
│       ├── README.md
│       └── examples.tsx
├── styling-solutions/
│   └── styled-components/
│       ├── README.md
│       └── examples.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the react-ecosystem-libraries directory:
```bash
cd typescript/react-ecosystem-libraries
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 📚 Libraries Included

### State Management

#### 1. Zustand
- **Location**: `state-management/zustand/`
- **Features**: Type-safe state management with TypeScript
- **Examples**: Basic store, CRUD operations, persisted store, multiple stores

#### 2. Redux Toolkit
- **Location**: `state-management/redux-toolkit/`
- **Features**: Type-safe Redux with TypeScript
- **Examples**: Basic setup, CRUD operations, async thunks with API calls

### Data Fetching

#### 3. React Query (TanStack Query)
- **Location**: `data-fetching/react-query/`
- **Features**: Type-safe server state management
- **Examples**: Basic queries, mutations, infinite queries, dependent queries

### Styling Solutions

#### 4. Styled Components
- **Location**: `styling-solutions/styled-components/`
- **Features**: Type-safe CSS-in-JS with TypeScript
- **Examples**: Typed props, theme typing, styled component types

## 🔧 TypeScript Configuration

The project includes comprehensive TypeScript configuration:

### tsconfig.json
- Strict type checking enabled
- Path mapping for clean imports
- JSX support for React
- Module resolution for modern ES modules

### tsconfig.node.json
- Configuration for Node.js environment
- Support for CommonJS modules
- Type definitions for Node.js APIs

## 📖 Key TypeScript Concepts Demonstrated

### 1. Interface Definitions
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
```

### 2. Generic Components
```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}
```

### 3. Type-Safe Props
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}
```

### 4. Theme Typing
```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}
```

### 5. Async Operations
```typescript
interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}
```

## 🎯 Benefits of TypeScript with React Libraries

### 1. Type Safety
- Catch errors at compile time
- Prevent runtime type errors
- Better code reliability

### 2. Enhanced Developer Experience
- IntelliSense and autocompletion
- Better IDE support
- Refactoring safety

### 3. Documentation
- Self-documenting code
- Clear component contracts
- Better team collaboration

### 4. Maintainability
- Easier to understand code
- Better code organization
- Reduced bugs

## 🛠️ Development Workflow

### 1. Code Examples
Each library folder contains:
- Comprehensive README with TypeScript benefits
- Detailed code examples with proper typing
- Comments explaining TypeScript concepts
- Best practices for type safety

### 2. Running Examples
To run specific examples:
```bash
# Navigate to specific library folder
cd state-management/zustand

# Run the example
npx tsx examples.tsx
```

### 3. Type Checking
To check types without running:
```bash
npx tsc --noEmit
```

## 📋 Best Practices

### 1. Interface Definitions
- Define interfaces for all data structures
- Use descriptive names for interfaces
- Export interfaces for reuse

### 2. Generic Types
- Use generics for reusable components
- Provide default type parameters
- Constrain generics when needed

### 3. Type Assertions
- Avoid type assertions when possible
- Use type guards instead
- Prefer type inference

### 4. Error Handling
- Type error states properly
- Use discriminated unions
- Handle null and undefined

## 🔍 Common Patterns

### 1. Type-Safe State Management
```typescript
interface State {
  users: User[];
  loading: boolean;
  error: string | null;
}

interface Actions {
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => void;
  removeUser: (id: number) => void;
}
```

### 2. Type-Safe API Calls
```typescript
interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: unknown): Promise<T>;
  put<T>(url: string, data: unknown): Promise<T>;
  delete<T>(url: string): Promise<T>;
}
```

### 3. Type-Safe Components
```typescript
interface ComponentProps {
  title: string;
  data: DataItem[];
  onSelect: (item: DataItem) => void;
  variant?: 'default' | 'compact';
}
```

## 🚀 Advanced Features

### 1. Utility Types
- `Partial<T>` - Make all properties optional
- `Required<T>` - Make all properties required
- `Pick<T, K>` - Select specific properties
- `Omit<T, K>` - Remove specific properties

### 2. Conditional Types
- Type-based logic
- Type inference
- Type manipulation

### 3. Mapped Types
- Transform existing types
- Create new type structures
- Type-safe property manipulation

## 📚 Additional Resources

### Official Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript React Starter](https://github.com/microsoft/TypeScript-React-Starter)

### Library-Specific Resources
- [Zustand TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)
- [Redux Toolkit TypeScript Guide](https://redux-toolkit.js.org/usage/usage-with-typescript)
- [React Query TypeScript Guide](https://tanstack.com/query/v4/docs/react/typescript)
- [Styled Components TypeScript Guide](https://styled-components.com/docs/api#typescript)

## 🤝 Contributing

When adding new examples:
1. Follow the existing folder structure
2. Include comprehensive TypeScript typing
3. Add detailed comments explaining types
4. Update this README with new information

## 📄 License

This project is for educational purposes and follows the licenses of the respective libraries used.