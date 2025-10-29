/**
 * Parcel Examples
 * 
 * Parcel is a zero-configuration web application bundler that offers a fast,
 * streamlined development experience. It automatically transforms your assets
 * without any configuration.
 */

// Example 1: Basic Parcel setup
/*
// package.json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "parcel": "^2.8.0"
  }
}
*/

// Example 2: Entry point HTML file
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React Parcel App</title>
</head>
<body>
  <div id="root"></div>
  <!-- Parcel will automatically process this script -->
  <script src="./src/index.jsx"></script>
</body>
</html>
*/

// Example 3: React entry point
/*
// src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
*/

// Example 4: Using CSS modules with Parcel
/*
// src/components/Button.jsx
import React from 'react';
import styles from './Button.module.css';

function Button({ children, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
*/

// Example 5: Using SCSS with Parcel
/*
// src/styles/main.scss
$primary-color: #3498db;
$secondary-color: #2ecc71;

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: $primary-color;
}

.button {
  padding: 10px 20px;
  background-color: $secondary-color;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
*/

// Example 6: Using images and assets
/*
// src/components/Image.jsx
import React from 'react';
import logo from '../assets/logo.png';

function Logo() {
  return (
    <img 
      src={logo} 
      alt="Company Logo" 
      style={{ width: '200px', height: 'auto' }}
    />
  );
}

export default Logo;
*/

// Example 7: Environment variables with Parcel
/*
// .env file
API_URL=https://api.example.com
DEBUG_MODE=true

// src/config/api.js
const apiUrl = process.env.API_URL;
const debugMode = process.env.DEBUG_MODE === 'true';

export { apiUrl, debugMode };
*/

// Example 8: Custom Parcel configuration
/*
// .parcelrc
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.svg": ["@parcel/transformer-svg-react"]
  },
  "bundler": "@parcel/bundler-default",
  "resolvers": ["@parcel/resolver-default"],
  "runners": ["@parcel/runner-default"],
  "namers": ["@parcel/namer-default"],
  "packagers": ["@parcel/packager-default"],
  "optimizers": ["@parcel/optimizer-default"],
  "reporters": ["@parcel/reporter-dev-server"]
}
*/

// Example 9: Using TypeScript with Parcel
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
    "jsx": "react-jsx"
  },
  "include": ["src"]
}

// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

// src/components/UserCard.tsx
import React from 'react';
import { User } from '../types';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
};

export default UserCard;
*/

// Example 10: Production build configuration
/*
// package.json scripts
{
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html --public-url ./",
    "build:report": "parcel build index.html --reporter @parcel/reporter-bundle-analyzer",
    "serve": "parcel serve dist/index.html"
  }
}
*/

// Example 11: Using plugins with Parcel
/*
// package.json
{
  "devDependencies": {
    "parcel": "^2.8.0",
    "@parcel/plugin": "^2.8.0",
    "@parcel/transformer-svg-react": "^2.8.0"
  }
}

// Using SVG as React component
import ReactIcon from './assets/react.svg';

function App() {
  return (
    <div>
      <ReactIcon width={100} height={100} />
    </div>
  );
}
*/

// Example 12: Code splitting with dynamic imports
/*
// src/App.jsx
import React, { lazy, Suspense } from 'react';

// Lazy load the About component
const About = lazy(() => import('./components/About'));

function App() {
  const [showAbout, setShowAbout] = React.useState(false);

  return (
    <div>
      <h1>My App</h1>
      <button onClick={() => setShowAbout(true)}>
        Load About Page
      </button>
      
      {showAbout && (
        <Suspense fallback={<div>Loading...</div>}>
          <About />
        </Suspense>
      )}
    </div>
  );
}

export default App;
*/

export const parcelExamples = {
  description: "Examples of using Parcel as a zero-configuration bundler for React projects",
  setup: "npm install parcel --save-dev",
  commands: {
    start: "parcel index.html",
    build: "parcel build index.html",
    serve: "parcel serve dist/index.html"
  },
  features: [
    "Zero configuration required",
    "Automatic code splitting",
    "Hot module replacement",
    "Built-in support for TypeScript, SCSS, CSS modules",
    "Asset optimization",
    "Development server"
  ]
};