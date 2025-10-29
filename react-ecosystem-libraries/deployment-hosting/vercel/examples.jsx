import React, { useState } from 'react';

const VercelExamples = () => {
  const [selectedExample, setSelectedExample] = useState('deployment');
  const [projectName, setProjectName] = useState('my-react-app');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [outputDirectory, setOutputDirectory] = useState('build');
  const [result, setResult] = useState('');

  const renderDeploymentExamples = () => (
    <div className="example-section">
      <h3>Deployment</h3>
      <div className="code-example">
        <pre>{`// Deploy a project with Vercel CLI
vercel

// Deploy to production
vercel --prod

// Deploy with custom build settings
vercel --build-env API_KEY=your_api_key

// Deploy a specific directory
vercel --cwd ./dist

// Deploy with custom project name
vercel --name my-awesome-project`}</pre>
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
        <div className="input-group">
          <label>Build Command:</label>
          <input 
            type="text" 
            value={buildCommand} 
            onChange={(e) => setBuildCommand(e.target.value)}
            placeholder="Enter build command"
          />
        </div>
        <div className="input-group">
          <label>Output Directory:</label>
          <input 
            type="text" 
            value={outputDirectory} 
            onChange={(e) => setOutputDirectory(e.target.value)}
            placeholder="Enter output directory"
          />
        </div>
        <div className="button-group">
          <button onClick={() => {
            setResult(`vercel.json configuration:\n{\n  "name": "${projectName}",\n  "buildCommand": "${buildCommand}",\n  "outputDirectory": "${outputDirectory}",\n  "framework": "create-react-app"\n}`);
          }}>
            Generate vercel.json
          </button>
          <button onClick={() => {
            setResult(`Deploy command: vercel --name "${projectName}"`);
          }}>
            Generate Deploy Command
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderConfigurationExamples = () => (
    <div className="example-section">
      <h3>Configuration</h3>
      <div className="code-example">
        <pre>{`// vercel.json example
{
  "version": 2,
  "name": "my-react-app",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "API_URL": "@api-url"
  }
}

// Custom domain configuration
{
  "version": 2,
  "name": "my-react-app",
  "alias": ["myapp.example.com"]
}

// Serverless function configuration
{
  "version": 2,
  "functions": {
    "api/*.js": {
      "maxDuration": 10
    }
  }
}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`{\n  "version": 2,\n  "name": "${projectName}",\n  "builds": [\n    {\n      "src": "package.json",\n      "use": "@vercel/static-build",\n      "config": {\n        "distDir": "${outputDirectory}"\n      }\n    }\n  ],\n  "routes": [\n    {\n      "src": "/(.*)",\n      "dest": "/index.html"\n    }\n  ]\n}`);
          }}>
            Generate Basic Config
          </button>
          <button onClick={() => {
            setResult(`{\n  "version": 2,\n  "name": "${projectName}",\n  "alias": ["${projectName}.example.com"]\n}`);
          }}>
            Generate Domain Config
          </button>
          <button onClick={() => {
            setResult(`{\n  "version": 2,\n  "functions": {\n    "api/*.js": {\n      "maxDuration": 10\n    }\n  }\n}`);
          }}>
            Generate Functions Config
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderEnvironmentVariablesExamples = () => (
    <div className="example-section">
      <h3>Environment Variables</h3>
      <div className="code-example">
        <pre>{`// Set environment variables via CLI
vercel env add API_KEY
vercel env add DATABASE_URL production

// List all environment variables
vercel env ls

// Remove an environment variable
vercel env rm API_KEY production

// Pull environment variables to .env.local
vercel env pull .env.local

// Use environment variables in code
process.env.API_URL
process.env.NODE_ENV`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Commands to manage environment variables:\nvercel env add API_KEY\nvercel env add DATABASE_URL production\nvercel env ls\nvercel env pull .env.local`);
          }}>
            Show CLI Commands
          </button>
          <button onClick={() => {
            setResult(`// Access environment variables in React:\nconst apiUrl = process.env.REACT_APP_API_URL;\nconst nodeEnv = process.env.NODE_ENV;\n\n// In vercel.json:\n{\n  "env": {\n    "API_URL": "@api-url",\n    "DATABASE_URL": "@database-url"\n  }\n}`);
          }}>
            Show Usage in Code
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsExamples = () => (
    <div className="example-section">
      <h3>Analytics</h3>
      <div className="code-example">
        <pre>{`// Install Vercel Analytics
npm install @vercel/analytics

// Use in React app
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <h1>My App</h1>
      <Analytics />
    </>
  );
}

// Track custom events
import { track } from '@vercel/analytics';

function MyComponent() {
  const handleClick = () => {
    track('Button Click', {
      button: 'signup',
      location: 'homepage'
    });
  };
  
  return <button onClick={handleClick}>Sign Up</button>;
}

// View analytics data
vercel analytics`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`// Installation:\nnpm install @vercel/analytics\n\n// Usage in React:\nimport { Analytics } from '@vercel/analytics/react';\n\nfunction App() {\n  return (\n    <>\n      <YourApp />\n      <Analytics />\n    </>\n  );\n}`);
          }}>
            Show Basic Setup
          </button>
          <button onClick={() => {
            setResult(`// Custom event tracking:\nimport { track } from '@vercel/analytics';\n\nfunction PurchaseButton() {\n  const handlePurchase = () => {\n    track('Purchase', {\n      product: 'premium-plan',\n      price: 29.99,\n      currency: 'USD'\n    });\n  };\n  \n  return <button onClick={handlePurchase}>Buy Now</button>;\n}`);
          }}>
            Show Custom Events
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderCI_CDExamples = () => (
    <div className="example-section">
      <h3>CI/CD Integration</h3>
      <div className="code-example">
        <pre>{`// GitHub Actions workflow
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

// GitLab CI
deploy_production:
  stage: deploy
  script:
    - npm install -g vercel
    - vercel --prod --token $VERCEL_TOKEN

// Bitbucket Pipelines
pipelines:
  branches:
    main:
      - step:
          name: Deploy to Vercel
          script:
            - npm install -g vercel
            - vercel --prod --token $VERCEL_TOKEN`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# GitHub Actions workflow for Vercel deployment:\nname: Deploy to Vercel\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Deploy to Vercel\n        uses: amondnet/vercel-action@v20\n        with:\n          vercel-token: \${{ secrets.VERCEL_TOKEN }}\n          vercel-org-id: \${{ secrets.ORG_ID }}\n          vercel-project-id: \${{ secrets.PROJECT_ID }}\n          vercel-args: '--prod'`);
          }}>
            GitHub Actions
          </button>
          <button onClick={() => {
            setResult(`# GitLab CI for Vercel deployment:\ndeploy_production:\n  stage: deploy\n  script:\n    - npm install -g vercel\n    - vercel --prod --token $VERCEL_TOKEN\n  only:\n    - main`);
          }}>
            GitLab CI
          </button>
          <button onClick={() => {
            setResult(`# Bitbucket Pipelines for Vercel deployment:\npipelines:\n  branches:\n    main:\n      - step:\n          name: Deploy to Vercel\n          script:\n            - npm install -g vercel\n            - vercel --prod --token $VERCEL_TOKEN`);
          }}>
            Bitbucket Pipelines
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
      <h2>Vercel Examples</h2>
      <p>Vercel is a cloud platform for frontend developers that enables developers to host websites and web services that deploy instantly and scale automatically.</p>
      
      <div className="example-navigation">
        <button 
          className={selectedExample === 'deployment' ? 'active' : ''}
          onClick={() => setSelectedExample('deployment')}
        >
          Deployment
        </button>
        <button 
          className={selectedExample === 'configuration' ? 'active' : ''}
          onClick={() => setSelectedExample('configuration')}
        >
          Configuration
        </button>
        <button 
          className={selectedExample === 'environment' ? 'active' : ''}
          onClick={() => setSelectedExample('environment')}
        >
          Environment Variables
        </button>
        <button 
          className={selectedExample === 'analytics' ? 'active' : ''}
          onClick={() => setSelectedExample('analytics')}
        >
          Analytics
        </button>
        <button 
          className={selectedExample === 'cicd' ? 'active' : ''}
          onClick={() => setSelectedExample('cicd')}
        >
          CI/CD
        </button>
      </div>

      <div className="example-content">
        {selectedExample === 'deployment' && renderDeploymentExamples()}
        {selectedExample === 'configuration' && renderConfigurationExamples()}
        {selectedExample === 'environment' && renderEnvironmentVariablesExamples()}
        {selectedExample === 'analytics' && renderAnalyticsExamples()}
        {selectedExample === 'cicd' && renderCI_CDExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install -g vercel</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://vercel.com/" target="_blank" rel="noopener noreferrer">Official Website</a></li>
          <li><a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer">Documentation</a></li>
          <li><a href="https://github.com/vercel/vercel" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default VercelExamples;