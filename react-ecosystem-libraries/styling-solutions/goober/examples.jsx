import React, { useState } from 'react';

// Goober Examples - Educational Examples for Goober
// Note: Goober is a small CSS-in-JS library with a focus on performance

export default function GooberExamples() {
  const [activeExample, setActiveExample] = useState('basic-styling');

  return (
    <div className="examples-container">
      <h1>Goober Examples</h1>
      <p className="intro">
        Goober is a small CSS-in-JS library with a focus on performance. It provides a simple API for creating and managing styles in JavaScript applications.
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
      <h2>Basic Styling with Goober</h2>
      <p>Creating and using basic styles with Goober.</p>
      
      <div className="code-block">
        <h3>Creating Style Objects</h3>
        <pre>
{`import { styled, css } from 'goober';

// Create CSS objects
const buttonStyle = css\`
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
\`;

const containerStyle = css\`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
\`;

const titleStyle = css\`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
\`;

// Create styled components
const Button = styled('button')\`
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #0056b3;
  }
\`;

const Container = styled('div')\`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
\`;

// Use components
function App() {
  return (
    <Container>
      <h1 className={titleStyle}>Welcome to Goober</h1>
      <Button onClick={() => alert('Button clicked!')}>
        Click Me
      </Button>
    </Container>
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Using CSS Objects</h3>
        <pre>
{`import { css } from 'goober';

// Define CSS objects
const styles = {
  container: css\`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  \`,
  header: css\`
    background-color: #343a40;
    color: white;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  \`,
  title: css\`
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  \`,
  content: css\`
    background-color: white;
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  \`,
};

// Use styles
function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My App</h1>
      </header>
      <main className={styles.content}>
        <p>Welcome to my app!</p>
      </main>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

// Dynamic Styles Example
function DynamicStylesExample() {
  return (
    <div className="example-section">
      <h2>Dynamic Styles with Goober</h2>
      <p>Creating dynamic styles based on props and state.</p>
      
      <div className="code-block">
        <h3>Props-based Styling</h3>
        <pre>
{`import { styled } from 'goober';

// Create a styled component with dynamic styles
const Button = styled('button')\`
  background-color: \${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  padding: \${props => props.size === 'large' ? '12px 24px' : '8px 16px'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  opacity: \${props => props.disabled ? 0.6 : 1};
  pointer-events: \${props => props.disabled ? 'none' : 'auto'};
  
  &:hover {
    background-color: \${props => props.primary ? '#0056b3' : '#5a6268'};
  }
\`;

// Use the component
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
import { styled, css } from 'goober';

// Create a styled component with state-based styles
const Input = styled('input')\`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
\`;

// Create a style object for dynamic styling
const errorStyle = css\`
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
\`;

// Component with state-based styling
function FormField({ label, error }) {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <label>{label}</label>
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={error ? errorStyle : ''}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

// Use the component
function App() {
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const validateEmail = (value) => {
    if (!value.includes('@')) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };
  
  const validatePassword = (value) => {
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
  };
  
  return (
    <div>
      <FormField 
        label="Email" 
        error={emailError}
        onChange={(e) => validateEmail(e.target.value)}
      />
      <FormField 
        label="Password" 
        error={passwordError}
        onChange={(e) => validatePassword(e.target.value)}
      />
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
      <h2>Component Composition with Goober</h2>
      <p>Composing styles and creating reusable style functions.</p>
      
      <div className="code-block">
        <h3>Style Composition</h3>
        <pre>
{`import { styled, css } from 'goober';

// Base styles
const baseTextStyle = css\`
  font-family: Arial, sans-serif;
  line-height: 1.5;
  color: #333;
\`;

const baseButtonStyle = css\`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
\`;

// Composed styles
const headingStyle = css\`
  \${baseTextStyle}
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
\`;

const paragraphStyle = css\`
  \${baseTextStyle}
  font-size: 16px;
  margin-bottom: 16px;
\`;

const primaryButtonStyle = css\`
  \${baseButtonStyle}
  background-color: #007bff;
  color: white;
  
  &:hover {
    background-color: #0056b3;
  }
\`;

const secondaryButtonStyle = css\`
  \${baseButtonStyle}
  background-color: #6c757d;
  color: white;
  
  &:hover {
    background-color: #5a6268;
  }
\`;

// Components using composed styles
function Heading({ children }) {
  return <h1 className={headingStyle}>{children}</h1>;
}

function Paragraph({ children }) {
  return <p className={paragraphStyle}>{children}</p>;
}

function PrimaryButton({ children, onClick }) {
  return (
    <button className={primaryButtonStyle} onClick={onClick}>
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button className={secondaryButtonStyle} onClick={onClick}>
      {children}
    </button>
  );
}

// Use components
function App() {
  return (
    <div>
      <Heading>Welcome to Goober</Heading>
      <Paragraph>
        This is an example of component composition with Goober.
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
      <h2>Theme Provider with Goober</h2>
      <p>Creating and using themes with Goober.</p>
      
      <div className="code-block">
        <h3>Creating a Theme</h3>
        <pre>
{`import React, { createContext, useContext } from 'react';
import { css } from 'goober';

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
const buttonStyle = (theme) => css\`
  background-color: \${theme.colors.primary};
  color: white;
  padding: \${theme.spacing.medium};
  border: none;
  border-radius: \${theme.borderRadius};
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: \${theme.colors.secondary};
  }
\`;

const containerStyle = (theme) => css\`
  background-color: \${theme.colors.background};
  color: \${theme.colors.text};
  min-height: 100vh;
  padding: \${theme.spacing.large};
  transition: background-color 0.2s, color 0.2s;
\`;

// Component using theme
function ThemedButton({ children, onClick }) {
  const theme = useTheme();
  
  return (
    <button 
      className={buttonStyle(theme)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ThemedContainer({ children }) {
  const theme = useTheme();
  
  return (
    <div className={containerStyle(theme)}>
      {children}
    </div>
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
      <ThemedContainer>
        <h1>Themed App</h1>
        <p>This app uses a theme provider with Goober.</p>
        <ThemedButton onClick={toggleTheme}>
          Toggle to {isDark ? 'Light' : 'Dark'} Theme
        </ThemedButton>
      </ThemedContainer>
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
      <h2>Responsive Design with Goober</h2>
      <p>Creating responsive styles with Goober.</p>
      
      <div className="code-block">
        <h3>Media Queries</h3>
        <pre>
{`import { css } from 'goober';

// Style with media queries
const containerStyle = css\`
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 8px;
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 12px;
  }
\`;

const gridStyle = css\`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
\`;

// Component using responsive styles
function Container({ children }) {
  return <div className={containerStyle}>{children}</div>;
}

function Grid({ children }) {
  return <div className={gridStyle}>{children}</div>;
}

function Card({ title, content }) {
  const cardStyle = css\`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    
    @media (max-width: 768px) {
      padding: 12px;
    }
  \`;
  
  return (
    <div className={cardStyle}>
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
      <h2>Animations with Goober</h2>
      <p>Creating animations with Goober.</p>
      
      <div className="code-block">
        <h3>Basic Animations</h3>
        <pre>
{`import { css, keyframes } from 'goober';

// Define keyframes
const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const slideIn = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(0)' },
});

const pulse = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.1)' },
  '100%': { transform: 'scale(1)' },
});

// Animation styles
const fadeInStyle = css\`
  animation: fadeIn 0.5s ease-in-out;
\`;

const slideInStyle = css\`
  animation: slideIn 0.5s ease-out;
\`;

const pulseStyle = css\`
  animation: pulse 2s infinite;
\`;

// Animated components
function FadeIn({ children }) {
  return <div className={fadeInStyle}>{children}</div>;
}

function SlideIn({ children }) {
  return <div className={slideInStyle}>{children}</div>;
}

function Pulse({ children }) {
  return <div className={pulseStyle}>{children}</div>;
}

// Usage
function App() {
  return (
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
  );
}`}
        </pre>
      </div>

      <div className="code-block">
        <h3>Hover and Transitions</h3>
        <pre>
{`import { css } from 'goober';

// Hover and transition styles
const buttonStyle = css\`
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
\`;

const cardStyle = css\`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: all 0.3s ease;
  transform: scale(1);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
\`;

// Components with hover effects
function Button({ children }) {
  return <button className={buttonStyle}>{children}</button>;
}

function Card({ title, content }) {
  return (
    <div className={cardStyle}>
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

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}
`;
document.head.appendChild(style);