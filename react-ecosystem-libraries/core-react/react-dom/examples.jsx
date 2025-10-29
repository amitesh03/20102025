import React, { useState, useEffect, useLayoutEffect, useRef, useContext, useId, useReducer, startTransition, unstable_ViewTransition as ViewTransition, unstable_Activity as Activity } from 'react';
import { createRoot } from 'react-dom/client';
import { preconnect, preload, preinit, useFormStatus } from 'react-dom';

// Example 1: Basic createRoot Usage
function BasicCreateRootExample() {
  return (
    <div>
      <h2>Basic createRoot Usage</h2>
      <p>This demonstrates how to create a React root and render a component.</p>
      <div id="root-container">
        {/* In a real app, this would be rendered with:
        const root = createRoot(document.getElementById('root-container'));
        root.render(<App />);
        */}
        <div className="mock-root">
          <h3>App Component</h3>
          <p>This is where your React app would be rendered.</p>
        </div>
      </div>
      <pre>{`
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
      `}</pre>
    </div>
  );
}

// Example 2: useFormStatus Hook
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function FormWithStatus() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      alert('Form submitted!');
      setFormData({ name: '', email: '' });
    }, 2000);
  };
  
  return (
    <div>
      <h2>useFormStatus Hook</h2>
      <p>Demonstrates form submission status tracking.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <SubmitButton />
      </form>
      <pre>{`
import { useFormStatus } from "react-dom";

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
      `}</pre>
    </div>
  );
}

// Example 3: Resource Preloading
function ResourcePreloadingExample() {
  const [showContent, setShowContent] = useState(false);
  
  const handlePreloadResources = () => {
    // Preload external resources
    preconnect("https://example.com");
    preload("https://example.com/styles.css", { as: "style" });
    preload("https://example.com/script.js", { as: "script" });
    preinit("https://example.com/critical.css", { as: "style", precedence: "high" });
  };
  
  const handleShowContent = () => {
    startTransition(() => {
      setShowContent(true);
    });
  };
  
  return (
    <div>
      <h2>Resource Preloading</h2>
      <p>Demonstrates preconnect, preload, and preinit functions.</p>
      
      <button onClick={handlePreloadResources}>
        Preload Resources
      </button>
      
      <button onClick={handleShowContent}>
        Show Content
      </button>
      
      {showContent && (
        <div className="preloaded-content">
          <h3>Preloaded Content</h3>
          <p>This content would benefit from preloaded resources.</p>
        </div>
      )}
      
      <pre>{`
import { preconnect, preload, preinit } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  preload("https://example.com/script.js", {as: "script"});
  preinit("https://example.com/styles.css", {as: "style", precedence: "high"});
  return <div>App Content</div>;
}
      `}</pre>
    </div>
  );
}

// Example 4: useId Hook
function UseIdExample() {
  const id = useId();
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  
  return (
    <div>
      <h2>useId Hook</h2>
      <p>Demonstrates generating unique IDs for accessibility.</p>
      
      <div>
        <label htmlFor={`${id}-input`}>Input Field:</label>
        <input id={`${id}-input`} type="text" />
      </div>
      
      <div>
        <h3>List with Unique IDs:</h3>
        {items.map((item, index) => {
          const itemId = useId();
          return (
            <div key={index}>
              <input id={itemId} type="checkbox" />
              <label htmlFor={itemId}>{item}</label>
            </div>
          );
        })}
      </div>
      
      <pre>{`
import { useId } from 'react';

function MyComponent() {
  const uniqueId = useId();
  return (
    <div>
      <label htmlFor={uniqueId + '-input'}>Input:</label>
      <input id={uniqueId + '-input'} type="text" />
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 5: useLayoutEffect Hook
function UseLayoutEffectExample() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const divRef = useRef(null);
  
  useLayoutEffect(() => {
    if (divRef.current) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight
      });
    }
  }, []);
  
  return (
    <div>
      <h2>useLayoutEffect Hook</h2>
      <p>Demonstrates synchronous layout effect for DOM measurements.</p>
      
      <div 
        ref={divRef}
        style={{ 
          width: '200px', 
          height: '100px', 
          backgroundColor: 'lightblue',
          padding: '10px'
        }}
      >
        Measurable content
      </div>
      
      <p>Dimensions: {dimensions.width} x {dimensions.height}</p>
      
      <pre>{`
import { useLayoutEffect, useRef, useState } from 'react';

function MeasureComponent() {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useLayoutEffect(() => {
    if (divRef.current) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight
      });
    }
  }, []);
  
  return (
    <div ref={divRef}>
      Dimensions: {dimensions.width} x {dimensions.height}
    </div>
  );
}
      `}</pre>
    </div>
  );
}

// Example 6: ViewTransition Component
function ViewTransitionExample() {
  const [showItem, setShowItem] = useState(false);
  
  return (
    <div>
      <h2>ViewTransition Component</h2>
      <p>Demonstrates animated view transitions.</p>
      
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem(!showItem);
          });
        }}
      >
        {showItem ? 'Hide' : 'Show'} Content
      </button>
      
      {showItem && (
        <ViewTransition>
          <div className="transition-content">
            <h3>Animated Content</h3>
            <p>This content appears with a view transition animation.</p>
          </div>
        </ViewTransition>
      )}
      
      <pre>{`
import {
  unstable_ViewTransition as ViewTransition,
  useState,
  startTransition
} from 'react';

function TransitionExample() {
  const [showItem, setShowItem] = useState(false);
  
  return (
    <>
      <button onClick={() => {
        startTransition(() => {
          setShowItem(!showItem);
        });
      }}>
        {showItem ? 'Hide' : 'Show'} Item
      </button>
      
      {showItem ? (
        <ViewTransition>
          <div>Animated Content</div>
        </ViewTransition>
      ) : null}
    </>
  );
}
      `}</pre>
    </div>
  );
}

// Example 7: Activity Component
function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Sidebar</h3>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
}

function ActivityExample() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);
  
  return (
    <div>
      <h2>Activity Component</h2>
      <p>Demonstrates conditional rendering with Activity component.</p>
      
      <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
        Toggle Sidebar
      </button>
      
      <div style={{ display: 'flex' }}>
        <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
          <Sidebar />
        </Activity>
        
        <main className="main-content">
          <h3>Main Content</h3>
          <p>This is the main content area.</p>
        </main>
      </div>
      
      <pre>{`
import { unstable_Activity as Activity, useState } from 'react';

function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);
  
  return (
    <>
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>
      
      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
      `}</pre>
    </div>
  );
}

// Example 8: Server-Side Rendering Simulation
function SSRExample() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <div>
      <h2>Server-Side Rendering</h2>
      <p>Demonstrates SSR concepts and hydration.</p>
      
      <div className="ssr-demo">
        <p>Rendered on server: {!isClient ? 'Yes' : 'No'}</p>
        <p>Hydrated on client: {isClient ? 'Yes' : 'No'}</p>
      </div>
      
      <pre>{`
// Server-side
import { renderToString } from 'react-dom/server';
import App from './App';

const html = renderToString(<App />);

// Client-side hydration
import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(document.getElementById('root'), <App />);
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function ReactDOMExamples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicCreateRootExample, title: "Basic createRoot" },
    { component: FormWithStatus, title: "useFormStatus" },
    { component: ResourcePreloadingExample, title: "Resource Preloading" },
    { component: UseIdExample, title: "useId Hook" },
    { component: UseLayoutEffectExample, title: "useLayoutEffect" },
    { component: ViewTransitionExample, title: "ViewTransition" },
    { component: ActivityExample, title: "Activity Component" },
    { component: SSRExample, title: "Server-Side Rendering" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="react-dom-examples">
      <h1>React DOM Examples</h1>
      <p>Comprehensive examples demonstrating React DOM features and APIs.</p>
      
      <div className="example-navigation">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => setActiveExample(index)}
            className={activeExample === index ? 'active' : ''}
          >
            {example.title}
          </button>
        ))}
      </div>
      
      <div className="example-content">
        <ActiveExampleComponent />
      </div>
      
      <div className="info-section">
        <h2>About React DOM</h2>
        <p>
          React DOM is the package that serves as the entry point to the DOM and server renderers for React. 
          It provides methods for rendering React components to the DOM, handling server-side rendering, 
          and managing various DOM-related utilities.
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>createRoot</strong>: Creates a React root for rendering components</li>
          <li><strong>useFormStatus</strong>: Hook for tracking form submission status</li>
          <li><strong>Resource APIs</strong>: preconnect, preload, preinit for optimizing resource loading</li>
          <li><strong>Server Rendering</strong>: renderToString, renderToPipeableStream for SSR</li>
          <li><strong>Experimental Features</strong>: ViewTransition, Activity for advanced UI patterns</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`npm install react react-dom`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`}</pre>
      </div>
    </div>
  );
}