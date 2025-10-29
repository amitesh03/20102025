import React, { useState, useEffect } from 'react';
import styled, { 
  ThemeProvider, 
  css, 
  keyframes, 
  Global, 
  useTheme,
  withTheme
} from '@emotion/react';

// Global Styles
const GlobalStyles = Global`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

// Theme Definition
const lightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#333333',
  primaryColor: '#3498db',
  secondaryColor: '#2ecc71',
  accentColor: '#e74c3c',
  borderRadius: '8px',
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};

const darkTheme = {
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff',
  primaryColor: '#3498db',
  secondaryColor: '#2ecc71',
  accentColor: '#e74c3c',
  borderRadius: '8px',
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};

// Keyframe Animations
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// CSS Helper for Shared Styles
const buttonStyles = css`
  padding: ${props => props.theme.spacing.medium} ${props => props.theme.spacing.large};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Basic Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large};
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xlarge};
  padding: ${props => props.theme.spacing.large};
  background-color: ${props => props.theme.backgroundColor};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h1`
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '1.5rem';
      case 'medium': return '2rem';
      case 'large': return '3rem';
      default: return '2.5rem';
    }
  }};
  font-weight: 700;
  color: ${props => props.color || props.theme.textColor};
  margin-bottom: ${props => props.theme.spacing.medium};
  text-align: ${props => props.align || 'left'};
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.8rem;
  }
`;

const Paragraph = styled.p`
  font-size: ${props => props.size === 'small' ? '14px' : props.size === 'large' ? '18px' : '16px'};
  line-height: 1.6;
  color: ${props => props.color || props.theme.textColor};
  margin-bottom: ${props => props.theme.spacing.medium};
  opacity: ${props => props.opacity || 1};

  ${props => props.highlight && css`
    background-color: ${props => props.theme.primaryColor}20;
    padding: ${props => props.theme.spacing.small};
    border-left: 4px solid ${props => props.theme.primaryColor};
  `}
`;

// Button Components
const BaseButton = styled.button`
  ${buttonStyles}
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.primaryColor;
      case 'secondary': return props.theme.secondaryColor;
      case 'accent': return props.theme.accentColor;
      default: return props.theme.primaryColor;
    }
  }};
  color: white;

  ${props => props.outline && css`
    background-color: transparent;
    border: 2px solid ${props => props.theme.primaryColor};
    color: ${props => props.theme.primaryColor};

    &:hover {
      background-color: ${props => props.theme.primaryColor};
      color: white;
    }
  `}

  ${props => props.size === 'small' && css`
    padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
    font-size: 14px;
  `}

  ${props => props.size === 'large' && css`
    padding: ${props => props.theme.spacing.large} ${props => props.theme.spacing.xlarge};
    font-size: 18px;
  `}
`;

const IconButton = styled(BaseButton)`
  padding: ${props => props.theme.spacing.medium};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    animation: ${pulse} 1s infinite;
  }
`;

// Card Components
const Card = styled.div`
  background-color: ${props => props.theme.backgroundColor};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.textColor}20;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  ${props => props.elevated && css`
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  `}

  ${props => props.compact && css`
    padding: ${props => props.theme.spacing.medium};
  `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.medium};
  padding-bottom: ${props => props.theme.spacing.medium};
  border-bottom: 1px solid ${props => props.theme.textColor}20;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.textColor};
  margin: 0;
`;

const CardContent = styled.div`
  color: ${props => props.theme.textColor};
  line-height: 1.6;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  margin-top: ${props => props.theme.spacing.medium};
  padding-top: ${props => props.theme.spacing.medium};
  border-top: 1px solid ${props => props.theme.textColor}20;
`;

// Form Components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.small};
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.textColor};
  margin-bottom: ${props => props.theme.spacing.small};
  display: block;
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.medium};
  border: 2px solid ${props => props.theme.textColor}20;
  border-radius: ${props => props.theme.borderRadius};
  font-size: 16px;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primaryColor};
    box-shadow: 0 0 0 3px ${props => props.theme.primaryColor}30;
  }

  ${props => props.error && css`
    border-color: ${props => props.theme.accentColor};
    box-shadow: 0 0 0 3px ${props => props.theme.accentColor}30;
  `}

  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

const Textarea = styled(Input).withComponent('textarea')`
  resize: vertical;
  min-height: 120px;
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.medium};
  border: 2px solid ${props => props.theme.textColor}20;
  border-radius: ${props => props.theme.borderRadius};
  font-size: 16px;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primaryColor};
    box-shadow: 0 0 0 3px ${props => props.theme.primaryColor}30;
  }

  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

// Layout Components
const Grid = styled.div`
  display: grid;
  gap: ${props => props.gap || props.theme.spacing.medium};
  grid-template-columns: ${props => props.columns || 'repeat(auto-fit, minmax(300px, 1fr))'};

  ${props => props.responsive && css`
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      grid-template-columns: 1fr;
    }
  `}

  ${props => props.columns && css`
    grid-template-columns: repeat(${props => props.columns}, 1fr);
  `}
`;

const Flex = styled.div`
  display: flex;
  gap: ${props => props.gap || props.theme.spacing.medium};
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'flex-start'};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};

  ${props => props.center && css`
    align-items: center;
    justify-content: center;
  `}

  ${props => props.responsive && css`
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      flex-direction: column;
    }
  `}
`;

// Navigation Components
const Nav = styled.nav`
  background-color: ${props => props.theme.backgroundColor};
  padding: ${props => props.theme.spacing.medium} 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0 ${props => props.theme.spacing.small};
`;

const NavLink = styled.a`
  color: ${props => props.theme.textColor};
  text-decoration: none;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background-color: ${props => props.theme.primaryColor}20;
    color: ${props => props.theme.primaryColor};
  }

  ${props => props.active && css`
    background-color: ${props => props.theme.primaryColor};
    color: white;
  `}

  ${props => props.underline && css`
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background-color: ${props => props.theme.primaryColor};
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 80%;
    }
  `}
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.backgroundColor};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.xlarge};
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: ${slideIn} 0.3s ease-out;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  ${props => props.size === 'small' && css`
    max-width: 300px;
    padding: ${props => props.theme.spacing.large};
  `}

  ${props => props.size === 'large' && css`
    max-width: 800px;
    padding: ${props => props.theme.spacing.xlarge};
  `}
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.large};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.textColor};
`;

const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.theme.textColor};
  padding: ${props => props.theme.spacing.small};
  border-radius: ${props => props.theme.borderRadius};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.textColor}20;
  }
`;

// Loading Components
const LoadingSpinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 4px solid ${props => props.theme.textColor}20;
  border-top: 4px solid ${props => props.theme.primaryColor};
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.small};

  & > div {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.theme.primaryColor};
    animation: ${pulse} 1.4s ease-in-out infinite both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }

    &:nth-child(3) {
      animation-delay: 0;
    }
  }
`;

// Badge Component
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background-color: ${props => props.theme.primaryColor};
          color: white;
        `;
      case 'secondary':
        return css`
          background-color: ${props => props.theme.secondaryColor};
          color: white;
        `;
      case 'accent':
        return css`
          background-color: ${props => props.theme.accentColor};
          color: white;
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border: 1px solid ${props => props.theme.primaryColor};
          color: ${props => props.theme.primaryColor};
        `;
      default:
        return css`
          background-color: ${props => props.theme.textColor}20;
          color: ${props => props.theme.textColor};
        `;
    }
  }}

  ${props => props.rounded && css`
    border-radius: 20px;
  `}

  ${props => props.dot && css`
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%;
  `}
`;

// Progress Bar Component
const ProgressBarContainer = styled.div`
  width: 100%;
  height: ${props => props.height || '8px'};
  background-color: ${props => props.theme.textColor}20;
  border-radius: ${props => props.height ? '4px' : props.theme.borderRadius};
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.primaryColor;
      case 'secondary': return props.theme.secondaryColor;
      case 'accent': return props.theme.accentColor;
      default: return props.theme.primaryColor;
    }
  }};
  border-radius: inherit;
  transition: width 0.3s ease;
  width: ${props => props.percentage}%;
  position: relative;

  ${props => props.animated && css`
    animation: ${slideIn} 1s ease-out;
  `}

  ${props => props.striped && css`
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent
    );
    background-size: 1rem 1rem;
    animation: ${slideIn} 1s linear infinite;
  `}
`;

// Tooltip Component
const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.textColor};
  color: ${props => props.theme.backgroundColor};
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  margin-bottom: ${props => props.theme.spacing.small};

  ${props => props.position === 'top' && css`
    bottom: 100%;
  `}

  ${props => props.position === 'bottom' && css`
    top: 100%;
    bottom: auto;
    margin-bottom: 0;
    margin-top: ${props => props.theme.spacing.small};
  `}

  ${props => props.position === 'left' && css`
    right: 100%;
    left: auto;
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
    margin-right: ${props => props.theme.spacing.small};
    margin-bottom: 0;
  `}

  ${props => props.position === 'right' && css`
    left: 100%;
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
    margin-left: ${props => props.theme.spacing.small};
    margin-bottom: 0;
  `}

  &::after {
    content: '';
    position: absolute;
    border: 6px solid transparent;
  }

  ${props => props.position === 'top' && css`
    &::after {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-top-color: ${props => props.theme.textColor};
    }
  `}

  ${props => props.position === 'bottom' && css`
    &::after {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-color: ${props => props.theme.textColor};
    }
  `}

  ${props => props.position === 'left' && css`
    &::after {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-left-color: ${props => props.theme.textColor};
    }
  `}

  ${props => props.position === 'right' && css`
    &::after {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-right-color: ${props => props.theme.textColor};
    }
  `}
`;

const TooltipTrigger = styled.div`
  &:hover + ${TooltipContent} {
    opacity: 1;
    visibility: visible;
  }
`;

// Theme-aware component using withTheme
const ThemedComponent = withTheme(props => {
  const theme = props.theme;
  return (
    <div css={css`
      background-color: ${theme.backgroundColor};
      color: ${theme.textColor};
      padding: ${theme.spacing.large};
      border-radius: ${theme.borderRadius};
      border: 2px solid ${theme.primaryColor};
    `}>
      <h3 css={css`
        color: ${theme.primaryColor};
        margin-bottom: ${theme.spacing.medium};
      `}>
        Themed Component
      </h3>
      <p>
        This component uses the withTheme HOC to access theme values.
      </p>
    </div>
  );
});

// Custom hook for theme access
const useCustomTheme = () => {
  const theme = useTheme();
  return {
    ...theme,
    customColor: '#ff6b6b',
    customSpacing: '20px'
  };
};

// Main App Component
const EmotionExamples = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    country: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(65);
  const [isLoading, setIsLoading] = useState(false);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Form submitted successfully!');
      setFormData({ name: '', email: '', message: '', country: '' });
    }, 2000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      
      <Container>
        {/* Header */}
        <Section>
          <Flex justify="space-between" align="center">
            <Heading size="large">Emotion Examples</Heading>
            <BaseButton onClick={toggleTheme} outline>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </BaseButton>
          </Flex>
        </Section>

        {/* Navigation */}
        <Section>
          <Nav>
            <NavList>
              <NavItem>
                <NavLink href="#" active>Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink underline>About</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Services</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Contact</NavLink>
              </NavItem>
            </NavList>
          </Nav>
        </Section>

        {/* Basic Examples */}
        {activeTab === 'basic' && (
          <Section>
            <Heading size="medium">Basic Emotion Styling</Heading>
            
            {/* Typography */}
            <div css={css`
              margin-bottom: 30px;
            `}>
              <Heading size="medium">Typography</Heading>
              <Paragraph size="large">
                This is a large paragraph with custom styling.
              </Paragraph>
              <Paragraph highlight>
                This paragraph has highlight styling with a left border and background color.
              </Paragraph>
              <Paragraph size="small" opacity={0.8}>
                This is a small paragraph with reduced opacity.
              </Paragraph>
            </div>

            {/* Buttons */}
            <div css={css`
              margin-bottom: 30px;
            `}>
              <Heading size="medium">Buttons</Heading>
              <Flex wrap gap="small">
                <BaseButton variant="primary">Primary</BaseButton>
                <BaseButton variant="secondary">Secondary</BaseButton>
                <BaseButton variant="accent">Accent</BaseButton>
                <BaseButton outline>Outline</BaseButton>
                <BaseButton size="small">Small</BaseButton>
                <BaseButton size="large">Large</BaseButton>
                <IconButton>
                  <span>🚀</span>
                </IconButton>
              </Flex>
            </div>

            {/* Cards */}
            <div css={css`
              margin-bottom: 30px;
            `}>
              <Heading size="medium">Cards</Heading>
              <Grid columns={3} responsive>
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    This is a basic card component with header, content, and footer sections.
                  </CardContent>
                  <CardFooter>
                    <BaseButton size="small">Learn More</BaseButton>
                  </CardFooter>
                </Card>

                <Card elevated>
                  <CardHeader>
                    <CardTitle>Elevated Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    This card has elevated styling with enhanced shadow effects.
                  </CardContent>
                  <CardFooter>
                    <BaseButton variant="secondary" size="small">View Details</BaseButton>
                  </CardFooter>
                </Card>

                <Card compact>
                  <CardHeader>
                    <CardTitle>Compact Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    This card uses compact styling with reduced padding.
                  </CardContent>
                  <CardFooter>
                    <BaseButton variant="accent" size="small">Get Started</BaseButton>
                  </CardFooter>
                </Card>
              </Grid>
            </div>

            {/* Forms */}
            <div css={css`
              margin-bottom: 30px;
            `}>
              <Heading size="medium">Form Elements</Heading>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    fullWidth
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    fullWidth
                    error={!formData.email.includes('@') && formData.email !== ''}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    <option value="">Select a country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your message"
                    fullWidth
                  />
                </FormGroup>

                <Flex gap="medium">
                  <BaseButton type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="20px" /> : 'Submit'}
                  </BaseButton>
                  <BaseButton type="button" variant="secondary" onClick={() => setFormData({ name: '', email: '', message: '', country: '' })}>
                    Reset
                  </BaseButton>
                </Flex>
              </Form>
            </div>
          </Section>
        )}

        {/* Advanced Examples */}
        {activeTab === 'advanced' && (
          <Section>
            <Heading size="medium">Advanced Emotion Features</Heading>
            
            {/* Theme-aware component */}
            <div css={css`
              margin-bottom: 30px;
            `}>
              <Heading size="medium">Theme-Aware Component</Heading>
              <ThemedComponent />
            </div>

            {/* Custom hook usage */}
            <div css={css`
              margin-bottom: 30px;
            `}>
              <Heading size="medium">Custom Hook Usage</Heading>
              <div css={css`
                background-color: ${theme => theme.customColor};
                color: white;
                padding: ${theme => theme.customSpacing};
                border-radius: ${theme => theme.borderRadius};
                margin-bottom: 20px;
              `}>
                <h4>Component with Custom Theme</h4>
                <p>This component uses a custom hook to access extended theme values.</p>
              </div>
            </div>

            {/* Progress bars */}
            <div css={css`
              margin-bottom: 30px;
            `}>
              <Heading size="medium">Progress Bars</Heading>
              <Flex direction="column" gap="medium">
                <ProgressBarContainer>
                  <ProgressBarFill percentage={progress} variant="primary" />
                </ProgressBarContainer>
                <ProgressBarContainer height="12px">
                  <ProgressBarFill percentage={45} variant="secondary" striped />
                </ProgressBarContainer>
                <ProgressBarContainer height="16px">
                  <ProgressBarFill percentage={80} variant="accent" animated />
                </ProgressBarContainer>
              </Flex>
            </div>

            {/* Tooltips */}
            <div css={css`
              margin-bottom: 30px;
            `}>
              <Heading size="medium">Tooltips</Heading>
              <Flex wrap gap="large">
                <TooltipContainer>
                  <TooltipTrigger>
                    <BaseButton>Hover me (Top)</BaseButton>
                  </TooltipTrigger>
                  <TooltipContent position="top">This is a top tooltip!</TooltipContent>
                </TooltipContainer>

                <TooltipContainer>
                  <TooltipTrigger>
                    <BaseButton>Hover me (Bottom)</BaseButton>
                  </TooltipTrigger>
                  <TooltipContent position="bottom">This is a bottom tooltip!</TooltipContent>
                </TooltipContainer>

                <TooltipContainer>
                  <TooltipTrigger>
                    <BaseButton>Hover me (Left)</BaseButton>
                  </TooltipTrigger>
                  <TooltipContent position="left">This is a left tooltip!</TooltipContent>
                </TooltipContainer>

                <TooltipContainer>
                  <TooltipTrigger>
                    <BaseButton>Hover me (Right)</BaseButton>
                  </TooltipTrigger>
                  <TooltipContent position="right">This is a right tooltip!</TooltipContent>
                </TooltipContainer>
              </Flex>
            </div>

            {/* Loading states */}
            <div css={css`
              margin-bottom: 30px;
            `}>
              <Heading size="medium">Loading States</Heading>
              <Flex gap="large" center>
                <LoadingSpinner />
                <LoadingDots />
              </Flex>
            </div>
          </Section>
        )}

        {/* Modal */}
        <Section>
          <Heading size="medium">Modal Example</Heading>
          <BaseButton onClick={() => setIsModalOpen(true)}>Open Modal</BaseButton>
        </Section>
      </Container>

      {/* Modal */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Example Modal</ModalTitle>
              <ModalClose onClick={() => setIsModalOpen(false)}>×</ModalClose>
            </ModalHeader>
            <CardContent>
              <Paragraph>
                This is an example modal component with overlay, content, and close functionality.
                Click outside or press the × button to close.
              </Paragraph>
            </CardContent>
            <CardFooter>
              <BaseButton onClick={() => setIsModalOpen(false)}>Close</BaseButton>
            </CardFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </ThemeProvider>
  );
};

export default EmotionExamples;