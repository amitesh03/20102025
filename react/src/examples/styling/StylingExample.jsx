import React, { useState } from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { css } from '@emotion/react'
import './StylingExample.css'

// Styled Components Examples

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
  }
`

// Theme
const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    danger: '#ef4444',
    dark: '#1f2937',
    light: '#f9fafb',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
}

// Basic Styled Components
const StyledButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.secondary;
      case 'accent': return props.theme.colors.accent;
      case 'danger': return props.theme.colors.danger;
      default: return props.theme.colors.primary;
    }
  }};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${props => props.size === 'large' && css`
    padding: ${props.theme.spacing.md} ${props.theme.spacing.lg};
    font-size: 1.1rem;
  `}
  
  ${props => props.size === 'small' && css`
    padding: ${props.theme.spacing.xs} ${props.theme.spacing.sm};
    font-size: 0.875rem;
  `}
`

const StyledCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  ${props => props.elevated && css`
    box-shadow: ${props.theme.shadows.lg};
  `}
`

const StyledHeading = styled.h2`
  color: ${props => props.theme.colors.dark};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '1.25rem';
      case 'medium': return '1.5rem';
      case 'large': return '2rem';
      default: return '1.5rem';
    }
  }};
  
  ${props => props.centered && css`
    text-align: center;
  `}
`

// Styled Components with Props
const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid #d1d5db;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  ${props => props.error && css`
    border-color: ${props.theme.colors.danger};
    
    &:focus {
      border-color: ${props.theme.colors.danger};
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

// Emotion CSS-in-JS Examples
const emotionButton = css`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`

const emotionCard = css`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`

// Tailwind CSS Examples
const TailwindButton = ({ variant = 'primary', size = 'medium', children, ...props }) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    accent: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500',
  }
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  )
}

const TailwindCard = ({ children, elevated = false, ...props }) => {
  const baseClasses = 'bg-white rounded-xl p-6 mb-6 transition-all duration-300'
  const elevatedClasses = elevated ? 'shadow-xl hover:-translate-y-2' : 'shadow-md hover:-translate-y-1'
  
  return (
    <div className={`${baseClasses} ${elevatedClasses}`} {...props}>
      {children}
    </div>
  )
}

// Example Components
const StyledComponentsExample = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email) {
      setError('Please fill in all fields')
      return
    }
    setError('')
    alert(`Submitted: ${name}, ${email}`)
  }
  
  return (
    <div className="styled-example">
      <StyledHeading size="large" centered>Styled Components</StyledHeading>
      
      <StyledCard>
        <StyledHeading size="medium">Button Variants</StyledHeading>
        <div className="button-group">
          <StyledButton variant="primary">Primary</StyledButton>
          <StyledButton variant="secondary">Secondary</StyledButton>
          <StyledButton variant="accent">Accent</StyledButton>
          <StyledButton variant="danger">Danger</StyledButton>
        </div>
      </StyledCard>
      
      <StyledCard>
        <StyledHeading size="medium">Button Sizes</StyledHeading>
        <div className="button-group">
          <StyledButton size="small">Small</StyledButton>
          <StyledButton size="medium">Medium</StyledButton>
          <StyledButton size="large">Large</StyledButton>
        </div>
      </StyledCard>
      
      <StyledCard elevated>
        <StyledHeading size="medium">Form Example</StyledHeading>
        <StyledForm onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <StyledInput 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label>Email:</label>
            <StyledInput 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              error={error && !email}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <StyledButton type="submit">Submit</StyledButton>
        </StyledForm>
      </StyledCard>
    </div>
  )
}

const EmotionExample = () => {
  const [count, setCount] = useState(0)
  
  return (
    <div css={emotionCard}>
      <h2>Emotion CSS-in-JS</h2>
      <p>This card is styled using Emotion's css prop.</p>
      
      <div css={emotionCard}>
        <h3>Counter Example</h3>
        <p>Count: {count}</p>
        <button 
          css={emotionButton}
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
      </div>
      
      <div css={emotionCard}>
        <h3>Dynamic Styling</h3>
        <p 
          css={css`
            color: ${count > 5 ? '#10b981' : '#ef4444'};
            font-weight: ${count > 5 ? 'bold' : 'normal'};
          `}
        >
          {count > 5 ? 'Count is high!' : 'Count is low'}
        </p>
      </div>
    </div>
  )
}

const TailwindExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Form submitted: ${JSON.stringify(formData, null, 2)}`)
  }
  
  return (
    <div className="tailwind-example">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tailwind CSS</h2>
      
      <TailwindCard>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Button Variants</h3>
        <div className="flex flex-wrap gap-3">
          <TailwindButton variant="primary">Primary</TailwindButton>
          <TailwindButton variant="secondary">Secondary</TailwindButton>
          <TailwindButton variant="accent">Accent</TailwindButton>
          <TailwindButton variant="danger">Danger</TailwindButton>
          <TailwindButton variant="outline">Outline</TailwindButton>
        </div>
      </TailwindCard>
      
      <TailwindCard>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Button Sizes</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <TailwindButton size="small">Small</TailwindButton>
          <TailwindButton size="medium">Medium</TailwindButton>
          <TailwindButton size="large">Large</TailwindButton>
        </div>
      </TailwindCard>
      
      <TailwindCard elevated>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Form Example</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your message"
            />
          </div>
          <TailwindButton type="submit">Submit</TailwindButton>
        </form>
      </TailwindCard>
      
      <TailwindCard>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Responsive Grid</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <h4 className="font-semibold text-blue-800">Card 1</h4>
            <p className="text-blue-600">Responsive grid item</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <h4 className="font-semibold text-green-800">Card 2</h4>
            <p className="text-green-600">Responsive grid item</p>
          </div>
          <div className="bg-amber-100 p-4 rounded-lg text-center">
            <h4 className="font-semibold text-amber-800">Card 3</h4>
            <p className="text-amber-600">Responsive grid item</p>
          </div>
        </div>
      </TailwindCard>
    </div>
  )
}

// Main Component
const StylingExample = () => {
  const [activeTab, setActiveTab] = useState('styled-components')
  
  return (
    <div className="styling-example">
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <div className="example-container">
          <div className="example-header">
            <h2>Styling Solutions in React</h2>
            <p>Learn different approaches to styling React components</p>
          </div>
          
          <div className="example-section">
            <h3>Styling Approaches</h3>
            <div className="code-block">
              <pre>{`// Styled Components
const Button = styled.button\`
  background: \${props => props.theme.colors.primary};
  color: white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
\`

// Emotion CSS-in-JS
const buttonStyle = css\`
  background: #3b82f6;
  color: white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
\`

// Tailwind CSS
<button className="bg-blue-500 text-white rounded-lg px-4 py-2">
  Button
</button>`}</pre>
            </div>
          </div>
          
          <div className="example-section">
            <h3>Interactive Examples</h3>
            <div className="tab-navigation">
              <button 
                className={activeTab === 'styled-components' ? 'active' : ''}
                onClick={() => setActiveTab('styled-components')}
              >
                Styled Components
              </button>
              <button 
                className={activeTab === 'emotion' ? 'active' : ''}
                onClick={() => setActiveTab('emotion')}
              >
                Emotion
              </button>
              <button 
                className={activeTab === 'tailwind' ? 'active' : ''}
                onClick={() => setActiveTab('tailwind')}
              >
                Tailwind CSS
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'styled-components' && <StyledComponentsExample />}
              {activeTab === 'emotion' && <EmotionExample />}
              {activeTab === 'tailwind' && <TailwindExample />}
            </div>
          </div>
          
          <div className="exercise">
            <h4>Exercise:</h4>
            <p>Create a component library with multiple styling approaches:</p>
            <ul>
              <li>Build a set of reusable components (Button, Card, Input, Modal)</li>
              <li>Style them using Styled Components with theme support</li>
              <li>Create the same components using Tailwind CSS</li>
              <li>Implement dark mode support</li>
              <li>Add responsive design patterns</li>
              <li>Create a design system with consistent spacing, colors, and typography</li>
            </ul>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}

export default StylingExample