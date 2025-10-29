# Context7-Based Educational Examples Template

This template provides a structure for creating educational examples for React ecosystem libraries using Context7.

## Template Structure

```jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Note: These examples demonstrate [LIBRARY_NAME] concepts in a web-compatible format
// In a real app, you would install [LIBRARY_NAME] and use its actual features

// Example 1: Basic Setup
function BasicSetupExample() {
  const [state, setState] = useState(initialState);
  
  return (
    <div className="[library-name]-example">
      <h2>Basic Setup</h2>
      <p>Demonstrates basic [LIBRARY_NAME] setup and configuration.</p>
      
      {/* Interactive demo */}
      <div className="demo-section">
        {/* Demo content */}
      </div>
      
      <pre>{`
// [LIBRARY_NAME] Basic Setup:
import { [IMPORTS] } from '[LIBRARY_NAME]';

// Basic usage example
function BasicExample() {
  // Implementation code
  return (
    // JSX
  );
}
      `}</pre>
    </div>
  );
}

// Example 2: Core Features
function CoreFeaturesExample() {
  const [state, setState] = useState(initialState);
  
  return (
    <div className="[library-name]-example">
      <h2>Core Features</h2>
      <p>Demonstrates key features of [LIBRARY_NAME].</p>
      
      {/* Interactive demo */}
      <div className="demo-section">
        {/* Demo content */}
      </div>
      
      <pre>{`
// [LIBRARY_NAME] Core Features:
import { [IMPORTS] } from '[LIBRARY_NAME]';

// Core feature example
function FeatureExample() {
  // Implementation code
  return (
    // JSX
  );
}
      `}</pre>
    </div>
  );
}

// Example 3: Advanced Usage
function AdvancedUsageExample() {
  const [state, setState] = useState(initialState);
  
  return (
    <div className="[library-name]-example">
      <h2>Advanced Usage</h2>
      <p>Demonstrates advanced patterns and use cases.</p>
      
      {/* Interactive demo */}
      <div className="demo-section">
        {/* Demo content */}
      </div>
      
      <pre>{`
// [LIBRARY_NAME] Advanced Usage:
import { [IMPORTS] } from '[LIBRARY_NAME]';

// Advanced usage example
function AdvancedExample() {
  // Implementation code
  return (
    // JSX
  );
}
      `}</pre>
    </div>
  );
}

// Main component that combines all examples
export default function [LibraryName]Examples() {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    { component: BasicSetupExample, title: "Basic Setup" },
    { component: CoreFeaturesExample, title: "Core Features" },
    { component: AdvancedUsageExample, title: "Advanced Usage" }
  ];
  
  const ActiveExampleComponent = examples[activeExample].component;
  
  return (
    <div className="[library-name]-examples">
      <h1>[LIBRARY_NAME] Examples</h1>
      <p>Comprehensive examples demonstrating [LIBRARY_NAME] features and patterns.</p>
      
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
        <h2>About [LIBRARY_NAME]</h2>
        <p>
          [LIBRARY_DESCRIPTION]
        </p>
        
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Feature 1</strong>: Description of feature 1</li>
          <li><strong>Feature 2</strong>: Description of feature 2</li>
          <li><strong>Feature 3</strong>: Description of feature 3</li>
        </ul>
        
        <h3>Installation:</h3>
        <pre>{`npm install [LIBRARY_NAME]`}</pre>
        
        <h3>Basic Usage:</h3>
        <pre>{`import { [IMPORTS] } from '[LIBRARY_NAME]';

function MyComponent() {
  // Basic usage code
  return (
    // JSX
  );
}`}</pre>
      </div>
    </div>
  );
}
```

## Context7 Integration

To integrate with Context7 for documentation:

1. **Get Library Documentation**:
   ```javascript
   // Use Context7 to get latest documentation
   const docs = await getLibraryDocs('/[LIBRARY_ORG]/[LIBRARY_NAME]', {
     topic: 'examples',
     tokens: 5000
   });
   ```

2. **Extract Code Examples**:
   ```javascript
   // Extract relevant code examples from Context7 docs
   const examples = extractExamples(docs);
   ```

3. **Update Examples**:
   ```javascript
   // Update examples with latest patterns from Context7
   examples.forEach(example => {
     updateExampleWithLatestPatterns(example, docs);
   });
   ```

## Best Practices

1. **Interactive Demos**: Each example should include an interactive demo that works in the browser
2. **Real Code Examples**: Include actual working code that developers can copy
3. **Context7 Integration**: Use Context7 to ensure examples are up-to-date
4. **Progressive Complexity**: Start with basic examples and progress to advanced
5. **Clear Explanations**: Each example should have clear explanations of concepts

## File Naming Convention

- Use kebab-case for file names: `[library-name].jsx`
- Place in appropriate category folder: `[category]/[library-name]/examples.jsx`

## Example Categories

1. **Basic Setup**: Installation, configuration, basic usage
2. **Core Features**: Main functionality and common use cases
3. **Advanced Usage**: Complex patterns, optimizations, edge cases
4. **Integration**: How to integrate with other libraries
5. **Best Practices**: Recommended patterns and approaches

## Context7 Documentation Sources

Use Context7 to get the most up-to-date documentation for each library:

```javascript
// Example for getting React Router docs
const reactRouterDocs = await getLibraryDocs('/remix-run/react-router', {
  topic: 'hooks',
  tokens: 3000
});

// Example for getting Redux Toolkit docs
const reduxToolkitDocs = await getLibraryDocs('/reduxjs/redux-toolkit', {
  topic: 'usage',
  tokens: 5000
});
```

## Updating Examples

Regularly update examples using Context7 to ensure they reflect the latest API and best practices:

1. Schedule regular updates (monthly/quarterly)
2. Check for breaking changes in library versions
3. Update code examples to match current API
4. Add new examples for newly introduced features
5. Remove deprecated patterns