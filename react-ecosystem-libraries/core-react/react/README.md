# React

React is a JavaScript library for building user interfaces, particularly web applications with rich, interactive UIs.

## Overview

React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.

## Key Features

- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Describe what the UI should look like for any given state
- **Learn Once, Write Anywhere**: Build mobile apps with React Native
- **Virtual DOM**: Efficient updates through a virtual DOM representation
- **JSX**: Syntax extension for JavaScript to write HTML-like code

## Installation

```bash
# Using npm
npm install react react-dom

# Using yarn
yarn add react react-dom

# Using pnpm
pnpm add react react-dom
```

## Basic Usage

```jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Counter />);
```

## Core Concepts

### Components
Components are the building blocks of React applications. They can be functional or class-based.

```jsx
// Functional Component
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Class Component
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### Props
Props are read-only attributes passed from parent to child components.

```jsx
function App() {
  return <Welcome name="Sara" />;
}
```

### State
State is mutable data managed within a component.

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Hooks
Hooks are functions that let you use state and other React features in functional components.

```jsx
import { useState, useEffect, useContext } from 'react';

// useState - for state management
const [state, setState] = useState(initialValue);

// useEffect - for side effects
useEffect(() => {
  // Side effect logic
  return () => {
    // Cleanup
  };
}, [dependencies]);

// useContext - for consuming context
const value = useContext(MyContext);
```

## Common Patterns

### Conditional Rendering
```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in.</h1>;
}

// Using ternary operator
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>}
    </div>
  );
}
```

### Lists and Keys
```jsx
function NumberList({ numbers }) {
  return (
    <ul>
      {numbers.map((number) => (
        <li key={number.toString()}>
          {number}
        </li>
      ))}
    </ul>
  );
}
```

### Forms
```jsx
function NameForm() {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    alert('A name was submitted: ' + value);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

## Best Practices

1. **Keep components small and focused**
2. **Use functional components with hooks**
3. **Follow naming conventions**
4. **Use PropTypes or TypeScript for type checking**
5. **Optimize performance with React.memo, useMemo, and useCallback**
6. **Organize file structure logically**

## Resources

- [Official Documentation](https://reactjs.org/docs/)
- [React Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [React API Reference](https://reactjs.org/docs/reference-api.html)
- [React Community](https://reactjs.org/community/support.html)