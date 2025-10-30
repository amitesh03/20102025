# Styled Components with TypeScript

Styled Components is a CSS-in-JS library that enables writing CSS directly in JavaScript/TypeScript. This folder demonstrates TypeScript integration with Styled Components for type-safe styling.

## TypeScript Benefits with Styled Components

1. **Typed Props**: Type-safe component props
2. **Theme Typing**: Type-safe theme objects
3. **Styled Component Typing**: Properly typed styled components
4. **CSS Prop Typing**: Type-safe CSS properties
5. **Attribute Typing**: Type-safe HTML attributes

## Key TypeScript Concepts

- **Styled Component Types**: Defining typed styled components
- **Theme Interface**: Creating typed theme objects
- **Generic Components**: Building reusable typed components
- **CSS Prop Typing**: Type-safe CSS properties
- **Attribute Typing**: Type-safe HTML attributes

## Installation

```bash
npm install styled-components
npm install @types/styled-components
npm install @types/react @types/react-dom
```

## Basic Usage

```typescript
import styled from 'styled-components';

// Define theme interface
interface Theme {
  colors: {
    primary: string;
    secondary: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

// Create typed styled component
const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary : theme.colors.secondary
  };
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

// Use with TypeScript
const App = () => {
  return (
    <Button variant="primary">
      Click me
    </Button>
  );
};
```

## Advanced Patterns

- **Generic Styled Components**: Creating reusable typed components
- **Theme Provider**: Type-safe theme context
- **CSS Prop Typing**: Type-safe CSS properties
- **Styled Component Composition**: Building complex typed components
- **Animation Typing**: Type-safe animations