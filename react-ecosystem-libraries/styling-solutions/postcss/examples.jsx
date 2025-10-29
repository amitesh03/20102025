import React, { useState } from 'react';

// PostCSS Examples - Educational Examples for PostCSS
// Note: PostCSS is a tool for transforming CSS with JavaScript plugins

export default function PostCSSExamples() {
  const [activeExample, setActiveExample] = useState('basic-setup');

  return (
    <div className="examples-container">
      <h1>PostCSS Examples</h1>
      <p className="intro">
        PostCSS is a tool for transforming CSS with JavaScript plugins. It allows you to use modern CSS features, variables, mixins, and more, while maintaining compatibility with older browsers.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('basic-setup')} className={activeExample === 'basic-setup' ? 'active' : ''}>
          Basic Setup
        </button>
        <button onClick={() => setActiveExample('plugins')} className={activeExample === 'plugins' ? 'active' : ''}>
          Plugins
        </button>
        <button onClick={() => setActiveExample('custom-plugins')} className={activeExample === 'custom-plugins' ? 'active' : ''}>
          Custom Plugins
        </button>
        <button onClick={() => setActiveExample('nesting')} className={activeExample === 'nesting' ? 'active' : ''}>
          Nesting
        </button>
        <button onClick={() => setActiveExample('variables')} className={activeExample === 'variables' ? 'active' : ''}>
          Variables
        </button>
        <button onClick={() => setActiveExample('mixins')} className={activeExample === 'mixins' ? 'active' : ''}>
          Mixins
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'basic-setup' && <BasicSetupExample />}
        {activeExample === 'plugins' && <PluginsExample />}
        {activeExample === 'custom-plugins' && <CustomPluginsExample />}
        {activeExample === 'nesting' && <NestingExample />}
        {activeExample === 'variables' && <VariablesExample />}
        {activeExample === 'mixins' && <MixinsExample />}
      </div>
    </div>
  );
}

// Basic Setup Example
function BasicSetupExample() {
  return (
    <div className="example-section">
      <h2>Basic Setup with PostCSS</h2>
      <p>Setting up PostCSS in your project.</p>
      
      <div className="code-block">
        <h3>Installation</h3>
        <pre>
{`# Install PostCSS CLI
npm install postcss postcss-cli --save-dev

# Install PostCSS with build tools
npm install postcss --save-dev
npm install postcss-loader --save-dev  # For Webpack
npm install @postcss/webpack --save-dev  # Alternative for Webpack
npm install postcss-preset-env --save-dev  # For modern CSS features`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Configuration</h3>
        <pre>
{`// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-preset-env'),
    require('autoprefixer'),
  ],
};

// For modern JavaScript
// postcss.config.js
export default {
  plugins: [
    require('postcss-preset-env'),
    require('autoprefixer'),
  ],
};

// With options
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 3, // Enable CSS features from stage 3 and earlier
      features: {
        'nesting-rules': true,
        'custom-properties': true,
      },
      browsers: ['> 1%', 'last 2 versions'],
    }),
    require('autoprefixer')({
      grid: true, // Enable autoprefixing for CSS Grid
    }),
  ],
};`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Package.json Scripts</h3>
        <pre>
{`{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "build:css": "postcss src/styles.css -o dist/styles.css",
    "watch:css": "postcss src/styles.css -o dist/styles.css -w",
    "build": "npm run build:css && npm run build:js"
  },
  "devDependencies": {
    "postcss": "^8.4.0",
    "postcss-cli": "^10.0.0",
    "postcss-preset-env": "^9.0.0",
    "autoprefixer": "^10.4.0"
  }
}`}
        </pre>
      </div>
    </div>
  );
}

// Plugins Example
function PluginsExample() {
  return (
    <div className="example-section">
      <h2>PostCSS Plugins</h2>
      <p>Using popular PostCSS plugins.</p>
      
      <div className="code-block">
        <h3>PostCSS Preset Env</h3>
        <pre>
{`// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 3, // Enable CSS features from stage 3 and earlier
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-media-queries': true,
      },
      browsers: ['> 1%', 'last 2 versions'],
    }),
  ],
};

// Input CSS (src/styles.css)
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size-base: 16px;
}

.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.card {
  background-color: var(--primary-color);
  color: white;
  padding: 16px;
  border-radius: 8px;
}

// Output CSS (dist/styles.css)
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size-base: 16px;
}

.container {
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: (1fr)[auto-fit];
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.card {
  background-color: #007bff;
  color: white;
  padding: 16px;
  border-radius: 8px;
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Autoprefixer</h3>
        <pre>
{`// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')({
      grid: true, // Enable autoprefixing for CSS Grid
      flexbox: 'no-2009', // Don't prefix flexbox 2009 syntax
    }),
  ],
};

// Input CSS (src/styles.css)
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

// Output CSS (dist/styles.css)
.container {
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: (1fr)[auto-fit];
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.card {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>CSS Modules</h3>
        <pre>
{`// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-modules')({
      generateScopedName: function (name, filename, css) {
        const path = require('path');
        const file = path.basename(filename, '.css');
        
        // If this is a CSS module, create a unique class name
        if (file.includes('.module.')) {
          return \`\${name}__\${Math.random().toString(36).substr(2, 9)}\`;
        }
        
        return name;
      },
    }),
  ],
};

// Input CSS (src/components/Button.module.css)
.button {
  background-color: var(--primary-color);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

// Input JavaScript (src/components/Button.js)
import styles from './Button.module.css';

function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}

// Output CSS (dist/components/Button.module.css)
.button__a1b2c3d {
  background-color: var(--primary-color);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`}
        </pre>
      </div>
    </div>
  );
}

// Custom Plugins Example
function CustomPluginsExample() {
  return (
    <div className="example-section">
      <h2>Custom PostCSS Plugins</h2>
      <p>Creating custom PostCSS plugins.</p>
      
      <div className="code-block">
        <h3>Basic Plugin Structure</h3>
        <pre>
{`// my-plugin.js
module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'my-plugin',
    Once(root, { result }) {
      // Process the CSS root
      root.walkRules(rule => {
        // Transform each rule
        if (rule.selector === '.custom') {
          rule.walkDecls(decl => {
            // Transform each declaration
            if (decl.prop === 'color') {
              decl.value = transformColor(decl.value);
            }
          });
        }
      });
    },
  };
};

// Transform function
function transformColor(value) {
  // Custom color transformation logic
  if (value === 'primary') {
    return '#007bff';
  }
  return value;
}

// postcss.config.js
module.exports = {
  plugins: [
    require('./my-plugin')({
      // Plugin options
      customOption: true,
    }),
  ],
};`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Plugin for Custom Properties</h3>
        <pre>
{`// custom-properties.js
module.exports = () => {
  return {
    postcssPlugin: 'custom-properties',
    Once(root, { result }) {
      // Define custom properties
      const customProperties = {
        '--theme-primary': '#007bff',
        '--theme-secondary': '#6c757d',
        '--theme-background': '#ffffff',
        '--theme-text': '#333333',
      };
      
      // Add custom properties to the root
      root.walkRules(rule => {
        if (rule.selector === ':root') {
          Object.entries(customProperties).forEach(([prop, value]) => {
            rule.append({ prop, value });
          });
        }
      });
    },
  };
};

// postcss.config.js
module.exports = {
  plugins: [
    require('./custom-properties')(),
  ],
};

// Input CSS (src/styles.css)
:root {
  /* Custom properties will be added here */
}

.container {
  background-color: var(--theme-background);
  color: var(--theme-text);
}

.button {
  background-color: var(--theme-primary);
  color: white;
}

// Output CSS (dist/styles.css)
:root {
  --theme-primary: #007bff;
  --theme-secondary: #6c757d;
  --theme-background: #ffffff;
  --theme-text: #333333;
}

.container {
  background-color: var(--theme-background);
  color: var(--theme-text);
}

.button {
  background-color: var(--theme-primary);
  color: white;
}`}
        </pre>
      </div>
    </div>
  );
}

// Nesting Example
function NestingExample() {
  return (
    <div className="example-section">
      <h2>Nesting with PostCSS</h2>
      <p>Using nesting features with PostCSS.</p>
      
      <div className="code-block">
        <h3>PostCSS Preset Env Nesting</h3>
        <pre>
{`// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 3, // Enable CSS features from stage 3 and earlier
      features: {
        'nesting-rules': true,
      },
    }),
  ],
};

// Input CSS (src/styles.css)
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  
  &__header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  &__content {
    color: #666;
    line-height: 1.5;
  }
  
  &__footer {
    margin-top: 16px;
    padding-top: 8px;
    border-top: 1px solid #eee;
  }
}

.nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  
  &__item {
    margin-right: 16px;
    
    &:last-child {
      margin-right: 0;
    }
    
    &__link {
      color: #333;
      text-decoration: none;
      
      &:hover {
        color: #007bff;
      }
    }
  }
}

// Output CSS (dist/styles.css)
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.card__header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card__content {
  color: #666;
  line-height: 1.5;
}

.card__footer {
  margin-top: 16px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__item {
  margin-right: 16px;
}

.nav__item:last-child {
  margin-right: 0;
}

.nav__item__link {
  color: #333;
  text-decoration: none;
}

.nav__item__link:hover {
  color: #007bff;
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>PostCSS Nesting Plugin</h3>
        <pre>
{`// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-nested')({
      // Plugin options
      bubble: ['screen'], // Bubble screen at-rules to the top
      preserveEmpty: false, // Remove empty rules
    }),
  ],
};

// Input CSS (src/styles.css)
.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  
  &__header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  &__content {
    color: #666;
    line-height: 1.5;
  }
}

// Output CSS (dist/styles.css)
.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.card__header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card__content {
  color: #666;
  line-height: 1.5;
}`}
        </pre>
      </div>
    </div>
  );
}

// Variables Example
function VariablesExample() {
  return (
    <div className="example-section">
      <h2>Variables with PostCSS</h2>
      <p>Using CSS variables with PostCSS.</p>
      
      <div className="code-block">
        <h3>CSS Custom Properties</h3>
        <pre>
{`// Input CSS (src/styles.css)
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #ffffff;
  --text-color: #333333;
  --font-size-base: 16px;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

.container {
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: var(--font-size-base);
  padding: calc(var(--spacing-unit) * 2);
}

.button {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-unit) calc(var(--spacing-unit) * 2);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.button--secondary {
  background-color: var(--secondary-color);
}

.card {
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: calc(var(--spacing-unit) * 2);
}

// Output CSS (dist/styles.css)
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #ffffff;
  --text-color: #333333;
  --font-size-base: 16px;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

.container {
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: var(--font-size-base);
  padding: calc(var(--spacing-unit) * 2);
}

.button {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-unit) calc(var(--spacing-unit) * 2);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.button--secondary {
  background-color: var(--secondary-color);
}

.card {
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: calc(var(--spacing-unit) * 2);
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>PostCSS Custom Properties Plugin</h3>
        <pre>
{`// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-custom-properties')({
      // Plugin options
      importFrom: 'variables.css', // Import variables from a file
      variables: { // Define variables directly
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        backgroundColor: '#ffffff',
        textColor: '#333333',
      },
    }),
  ],
};

// Input CSS (src/styles.css)
.container {
  background-color: var(--backgroundColor);
  color: var(--textColor);
}

.button {
  background-color: var(--primaryColor);
  color: white;
}

.button--secondary {
  background-color: var(--secondaryColor);
}

// Output CSS (dist/styles.css)
.container {
  background-color: #ffffff;
  color: #333333;
}

.button {
  background-color: #007bff;
  color: white;
}

.button--secondary {
  background-color: #6c757d;
}`}
        </pre>
      </div>
    </div>
  );
}

// Mixins Example
function MixinsExample() {
  return (
    <div className="example-section">
      <h2>Mixins with PostCSS</h2>
      <p>Creating and using mixins with PostCSS.</p>
      
      <div className="code-block">
        <h3>PostCSS Mixins Plugin</h3>
        <pre>
{`// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-mixins')({
      // Plugin options
      mixins: {
        clearfix: {
          '&::after': {
            content: '""',
            display: 'table',
            clear: 'both',
          },
        },
        center: {
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        },
        button: {
          padding: '8px 16px',
          border: 'none',
          'border-radius': '4px',
          cursor: 'pointer',
          'font-weight': 'bold',
        },
      },
    }),
  ],
};

// Input CSS (src/styles.css)
.container {
  @mixin clearfix;
}

.card {
  @mixin center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.button {
  @mixin button;
  background-color: #007bff;
  color: white;
}

.button--secondary {
  @mixin button;
  background-color: #6c757d;
}

// Output CSS (dist/styles.css)
.container::after {
  content: "";
  display: table;
  clear: both;
}

.card {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  background-color: #007bff;
  color: white;
}

.button--secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  background-color: #6c757d;
  color: white;
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>PostCSS Simple Variables Plugin</h3>
        <pre>
{`// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-simple-vars')({
      // Plugin options
      silent: false, // Show warnings
      variables: { // Define variables
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        spacing: '8px',
        borderRadius: '4px',
      },
    }),
  ],
};

// Input CSS (src/styles.css)
.container {
  background-color: $backgroundColor;
  color: $textColor;
}

.button {
  background-color: $primaryColor;
  color: white;
  padding: $spacing calc($spacing * 2);
  border-radius: $borderRadius;
}

.button--secondary {
  background-color: $secondaryColor;
}

// Output CSS (dist/styles.css)
.container {
  background-color: #ffffff;
  color: #333333;
}

.button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}

.button--secondary {
  background-color: #6c757d;
}`}
        </pre>
      </div>
    </div>
  );
}

// Add some basic styles for the examples
const style = document.createElement('style');
style.textContent = `
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.intro {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 30px;
}

.example-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.example-nav button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
}

.example-nav button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.example-content {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.example-section h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.code-block {
  margin: 20px 0;
}

.code-block h3 {
  color: #555;
  margin-bottom: 10px;
}

.code-block pre {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
}
`;
document.head.appendChild(style);