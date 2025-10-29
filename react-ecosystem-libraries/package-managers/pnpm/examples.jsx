/**
 * pnpm Examples
 * 
 * pnpm is a fast, disk space efficient package manager for Node.js.
 * It uses a content-addressable filesystem to store all files from all packages
 * in a single place on disk.
 */

// Example 1: Basic pnpm commands
/*
// Install dependencies
pnpm install
pnpm add react
pnpm add react@17.0.0  // Install specific version
pnpm add react --save-dev  // Install as dev dependency

// Install from package.json
pnpm install

// Update dependencies
pnpm update
pnpm update react

// Remove packages
pnpm remove react
pnpm uninstall react

// Global packages
pnpm add -g create-react-app
pnpm list -g

// Run scripts
pnpm start
pnpm run build
pnpm test

// Package information
pnpm list
pnpm list react
pnpm outdated
pnpm info react
*/

// Example 2: pnpm-workspace.yaml for monorepos
/*
packages:
  # all packages in subdirs of packages/
  - 'packages/*'
  # all packages in subdirs of apps/
  - 'apps/*'
  # exclude packages that are inside test directories
  - '!**/test/**'
*/

// Example 3: pnpm configuration files
/*
// .pnpmrc
registry=https://registry.npmjs.org/
save-exact=true
shamefully-hoist=true
strict-peer-dependencies=true

// .npmrc (compatible with pnpm)
registry=https://registry.npmjs.org/
@mycompany:registry=https://company-registry.com/
//registry=:username
//registry=:_authToken

// pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
*/

// Example 4: package.json with pnpm-specific fields
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
  "pnpm": {
    "overrides": {
      "react": "^18.0.0"
    },
    "peerDependencyRules": {
      "ignoreMissing": ["@types/react"]
    }
  }
}
*/

// Example 5: pnpm store management
/*
// Check store status
pnpm store status

// Prune unused packages from store
pnpm store prune

// Show store path
pnpm store path

// Change store location
pnpm config set store-dir /path/to/store

// Show store statistics
pnpm store stats

// List packages in store
pnpm store list
*/

// Example 6: pnpm scripts for React development
/*
{
  "scripts": {
    // Development
    "start": "react-scripts start",
    "dev": "webpack serve --mode development",
    
    // Building
    "build": "react-scripts build",
    "build:prod": "NODE_ENV=production webpack --mode production",
    "build:analyze": "pnpm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    
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
    "clean": "pnpm -r exec rimraf dist",
    "build:all": "pnpm -r run build",
    "test:all": "pnpm -r run test",
    "lint:all": "pnpm -r run lint",
    
    // Deployment
    "deploy": "pnpm run build && gh-pages -d build",
    "deploy:staging": "pnpm run build:prod && aws s3 sync build/ s3://staging-bucket/",
    "deploy:production": "pnpm run build:prod && aws s3 sync build/ s3://production-bucket/",
    
    // Utilities
    "reset": "pnpm clean && rm -rf node_modules pnpm-lock.yaml && pnpm install",
    "deps:check": "pnpm outdated",
    "deps:update": "pnpm update --interactive"
  }
}
*/

// Example 7: pnpm filtering and selection
/*
// Install only production dependencies
pnpm install --prod
pnpm install --production

// Install only dev dependencies
pnpm install --dev

// Install with specific registry
pnpm add react --registry https://registry.npmjs.org/

// Install with specific tag
pnpm add react@latest
pnpm add react@next

// Install from git repository
pnpm add https://github.com/user/repo.git

// Install from local package
pnpm add ./local-package

// Filter packages in workspaces
pnpm -r --filter "@mycompany/*" install
pnpm -r --filter "react*" install
pnpm -r --filter "./packages/*" install
*/

// Example 8: pnpm caching
/*
// Check cache status
pnpm store status

// Clear cache
pnpm store prune

// Disable cache
pnpm install --no-frozen-lockfile

// Use offline mode
pnpm install --offline

// Prefer offline cache
pnpm install --prefer-offline

// Verify cache integrity
pnpm verify

// Set cache location
pnpm config set store-dir /path/to/store
*/

// Example 9: pnpm with Docker
/*
// Dockerfile
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]

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

// Example 10: pnpm security
/*
// Check for security vulnerabilities
pnpm audit

// Fix vulnerabilities automatically
pnpm audit --fix

// Fix only production dependencies
pnpm audit --prod --fix

// Show audit report in JSON format
pnpm audit --json

// Exclude dev dependencies from audit
pnpm audit --prod

// Set audit level
pnpm audit --audit-level moderate
pnpm audit --audit-level high

// Ignore specific vulnerabilities
pnpm audit --ignore 123456
*/

// Example 11: pnpm publishing
/*
// Prepare package for publishing
pnpm run build
pnpm run test
pnpm run lint

// Check package content
pnpm pack --dry-run

// Create package tarball
pnpm pack

// Publish to NPM registry
pnpm publish

// Publish with tag
pnpm publish --tag beta

// Publish from specific directory
pnpm publish dist/

// Publish with access level
pnpm publish --access public
pnpm publish --access restricted

// Publish with registry
pnpm publish --registry https://company-registry.com/

// Unpublish package
pnpm unpublish my-package
pnpm unpublish my-package@1.0.0
*/

// Example 12: pnpm environment variables
/*
// Set configuration
PNPM_REGISTRY=https://registry.npmjs.org/
PNPM_STORE_DIR=/path/to/store
PNPM_CACHE_FOLDER=/path/to/cache
PNPM_HOME=/path/to/pnpm-home

// Disable telemetry
PNPM_NO_UPDATE_NOTIFIER=true
PNPM_DISABLE_UPDATE_CHECK=true

// Set authentication
PNPM_AUTH_TOKEN=your-auth-token
PNPM_REGISTRY_USERNAME=username
PNPM_REGISTRY_PASSWORD=password

// Environment-specific configuration
NODE_ENV=production
PNPM_PRODUCTION_ONLY=true
*/

export const pnpmExamples = {
  description: "Examples of using pnpm for package management in JavaScript projects",
  installation: "npm install -g pnpm",
  commonCommands: [
    "pnpm install - Install dependencies",
    "pnpm add - Add packages",
    "pnpm remove - Remove packages",
    "pnpm update - Update packages",
    "pnpm run - Execute scripts",
    "pnpm audit - Check security"
  ],
  configuration: [
    "package.json - Project configuration",
    ".pnpmrc - pnpm configuration",
    "pnpm-workspace.yaml - Workspace configuration",
    "Environment variables"
  ],
  features: [
    "Efficient disk usage",
    "Fast installation",
    "Workspaces support",
    "Content-addressable storage",
    "Strict peer dependencies",
    "Package overrides",
    "Monorepo support"
  ],
  bestPractices: [
    "Use pnpm-workspace.yaml for monorepos",
    "Enable strict peer dependencies",
    "Regular security audits",
    "Use pnpm store efficiently",
    "Configure scripts for common tasks",
    "Use filtering in workspaces"
  ]
};