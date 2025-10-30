# TypeScript Development Environment

This is a comprehensive TypeScript development environment with modern tooling, testing, and linting configurations.

## Features

- **TypeScript** with strict type checking
- **Jest** for testing with TypeScript support
- **ESLint** with TypeScript-specific rules
- **Prettier** for code formatting
- **Path aliases** for clean imports
- **Comprehensive configuration** for production-ready development

## Project Structure

```
typescript/
├── src/
│   ├── index.ts              # Main entry point
│   └── types/
│       └── global.d.ts       # Global type declarations
├── tests/
│   ├── setup.ts              # Jest setup file
│   └── index.test.ts         # Example test file
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── jest.config.js            # Jest configuration
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the project
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Configuration

### TypeScript

The TypeScript configuration is set up with strict type checking and modern features:

- Strict mode enabled
- Path aliases configured for clean imports
- Comprehensive type checking rules
- Modern ES2020 target

### Jest

Jest is configured with:

- TypeScript support via ts-jest
- Coverage reporting
- Path mapping
- Mock setup for browser APIs
- Custom matchers from @testing-library/jest-dom

### ESLint

ESLint is configured with:

- TypeScript support
- React rules (if using React)
- Security rules
- Code quality rules
- Best practices

### Prettier

Prettier is configured with:

- Consistent formatting
- File-specific overrides
- Integration with ESLint

## Path Aliases

The following path aliases are configured:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@utils/*` → `src/utils/*`
- `@hooks/*` → `src/hooks/*`
- `@types/*` → `src/types/*`
- `@config/*` → `src/config/*`
- `@assets/*` → `src/assets/*`
- `@styles/*` → `src/styles/*`
- `@tests/*` → `tests/*`

## Testing

The project includes a comprehensive testing setup with:

- Unit tests with Jest
- TypeScript support
- Mock setup for browser APIs
- Coverage reporting
- Custom matchers

### Writing Tests

```typescript
import { greet } from '../src/index';

describe('greet function', () => {
  it('should return a greeting message', () => {
    const result = greet('TypeScript');
    expect(result).toBe('Hello, TypeScript!');
  });
});
```

## Development Workflow

1. Create your TypeScript files in the `src/` directory
2. Write tests in the `tests/` directory
3. Use path aliases for clean imports
4. Run tests to ensure code quality
5. Use ESLint and Prettier for code consistency
6. Build the project for production

## Best Practices

- Use TypeScript's strict type checking
- Write tests for all functions and classes
- Use path aliases for clean imports
- Follow ESLint rules for code quality
- Use Prettier for consistent formatting
- Keep dependencies up to date

## Troubleshooting

### TypeScript Errors

If you encounter TypeScript errors:

1. Check the `tsconfig.json` configuration
2. Ensure all dependencies are installed
3. Verify path mappings are correct

### Jest Errors

If you encounter Jest errors:

1. Check the `jest.config.js` configuration
2. Ensure test files follow the naming convention
3. Verify the setup file is correctly configured

### ESLint Errors

If you encounter ESLint errors:

1. Check the `.eslintrc.js` configuration
2. Ensure all dependencies are installed
3. Run `npm run lint:fix` to auto-fix issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for your changes
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.