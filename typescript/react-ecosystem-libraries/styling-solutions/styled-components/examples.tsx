// Styled Components Examples with TypeScript
// This file demonstrates various Styled Components concepts with comprehensive TypeScript typing

import React, { useState, useEffect } from 'react';
import styled, { 
  createGlobalStyle, 
  ThemeProvider, 
  keyframes, 
  css, 
  withTheme,
  StyleSheetManager
} from 'styled-components';

// ===== TYPE DEFINITIONS =====

// Interface for theme
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  borderRadius: string;
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

// Interface for button props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  outline?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

// Interface for card props
interface CardProps {
  elevated?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
}

// Interface for input props
interface InputProps {
  error?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
}

// Interface for form props
interface FormProps {
  fullWidth?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

// Interface for grid props
interface GridProps {
  columns?: number;
  gap?: string;
  responsive?: boolean;
}

// Interface for flex props
interface FlexProps {
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  direction?: 'row' | 'column';
  wrap?: 'nowrap' | 'wrap';
  gap?: string;
  center?: boolean;
  responsive?: boolean;
}

// Interface for navigation props
interface NavProps {
  sticky?: boolean;
}

// Interface for modal props
interface ModalProps {
  size?: 'small' | 'medium' | 'large';
  isOpen: boolean;
  onClose: () => void;
}

// Interface for progress bar props
interface ProgressBarProps {
  percentage: number;
  variant?: 'primary' | 'secondary' | 'accent';
  height?: string;
  animated?: boolean;
  striped?: boolean;
}

// Interface for tooltip props
interface TooltipProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
  text: string;
}

// ===== THEME DEFINITIONS =====

// Light theme with proper typing
const lightTheme: Theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    accent: '#e74c3c',
    background: '#ffffff',
    text: '#333333',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px'
  },
  borderRadius: '8px',
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};

// Dark theme with proper typing
const darkTheme: Theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    accent: '#e74c3c',
    background: '#1a1a1a',
    text: '#ffffff',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px'
  },
  borderRadius: '8px',
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};

// ===== GLOBAL STYLES =====

// Global styles with theme typing
const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
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
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

// ===== KEYFRAME ANIMATIONS =====

// Keyframe animations with proper typing
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

// ===== CSS HELPER =====

// CSS helper for shared styles with proper typing
const buttonStyles = css<ButtonProps>`
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

  ${props => props.outline && css`
    background-color: transparent;
    border: 2px solid ${props.theme.colors.primary};
    color: ${props.theme.colors.primary};

    &:hover {
      background-color: ${props.theme.colors.primary};
      color: white;
    }
  `}

  ${props => props.size === 'small' && css`
    padding: ${props.theme.spacing.small} ${props.theme.spacing.medium};
    font-size: 14px;
  `}

  ${props => props.size === 'large' && css`
    padding: ${props.theme.spacing.large} ${props.theme.spacing.xlarge};
    font-size: 18px;
  `}

  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

// ===== BASIC STYLED COMPONENTS =====

// Container component with theme typing
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.large};
`;

// Section component with theme typing
const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xlarge};
  padding: ${props => props.theme.spacing.large};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Heading component with variant typing
const Heading = styled.h1<{ size?: 'small' | 'medium' | 'large'; align?: 'left' | 'center' | 'right' }>`
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '1.5rem';
      case 'medium': return '2rem';
      case 'large': return '3rem';
      default: return '2.5rem';
    }
  }};
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.medium};
  text-align: ${props => props.align || 'left'};
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.8rem;
  }
`;

// Paragraph component with variant typing
const Paragraph = styled.p<{ size?: 'small' | 'large'; opacity?: number; highlight?: boolean }>`
  font-size: ${props => props.size === 'small' ? '14px' : props.size === 'large' ? '18px' : '16px'};
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.medium};
  opacity: ${props => props.opacity || 1};

  ${props => props.highlight && css`
    background-color: ${props.theme.colors.primary}20;
    padding: ${props => props.theme.spacing.small};
    border-left: 4px solid ${props.theme.colors.primary};
  `}
`;

// ===== BUTTON COMPONENTS =====

// Base button component with props typing
const BaseButton = styled.button<ButtonProps>`
  ${buttonStyles}
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.secondary;
      case 'accent': return props.theme.colors.accent;
      default: return props.theme.colors.primary;
    }
  }};
  color: white;
`;

// Icon button component
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

// ===== CARD COMPONENTS =====

// Card component with props typing
const Card = styled.div<CardProps>`
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.large};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.text}20;

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

  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

// Card header component
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.medium};
  padding-bottom: ${props => props.theme.spacing.medium};
  border-bottom: 1px solid ${props => props.theme.colors.text}20;
`;

// Card title component
const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

// Card content component
const CardContent = styled.div`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
`;

// Card footer component
const CardFooter = styled.div<{ align?: 'left' | 'center' | 'right' }>`
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  margin-top: ${props => props.theme.spacing.medium};
  padding-top: ${props => props.theme.spacing.medium};
  border-top: 1px solid ${props => props.theme.colors.text}20;
`;

// ===== FORM COMPONENTS =====

// Form component with props typing
const Form = styled.form<FormProps>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};

  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

// Form group component
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.small};
`;

// Label component
const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.small};
  display: block;
`;

// Input component with props typing
const Input = styled.input<InputProps>`
  padding: ${props => props.theme.spacing.medium};
  border: 2px solid ${props => props.theme.colors.text}20;
  border-radius: ${props => props.theme.borderRadius};
  font-size: 16px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}30;
  }

  ${props => props.error && css`
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.accent}30;
  `}

  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

// Textarea component extending Input
const Textarea = styled(Input).attrs({ as: 'textarea' })`
  resize: vertical;
  min-height: 120px;
`;

// Select component
const Select = styled.select`
  padding: ${props => props.theme.spacing.medium};
  border: 2px solid ${props => props.theme.colors.text}20;
  border-radius: ${props => props.theme.borderRadius};
  font-size: 16px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}30;
  }
`;

// ===== LAYOUT COMPONENTS =====

// Grid component with props typing
const Grid = styled.div<GridProps>`
  display: grid;
  gap: ${props => props.gap || props.theme.spacing.medium};
  grid-template-columns: ${props => props.columns ? `repeat(${props.columns}, 1fr)` : 'repeat(auto-fit, minmax(300px, 1fr))'};

  ${props => props.responsive && css`
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      grid-template-columns: 1fr;
    }
  `}
`;

// Flex component with props typing
const Flex = styled.div<FlexProps>`
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

// ===== NAVIGATION COMPONENTS =====

// Navigation component with props typing
const Nav = styled.nav<NavProps>`
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.medium} 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: ${props => props.sticky ? 'sticky' : 'relative'};
  top: 0;
  z-index: 1000;
`;

// Navigation list component
const NavList = styled.ul`
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
`;

// Navigation item component
const NavItem = styled.li`
  margin: 0 ${props => props.theme.spacing.small};
`;

// Navigation link component
const NavLink = styled.a<{ active?: boolean; underline?: boolean }>`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background-color: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
  }

  ${props => props.active && css`
    background-color: ${props => props.theme.colors.primary};
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
      background-color: ${props => props.theme.colors.primary};
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 80%;
    }
  `}
`;

// ===== MODAL COMPONENTS =====

// Modal overlay component
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

// Modal content component with props typing
const ModalContent = styled.div<ModalProps>`
  background-color: ${props => props.theme.colors.background};
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

// Modal header component
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.large};
`;

// Modal title component
const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
`;

// Modal close button component
const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.small};
  border-radius: ${props => props.theme.borderRadius};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.text}20;
  }
`;

// ===== LOADING COMPONENTS =====

// Loading spinner component
const LoadingSpinner = styled.div<{ size?: string }>`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 4px solid ${props => props.theme.colors.text}20;
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;

// Loading dots component
const LoadingDots = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.small};

  & > div {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.theme.colors.primary};
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

// ===== UTILITY COMPONENTS =====

// Badge component with variant typing
const Badge = styled.span<{ variant?: 'primary' | 'secondary' | 'accent' | 'outline'; rounded?: boolean }>`
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
          background-color: ${props.theme.colors.primary};
          color: white;
        `;
      case 'secondary':
        return css`
          background-color: ${props.theme.colors.secondary};
          color: white;
        `;
      case 'accent':
        return css`
          background-color: ${props.theme.colors.accent};
          color: white;
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border: 1px solid ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
        `;
      default:
        return css`
          background-color: ${props.theme.colors.text}20;
          color: ${props.theme.colors.text};
        `;
    }
  }}

  ${props => props.rounded && css`
    border-radius: 20px;
  `}
`;

// Progress bar container component
const ProgressBarContainer = styled.div<{ height?: string }>`
  width: 100%;
  height: ${props => props.height || '8px'};
  background-color: ${props => props.theme.colors.text}20;
  border-radius: ${props => props.height ? '4px' : props.theme.borderRadius};
  overflow: hidden;
`;

// Progress bar fill component with props typing
const ProgressBarFill = styled.div<ProgressBarProps>`
  height: 100%;
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.secondary;
      case 'accent': return props.theme.colors.accent;
      default: return props.theme.colors.primary;
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
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
    animation: ${slideIn} 1s linear infinite;
  `}
`;

// Tooltip container component
const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// Tooltip content component with props typing
const TooltipContent = styled.div<TooltipProps>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.colors.text};
  color: ${props => props.theme.colors.background};
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
    margin-bottom: 0;
    transform: translateY(-50%);
    margin-right: ${props => props.theme.spacing.small};
  `}

  ${props => props.position === 'right' && css`
    left: 100%;
    top: 50%;
    bottom: auto;
    margin-bottom: 0;
    transform: translateY(-50%);
    margin-left: ${props => props.theme.spacing.small};
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
      border-top-color: ${props => props.theme.colors.text};
    }
  `}

  ${props => props.position === 'bottom' && css`
    &::after {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-color: ${props => props.theme.colors.text};
    }
  `}

  ${props => props.position === 'left' && css`
    &::after {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-left-color: ${props => props.theme.colors.text};
    }
  `}

  ${props => props.position === 'right' && css`
    &::after {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-right-color: ${props => props.theme.colors.text};
    }
  `}
`;

// Tooltip trigger component
const TooltipTrigger = styled.div`
  &:hover + ${TooltipContent} {
    opacity: 1;
    visibility: visible;
  }
`;

// ===== MAIN APP COMPONENT =====

/**
 * Main component that demonstrates all Styled Components TypeScript examples
 */
const StyledComponentsExamples: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    country: ''
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(65);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      setProgress((prev: number) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StyleSheetManager>
        <GlobalStyle />
        
        <Container>
          {/* Header */}
          <Section>
            <Flex justify="space-between" align="center">
              <Heading size="large">Styled Components Examples</Heading>
              <BaseButton onClick={toggleTheme} outline>
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </BaseButton>
            </Flex>
          </Section>

          {/* Navigation */}
          <Section>
            <Nav sticky>
              <NavList>
                <NavItem>
                  <NavLink href="#" active>Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#" underline>About</NavLink>
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

          {/* Typography */}
          <Section>
            <Heading size="medium">Typography Examples</Heading>
            <Paragraph size="large">
              This is a large paragraph with custom styling.
            </Paragraph>
            <Paragraph highlight>
              This paragraph has highlight styling with a left border and background color.
            </Paragraph>
            <Paragraph size="small" opacity={0.8}>
              This is a small paragraph with reduced opacity.
            </Paragraph>
          </Section>

          {/* Buttons */}
          <Section>
            <Heading size="medium">Button Examples</Heading>
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
          </Section>

          {/* Cards */}
          <Section>
            <Heading size="medium">Card Examples</Heading>
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
          </Section>

          {/* Forms */}
          <Section>
            <Heading size="medium">Form Examples</Heading>
            <Form onSubmit={handleSubmit} fullWidth>
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
                  error={!formData.email.includes('@') && formData.email !== ''}
                  fullWidth
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
          </Section>

          {/* Badges */}
          <Section>
            <Heading size="medium">Badge Examples</Heading>
            <Flex wrap gap="small">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge rounded>Rounded</Badge>
            </Flex>
          </Section>

          {/* Progress Bar */}
          <Section>
            <Heading size="medium">Progress Bar Examples</Heading>
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
          </Section>

          {/* Tooltips */}
          <Section>
            <Heading size="medium">Tooltip Examples</Heading>
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
          </Section>

          {/* Loading States */}
          <Section>
            <Heading size="medium">Loading Examples</Heading>
            <Flex gap="large" center>
              <LoadingSpinner />
              <LoadingDots>
                <div></div>
                <div></div>
                <div></div>
              </LoadingDots>
            </Flex>
          </Section>

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
                  Click outside or press × button to close.
                </Paragraph>
              </CardContent>
              <CardFooter>
                <BaseButton onClick={() => setIsModalOpen(false)}>Close</BaseButton>
              </CardFooter>
            </ModalContent>
          </ModalOverlay>
        )}

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: theme.colors.background, 
          borderRadius: theme.borderRadius
        }}>
          <Heading size="medium">Styled Components TypeScript Benefits</Heading>
          <ul>
            <li><strong>Type Safety:</strong> Catch styling-related errors at compile time</li>
            <li><strong>Theme Typing:</strong> Type-safe theme objects and props</li>
            <li><strong>Component Typing:</strong> Properly typed styled components</li>
            <li><strong>CSS Prop Typing:</strong> Type-safe CSS properties</li>
            <li><strong>Attribute Typing:</strong> Type-safe HTML attributes</li>
            <li><strong>IntelliSense:</strong> Better autocompletion for styles</li>
          </ul>
          
          <Heading size="small">Key TypeScript Concepts Demonstrated:</Heading>
          <ul>
            <li><strong>Interface Definitions:</strong> Defining theme and props types</li>
            <li><strong>Styled Component Types:</strong> Creating typed styled components</li>
            <li><strong>Generic Components:</strong> Building reusable typed components</li>
            <li><strong>CSS Prop Typing:</strong> Type-safe CSS properties</li>
            <li><strong>Attribute Typing:</strong> Type-safe HTML attributes</li>
            <li><strong>Theme Provider:</strong> Type-safe theme context</li>
            <li><strong>Animation Typing:</strong> Type-safe animations</li>
          </ul>
        </div>
      </StyleSheetManager>
    </ThemeProvider>
  );
};

export default StyledComponentsExamples;