# React DOM

React DOM serves as the glue between React components and the browser's DOM. It's responsible for rendering React components into the browser and efficiently updating the DOM when component state changes.

## Overview

React DOM provides DOM-specific methods that can be used at the top level of your application to enable an efficient way of managing DOM updates.

## Key Features

- **Efficient DOM Updates**: Uses a virtual DOM to minimize actual DOM manipulations
- **Server-Side Rendering**: Supports rendering components on the server
- **Event Handling**: Provides a cross-browser event system
- **Hydration**: Attaches React to existing server-rendered markup

## Installation

```bash
# Using npm
npm install react-dom

# Using yarn
yarn add react-dom

# Using pnpm
pnpm add react-dom
```

## Basic Usage

### Client-Side Rendering

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>This is a React application.</p>
    </div>
  );
}

// Create a root
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Initial render
root.render(<App />);
```

### Server-Side Rendering

```jsx
import ReactDOMServer from 'react-dom/server';
import App from './App';

// Render to static HTML
const html = ReactDOMServer.renderToString(<App />);

// Render to static markup (without data-reactid attributes)
const htmlMarkup = ReactDOMServer.renderToStaticMarkup(<App />);
```

### Hydration

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Hydrate a server-rendered application
const container = document.getElementById('root');
const root = ReactDOM.hydrateRoot(container, <App />);
```

## API Reference

### ReactDOM.createRoot(container[, options])

Creates a React root and returns the root object.

```jsx
const root = ReactDOM.createRoot(
  document.getElementById('root'),
  {
    identifierPrefix: 'react_',
    onRecoverableError: (error) => console.log(error),
  }
);
```

### root.render(children)

Renders a React element into the root's DOM node.

```jsx
root.render(<App name="React" />);
```

### root.unmount()

Unmounts the component that was rendered with this root.

```jsx
root.unmount();
```

### ReactDOM.hydrateRoot(container, element[, options])

Same as `createRoot()`, but is used to hydrate a container whose HTML contents were rendered by `ReactDOMServer`.

```jsx
const root = ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

### ReactDOMServer Methods

#### renderToString(element)

Render a React element to its initial HTML.

```jsx
import ReactDOMServer from 'react-dom/server';

const html = ReactDOMServer.renderToString(<App />);
```

#### renderToStaticMarkup(element)

Similar to `renderToString`, but without creating extra DOM attributes that React uses internally.

```jsx
const html = ReactDOMServer.renderToStaticMarkup(<App />);
```

#### renderToNodeStream(element)

Render a React element to its initial HTML. Returns a Readable stream that outputs an HTML string.

```jsx
import ReactDOMServer from 'react-dom/server';

const stream = ReactDOMServer.renderToNodeStream(<App />);
stream.pipe(res);
```

## Event Handling

React DOM provides a synthetic event system that wraps the browser's native events.

```jsx
function Button() {
  const handleClick = (event) => {
    console.log('Button clicked!', event);
    // event is a SyntheticEvent
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## Portals

Portals provide a way to render children into a DOM node that exists outside the hierarchy of the parent component.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

function Modal({ children }) {
  const modalRoot = document.getElementById('modal-root');
  
  return ReactDOM.createPortal(
    children,
    modalRoot
  );
}

function App() {
  return (
    <div>
      <h1>My App</h1>
      <Modal>
        <div className="modal">
          This is rendered in a different DOM node!
        </div>
      </Modal>
    </div>
  );
}
```

## Best Practices

1. **Use createRoot() instead of ReactDOM.render()** (React 18+)
2. **Leverage Suspense for data fetching** with concurrent features
3. **Use portals for modals and tooltips** that need to break out of container
4. **Implement error boundaries** to catch rendering errors
5. **Consider server-side rendering** for better performance and SEO

## Migration from Legacy API

### Before (React 17 and below)
```jsx
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));
```

### After (React 18+)
```jsx
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

## Resources

- [React DOM Documentation](https://reactjs.org/docs/react-dom.html)
- [React 18 Migration Guide](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html)
- [Server-Side Rendering Guide](https://reactjs.org/docs/react-dom-server.html)