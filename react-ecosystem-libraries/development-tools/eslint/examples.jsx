import React, { useState } from 'react';

const ESLintExamples = () => {
  const [selectedExample, setSelectedExample] = useState('basics');
  const [projectName, setProjectName] = useState('my-react-app');
  const [result, setResult] = useState('');

  const renderBasicsExamples = () => (
    <div className="example-section">
      <h3>Basic Configuration</h3>
      <div className="code-example">
        <pre>{`// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'no-undef': 'error',
  },
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
            setResult(`module.exports = {\n  env: {\n    browser: true,\n    es2021: true,\n    node: true,\n  },\n  extends: [\n    'eslint:recommended',\n  ],\n  parserOptions: {\n    ecmaVersion: 'latest',\n    sourceType: 'module',\n    ecmaFeatures: {\n      jsx: true,\n    },\n  },\n  rules: {\n    'no-console': 'warn',\n    'no-unused-vars': 'error',\n    'no-undef': 'error',\n  },\n};`);
          }}>
            Generate Basic Config
          </button>
          <button onClick={() => {
            setResult(`# ESLint setup for ${projectName}:\n1. npm install eslint --save-dev\n2. npx eslint --init\n3. Follow the prompts\n4. Add lint script: "eslint src/"\n5. Run: npm run lint`);
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

  const renderReactExamples = () => (
    <div className="example-section">
      <h3>React Configuration</h3>
      <div className="code-example">
        <pre>{`// .eslintrc.js for React
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/prop-types': 'error',
    'react/react-in-jsx-scope': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`module.exports = {\n  env: {\n    browser: true,\n    es2021: true,\n  },\n  extends: [\n    'eslint:recommended',\n    'plugin:react/recommended',\n    'plugin:react-hooks/recommended',\n  ],\n  plugins: [\n    'react',\n    'react-hooks',\n  ],\n  settings: {\n    react: {\n      version: 'detect',\n    },\n  },\n  rules: {\n    'react/prop-types': 'error',\n    'react/react-in-jsx-scope': 'error',\n    'react-hooks/rules-of-hooks': 'error',\n    'react-hooks/exhaustive-deps': 'warn',\n  },\n};`);
          }}>
            Generate React Config
          </button>
          <button onClick={() => {
            setResult(`# React + ESLint dependencies for ${projectName}:\nnpm install eslint --save-dev\nnpm install eslint-plugin-react eslint-plugin-react-hooks --save-dev\nnpm install eslint-config-react-app --save-dev`);
          }}>
            Show Dependencies
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderRulesExamples = () => (
    <div className="example-section">
      <h3>Custom Rules</h3>
      <div className="code-example">
        <pre>{`// Custom Rules Configuration
module.exports = {
  rules: {
    // Error level rules
    'no-console': 'error',
    'no-debugger': 'error',
    'no-unused-vars': 'error',
    
    // Warning level rules
    'no-empty': 'warn',
    'no-extra-semi': 'warn',
    
    // Off rules
    'no-multiple-empty-lines': 'off',
    
    // Custom rule configurations
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'max-len': ['error', { code: 80 }],
    
    // Object style rules
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
    
    // Function rules
    'func-call-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
  },
};`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`rules: {\n  'quotes': ['error', 'single'],\n  'semi': ['error', 'always'],\n  'indent': ['error', 2],\n  'max-len': ['error', { code: 80 }],\n  'no-console': 'warn',\n  'no-unused-vars': 'error',\n},`);
          }}>
            Generate Style Rules
          </button>
          <button onClick={() => {
            setResult(`rules: {\n  'object-curly-spacing': ['error', 'always'],\n  'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],\n  'func-call-spacing': ['error', 'never'],\n  'space-before-function-paren': ['error', 'never'],\n  'no-multiple-empty-lines': 'off',\n},`);
          }}>
            Generate Formatting Rules
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
        <pre>{`// ESLint with Prettier
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

// ESLint with TypeScript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
  },
};

// ESLint with Jest
module.exports = {
  env: {
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
  ],
  plugins: ['jest'],
  rules: {
    'jest/expect-expect': 'error',
    'jest/no-disabled-tests': 'warn',
  },
};`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`module.exports = {\n  extends: [\n    'eslint:recommended',\n    'prettier',\n  ],\n  plugins: ['prettier'],\n  rules: {\n    'prettier/prettier': 'error',\n  },\n};`);
          }}>
            Generate Prettier Integration
          </button>
          <button onClick={() => {
            setResult(`module.exports = {\n  parser: '@typescript-eslint/parser',\n  extends: [\n    'eslint:recommended',\n    'plugin:@typescript-eslint/recommended',\n  ],\n  plugins: ['@typescript-eslint'],\n  rules: {\n    '@typescript-eslint/no-unused-vars': 'error',\n    '@typescript-eslint/explicit-function-return-type': 'warn',\n  },\n};`);
          }}>
            Generate TypeScript Integration
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderScriptsExamples = () => (
    <div className="example-section">
      <h3>Package.json Scripts</h3>
      <div className="code-example">
        <pre>{`// package.json scripts
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "lint:quiet": "eslint src/ --quiet",
    "lint:cache": "eslint src/ --cache",
    "lint:staged": "lint-staged",
    "lint:all": "eslint src/ --ext .js,.jsx,.ts,.tsx",
    "lint:report": "eslint src/ --format json --output-file eslint-report.json"
  }
}

// Lint specific files
npx eslint src/components/Button.js
npx eslint src/**/*.js
npx eslint src/ --ext .js,.jsx

// Lint with different output formats
npx eslint src/ --format compact
npx eslint src/ --format json
npx eslint src/ --format stylish

// Lint with auto-fix
npx eslint src/ --fix
npx eslint src/ --fix-dry-run`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`{\n  "scripts": {\n    "lint": "eslint src/",\n    "lint:fix": "eslint src/ --fix",\n    "lint:quiet": "eslint src/ --quiet",\n    "lint:cache": "eslint src/ --cache",\n    "lint:staged": "lint-staged",\n  }\n}`);
          }}>
            Generate Scripts
          </button>
          <button onClick={() => {
            setResult(`# ESLint commands for ${projectName}:\nnpx eslint src/components/Button.js\nnpx eslint src/**/*.js\nnpx eslint src/ --ext .js,.jsx\nnpx eslint src/ --format compact\nnpx eslint src/ --fix`);
          }}>
            Show CLI Commands
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
        <pre>{`// .eslintignore
node_modules/
dist/
build/
coverage/
*.min.js
*.bundle.js
public/

# Ignore specific patterns
src/**/*.test.js
src/**/*.spec.js
src/legacy/**

# Ignore files in specific directories
src/vendor/
src/third-party/

# Ignore multiple file types
*.config.js
*.config.ts
.env.*

# Ignore files with comments
# This is a comment
build/
dist/`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# .eslintignore for ${projectName}:\nnode_modules/\ndist/\nbuild/\ncoverage/\n*.min.js\n*.bundle.js\npublic/\nsrc/**/*.test.js\nsrc/**/*.spec.js`);
          }}>
            Generate Basic Ignore
          </button>
          <button onClick={() => {
            setResult(`# Advanced .eslintignore for ${projectName}:\nnode_modules/\ndist/\nbuild/\ncoverage/\n*.min.js\n*.bundle.js\npublic/\nsrc/vendor/\nsrc/third-party/\n*.config.js\n*.config.ts\n.env.*`);
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

  return (
    <div className="library-examples">
      <h2>ESLint Examples</h2>
      <p>ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.</p>
      
      <div className="example-navigation">
        <button 
          className={selectedExample === 'basics' ? 'active' : ''}
          onClick={() => setSelectedExample('basics')}
        >
          Basics
        </button>
        <button 
          className={selectedExample === 'react' ? 'active' : ''}
          onClick={() => setSelectedExample('react')}
        >
          React
        </button>
        <button 
          className={selectedExample === 'rules' ? 'active' : ''}
          onClick={() => setSelectedExample('rules')}
        >
          Rules
        </button>
        <button 
          className={selectedExample === 'integration' ? 'active' : ''}
          onClick={() => setSelectedExample('integration')}
        >
          Integration
        </button>
        <button 
          className={selectedExample === 'scripts' ? 'active' : ''}
          onClick={() => setSelectedExample('scripts')}
        >
          Scripts
        </button>
        <button 
          className={selectedExample === 'ignore' ? 'active' : ''}
          onClick={() => setSelectedExample('ignore')}
        >
          Ignore
        </button>
      </div>

      <div className="example-content">
        {selectedExample === 'basics' && renderBasicsExamples()}
        {selectedExample === 'react' && renderReactExamples()}
        {selectedExample === 'rules' && renderRulesExamples()}
        {selectedExample === 'integration' && renderIntegrationExamples()}
        {selectedExample === 'scripts' && renderScriptsExamples()}
        {selectedExample === 'ignore' && renderIgnoreExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install eslint --save-dev</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://eslint.org/" target="_blank" rel="noopener noreferrer">Official Website</a></li>
          <li><a href="https://eslint.org/docs/rules/" target="_blank" rel="noopener noreferrer">Rules Documentation</a></li>
          <li><a href="https://github.com/eslint/eslint" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ESLintExamples;