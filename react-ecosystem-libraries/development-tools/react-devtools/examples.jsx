/**
 * React DevTools Examples
 * 
 * React DevTools is a browser extension that allows you to inspect the React component
 * hierarchy, including props and state. It's an essential tool for debugging React applications.
 */

// Example 1: Installing React DevTools
/*
// For browser extension:
// Install from Chrome Web Store or Firefox Add-ons

// For standalone app (for React Native):
npm install --save-dev react-devtools

// Then add to your app entry point:
if (process.env.NODE_ENV === 'development') {
  import('react-devtools').then((devtools) => {
    devtools.default.connect();
  });
}
*/

// Example 2: Component inspection basics
/*
// When you open DevTools and select a component, you can see:
// - Component name and type
// - Props passed to the component
// - State (useState, useReducer)
// - Hooks in use
// - Context values
// - Performance information
*/

// Example 3: Using the Profiler to measure performance
/*
// Wrap your components with the Profiler component to measure performance
import React, { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // id: the "id" prop of the Profiler tree that has just committed
  // phase: "mount" or "update"
  // actualDuration: time spent rendering the committed update
  // baseDuration: estimated time to render the entire subtree without memoization
  // startTime: when React began rendering this update
  // commitTime: when React committed this update
  
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Navigation />
      <Main />
      <Footer />
    </Profiler>
  );
}
*/

// Example 4: Debugging component state changes
/*
// React DevTools allows you to:
// 1. View current state values
// 2. Modify state values directly in the DevTools
// 3. See how state changes affect re-renders

// Example component with state to inspect:
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isEven, setIsEven] = useState(true);

  useEffect(() => {
    setIsEven(count % 2 === 0);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Is Even: {isEven ? 'Yes' : 'No'}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

// In DevTools, you can:
// - See the current count and isEven values
// - Modify count directly to test different states
// - Observe how changing count affects isEven
*/

// Example 5: Inspecting Context values
/*
// React DevTools allows you to inspect context providers and consumers
import React, { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
      <Main />
    </ThemeContext.Provider>
  );
}

function Header() {
  const theme = useContext(ThemeContext);
  return <header className={theme}>Header</header>;
}

function Main() {
  const theme = useContext(ThemeContext);
  return <main className={theme}>Main Content</main>;
}

// In DevTools, you can:
// - See the ThemeContext provider and its value
// - Identify which components consume the context
// - View the current context value for each consumer
*/

// Example 6: Debugging hooks
/*
// React DevTools shows all hooks used by a component
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  
  // Memoized expensive calculation
  const userPermissions = useMemo(() => {
    if (!user) return [];
    return calculatePermissions(user.role);
  }, [user]);
  
  // Memoized callback function
  const handleSave = useCallback(() => {
    saveUserData(user);
  }, [user]);
  
  useEffect(() => {
    fetchUser(userId).then(userData => {
      setUser(userData);
      setLoading(false);
    });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <input ref={inputRef} defaultValue={user.name} />
      <button onClick={handleSave}>Save</button>
      <div>Permissions: {userPermissions.join(', ')}</div>
    </div>
  );
}

// In DevTools, you can see:
// - All hooks in use (useState, useEffect, useRef, useMemo, useCallback)
// - Current values for each hook
// - Dependencies of useEffect, useMemo, and useCallback
*/

// Example 7: Component highlighting and search
/*
// React DevTools features:
// 1. Component highlighting - hover over components in the tree to highlight them in the app
// 2. Search components - find components by name
// 3. Filter components - show only components that match certain criteria

// Example complex component tree:
function App() {
  return (
    <div>
      <Header>
        <Logo />
        <Navigation>
          <NavItem>Home</NavItem>
          <NavItem>About</NavItem>
          <NavItem>Contact</NavItem>
        </Navigation>
      </Header>
      <Main>
        <Sidebar>
          <Widget title="Profile" />
          <Widget title="Settings" />
        </Sidebar>
        <Content>
          <Article title="Getting Started" />
          <Article title="Advanced Features" />
        </Content>
      </Main>
      <Footer />
    </div>
  );
}

// In DevTools, you can:
// - Search for specific components like "Widget" or "Article"
// - Highlight components to see their position in the UI
// - Navigate the component tree easily
*/

// Example 8: Using the Components tab for debugging
/*
// The Components tab in React DevTools provides:
// 1. Component tree visualization
// 2. Props inspection and editing
// 3. State inspection and editing
// 4. Hooks inspection
// 5. Context inspection
// 6. Component source location

// Example component with various properties to inspect:
import React, { useState, useContext } from 'react';
import { UserContext } from './contexts';

function UserCard({ user, onUpdate, className, style, children }) {
  const { currentUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    onUpdate(user);
    setIsEditing(false);
  };
  
  return (
    <div className={className} style={style}>
      {isEditing ? (
        <div>
          <input defaultValue={user.name} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button onClick={handleEdit}>Edit</button>
          {children}
        </div>
      )}
    </div>
  );
}

// In DevTools, you can:
// - Inspect all props (user, onUpdate, className, style, children)
// - Modify props to test different scenarios
// - Change the isEditing state to toggle between edit/view modes
// - See the current context value from UserContext
// - Click on the component name to jump to its source code
*/

// Example 9: Using the Profiler tab for performance optimization
/*
// The Profiler tab helps identify performance bottlenecks:
// 1. Record render performance
// 2. Identify components that re-render unnecessarily
// 3. Measure the impact of optimizations

// Example component with potential performance issues:
import React, { useState, useEffect } from 'react';

function ExpensiveComponent({ data }) {
  const [processedData, setProcessedData] = useState([]);
  
  // This expensive operation runs on every render
  const expensiveCalculation = () => {
    console.log('Running expensive calculation...');
    return data.map(item => {
      // Simulate expensive processing
      for (let i = 0; i < 1000; i++) {
        item.processed = item.value * Math.random();
      }
      return item;
    });
  };
  
  useEffect(() => {
    setProcessedData(expensiveCalculation());
  }, [data]);
  
  return (
    <div>
      {processedData.map((item, index) => (
        <div key={index}>{item.processed}</div>
      ))}
    </div>
  );
}

// Optimized version with useMemo:
function OptimizedExpensiveComponent({ data }) {
  const processedData = React.useMemo(() => {
    console.log('Running expensive calculation...');
    return data.map(item => {
      // Simulate expensive processing
      for (let i = 0; i < 1000; i++) {
        item.processed = item.value * Math.random();
      }
      return item;
    });
  }, [data]);
  
  return (
    <div>
      {processedData.map((item, index) => (
        <div key={index}>{item.processed}</div>
      ))}
    </div>
  );
}

// Using the Profiler:
// 1. Open the Profiler tab
// 2. Click the record button
// 3. Interact with your app
// 4. Stop recording
// 5. Analyze the flame graph to identify expensive renders
// 6. Compare before and after optimization
*/

// Example 10: Debugging with React DevTools in production
/*
// React DevTools can be used in production builds with some limitations:
// 1. Component names might be minified
// 2. Props and state might not be visible
// 3. Performance impact is minimal

// To enable better debugging in production:
// 1. Keep component names intact (avoid anonymous components)
// 2. Use displayName for dynamically created components
// 3. Consider using source maps

// Example with displayName:
const DynamicComponent = React.forwardRef((props, ref) => {
  return <div {...props} ref={ref} />;
});

DynamicComponent.displayName = 'DynamicComponent';

// This ensures the component has a recognizable name in DevTools
*/

export const reactDevToolsExamples = {
  description: "Examples of using React DevTools for debugging React applications",
  installation: {
    browser: "Install from Chrome Web Store or Firefox Add-ons",
    standalone: "npm install --save-dev react-devtools"
  },
  features: [
    "Component tree inspection",
    "Props and state debugging",
    "Performance profiling",
    "Context inspection",
    "Hook debugging",
    "Component highlighting and search"
  ],
  tips: [
    "Use the Profiler to identify performance bottlenecks",
    "Modify state and props directly in DevTools to test edge cases",
    "Inspect context values to debug provider/consumer issues",
    "Use component highlighting to locate elements in complex UIs"
  ]
};