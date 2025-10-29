import React, { useState } from 'react';

const NetlifyExamples = () => {
  const [selectedExample, setSelectedExample] = useState('deployment');
  const [siteName, setSiteName] = useState('my-react-app');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [publishDir, setPublishDir] = useState('build');
  const [result, setResult] = useState('');

  const renderDeploymentExamples = () => (
    <div className="example-section">
      <h3>Deployment</h3>
      <div className="code-example">
        <pre>{`// Deploy a site with Netlify CLI
netlify deploy

// Deploy to production
netlify deploy --prod

// Deploy with custom directory
netlify deploy --dir=dist

// Deploy with specific site
netlify deploy --site=site-id.netlify.app

// Initialize a new site
netlify init`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="input-group">
          <label>Site Name:</label>
          <input 
            type="text" 
            value={siteName} 
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Enter site name"
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
          <label>Publish Directory:</label>
          <input 
            type="text" 
            value={publishDir} 
            onChange={(e) => setPublishDir(e.target.value)}
            placeholder="Enter publish directory"
          />
        </div>
        <div className="button-group">
          <button onClick={() => {
            setResult(`netlify.toml configuration:\n[build]\n  publish = "${publishDir}"\n  command = "${buildCommand}"\n\n[context.production]\n  command = "${buildCommand}"`);
          }}>
            Generate netlify.toml
          </button>
          <button onClick={() => {
            setResult(`Deploy command: netlify deploy --prod --dir=${publishDir}`);
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
        <pre>{`// netlify.toml example
[build]
  publish = "build"
  command = "npm run build"

[context.production]
  command = "npm run build"
  publish = "build"

[context.deploy-preview]
  command = "npm run build:preview"

[context.branch-deploy]
  command = "npm run build:staging"

# Redirects
[[redirects]]
  from = "/api/*"
  to = "https://api.example.com/:splat"
  status = 200

# Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`[build]\n  publish = "${publishDir}"\n  command = "${buildCommand}"\n\n[context.production]\n  command = "${buildCommand}"\n  publish = "${publishDir}"`);
          }}>
            Generate Basic Config
          </button>
          <button onClick={() => {
            setResult(`[[redirects]]\n  from = "/old-path"\n  to = "/new-path"\n  status = 301\n\n[[redirects]]\n  from = "/api/*"\n  to = "https://api.example.com/:splat"\n  status = 200`);
          }}>
            Generate Redirects
          </button>
          <button onClick={() => {
            setResult(`[[headers]]\n  for = "/*"\n  [headers.values]\n    X-Frame-Options = "DENY"\n    X-XSS-Protection = "1; mode=block"\n    X-Content-Type-Options = "nosniff"`);
          }}>
            Generate Security Headers
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
netlify env:set API_KEY production
netlify env:set DATABASE_URL production

// List all environment variables
netlify env:list

// Get a specific environment variable
netlify env:get API_KEY

// Remove an environment variable
netlify env:unset API_KEY

// Use environment variables in netlify.toml
[build]
  command = "npm run build"
  publish = "build"
  environment = { NODE_VERSION = "16" }

[context.production.environment]
  API_URL = "https://api.example.com"`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Commands to manage environment variables:\nnetlify env:set API_KEY production\nnetlify env:set DATABASE_URL production\nnetlify env:list\nnetlify env:get API_KEY`);
          }}>
            Show CLI Commands
          </button>
          <button onClick={() => {
            setResult(`# Use environment variables in netlify.toml:\n[build]\n  command = "${buildCommand}"\n  publish = "${publishDir}"\n  environment = { NODE_VERSION = "16" }\n\n[context.production.environment]\n  API_URL = "https://api.example.com"\n  NODE_ENV = "production"`);
          }}>
            Show Config Usage
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderFunctionsExamples = () => (
    <div className="example-section">
      <h3>Serverless Functions</h3>
      <div className="code-example">
        <pre>{`// Create a serverless function
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};

// Function with dynamic routing
// netlify/functions/api/[param].js
exports.handler = async (event, context) => {
  const { param } = event.pathParameters;
  return {
    statusCode: 200,
    body: JSON.stringify({ param }),
  };
};

// Function configuration in netlify.toml
[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`// netlify/functions/hello.js\nexports.handler = async (event, context) => {\n  return {\n    statusCode: 200,\n    body: JSON.stringify({ message: "Hello from ${siteName}!" }),\n  };\n};`);
          }}>
            Generate Hello Function
          </button>
          <button onClick={() => {
            setResult(`// netlify/functions/api/user.js\nexports.handler = async (event, context) => {\n  const { id } = event.pathParameters;\n  return {\n    statusCode: 200,\n    body: JSON.stringify({ id, name: "User " + id }),\n  };\n};`);
          }}>
            Generate API Function
          </button>
          <button onClick={() => {
            setResult(`[functions]\n  directory = "netlify/functions"\n\n[[redirects]]\n  from = "/api/*"\n  to = "/.netlify/functions/:splat"\n  status = 200`);
          }}>
            Generate Function Config
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderFormsExamples = () => (
    <div className="example-section">
      <h3>Form Handling</h3>
      <div className="code-example">
        <pre>{`// HTML form with Netlify handling
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <p><label>Your Name: <input type="text" name="name" /></label></p>
  <p><label>Your Email: <input type="email" name="email" /></label></p>
  <p><label>Message: <textarea name="message"></textarea></label></p>
  <p><button type="submit">Send</button></p>
</form>

// React form with Netlify handling
import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(() => console.log('Form submitted'));
  };

  return (
    <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="contact" />
      {/* form fields */}
    </form>
  );
}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`<form name="contact" method="POST" data-netlify="true">\n  <input type="hidden" name="form-name" value="contact" />\n  <p><label>Your Name: <input type="text" name="name" /></label></p>\n  <p><label>Your Email: <input type="email" name="email" /></label></p>\n  <p><label>Message: <textarea name="message"></textarea></label></p>\n  <p><button type="submit">Send</button></p>\n</form>`);
          }}>
            Generate HTML Form
          </button>
          <button onClick={() => {
            setResult(`import React, { useState } from 'react';\n\nfunction ContactForm() {\n  const [formData, setFormData] = useState({});\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    const form = e.target;\n    fetch('/', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },\n      body: new URLSearchParams(new FormData(form)).toString()\n    }).then(() => console.log('Form submitted'));\n  };\n\n  return (\n    <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit}>\n      <input type="hidden" name="form-name" value="contact" />\n      {/* form fields */}\n    </form>\n  );\n}`);
          }}>
            Generate React Form
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
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.1
        with:
          publish-dir: './build'
          production-branch: main
          github-token: \${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
          enable-pull-request-comment: false
          enable-commit-comment: false
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# GitHub Actions workflow for Netlify deployment:\nname: Deploy to Netlify\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Setup Node\n        uses: actions/setup-node@v2\n        with:\n          node-version: '16'\n      - name: Install dependencies\n        run: npm ci\n      - name: Build\n        run: ${buildCommand}\n      - name: Deploy to Netlify\n        uses: nwtgck/actions-netlify@v1.1\n        with:\n          publish-dir: './${publishDir}'\n          production-branch: main\n          github-token: \${{ secrets.GITHUB_TOKEN }}\n          deploy-message: "Deploy from GitHub Actions"\n        env:\n          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}\n          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}`);
          }}>
            GitHub Actions
          </button>
          <button onClick={() => {
            setResult(`# GitLab CI for Netlify deployment:\ndeploy_production:\n  stage: deploy\n  image: node:16\n  script:\n    - npm ci\n    - ${buildCommand}\n    - npm install -g netlify-cli\n    - netlify deploy --prod --dir=${publishDir}\n  only:\n    - main`);
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

  return (
    <div className="library-examples">
      <h2>Netlify Examples</h2>
      <p>Netlify is a platform that provides hosting and serverless backend services for web applications and static websites.</p>
      
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
          className={selectedExample === 'functions' ? 'active' : ''}
          onClick={() => setSelectedExample('functions')}
        >
          Functions
        </button>
        <button 
          className={selectedExample === 'forms' ? 'active' : ''}
          onClick={() => setSelectedExample('forms')}
        >
          Forms
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
        {selectedExample === 'functions' && renderFunctionsExamples()}
        {selectedExample === 'forms' && renderFormsExamples()}
        {selectedExample === 'cicd' && renderCI_CDExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install -g netlify-cli</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">Official Website</a></li>
          <li><a href="https://docs.netlify.com/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
          <li><a href="https://github.com/netlify/cli" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default NetlifyExamples;