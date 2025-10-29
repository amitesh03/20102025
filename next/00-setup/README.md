# Next.js Setup and Installation

This section covers the initial setup and installation process for Next.js development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.17 or later (Download from [nodejs.org](https://nodejs.org/))
- **npm**: Comes with Node.js, or you can use **yarn** as an alternative
- **Code Editor**: Visual Studio Code (recommended) with these extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - Auto Rename Tag

## Creating a New Next.js Application

### Method 1: Using `create-next-app` (Recommended)

```bash
npx create-next-app@latest my-next-app
```

During installation, you'll be asked several questions:

```
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like to use `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the default import alias? … No / Yes
```

For beginners, we recommend these settings:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: No (for simplicity)
- App Router: Yes (latest Next.js approach)
- Import alias: No (for simplicity)

### Method 2: Manual Setup

```bash
# Create a new directory
mkdir my-next-app
cd my-next-app

# Initialize npm project
npm init -y

# Install Next.js, React, and React DOM
npm install next react react-dom

# Install development dependencies
npm install -D typescript @types/react @types/node eslint eslint-config-next
```

Then create the following files:

#### package.json scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Running Your Application

```bash
# Start the development server
npm run dev

# Open your browser and navigate to http://localhost:3000
```

## Project Structure

After setup, your project should have this structure:

```
my-next-app/
├── app/                    # App Router directory
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── node_modules/
├── public/                 # Static assets
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Environment Variables

Create a `.env.local` file in the root of your project for environment variables:

```
# Example environment variables
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Common Issues and Solutions

### Issue: "Module not found" error
- Solution: Make sure all dependencies are installed with `npm install`

### Issue: Port already in use
- Solution: Either stop the process using that port or specify a different port:
  ```bash
  npm run dev -- -p 3001
  ```

### Issue: TypeScript errors
- Solution: Make sure your `tsconfig.json` is properly configured

## Next Steps

Once your setup is complete, proceed to the beginner examples in the `01-beginner` directory to start learning Next.js concepts.