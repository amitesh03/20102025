import React, { useState } from 'react';

const AWSAmplifyExamples = () => {
  const [selectedExample, setSelectedExample] = useState('deployment');
  const [appName, setAppName] = useState('my-react-app');
  const [result, setResult] = useState('');

  const renderDeploymentExamples = () => (
    <div className="example-section">
      <h3>Deployment</h3>
      <div className="code-example">
        <pre>{`// Initialize Amplify in your project
amplify init

// Add hosting
amplify add hosting

# Choose hosting environment
? Select the plugin module to execute
> Hosting with Amplify Console (Managed file uploads)

# Configure hosting
? Choose a type
> Continuous deployment (Git-based deployments)

# Deploy your app
amplify publish

# Push changes to Amplify
amplify push

// View app in browser
amplify status`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="input-group">
          <label>App Name:</label>
          <input 
            type="text" 
            value={appName} 
            onChange={(e) => setAppName(e.target.value)}
            placeholder="Enter app name"
          />
        </div>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Commands to deploy ${appName} with Amplify:\namplify init\namplify add hosting\namplify publish`);
          }}>
            Generate Deploy Commands
          </button>
          <button onClick={() => {
            setResult(`# Amplify deployment process for ${appName}:\n1. amplify init\n2. amplify add hosting\n3. Select "Continuous deployment"\n4. amplify publish\n5. amplify status`);
          }}>
            Show Deployment Process
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
        <pre>{`// amplify.yml configuration file
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*

# Custom build settings
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`version: 1\nfrontend:\n  phases:\n    preBuild:\n      commands:\n        - npm ci\n    build:\n      commands:\n        - npm run build\n  artifacts:\n    baseDirectory: build\n    files:\n      - '**/*'\n  cache:\n    paths:\n      - node_modules/**/*`);
          }}>
            Generate amplify.yml
          </button>
          <button onClick={() => {
            setResult(`version: 1\nfrontend:\n  phases:\n    preBuild:\n      commands:\n        - npm ci\n    build:\n      commands:\n        - npm run build\n  artifacts:\n    baseDirectory: build\n    files:\n      - '**/*'\n  cache:\n    paths:\n      - node_modules/**/*\n  appRoot: ${appName}`);
          }}>
            Generate Config with App Name
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderBackendExamples = () => (
    <div className="example-section">
      <h3>Backend Integration</h3>
      <div className="code-example">
        <pre>{`// Add authentication
amplify add auth

# Choose auth configuration
? Do you want to use the default authentication configuration?
> Default configuration

# Add API
amplify add api

# Choose API type
? Please select from one of the below mentioned services
> REST

# Configure API
? Provide a friendly name for your resource
> myapi

# Add storage
amplify add storage

# Choose storage type
? Please select from one of the below mentioned services
> Content (Images, audio, video, etc.)

# Deploy backend
amplify push`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Backend setup for ${appName}:\namplify add auth\namplify add api\namplify add storage\namplify push`);
          }}>
            Generate Backend Commands
          </button>
          <button onClick={() => {
            setResult(`# Configure authentication for ${appName}:\namplify add auth\n# Select "Default configuration"\n# Configure sign-in methods\namplify push`);
          }}>
            Generate Auth Setup
          </button>
          <button onClick={() => {
            setResult(`# Configure API for ${appName}:\namplify add api\n# Select "REST"\n# Configure endpoints\namplify push`);
          }}>
            Generate API Setup
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
        <pre>{`// Set environment variables
amplify env add

# List all environments
amplify env list

# Switch environments
amplify env checkout <env-name>

# Remove environment
amplify env remove <env-name>

# Get current environment
amplify env get

# Pull environment configuration
amplify pull

# Use environment variables in code
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
const env = process.env.NODE_ENV;`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Environment management for ${appName}:\namplify env add staging\namplify env add production\namplify env list\namplify env checkout staging`);
          }}>
            Generate Environment Commands
          </button>
          <button onClick={() => {
            setResult(`# Environment variables in ${appName}:\n# In amplify.yml\nenv:\n  variables:\n    REACT_APP_API_URL: https://api.example.com\n    REACT_APP_VERSION: 1.0.0\n\n# In React code\nconst apiUrl = process.env.REACT_APP_API_URL;`);
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

  const renderCI_CDExamples = () => (
    <div className="example-section">
      <h3>CI/CD Integration</h3>
      <div className="code-example">
        <pre>{`// GitHub Actions workflow
name: Deploy to Amplify
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Deploy to Amplify
        run: |
          npm ci
          npm run build
          amplify push --yes`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# GitHub Actions for ${appName}:\nname: Deploy to Amplify\non:\n  push:\n    branches: [main]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Setup Node\n        uses: actions/setup-node@v2\n        with:\n          node-version: '16'\n      - name: Configure AWS Credentials\n        uses: aws-actions/configure-aws-credentials@v1\n        with:\n          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}\n          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}\n          aws-region: us-east-1\n      - name: Deploy to Amplify\n        run: |\n          npm ci\n          npm run build\n          amplify push --yes`);
          }}>
            GitHub Actions
          </button>
          <button onClick={() => {
            setResult(`# GitLab CI for ${appName}:\ndeploy_production:\n  stage: deploy\n  image: node:16\n  script:\n    - npm ci\n    - npm run build\n    - amplify push --yes\n  only:\n    - main`);
          }}>
            GitLab CI
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderMonitoringExamples = () => (
    <div className="example-section">
      <h3>Monitoring and Analytics</h3>
      <div className="code-example">
        <pre>{`// Add analytics
amplify add analytics

# Configure analytics
? Provide your pinpoint resource name
> myappanalytics

# Add monitoring
amplify add notifications

# Configure notifications
? Choose the notification channel
> In-App Messaging

# View analytics
amplify console analytics

# View logs
amplify status

# Monitor deployments
amplify status --details

# View app metrics
amplify console`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Analytics setup for ${appName}:\namplify add analytics\n# Configure analytics\namplify add notifications\namplify push\namplify console analytics`);
          }}>
            Generate Analytics Commands
          </button>
          <button onClick={() => {
            setResult(`# Monitoring setup for ${appName}:\namplify add notifications\n# Configure notifications\namplify push\namplify status --details\namplify console`);
          }}>
            Generate Monitoring Commands
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
      <h2>AWS Amplify Examples</h2>
      <p>AWS Amplify is a set of tools and services that enables mobile and front-end web developers to build secure, scalable full-stack applications.</p>
      
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
          className={selectedExample === 'backend' ? 'active' : ''}
          onClick={() => setSelectedExample('backend')}
        >
          Backend
        </button>
        <button 
          className={selectedExample === 'environment' ? 'active' : ''}
          onClick={() => setSelectedExample('environment')}
        >
          Environment
        </button>
        <button 
          className={selectedExample === 'cicd' ? 'active' : ''}
          onClick={() => setSelectedExample('cicd')}
        >
          CI/CD
        </button>
        <button 
          className={selectedExample === 'monitoring' ? 'active' : ''}
          onClick={() => setSelectedExample('monitoring')}
        >
          Monitoring
        </button>
      </div>

      <div className="example-content">
        {selectedExample === 'deployment' && renderDeploymentExamples()}
        {selectedExample === 'configuration' && renderConfigurationExamples()}
        {selectedExample === 'backend' && renderBackendExamples()}
        {selectedExample === 'environment' && renderEnvironmentVariablesExamples()}
        {selectedExample === 'cicd' && renderCI_CDExamples()}
        {selectedExample === 'monitoring' && renderMonitoringExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install -g @aws-amplify/cli</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://aws.amazon.com/amplify/" target="_blank" rel="noopener noreferrer">Official Website</a></li>
          <li><a href="https://docs.amplify.aws/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
          <li><a href="https://github.com/aws-amplify/amplify-cli" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AWSAmplifyExamples;