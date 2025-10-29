/**
 * Yarn Examples
 * 
 * Yarn is a package manager for JavaScript that aims to be reliable, fast,
 * secure, and consistent. It uses a lockfile for deterministic builds
 * and supports workspaces for monorepos.
 */

// Example 1: Basic Yarn commands
/*
// Install dependencies
yarn install
yarn add react
yarn add react@17.0.0  // Install specific version
yarn add react --dev     // Install as dev dependency

// Install from package.json
yarn install

// Update dependencies
yarn upgrade
yarn upgrade react

// Remove packages
yarn remove react
yarn uninstall react

// Global packages
yarn global add create-react-app
yarn global list

// Run scripts
yarn start
yarn run build
yarn test

// Package information
yarn list
yarn list react
yarn outdated
yarn info react
*/

// Example 2: package.json with Yarn-specific fields
/*
{
  "name": "my-react-app",
  "version": "1.0.0",
  "description": "A sample React application",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,css,md}"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0"
  },
  "devDependencies": {
    "react-scripts": "5.0.1",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.8.0"
  },
  "workspaces": [
    "packages/*"
  ],
  "resolutions": {
    "react": "^18.0.0"
  }
}
*/

// Example 3: Yarn workspaces for monorepos
/*
// Root package.json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}

// packages/app/package.json
{
  "name": "@my-monorepo/app",
  "version": "1.0.0",
  "dependencies": {
    "@my-monorepo/ui": "^1.0.0"
  }
}

// packages/ui/package.json
{
  "name": "@my-monorepo/ui",
  "version": "1.0.0",
  "peerDependencies": {
    "react": "^18.0.0"
  }
}

// Installing dependencies for all workspaces
yarn install

// Running scripts in specific workspace
yarn workspace @my-monorepo/app start
yarn workspace packages/app build
*/

// Example 4: Yarn configuration files
/*
// .yarnrc.yml
yarnPath: /path/to/yarn
enableGlobalCache: true
globalFolder: ~/.yarn
cacheFolder: ~/.yarn/cache

// .yarnrc (JSON format)
{
  "yarnPath": "/path/to/yarn",
  "enableGlobalCache": true,
  "globalFolder": "~/.yarn",
  "cacheFolder": "~/.yarn/cache"
}

// .npmignore (compatible with Yarn)
node_modules
build
dist
coverage
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
yarn-debug.log*
yarn-error.log*
*/

// Example 5: Yarn scripts for React development
/*
{
  "scripts": {
    // Development
    "start": "react-scripts start",
    "dev": "webpack serve --mode development",
    
    // Building
    "build": "react-scripts build",
    "build:prod": "NODE_ENV=production webpack --mode production",
    "build:analyze": "yarn build && npx webpack-bundle-analyzer build/static/js/*.js",
    
    // Testing
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:ci": "react-scripts test --coverage --watchAll=false --ci",
    
    // Linting and formatting
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,css,md}",
    "format:check": "prettier --check src/**/*.{js,jsx,ts,tsx,css,md}",
    
    // Workspace commands
    "clean": "yarn workspaces run clean",
    "build:all": "yarn workspaces run build",
    "test:all": "yarn workspaces run test",
    "lint:all": "yarn workspaces run lint",
    
    // Deployment
    "deploy": "yarn build && gh-pages -d build",
    "deploy:staging": "yarn build:prod && aws s3 sync build/ s3://staging-bucket/",
    "deploy:production": "yarn build:prod && aws s3 sync build/ s3://production-bucket/",
    
    // Utilities
    "reset": "yarn clean && rm -rf node_modules yarn.lock && yarn install",
    "deps:check": "yarn outdated",
    "deps:update": "yarn upgrade-interactive --latest"
  }
}
*/

// Example 6: Yarn Berry (Yarn 2+) configuration
/*
// .yarnrc.yml
yarnPath: .yarn/releases/yarn-berry.cjs
enableGlobalCache: true
enableTelemetry: false

// yarn.lock (Yarn Berry format)
__metadata:
  version: 4
  cacheKey: v8

lockfileVersion: 6

.:
  react: ^18.2.0
  react-dom: ^18.2.0
  react-router-dom: ^6.8.0
  axios: ^1.3.0

devDependencies.:
  react-scripts: 5.0.1
  "@types/react": ^18.0.0
  "@types/react-dom": ^18.0.0
  eslint: ^8.0.0
  prettier: ^2.8.0
*/

// Example 7: Yarn plugins
/*
// Install Yarn plugin
yarn plugin import @yarnpkg/plugin-typescript
yarn plugin import @yarnpkg/plugin-workspace-tools

// Use plugin
yarn typescript
yarn workspace-tools

// .yarnrc.yml with plugins
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-typescript.js
    spec: '@yarnpkg/plugin-typescript'
  - path: .yarn/plugins/@yarnpkg/plugin-workspace-tools.js
    spec: '@yarnpkg/plugin-workspace-tools'
*/

// Example 8: Yarn caching
/*
// Check cache status
yarn cache dir
yarn cache list
yarn cache clean

// Clear cache
yarn cache clean
yarn cache clean --all

// Set cache location
yarn config set cache-folder /path/to/cache

// Disable cache
yarn install --no-cache

// Use offline mode
yarn install --offline

// Prefer offline cache
yarn install --prefer-offline
*/

// Example 9: Yarn with Docker
/*
// Dockerfile
FROM node:18-alpine

# Install Yarn
RUN npm install -g yarn

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN yarn build

# Expose port
EXPOSE 3000

# Start application
CMD ["yarn", "start"]

# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
*/

// Example 10: Yarn security
/*
// Check for security vulnerabilities
yarn audit

// Fix vulnerabilities automatically
yarn audit --fix

// Fix only production dependencies
yarn audit --production --fix

// Show audit report in JSON format
yarn audit --json

// Exclude dev dependencies from audit
yarn audit --production

// Set audit level
yarn audit --level moderate
yarn audit --level high

// Ignore specific vulnerabilities
yarn audit --ignore 123456
*/

// Example 11: Yarn publishing
/*
// Prepare package for publishing
yarn build
yarn test
yarn lint

// Check package content
yarn pack --dry-run

// Create package tarball
yarn pack

// Publish to NPM registry
yarn publish

// Publish with tag
yarn publish --tag beta

// Publish from specific directory
yarn publish dist/

// Publish with access level
yarn publish --access public
yarn publish --access restricted

// Publish with registry
yarn publish --registry https://company-registry.com/

// Unpublish package
yarn npm unpublish my-package
yarn npm unpublish my-package@1.0.0
*/

// Example 12: Yarn environment variables
/*
// Set configuration
YARN_CACHE_FOLDER=/path/to/cache
YARN_GLOBAL_FOLDER=/path/to/global
YARN_ENABLE_GLOBAL_CACHE=true
YARN_ENABLE_TELEMETRY=false

// Set authentication
YARN_REGISTRY=https://registry.npmjs.org/
YARN_NPM_AUTH_TOKEN=your-auth-token
YARN_NPM_USERNAME=username
YARN_NPM_PASSWORD=password

// Environment-specific configuration
NODE_ENV=production
YARN_PRODUCTION_ONLY=true
*/

// Example 13: Yarn selective dependency resolution
/*
// package.json with resolutions
{
  "name": "my-app",
  "dependencies": {
    "react": "^18.0.0",
    "some-package": "^1.0.0"
  },
  "resolutions": {
    "react": "^18.2.0",
    "some-package/react": "^18.2.0"
  }
}

// Force specific version
{
  "resolutions": {
    "react": "18.2.0"
  }
}

// Selective dependency resolution
{
  "resolutions": {
    "**/react": "^18.0.0",
    "package-a/**/react": "^18.0.0"
  }
}
*/

export const yarnExamples = {
  description: "Examples of using Yarn for package management in JavaScript projects",
  installation: "npm install -g yarn",
  commonCommands: [
    "yarn install - Install dependencies",
    "yarn add - Add packages",
    "yarn remove - Remove packages",
    "yarn upgrade - Update packages",
    "yarn run - Execute scripts",
    "yarn publish - Publish packages",
    "yarn audit - Check security"
  ],
  configuration: [
    "package.json - Project configuration",
    ".yarnrc - Yarn configuration",
    "yarn.lock - Lockfile",
    "Environment variables"
  ],
  features: [
    "Deterministic builds",
    "Workspaces support",
    "Offline mode",
    "Plugin system",
    "Selective dependency resolution",
    "Caching system",
    "Yarn Berry (Yarn 2+)"
  ],
  bestPractices: [
    "Use workspaces for monorepos",
    "Commit yarn.lock files",
    "Regular security audits",
    "Use resolutions for dependency conflicts",
    "Configure scripts for common tasks",
    "Use Yarn Berry for new features"
  ]
};