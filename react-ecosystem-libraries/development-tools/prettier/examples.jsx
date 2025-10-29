import React, { useState } from 'react';

const PrettierExamples = () => {
  const [selectedExample, setSelectedExample] = useState('basics');
  const [projectName, setProjectName] = useState('my-react-app');
  const [result, setResult] = useState('');

  const renderBasicsExamples = () => (
    <div className="example-section">
      <h3>Basic Configuration</h3>
      <div className="code-example">
        <pre>{`// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}

// .prettierrc.json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}

// .prettierrc.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="input-group">
          <label>Project Name:</label>
          <input 
            type="text" 
            value={projectName} 
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />
        </div>
        <div className="button-group">
          <button onClick={() => {
            setResult(`{\n  "semi": true,\n  "trailingComma": "es5",\n  "singleQuote": true,\n  "printWidth": 80,\n  "tabWidth": 2,\n  "useTabs": false,\n  "bracketSpacing": true,\n  "arrowParens": "avoid"\n}`);
          }}>
            Generate Basic Config
          </button>
          <button onClick={() => {
            setResult(`# Prettier setup for ${projectName}:\n1. npm install prettier --save-dev\n2. Create .prettierrc file\n3. Add format script: "prettier --write src/**/*.{js,jsx}"\n4. Run: npm run format`);
          }}>
            Show Setup Process
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderFormattingExamples = () => (
    <div className="example-section">
      <h3>Formatting Options</h3>
      <div className="code-example">
        <pre>{`// Before formatting
function hello(name){
    console.log('Hello, '+name+'!')
}

// After formatting with Prettier
function hello(name) {
  console.log('Hello, ' + name + '!');
}

// Object formatting
const user={name:'John',age:30,city:'New York'}

// After formatting
const user = {
  name: 'John',
  age: 30,
  city: 'New York',
};

// Array formatting
const fruits=['apple','banana','orange']

// After formatting
const fruits = ['apple', 'banana', 'orange'];

// Template literals
const message=\`Hello,
World!`

// After formatting
const message = \`Hello,
World!\`;`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`// Before formatting:\nfunction hello(name){\n    console.log('Hello, '+name+'!')\n}\n\n// After formatting with Prettier:\nfunction hello(name) {\n  console.log('Hello, ' + name + '!');\n}`);
          }}>
            Show Function Formatting
          </button>
          <button onClick={() => {
            setResult(`// Before formatting:\nconst user={name:'John',age:30,city:'New York'}\n\n// After formatting:\nconst user = {\n  name: 'John',\n  age: 30,\n  city: 'New York',\n};`);
          }}>
            Show Object Formatting
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderIntegrationExamples = () => (
    <div className="example-section">
      <h3>Integration with Tools</h3>
      <div className="code-example">
        <pre>{`// Prettier with ESLint
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};

// package.json scripts
{
  "scripts": {
    "format": "prettier --write src/**/*.{js,jsx}",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}

// Prettier with Husky
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "prettier --write",
      "eslint --fix",
      "git add"
    ]
  }
}

// Prettier with VS Code
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.configPath": ".prettierrc"
}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`// .eslintrc.js with Prettier:\nmodule.exports = {\n  extends: [\n    'eslint:recommended',\n    'prettier',\n  ],\n  plugins: ['prettier'],\n  rules: {\n    'prettier/prettier': 'error',\n  },\n};`);
          }}>
            Generate ESLint Integration
          </button>
          <button onClick={() => {
            setResult(`// package.json with Prettier scripts:\n{\n  "scripts": {\n    "format": "prettier --write src/**/*.{js,jsx}",\n    "lint": "eslint src/",\n    "lint:fix": "eslint src/ --fix"\n  }\n}`);
          }}>
            Generate Scripts
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderIgnoreExamples = () => (
    <div className="example-section">
      <h3>Ignore Files</h3>
      <div className="code-example">
        <pre>{`// .prettierignore
node_modules/
dist/
build/
coverage/
*.min.js
*.bundle.js
package-lock.json

# Ignore specific files
src/legacy/
vendor/
third-party/

# Ignore file patterns
*.config.js
*.config.ts
.env.*

# Ignore directories
public/
assets/
logs/

# Comments in .prettierignore
# Ignore build files
dist/
build/

# Ignore dependencies
node_modules/`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# .prettierignore for ${projectName}:\nnode_modules/\ndist/\nbuild/\ncoverage/\n*.min.js\n*.bundle.js\npackage-lock.json`);
          }}>
            Generate Basic Ignore
          </button>
          <button onClick={() => {
            setResult(`# Advanced .prettierignore for ${projectName}:\nnode_modules/\ndist/\nbuild/\ncoverage/\n*.min.js\n*.bundle.js\npackage-lock.json\nsrc/legacy/\nvendor/\nthird-party/\n*.config.js\n*.config.ts\n.env.*`);
          }}>
            Generate Advanced Ignore
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderCLIExamples = () => (
    <div className="example-section">
      <h3>CLI Usage</h3>
      <div className="code-example">
        <pre>{`// Format files
npx prettier --write src/
npx prettier --write "src/**/*.js"
npx prettier --write src/index.js

// Check formatting
npx prettier --check src/
npx prettier --check "src/**/*.js"

// Different output formats
npx prettier --check src/ --format json
npx prettier --check src/ --format junit

// Use config file
npx prettier --write src/ --config .prettierrc
npx prettier --write src/ --config .prettierrc.json

// Ignore files
npx prettier --write src/ --ignore-path .prettierignore

// List supported files
npx prettier --list-different

// Debug info
npx prettier --debug-check src/`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Format commands for ${projectName}:\nnpx prettier --write src/\nnpx prettier --write "src/**/*.js"\nnpx prettier --check src/\nnpx prettier --check "src/**/*.js"`);
          }}>
            Generate Format Commands
          </button>
          <button onClick={() => {
            setResult(`# Advanced commands for ${projectName}:\nnpx prettier --write src/ --config .prettierrc\nnpx prettier --check src/ --format json\nnpx prettier --list-different\nnpx prettier --debug-check src/`);
          }}>
            Generate Advanced Commands
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderLanguageExamples = () => (
    <div className="example-section">
      <h3>Language Support</h3>
      <div className="code-example">
        <pre>{`// JavaScript/JSX
// .prettierrc
{
  "parser": "babel",
  "semi": true,
  "singleQuote": true
}

// TypeScript
{
  "parser": "typescript",
  "semi": true,
  "singleQuote": true
}

// JSON
{
  "parser": "json",
  "tabWidth": 2
}

// CSS
{
  "parser": "css",
  "singleQuote": false
}

// Markdown
{
  "parser": "markdown",
  "proseWrap": "always",
  "printWidth": 80
}

// Vue
{
  "parser": "vue",
  "semi": false,
  "singleQuote": true
}

// Multiple parsers
{
  "overrides": [
    {
      "files": "*.js",
      "options": {
        "parser": "babel",
        "semi": true
      }
    },
    {
      "files": "*.css",
      "options": {
        "parser": "css",
        "singleQuote": false
      }
    }
  ]
}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`{\n  "parser": "babel",\n  "semi": true,\n  "singleQuote": true,\n  "printWidth": 80,\n  "tabWidth": 2\n}`);
          }}>
            Generate JavaScript Config
          </button>
          <button onClick={() => {
            setResult(`{\n  "parser": "typescript",\n  "semi": true,\n  "singleQuote": true,\n  "printWidth": 80,\n  "tabWidth": 2\n}`);
          }}>
            Generate TypeScript Config
          </button>
          <button onClick={() => {
            setResult(`{\n  "overrides": [\n    {\n      "files": "*.js",\n      "options": {\n        "parser": "babel",\n        "semi": true\n      }\n    },\n    {\n      "files": "*.css",\n      "options": {\n        "parser": "css",\n        "singleQuote": false\n      }\n    }\n  ]\n}`);
          }}>
            Generate Multi-language Config
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  return (
    <div className="library-examples">
      <h2>Prettier Examples</h2>
      <p>Prettier is an opinionated code formatter that supports many languages and integrates with most editors.</p>
      
      <div className="example-navigation">
        <button 
          className={selectedExample === 'basics' ? 'active' : ''}
          onClick={() => setSelectedExample('basics')}
        >
          Basics
        </button>
        <button 
          className={selectedExample === 'formatting' ? 'active' : ''}
          onClick={() => setSelectedExample('formatting')}
        >
          Formatting
        </button>
        <button 
          className={selectedExample === 'integration' ? 'active' : ''}
          onClick={() => setSelectedExample('integration')}
        >
          Integration
        </button>
        <button 
          className={selectedExample === 'ignore' ? 'active' : ''}
          onClick={() => setSelectedExample('ignore')}
        >
          Ignore
        </button>
        <button 
          className={selectedExample === 'cli' ? 'active' : ''}
          onClick={() => setSelectedExample('cli')}
        >
          CLI
        </button>
        <button 
          className={selectedExample === 'language' ? 'active' : ''}
          onClick={() => setSelectedExample('language')}
        >
          Languages
        </button>
      </div>

      <div className="example-content">
        {selectedExample === 'basics' && renderBasicsExamples()}
        {selectedExample === 'formatting' && renderFormattingExamples()}
        {selectedExample === 'integration' && renderIntegrationExamples()}
        {selectedExample === 'ignore' && renderIgnoreExamples()}
        {selectedExample === 'cli' && renderCLIExamples()}
        {selectedExample === 'language' && renderLanguageExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install prettier --save-dev</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://prettier.io/" target="_blank" rel="noopener noreferrer">Official Website</a></li>
          <li><a href="https://prettier.io/docs/en/options.html" target="_blank" rel="noopener noreferrer">Options Documentation</a></li>
          <li><a href="https://github.com/prettier/prettier" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default PrettierExamples;