/**
 * NPM Examples
 * 
 * NPM (Node Package Manager) is the default package manager for Node.js.
 * It's used to install, share, and distribute code packages.
 */

// Example 1: Basic package.json structure
/*
{
  "name": "my-react-app",
  "version": "1.0.0",
  "description": "A sample React application",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
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
  "keywords": [
    "react",
    "javascript",
    "web-app"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-react-app.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/my-react-app/issues"
  },
  "homepage": "https://github.com/yourusername/my-react-app#readme"
}
*/

// Example 2: Common NPM commands
/*
// Install dependencies
npm install
npm install react
npm install react@17.0.0  // Install specific version
npm install react@latest     // Install latest version
npm install react --save-dev // Install as dev dependency

// Install from package.json
npm install

// Update dependencies
npm update
npm update react

// Uninstall packages
npm uninstall react
npm remove react

// Global packages
npm install -g create-react-app
npm list -g

// Run scripts
npm run start
npm run build
npm test

// Package information
npm list
npm list react
npm outdated
npm info react
npm view react
*/

// Example 3: Semantic versioning with NPM
/*
// Version formats:
// major.minor.patch
// 1.0.0 - Major version (breaking changes)
// 1.1.0 - Minor version (new features)
// 1.1.1 - Patch version (bug fixes)

// Version ranges in package.json:
{
  "dependencies": {
    "react": "^18.2.0",    // Compatible with 18.x.x but not 19.x.x
    "react-dom": "~18.2.0",   // Compatible with 18.2.x but not 18.3.x
    "axios": "1.3.0",        // Exact version
    "lodash": ">=4.0.0",     // Version 4.0.0 or higher
    "moment": "<3.0.0",       // Any version below 3.0.0
    "express": "4.x.x",        // Any 4.x.x version
    "webpack": "4 || 5"       // Version 4 or 5
  }
}

// Publishing with semantic versioning:
npm version patch    // 1.0.0 -> 1.0.1
npm version minor    // 1.0.1 -> 1.1.0
npm version major    // 1.1.0 -> 2.0.0
npm version 1.2.3   // Set specific version
*/

// Example 4: NPM scripts for React development
/*
{
  "scripts": {
    // Development
    "start": "react-scripts start",
    "dev": "webpack serve --mode development",
    
    // Building
    "build": "react-scripts build",
    "build:prod": "NODE_ENV=production webpack --mode production",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    
    // Testing
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:ci": "react-scripts test --coverage --watchAll=false --ci",
    
    // Linting and formatting
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,css,md}",
    "format:check": "prettier --check src/**/*.{js,jsx,ts,tsx,css,md}",
    
    // Pre-commit hooks
    "precommit": "lint-staged",
    "prepare": "husky install",
    
    // Deployment
    "deploy": "npm run build && gh-pages -d build",
    "deploy:staging": "npm run build:prod && aws s3 sync build/ s3://staging-bucket/",
    "deploy:production": "npm run build:prod && aws s3 sync build/ s3://production-bucket/",
    
    // Utilities
    "clean": "rimraf build dist coverage",
    "reset": "npm run clean && rm -rf node_modules package-lock.json && npm install",
    "deps:check": "npm-check-updates",
    "deps:update": "npm-check-updates -u"
  }
}
*/

// Example 5: NPM configuration files
/*
// .npmrc - NPM configuration
registry=https://registry.npmjs.org/
//registry=https://company-registry.com/
//username=your-username
//_authToken=your-auth-token
//email=your-email@example.com

// .npmignore - Files to ignore when publishing
node_modules
build
dist
coverage
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
.vscode
.idea
*.log
*/

// Example 6: Private packages and scoped packages
/*
// Private package (not published to NPM registry)
{
  "name": "@mycompany/my-private-package",
  "version": "1.0.0",
  "private": true,
  "description": "Internal company package"
}

// Scoped package
{
  "name": "@myusername/my-package",
  "version": "1.0.0",
  "description": "My public scoped package"
}

// Installing scoped packages
npm install @myusername/my-package
npm install @mycompany/my-private-package

// Publishing scoped packages
npm publish --access public    // For public scoped packages
npm publish                 // For private scoped packages
*/

// Example 7: NPM workspaces (monorepos)
/*
// Root package.json
{
  "name": "my-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "install:all": "npm install && npm run install:packages",
    "install:packages": "npm install --workspaces",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "clean": "npm run clean --workspaces && rimraf node_modules",
    "dev": "concurrently \"npm run dev --workspace=packages/app\" \"npm run dev --workspace=packages/ui\""
  }
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
npm install

// Running scripts in specific workspace
npm run build --workspace=packages/app
npm run test --workspace=@my-monorepo/ui
*/

// Example 8: NPM hooks and lifecycle scripts
/*
{
  "scripts": {
    "preinstall": "echo Installing dependencies...",
    "install": "echo Dependencies installed successfully!",
    "postinstall": "echo Running post-install setup...",
    "prepublishOnly": "npm run build && npm run test",
    "prepublish": "echo About to publish package...",
    "publish": "echo Publishing package...",
    "postpublish": "echo Package published successfully!",
    "preversion": "npm run test && npm run lint",
    "version": "echo Version updated to $npm_package_version",
    "postversion": "git push && git push --tags"
  }
}

// Lifecycle execution order:
// npm install: preinstall -> install -> postinstall
// npm publish: prepublishOnly -> prepublish -> publish -> postpublish
// npm version: preversion -> version -> postversion
*/

// Example 9: NPM audit and security
/*
// Check for security vulnerabilities
npm audit

// Fix vulnerabilities automatically
npm audit fix

// Fix only production dependencies
npm audit fix --production

// Force fix (may break changes)
npm audit fix --force

// Check for known vulnerabilities in specific package
npm audit react

// Generate audit report in JSON format
npm audit --json

// Exclude dev dependencies from audit
npm audit --production

// Set audit level
npm audit --audit-level moderate
npm audit --audit-level high
*/

// Example 10: NPM caching and performance
/*
// Clean NPM cache
npm cache clean --force

// Verify cache integrity
npm cache verify

// View cache statistics
npm cache ls

// Configure cache location
npm config set cache /path/to/cache

// Disable cache
npm config set cache false

// Use offline mode
npm install --offline

// Prefer offline cache
npm install --prefer-offline

// Check cache for package
npm cache verify react
*/

// Example 11: Publishing to NPM
/*
// Prepare package for publishing
npm run build
npm run test
npm run lint

// Check package content
npm pack --dry-run

// Create package tarball
npm pack

// Publish to NPM registry
npm publish

// Publish with tag
npm publish --tag beta

// Publish from specific directory
npm publish dist/

// Publish with access level
npm publish --access public
npm publish --access restricted

// Publish with registry
npm publish --registry=https://company-registry.com/

// Unpublish package
npm unpublish my-package
npm unpublish my-package@1.0.0
*/

// Example 12: NPM configuration management
/*
// Set configuration
npm config set init-author-name "Your Name"
npm config set init-author-email "your.email@example.com"
npm config set init-license "MIT"
npm config set init-version "1.0.0"

// Get configuration
npm config get registry
npm config list

// Edit configuration
npm config edit

// Delete configuration
npm config delete registry

// Project-specific configuration (.npmrc)
registry=https://registry.npmjs.org/
@mycompany:registry=https://company-registry.com/
//registry=:username
//registry=:_authToken

// Environment variables
NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
NPM_CONFIG_USERNAME=username
NPM_CONFIG_PASSWORD=password
NPM_CONFIG_EMAIL=email@example.com
*/

export const npmExamples = {
  description: "Examples of using NPM for package management in JavaScript projects",
  installation: "NPM comes with Node.js installation",
  commonCommands: [
    "npm install - Install dependencies",
    "npm uninstall - Remove packages",
    "npm update - Update packages",
    "npm run - Execute scripts",
    "npm publish - Publish packages",
    "npm audit - Check security"
  ],
  configuration: [
    "package.json - Project configuration",
    ".npmrc - NPM configuration",
    ".npmignore - Publish ignore file",
    "npm config - Global configuration"
  ],
  features: [
    "Semantic versioning",
    "Dependency management",
    "Script execution",
    "Package publishing",
    "Security auditing",
    "Workspaces support",
    "Caching system"
  ],
  bestPractices: [
    "Use semantic versioning",
    "Lock dependencies with package-lock.json",
    "Regular security audits",
    "Use .npmignore for publishing",
    "Configure scripts for common tasks",
    "Use workspaces for monorepos"
  ]
};