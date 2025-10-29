import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const topics = [
    {
      id: 'fundamentals',
      title: 'React Fundamentals',
      description: 'Learn the basics of React including JSX, components, and hooks',
      path: '/fundamentals',
      level: 'Beginner'
    },
    {
      id: 'react-router',
      title: 'React Router',
      description: 'Navigation and routing in React applications',
      path: '/react-router',
      level: 'Beginner'
    },
    {
      id: 'redux',
      title: 'Redux Toolkit',
      description: 'State management for complex applications',
      path: '/redux',
      level: 'Intermediate'
    },
    {
      id: 'react-query',
      title: 'React Query',
      description: 'Async data fetching and caching solutions',
      path: '/react-query',
      level: 'Intermediate'
    },
    {
      id: 'forms',
      title: 'React Hook Form',
      description: 'Form handling and validation in React',
      path: '/forms',
      level: 'Intermediate'
    },
    {
      id: 'styling',
      title: 'Styling Solutions',
      description: 'CSS-in-JS and utility-first CSS frameworks',
      path: '/styling',
      level: 'Beginner'
    },
    {
      id: 'animations',
      title: 'Framer Motion',
      description: 'Declarative animations and gestures',
      path: '/animations',
      level: 'Advanced'
    },
    {
      id: 'alt-state',
      title: 'Alternative State Management',
      description: 'Lightweight state management alternatives',
      path: '/alt-state',
      level: 'Intermediate'
    },
    {
      id: 'testing',
      title: 'Testing React Applications',
      description: 'Testing strategies and best practices',
      path: '/testing',
      level: 'Intermediate'
    },
    {
      id: 'ui-libraries',
      title: 'UI Component Libraries',
      description: 'MUI, Chakra UI, and Ant Design examples',
      path: '/ui-libraries',
      level: 'Beginner'
    }
  ]

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return '#48bb78'
      case 'Intermediate':
        return '#ed8936'
      case 'Advanced':
        return '#e53e3e'
      default:
        return '#718096'
    }
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>React Learning Examples</h1>
        <p>Comprehensive examples and exercises to master React and its ecosystem</p>
      </div>

      <div className="topics-grid">
        {topics.map(topic => (
          <div key={topic.id} className="topic-card">
            <div className="topic-header">
              <h3>{topic.title}</h3>
              <span 
                className="level-badge" 
                style={{ backgroundColor: getLevelColor(topic.level) }}
              >
                {topic.level}
              </span>
            </div>
            <p>{topic.description}</p>
            <Link to={topic.path} className="topic-link">
              Explore →
            </Link>
          </div>
        ))}
      </div>

      <div className="learning-path">
        <h2>Suggested Learning Path</h2>
        <div className="path-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Beginner</h3>
            <p>Start with React fundamentals, then move to React Router and basic styling</p>
          </div>
        </div>
        <div className="path-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Intermediate</h3>
            <p>Learn state management with Redux Toolkit, data fetching with React Query, and form handling</p>
          </div>
        </div>
        <div className="path-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Advanced</h3>
            <p>Master animations, testing, and advanced state management patterns</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home