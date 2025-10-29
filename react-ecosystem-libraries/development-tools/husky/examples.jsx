/**
 * Husky Examples
 * 
 * Husky is a tool that helps you manage Git hooks easily.
 * Git hooks are scripts that run automatically before or after events such as:
 * commit, push, receive, etc. Husky makes it easy to set up these hooks in your project.
 */

// Example 1: Setting up Husky in package.json
/*
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
*/

// Example 2: Pre-commit hook to run linting and tests
/*
// .husky/pre-commit file
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint

# Run tests
npm run test

# If any of the above commands fail, the commit will be aborted
*/

// Example 3: Commit message validation
/*
// .husky/commit-msg file
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate commit message follows conventional commit format
# e.g., feat: add new feature, fix: resolve bug, docs: update documentation
npx --no -- commitlint --edit ${1}
*/

// Example 4: Custom hook to check for sensitive data before commit
/*
// .husky/pre-commit file
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for potential secrets or sensitive data
if git diff --cached --name-only | xargs grep -l "password\|secret\|token\|api_key" 2>/dev/null; then
  echo "⚠️  Warning: Potential sensitive data detected in staged files!"
  echo "Please review and remove any sensitive information before committing."
  exit 1
fi
*/

// Example 5: Post-checkout hook to install dependencies when switching branches
/*
// .husky/post-checkout file
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check if package.json has changed
if [ "$1" != "0000000000000000000000000000000000000000" ] && [ "$2" != "0000000000000000000000000000000000000000" ]; then
  CHANGED_FILES=$(git diff --name-only $1 $2 | grep package.json)
  
  if [ ! -z "$CHANGED_FILES" ]; then
    echo "📦 package.json has changed, installing dependencies..."
    npm install
  fi
fi
*/

// Example 6: Installing Husky in a project
/*
// Terminal commands to set up Husky
npm install husky --save-dev

// Initialize Husky
npx husky install

// Add a hook
npx husky add .husky/pre-commit "npm run lint"

// Make the hook executable
chmod +x .husky/pre-commit
*/

// Example 7: Using Husky with lint-staged for better performance
/*
// package.json configuration
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{css,scss,less}": [
      "stylelint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
*/

// Example 8: Husky with TypeScript project
/*
// .husky/pre-commit file
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format

# Run tests
npm run test
*/

// Example 9: Conditional hooks based on branch
/*
// .husky/pre-commit file
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Get current branch name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# Run additional checks on main branch
if [ "$BRANCH_NAME" = "main" ] || [ "$BRANCH_NAME" = "master" ]; then
  echo "🔒 On main branch, running additional checks..."
  npm run test:coverage
  npm run build
fi

# Always run linting
npm run lint
*/

// Example 10: Husky with CI/CD integration
/*
// .husky/pre-push file
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run full test suite before pushing to remote
npm run test:full

# Check if build is successful
npm run build

# Notify team of push (optional)
# curl -X POST -H 'Content-type: application/json' \
#   --data '{"text":"New code pushed to remote!"}' \
#   YOUR_SLACK_WEBHOOK_URL
*/

export const huskyExamples = {
  description: "Examples of using Husky for Git hooks in React projects",
  setup: "npm install husky --save-dev && npx husky install",
  commonHooks: [
    "pre-commit: Run linting, tests, and formatting before committing",
    "commit-msg: Validate commit message format",
    "pre-push: Run full test suite before pushing to remote",
    "post-checkout: Install dependencies when package.json changes"
  ]
};