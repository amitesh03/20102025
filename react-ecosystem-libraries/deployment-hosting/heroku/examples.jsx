import React, { useState } from 'react';

const HerokuExamples = () => {
  const [selectedExample, setSelectedExample] = useState('deployment');
  const [appName, setAppName] = useState('my-react-app');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [result, setResult] = useState('');

  const renderDeploymentExamples = () => (
    <div className="example-section">
      <h3>Deployment</h3>
      <div className="code-example">
        <pre>{`// Create a new Heroku app
heroku create

// Create a new Heroku app with custom name
heroku create my-awesome-app

// Deploy to Heroku
git push heroku main

// Deploy a specific branch
git push heroku develop:main

// Open the app in browser
heroku open

// View deployment logs
heroku logs --tail`}</pre>
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
        <div className="input-group">
          <label>Build Command:</label>
          <input 
            type="text" 
            value={buildCommand} 
            onChange={(e) => setBuildCommand(e.target.value)}
            placeholder="Enter build command"
          />
        </div>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Commands to deploy ${appName} to Heroku:\nheroku create ${appName}\ngit push heroku main\nheroku open`);
          }}>
            Generate Deploy Commands
          </button>
          <button onClick={() => {
            setResult(`# Heroku deployment process:\n1. heroku create ${appName}\n2. heroku buildpacks:set heroku/nodejs\n3. git push heroku main\n4. heroku open`);
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
        <pre>{`// Set environment variables
heroku config:set NODE_ENV=production
heroku config:set API_URL=https://api.example.com

// List all environment variables
heroku config

// Get a specific environment variable
heroku config:get API_URL

// Remove an environment variable
heroku config:unset API_URL

// Set buildpacks
heroku buildpacks:set heroku/nodejs
heroku buildpacks:add --index 1 heroku/nodejs

// Add-ons
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create papertrail`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Environment variables for ${appName}:\nheroku config:set NODE_ENV=production\nheroku config:set REACT_APP_API_URL=https://api.example.com\nheroku config:set REACT_APP_VERSION=1.0.0`);
          }}>
            Generate Env Variables
          </button>
          <button onClick={() => {
            setResult(`# Buildpack configuration for ${appName}:\nheroku buildpacks:set heroku/nodejs\nheroku buildpacks:add --index 1 heroku/nodejs`);
          }}>
            Generate Buildpack Commands
          </button>
          <button onClick={() => {
            setResult(`# Add-ons for ${appName}:\nheroku addons:create heroku-postgresql:hobby-dev\nheroku addons:create papertrail\nheroku addons:create sentry`);
          }}>
            Generate Add-on Commands
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderStaticSiteExamples = () => (
    <div className="example-section">
      <h3>Static Site Deployment</h3>
      <div className="code-example">
        <pre>{`// Create a static.json file for static site deployment
{
  "root": "build/",
  "routes": {
    "/**": "index.html"
  }
}

// Deploy static site to Heroku
heroku create my-static-app
heroku buildpacks:set heroku/nodejs
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git
git push heroku main

// For Create React App
{
  "root": "build/",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`{\n  "root": "build/",\n  "clean_urls": true,\n  "routes": {\n    "/**": "index.html"\n  }\n}`);
          }}>
            Generate static.json
          </button>
          <button onClick={() => {
            setResult(`# Deploy ${appName} as static site:\nheroku create ${appName}\nheroku buildpacks:set heroku/nodejs\nheroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git\ngit push heroku main`);
          }}>
            Generate Deploy Commands
          </button>
        </div>
        <div className="result">
          <pre>{result}</pre>
        </div>
      </div>
    </div>
  );

  const renderScalingExamples = () => (
    <div className="example-section">
      <h3>Scaling and Performance</h3>
      <div className="code-example">
        <pre>{`// Scale dynos
heroku ps:scale web=1
heroku ps:scale web=2:standard-1x

// View current dyno formation
heroku ps

// View dyno types
heroku ps:type

// Restart app
heroku restart

// Restart specific dyno
heroku restart web

// View app metrics
heroku ps:info

// Enable automatic dyno scaling
heroku addons:create autoscaling:standard`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Scaling commands for ${appName}:\nheroku ps:scale web=1:standard-1x\nheroku ps\nheroku ps:info`);
          }}>
            Generate Scaling Commands
          </button>
          <button onClick={() => {
            setResult(`# Performance monitoring for ${appName}:\nheroku addons:create papertrail\nheroku addons:create newrelic\nheroku addons:create autoscaling:standard`);
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

  const renderCI_CDExamples = () => (
    <div className="example-section">
      <h3>CI/CD Integration</h3>
      <div className="code-example">
        <pre>{`// GitHub Actions workflow
name: Deploy to Heroku
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: \${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: \${{ secrets.HEROKU_APP_NAME }}
          heroku_email: \${{ secrets.HEROKU_EMAIL }}

// GitLab CI
deploy_production:
  stage: deploy
  script:
    - apt-get update -qy
    - apt-get install -y ruby-dev
    - gem install dpl
    - dpl --provider=heroku --app=$HEROKU_APP_NAME --api-key=$HEROKU_API_KEY`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# GitHub Actions workflow for ${appName}:\nname: Deploy to Heroku\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v2\n      - name: Deploy to Heroku\n        uses: akhileshns/heroku-deploy@v3.12.12\n        with:\n          heroku_api_key: \${{ secrets.HEROKU_API_KEY }}\n          heroku_app_name: "${appName}"\n          heroku_email: \${{ secrets.HEROKU_EMAIL }}`);
          }}>
            GitHub Actions
          </button>
          <button onClick={() => {
            setResult(`# GitLab CI for ${appName}:\ndeploy_production:\n  stage: deploy\n  script:\n    - apt-get update -qy\n    - apt-get install -y ruby-dev\n    - gem install dpl\n    - dpl --provider=heroku --app="${appName}" --api-key=$HEROKU_API_KEY\n  only:\n    - main`);
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

  const renderDatabaseExamples = () => (
    <div className="example-section">
      <h3>Database Integration</h3>
      <div className="code-example">
        <pre>{`// Add PostgreSQL database
heroku addons:create heroku-postgresql:hobby-dev

// Get database connection string
heroku config:get DATABASE_URL

// Connect to database
heroku pg:psql

# In your React app
const dbUrl = process.env.DATABASE_URL;

// Reset database
heroku pg:reset DATABASE_URL

# Backup database
heroku pg:backups:capture

# Restore database
heroku pg:backups:restore`}</pre>
      </div>
      <div className="interactive-example">
        <h4>Try it yourself:</h4>
        <div className="button-group">
          <button onClick={() => {
            setResult(`# Database setup for ${appName}:\nheroku addons:create heroku-postgresql:hobby-dev\nheroku config:get DATABASE_URL\nheroku pg:psql`);
          }}>
            Generate Database Commands
          </button>
          <button onClick={() => {
            setResult(`# Database backup and restore for ${appName}:\nheroku pg:backups:capture\nheroku pg:backups:download\nheroku pg:backups:restore`);
          }}>
            Generate Backup Commands
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
      <h2>Heroku Examples</h2>
      <p>Heroku is a cloud platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.</p>
      
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
          className={selectedExample === 'static' ? 'active' : ''}
          onClick={() => setSelectedExample('static')}
        >
          Static Sites
        </button>
        <button 
          className={selectedExample === 'scaling' ? 'active' : ''}
          onClick={() => setSelectedExample('scaling')}
        >
          Scaling
        </button>
        <button 
          className={selectedExample === 'cicd' ? 'active' : ''}
          onClick={() => setSelectedExample('cicd')}
        >
          CI/CD
        </button>
        <button 
          className={selectedExample === 'database' ? 'active' : ''}
          onClick={() => setSelectedExample('database')}
        >
          Database
        </button>
      </div>

      <div className="example-content">
        {selectedExample === 'deployment' && renderDeploymentExamples()}
        {selectedExample === 'configuration' && renderConfigurationExamples()}
        {selectedExample === 'static' && renderStaticSiteExamples()}
        {selectedExample === 'scaling' && renderScalingExamples()}
        {selectedExample === 'cicd' && renderCI_CDExamples()}
        {selectedExample === 'database' && renderDatabaseExamples()}
      </div>

      <div className="installation">
        <h3>Installation</h3>
        <pre><code>npm install -g heroku</code></pre>
      </div>

      <div className="resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://www.heroku.com/" target="_blank" rel="noopener noreferrer">Official Website</a></li>
          <li><a href="https://devcenter.heroku.com/" target="_blank" rel="noopener noreferrer">Documentation</a></li>
          <li><a href="https://github.com/heroku/cli" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
  );
};

export default HerokuExamples;