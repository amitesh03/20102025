import React, { useState } from 'react';

// Fela Examples - Educational Examples for Fela
// Note: Fela is a function-based styling library for React

export default function FelaExamples() {
  const [activeExample, setActiveExample] = useState('basic-styling');

  return (
    <div className="examples-container">
      <h1>Fela Examples</h1>
      <p className="intro">
        Fela is a function-based styling library for React that uses JavaScript functions to generate styles, providing a more dynamic and maintainable approach to styling.
      </p>
      
      <div className="example-nav">
        <button onClick={() => setActiveExample('basic-styling')} className={activeExample === 'basic-styling' ? 'active' : ''}>
          Basic Styling
        </button>
        <button onClick={() => setActiveExample('dynamic-styles')} className={activeExample === 'dynamic-styles' ? 'active' : ''}>
          Dynamic Styles
        </button>
        <button onClick={() => setActiveExample('component-composition')} className={activeExample === 'component-composition' ? 'active' : ''}>
          Component Composition
        </button>
        <button onClick={() => setActiveExample('theme-provider')} className={activeExample === 'theme-provider' ? 'active' : ''}>
          Theme Provider
        </button>
        <button onClick={() => setActiveExample('responsive-design')} className={activeExample === 'responsive-design' ? 'active' : ''}>
          Responsive Design
        </button>
        <button onClick={() => setActiveExample('animations')} className={activeExample === 'animations' ? 'active' : ''}>
          Animations
        </button>
      </div>

      <div className="example-content">
        {activeExample === 'basic-styling' && <BasicStylingExample />}
        {activeExample === 'dynamic-styles' && <DynamicStylesExample />}
        {activeExample === 'component-composition' && <ComponentCompositionExample />}
        {activeExample === 'theme-provider' && <ThemeProviderExample />}
        {activeExample === 'responsive-design' && <ResponsiveDesignExample />}
        {activeExample === 'animations' && <AnimationsExample />}
      </div>
    </div>
  );
}

// Basic Styling Example
function BasicStylingExample() {
  return (
    <div className="example-section">
      <h2>Basic Styling with Fela</h2>
      <p>Creating and using basic style functions with Fela.</p>
      
      <div className="code-block">
        <h3>Creating Style Functions</h3>
        <pre>
{`import { createRenderer, render } from 'fela';
import { renderToString } from 'fela-tools';
import React from 'react';

// Create a renderer
const renderer = createRenderer();

// Define style functions
const buttonStyle = () => ({
  backgroundColor: '#007bff',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
});

const containerStyle = () => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: '#f8f9fa',
});

const titleStyle = () => ({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '16px',
});

// Create styled components
const Button = ({ children, onClick }) => {
  const style = renderer.renderRule(buttonStyle);
  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
};

const Container = ({ children }) => {
  const style = renderer.renderRule(containerStyle);
  return <div style={style}>{children}</div>;
};

const Title = ({ children }) => {
  const style = renderer.renderRule(titleStyle);
  return <h1 style={style}>{children}</h1>;
};

// Use components
function App() {
  return (
    <Container>
      <Title>Welcome to Fela</Title>
      <Button onClick={() => alert('Button clicked!')}>
        Click Me
      </Button>
    </Container>
  );
}

// For server-side rendering
const html = renderToString(<App />);`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Using Fela with React</h3>
        <pre>
{`import React from 'react';
import { RendererProvider, useFela } from 'react-fela';
import { createRenderer } from 'fela';

// Create a renderer
const renderer = createRenderer();

// Define style functions
const cardStyle = () => ({
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  padding: '16px',
  maxWidth: '300px',
  margin: '0 auto',
});

const titleStyle = () => ({
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '8px',
});

const descriptionStyle = () => ({
  fontSize: '14px',
  color: '#666',
  lineHeight: '1.5',
});

// Create components using useFela hook
function Card({ title, description }) {
  const { css } = useFela();
  
  return (
    <div className={css(cardStyle)}>
      <h2 className={css(titleStyle)}>{title}</h2>
      <p className={css(descriptionStyle)}>{description}</p>
    </div>
  );
}

function App() {
  return (
    <RendererProvider renderer={renderer}>
      <Card 
        title="Hello Fela"
        description="This is a card component styled with Fela."
      />
    </RendererProvider>
  );
}

export default App;`}
        </pre>
      </div>
    </div>
  );
}

// Dynamic Styles Example
function DynamicStylesExample() {
  return (
    <div className="example-section">
      <h2>Dynamic Styles with Fela</h2>
      <p>Creating dynamic styles based on props and state.</p>
      
      <div className="code-block">
        <h3>Props-based Styling</h3>
        <pre>
{`import React from 'react';
import { useFela } from 'react-fela';

// Style function that accepts props
const buttonStyle = (props) => ({
  backgroundColor: props.primary ? '#007bff' : '#6c757d',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: props.size === 'large' ? '16px' : '14px',
  opacity: props.disabled ? 0.6 : 1,
});

// Component with dynamic styling
function Button({ children, primary, size, disabled, onClick }) {
  const { css } = useFela();
  
  return (
    <button 
      className={css(buttonStyle, { primary, size, disabled })}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Usage
function App() {
  return (
    <div>
      <Button>Default Button</Button>
      <Button primary>Primary Button</Button>
      <Button size="large">Large Button</Button>
      <Button disabled>Disabled Button</Button>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>State-based Styling</h3>
        <pre>
{`import React, { useState } from 'react';
import { useFela } from 'react-fela';

// Style function that accepts state
const inputStyle = (props) => ({
  padding: '8px 12px',
  border: props.focused ? '2px solid #007bff' : '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s',
});

// Component with state-based styling
function Input({ placeholder }) {
  const [focused, setFocused] = useState(false);
  const { css } = useFela();
  
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={css(inputStyle, { focused })}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

// Usage
function App() {
  return (
    <div>
      <Input placeholder="Enter your name" />
      <Input placeholder="Enter your email" />
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Component Composition Example
function ComponentCompositionExample() {
  return (
    <div className="example-section">
      <h2>Component Composition with Fela</h2>
      <p>Composing styles and creating reusable style functions.</p>
      
      <div className="code-block">
        <h3>Style Composition</h3>
        <pre>
{`import { useFela } from 'react-fela';

// Base styles
const baseTextStyle = () => ({
  fontFamily: 'Arial, sans-serif',
  lineHeight: '1.5',
});

const baseButtonStyle = () => ({
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  transition: 'all 0.2s',
});

// Composed styles
const headingStyle = () => ({
  ...baseTextStyle(),
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '16px',
});

const paragraphStyle = () => ({
  ...baseTextStyle(),
  fontSize: '16px',
  color: '#666',
  marginBottom: '16px',
});

const primaryButtonStyle = () => ({
  ...baseButtonStyle(),
  backgroundColor: '#007bff',
  color: 'white',
});

const secondaryButtonStyle = () => ({
  ...baseButtonStyle(),
  backgroundColor: '#6c757d',
  color: 'white',
});

// Components using composed styles
function Heading({ children }) {
  const { css } = useFela();
  return <h1 className={css(headingStyle)}>{children}</h1>;
}

function Paragraph({ children }) {
  const { css } = useFela();
  return <p className={css(paragraphStyle)}>{children}</p>;
}

function PrimaryButton({ children, onClick }) {
  const { css } = useFela();
  return (
    <button className={css(primaryButtonStyle)} onClick={onClick}>
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  const { css } = useFela();
  return (
    <button className={css(secondaryButtonStyle)} onClick={onClick}>
      {children}
    </button>
  );
}

// Usage
function App() {
  return (
    <div>
      <Heading>Welcome to Fela</Heading>
      <Paragraph>
        This is an example of component composition with Fela.
      </Paragraph>
      <PrimaryButton onClick={() => alert('Primary clicked!')}>
        Primary Action
      </PrimaryButton>
      <SecondaryButton onClick={() => alert('Secondary clicked!')}>
        Secondary Action
      </SecondaryButton>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Theme Provider Example
function ThemeProviderExample() {
  return (
    <div className="example-section">
      <h2>Theme Provider with Fela</h2>
      <p>Creating and using themes with Fela.</p>
      
      <div className="code-block">
        <h3>Creating a Theme</h3>
        <pre>
{`import React, { createContext, useContext } from 'react';
import { RendererProvider, useFela } from 'react-fela';

// Define themes
const lightTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#333333',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: '4px',
};

const darkTheme = {
  colors: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    background: '#1a1a1a',
    text: '#f8f9fa',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: '4px',
};

// Create theme context
const ThemeContext = createContext(lightTheme);

// Theme provider component
function ThemeProvider({ children, theme }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme
function useTheme() {
  return useContext(ThemeContext);
}

// Style function that uses theme
const buttonStyle = (theme) => () => ({
  backgroundColor: theme.colors.primary,
  color: 'white',
  padding: theme.spacing.medium,
  border: 'none',
  borderRadius: theme.borderRadius,
  cursor: 'pointer',
});

// Component using theme
function ThemedButton({ children }) {
  const theme = useTheme();
  const { css } = useFela();
  
  return (
    <button className={css(buttonStyle(theme))}>
      {children}
    </button>
  );
}

// Usage
function App() {
  const [isDark, setIsDark] = React.useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <div style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        minHeight: '100vh',
        padding: theme.spacing.large,
      }}>
        <ThemedButton>Themed Button</ThemedButton>
        <button onClick={toggleTheme}>
          Toggle to {isDark ? 'Light' : 'Dark'} Theme
        </button>
      </div>
    </ThemeProvider>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Responsive Design Example
function ResponsiveDesignExample() {
  return (
    <div className="example-section">
      <h2>Responsive Design with Fela</h2>
      <p>Creating responsive styles with Fela.</p>
      
      <div className="code-block">
        <h3>Media Queries</h3>
        <pre>
{`import { useFela } from 'react-fela';

// Style function with media queries
const containerStyle = () => ({
  padding: '16px',
  maxWidth: '1200px',
  margin: '0 auto',
  // Mobile styles
  '@media (max-width: 768px)': {
    padding: '8px',
  },
  // Tablet styles
  '@media (min-width: 769px) and (max-width: 1024px)': {
    padding: '12px',
  },
});

const gridStyle = () => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '16px',
  // Mobile styles
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    gap: '8px',
  },
});

// Component using responsive styles
function Container({ children }) {
  const { css } = useFela();
  return <div className={css(containerStyle)}>{children}</div>;
}

function Grid({ children }) {
  const { css } = useFela();
  return <div className={css(gridStyle)}>{children}</div>;
}

function Card({ title, content }) {
  const { css } = useFela();
  
  const cardStyle = () => ({
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    // Mobile styles
    '@media (max-width: 768px)': {
      padding: '12px',
    },
  });
  
  return (
    <div className={css(cardStyle)}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

// Usage
function App() {
  return (
    <Container>
      <h1>Responsive Grid Layout</h1>
      <Grid>
        <Card title="Card 1" content="This is the first card in the grid." />
        <Card title="Card 2" content="This is the second card in the grid." />
        <Card title="Card 3" content="This is the third card in the grid." />
        <Card title="Card 4" content="This is the fourth card in the grid." />
      </Grid>
    </Container>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Animations Example
function AnimationsExample() {
  return (
    <div className="example-section">
      <h2>Animations with Fela</h2>
      <p>Creating animations with Fela.</p>
      
      <div className="code-block">
        <h3>Basic Animations</h3>
        <pre>
{`import React, { useState } from 'react';
import { useFela } from 'react-fela';

// Animation styles
const fadeInStyle = () => ({
  animation: 'fadeIn 0.5s ease-in-out',
});

const slideInStyle = () => ({
  animation: 'slideIn 0.5s ease-out',
  transform: 'translateX(-100%)',
});

const pulseStyle = () => ({
  animation: 'pulse 2s infinite',
});

// Define keyframes
const keyframes = {
  fadeIn: {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  slideIn: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(0)' },
  },
  pulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' },
  },
};

// Create renderer with keyframes
const renderer = createRenderer({
  keyframes,
});

// Animated components
function FadeIn({ children }) {
  const { css } = useFela({ renderer });
  return <div className={css(fadeInStyle)}>{children}</div>;
}

function SlideIn({ children }) {
  const { css } = useFela({ renderer });
  return <div className={css(slideInStyle)}>{children}</div>;
}

function Pulse({ children }) {
  const { css } = useFela({ renderer });
  return <div className={css(pulseStyle)}>{children}</div>;
}

// Usage
function App() {
  return (
    <RendererProvider renderer={renderer}>
      <div>
        <FadeIn>
          <h2>Fade In Animation</h2>
        </FadeIn>
        <SlideIn>
          <h2>Slide In Animation</h2>
        </SlideIn>
        <Pulse>
          <h2>Pulse Animation</h2>
        </Pulse>
      </div>
    </RendererProvider>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Hover and Transitions</h3>
        <pre>
{`import React from 'react';
import { useFela } from 'react-fela';

// Hover and transition styles
const buttonStyle = () => ({
  backgroundColor: '#007bff',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#0056b3',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
});

const cardStyle = () => ({
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  padding: '16px',
  transition: 'all 0.3s ease',
  transform: 'scale(1)',
  ':hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
});

// Components with hover effects
function Button({ children }) {
  const { css } = useFela();
  return <button className={css(buttonStyle)}>{children}</button>;
}

function Card({ title, content }) {
  const { css } = useFela();
  return (
    <div className={css(cardStyle)}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

// Usage
function App() {
  return (
    <div>
      <Button>Hover Me</Button>
      <Card 
        title="Hover Card"
        content="This card scales up when you hover over it."
      />
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Add some basic styles for the examples
const style = document.createElement('style');
style.textContent = `
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.intro {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 30px;
}

.example-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.example-nav button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
}

.example-nav button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.example-content {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.example-section h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.code-block {
  margin: 20px 0;
}

.code-block h3 {
  color: #555;
  margin-bottom: 10px;
}

.code-block pre {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
}
`;
document.head.appendChild(style);